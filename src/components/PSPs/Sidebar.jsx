import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG Icons
import {
  DashboardIcon,
  DocumentIcon,
  UserIcon,
  VerifyIcon,
  ReportIcon,
  BinIcon,
  PSPIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  WasteIcon,
  AuditIcon,
  TeamsIcon
} from '../icons';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Waste Management', href: '/waste-management', icon: WasteIcon },
  { name: 'Bills & Receipts', href: '/bills-and-receipts', icon: VerifyIcon },
  { name: 'Team Management', href: '/team-management', icon: TeamsIcon },
  { name: 'Reports', href: '/reports', icon: ReportIcon },
  { name: 'Admin Access', href: '/admin-access', icon: UserIcon },
  { name: 'Audit Manager', href: '/audit-management', icon: AuditIcon },
  { name: 'Service Configuration', href: '/service-configuration', icon: PSPIcon },

];

export default function Sidebar({ className = "", activeRoute = null }) {
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
              let isActive = false;
              
              if (activeRoute) {
                // If activeRoute is provided, use it for matching
                isActive = item.href === activeRoute;
              } else {
                // Fallback to location-based matching
                if (item.href === '/user-management') {
                  isActive = location.pathname === item.href || location.pathname.startsWith('/user-management/');
                } else if (item.href === '/reports') {
                  isActive = location.pathname === item.href || 
                            location.pathname.startsWith('/reports/') ||
                            location.pathname.startsWith('/smartbin-report/') ||
                            location.pathname.startsWith('/waste-reports/') ||
                            location.pathname.startsWith('/payment-report/');
                } else {
                  isActive = location.pathname === item.href;
                }
              }
              
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