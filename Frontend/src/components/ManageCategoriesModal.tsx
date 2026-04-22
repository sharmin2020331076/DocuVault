import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { X, Plus, Trash2, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ManageCategoriesModal = ({ onClose }: { onClose: () => void }) => {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newCat: { name: string, color: string }) => api.post('/categories', newCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewName('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Category name is required');
      return;
    }
    createMutation.mutate({ name: newName, color: newColor });
  };

  const colors = [
    '#3b82f6', '#ff0040ff', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-md rounded-3xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Tag size={20} className="text-blue-400" />
            Manage Categories
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">New Category</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Health, Finance..." 
                  className="glass-input flex-1 pl-2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={createMutation.isPending}
                  className="glass-button p-3 flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">Category Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${newColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </form>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 block">Existing Categories</label>
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {isLoading ? (
                <div className="text-center py-4 text-slate-500">Loading...</div>
              ) : categories?.length === 0 ? (
                <div className="text-center py-4 text-slate-500 italic">No categories yet</div>
              ) : (
                categories?.map((cat: any) => (
                  <motion.div 
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <button 
                      onClick={() => deleteMutation.mutate(cat.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
