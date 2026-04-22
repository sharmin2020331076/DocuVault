import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Shield, Clock, AlertTriangle, FileText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { UploadModal } from '../components/UploadModal';
import { ManageCategoriesModal } from '../components/ManageCategoriesModal';
import { useState } from 'react';

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 shadow-blue-500/20',
    green: 'bg-emerald-500 shadow-emerald-500/20',
    yellow: 'bg-amber-500 shadow-amber-500/20',
    red: 'bg-rose-500 shadow-rose-500/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 lg:p-6 rounded-2xl flex items-center gap-4 lg:gap-5 transition-all"
    >
      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg ${colorMap[color] || colorMap.blue}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[var(--text-sub)] text-xs lg:text-sm font-medium mb-0.5 lg:mb-1">{title}</p>
        <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text-main)] tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) return <div className="p-8 text-[var(--text-sub)]">Loading Dashboard...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-main)]">Life Admin Overview</h1>
        <p className="text-sm lg:text-base text-[var(--text-sub)]">Welcome back to your secure vault.</p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Documents" value={stats?.total || 0} icon={FileText} color="blue" />
        <StatCard title="Valid" value={(stats?.total || 0) - (stats?.expiring || 0) - (stats?.expired || 0)} icon={Shield} color="green" />
        <StatCard title="Expiring Soon" value={stats?.expiring || 0} icon={Clock} color="yellow" />
        <StatCard title="Expired" value={stats?.expired || 0} icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">Recent Notifications</h2>
          <div className="space-y-4">
            {stats?.notifications?.length > 0 ? (
              stats.notifications.map((n: any) => (
                <div key={n.id} className="flex gap-4 p-3 rounded-lg bg-[var(--input-bg)] items-start">
                  <div className={`p-2 rounded-full ${n.type === 'email' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {n.type === 'email' ? <Bell size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-main)]">{n.message}</p>
                    <span className="text-xs text-[var(--text-muted)]">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[var(--text-muted)] text-center py-8">No new alerts. Your vault is secure.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
               Upload New Document
            </button>
            <button 
              onClick={() => setIsManageCategoriesOpen(true)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-sub)] hover:bg-[var(--input-hover)] py-2 rounded-lg text-sm font-medium transition-all text-[var(--text-main)]"
            >
              Manage Categories
            </button>
          </div>
        </div>
      </div>

      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
      {isManageCategoriesOpen && <ManageCategoriesModal onClose={() => setIsManageCategoriesOpen(false)} />}
    </div>
  );
};

export default Dashboard;
