import React, { useState, useEffect } from 'react';
import useOrderStore from '../../../stores/useOrderStore';

// --- Mock Data ---
// Mock team members as requested due to missing endpoint
const mockTeamMembers = [
    { id: 1, name: 'Adewale Adeoye', email: 'adewaleadeoye@email.com' },
    { id: 2, name: 'Bisi Oladapo', email: 'bisioladapo@email.com' },
    { id: 3, name: 'Chinedu Okoro', email: 'chineduokoro@email.com' },
    { id: 4, name: 'Fatima Bello', email: 'fatimabello@email.com' },
];

// --- SVG Icons (Heroicons) ---
const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);


// --- Reusable Components ---
const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-800">{value}</p>
    </div>
);

// --- Main Modal Component ---
export default function ScheduleDeliveryModal({ isOpen, onClose, order: initialOrder, onTransition }) {
    // We maintain a local state for the order to reflect immediate changes (like assignment)
    // In a real app, this might be handled by optimistic updates or re-fetching
    const [order, setOrder] = useState(initialOrder);
    const scheduleOrderDelivery = useOrderStore(state => state.scheduleOrderDelivery);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setOrder(initialOrder);
    }, [initialOrder]);

    const [currentView, setCurrentView] = useState('details'); // 'details', 'assign'

    // Derived state for assignment
    const assignedMemberName = order?.assignment?.assignedTo?.name || null;
    const currentAssignee = assignedMemberName ? mockTeamMembers.find(m => m.name === assignedMemberName) : null;

    const [selectedTeamMember, setSelectedTeamMember] = useState(mockTeamMembers[0]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isOpen && order) {
            if (currentAssignee) {
                // If already assigned, select that member (or reset to default for reassign logic)
                const assignedMember = mockTeamMembers.find(m => m.name === assignedMemberName);
                setSelectedTeamMember(assignedMember || mockTeamMembers[0]);
            } else {
                setSelectedTeamMember(mockTeamMembers[0]);
            }
        }
    }, [isOpen, order?.id]); // Depend on ID to reset when order changes

    const handleClose = () => {
        onClose();
        // Reset view to details when closing, after a short delay for the animation
        setTimeout(() => setCurrentView('details'), 300);
    };

    const handleGoToAssignView = () => {
        if (currentAssignee) {
            // If reassigning, try to set default to someone else for convenience
            const defaultNewMember = mockTeamMembers.find(m => m.name !== assignedMemberName) || mockTeamMembers[0];
            setSelectedTeamMember(defaultNewMember);
        } else {
            setSelectedTeamMember(mockTeamMembers[0]);
        }
        setCurrentView('assign');
    };

    const handleAssignMember = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Use applicationId if available via API field, fallback to ID
            const idToUse = order.applicationId || order.id;

            // API expects teamMemberId, but we only have mock IDs locally. 
            // In a real scenario, we'd have real IDs from an API. 
            // For now, let's use the mock ID (integer) or convert to string if API expects string.
            // Docs say "Team member ObjectId" so likely string. 
            // Since we lack the Team Member API, we'll try to use a dummy ObjectId if the mock ID fails validation,
            // or just pass the ID we have. Let's pass a dummy string ID derived from our mock.
            const teamMemberId = `mock_member_${selectedTeamMember.id}`;

            await scheduleOrderDelivery(idToUse, teamMemberId, comment);

            // Optimistic update for UI feel or rely on store refresh (which is called in action)
            // But let's close/transition
            if (onTransition) {
                // onTransition('scheduled'); // if there is such a step? 
                // Usually after scheduling, it goes to "Scheduled for Delivery" status.
                // We can close.
            }
            setCurrentView('details'); // Or close?
            // Let's go back to details to show success or new status? 
            // Or just close as successful. 
            // Assuming workflow: Click Schedule -> Assign -> Done -> Close.
            handleClose();

        } catch (error) {
            console.error("Failed to schedule delivery:", error);
            alert("Failed to schedule delivery. See console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSelectChange = (e) => {
        const member = mockTeamMembers.find(m => m.name === e.target.value);
        setSelectedTeamMember(member);
    }

    if (!order) return null;

    // Helper to format quantity
    const quantityDisplay = order.items && order.items.length > 0
        ? order.items[0].name
        : 'N/A';

    // --- Render Functions for Modal Content ---
    const renderDetailsView = () => (
        <>
            <div className="flex flex-col gap-6 p-6">
                {/* Heading section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-zinc-900">{order.id}</h2>
                        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {assignedMemberName ? 'Assigned for Delivery' : 'Scheduled for Delivery'}
                        </span>
                    </div>
                    <button onClick={handleGoToAssignView} className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                        {assignedMemberName ? 'Reassign delivery' : 'Assign delivery'}
                    </button>
                </div>

                {/* Details section */}
                <div>
                    <h3 className="text-sm font-semibold text-zinc-800 mb-4">Details</h3>
                    <div className="flex flex-wrap gap-y-4">
                        <div className="w-1/2 sm:w-1/3"><DetailItem label="Customer name" value={order.customer?.name} /></div>
                        <div className="w-1/2 sm:w-1/3"><DetailItem label="Phone" value={order.customer?.phone} /></div>
                        <div className="w-full sm:w-1/3"><DetailItem label="Email address" value={order.customer?.email} /></div>
                        <div className="w-full sm:w-2/3"><DetailItem label="Address" value={order.customer?.address} /></div>
                        <div className="w-full sm:w-1/3"><DetailItem label="LGA" value={order.customer?.lga} /></div>
                    </div>
                </div>

                {/* Item & Inventory section */}
                <div className="flex flex-wrap gap-y-4">
                    <div className="w-full sm:w-1/3 pr-4"><DetailItem label="Item(s)" value={quantityDisplay} /></div>
                    <div className="w-1/2 sm:w-1/3"><DetailItem label="Inventoried from" value={order.inventory?.name || '-'} /></div>
                    <div className="w-1/2 sm:w-1/3"><DetailItem label="Date Inventoried" value={order.inventory?.dateAdded?.toLocaleString() || '-'} /></div>
                    <div className="w-full sm:w-1/3 pr-4"><DetailItem label="Shipment to" value={order.inventory?.shipmentTo || '-'} /></div>
                    <div className="w-full sm:w-1/3"><DetailItem label="Date Dispatched" value={order.inventory?.dateDispatched?.toLocaleString() || '-'} /></div>
                </div>

                {/* Assignment section */}
                {assignedMemberName && (
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-800 mb-4">Assignment</h3>
                        <div className="flex flex-wrap gap-y-4">
                            <div className="w-1/2"><DetailItem label="Assigned to" value={order.assignment?.assignedTo?.name} /></div>
                            <div className="w-1/2"><DetailItem label="Date assigned" value={order.assignment?.assignedTo?.date?.toLocaleString()} /></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const renderAssignView = () => {
        return (
            <div className="p-6">
                <h3 className="text-base font-semibold text-zinc-800 mb-1">{currentAssignee ? 'Reassign delivery' : 'Assign team member'}</h3>
                <p className="text-sm text-zinc-500 mb-6">Select a team member to assign this delivery to.</p>
                <form onSubmit={handleAssignMember} className="flex flex-col gap-4">
                    {currentAssignee && (
                        <div className="flex flex-col gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                            <p className="text-sm font-semibold text-zinc-600 -mb-2">Currently Assigned</p>
                            <div>
                                <label htmlFor="current-team-member" className="block text-sm font-medium text-zinc-700 mb-1">Team member</label>
                                <input
                                    type="text"
                                    id="current-team-member"
                                    readOnly
                                    value={currentAssignee.name}
                                    className="w-full bg-zinc-200 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-600 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="team-member" className="block text-sm font-medium text-zinc-700 mb-1">
                            {currentAssignee ? 'Reassign to' : 'Team member'}
                        </label>
                        <div className="relative">
                            <select
                                id="team-member"
                                value={selectedTeamMember.name}
                                onChange={handleSelectChange}
                                className="w-full appearance-none bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                                {mockTeamMembers.map(member => (
                                    <option key={member.id} value={member.name}>{member.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <ChevronDownIcon />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            readOnly
                            value={selectedTeamMember.email}
                            className="w-full bg-zinc-100 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 mb-1">Comment</label>
                        <textarea
                            id="comment"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        ></textarea>
                    </div>
                    <div className="mt-2">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full sm:w-auto bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : (currentAssignee ? 'Reassign member' : 'Assign member')}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-800/75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
            <div
                className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{order ? order.id : 'Loading...'}</span>
                        {order && <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></div>}
                        <span className="text-zinc-500 text-sm">{order ? (assignedMemberName ? 'Reassign delivery' : 'Assign for delivery') : ''}</span>
                    </div>
                    <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-800">
                        <XMarkIcon />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-grow overflow-y-auto">
                    {currentView === 'details' ? renderDetailsView() : renderAssignView()}
                </div>
            </div>
        </div>
    );
}

