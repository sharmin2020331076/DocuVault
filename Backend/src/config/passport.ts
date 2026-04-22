import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from '../db';
import { users, categories } from '../db/schema';
import { eq } from 'drizzle-orm';

const seedDefaultCategories = async (userId: string) => {
  const defaultCategories = [
    { name: 'Identity', color: '#3b82f6' },
    { name: 'Travel', color: '#10b981' },
    { name: 'Finance', color: '#f59e0b' },
    { name: 'Health', color: '#ef4444' },
  ];
  await Promise.all(
    defaultCategories.map(cat => 
      db.insert(categories).values({
        userId,
        name: cat.name,
        color: cat.color,
      })
    )
  );
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await db.query.users.findFirst({
        where: eq(users.googleId, profile.id)
      });

      if (!user) {
        const email = profile.emails?.[0].value;
        if (email) {
          user = await db.query.users.findFirst({
            where: eq(users.email, email)
          });
        }

        if (user) {
          await db.update(users).set({ googleId: profile.id }).where(eq(users.id, user.id));
        } else {
          [user] = await db.insert(users).values({
            name: profile.displayName,
            email: email || `${profile.id}@google.com`,
            googleId: profile.id,
          }).returning();
          await seedDefaultCategories(user.id);
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await db.query.users.findFirst({
        where: eq(users.githubId, profile.id)
      });

      if (!user) {
        const email = profile.emails?.[0]?.value || profile._json.email;
        if (email) {
          user = await db.query.users.findFirst({
            where: eq(users.email, email)
          });
        }

        if (user) {
          await db.update(users).set({ githubId: profile.id }).where(eq(users.id, user.id));
        } else {
          [user] = await db.insert(users).values({
            name: profile.displayName || profile.username,
            email: email || `${profile.id}@github.com`,
            githubId: profile.id,
          }).returning();
          await seedDefaultCategories(user.id);
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
