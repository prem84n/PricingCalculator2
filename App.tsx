
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Persona, CartItem, Quote, QuoteStatus, ContactDetails, Product } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import ProductDiscovery from './components/ProductDiscovery';
import ProductConfig from './components/ProductConfig';
import CartSummary from './components/CartSummary';
import QuoteView from './components/QuoteView';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import NotificationCenter from './components/NotificationCenter';
import Login from './components/Login';

const API_BASE = 'http://localhost:5000/api';

const AppContent: React.FC<{
  persona: Persona;
  setPersona: (p: Persona) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  quotes: Quote[];
  products: Product[];
  handleCreateQuote: (contact: ContactDetails, items: CartItem[], total: number) => Promise<string | null>;
  handleUpdateQuote: (updatedQuote: Quote) => void;
  handleLogout: () => void;
}> = ({ persona, setPersona, cart, setCart, quotes, products, handleCreateQuote, handleUpdateQuote, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Compute');
  const [search, setSearch] = useState('');

  const isBrowsing = location.pathname === '/' || location.pathname.startsWith('/configure');
  const isCart = location.pathname === '/cart';

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSearch('');
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val && location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Header 
        persona={persona} 
        onLogout={handleLogout} 
        cartCount={cart.length} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* PERSISTENT SIDEBAR FOR BROWSING & CONFIG */}
          {isBrowsing && (
            <aside className="w-full md:w-64 space-y-1 no-print">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</h3>
                {search && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                    Search
                  </span>
                )}
              </div>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  disabled={!!search}
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat && !search
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : search 
                        ? 'text-slate-300 cursor-not-allowed opacity-50' 
                        : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="w-full text-left px-4 py-3 mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-2 border border-indigo-100 rounded-xl bg-indigo-50/30 group transition-all"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear search to browse</span>
                </button>
              )}
            </aside>
          )}

          <div className="flex-1 space-y-6">
            {/* GLOBAL BROWSING UI: Breadcrumbs & Search */}
            {(isBrowsing || isCart) && (
              <div className="flex flex-col space-y-4 no-print">
                <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 space-x-2">
                  <Link 
                    to="/" 
                    className={`transition-colors hover:text-indigo-600 ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}
                  >
                    Step 1: Discover
                  </Link>
                  <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className={location.pathname.startsWith('/configure') ? 'text-indigo-600' : 'text-slate-400'}>
                    Step 2: Configure
                  </span>
                  <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <Link 
                    to="/cart" 
                    className={`transition-colors hover:text-indigo-600 ${location.pathname === '/cart' ? 'text-indigo-600' : 'text-slate-400'}`}
                  >
                    Step 3: Cart Summary
                  </Link>
                </nav>
                
                {isBrowsing && (
                  <>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 transition-colors ${search ? 'text-indigo-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search services globally..."
                        className={`block w-full pl-12 pr-12 py-3.5 border rounded-2xl leading-5 bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all ${
                          search ? 'border-indigo-300 shadow-lg shadow-indigo-50' : 'border-slate-200'
                        }`}
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                      {search && (
                        <button 
                          onClick={() => setSearch('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {search && (
                      <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100/50 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Searching globally for <span className="font-bold text-slate-900">"{search}"</span> across all categories.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <Routes>
              <Route path="/" element={
                <ProductDiscovery 
                  persona={persona} 
                  products={products} 
                  cart={cart} 
                  setCart={setCart}
                  selectedCategory={selectedCategory}
                  search={search}
                  setSearch={setSearch}
                />
              } />
              <Route path="/configure/:productId" element={
                <ProductConfig products={products} cart={cart} setCart={setCart} />
              } />
              <Route path="/configure/:productId/:itemId" element={
                <ProductConfig products={products} cart={cart} setCart={setCart} />
              } />
              <Route path="/cart" element={
                <CartSummary 
                  cart={cart} 
                  setCart={setCart} 
                  onGenerate={handleCreateQuote} 
                />
              } />
              <Route path="/quote/:quoteId" element={
                <QuoteView persona={persona} quotes={quotes} onUpdate={handleUpdateQuote} />
              } />
              <Route path="/dashboard" element={
                <Dashboard persona={persona} quotes={quotes} onUpdate={handleUpdateQuote} />
              } />
              <Route path="/admin" element={
                <AdminPanel persona={persona} />
              } />
              <Route path="/login" element={
                <Login setPersona={setPersona} />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [persona, setPersona] = useState<Persona>(Persona.PUBLIC);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendActive, setBackendActive] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const prodRes = await fetch(`${API_BASE}/products`).catch(() => null);
        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
          const quoteRes = await fetch(`${API_BASE}/quotes`);
          if (quoteRes.ok) {
            const quoteData = await quoteRes.json();
            setQuotes(quoteData);
          }
          setBackendActive(true);
        } else {
          throw new Error("Backend unreachable");
        }
      } catch (err) {
        setProducts(PRODUCTS);
        const savedQuotes = localStorage.getItem('pp_quotes');
        if (savedQuotes) setQuotes(JSON.parse(savedQuotes));
        setBackendActive(false);
      } finally {
        const savedPersona = localStorage.getItem('pp_persona');
        if (savedPersona) setPersona(savedPersona as Persona);
        setLoading(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    if (!backendActive && quotes.length > 0) {
      localStorage.setItem('pp_quotes', JSON.stringify(quotes));
    }
  }, [quotes, backendActive]);

  useEffect(() => {
    localStorage.setItem('pp_persona', persona);
  }, [persona]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 10));
  };

  const handleCreateQuote = async (contact: ContactDetails, items: CartItem[], total: number) => {
    if (backendActive) {
      try {
        const response = await fetch(`${API_BASE}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: contact,
            items: items,
            totalEstimate: total,
            createdBy: persona
          })
        });
        if (response.ok) {
          const newQuote = await response.json();
          setQuotes([newQuote, ...quotes]);
          addNotification(`New quote ${newQuote.id} created for ${contact.fullName}`);
          return newQuote.id;
        }
      } catch (err) {
        console.error("Failed to create quote", err);
      }
    }
    const localQuote: Quote = {
      id: `QT-LOC-${Math.floor(Math.random() * 9000) + 1000}`,
      customer: contact,
      items: items,
      totalEstimate: total,
      status: QuoteStatus.DRAFT,
      createdAt: new Date().toISOString(),
      createdBy: persona
    };
    setQuotes([localQuote, ...quotes]);
    addNotification(`Quote ${localQuote.id} saved locally`);
    return localQuote.id;
  };

  const handleUpdateQuote = (updatedQuote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
    addNotification(`Quote ${updatedQuote.id} updated`);
  };

  const handleLogout = () => {
    setPersona(Persona.PUBLIC);
    setCart([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-auto animate-pulse">
            <img src="logo.png" alt="Protean" className="w-full h-auto" />
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Initializing Protean...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppContent 
        persona={persona}
        setPersona={setPersona}
        cart={cart}
        setCart={setCart}
        quotes={quotes}
        products={products}
        handleCreateQuote={handleCreateQuote}
        handleUpdateQuote={handleUpdateQuote}
        handleLogout={handleLogout}
      />
      <NotificationCenter notifications={notifications} />
      <footer className="bg-white border-t border-slate-200 py-12 mt-20 no-print">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Protean Global Enterprise Solutions. All rights reserved.</p>
        </div>
      </footer>
    </HashRouter>
  );
};

export default App;
