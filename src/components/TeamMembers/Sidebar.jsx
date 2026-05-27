import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG Icons
import {
  DashboardIcon,
  ReportIcon,
  UserEditIcon,
  MenuIcon,
  CloseIcon,
  CartIcon,
  AuditIcon,
  TeamsIcon
} from '../icons';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Order Management', href: '/order-management', icon: CartIcon },

  { name: 'Reports', href: '/reports', icon: ReportIcon },
];

export default function Sidebar({ className = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-zinc-700 bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col w-64 bg-white shadow-lg h-screen md:sticky md:top-0 ${className}`}
      >

        <div className="flex flex-col flex-1 overflow-y-auto">

          <div className='flex flex-col items-center max-w-[95%] mx-auto my-4 mb-4 border-b border-zinc-300 pb-8' >
            <img src="/images/sealLogo.svg" alt="Lagos Seal" className="h-16 mb-1 p-2" />
            <p className='text-xs uppercase text-center justify-center'>
              Utilities Service Provider Initiative  by THE LAGOS STATE GOVERMENT</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              // Special handling for User Management to include sub-routes
              const isActive = item.href === '/user-management'
                ? location.pathname === item.href || location.pathname.startsWith('/user-management/')
                : location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${isActive
                    ? 'bg-green-700 text-white border'
                    : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after navigation
                >
                  <item.icon active={isActive} />
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}