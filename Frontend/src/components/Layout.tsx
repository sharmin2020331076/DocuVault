import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, LogOut, Bell, Check, Calendar, Sun, Moon, Search, User as UserIcon, Trash2, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Toaster } from 'react-hot-toast';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

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
      <Toaster position="top-right" />
      {/* Sidebar */}
      {!isAuthPage && (
        <>
          <aside className={`w-64 glass border-r border-white/20 p-6 flex flex-col fixed h-full z-[60] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Shield className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight">DocuVault</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-[var(--text-muted)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <NavLink 
                to="/dashboard" 
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-[var(--text-sub)] hover:bg-[var(--input-bg)] hover:text-[var(--text-main)]'}`
                }
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink 
                to="/vault" 
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-[var(--text-sub)] hover:bg-[var(--input-bg)] hover:text-[var(--text-main)]'}`
                }
              >
                <Shield size={20} />
                <span>Vault</span>
              </NavLink>
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--border-sub)] space-y-4">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-[var(--text-main)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => {
                  logout();
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
          
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Main Content */}
      <main className={`${isAuthPage ? 'ml-0' : 'md:ml-64'} flex-1 flex flex-col min-h-screen transition-all duration-300`}>
        <header className="h-16 lg:h-20 border-b border-[var(--border-sub)] flex items-center justify-between px-4 lg:px-8 sticky top-0 bg-[var(--bg-secondary)] backdrop-blur-xl z-40">
          {/* Left Section: Mobile Menu or Breadcrumb */}
          <div className="flex items-center gap-4 min-w-[140px] flex-1">
            {!isAuthPage && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-white/5 rounded-lg transition-all"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="hidden sm:flex items-center">
              {isAuthPage ? (
                <NavLink to="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 lg:w-9 lg:h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="text-white" size={18} />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[var(--text-main)]">DocuVault</span>
                </NavLink>
              ) : null}
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-xl hidden sm:block relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search for documents, categories, or alerts..." 
              className="w-full bg-[var(--input-bg)] border border-[var(--border-sub)] rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-[var(--text-main)] placeholder:text-[var(--text-muted)] shadow-sm"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 lg:gap-4 min-w-[140px] flex-1">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-white/5 transition-all"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Get Started (if not logged in) */}
            {!user && (
              <NavLink 
                to="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-blue-600/20 ml-2"
              >
                Get Started
              </NavLink>
            )}

            {/* Notifications */}
            {user && (
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
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[var(--bg-main)]">
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
                      <div className="p-3 border-t border-white/10 bg-white/5">
                        <NavLink 
                          to="/notifications" 
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                        >
                          View all notifications
                          <ArrowRight size={14} />
                        </NavLink>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            )}

            {/* Profile */}
            {user && (
              <div className="relative z-50">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={`w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-[var(--bg-main)]' : ''}`}
              >
                <UserIcon size={20} />
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
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl mx-auto shadow-xl ring-4 ring-white/10">
                          <UserIcon size={32} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user?.name}</h3>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="p-2 border-t border-white/10 space-y-1">
                        <button 
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[var(--text-main)] hover:bg-white/5 transition-all text-sm font-medium"
                        >
                          <LogOut size={18} />
                          <span>Logout Session</span>
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
                              try {
                                await api.delete('/auth/account');
                                logout();
                              } catch (err) {
                                alert('Failed to delete account');
                              }
                            }
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                        >
                          <Trash2 size={18} />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            )}
          </div>
        </header>
        <div className={isAuthPage ? "" : "max-w-7xl mx-auto"}>
          {children}
        </div>
      </main>
    </div>
  );
};
