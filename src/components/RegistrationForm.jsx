import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  User, 
  Briefcase, 
  Coins, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Check,
  Building2,
  MapPin,
  ClipboardCheck,
  FileText
} from 'lucide-react';

const GS_DIVISIONS = [
  "Bandarawela", "Diyatalawa", "Bindunuwewa", "Kebillawela", "Heeloya", 
  "Ettampitiya", "Ambadanda", "Kandegedara", "Wewathenna", "Kirioruwa", 
  "Pattiyagedara", "Diganathenna", "Malastha", "Makulella", "Udapone", "Other"
];

const BUSINESS_TYPES = [
  "Manufacturing", "Services", "Tourism", "Agriculture", "Information Technology", 
  "Retail / Trade", "Food & Beverage", "Apparel & Garment", "Livestock", 
  "Handicraft", "Construction", "Education", "Other"
];

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    PersonalDetails: {
      nameWithInitials: '',
      fullName: '',
      nic: '',
      address: '',
      phone: '',
      whatsapp: ''
    },
    BusinessDetails: {
      name: '',
      address: '',
      regNo: '',
      regDate: '',
      employees: '',
      gsDivision: '',
      businessType: ''
    },
    Financials: {
      productName: '',
      productionVolume: '',
      monthlySales: '',
      monthlyIncome: '',
      totalInvestment: ''
    },
    Compliance: {
      accountingRecords: false,
      floorPlan: false,
      marketingPlan: false,
      productionProcess: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'enterprises'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      alert('SME Registration Successful!');
      window.location.reload();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error submitting form. Please check console.');
    }
    setLoading(false);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12 space-x-2 md:space-x-4">
      {[
        { id: 1, title: 'Personal', icon: User },
        { id: 2, title: 'Business', icon: Building2 },
        { id: 3, title: 'Financials', icon: Coins },
        { id: 4, title: 'Strategy', icon: ClipboardCheck }
      ].map((s) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
              step >= s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'bg-slate-100 text-slate-400'
            }`}>
              <s.icon size={18} />
            </div>
            <span className={`text-[9px] md:text-[10px] mt-2 font-bold uppercase tracking-tighter ${
              step >= s.id ? 'text-primary-600' : 'text-slate-400'
            }`}>{s.title}</span>
          </div>
          {s.id < 4 && <div className={`w-6 md:w-12 h-0.5 rounded-full ${step > s.id ? 'bg-primary-600' : 'bg-slate-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="h-40 bg-gradient-to-r from-primary-600 to-primary-900 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-2xl font-bold mb-1">SME Registration</h1>
            <p className="text-primary-100 opacity-90 text-sm flex items-center gap-2">
              <MapPin size={14} /> Divisional Secretariat Bandarawela
            </p>
          </div>
          <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-full px-4 py-1 text-xs text-white border border-white/20 font-bold">
            Step {step} of 4
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <StepIndicator />

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name with Initials</label>
                      <input className="input-field" placeholder="A.B.C. Perera" value={formData.PersonalDetails.nameWithInitials} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, nameWithInitials: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">NIC Number</label>
                      <input className="input-field" placeholder="123456789V" value={formData.PersonalDetails.nic} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, nic: e.target.value}})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input className="input-field" placeholder="Enter full name" value={formData.PersonalDetails.fullName} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, fullName: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                      <input className="input-field" placeholder="077 123 4567" value={formData.PersonalDetails.phone} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, phone: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label>
                      <input className="input-field" placeholder="077 123 4567" value={formData.PersonalDetails.whatsapp} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, whatsapp: e.target.value}})} />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button type="button" onClick={() => setStep(2)} className="btn-primary group">
                      Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Name</label>
                      <input className="input-field" placeholder="Enter enterprise name" value={formData.BusinessDetails.name} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, name: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">GS Division</label>
                      <select 
                        className="input-field cursor-pointer" 
                        value={formData.BusinessDetails.gsDivision} 
                        onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, gsDivision: e.target.value}})}
                      >
                        <option value="">Select GS Division</option>
                        {GS_DIVISIONS.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Registration No.</label>
                      <input className="input-field" placeholder="Reg/123/2024" value={formData.BusinessDetails.regNo} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, regNo: e.target.value}})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Address</label>
                      <textarea className="input-field min-h-[100px] py-3" placeholder="Enter business address" value={formData.BusinessDetails.address} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, address: e.target.value}})} />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary"><ChevronLeft size={18} /> Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary group">Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Type</label>
                      <select 
                        className="input-field cursor-pointer" 
                        value={formData.BusinessDetails.businessType} 
                        onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, businessType: e.target.value}})}
                      >
                        <option value="">Select Business Type</option>
                        {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">No. of Employees</label><input className="input-field" type="number" value={formData.BusinessDetails.employees} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, employees: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Income (Rs.)</label><input className="input-field" type="number" value={formData.Financials.monthlyIncome} onChange={(e) => setFormData({...formData, Financials: {...formData.Financials, monthlyIncome: e.target.value}})} /></div>
                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Sales (Rs.)</label><input className="input-field" type="number" value={formData.Financials.monthlySales} onChange={(e) => setFormData({...formData, Financials: {...formData.Financials, monthlySales: e.target.value}})} /></div>
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary"><ChevronLeft size={18} /> Back</button>
                    <button type="button" onClick={() => setStep(4)} className="btn-primary group">Next Step <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-primary-600 pl-3">Business Documentation & Strategy</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'accountingRecords', label: 'Maintaining Proper Accounting Records', sub: 'Includes daily sales logs, expense tracking, and receipts.' },
                      { key: 'floorPlan', label: 'Business Floor Plan Available', sub: 'A professional or rough diagram of the business premises.' },
                      { key: 'marketingPlan', label: 'Marketing Strategy / Plan Ready', sub: 'A clear plan for reaching customers and promoting products.' },
                      { key: 'productionProcess', label: 'Documented Production Process', sub: 'Step-by-step documentation of how products are made.' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer group hover:bg-white hover:border-primary-200 transition-all">
                        <div className="relative mt-1">
                          <input type="checkbox" className="sr-only" checked={formData.Compliance[item.key]} onChange={(e) => setFormData({...formData, Compliance: {...formData.Compliance, [item.key]: e.target.checked}})} />
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.Compliance[item.key] ? 'bg-primary-600 border-primary-600 shadow-sm' : 'bg-white border-slate-300'}`}>
                            {formData.Compliance[item.key] && <Check size={14} className="text-white" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm"><CheckCircle2 size={24} /></div>
                    <div>
                      <h4 className="text-sm font-bold text-primary-900">Ready to register?</h4>
                      <p className="text-xs text-primary-600">Please review all 4 steps before final submission.</p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button type="button" onClick={() => setStep(3)} className="btn-secondary"><ChevronLeft size={18} /> Back</button>
                    <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary min-w-[200px]">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Complete Registration <CheckCircle2 size={18} /></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
