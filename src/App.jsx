import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import EditForm from './components/EditForm';
import Overview from './components/Overview';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('guest'); // Default to guest
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview');
  const [editingEnterprise, setEditingEnterprise] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          setUserRole('manager'); 
        }
      } else {
        setUser(null);
        setUserRole('guest');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (enterprise) => {
    if (userRole !== 'admin') return;
    setEditingEnterprise(enterprise);
    setView('edit');
  };

  const handleLogout = () => {
    signOut(auth);
    setView('overview');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar 
        activeView={view} 
        setView={setView} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        userRole={userRole}
        isLoggedIn={!!user}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 flex-shrink-0 no-print">
          <div className="flex items-center gap-4 flex-1">
             <button 
               onClick={() => setMobileOpen(true)}
               className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
             </button>
             <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
               {view === 'overview' ? 'Real-time Overview' : 
                view === 'dashboard' ? 'Business Directory' : 
                view === 'registration' ? 'New Registration' : 
                view === 'users' ? 'User Management' :
                view === 'login' ? 'System Authentication' : 'Edit SME Record'}
             </h2>
          </div>
          
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{user.email?.split('@')[0]}</p>
                  <p className="text-[10px] text-primary-600 font-black uppercase tracking-tighter bg-primary-50 px-2 rounded-md">
                    {userRole}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView('login')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
            >
              STAFF LOGIN
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="animate-fade-in">
            {view === 'overview' && <Overview />}
            {view === 'dashboard' && <Dashboard onEdit={handleEdit} userRole={userRole} />}
            {view === 'login' && !user && <Login onLoginSuccess={(u, r) => { setView('overview'); }} />}
            
            {/* Protected Admin Views */}
            {userRole === 'admin' && (
              <>
                {view === 'registration' && <RegistrationForm />}
                {view === 'users' && <UserManagement />}
                {view === 'edit' && editingEnterprise && (
                  <EditForm 
                    enterprise={editingEnterprise} 
                    onCancel={() => setView('dashboard')} 
                    onSuccess={() => setView('dashboard')} 
                  />
                )}
              </>
            )}

            {/* Access Denied / Login Required Prompt for Guests trying to access Admin tools */}
            {(view === 'registration' || view === 'edit') && userRole !== 'admin' && (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900">Admin Access Required</h2>
                <p className="text-slate-500 mt-2 max-w-sm">This section is restricted. Please log in with an administrator account to continue.</p>
                <button onClick={() => setView('login')} className="mt-8 btn-primary">GO TO LOGIN PAGE</button>
              </div>
            )}
          </div>
          
          <footer className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border-t border-slate-200 no-print">
            &copy; {new Date().getFullYear()} Divisional Secretariat Bandarawela. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
