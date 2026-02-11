
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '../types';

interface ProductConfigProps {
  products: Product[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductConfig: React.FC<ProductConfigProps> = ({ products, cart, setCart }) => {
  const { productId, itemId } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === productId);

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold">Service not found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline">Return to catalog</button>
    </div>
  );

  const existingItem = useMemo(() => cart.find(i => i.id === itemId), [cart, itemId]);

  const [quantity, setQuantity] = useState(1);
  const [selectedConfigs, setSelectedConfigs] = useState<Record<string, string | number>>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
      setSelectedConfigs(existingItem.selectedConfigs);
      setSelectedAddons(existingItem.selectedAddons);
    } else {
      setQuantity(1);
      setSelectedConfigs(Object.fromEntries(
        product.configurations.map(c => [
          c.name, 
          c.type === 'select' ? c.options![0].value : c.min || 0
        ])
      ));
      setSelectedAddons([]);
    }
  }, [existingItem, product]);

  const calculateTotal = useMemo(() => {
    let price = product.basePrice;
    product.configurations.forEach(config => {
      const selected = selectedConfigs[config.name];
      if (config.type === 'select') {
        const option = config.options?.find(o => o.value === selected);
        if (option) price *= option.priceMultiplier;
      } else if (config.type === 'number') {
        price += (Number(selected || 0) * 0.1);
      }
    });
    selectedAddons.forEach(addonId => {
      const addon = product.addons.find(a => a.id === addonId);
      if (addon) price += addon.price;
    });
    return price * quantity;
  }, [product, selectedConfigs, selectedAddons, quantity]);

  const handleSaveConfiguration = () => {
    const updatedItem: CartItem = {
      id: itemId || Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      quantity,
      selectedConfigs,
      selectedAddons,
      unitPrice: calculateTotal / quantity,
      totalPrice: calculateTotal
    };

    if (itemId) {
      setCart(cart.map(i => i.id === itemId ? updatedItem : i));
    } else {
      setCart([...cart, updatedItem]);
    }
    navigate('/cart');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {itemId ? 'Edit' : 'Configure'} <span className="text-indigo-600">{product.name}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">Adjust parameters to update your cost estimate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="space-y-6">
              {product.configurations.map(config => (
                <div key={config.name} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">{config.name} *</label>
                  {config.type === 'select' ? (
                    <select 
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={selectedConfigs[config.name] || ''}
                      onChange={(e) => setSelectedConfigs({...selectedConfigs, [config.name]: e.target.value})}
                    >
                      {config.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="number" 
                      min={config.min} 
                      max={config.max}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={selectedConfigs[config.name] || 0}
                      onChange={(e) => setSelectedConfigs({...selectedConfigs, [config.name]: parseInt(e.target.value) || 0})}
                    />
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">-</button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Summary</h2>
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center mb-8">
            <span className="font-bold text-slate-900">Monthly Est:</span>
            <span className="text-xl font-bold text-indigo-600">${calculateTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleSaveConfiguration}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            {itemId ? 'Update Service' : 'Add to Estimate'}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            Cancel & Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductConfig;
