import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Medal, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // سحب بيانات اليوزر من الريدكس للوصول للتوكن
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const token = user?.token || user?.data?.token;
        
        // إرسال التوكن في الهيدر لأن الراوت محمي (Protected)
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        const response = await axios.get('https://knowledge-challenge-fullstack.vercel.app/api/results/leaderboard', config);
        setLeaders(response.data);
      } catch (error) {
        console.error("خطأ في جلب المتصدرين:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaders();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Cairo']" dir="rtl">
      
      {/* تأثيرات الإضاءة */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-[700px] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Trophy className="text-yellow-500 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" size={32} />
            لوحة الأبطال
          </h1>
          <button 
            onClick={() => navigate('/')}
            className="group text-gray-400 hover:text-white transition-all flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20"
          >
            الرئيسية <ArrowRight size={18} className="group-hover:translate-x-[-4px] transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            {leaders.length > 0 ? leaders.map((leader, index) => (
              <motion.div 
                key={leader._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl 
                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' : 
                      index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/20' : 
                      index === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                      'bg-white/5 text-gray-500 border border-white/5'}`}>
                    {index === 0 ? <Medal size={24} /> : index + 1}
                  </div>
                  <div>
                    <div className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                        {leader.user?.username || "لاعب مجهول"}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {new Date(leader.createdAt).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-400">
                  {leader.score} <span className="text-sm text-gray-500 font-normal">نقطة</span>
                </div>
              </motion.div>
            )) : (
                <p className="text-center text-gray-500 py-10">لا يوجد متصدرين بعد.. كن الأول!</p>
            )}
          </div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quiz')}
          className="w-full mt-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
        >
          جرب حظك الآن وتصدّر القائمة
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Leaderboard;