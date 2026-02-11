
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Persona } from '../types';

interface HeaderProps {
  persona: Persona;
  onLogout: () => void;
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ persona, onLogout, cartCount }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isInternal = persona !== Persona.PUBLIC;

  const navLinks = [
    { label: 'Products', path: '/' },
    { label: 'Dashboard', path: '/dashboard', internal: true },
    { label: 'Admin', path: '/admin', admin: true },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-auto flex-shrink-0">
              <img 
                src="data:image/png;base64,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" 
                alt="Protean Logo" 
                className="h-full w-auto object-contain" 
              />
            </div>
            <span className="text-2xl font-black text-black tracking-tight"></span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {navLinks.map(link => {
              const showInternal = link.internal && [Persona.PRESALES, Persona.SALES_MANAGER, Persona.SALES_ADMIN].includes(persona);
              const showAdmin = link.admin && persona === Persona.SALES_ADMIN;
              const showPublic = !link.internal && !link.admin;

              if (showPublic || showInternal || showAdmin) {
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600'}`}
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!isInternal ? (
            <Link 
              to="/login"
              className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Internal Login
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                  {persona.replace('_', ' ')}
                </span>
                <button 
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase transition-colors"
                >
                  Logout
                </button>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                <img src={`https://picsum.photos/32/32?u=${persona}`} alt="Profile" />
              </div>
            </div>
          )}

          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
