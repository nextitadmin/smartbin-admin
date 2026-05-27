import React, { useState } from 'react';
import Sidebar from '../components/Partners/Sidebar';
import Topbar from '../components/Partners/Topbar';
import ScheduleDeliveryModal from '../components/Partners/OrderManagement/ScheduleDeliveryModal';
import PendingOrderModal from '../components/Partners/OrderManagement/PendingModal';
import InventoryModal from '../components/Partners/OrderManagement/InventoryModal';
import DeliveredOrderModal from '../components/Partners/OrderManagement/DeliveredModal';
import ActivatedOrderModal from '../components/Partners/OrderManagement/ActivatedModal';

const ModalTestCard = ({ title, description, onClick, buttonText = "Open Modal", color = "green" }) => {
    const colorClasses = {
        green: "bg-green-600 hover:bg-green-700",
        yellow: "bg-yellow-500 hover:bg-yellow-600",
        blue: "bg-blue-600 hover:bg-blue-700",
        purple: "bg-purple-600 hover:bg-purple-700",
        zinc: "bg-zinc-600 hover:bg-zinc-700",
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
            <p className="text-sm text-zinc-500 mb-6 flex-grow">{description}</p>
            <button
                onClick={onClick}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${colorClasses[color] || colorClasses.green}`}
            >
                {buttonText}
            </button>
        </div>
    );
};

import useOrderModalStore from '../stores/useOrderModalStore';

// ... (ModalTestCard component remains the same, assuming it's above or I will keep it)

export default function OrderManagementModals() {
    const { activeModal, openModal, closeModal, transitionTo, orderData } = useOrderModalStore();

    // Defined transition flows
    const handlePendingTransition = (action) => {
        if (action === 'inventory') {
            transitionTo('inventory');
        } else if (action === 'schedule') {
            transitionTo('schedule');
        }
    };

    const handleInventoryTransition = (action) => {
        if (action === 'schedule') {
            transitionTo('schedule');
        }
    };

    // For demo purposes, we can assume a transition from Schedule -> Delivered happens after assignment
    const handleScheduleTransition = () => {
        transitionTo('delivered');
    };

    return (
        <div className="flex h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-zinc-900">Modal Testing Playground</h1>
                            <p className="text-zinc-500 mt-2">Use this page to navigate and test all Order Management modals in isolation. Modals are orchestrated via Zustand.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ModalTestCard
                                title="Pending Order Modal"
                                description="Initial order state. Displays basic order info and transitions to Inventory."
                                onClick={() => openModal('pending', '#PEND-001')}
                                buttonText="Test Pending Modal"
                                color="yellow"
                            />
                            <ModalTestCard
                                title="Inventory Modal"
                                description="Inventory management state. Allows scheduling the order for delivery."
                                onClick={() => openModal('inventory', '#INV-002')}
                                buttonText="Test Inventory Modal"
                                color="zinc"
                            />
                            <ModalTestCard
                                title="Schedule Delivery Modal"
                                description="Assign team members to orders. Features switching between details and assignment views."
                                onClick={() => openModal('schedule', '#SCH-003')}
                                buttonText="Test Schedule Modal"
                                color="blue"
                            />
                            <ModalTestCard
                                title="Delivered Order Modal"
                                description="Read-only view for delivered orders showing comprehensive delivery details."
                                onClick={() => openModal('delivered', '#DEL-004')}
                                buttonText="Test Delivered Modal"
                                color="green"
                            />
                            <ModalTestCard
                                title="Activated Order Modal"
                                description="Read-only view for activated orders showing final status details."
                                onClick={() => openModal('activated', '#ACT-005')}
                                buttonText="Test Activated Modal"
                                color="purple"
                            />
                        </div>
                    </div>
                </main>

                {/* --- Modals --- */}
                <PendingOrderModal
                    isOpen={activeModal === 'pending'}
                    onClose={closeModal}
                    order={orderData}
                    onTransition={handlePendingTransition}
                />
                <InventoryModal
                    isOpen={activeModal === 'inventory'}
                    onClose={closeModal}
                    order={orderData}
                    onTransition={handleInventoryTransition}
                />
                <ScheduleDeliveryModal
                    isOpen={activeModal === 'schedule'}
                    onClose={closeModal}
                    order={orderData}
                    onTransition={handleScheduleTransition}
                />
                <DeliveredOrderModal
                    isOpen={activeModal === 'delivered'}
                    onClose={closeModal}
                    order={orderData}
                />
                <ActivatedOrderModal
                    isOpen={activeModal === 'activated'}
                    onClose={closeModal}
                    order={orderData}
                />
            </div>
        </div>
    );
}
