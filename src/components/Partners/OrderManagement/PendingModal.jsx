import React, { useState, useEffect, useRef } from 'react';
import useOrderStore from '../../../stores/useOrderStore';

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

// --- HELPER COMPONENTS ---

const getStatusChipClasses = (status = 'pending') => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    switch (status.toLowerCase()) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
        case 'delivered': return `${baseClasses} bg-green-100 text-green-800`;
        default: return `${baseClasses} bg-zinc-100 text-zinc-800`;
    }
};

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-800">{value || '-'}</p>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

const ActionPopover = ({ onAction, isProcessing }) => {
    return (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-200 rounded-lg text-sm z-20 shadow-lg">
            <button onClick={() => onAction('inventory')} disabled={isProcessing} className="w-full text-left px-4 py-3 hover:bg-zinc-50 rounded-lg disabled:opacity-50">
                <p className="font-semibold text-zinc-800">Move to Inventory</p>
                <p className="text-zinc-500">Approve and add to inventory</p>
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---

const PendingOrderDetailsContent = ({ order, onClose, onTransition }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const popoverRef = useRef(null);
    const updateOrderStatus = useOrderStore(state => state.updateOrderStatus);

    const formatDate = (date) => date ? new Date(date).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : 'N/A';

    const handleAction = async (action) => {
        if (action === 'inventory') {
            setIsProcessing(true);
            try {
                // Use applicationId if available (API ID), fallback to id
                const idToUse = order.applicationId || order.id;
                await updateOrderStatus(idToUse, 'inventory');
                if (onTransition) {
                    onClose();
                }
            } catch (error) {
                console.error("Failed to update status:", error);
                alert("Failed to update status");
            } finally {
                setIsProcessing(false);
                setIsPopoverOpen(false);
            }
        }
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

    if (!order) return null;

    // Helper to format quantity from items array
    const quantityDisplay = order.items && order.items.length > 0
        ? order.items[0].name
        : 'N/A';

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><ArrowLeftIcon /></button>
                    <h2 className="text-xl font-bold">{order.id}</h2>
                    <div className="relative" ref={popoverRef}>
                        <button
                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                            className={`${getStatusChipClasses(order.status)} flex items-center gap-1 cursor-pointer hover:opacity-80`}
                        >
                            {order.status}
                            <span className="text-[10px] ml-1">▼</span>
                        </button>
                        {isPopoverOpen && <ActionPopover onAction={handleAction} isProcessing={isProcessing} />}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{order.price}</span>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><XMarkIcon /></button>
                </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 py-4">
                <CalendarDaysIcon />
                <p className="text-sm text-zinc-800 font-medium">{formatDate(order.orderDate)}</p>
            </div>

            {/* Details Section */}
            <div className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-800">Details</h3>
                <div className="flex flex-col gap-6">
                    {/* Row 1 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Customer name" value={order.customer?.name} /></div>
                        <div className="flex-1"><DetailItem label="Phone number" value={order.customer?.phone} /></div>
                        <div className="flex-1"><DetailItem label="Email address" value={order.customer?.email} /></div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Address" value={order.customer?.address} /></div>
                        <div className="flex-1"><DetailItem label="LGA" value={order.customer?.lga} /></div>
                        <div className="flex-1" />
                    </div>
                    {/* Row 3 */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1"><DetailItem label="Quantity" value={quantityDisplay} /></div>
                        <div className="flex-1" />
                        <div className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MODAL WRAPPER ---
const PendingOrderModal = ({ isOpen, order, onClose, onTransition }) => {

    // Check for order data
    const isLoading = !order;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <PendingOrderDetailsContent order={order} onClose={onClose} onTransition={onTransition} />
            )}
        </div>
    );
};

export default PendingOrderModal;
