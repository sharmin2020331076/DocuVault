import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatDate(selected));
    setIsOpen(false);
  };

  const days = [];
  const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  const todayStr = formatDate(new Date());

  for (let d = 1; d <= totalDays; d++) {
    const dObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
    const dStr = formatDate(dObj);
    const isToday = todayStr === dStr;
    const isSelected = value === dStr;
    
    days.push(
      <button
        key={d}
        type="button"
        onClick={() => handleDateClick(d)}
        className={`h-8 w-full rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all relative group ${
          isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' :
          isToday ? 'text-blue-400 border border-blue-500/30' :
          'hover:bg-[var(--input-hover)] text-[var(--text-main)]'
        }`}
      >
        {d}
        {isToday && !isSelected && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
        )}
      </button>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className={`${className || ''}`}>
      {label && <label className="text-sm font-medium text-[var(--text-sub)] mb-1 block">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-input w-full cursor-pointer flex items-center justify-between group pl-2 pr-3 py-2 transition-all active:scale-[0.98]"
      >
        <span className={`text-sm ${value ? 'text-[var(--text-main)]' : 'text-[var(--text-sub)]'}`}>
          {getDisplayDate(value)}
        </span>
        <CalendarIcon size={16} className="text-[var(--text-sub)] group-hover:text-blue-500 transition-colors" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[65]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute z-[100] top-0 left-0 right-0 glass-card rounded-2xl p-3.5 shadow-2xl backdrop-blur-[var(--glass-blur)] bg-[var(--card-bg)] border-[var(--border-sub)] origin-top overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest font-black text-blue-500">
                    {viewDate.getFullYear()}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-main)] tracking-tight -mt-1">
                    {monthNames[viewDate.getMonth()]}
                  </h3>
                </div>
                <div className="flex gap-1 bg-[var(--input-bg)] rounded-lg p-0.5">
                  <button 
                    type="button" 
                    onClick={handlePrevMonth} 
                    className="p-1 hover:bg-[var(--input-hover)] rounded-md text-[var(--text-sub)] hover:text-[var(--text-main)] transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    type="button" 
                    onClick={handleNextMonth} 
                    className="p-1 hover:bg-[var(--input-hover)] rounded-md text-[var(--text-sub)] hover:text-[var(--text-main)] transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="h-6 flex items-center justify-center text-[9px] font-black text-[var(--text-main)] uppercase">
                    {d}
                  </div>
                ))}
                {days}
              </div>
              
              {/* Footer */}
              <div className="mt-2 pt-2 border-t border-[var(--border-sub)] flex items-center justify-between px-1">
                  <button 
                      type="button"
                      onClick={() => { onChange(formatDate(new Date())); setIsOpen(false); }}
                      className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                      Today
                  </button>
                  <button 
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] font-bold text-[var(--text-sub)] hover:text-[#f20c42] transition-colors uppercase cursor-pointer"
                  >
                      Close
                  </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
