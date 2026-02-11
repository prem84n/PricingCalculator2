import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartItem, ContactDetails } from '../types';

interface CartSummaryProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  // The onGenerate function is async as it performs a network request in App.tsx
  onGenerate: (contact: ContactDetails, items: CartItem[], total: number) => Promise<string | null>;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart, setCart, onGenerate }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contact, setContact] = useState<ContactDetails>({
    fullName: '',
    organization: '',
    mobile: '',
    email: ''
  });

  const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleDelete = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty, totalPrice: (i.unitPrice * newQty) };
      }
      return i;
    }));
  };

  // Fixed: handle synchronous vs asynchronous return type by making handleSubmit async
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const quoteId = await onGenerate(contact, cart, total);
      if (quoteId) {
        setCart([]);
        setShowModal(false);
        navigate(`/quote/${quoteId}`);
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your estimate is empty</h2>
        <p className="text-slate-500 mb-8 px-8">You haven't added any products to your pricing estimate yet.</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-baseline space-x-2">
        <span>Cost Estimate</span>
        <span className="text-slate-400 font-normal text-xl">{cart.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                    {item.productId.split('-')[0]}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{item.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate(`/configure/${item.productId}/${item.id}`)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-slate-500 space-y-1 mb-6">
                {Object.entries(item.selectedConfigs).map(([k, v]) => (
                  <p key={k} className="flex justify-between border-b border-slate-50 pb-1">
                    <span>{k}</span>
                    <span className="text-slate-900 font-medium capitalize">{v}</span>
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-700">Quantity:</span>
                  <div className="flex items-center space-x-3 border border-slate-200 rounded-lg p-1">
                    <button onClick={() => handleUpdateQuantity(item.id, -1)} className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-lg">-</button>
                    <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, 1)} className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-lg">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Price</p>
                  <p className="text-xl font-bold text-slate-900">${item.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider text-[10px]">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Services:</span>
                <span className="text-slate-900 font-bold">{cart.length}</span>
              </div>
              <div className="pt-8 text-center">
                <span className="text-4xl font-bold text-slate-900">${total.toLocaleString()}</span>
                <p className="text-slate-400 text-sm mt-1">per month</p>
                <p className="text-[10px] text-slate-400 mt-6 font-medium uppercase tracking-widest">All prices are in $ per month</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 mb-4"
            >
              Generate Quote
            </button>
            <button 
              onClick={() => setCart([])}
              className="w-full py-4 text-slate-500 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Clear Cart
            </button>

            <Link to="/" className="block text-center text-indigo-600 font-bold text-sm mt-6 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Customer Details</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                  placeholder="Enter your full name"
                  value={contact.fullName}
                  onChange={(e) => setContact({...contact, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Organization</label>
                <input 
                  required
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                  placeholder="Enter your organization"
                  value={contact.organization}
                  onChange={(e) => setContact({...contact, organization: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                    placeholder="9876543210"
                    value={contact.mobile}
                    onChange={(e) => setContact({...contact, mobile: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                    placeholder="your.email@company.com"
                    value={contact.email}
                    onChange={(e) => setContact({...contact, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 flex space-x-4">
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Generate Quote'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;