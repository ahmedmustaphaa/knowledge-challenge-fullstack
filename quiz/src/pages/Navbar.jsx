import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Sparkles, Zap, BrainCircuit, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* Background Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px]" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px]" 
      />

      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 right-[10%] text-purple-500/20 hidden lg:block">
        <BrainCircuit size={140} strokeWidth={1} />
      </motion.div>
      <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-20 left-[10%] text-blue-500/20 hidden lg:block" style={{ transitionDelay: '2s' }}>
        <Zap size={120} strokeWidth={1} />
      </motion.div>

      {/* --- Main Card --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[1000px] group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-[40px] md:rounded-[60px] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-[#0a0f1e]/60 backdrop-blur-[50px] border border-white/10 rounded-[40px] md:rounded-[60px] p-8 md:p-16 lg:p-24 overflow-hidden shadow-2xl text-center">
          
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

          {/* Trophy Icon */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="flex justify-center mb-8 md:mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-6 md:p-8 rounded-[25px] md:rounded-[35px] shadow-[0_20px_50px_rgba(251,191,36,0.2)] border border-white/20">
                <Trophy className="w-12 h-12 md:w-[70px] md:h-[70px] text-[#030712]" strokeWidth={2.5} />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-amber-300 opacity-80"
              >
                <Sparkles size={30} className="md:w-10 md:h-10" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black mb-6 md:mb-10 tracking-tighter leading-none">
            تحدي 
            <span className="block mt-2 md:mt-4 bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              المعرفة
            </span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-xl lg:text-2xl mb-10 md:mb-16 font-light max-w-2xl mx-auto leading-relaxed italic px-4">
            انطلق في رحلة فكرية <span className="text-white font-bold">لا تُنسى</span>. اختبر ذكاءك، حطم الأرقام، وتصدر قائمة الأساطير.
          </p>

          {/* Buttons Grid */}
          <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
            
            {/* Primary Action */}
            <Link to="/quiz" className="w-full">
              <motion.button 
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative bg-white text-black py-6 md:py-8 rounded-[25px] text-xl md:text-3xl font-black flex items-center justify-center gap-4 overflow-hidden transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">ابدأ الرحلة الآن</span>
                <ArrowLeft className="relative z-10 transition-transform group-hover:-translate-x-3" size={32} />
              </motion.button>
            </Link>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/leaderboard" className="flex-1">
                <motion.button 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", y: -3 }}
                  className="w-full py-5 md:py-6 rounded-[22px] text-lg md:text-xl font-bold border border-white/10 hover:border-white/20 transition-all text-gray-300 flex items-center justify-center gap-3"
                >
                  <Sparkles size={20} className="text-amber-400" />
                  قائمة المتصدرين
                </motion.button>
              </Link>

              <Link to="/admin" className="flex-1">
                <motion.button 
                  whileHover={{ backgroundColor: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)", y: -3 }}
                  className="w-full py-5 md:py-6 rounded-[22px] text-lg md:text-xl font-bold border border-blue-500/10 transition-all text-blue-400 flex items-center justify-center gap-3 bg-blue-500/5"
                >
                  <LayoutDashboard size={20} />
                  إدارة الأسئلة
                </motion.button>
              </Link>
            </div>
            
            <p className="text-[10px] md:text-xs text-gray-600 mt-4 uppercase tracking-[0.2em]">
              Designed & Developed by Ahmed Mustafa
            </p>
          </div>

        </div>
      </motion.div>

      {/* Particles Layer */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -150],
            opacity: [0, 0.8, 0],
            x: Math.sin(i) * 20
          }}
          transition={{
            duration: Math.random() * 7 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          className="absolute w-[2px] h-[2px] bg-white rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default Home;