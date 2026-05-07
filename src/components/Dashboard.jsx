import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Building2, 
  FileSpreadsheet, 
  Eye, 
  ArrowUpRight,
  Filter,
  Download,
  Phone,
  Pencil,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ onEdit, userRole }) => {
  const [enterprises, setEnterprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    employees: 0,
    avgIncome: 0
  });
  const [typeFilter, setTypeFilter] = useState('All');
  const [gsFilter, setGsFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'enterprises'), 
      (snapshot) => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => {
            const bizName = String(item.BusinessDetails?.name || '').toLowerCase();
            const ownerName = String(item.PersonalDetails?.nameWithInitials || '').toLowerCase();
            return !bizName.includes('name_of_business') && !ownerName.includes('name_intial');
          }); 
        setEnterprises(data);
        
        // Calculate Stats
        const totalEmployees = data.reduce((sum, item) => sum + (parseInt(item.BusinessDetails?.employees) || 0), 0);
        const avgIncome = data.length > 0 
          ? data.reduce((sum, item) => sum + (parseFloat(item.Financials?.monthlyIncome) || 0), 0) / data.length 
          : 0;
        
        setStats({
          total: data.length,
          employees: totalEmployees,
          avgIncome: Math.round(avgIncome)
        });
      },
      (error) => {
        console.error("Firestore Error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const filtered = enterprises.filter(item => {
    const matchesSearch = 
      (item.BusinessDetails?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.PersonalDetails?.nic?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.PersonalDetails?.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.BusinessDetails?.gsDivision?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.BusinessDetails?.businessType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.BusinessDetails?.regNo?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || item.BusinessDetails?.businessType === typeFilter;
    const matchesGS = gsFilter === 'All' || item.BusinessDetails?.gsDivision === gsFilter;

    return matchesSearch && matchesType && matchesGS;
  });

  const visibleRecords = rowsPerPage === 'All' ? filtered : filtered.slice(0, rowsPerPage);

  const businessTypes = ['All', ...new Set(enterprises.map(item => item.BusinessDetails?.businessType).filter(Boolean))];
  const gsDivisions = ['All', ...new Set(enterprises.map(item => item.BusinessDetails?.gsDivision).filter(Boolean))];

  const exportToCSV = () => {
    const headers = ['Owner Name', 'Phone', 'Business Name', 'Business Type', 'Reg No', 'GS Division', 'Address'];
    const rows = filtered.map(item => [
      `"${item.PersonalDetails?.nameWithInitials || '-'}"`,
      `"${item.PersonalDetails?.phone || '-'}"`,
      `"${item.BusinessDetails?.name || '-'}"`,
      `"${item.BusinessDetails?.businessType || '-'}"`,
      `"${item.BusinessDetails?.regNo || '-'}"`,
      `"${item.BusinessDetails?.gsDivision || '-'}"`,
      `"${item.BusinessDetails?.address?.replace(/"/g, '""') || '-'}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `SME_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async (id, name) => {
    if (userRole !== 'admin') return;
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'enterprises', id));
        alert('Record deleted successfully');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record');
      }
    }
  };

  return (
    <div className="max-w-full mx-auto py-8 px-4 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Business Directory</h1>
          <p className="text-slate-500 font-medium">Managing {enterprises.length} enterprise records in Bandarawela</p>
        </div>
        <div className="flex gap-3 no-print">
          <button 
            onClick={exportToCSV}
            className="btn-secondary text-sm h-11 shadow-sm"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            onClick={handlePrint}
            className="btn-primary text-sm h-11 px-4 shadow-lg shadow-primary-600/20"
          >
            <FileSpreadsheet size={18} /> Print Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 no-print">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, NIC, or business..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option disabled>Business Type</option>
              {businessTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
            </select>

            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
              value={gsFilter}
              onChange={(e) => setGsFilter(e.target.value)}
            >
              <option disabled>GS Division</option>
              {gsDivisions.map(gs => <option key={gs} value={gs}>{gs === 'All' ? 'All Divisions' : gs}</option>)}
            </select>

             <button 
              onClick={() => { setSearchTerm(''); setTypeFilter('All'); setGsFilter('All'); setRowsPerPage(20); }}
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-xs font-bold"
             >
               RESET
             </button>

             <div className="flex items-center gap-2 ml-auto">
               <span className="text-xs font-bold text-slate-400 uppercase">Show:</span>
               <select 
                 className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none focus:border-primary-500 transition-all cursor-pointer"
                 value={rowsPerPage}
                 onChange={(e) => setRowsPerPage(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
               >
                 <option value={20}>20 Rows</option>
                 <option value={50}>50 Rows</option>
                 <option value={100}>100 Rows</option>
                 <option value="All">All</option>
               </select>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Owner Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Business Type</th>
                <th className="px-6 py-4">Reg. No</th>
                <th className="px-6 py-4">GS Division</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-right no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRecords.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  key={item.id} 
                  className="hover:bg-slate-50 transition-colors group text-sm"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{(!item.PersonalDetails?.nameWithInitials || ['no', 'none', 'නැත', 'No'].includes(item.PersonalDetails?.nameWithInitials)) ? '-' : item.PersonalDetails?.nameWithInitials}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {(!item.PersonalDetails?.phone || ['no', 'none', 'නැත', 'No'].includes(item.PersonalDetails?.phone)) ? '-' : item.PersonalDetails?.phone}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {(!item.BusinessDetails?.name || ['no', 'none', 'නැත', 'No'].includes(item.BusinessDetails?.name)) ? '-' : item.BusinessDetails?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600 italic">{item.BusinessDetails?.businessType || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${(!item.BusinessDetails?.regNo || ['no', 'none', 'නැත', 'No', 'නැත.'].includes(String(item.BusinessDetails?.regNo).trim())) ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {(!item.BusinessDetails?.regNo || ['no', 'none', 'නැත', 'No', 'නැත.'].includes(String(item.BusinessDetails?.regNo).trim())) ? '-' : item.BusinessDetails?.regNo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700 font-medium">{item.BusinessDetails?.gsDivision || '-'}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-xs text-slate-600 line-clamp-2" title={item.BusinessDetails?.address}>
                      {item.BusinessDetails?.address || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right no-print">
                    <div className="flex justify-end gap-2">
                      {userRole === 'admin' && (
                        <>
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                            title="Edit Record"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.BusinessDetails?.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Building2 size={48} className="mx-auto mb-4 opacity-20" />
              <p>No matching records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
