import React from 'react';

const LoadingComponent = () => {
    return (
        <>
            <style>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 0.5s ease-in-out infinite alternate;
        }
      `}</style>

            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                {/* Logo/Icon */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-700 rounded-full flex items-center justify-center shadow-lg">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12 text-white">
                                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                                <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                            </svg>


                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* App Name */}
                <h1 className="text-4xl font-light text-green-700 mb-12 tracking-tight">
                    SMART<span className="font-black">BIN</span>
                </h1>

                {/* Loading Indicator */}
                <div className="w-48 h-2 bg-green-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-700 rounded-full animate-loading-bar"></div>
                </div>

                {/* Loading Text */}
                <p className="text-green-700 text-lg mt-6 font-medium">
                    Optimizing waste management...
                </p>
            </div>
        </>
    );
};

export default LoadingComponent;