import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
   
    <div dir="rtl" className="h-screen flex md:flex-row bg-[#030712] relative text-white overflow-hidden font-['Cairo']">
      
 
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="  md:w-72  border-l border-white/10 z-20">
        <Sidebar />
      </div>

   
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">

        <div className="md:p-8 pt-20 px-8">
          <Outlet />
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard