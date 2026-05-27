import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, OrderIcon } from '../icons';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../../api/apiConfig';

const SmartbinProgress = ({ orderData, onClose }) => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [tracker, setTracker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Default order data if none provided
    const defaultOrderData = {
        orderId: '#31BU1908',
        customer: 'Adedayo Kunle',
        dateProcessed: '23rd July 2025',
        destination: '13, Johnson Cole Avenue, Iyana Ipaja',
        status: 'pending'
    };

    const formatDateTime = (isoString) => {
        try {
            const d = new Date(isoString);
            if (isNaN(d.getTime())) return 'N/A';
            return d.toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    const generateTimeline = (timelineArray) => {
        if (!Array.isArray(timelineArray)) return [];
        // ensure newest first as provided; mark first item as active
        return timelineArray.map((item, index) => ({
            id: `${item.timestamp}-${index}`,
            date: formatDateTime(item.timestamp),
            description: item.description || '',
            status: item.status || 'Pending',
            isActive: index === 0
        }));
    };

    const statusColor = (status) => {
        const s = String(status || '').toLowerCase();
        switch (s) {
            case 'pending':
                return 'border-gray-400 text-gray-800 bg-gray-50';
            case 'approved':
                return 'border-blue-400 text-blue-800 bg-blue-50';
            case 'inventory':
                return 'border-blue-400 text-blue-800 bg-blue-50';
            case 'scheduledfordelivery':
            case 'scheduled for delivery':
                return 'border-purple-400 text-purple-800 bg-purple-50';
            case 'delivered':
                return 'border-green-400 text-green-800 bg-green-50';
            case 'rejected':
                return 'border-red-400 text-red-800 bg-red-50';
            case 'activated':
                return 'border-orange-400 text-orange-800 bg-orange-50';
            default:
                return 'border-gray-400 text-gray-800 bg-gray-50';
        }
    };

    const StatusBadge = ({ status }) => {
        return (
            <span className={` inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(status)}`}>
                {status}
            </span>
        );
    };
    useEffect(() => {
        const id = orderData?.id || orderId;
        if (!id) return;
        let isMounted = true;
        const fetchTracker = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get(`lawma/smartbins/${id}/tracker`);
                if (!isMounted) return;
                setTracker(data);
            } catch (e) {
                if (!isMounted) return;
                setError('Failed to load tracker');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchTracker();
        return () => { isMounted = false; };
    }, [orderData?.id, orderId]);

    const order = useMemo(() => {
        if (tracker) {
            return {
                orderId: tracker.orderId ? `#${tracker.orderId}` : (orderData?.id ? `#${orderData.id}` : defaultOrderData.orderId),
                customer: tracker.customerName || orderData?.name || defaultOrderData.customer,
                dateProcessed: tracker.dateProcessed ? formatDateTime(tracker.dateProcessed) : (orderData?.date || defaultOrderData.dateProcessed),
                destination: tracker.destination || orderData?.address || defaultOrderData.destination,
                timeline: generateTimeline(tracker.timeline)
            };
        }
        if (orderData) {
            return {
                orderId: `#${orderData.id}`,
                customer: orderData.name,
                dateProcessed: orderData.date,
                destination: orderData.address,
                timeline: []
            };
        }
        return { ...defaultOrderData, orderId: orderId ? `#${orderId}` : defaultOrderData.orderId, timeline: [] };
    }, [tracker, orderData, orderId]);

    return (
        <div>
            <div className="flex sans h-screen">
                <Sidebar addkey="1" />
                <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                    <Topbar />
                    <div className="bg-zinc-100 font-sans">
                        <main className="p-4 md:px-4">
                            <div className="p-4 md:p-8 font-sans">
                                {/* Back button */}
                                <div className="mb-6">
                                    <div className='flex items-center gap-3 sm:gap-5'>
                                        <div className='items-center flex'>
                                            <span
                                                onClick={onClose}
                                                className="group cursor-pointer"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:text-green-700 transition-colors">
                                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div>
                                            <h1 className="text-lg sm:text-xl font-semibold text-zinc-800">
                                                Smart Bin
                                            </h1>
                                            <p className="text-zinc-500 text-sm font-light">
                                                Track smart bin status
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='lg:px-64'>

                                {/* Order Details Card */}
                                <div className="bg-white rounded-xl shadow-sm p-5 mb-8 w- lg:w-2/3 mx-auto">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 gap-4 flex">
                                        <div className="flex items-start space-x-4 mb-4 md:mb-0 flex-1 min-w-0">
                                            {/* Smart Bin Icon */}
                                            <div className='space-y-4 flex-1 min-w-0'>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                                                        <OrderIcon className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <div className="text-sm text-gray-500 mb-1">Order ID</div>
                                                        <div className="text-lg text-gray-900 break-words">{order.orderId}</div>
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm text-gray-500 mt-1">Customer</div>
                                                    <div className="text-lg text-gray-900 break-words">{order.customer}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-start flex-1 min-w-0 space-y-4">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">Date Processed</div>
                                                <div className="text-lg text-gray-900">{order.dateProcessed}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mt-1">Destination</div>
                                                <div className="text-lg text-gray-900 break-words">{order.destination}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    {loading && (
                                        <div className="text-sm text-zinc-500 mb-4">Loading tracker...</div>
                                    )}
                                    {error && (
                                        <div className="text-sm text-red-600 mb-4">{error}</div>
                                    )}
                                    {order.timeline.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-5 relative mb-6">
                                            <div className="relative flex flex-col items-center">
                                                <button className="z-10"><CheckIcon className="h-4 w-4 text-white bg-green-700 p-0.5" /></button>
                                                {/* Vertical line connecting to next item */}
                                                {index < order.timeline.length - 1 && (
                                                    <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-0.5 h-22 bg-gray-300"></div>
                                                )}
                                            </div>
                                            <div className="relative w-full">
                                                {/* Timeline Item */}
                                                <div className={`bg-white rounded-3xl shadow-sm p-6 ${item.isActive ? 'border-2 border-green-500' : ''}`}>
                                                    <div className="flex items-start space-x-4">
                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2 gap-2">
                                                                        <div className="text-sm text-gray-900 font-semibold mb-1">{item.date}</div>
                                                                        <div className="sm:mt-0 sm:ml-4">
                                                                            <span className={`${item.statusColor}`}>
                                                                                <StatusBadge status={item.status} />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </div>
            
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartbinProgress;