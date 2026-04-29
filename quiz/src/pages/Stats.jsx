import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, HelpCircle, Trophy, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Stats() {
  const { user } = useSelector((state) => state.auth);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'السبت', users: 400 },
    { name: 'الأحد', users: 700 },
    { name: 'الاثنين', users: 500 },
    { name: 'الثلاثاء', users: 900 },
    { name: 'الأربعاء', users: 1100 },
    { name: 'الخميس', users: 850 },
    { name: 'الجمعة', users: 1250 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user?.token || user?.data?.token;
        const config = token ? {
          headers: { Authorization: `Bearer ${token}` }
        } : {};

        const response = await axios.get('https://knowledge-challenge-fullstack.vercel.app/api/results/stats', config);
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const cards = [
    { title: 'إجمالي المستخدمين', value: statsData?.totalUsers || '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'الأسئلة النشطة', value: statsData?.totalQuestions || '0', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'أعلى سكور', value: statsData?.maxScore ? `${statsData.maxScore}%` : '0%', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'نشاط اليوم', value: `+${statsData?.todayActivity || '0'}`, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 font-['Cairo'] pb-10" dir="rtl">
      <header className="px-2">
        <h2 className="text-2xl md:text-4xl font-black text-white">نظرة عامة</h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">إليك ملخص أداء المنصة خلال الفترة الأخيرة.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/[0.03] border border-white/10 p-5 md:p-6 rounded-[24px] md:rounded-[35px] backdrop-blur-md hover:border-blue-500/30 transition-all group"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 ${card.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon className={card.color} size={20} />
            </div>
            <p className="text-gray-400 font-bold text-xs md:text-sm">{card.title}</p>
            <h3 className="text-2xl md:text-3xl font-black mt-1 text-white tracking-tight">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/[0.02] border border-white/10 rounded-[30px] md:rounded-[45px] p-4 md:p-8 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
          <h3 className="text-lg md:text-xl font-bold text-white">نمو المستخدمين (أسبوعي)</h3>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
             <span className="text-[10px] md:text-xs text-gray-400 font-bold">تحديث مباشر</span>
          </div>
        </div>

        <div className="h-[250px] md:h-[350px] w-full -mr-4 md:mr-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ dy: 10 }}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ dx: -5 }}
              />
              <Tooltip 
                cursor={{ stroke: '#3b82f620', strokeWidth: 2 }}
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #ffffff10', 
                  borderRadius: '16px', 
                  textAlign: 'right',
                  fontSize: '12px',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' 
                }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

export default Stats;