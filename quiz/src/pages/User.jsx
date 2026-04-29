import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShieldCheck, Trash2, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, resetAdmin } from '../redux/adminSlice'; 
import axios from 'axios';

function Users() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
    return () => {
      dispatch(resetAdmin());
    };
  }, [dispatch]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        const token = currentUser?.token || currentUser?.data?.token;
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        await axios.delete(`https://knowledge-challenge-fullstack-63u8.vercel.app/api/admin/users/${userId}`, config);
        alert("تم حذف المستخدم بنجاح");
        dispatch(getAllUsers()); 
      } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "فشل حذف المستخدم");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Cairo'] pb-10" dir="rtl">
      <header className="mb-8 px-2">
        <h2 className="text-2xl md:text-4xl font-black text-white">إدارة المستخدمين</h2>
        <p className="text-gray-500 mt-1 text-sm md:text-base">مراقبة وإدارة حسابات المسجلين ({users?.length || 0})</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <motion.div
              key={user._id || user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white/[0.03] border border-white/10 p-4 md:p-6 rounded-[24px] md:rounded-[30px] flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.05] transition-all group gap-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600/20 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
                  <User size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2 truncate">
                    {user.username || user.name}
                    {user.isAdmin && <ShieldCheck size={16} className="text-blue-400 shrink-0" />}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-500 truncate">
                      <Mail size={12} className="shrink-0" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-500 shrink-0">
                      <Calendar size={12} className="shrink-0" /> انضم {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end border-t md:border-0 border-white/5 pt-3 md:pt-0">
                <button 
                  onClick={() => handleDeleteUser(user._id || user.id)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 md:p-3 text-red-500 bg-red-500/10 md:bg-transparent md:text-red-500/40 md:hover:text-red-500 md:hover:bg-red-500/10 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                  <span className="md:hidden text-xs font-bold">حذف الحساب</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/[0.02] rounded-[30px] border border-white/5 text-gray-500">
            لا يوجد مستخدمين حالياً
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;