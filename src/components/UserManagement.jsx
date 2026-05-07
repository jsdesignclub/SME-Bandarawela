import React, { useState, useEffect } from 'react';
import { db, auth, secondaryAuth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  UserCircle, 
  Trash2,
  Mail,
  Shield,
  Search,
  CheckCircle2,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: '', password: '', role: 'manager' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use secondaryAuth to create user without logging out the current admin
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUserData.email, newUserData.password);
      const user = userCredential.user;
      
      // Immediately sign out from secondary instance
      await signOut(secondaryAuth);
      
      // Save role and data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: newUserData.email,
        role: newUserData.role,
        createdAt: new Date().toISOString()
      });

      alert(`Staff account created successfully for ${newUserData.email}!`);
      setShowAddModal(false);
      setNewUserData({ email: '', password: '', role: 'manager' });
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id, email) => {
    if (window.confirm(`Remove access for ${email}?`)) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset email has been sent to ${email}`);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 font-medium">Manage staff access and permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 px-6 shadow-xl shadow-primary-600/20"
        >
          <UserPlus size={18} /> ADD NEW STAFF
        </button>
      </div>

      {/* User Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="relative max-w-xs w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search staff..."
               className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             {filteredUsers.length} TOTAL STAFF
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-4">Staff Member</th>
                <th className="px-8 py-4">System Role</th>
                <th className="px-8 py-4">Created On</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.email}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' ? 'bg-primary-50 text-primary-600 border-primary-100' : 
                      user.role === 'manager' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(user.email)}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                        title="Send Password Reset Email"
                      >
                        <Key size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-600/20">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Add New Staff</h3>
                  <p className="text-[10px] text-slate-500 font-bold">Assign roles and permissions</p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" required
                      className="input-field pl-12"
                      placeholder="staff@sme.lk"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manual Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="password" required
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['admin', 'manager', 'user'].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setNewUserData({...newUserData, role: role})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          newUserData.role === role 
                            ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-primary-300'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/20"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'CREATE ACCESS ACCOUNT'}
                </button>
                
                <p className="text-[9px] text-slate-400 text-center font-medium">
                  Note: Staff will need to register with this email to activate their role.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
