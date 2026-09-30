import React from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '../stores/toastStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (typeof document === 'undefined' || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-lg shadow-xl border flex items-center justify-between transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-green-100 border-green-400 text-green-700'
              : toast.type === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700'
              : toast.type === 'warning'
              ? 'bg-amber-100 border-amber-400 text-amber-700'
              : 'bg-blue-100 border-blue-400 text-blue-700'
          }`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className={`ml-4 text-xl font-semibold leading-none ${
              toast.type === 'success'
                ? 'text-green-700 hover:text-green-800'
                : toast.type === 'error'
                ? 'text-red-700 hover:text-red-800'
                : toast.type === 'warning'
                ? 'text-amber-700 hover:text-amber-800'
                : 'text-blue-700 hover:text-blue-800'
            } focus:outline-none cursor-pointer`}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
