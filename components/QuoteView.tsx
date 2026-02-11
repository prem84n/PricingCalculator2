
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Persona, Quote, QuoteStatus } from '../types';

interface QuoteViewProps {
  persona: Persona;
  quotes: Quote[];
  onUpdate: (q: Quote) => void;
}

const QuoteView: React.FC<QuoteViewProps> = ({ persona, quotes, onUpdate }) => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const quote = quotes.find(q => q.id === quoteId);

  if (!quote) return <div>Quote not found</div>;

  const handleStatusUpdate = (newStatus: QuoteStatus) => {
    onUpdate({ ...quote, status: newStatus });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8 no-print">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quote {quote.id}</h1>
            <p className="text-sm text-slate-500">Status: <span className="font-bold text-indigo-600 uppercase tracking-tight">{quote.status}</span></p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50">
            Print / PDF
          </button>
          {quote.status === QuoteStatus.DRAFT && (
            <button 
              onClick={() => handleStatusUpdate(QuoteStatus.FINAL)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
            >
              Mark as Final
            </button>
          )}
        </div>
      </div>

      {/* Simulated Paper PDF */}
      <div className="bg-white shadow-2xl rounded-sm border border-slate-200 p-12 min-h-[1000px] flex flex-col font-serif print:shadow-none print:border-none">
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-auto flex-shrink-0">
              <img 
                src="logo.pngdata:image/png;base64,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" 
                alt="Protean Logo" 
                className="w-full h-auto" 
              />
            </div>
            <span className="text-3xl font-black text-black font-sans tracking-tight">protean</span>
          </div>
          <div className="text-right font-sans text-sm text-slate-500">
            <p className="font-bold text-slate-900">Quote # {quote.id}</p>
            <p>Date: {new Date(quote.createdAt).toLocaleDateString()}</p>
            <p>Valid Until: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16 font-sans">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Customer Details</h3>
            <p className="text-lg font-bold text-slate-900">{quote.customer.fullName}</p>
            <p className="text-slate-600">{quote.customer.organization}</p>
            <p className="text-slate-600">{quote.customer.email}</p>
            <p className="text-slate-600">{quote.customer.mobile}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Summary</h3>
            <div className="text-4xl font-bold text-slate-900 mb-1">${quote.totalEstimate.toLocaleString()}</div>
            <p className="text-slate-400 text-xs">Total Monthly Estimate (USD)</p>
          </div>
        </div>

        <div className="flex-1 font-sans">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 font-bold">Service / Item</th>
                <th className="py-4 text-center font-bold">Qty</th>
                <th className="py-4 text-right font-bold">Unit Price</th>
                <th className="py-4 text-right font-bold">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quote.items.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-6">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-x-3">
                      {Object.entries(item.selectedConfigs).map(([k, v]) => (
                        <span key={k}>{k}: <span className="text-slate-600">{v}</span></span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 text-center text-slate-600 font-medium">{item.quantity}</td>
                  <td className="py-6 text-right text-slate-600 font-medium">${item.unitPrice.toLocaleString()}</td>
                  <td className="py-6 text-right font-bold text-slate-900">${item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 pt-8 border-t-2 border-slate-100 font-sans">
          <div className="flex justify-between items-center">
            <div className="text-slate-400 text-[10px] leading-relaxed max-w-md">
              <p className="font-bold uppercase mb-2">Terms & Conditions</p>
              <p>This quote is for estimation purposes only. Actual costs may vary based on usage and final service level agreements. Subject to Protean Standard Cloud Agreement.</p>
            </div>
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal:</span>
                <span className="text-slate-900 font-bold">${quote.totalEstimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount:</span>
                <span className="text-emerald-600 font-bold">-$0.00</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total:</span>
                <span className="text-3xl font-bold text-indigo-600">${quote.totalEstimate.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex justify-between items-end font-sans">
          <div className="text-center">
            <div className="w-48 border-b-2 border-slate-200 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Signature</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b-2 border-slate-200 mb-2"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Rep</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteView;
