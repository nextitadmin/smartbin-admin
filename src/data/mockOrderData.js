export const createMockOrder = (id) => {
    return {
        id: id,
        status: 'Pending', // Default status
        orderDate: new Date(2023, 8, 8, 14, 33),
        price: '₦10,000.00',
        customer: {
            name: 'King Kalistus',
            phone: '+234 8123456789',
            email: 'king.k@example.com',
            address: '12 Bode Thomas Avenue, Sasha Junction, Surulere, Lagos',
            lga: 'Surulere',
        },
        items: [
            { name: '12kg Smart bin', quantity: 1 }
        ],
        inventory: {
            name: 'Apapa/Warehouse',
            shipmentTo: 'Mainland/Hub/Ikeja',
            dateAdded: new Date(2023, 8, 8, 14, 33),
            dateDispatched: new Date(2023, 8, 8, 16, 0),
        },
        assignment: {
            assignedTo: {
                name: 'Adewale Adeoye',
                email: 'adewaleadeoye@email.com',
                date: '09/08/2023, 2:53PM'
            },
            updatedBy: 'Ajayi Matthew',
            assignedDate: new Date(2023, 8, 8, 14, 45),
        },
        delivery: {
            deliveredDate: new Date(2023, 8, 8, 17, 30),
        },
        activation: {
            activationDate: new Date(2023, 8, 8, 18, 0),
        }
    };
};
