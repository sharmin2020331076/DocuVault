import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Bell, Check, Trash2, Shield, Calendar, AlertTriangle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All marked as read');
    },
  });

  if (isLoading) return <div className="p-8 text-[var(--text-sub)]">Loading notifications...</div>;

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-[var(--text-sub)] mt-2">Manage your alerts and document status updates.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllReadMutation.mutate()}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-500/5 transition-all"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 glass-card rounded-3xl"
            >
              <Bell className="mx-auto mb-4 opacity-20" size={48} />
              <p className="text-[var(--text-sub)]">No notifications to show.</p>
            </motion.div>
          ) : (
            notifications?.map((notification: any) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-6 rounded-2xl flex items-start gap-4 group relative border-white/5 transition-all hover:border-white/10 ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-500/5' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notification.type === 'in-app' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                  {notification.message.includes('expired') ? <AlertTriangle size={24} /> : (notification.type === 'in-app' ? <Shield size={24} /> : <Calendar size={24} />)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className={`text-lg leading-snug ${!notification.isRead ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-sub)]'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markReadMutation.mutate(notification.id)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-all"
                          title="Mark as read"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMutation.mutate(notification.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
