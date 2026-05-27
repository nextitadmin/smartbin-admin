import React, { useState, useEffect } from 'react';

// --- Mock Data & API ---
// This simulates fetching data from an API endpoint.
const mockDeliveryData = {
    orderId: '#D900A',
    status: 'Scheduled for delivery',
    date: '09/08/2023, 2:53PM',
    customer: {
        name: 'King Midas',
        phone: '+234 9123456789',
        email: 'kingmidas@example.com',
        address: '12 Bode Thomas Avenue, Surulere, Lagos',
        lga: 'Surulere',
    },
    items: [
        { name: 'Big Smart TV', quantity: 1 },
    ],
    inventory: {
        name: 'Apapa/Warehouse',
        shipmentTo: 'Mainland/Hub/Ikeja',
        dateInventoried: '09/08/2023, 2:53PM',
        dateDispatched: '09/08/2023, 2:53PM',
    },
    assignedTo: null,
};

const mockTeamMembers = [
    { id: 1, name: 'Adewale Adeoye', email: 'adewaleadeoye@email.com' },
    { id: 2, name: 'Bisi Oladapo', email: 'bisioladapo@email.com' },
    { id: 3, name: 'Chinedu Okoro', email: 'chineduokoro@email.com' },
    { id: 4, name: 'Fatima Bello', email: 'fatimabello@email.com' },
];

const fetchDeliveryData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDeliveryData);
        }, 1000); // Simulate network delay
    });
};

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

// --- Main App Component ---
export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deliveryData, setDeliveryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState('details'); // 'details', 'assign'

    const [selectedTeamMember, setSelectedTeamMember] = useState(mockTeamMembers[0]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isModalOpen) {
            setIsLoading(true);
            fetchDeliveryData().then(data => {
                setDeliveryData(data);
                if (data.assignedTo) {
                    const assignedMember = mockTeamMembers.find(m => m.name === data.assignedTo.name);
                    setSelectedTeamMember(assignedMember || mockTeamMembers[0]);
                } else {
                    setSelectedTeamMember(mockTeamMembers[0]);
                }
                setIsLoading(false);
            });
        }
    }, [isModalOpen]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        // Reset view to details when closing, after a short delay for the animation
        setTimeout(() => setCurrentView('details'), 300);
    };

    const handleGoToAssignView = () => {
        if (deliveryData.assignedTo) {
            // If reassigning, set a default for the dropdown that isn't the current member
            const defaultNewMember = mockTeamMembers.find(m => m.name !== deliveryData.assignedTo.name) || mockTeamMembers[0];
            setSelectedTeamMember(defaultNewMember);
        } else {
            // For a new assignment, default to the first member
            setSelectedTeamMember(mockTeamMembers[0]);
        }
        setCurrentView('assign');
    };

    const handleAssignMember = (e) => {
        e.preventDefault();
        const newAssignment = {
            name: selectedTeamMember.name,
            date: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).replace(',', ', ')
        };

        setDeliveryData(prevData => ({
            ...prevData,
            assignedTo: newAssignment
        }));
        setComment('');
        setCurrentView('details');
    };

    const handleSelectChange = (e) => {
        const member = mockTeamMembers.find(m => m.name === e.target.value);
        setSelectedTeamMember(member);
    }

    // --- Render Functions for Modal Content ---
    const renderDetailsView = () => (
        <>
            <div className="flex flex-col gap-6 p-6">
                {/* Heading section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-zinc-900">{deliveryData.orderId}</h2>
                        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {deliveryData.assignedTo ? 'Assigned for Delivery' : 'Scheduled for Delivery'}
                        </span>
                    </div>
                    <button onClick={handleGoToAssignView} className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                        {deliveryData.assignedTo ? 'Reassign delivery' : 'Assign delivery'}
                    </button>
                </div>

                {/* Details section */}
                <div>
                    <h3 className="text-sm font-semibold text-zinc-800 mb-4">Details</h3>
                    <div className="flex flex-wrap gap-y-4">
                        <div className="w-1/2 sm:w-1/3"><DetailItem label="Customer name" value={deliveryData.customer.name} /></div>
                        <div className="w-1/2 sm:w-1/3"><DetailItem label="Phone" value={deliveryData.customer.phone} /></div>
                        <div className="w-full sm:w-1/3"><DetailItem label="Email address" value={deliveryData.customer.email} /></div>
                        <div className="w-full sm:w-2/3"><DetailItem label="Address" value={deliveryData.customer.address} /></div>
                        <div className="w-full sm:w-1/3"><DetailItem label="LGA" value={deliveryData.customer.lga} /></div>
                    </div>
                </div>

                {/* Item & Inventory section */}
                <div className="flex flex-wrap gap-y-4">
                    <div className="w-full sm:w-1/3 pr-4"><DetailItem label="Item(s)" value={`${deliveryData.items[0].name} (${deliveryData.items[0].quantity})`} /></div>
                    <div className="w-1/2 sm:w-1/3"><DetailItem label="Inventoried from" value={deliveryData.inventory.name} /></div>
                    <div className="w-1/2 sm:w-1/3"><DetailItem label="Date Inventoried" value={deliveryData.inventory.dateInventoried} /></div>
                    <div className="w-full sm:w-1/3 pr-4"><DetailItem label="Shipment to" value={deliveryData.inventory.shipmentTo} /></div>
                    <div className="w-full sm:w-1/3"><DetailItem label="Date Dispatched" value={deliveryData.inventory.dateDispatched} /></div>
                </div>

                {/* Assignment section */}
                {deliveryData.assignedTo && (
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-800 mb-4">Assignment</h3>
                        <div className="flex flex-wrap gap-y-4">
                            <div className="w-1/2"><DetailItem label="Assigned to" value={deliveryData.assignedTo.name} /></div>
                            <div className="w-1/2"><DetailItem label="Date assigned" value={deliveryData.assignedTo.date} /></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const renderAssignView = () => {
        const currentAssignee = deliveryData.assignedTo ? mockTeamMembers.find(m => m.name === deliveryData.assignedTo.name) : null;

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
                        <button type="submit" className="w-full sm:w-auto bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                            {deliveryData.assignedTo ? 'Reassign member' : 'Assign member'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-sans p-4">
            <button
                onClick={openModal}
                className="px-6 py-3 bg-white text-zinc-800 font-semibold rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
                Show Delivery Modal
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-zinc-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div
                        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-200">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{deliveryData ? deliveryData.orderId : 'Loading...'}</span>
                                {deliveryData && <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full"></div>}
                                <span className="text-zinc-500 text-sm">{deliveryData ? (deliveryData.assignedTo ? 'Reassign delivery' : 'Assign for delivery') : ''}</span>
                            </div>
                            <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-800">
                                <XMarkIcon />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-grow overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-96">
                                    <p className="text-zinc-500">Loading delivery details...</p>
                                </div>
                            ) : (
                                currentView === 'details' ? renderDetailsView() : renderAssignView()
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

