import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      {/* 1. pt-16: Creates space for the Fixed Mobile Header automatically */}
      {/* 2. overflow-y-auto: Allows scrolling inside this box only */}
      {/* 3. w-full: Ensures it fits all mobile screen widths */}
      <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden pt-16 md:pt-0 relative">
        <Outlet /> 
      </main>
    </div>
  )
}