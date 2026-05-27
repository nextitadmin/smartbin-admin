

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon } from '../icons';
import useLogout from '../../hooks/useLogout';
import useLawmaAdminStore from '../../stores/lawmaAdminStore';

export default function Topbar({ onMenuClick }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useLogout();
  const resetSuperAdminStore = useLawmaAdminStore((state) => state.reset);
  const profile = useLawmaAdminStore((state) => state.profile);
  const navigate = useNavigate();

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    // Reset Super Admin specific data
    resetSuperAdminStore();

    // Perform general logout
    logout();

    // Close modal
    closeLogoutModal();
  };

  return (
    <>
      <div className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-zinc-500 focus:outline-none"
            onClick={onMenuClick}
          >
            <MenuIcon />
          </button>
          <div className="relative text-zinc-600">
            <button
              onClick={openLogoutModal}
              className='flex items-center space-x-2 text-red-500 hover:bg-red-50 rounded-md px-3 py-1 transition-colors'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <span className='text-red-500' >Logout</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2 lg:pr-4">
            <div className="text-sm flex flex-col items-end">
              <p className="font-light text-zinc-900 text-lg">
                {profile?.name || "UserName"}
              </p>
              <p className="text-xs text-zinc-900 flex items-center gap-1">
                <span className="w-3 h-3 bg-green-600 border border-white rounded-full"></span>
                PSP admin
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 py-10 w-full max-w-md m-4">
            
            
            <div className="mb-6 ">
              <p className="text-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rotate-90" width={40} height={40}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                
              </p>

              <p className='text-red-600 flex items-center justify-center mt-2 font-semibold text-lg' >
                Logout?
              </p>
              <p className="text-zinc-600 text-center mt-2">
                Are you sure you want to logout?
              </p>
              
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 text-zinc-700 rounded-md hover:bg-zinc-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Yes, logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}