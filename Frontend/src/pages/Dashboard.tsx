import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Shield, Clock, AlertTriangle, FileText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { UploadModal } from '../components/UploadModal';
import { ManageCategoriesModal } from '../components/ManageCategoriesModal';
import { useState } from 'react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 rounded-2xl flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </motion.div>
);

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

  if (isLoading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Life Admin Overview</h1>
        <p className="text-slate-400">Welcome back to your secure vault.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Documents" value={stats?.total || 0} icon={FileText} color="blue" />
        <StatCard title="Valid" value={(stats?.total || 0) - (stats?.expiring || 0) - (stats?.expired || 0)} icon={Shield} color="green" />
        <StatCard title="Expiring Soon" value={stats?.expiring || 0} icon={Clock} color="yellow" />
        <StatCard title="Expired" value={stats?.expired || 0} icon={AlertTriangle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {stats?.notifications?.length > 0 ? (
              stats.notifications.map((n: any) => (
                <div key={n.id} className="flex gap-4 p-3 rounded-lg bg-white/5 items-start">
                  <div className={`p-2 rounded-full ${n.type === 'email' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {n.type === 'email' ? <Bell size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <span className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No new alerts. Your vault is secure.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="w-full glass-button flex items-center justify-center gap-2"
            >
               Upload New Document
            </button>
            <button 
              onClick={() => setIsManageCategoriesOpen(true)}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-2 rounded-lg text-sm font-medium transition-all"
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
