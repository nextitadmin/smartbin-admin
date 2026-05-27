import React, { useState, useEffect, useRef } from 'react';

// --- HEROICONS SVGs ---
// Using raw SVGs as requested since no icon library is installed.

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const CalendarDaysIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);

// --- MOCK API ---
// This function simulates fetching detailed data for a pending order.
const fetchPendingOrderDetails = (orderId) => {
    console.log(`Fetching details for pending order ${orderId}...`);
    const mockDetails = {
        id: orderId,
        status: 'Pending',
        orderDate: new Date(2023, 8, 8, 14, 33),
        price: '₦10,000.00',
        customerName: 'King Kalistus',
        phone: '+234 8123456789',
        email: 'king.k@example.com',
        address: '12 Bode Thomas Avenue, Sasha Junction, Surulere, Lagos',
        lga: 'Surulere',
        quantity: '12kg Smart bin x 1',
    };
    // Simulate network delay
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Data fetched.");
            resolve(mockDetails);
        }, 1000); // 1 second delay
    });
};


// --- HELPER COMPONENTS ---

const getStatusChipClasses = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    switch (status) {
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
        case 'Delivered': return `${baseClasses} bg-green-100 text-green-800`;
        default: return `${baseClasses} bg-zinc-100 text-zinc-800`;
    }
};

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-800">{value}</p>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

const ActionPopover = ({ onAction }) => {
    return (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-200 rounded-lg text-sm z-20">
            <button onClick={() => onAction('pending')} className="w-full text-left px-4 py-3 hover:bg-zinc-50 rounded-t-lg">
                <p className="font-semibold text-zinc-800">Pending</p>
                <p className="text-zinc-500">New order</p>
            </button>
            <button onClick={() => onAction('inventory')} className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-t border-zinc-200">
                <p className="font-semibold text-zinc-800">Inventory</p>
                <p className="text-zinc-500">Add item to inventory</p>
            </button>
            <button onClick={() => onAction('schedule')} className="w-full text-left px-4 py-3 hover:bg-zinc-50 border-t border-zinc-200 rounded-b-lg">
                <p className="font-semibold text-zinc-800">Schedule for delivery</p>
                <p className="text-zinc-500">Schedule item for delivery</p>
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---

const PendingOrderDetailsContent = ({ details, onClose }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef(null);
    const formatDate = (date) => date.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });

    const handleAction = (action) => {
        switch (action) {
            case 'pending':
                console.log('Action: Keep as Pending');
                break;
            case 'inventory':
                console.log('Action: Add item to inventory');
                break;
            case 'schedule':
                console.log('Action: Schedule item for delivery');
                break;
            default:
                break;
        }
        setIsPopoverOpen(false);
    };

    // Close popover if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popoverRef]);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><ArrowLeftIcon /></button>
                    <h2 className="text-xl font-bold">{details.id}</h2>
                    <div className="relative" ref={popoverRef}>
                        <button onClick={() => setIsPopoverOpen(!isPopoverOpen)} className={getStatusChipClasses(details.status)}>
                            {details.status}
                        </button>
                        {isPopoverOpen && <ActionPopover onAction={handleAction} />}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{details.price}</span>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><XMarkIcon /></button>
                </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 py-4">
                <CalendarDaysIcon />
                <p className="text-sm text-zinc-800 font-medium">{formatDate(details.orderDate)}</p>
            </div>

            {/* Details Section */}
            <div className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-800">Details</h3>
                <div className="flex flex-col gap-6">
                    {/* Row 1 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Customer name" value={details.customerName} /></div>
                        <div className="flex-1"><DetailItem label="Phone number" value={details.phone} /></div>
                        <div className="flex-1"><DetailItem label="Email address" value={details.email} /></div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Address" value={details.address} /></div>
                        <div className="flex-1"><DetailItem label="LGA" value={details.lga} /></div>
                        <div className="flex-1" />
                    </div>
                    {/* Row 3 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Quantity" value={details.quantity} /></div>
                        <div className="flex-1" />
                        <div className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MODAL WRAPPER ---
const PendingOrderModal = ({ orderId, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            setIsLoading(true);
            fetchPendingOrderDetails(orderId).then(data => {
                setOrderDetails(data);
                setIsLoading(false);
            });
        }
    }, [orderId]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            {isLoading || !orderDetails ? (
                <LoadingSpinner />
            ) : (
                <PendingOrderDetailsContent details={orderDetails} onClose={onClose} />
            )}
        </div>
    );
};


// --- EXAMPLE USAGE ---

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-zinc-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-zinc-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
            >
                Show Pending Order Details
            </button>

            {isModalOpen && (
                <PendingOrderModal orderId="#0900A" onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}
