import React, { useState } from 'react';
import useTeamOrderStore from '../../stores/useTeamOrderStore';

// --- HEROICONS SVGs ---
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

const getStatusChipClasses = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    switch (status?.toLowerCase()) {
        case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'delivered': return `${baseClasses} bg-green-100 text-green-800`;
        case 'scheduled': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'activated': return `${baseClasses} bg-purple-100 text-purple-800`;
        case 'inventory': return `${baseClasses} bg-zinc-200 text-zinc-800`;
        default: return `${baseClasses} bg-zinc-100 text-zinc-800`;
    }
};

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-800">{value || '-'}</p>
    </div>
);

// --- MAIN COMPONENT ---

const OrderDetailsContent = ({ order, onClose, onTransition }) => {
    const updateOrderStatus = useTeamOrderStore(state => state.updateOrderStatus);
    const [isProcessing, setIsProcessing] = useState(false);

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    };

    // Helper for quantity display
    const quantityDisplay = order.items && order.items.length > 0
        ? order.items[0].name
        : '-';

    const handleActivate = async () => {
        setIsProcessing(true);
        try {
            const idToUse = order.applicationId || order.id;
            await updateOrderStatus(idToUse, 'activated');

            if (onTransition) {
                // If there's a next visual step, use this. 
                // onTransition('activated');
                // Or just close.
                onClose();
            }
        } catch (error) {
            console.error("Failed to activate order:", error);
            alert("Failed to activate order");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 w-full max-w-4xl mx-auto flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-200 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><ArrowLeftIcon /></button>
                    <h2 className="text-xl font-bold">{order.id}</h2>
                    <span className={getStatusChipClasses(order.status)}>{order.status}</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Activate Button - Only show if not already activated/delivered (though this modal is FOR delivered status) */}
                    {order.status?.toLowerCase() !== 'activated' && (
                        <button
                            onClick={handleActivate}
                            disabled={isProcessing}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Activating...' : 'Activate Order'}
                        </button>
                    )}
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800"><XMarkIcon /></button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow">
                {/* Date */}
                <div className="flex items-center gap-2 py-4 border-b border-zinc-200">
                    <CalendarDaysIcon />
                    {/* Display delivery date if available, otherwise order date */}
                    <p className="text-sm text-zinc-800 font-medium">{formatDate(order.delivery?.deliveredDate || order.orderDate)}</p>
                </div>

                {/* Details Section */}
                <div className="py-6">
                    <h3 className="text-lg font-semibold mb-4 text-zinc-800">Details</h3>
                    <div className="flex flex-col gap-6">
                        {/* Row 1 */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1"><DetailItem label="Customer name" value={order.customer?.name} /></div>
                            <div className="flex-1"><DetailItem label="PHONE" value={order.customer?.phone} /></div>
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
                            <div className="flex-1"><DetailItem label="Date added to Inventory" value={formatDate(order.inventory?.dateAdded)} /></div>
                            <div className="flex-1"><DetailItem label="Updated by" value={order.assignment?.updatedBy} /></div>
                        </div>
                        {/* Row 4 */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1"><DetailItem label="Assigned to" value={order.assignment?.assignedTo?.name} /></div>
                            <div className="flex-1"><DetailItem label="Assigned" value={formatDate(order.assignment?.assignedTo?.date)} /></div>
                            <div className="flex-1"><DetailItem label="Delivered" value={formatDate(order.delivery?.deliveredDate)} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SKELETON LOADER ---
const ModalSkeleton = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 w-full max-w-4xl mx-auto flex flex-col max-h-[90vh] animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-200 flex-shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
                <div className="h-6 w-32 bg-zinc-200 rounded"></div>
                <div className="h-6 w-20 bg-zinc-200 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-9 w-32 bg-zinc-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="overflow-y-auto flex-grow">
            {/* Date Row */}
            <div className="flex items-center gap-2 py-4 border-b border-zinc-200">
                <div className="w-6 h-6 bg-zinc-200 rounded"></div>
                <div className="h-5 w-40 bg-zinc-200 rounded"></div>
            </div>

            {/* Details Grid */}
            <div className="py-6 flex flex-col gap-6">
                {[1, 2, 3, 4].map((row) => (
                    <div key={row} className="flex flex-col sm:flex-row gap-6">
                        {[1, 2, 3].map((col) => (
                            <div key={col} className="flex-1">
                                <div className="h-3 w-24 bg-zinc-200 rounded mb-2"></div>
                                <div className="h-4 w-full bg-zinc-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- MODAL WRAPPER ---
const DeliveredOrderModal = ({ isOpen, order, onClose, onTransition }) => {

    // Handle clicks on the backdrop to close the modal
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
            {!order ? (
                <ModalSkeleton />
            ) : (
                <OrderDetailsContent order={order} onClose={onClose} onTransition={onTransition} />
            )}
        </div>
    );
};

export default DeliveredOrderModal;
