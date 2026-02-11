
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Persona, CartItem } from '../types';

interface ProductDiscoveryProps {
  persona: Persona;
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  selectedCategory: string;
  search: string;
  setSearch: (val: string) => void;
}

const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({ persona, products, cart, setCart, selectedCategory, search, setSearch }) => {
  const navigate = useNavigate();

  const filteredProducts = products.filter(p => {
    const isVisible = !p.internalOnly || persona !== Persona.PUBLIC;
    const searchLower = search.toLowerCase();
    
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower);
    
    const matchesCategory = search ? true : p.category === selectedCategory;
    
    return isVisible && matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col space-y-6">
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden">
              {product.internalOnly && (
                <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter z-10">
                  Internal
                </span>
              )}
              
              {search && (
                 <span className="absolute -left-10 top-5 bg-indigo-600 text-white text-[8px] font-bold px-10 py-1 -rotate-45 uppercase tracking-widest shadow-sm">
                  Global Match
                </span>
              )}

              <div className="flex items-start space-x-4 mb-4 relative z-10">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{product.category}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-6 flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Starting from</span>
                  <span className="text-lg font-black text-slate-900">${product.basePrice.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => navigate(`/configure/${product.id}`)}
                  className="py-2.5 px-6 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 hover:shadow-lg transition-all"
                >
                  Configure
                </button>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No results for "{search}"</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 italic">Try checking your spelling or use more general keywords across categories.</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
          >
            Clear Global Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDiscovery;
