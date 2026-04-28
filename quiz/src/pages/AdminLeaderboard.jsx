import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Trash2, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function AdminLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchLeaders = async () => {
    try {
      setIsLoading(true);
      const token = user?.token || user?.data?.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5000/api/results/leaderboard', config);
      setLeaders(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, [user]);

  const handleDelete = async (resultId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه النتيجة نهائياً؟")) {
      try {
        const token = user?.token || user?.data?.token;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        await axios.delete(`http://localhost:5000/api/results/${resultId}`, config);
        setLeaders(leaders.filter(item => item._id !== resultId));
        alert("تم حذف النتيجة بنجاح");
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert("فشل في حذف النتيجة");
      }
    }
  };

  return (
    <div className="space-y-6 font-['Cairo'] pb-10" dir="rtl">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 bg-white/[0.03] p-6 rounded-[30px] border border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white">إدارة المتصدرين</h2>
          <p className="text-gray-500 text-sm">مراقبة الترتيب العام وحذف النتائج المشبوهة.</p>
        </div>
        <button className="w-full sm:w-auto text-red-400 border border-red-400/20 px-6 py-3 rounded-2xl text-xs md:text-sm font-bold hover:bg-red-400/10 transition-all active:scale-95">
          تصفير الجدول بالكامل
        </button>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="grid gap-4">
            {leaders.length > 0 ? leaders.map((player, index) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.03] border border-white/10 p-4 md:p-5 rounded-[25px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-blue-500/30 transition-all backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl shrink-0 ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500 shadow-lg shadow-yellow-500/10' : 
                    index === 1 ? 'bg-gray-400/20 text-gray-400' : 
                    index === 2 ? 'bg-orange-500/20 text-orange-500' : 
                    'bg-white/5 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-white text-base md:text-lg truncate">
                      {player.user?.username || "مستخدم مجهول"}
                    </h4>
                    <p className="text-[10px] md:text-xs text-gray-500 truncate">
                      {player.user?.email} • {new Date(player.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 md:gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Score</p>
                    <p className="text-xl md:text-2xl font-black text-blue-400">{player.score}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(player._id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-white/[0.02] rounded-[30px] border border-white/5 text-gray-500">
                لا توجد بيانات متاحة حالياً.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLeaderboard;