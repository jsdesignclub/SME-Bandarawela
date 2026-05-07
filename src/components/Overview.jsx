import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Map, 
  PieChart, 
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = () => {
  const [stats, setStats] = useState({
    total: 0,
    employees: 0,
    avgIncome: 0,
    topDivision: '-',
    topCategory: '-',
    categoryData: [],
    gsStats: []
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'enterprises'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => doc.data())
        .filter(item => {
          const bizName = String(item.BusinessDetails?.name || '').toLowerCase();
          const ownerName = String(item.PersonalDetails?.nameWithInitials || '').toLowerCase();
          return !bizName.includes('name_of_business') && !ownerName.includes('name_intial');
        });
      
      const divisions = data.map(d => d.BusinessDetails?.gsDivision).filter(Boolean);
      const divisionCounts = divisions.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const topDiv = Object.entries(divisionCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || '-';

      const types = data.map(d => d.BusinessDetails?.businessType)
        .filter(t => t && !['Other', 'Others', 'None', '-', 'නැත', 'No'].includes(t.trim()));
      const typeCounts = types.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const topCat = Object.entries(typeCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || '-';
      const catData = Object.entries(typeCounts)
        .filter(([name]) => !['Other', 'Others', 'None', '-', 'නැත', 'No'].includes(name.trim()))
        .sort((a,b) => b[1] - a[1])
        .slice(0, 8); 

      const gsStats = Object.entries(divisionCounts)
        .sort((a, b) => b[1] - a[1]); // Descending order

      const totalEmployees = data.reduce((sum, item) => sum + (parseInt(item.BusinessDetails?.employees) || 0), 0);
      const avgIncome = data.length > 0 
        ? data.reduce((sum, item) => sum + (parseFloat(item.Financials?.monthlyIncome) || 0), 0) / data.length 
        : 0;

      setStats({
        total: data.length,
        employees: totalEmployees,
        avgIncome: Math.round(avgIncome),
        topDivision: topDiv,
        topCategory: topCat,
        categoryData: catData,
        gsStats: gsStats
      });
    });
    return () => unsubscribe();
  }, []);

  const Card = ({ icon: Icon, label, value, sub, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-125 ${color.split(' ')[0]}`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{sub}</p>
        </div>
        <div className={`p-3 rounded-xl shadow-sm ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 space-y-8 max-w-full mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time statistics for Bandarawela SMEs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          icon={Building2} label="Enterprises" value={stats.total} 
          sub="Total registered SMEs" color="bg-blue-600 text-white" 
        />
        <Card 
          icon={Users} label="Employment" value={stats.employees} 
          sub="Total local jobs created" color="bg-emerald-600 text-white" 
        />
        <Card 
          icon={TrendingUp} label="Top Category" value={stats.topCategory} 
          sub="Dominant business sector" color="bg-purple-600 text-white" 
        />
        <Card 
          icon={Map} label="Top Division" value={stats.topDivision} 
          sub="Highest concentration" color="bg-amber-600 text-white" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary-600" /> Sector Distribution
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registrations per Category</span>
          </div>
          
          <div className="space-y-6">
            {stats.categoryData.length > 0 ? (
              stats.categoryData.map(([category, count], idx) => {
                const maxCount = stats.categoryData[0][1] || 1;
                const percentage = (count / maxCount) * 100;
                
                const colors = [
                  'from-blue-500 to-blue-700',
                  'from-emerald-500 to-emerald-700',
                  'from-purple-500 to-purple-700',
                  'from-amber-500 to-amber-700',
                  'from-rose-500 to-rose-700',
                  'from-indigo-500 to-indigo-700',
                  'from-cyan-500 to-cyan-700',
                  'from-orange-500 to-orange-700'
                ];

                return (
                  <div key={category} className="space-y-2 group">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{category}</span>
                      <span className="text-slate-400 group-hover:text-primary-600 transition-colors">{count} SMEs</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: idx * 0.1, duration: 1, ease: "circOut" }}
                        className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full shadow-lg relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                No sector data available
              </div>
            )}
          </div>
        </div>

        {/* GS Division Breakdown */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Map size={18} className="text-primary-600" /> GS Division Stats
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sorted Descending (Largest to Smallest)</p>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px] p-4 space-y-2">
            {stats.gsStats.map(([division, count]) => (
              <div key={division} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                <span className="text-xs font-bold text-slate-700">{division}</span>
                <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-primary-600 border border-slate-100 shadow-sm">
                  {count} SMEs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
