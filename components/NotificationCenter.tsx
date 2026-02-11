
import React, { useState } from 'react';

interface NotificationCenterProps {
  notifications: string[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] no-print">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white border border-slate-200 shadow-2xl rounded-full flex items-center justify-center hover:scale-110 transition-transform relative group"
      >
        <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 text-sm">System Events</h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase">Real-time</span>
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs italic">No events yet...</p>
            ) : (
              notifications.map((notif, i) => (
                <div key={i} className="p-3 mb-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] leading-relaxed animate-in fade-in slide-in-from-right-2">
                  <p className="text-slate-700 font-medium">{notif}</p>
                  <p className="text-slate-400 mt-1 uppercase text-[9px] font-bold">Just now</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
