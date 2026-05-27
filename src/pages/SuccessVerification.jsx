

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




export default function Verified() {

    const navigate = useNavigate();


    useEffect(() => {

        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);


    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-white">
            {/* Left Panel */}
            <div className="lg:w-7/12 w-full h-full flex flex-col  lg:px-36 px-8 py-12 bg-white">
                <p className='text-zinc-400 text-2xl py-8'>Powered by:</p>
                {/* Logos */}
                <div className="flex flex-wrap gap-6 mb-8 items-center justify-start">
                    <img src="/images/lagosmewr.png" alt="Lagos" className="h-12 object-contain" />
                    <img src="/images/lawma-logo.png" alt="LAWMA" className="h-12 object-contain" />
                    <img src="/images/wema-logo.png" alt="Wema Bank" className="h-12 object-contain" />
                </div>
                <div className='lg:my-20 my-12'>


                    <div className="flex flex-col justify-center items-center max-w-xl mb-6">

                        <div className='lg:text-4xl text-3xl font-bold text-zinc-900 my-4'>Verification Successful</div>
                        <div className='text-zinc-400 text-xl '>Your account has been verified</div>
                        <div className="w-36 h-36 rounded-full my-10 flex  items-center justify-center">
                            {/*  Simulated spinner/icon  */}
                            <div
                                className="w-32 h-32 border-4 border-green-600 border-t-transparent rounded-full animate-spin ">
                            </div>
                        </div>
                        <div className='text-zinc-700 text-xl '>Preparing your dashboard...</div>

                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="hidden md:flex w-5/12 items-center justify-center bg-[url(/images/smilebin.jpg)] relative overflow-hidden bg-cover bg-no-repeat bg-center">

                <div className='absolute top-0 my-14   '>
                    <div className=" z-20 flex flex-row items-center gap-4">
                        <img src="/images/sealLogo.svg" alt="Lagos Seal" className="h-20 mb-1 p-2" />
                        <p className="text-white font-medium text-sm uppercase tracking-wide">
                            Utilities Service Provider Initiative by<br />The Lagos State Government
                        </p>
                    </div>
                </div>


                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white px-6 py-4 text-center z-20">
                    <p className="text-lg">“Experience the power of smart waste management. Sign up now and discover a cleaner, greener world”</p>
                </div>
            </div>
        </div>
    );
}