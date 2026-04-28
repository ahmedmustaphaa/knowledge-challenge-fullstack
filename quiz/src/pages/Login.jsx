import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, LogIn, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, verifyOTP, reset, forgotPassword, resetPassword } from '../redux/authSlice';

function Auth() {
  // الحالات الممكنة: register, login, forgot, reset
  const [mode, setMode] = useState('login'); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, message, isWaitingOTP, user, isResetMailSent } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(reset());
    }
    if (user) {
      navigate('/quiz');
    }
    // لو إيميل الاستعادة اتبعت بنجاح، انقل اليوزر لمرحلة إدخال الباسورد الجديد
    if (isResetMailSent && mode === 'forgot') {
      setMode('reset');
    }
  }, [isError, message, user, navigate, dispatch, isResetMailSent, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isWaitingOTP) {
      dispatch(verifyOTP({ email: formData.email, otp }));
    } else if (mode === 'register') {
      dispatch(register(formData));
    } else if (mode === 'login') {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else if (mode === 'forgot') {
      dispatch(forgotPassword({ email: formData.email }));
    } else if (mode === 'reset') {
      dispatch(resetPassword({ email: formData.email, otp, password: newPassword }));
      // بعد النجاح رجعه لليجن
      if (!isLoading && !isError) setMode('login');
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    dispatch(reset());
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden font-['Cairo']" dir="rtl">
      {/* الخلفية */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div 
        layout 
        className="z-10 w-full max-w-[480px] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {isWaitingOTP ? (
            /* --- مرحلة الـ OTP للتسجيل --- */
            <motion.div key="otp-verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/20 mb-4">
                  <ShieldCheck className="text-blue-400" size={32} />
                </div>
                <h1 className="text-3xl font-black">تأكيد الحساب</h1>
                <p className="text-gray-500 mt-2">أدخل الكود المرسل لـ <span className="text-purple-400">{formData.email}</span></p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" maxLength="6" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 text-center text-3xl font-bold tracking-[10px] outline-none transition-all focus:border-blue-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-xl flex items-center justify-center transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : "تأكيد الكود"}
                </button>
              </form>
            </motion.div>
          ) : mode === 'forgot' ? (
            /* --- مرحلة نسيان الباسورد --- */
            <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => toggleMode('login')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition-all">
                <ArrowLeft size={18} /> العودة للدخول
              </button>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black">نسيت الباسورد؟</h1>
                <p className="text-gray-500 mt-2">أدخل إيميلك لإرسال كود الاستعادة</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input type="email" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-blue-500 outline-none text-left" placeholder="mail@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black text-xl transition-all">
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "إرسال الكود"}
                </button>
              </form>
            </motion.div>
          ) : mode === 'reset' ? (
            /* --- مرحلة تعيين الباسورد الجديد --- */
            <motion.div key="reset" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/20 mb-4">
                  <KeyRound className="text-orange-400" size={32} />
                </div>
                <h1 className="text-3xl font-black">كلمة مرور جديدة</h1>
                <p className="text-gray-500 mt-2">أدخل الكود والباسورد الجديد</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" maxLength="6" placeholder="الكود (OTP)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-xl font-bold outline-none focus:border-orange-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <input type="password" placeholder="كلمة المرور الجديدة" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-orange-500 text-center" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl font-black text-xl transition-all">
                  {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "تحديث الباسورد"}
                </button>
              </form>
            </motion.div>
          ) : (
            /* --- مرحلة الدخول والتسجيل --- */
            <motion.div key={mode} initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}>
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/20 mb-4">
                  {mode === 'register' ? <UserPlus className="text-purple-400" size={32} /> : <LogIn className="text-purple-400" size={32} />}
                </div>
                <h1 className="text-3xl font-black">{mode === 'register' ? 'حساب جديد' : 'مرحباً بعودتك'}</h1>
                <p className="text-gray-500 mt-2">{mode === 'register' ? 'انضم لمجتمعنا وابدأ التحدي' : 'سجل دخولك للمتابعة'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-purple-500 outline-none" placeholder="الاسم بالكامل" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input type="email" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-purple-500 outline-none text-left" placeholder="mail@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input type="password" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 focus:border-purple-500 outline-none text-left" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>

                {mode === 'login' && (
                  <button type="button" onClick={() => toggleMode('forgot')} className="text-sm text-purple-400 hover:underline block mr-auto">نسيت كلمة المرور؟</button>
                )}

                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : <>{mode === 'register' ? 'إنشاء حساب' : 'دخول'} <ArrowRight size={20} /></>}
                </button>
              </form>

              <p className="text-center mt-8 text-gray-500">
                {mode === 'register' ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
                <button onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')} className="text-purple-400 font-bold mr-2 hover:underline focus:outline-none">
                  {mode === 'register' ? 'سجل دخول' : 'أنشئ حسابك'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Auth;