
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Persona, CartItem } from '../types';
import { CATEGORIES } from '../constants';

interface ProductDiscoveryProps {
  persona: Persona;
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({ persona, products, cart, setCart }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Compute');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => {
    const isVisible = !p.internalOnly || persona !== Persona.PUBLIC;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = p.category === selectedCategory;
    return isVisible && matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      <div className="flex-1 space-y-6">
        <div className="flex flex-col space-y-4">
          <nav className="flex items-center text-xs text-slate-400 space-x-2">
            <span className="text-indigo-600 font-medium">Step 1: Discover</span>
            <span>/</span>
            <span>Step 2: Configure</span>
            <span>/</span>
            <span>Step 3: Cart Summary</span>
          </nav>
          
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search services..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-lg transition-shadow group relative">
              {product.internalOnly && (
                <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Internal Only
                </span>
              )}
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
              </div>
              <div className="mt-auto pt-6">
                <button 
                  onClick={() => navigate(`/configure/${product.id}`)}
                  className="w-full py-2 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Configure Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDiscovery;
