import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Plus, Search, ExternalLink, Trash2, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadModal } from '../components/UploadModal';
import { ManageCategoriesModal } from '../components/ManageCategoriesModal';

const Vault = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: docs, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/documents');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const filteredDocs = docs?.filter((doc: any) => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Document Vault</h1>
          <p className="text-[var(--text-sub)]">Total {docs?.length || 0} items secured.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsManageCategoriesOpen(true)}
            className="px-4 py-2 bg-[var(--input-bg)] border border-[var(--border-sub)] hover:bg-[var(--input-hover)] rounded-xl flex items-center justify-center gap-2 transition-all text-[var(--text-main)]"
          >
            <Tag size={20} className="text-[var(--text-sub)]" />
            <span>Categories</span>
          </button>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} />
            <span>Upload</span>
          </button>
        </div>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="glass-input w-full pl-12 py-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[var(--text-muted)] font-medium">Decrypting your vault...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredDocs?.map((doc: any) => (
              <motion.div 
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      doc.status === 'valid' ? 'bg-green-500/10 text-green-400' :
                      doc.status === 'expiring' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {doc.status}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[var(--input-bg)] rounded-lg text-blue-400">
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors text-[var(--text-main)]">{doc.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <Tag size={14} />
                      <span>{doc.category?.name || 'Uncategorized'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-sub)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--text-sub)] text-sm">
                      <Calendar size={16} />
                      <span>Expires {new Date(doc.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
      {isManageCategoriesOpen && <ManageCategoriesModal onClose={() => setIsManageCategoriesOpen(false)} />}
    </div>
  );
};

export default Vault;
