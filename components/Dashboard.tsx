
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote, Persona, QuoteStatus } from '../types';

interface DashboardProps {
  persona: Persona;
  quotes: Quote[];
  onUpdate: (q: Quote) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ persona, quotes, onUpdate }) => {
  const navigate = useNavigate();

  // Basic filtering based on persona logic
  const filteredQuotes = persona === Persona.PUBLIC 
    ? quotes // In a real app, only show current user's
    : persona === Persona.SALES_MANAGER
    ? quotes // Show all for manager demo
    : quotes;

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.APPROVED: return 'bg-emerald-100 text-emerald-700';
      case QuoteStatus.DRAFT: return 'bg-slate-100 text-slate-700';
      case QuoteStatus.FINAL: return 'bg-indigo-100 text-indigo-700';
      case QuoteStatus.PENDING_APPROVAL: return 'bg-amber-100 text-amber-700';
      case QuoteStatus.REJECTED: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quotes Dashboard</h1>
          <p className="text-slate-500">Manage and track all generated price quotations</p>
        </div>
        {persona !== Persona.PUBLIC && (
          <button onClick={() => navigate('/')} className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            Create New Quote
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Quotes</p>
          <p className="text-3xl font-bold text-slate-900">{filteredQuotes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Value</p>
          <p className="text-3xl font-bold text-indigo-600">${filteredQuotes.reduce((acc, q) => acc + q.totalEstimate, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Drafts</p>
          <p className="text-3xl font-bold text-slate-900">{filteredQuotes.filter(q => q.status === QuoteStatus.DRAFT).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending</p>
          <p className="text-3xl font-bold text-slate-900">{filteredQuotes.filter(q => q.status === QuoteStatus.PENDING_APPROVAL).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Quote ID</th>
                <th className="px-6 py-4">Customer / Org</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map(quote => (
                <tr key={quote.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-indigo-600">#{quote.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{quote.customer.fullName}</p>
                      <p className="text-xs text-slate-400">{quote.customer.organization}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {quote.items.length} services
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">${quote.totalEstimate.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/quote/${quote.id}`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View/Print"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {(persona !== Persona.PUBLIC || quote.status === QuoteStatus.DRAFT) && (
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit Draft">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
