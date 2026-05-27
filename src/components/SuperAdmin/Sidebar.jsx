import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG Icons
// NOTE: I'm using existing icons and mapping them to the new names.
// You might need to create new custom icons if the visual look is important.
import {
  DashboardIcon,
  DocumentIcon, // Used for Revenue analysis and Reconciliation
  ReportIcon,   // Used for Reports
  WasteIcon,    // Used for Bin distribution
  TeamsIcon,    // Used for PSPs and Team Management
  MenuIcon,
  CloseIcon,
  // Assuming DocumentIcon is the icon with the document/paper look
  // Assuming WasteIcon is the icon with the bin/trash look
  // Assuming TeamsIcon is the icon with the people/team look
} from '../icons';

// New structure based on the image
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Revenue analysis', href: '/revenue-analysis', icon: DocumentIcon },

  { name: 'Bin distribution', href: '/smartbin-overview', icon: WasteIcon },
  // Assuming PSPs stands for Private Sector Participants or similar, using the people icon
  { name: 'PSPs', href: '/psp-companies', icon: TeamsIcon },
  { name: 'Reports', href: '/reports', icon: ReportIcon },
  { name: 'Team Management', href: '/team', icon: TeamsIcon },
];

export default function Sidebar({ className = "" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

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

          {/* Updated Header Section to match image */}
          <div className='flex flex-col items-center mx-auto my-4 mb-8 pt-4 pb-4' >
            {/* Logo: Keeping the logo source but simplifying the surrounding markup */}
            {/* The image shows a crest/seal and two lines of text */}
            <img src="/images/sealLogo.svg" alt="LASG Seal" className="h-12 mb-2 p-1" />
            <p className='text-xs font-bold uppercase text-center justify-center text-zinc-800 tracking-wide'>
              LASG UTILITY</p>
            <p className='text-xs font-bold uppercase text-center justify-center text-zinc-800 tracking-wide'>
              SERVICE MANAGEMENT</p>
          </div>
          {/* End Updated Header Section */}

          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => {
              // Special cases for "section" highlighting
              const isRevenueSection =
                item.href === "/revenue-analysis" &&
                (pathname === "/revenue-analysis" ||
                  pathname === "/revenue" ||
                  pathname === "/payment-details" ||
                  pathname === "/payment-transactions");

              const isReconciliationSection =
                item.href === "/reconciliation" &&
                (pathname === "/reconciliation" ||
                  pathname === "/payment-receipt" ||
                  pathname === "/bills-receipt");

              const isBinDistributionSection =
                item.href === "/smartbin-overview" &&
                (pathname === "/smartbin-overview" || pathname === "/delivered-smart-bins");

              const isActive =
                pathname === item.href ||
                isRevenueSection ||
                isReconciliationSection ||
                isBinDistributionSection;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${isActive
                    // The active style in the image is a solid green background with white text.
                    ? 'bg-green-700 text-white'
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