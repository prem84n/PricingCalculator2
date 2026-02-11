
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Persona, CartItem, Quote, QuoteStatus, ContactDetails, Product } from './types';
import { PRODUCTS } from './constants';
import ProductDiscovery from './components/ProductDiscovery';
import ProductConfig from './components/ProductConfig';
import CartSummary from './components/CartSummary';
import QuoteView from './components/QuoteView';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import NotificationCenter from './components/NotificationCenter';
import Login from './components/Login';

// API Configuration
// Using relative path fallback or localhost based on environment
const API_BASE = 'http://localhost:5000/api';

const App: React.FC = () => {
  const [persona, setPersona] = useState<Persona>(Persona.PUBLIC);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendActive, setBackendActive] = useState(false);

  // Initial data fetch from Python backend with Fallback to Mock Data
  useEffect(() => {
    const initApp = async () => {
      try {
        const prodRes = await fetch(`${API_BASE}/products`, {
          signal: AbortController ? new AbortController().signal : undefined
        }).catch(() => null);
        
        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
          
          const quoteRes = await fetch(`${API_BASE}/quotes`);
          if (quoteRes.ok) {
            const quoteData = await quoteRes.json();
            setQuotes(quoteData);
          }
          setBackendActive(true);
          console.log("Connected to Protean Backend API successfully.");
        } else {
          throw new Error("Backend unreachable");
        }
      } catch (err) {
        console.warn("Backend unreachable. Falling back to local static data.");
        setProducts(PRODUCTS);
        const savedQuotes = localStorage.getItem('pp_quotes');
        if (savedQuotes) {
          setQuotes(JSON.parse(savedQuotes));
        }
        setBackendActive(false);
      } finally {
        const savedPersona = localStorage.getItem('pp_persona');
        if (savedPersona) setPersona(savedPersona as Persona);
        setLoading(false);
      }
    };
    initApp();
  }, []);

  // Sync quotes to localStorage only in local mode
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
        console.error("Failed to create quote on backend", err);
      }
    }

    // Local Fallback
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

  const handleUpdateQuote = async (updatedQuote: Quote) => {
    if (backendActive) {
      try {
        await fetch(`${API_BASE}/quotes/${updatedQuote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuote)
        });
      } catch (err) {
        console.error("Failed to update quote on backend", err);
      }
    }
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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Header 
          persona={persona} 
          onLogout={handleLogout} 
          cartCount={cart.length} 
        />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <ProductDiscovery 
                persona={persona} 
                products={products} 
                cart={cart} 
                setCart={setCart} 
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
        </main>

        <NotificationCenter notifications={notifications} />
        
        <footer className="bg-white border-t border-slate-200 py-12 mt-20 no-print">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Protean Global Enterprise Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
