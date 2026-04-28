import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './pages/Navbar' // اتأكد من اسم الملف صح
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import Leaderboard from './pages/Leaderboard'
import Auth from './pages/Login'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import QuestionsBank from './pages/QuestionsBank'
import Users from './pages/User'
import AdminLeaderboard from './pages/AdminLeaderboard'
import ProtectedRoute from './pages/ProtectedRoutes'
function App() {

  return (
    <div>

      
      <Routes>
        {/* صفحة الـ Auth (دخول / تسجيل / تأكيد) */}
        <Route path='/auth' element={<Auth />} />
        <Route path='/' element={      <Navbar /> } />
        
        {/* صفحات عامة (ممكن أي حد يشوفها) */}
        <Route path='/' element={<Navbar />} /> {/* أو الـ Home بتاعك */}
        <Route path='/leaderboard' element={<Leaderboard />} />

        {/* --- صفحات محمية بالتوكن (للمستخدمين المسجلين فقط) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path='/quiz' element={<Quiz />} />
          <Route path='/result' element={<Result />} />
          
          {/* --- لوحة تحكم الأدمن (Admin Dashboard) --- */}
          <Route path='/admin' element={<Dashboard />}>
            <Route path='' element={<Stats />} />
            <Route path="questions" element={<QuestionsBank />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>

        {/* لو اليوزر كتب أي لينك غلط أو حاول يدخل /register القديمة */}
        <Route path='/register' element={<Navigate to="/auth" />} />
        <Route path='/login' element={<Navigate to="/auth" />} />
        <Route path="*" element={<div className="p-10 text-center font-bold text-white">404 - هذه الصفحة غير موجودة</div>} />
      </Routes>
    </div>
  )
}

export default App