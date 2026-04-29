import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, X, Save, Loader2, Tag, HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQuestions, createQuestion, resetAdmin } from '../redux/adminSlice';
import axios from 'axios';

function QuestionsBank() {
  const dispatch = useDispatch();
  const { questions, isLoading, isSuccess } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: '',
    difficulty: 'متوسط'
  });

  useEffect(() => {
    dispatch(getAllQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
      setFormData({ questionText: '', options: ['', '', '', ''], correctAnswer: '', category: '', difficulty: 'متوسط' });
      dispatch(resetAdmin());
      dispatch(getAllQuestions());
    }
  }, [isSuccess, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      try {
        const token = user?.token || user?.data?.token;
        await axios.delete(`https://knowledge-challenge-fullstack.vercel.app/api/quistion/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(getAllQuestions());
      } catch (error) {
        alert("فشل الحذف");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.correctAnswer) return alert("الرجاء اختيار الإجابة الصحيحة");
    dispatch(createQuestion(formData));
  };

  return (
    <div className="space-y-6 text-white font-['Cairo'] pb-10 px-2 md:px-0" dir="rtl">
      
      {/* Header Section */}
      <div className="bg-white/[0.03] p-6 md:p-8 rounded-[30px] border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black">بنك الأسئلة</h2>
          <p className="text-gray-500 mt-1 text-sm">({questions?.length || 0} سؤال متوفر)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={22} /> إضافة سؤال جديد
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input type="text" placeholder="ابحث عن سؤال..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-blue-500 outline-none transition-all text-sm" />
      </div>

      {/* Questions List/Table */}
      <div className="space-y-4">
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-white/5 rounded-t-3xl border-b border-white/10 text-gray-400 text-sm font-bold">
          <div className="col-span-8">السؤال</div>
          <div className="col-span-2 text-center">التصنيف</div>
          <div className="col-span-2 text-center">الإجراءات</div>
        </div>

        {/* Content */}
        {isLoading && !questions.length ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={40} /></div>
        ) : (
          questions?.map((q, index) => (
            <motion.div 
              key={q._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/10 p-5 md:p-0 md:px-8 md:py-6 rounded-[25px] md:rounded-none md:grid md:grid-cols-12 md:items-center md:gap-4 hover:bg-white/[0.05] transition-all group"
            >
              {/* Mobile View: Info Badges */}
              <div className="flex md:hidden justify-between items-center mb-3">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/10 flex items-center gap-1">
                  <Tag size={10} /> {q.category || 'عام'}
                </span>
                <span className="text-gray-600 text-[10px] font-bold">#{index + 1}</span>
              </div>

              {/* Question Text */}
              <div className="md:col-span-8 flex items-start gap-3">
                <HelpCircle className="text-blue-500 shrink-0 mt-1 hidden md:block" size={18} />
                <p className="text-sm md:text-base font-medium leading-relaxed">{q.questionText}</p>
              </div>

              {/* Desktop Category Badge */}
              <div className="hidden md:flex md:col-span-2 justify-center">
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-xl text-xs font-bold border border-purple-500/10">
                  {q.category || 'عام'}
                </span>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex justify-end md:justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-white/5">
                <button 
                  onClick={() => handleDelete(q._id)} 
                  className="w-full md:w-auto flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                  <Trash2 size={16} />
                  <span className="md:hidden">حذف السؤال</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal - إضافة سؤال */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-[#0f1115] border border-white/10 w-full max-w-2xl rounded-[35px] p-6 md:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">إضافة سؤال جديد</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-bold px-1 uppercase tracking-wider">نص السؤال</label>
                  <textarea required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all min-h-[100px] text-sm" value={formData.questionText} onChange={(e) => setFormData({...formData, questionText: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.options.map((opt, i) => (
                    <div key={i}>
                      <label className="block text-[10px] text-gray-400 mb-2 font-bold px-1">الاختيار {i + 1}</label>
                      <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500 text-sm" value={opt} onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[i] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-2 font-bold px-1">الإجابة الصحيحة</label>
                    <select required className="w-full bg-[#1a1c21] border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500 text-sm appearance-none cursor-pointer" value={formData.correctAnswer} onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}>
                      <option value="" disabled>اختر الإجابة</option>
                      {formData.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-2 font-bold px-1">التصنيف</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500 text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                  </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mt-4">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> حفظ السؤال في البنك</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestionsBank;