import React, { useState, useEffect } from 'react';
import { Persona, WorkflowRule, ConfigRule, User } from '../types';

interface AdminPanelProps {
  persona: Persona;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ persona }) => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'config' | 'users'>('workflows');
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [configRules, setConfigRules] = useState<ConfigRule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', role: Persona.PRESALES });
  const [newWorkflow, setNewWorkflow] = useState({ name: '', condition: 'total_value', threshold: 1000, approver: Persona.SALES_MANAGER });
  const [newConfig, setNewConfig] = useState({ name: '', productId: 'vm-basic', triggerConfig: '', triggerValue: '', restrictedConfig: '', action: 'REQUIRE' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        'http://localhost:5000/api/admin/rules',
        'http://localhost:5000/api/admin/config-rules',
        'http://localhost:5000/api/admin/users'
      ];
      
      const responses = await Promise.all(endpoints.map(e => fetch(e).catch(() => null)));
      
      if (responses.some(r => !r || !r.ok)) {
        setApiError(true);
        // Load mock data for demo if API fails
        setWorkflows([]);
        setConfigRules([]);
        setUsers([]);
      } else {
        const [wData, cData, uData] = await Promise.all(responses.map(r => r!.json()));
        setWorkflows(wData);
        setConfigRules(cData);
        setUsers(uData);
        setApiError(false);
      }
    } catch (err) {
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (endpoint: string, data: any) => {
    if (apiError) {
      alert("Backend is currently offline. This action cannot be performed in Mock Mode.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (persona !== Persona.SALES_ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">Internal Admin Access Only. Please login with administrative credentials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {apiError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">Backend Offline (Mock Mode)</p>
            <p className="text-xs text-amber-600">The app is using local storage. Admin changes will not persist globally.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500 mt-1">Configure business logic and manage organizational access</p>
        </div>
        {!apiError && (
          <button 
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create {activeTab === 'users' ? 'User' : activeTab === 'config' ? 'Config Rule' : 'Workflow'}</span>
          </button>
        )}
      </div>

      <div className="flex space-x-2 border-b border-slate-200">
        {[
          { id: 'workflows', label: 'Financial Workflows', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'config', label: 'Product Rules', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          { id: 'users', label: 'User Directory', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">Syncing with system database...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'workflows' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.length > 0 ? workflows.map(w => (
                  <div key={w.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-900">{w.name}</h3>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Active</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Condition:</span>
                        <span className="text-slate-900 font-medium capitalize">{w.condition.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Threshold:</span>
                        <span className="text-slate-900 font-bold">{w.condition === 'discount_pct' ? `${w.threshold}%` : `$${w.threshold.toLocaleString()}`}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Required Approver</span>
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded">{w.approver}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-slate-400 italic">No workflows defined.</div>
                )}
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-4">
                {configRules.length > 0 ? configRules.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{c.name}</h3>
                        <p className="text-xs text-slate-500">Logic for <span className="text-indigo-600 font-bold">{c.productId}</span></p>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-sm">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Trigger</p>
                        <p className="font-medium text-slate-700">{c.triggerConfig} = {c.triggerValue}</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Action</p>
                        <p className="font-bold text-indigo-600">{c.action} {c.restrictedConfig}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center text-slate-400 italic">No configuration rules defined.</div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">User Identity</th>
                      <th className="px-6 py-4">Role / Access</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.length > 0 ? users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            u.role === Persona.SALES_ADMIN ? 'bg-purple-50 text-purple-700' :
                            u.role === Persona.SALES_MANAGER ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center space-x-1.5 text-emerald-600 text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span>Active</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 italic">User directory empty.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">
                New {activeTab === 'users' ? 'User' : activeTab === 'config' ? 'Product Rule' : 'Workflow'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="p-8">
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Work Email</label>
                    <input type="email" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="jane@company.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Assigned Role</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                      <option value={Persona.PRESALES}>Presales Engineer</option>
                      <option value={Persona.SALES_MANAGER}>Sales Manager</option>
                      <option value={Persona.SALES_ADMIN}>Sales Admin</option>
                    </select>
                  </div>
                  <button onClick={() => handleCreate('users', newUser)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-6 hover:bg-indigo-700 transition-colors">Create User Account</button>
                </div>
              )}

              {activeTab === 'workflows' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Workflow Name</label>
                    <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newWorkflow.name} onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})} placeholder="Enterprise Value Approval" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Condition</label>
                      <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newWorkflow.condition} onChange={e => setNewWorkflow({...newWorkflow, condition: e.target.value as any})}>
                        <option value="total_value">Total Value ($)</option>
                        <option value="discount_pct">Discount (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Threshold</label>
                      <input type="number" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newWorkflow.threshold} onChange={e => setNewWorkflow({...newWorkflow, threshold: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Required Approver</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newWorkflow.approver} onChange={e => setNewWorkflow({...newWorkflow, approver: e.target.value as any})}>
                      <option value={Persona.SALES_MANAGER}>Sales Manager</option>
                      <option value={Persona.SALES_ADMIN}>Sales Admin</option>
                    </select>
                  </div>
                  <button onClick={() => handleCreate('rules', newWorkflow)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-6 hover:bg-indigo-700 transition-colors">Deploy Financial Workflow</button>
                </div>
              )}

              {activeTab === 'config' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Rule Title</label>
                    <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={newConfig.name} onChange={e => setNewConfig({...newConfig, name: e.target.value})} placeholder="OS-Backup Bundle Rule" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">If Parameter</label>
                      <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Operating System" value={newConfig.triggerConfig} onChange={e => setNewConfig({...newConfig, triggerConfig: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Equals Value</label>
                      <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. windows" value={newConfig.triggerValue} onChange={e => setNewConfig({...newConfig, triggerValue: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Then Force Option</label>
                    <input type="text" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Daily Backup" value={newConfig.restrictedConfig} onChange={e => setNewConfig({...newConfig, restrictedConfig: e.target.value})} />
                  </div>
                  <button onClick={() => handleCreate('config-rules', newConfig)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold mt-6 hover:bg-indigo-700 transition-colors">Activate Logic Rule</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;