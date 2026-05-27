import React, { useState } from 'react';
import PendingOrderModal from '../components/TeamMembers/PendingModal';

const TestFinishDelivery = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastAction, setLastAction] = useState(null);

    const mockOrder = {
        id: '#09001A',
        applicationId: 'mock-app-id-123',
        status: 'Pending',
        price: '₦100,000',
        orderDate: new Date().toISOString(),
        customer: {
            name: 'John Doe',
            phone: '08012345678',
            email: 'john@example.com',
            address: '123 Test Street, Lagos',
            lga: 'Ikeja'
        },
        items: [
            { name: '50kg Smart bin', quantity: 1 }
        ]
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLastAction('Closed modal');
    };

    const handleTransition = () => {
        setIsModalOpen(false);
        setLastAction('Transitioned (Action Completed)');
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Pending Modal & Finish Delivery Flow Test</h1>

            <div className="mb-8">
                <button
                    onClick={handleOpenModal}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Open Pending Order Modal
                </button>
            </div>

            {lastAction && (
                <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">Last Action:</h2>
                    <p className="font-medium text-zinc-700">{lastAction}</p>
                </div>
            )}

            <PendingOrderModal
                isOpen={isModalOpen}
                order={mockOrder}
                onClose={handleCloseModal}
                onTransition={handleTransition}
            />
        </div>
    );
};

export default TestFinishDelivery;
