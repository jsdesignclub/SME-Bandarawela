import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  Building2, 
  Coins, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  CheckCircle2,
  Check,
  X,
  ClipboardCheck
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

const EditForm = ({ enterprise, onCancel, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...enterprise,
    Compliance: enterprise.Compliance || {
      accountingRecords: false,
      floorPlan: false,
      marketingPlan: false,
      productionProcess: false
    }
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'enterprises', enterprise.id);
      const { id, ...updateData } = formData;
      await updateDoc(docRef, updateData);
      alert('SME Record Updated Successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Error updating record. Check console.');
    }
    setLoading(false);
  };

  const steps = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Business', icon: Building2 },
    { id: 3, title: 'Financials', icon: Coins },
    { id: 4, title: 'Strategy', icon: ClipboardCheck }
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12 space-x-2 md:space-x-4">
      {steps.map((s) => (
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><Building2 size={20} /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit SME Record</h2>
              <p className="text-xs text-slate-500">Managing: {enterprise.BusinessDetails?.name || 'SME'}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>

        <div className="p-8">
          <StepIndicator />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Name with Initials</label><input className="input-field" value={formData.PersonalDetails?.nameWithInitials} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, nameWithInitials: e.target.value}})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">NIC Number</label><input className="input-field" value={formData.PersonalDetails?.nic} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, nic: e.target.value}})} /></div>
                  <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label><input className="input-field" value={formData.PersonalDetails?.fullName} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, fullName: e.target.value}})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label><input className="input-field" value={formData.PersonalDetails?.phone} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, phone: e.target.value}})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label><input className="input-field" value={formData.PersonalDetails?.whatsapp} onChange={(e) => setFormData({...formData, PersonalDetails: {...formData.PersonalDetails, whatsapp: e.target.value}})} /></div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Name</label><input className="input-field" value={formData.BusinessDetails?.name} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, name: e.target.value}})} /></div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">GS Division</label>
                    <select 
                      className="input-field cursor-pointer" 
                      value={formData.BusinessDetails?.gsDivision} 
                      onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, gsDivision: e.target.value}})}
                    >
                      <option value="">Select GS Division</option>
                      {GS_DIVISIONS.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                      {!GS_DIVISIONS.includes(formData.BusinessDetails?.gsDivision) && formData.BusinessDetails?.gsDivision && (
                        <option value={formData.BusinessDetails.gsDivision}>{formData.BusinessDetails.gsDivision} (Original)</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Registration No.</label><input className="input-field" value={formData.BusinessDetails?.regNo} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, regNo: e.target.value}})} /></div>
                  <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Address</label><textarea className="input-field min-h-[100px] py-3" value={formData.BusinessDetails?.address} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, address: e.target.value}})} /></div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Business Type</label>
                    <select 
                      className="input-field cursor-pointer" 
                      value={formData.BusinessDetails?.businessType} 
                      onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, businessType: e.target.value}})}
                    >
                      <option value="">Select Business Type</option>
                      {BUSINESS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      {!BUSINESS_TYPES.includes(formData.BusinessDetails?.businessType) && formData.BusinessDetails?.businessType && (
                        <option value={formData.BusinessDetails.businessType}>{formData.BusinessDetails.businessType} (Original)</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">No. of Employees</label><input className="input-field" type="number" value={formData.BusinessDetails?.employees} onChange={(e) => setFormData({...formData, BusinessDetails: {...formData.BusinessDetails, employees: e.target.value}})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Income (Rs.)</label><input className="input-field" type="number" value={formData.Financials?.monthlyIncome} onChange={(e) => setFormData({...formData, Financials: {...formData.Financials, monthlyIncome: e.target.value}})} /></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Monthly Sales (Rs.)</label><input className="input-field" type="number" value={formData.Financials?.monthlySales} onChange={(e) => setFormData({...formData, Financials: {...formData.Financials, monthlySales: e.target.value}})} /></div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
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
                      <div><p className="text-sm font-bold text-slate-800">{item.label}</p><p className="text-xs text-slate-500">{item.sub}</p></div>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between gap-4">
            <button onClick={() => step > 1 ? setStep(step - 1) : onCancel()} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"><ChevronLeft size={20} /> {step === 1 ? 'Cancel' : 'Back'}</button>
            <button onClick={() => step < 4 ? setStep(step + 1) : handleUpdate()} disabled={loading} className="btn-primary min-w-[160px]">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{step === 4 ? <Save size={20} /> : <ChevronRight size={20} />}{step === 4 ? 'Save Changes' : 'Next Step'}</>}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditForm;
