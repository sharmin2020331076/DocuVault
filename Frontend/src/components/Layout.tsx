import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shield, LogOut, Bell, Check, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] }),
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/20 p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">DocuVault</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/vault" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Shield size={20} />
            <span>Vault</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="h-20 border-b border-white/10 flex items-center justify-end px-8 sticky top-0 bg-[#0b1120]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative z-50">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-lg transition-all ${isNotificationsOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0b1120]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[90] bg-black/5" onMouseDown={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                      className="absolute right-0 mt-3 w-80 glass-card rounded-2xl overflow-hidden shadow-2xl border-white/10 origin-top-right z-[100]"
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => markAllReadMutation.mutate()}
                            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications?.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                            <Bell className="mx-auto mb-2 opacity-20" size={32} />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications?.map((notification: any) => (
                            <div 
                              key={notification.id}
                              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors relative group ${!notification.isRead ? 'bg-blue-500/5' : ''}`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${notification.type === 'in-app' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                  {notification.type === 'in-app' ? <Shield size={16} /> : <Calendar size={16} />}
                                </div>
                                <div className="space-y-1">
                                  <p className={`text-sm leading-snug ${!notification.isRead ? 'text-white font-medium' : 'text-slate-400'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <button 
                                  onClick={() => markReadMutation.mutate(notification.id)}
                                  className="absolute top-4 right-4 p-1 hover:bg-blue-500/20 rounded text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Mark as read"
                                >
                                  <Check size={14} />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative z-50">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-[#0b1120]' : ''}`}
              >
                {user?.name[0]}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-[90] bg-black/5" onMouseDown={() => setIsProfileOpen(false)} />
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                      className="absolute right-0 mt-3 w-64 glass-card rounded-2xl overflow-hidden shadow-2xl border-white/10 origin-top-right z-[100]"
                    >
                      <div className="p-6 text-center space-y-3 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-2xl mx-auto shadow-xl ring-4 ring-white/10">
                          {user?.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user?.name}</h3>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button 
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                        >
                          <LogOut size={18} />
                          <span>Logout Session</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
