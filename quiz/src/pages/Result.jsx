import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RefreshCcw, Home, Medal } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSaved = useRef(false); // لمنع تكرار الحفظ مرتين (Strict Mode)

  const finalScore = location.state?.finalScore || 0;
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const saveToDB = async () => {
      // 1. استخراج التوكن بشكل مرن
      const token = user?.token || user?.data?.token;

      if (!token) {
        console.error("❌ لا يوجد توكن: اليوزر مش عامل تسجيل دخول");
        return;
      }

      if (hasSaved.current) return; // لو اتسيف مرة خلاص

      try {
        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        };

        // 2. تجهيز الداتا بالظبط زي الموديل (score, totalQuestions, category)
        const resultData = {
          score: Number(finalScore),
          totalQuestions: 10, // تأكد من إجمالي الأسئلة
          category: "General" // لازم تتبعت لأنها required في الموديل
        };

        const response = await axios.post('https://knowledge-challenge-fullstack-pt8i.vercel.app/api/results/save', resultData, config);
        
        if (response.status === 201 || response.status === 200) {
          console.log("✅ تم حفظ النتيجة في قاعدة البيانات!");
          hasSaved.current = true;
        }
      } catch (error) {
        console.error("❌ خطأ السيرفر:", error.response?.data?.message || error.message);
      }
    };

    saveToDB();
  }, [finalScore, user]);

  // لوجيك رسائل التقييم
  const getFeedback = () => {
    if (finalScore >= 30) return { msg: "أداء أسطوري!", color: "text-emerald-400" };
    if (finalScore >= 10) return { msg: "عاش يا بطل، كمل!", color: "text-blue-400" };
    return { msg: "حاول تاني، الجاية أحسن", color: "text-red-400" };
  };

  const feedback = getFeedback();

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Cairo']" dir="rtl">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-[550px] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[40px] p-10 text-center shadow-2xl relative"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-6"
        >
          <Trophy size={100} className="text-yellow-500 filter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
        </motion.div>

        <h1 className="text-4xl font-black mb-2">انتهى الكويز!</h1>
        <p className={`text-2xl font-bold mb-8 ${feedback.color}`}>{feedback.msg}</p>

        <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/5 relative">
          <span className="text-gray-400 text-lg block mb-2 font-medium">نتيجتك النهائية</span>
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            {finalScore}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/quiz')}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 py-5 rounded-2xl font-bold text-xl shadow-lg transition-all"
          >
            <RefreshCcw size={22} />
            إعادة التحدي
          </motion.button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 py-4 rounded-2xl font-bold text-yellow-500 hover:bg-yellow-500/20 transition-all"
            >
              <Medal size={20} />
              لوحة الأبطال
            </button>

            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              <Home size={20} />
              الرئيسية
            </button>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 text-white/[0.02] text-8xl font-black select-none pointer-events-none uppercase tracking-widest">
        Good Job
      </div>
    </div>
  );
}

export default Result;