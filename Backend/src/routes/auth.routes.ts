import { Router } from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import { signup, login, deleteAccount } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.delete('/account', authenticateToken as any, deleteAccount as any);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req: any, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    const userStr = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${userStr}`);
  }
);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req: any, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    const userStr = encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${userStr}`);
  }
);

export default router;
