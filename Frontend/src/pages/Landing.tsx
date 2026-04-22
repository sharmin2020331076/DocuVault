import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Bell, LayoutDashboard, ArrowRight, CheckCircle2, Globe, Zap, Mail, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: "E2E Encryption",
      desc: "Your data is encrypted before it ever leaves your device. Only you hold the keys.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Smart Alerts",
      desc: "Never miss an expiration date again. Intelligent notifications for your vital docs.",
      color: "purple"
    },
    {
      icon: Globe,
      title: "Global Vault",
      desc: "Access your life admin from anywhere in the world, on any device, securely.",
      color: "emerald"
    },
    {
      icon: Lock,
      title: "Legacy Protection",
      desc: "Securely share access with loved ones so they're prepared for the unexpected.",
      color: "amber"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-x-hidden selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-24 flex flex-col items-center text-center overflow-hidden">
        {/* Optimized Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-blue-600/10 blur-[80px] lg:blur-[120px] rounded-full" />
          <div className="absolute top-[10%] right-[10%] w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] bg-purple-600/10 blur-[80px] lg:blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-6 lg:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen Security for Life Admin
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 lg:mb-8 tracking-tight px-2">
            The Ultimate <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 bg-clip-text text-transparent">Life Admin</span> <br className="hidden sm:block" /> 
            Vault for Your Future.
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-sub)] mb-8 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            DocuVault is the world's most secure platform for organizing your life's vital documents, 
            tracking assets, and ensuring your legacy is protected.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            <NavLink 
              to="/login"
              className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-base lg:text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              Start Your Vault
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <button className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 glass border border-white/10 rounded-2xl font-bold text-base lg:text-lg hover:bg-white/5 transition-all">
              How it works
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview Mockup - Optimized for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 lg:mt-24 relative z-10 w-full max-w-5xl mx-auto px-2 sm:px-6"
        >
          <div className="aspect-[4/3] sm:aspect-[16/9] glass-card rounded-2xl lg:rounded-[2rem] border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 opacity-30" />
            
            {/* Browser Header */}
            <div className="absolute top-0 left-0 w-full h-8 sm:h-12 border-b border-white/10 flex items-center px-4 sm:px-6 gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-md z-20">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/40" />
            </div>

            {/* Dashboard Image */}
            <div className="absolute inset-0 pt-8 sm:pt-12 overflow-hidden bg-[#0a0c10]">
              <img 
                src="/image.png" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover object-top opacity-50 group-hover:opacity-70 transition-opacity duration-1000"
              />
            </div>

            {/* Centered Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="px-4 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl z-30"
               >
                 <p className="font-bold flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
                   <Shield className="text-blue-400" size={16} />
                   100% End-to-End Encrypted
                 </p>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Responsive Grid */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto text-center mb-12 lg:mb-20"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 px-4">Built for Total Peace of Mind</h2>
          <p className="text-[var(--text-sub)] text-sm lg:text-base max-w-2xl mx-auto px-6">
            We've combined bank-level security with a premium user experience to make 
            life admin something you actually enjoy.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-white/5 hover:border-blue-500/20 transition-all group"
            >
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg bg-${feature.color}-500/10 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-4">{feature.title}</h3>
              <p className="text-[var(--text-sub)] leading-relaxed text-xs lg:text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Section - Horizontal Scroll on Mobile */}
      <section className="py-16 lg:py-24 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-[10px] lg:text-xs uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] mb-8 lg:mb-12">Trusted by 50,000+ Modern Families</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-30 grayscale overflow-hidden">
            <div className="text-xl lg:text-2xl font-bold italic tracking-tighter">SECURE_DASH</div>
            <div className="text-xl lg:text-2xl font-bold italic tracking-tighter">VAULT_FLOW</div>
            <div className="text-xl lg:text-2xl font-bold italic tracking-tighter">LIFE_ADMIN_CO</div>
            <div className="text-xl lg:text-2xl font-bold italic tracking-tighter">GUARDIAN_APP</div>
          </div>
        </div>
      </section>

      {/* Footer - Optimized for Mobile */}
      <footer className="py-12 lg:py-20 px-4 sm:px-6 lg:px-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold">DocuVault</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-xs lg:text-sm text-[var(--text-sub)] font-medium">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Security</a>
          </div>

          <p className="text-[10px] lg:text-sm text-[var(--text-muted)] text-center">
            © 2026 DocuVault Inc. Built for peace of mind.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
