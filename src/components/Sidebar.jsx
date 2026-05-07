import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  LogOut, 
  LogIn,
  X 
} from 'lucide-react';

const Sidebar = ({ activeView, setView, collapsed, setCollapsed, userRole, isLoggedIn, mobileOpen, setMobileOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Business List', icon: Users },
    { id: 'registration', label: 'New Registration', icon: UserPlus, adminOnly: true },
    { id: 'users', label: 'User Management', icon: ShieldCheck, adminOnly: true },
    { id: 'login', label: 'Staff Login', icon: LogIn, guestOnly: true },
  ];

  const visibleItems = menuItems.filter(item => {
    if (item.adminOnly) return userRole === 'admin';
    if (item.guestOnly) return !isLoggedIn;
    return true;
  });

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/50 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30 flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          {(!collapsed || mobileOpen) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden whitespace-nowrap">
              <span className="text-xl font-bold text-white block leading-tight">SME</span>
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Bandarawela</span>
            </motion.div>
          )}
        </div>
        {mobileOpen && (
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 p-2">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id);
              if (window.innerWidth < 1024) setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all group ${
              activeView === item.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon size={22} className={activeView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
            {(!collapsed || mobileOpen) && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-800/50 space-y-2 mb-4">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all text-sm font-medium">
          <Settings size={20} />
          {(!collapsed || mobileOpen) && <span>Settings</span>}
        </button>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all text-sm font-medium"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden no-print"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside 
        variants={sidebarVariants}
        animate={mobileOpen ? 'open' : 'closed'}
        className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-400 z-[70] lg:hidden no-print"
      >
        <Content />
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-900 text-slate-400 transition-all duration-500 ease-in-out h-screen sticky top-0 z-50 no-print ${collapsed ? 'w-20' : 'w-72'}`}>
        <Content />
      </aside>
    </>
  );
};

export default Sidebar;
