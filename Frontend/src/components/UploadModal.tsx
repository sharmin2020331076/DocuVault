import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { X, Upload, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from './DatePicker';

export const UploadModal = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [leadTime, setLeadTime] = useState('30');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', 'stats'] });
      onClose();
    },
    onError: (err: any) => {
        setError(err.response?.data?.message || 'Upload failed');
    }
  });

  const handleUpload = () => {
    if (!file || !title || !expiryDate) {
      setError('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('categoryId', categoryId);
    formData.append('expiryDate', expiryDate);
    formData.append('leadTimeDays', leadTime);

    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-2xl rounded-3xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-sub)]">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Secure Upload</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--input-bg)] rounded-full text-[var(--text-sub)] hover:text-[var(--text-main)]">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-[var(--border-sub)] hover:border-[var(--border-main)]'
              } ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
            >
              <input {...getInputProps()} />
              {file ? (
                <>
                  <CheckCircle2 size={40} className="text-green-400 mb-4" />
                  <p className="text-sm font-medium text-[var(--text-main)]">{file.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Click to replace</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[var(--input-bg)] rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-[var(--text-sub)]" />
                  </div>
                  <p className="text-sm text-[var(--text-main)]">Drag & drop your document</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">PDF, JPEG, PNG supported</p>
                </>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="space-y-4 relative">
            <div>
              <label className="text-sm font-medium text-[var(--text-sub)] mb-1 block">Document Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Car Insurance" 
                className="glass-input w-full pl-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-[var(--text-sub)] mb-1 block">Category</label>
              <div 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="pl-2 glass-input w-full cursor-pointer flex items-center justify-between group"
              >
                <span className={categoryId ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}>
                  {categoryId ? categories?.find((c: any) => c.id === categoryId)?.name : 'Select Category'}
                </span>
                <motion.div
                  animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                  className="text-[var(--text-sub)] group-hover:text-blue-500 transition-colors"
                >
                  <ChevronDown size={18} />
                </motion.div>
              </div>

              <AnimatePresence>
                {isCategoryOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[55]" 
                      onClick={() => setIsCategoryOpen(false)} 
                    />
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute z-[60] left-0 right-0 mt-1 glass-card rounded-xl overflow-hidden shadow-2xl backdrop-blur-[var(--glass-blur)] bg-[var(--card-bg)] border-[var(--border-sub)] origin-top"
                  >
                    <div className="p-1 max-h-40 overflow-y-auto custom-scrollbar">
                      <div 
                        onClick={() => { setCategoryId(''); setIsCategoryOpen(false); }}
                        className="p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer transition-colors text-[var(--text-sub)] hover:text-[var(--text-main)]"
                      >
                        Select Category
                      </div>
                      {categories?.map((cat: any) => (
                        <div 
                          key={cat.id} 
                          onClick={() => { setCategoryId(cat.id); setIsCategoryOpen(false); }}
                          className="p-3 hover:bg-[var(--input-bg)] rounded-xl cursor-pointer transition-colors flex items-center gap-3 group"
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-[var(--text-sub)] group-hover:text-blue-400 transition-colors">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <DatePicker 
                  label="Expiry Date *"
                  value={expiryDate}
                  onChange={setExpiryDate}
                />
              <div>
                <label className="text-sm font-medium text-[var(--text-sub)] mb-1 block">Reminder (Days)</label>
                <input 
                  type="number" 
                  placeholder="30" 
                  className="pl-2 glass-input w-full"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleUpload}
              disabled={mutation.isPending}
              className="w-full glass-button py-4 mt-6 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? 'Uploading...' : 'Vault Document'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
