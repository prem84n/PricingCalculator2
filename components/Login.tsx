
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Persona } from '../types';

interface LoginProps {
  setPersona: (p: Persona) => void;
}

const Login: React.FC<LoginProps> = ({ setPersona }) => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(Persona.PRESALES);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPersona(selectedPersona);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-12 sm:mt-24 px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-45">
            <div className="w-8 h-8 border-4 border-white rounded-lg rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold">Internal Employee Portal</h1>
          <p className="text-indigo-100 text-sm mt-2 opacity-80">Please authenticate to access internal pricing tools</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Role</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: Persona.PRESALES, label: 'Presales Engineer', desc: 'Configure advanced builds' },
                { id: Persona.SALES_MANAGER, label: 'Sales Manager', desc: 'Approve discounts & quotes' },
                { id: Persona.SALES_ADMIN, label: 'Sales Admin', desc: 'Manage system rules' }
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedPersona(role.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPersona === role.id 
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className={`text-sm font-bold ${selectedPersona === role.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                    {role.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
            >
              <span>Login as {selectedPersona.replace('_', ' ')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-medium">
            Authorized Personnel Only. SSO Simulation Active.
          </p>
        </form>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/')}
          className="text-sm font-bold text-indigo-600 hover:underline"
        >
          Return to Public Website
        </button>
      </div>
    </div>
  );
};

export default Login;
