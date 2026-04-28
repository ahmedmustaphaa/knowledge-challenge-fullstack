import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  Trophy, 
  LogOut,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom'; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // لحالة الموبايل

  const menuItems = [
    { id: 'stats', icon: LayoutDashboard, label: 'الإحصائيات', path: '/admin' },
    { id: 'questions', icon: PlusCircle, label: 'بنك الأسئلة', path: '/admin/questions' },
    { id: 'users', icon: Users, label: 'المستخدمين', path: '/admin/users' },
    { id: 'leaderboard', icon: Trophy, label: 'المتصدرين', path: '/admin/leaderboard' },
  ];


  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <span className="text-xl font-black text-white">M</span>
        </div>
        <div className="block">
          <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-gray-400">MEDIC</h2>
          <span className="text-[10px] text-blue-500 font-bold tracking-[3px] uppercase block">Admin Panel</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsOpen(false)} // يقفل المنيو لما يختار صفحة في الموبايل
              className={({ isActive }) => `
                w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group text-right
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <Icon size={22} className={isActive ? 'text-white' : 'group-hover:text-blue-400'} />
                    <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeIndicator">
                      <ChevronLeft size={16} />
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] shrink-0">
             <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center text-white">
                <span className="text-xs font-bold">AH</span>
             </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-white">أحمد مصطفى</p>
            <p className="text-[10px] text-gray-500 truncate">Admin Account</p>
          </div>
        </div>
        
        <NavLink 
          to="/auth"
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
        >
          <LogOut size={22} />
          <span>تسجيل الخروج</span>
        </NavLink>
      </div>
    </div>
  );

  const navItem=useNavigate()

  return (
    <>
      {/* 1. Mobile Header (بيظهر فقط في الشاشات الصغيرة) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#030712]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer " onClick={()=>navItem('/')}>
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">M</div>
           <span className="font-black text-white text-sm">MEDIC</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-white/5 rounded-lg">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. Desktop Sidebar (بيظهر من lg فما فوق) */}
      <aside className="hidden lg:flex w-72 h-screen bg-white/[0.02] backdrop-blur-md border-l border-white/10 flex-col p-6 sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* 3. Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* الخلفية المظلمة */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            {/* القائمة الجانبية للموبايل */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0f1115] border-l border-white/10 z-[70] p-6 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;