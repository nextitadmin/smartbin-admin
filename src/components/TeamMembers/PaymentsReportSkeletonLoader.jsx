import React from 'react';

const PaymentsReportSkeletonLoader = () => {
    return (
        <div className="p-6 md:p-6 lg:p-8 bg-white min-h-screen font-sans my-20 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
                <div>
                    <div className="h-8 bg-zinc-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-zinc-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-zinc-200 rounded w-48 mt-2 sm:mt-0"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="mb-8 lg:p-4 flex lg:flex-row flex-col justify-between items-center">
                <div className='lg:w-5/9 w-full justify-center items-start flex flex-col lg:mb-0 mb-6'>
                    <div className="h-4 bg-zinc-200 rounded w-48 mb-2"></div>
                    <div className="h-10 bg-zinc-200 rounded w-32"></div>
                </div>
                <div className="lg:w-4/9 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="h-8 bg-zinc-200 rounded w-20 mb-2"></div>
                            <div className="h-4 bg-zinc-200 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bars Skeleton */}
            <div className="mb-8 lg:p-4 lg:max-w-2/3">
                <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
                                <div className="h-4 bg-zinc-200 rounded w-8"></div>
                            </div>
                            <div className="h-8 bg-zinc-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="overflow-hidden">
                <div className="overflow-x-auto border border-zinc-300 rounded-2xl">
                    <table className="w-full min-w-[768px] text-sm text-left text-zinc-700">
                        <thead className="text-xs text-zinc-700 uppercase py-4">
                            <tr>
                                {[...Array(7)].map((_, i) => (
                                    <th key={i} className="p-6">
                                        <div className="h-4 bg-zinc-200 rounded"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="bg-white border-t border-zinc-300">
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} className="p-6">
                                            <div className="h-4 bg-zinc-200 rounded"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentsReportSkeletonLoader;