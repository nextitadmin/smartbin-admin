import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/PSPs/Sidebar';
import Topbar from '../components/PSPs/Topbar';
import api from '../api/apiConfig';
// import api from '../api/apiOnlyConfig';

import { PlusIcon, OutstandingIcon, XMarkIcon, ReceiptIcon,EllipsisVerticalIcon, DocumentIcon, ExclamationTriangleIconSolid, LoadingSpinnerIcon, SortIcon, ChevronLeftIcon, ChevronRightIcon, VerifyFillIcon, CheckCircleIconSolid } from '../components/icons';
import SkeletonLoader from '../components/SkeletonLoader';



// ArrowRightIcon Component
const ArrowRightIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);



// Demo Data for Bills
const demoBills = [
    {
        id: 1,
        billNumber: 'BILL-001',
        customerName: 'John Doe',
        address: '123 Victoria Island, Lagos',
        phone: '+234 801 234 5678',
        amount: 15000,
        status: 'Outstanding',
        dueDate: '2024-01-15',
        createdAt: '2024-01-01'
    },
    {
        id: 2,
        billNumber: 'BILL-002',
        customerName: 'Jane Smith',
        address: '456 Ikoyi, Lagos',
        phone: '+234 802 345 6789',
        amount: 25000,
        status: 'Paid',
        dueDate: '2024-01-10',
        createdAt: '2024-01-02'
    },
    {
        id: 3,
        billNumber: 'BILL-003',
        customerName: 'Mike Johnson',
        address: '789 Lekki Phase 1, Lagos',
        phone: '+234 803 456 7890',
        amount: 18000,
        status: 'Overdue',
        dueDate: '2023-12-20',
        createdAt: '2023-12-15'
    },
    {
        id: 4,
        billNumber: 'BILL-004',
        customerName: 'Sarah Wilson',
        address: '321 Surulere, Lagos',
        phone: '+234 804 567 8901',
        amount: 32000,
        status: 'Paid',
        dueDate: '2024-01-05',
        createdAt: '2023-12-28'
    },
    {
        id: 5,
        billNumber: 'BILL-005',
        customerName: 'David Brown',
        address: '654 Gbagada, Lagos',
        phone: '+234 805 678 9012',
        amount: 12000,
        status: 'Outstanding',
        dueDate: '2024-01-20',
        createdAt: '2024-01-03'
    }
];

// Demo Data for Payments
const demoPayments = [
    {
        id: 1,
        transactionId: 'TXN-001',
        receiptId: 'RCP-001',
        customerName: 'Jane Smith',
        address: '456 Ikoyi, Lagos',
        amount: 25000,
        date: '2024-01-08',
        createdAt: '2024-01-08'
    },
    {
        id: 2,
        transactionId: 'TXN-002',
        receiptId: 'RCP-002',
        customerName: 'Sarah Wilson',
        address: '321 Surulere, Lagos',
        amount: 32000,
        date: '2024-01-03',
        createdAt: '2024-01-03'
    },
    {
        id: 3,
        transactionId: 'TXN-003',
        receiptId: 'RCP-003',
        customerName: 'Robert Davis',
        address: '987 Yaba, Lagos',
        amount: 15000,
        date: '2024-01-10',
        createdAt: '2024-01-10'
    },
    {
        id: 4,
        transactionId: 'TXN-004',
        receiptId: 'RCP-004',
        customerName: 'Lisa Anderson',
        address: '654 Ikeja, Lagos',
        amount: 28000,
        date: '2024-01-12',
        createdAt: '2024-01-12'
    }
];


// Date formatting utility function
const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
};

// Main Component
const BillsAndReceipts = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [activeTab, setActiveTab] = useState('bills');

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal form fields for bills
    const [newBillNumber, setNewBillNumber] = useState('');
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerEmail, setNewCustomerEmail] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newStatus, setNewStatus] = useState('Outstanding');

    // Modal form fields for payments
    const [newPaymentId, setNewPaymentId] = useState('');
    const [newBillNumberForPayment, setNewBillNumberForPayment] = useState('');
    const [newPaymentAmount, setNewPaymentAmount] = useState('');
    const [newPaymentMethod, setNewPaymentMethod] = useState('Bank Transfer');
    const [newPaymentStatus, setNewPaymentStatus] = useState('Completed');

    // Row action modal
    const [rowActionModal, setRowActionModal] = useState(false);
    const [currentBillId, setCurrentBillId] = useState(null);
    const [currentPaymentId, setCurrentPaymentId] = useState(null);
    const [actionType, setActionType] = useState('bill'); // 'bill' or 'payment'
    const [originalTab, setOriginalTab] = useState('bills'); // Store original tab before opening modal
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef();
    const buttonRef = useRef();

    // Edit bill state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingBill, setEditingBill] = useState(null);

    // Edit payment state
    const [isEditPaymentMode, setIsEditPaymentMode] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);

    // Status options for dropdowns
    const BILL_STATUSES = ['Outstanding', 'Paid', 'Overdue', 'Cancelled'];
    const PAYMENT_STATUSES = ['Completed', 'Pending', 'Failed', 'Refunded'];
    const PAYMENT_METHODS = ['Bank Transfer', 'Card Payment', 'Cash', 'Mobile Money', 'Cheque'];

    // Loading states
    const [isBillLoading, setIsBillLoading] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Card amounts state
    const [outstandingBillsTotal, setOutstandingBillsTotal] = useState(0);
    const [paymentsTotal, setPaymentsTotal] = useState(0);

    // Calculate outstanding bills total
    const calculateOutstandingBillsTotal = () => {
        const outstandingBills = bills.filter(bill => 
            bill.status === 'Outstanding' || bill.status === 'Overdue'
        );
        const total = outstandingBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
        setOutstandingBillsTotal(total);
    };

    // Calculate payments total
    const calculatePaymentsTotal = () => {
        const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        setPaymentsTotal(total);
    };

    // Reset bill form
    const resetBillForm = () => {
        setNewBillNumber('');
        setNewCustomerName('');
        setNewCustomerEmail('');
        setNewAmount('');
        setNewDueDate('');
        setNewStatus('Outstanding');
    };

    // Reset payment form
    const resetPaymentForm = () => {
        setNewPaymentId('');
        setNewBillNumberForPayment('');
        setNewPaymentAmount('');
        setNewPaymentMethod('Bank Transfer');
        setNewPaymentStatus('Completed');
    };

    // Handle bill form submission
    const handleAddBillSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!newBillNumber.trim() || !newCustomerName.trim() || !newCustomerEmail.trim() || !newAmount.trim()) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(newCustomerEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        setIsBillLoading(true);

        try {
            const billData = {
                billNumber: newBillNumber.trim(),
                customerName: newCustomerName.trim(),
                customerEmail: newCustomerEmail.trim(),
                amount: parseFloat(newAmount),
                status: newStatus,
                dueDate: newDueDate
            };

            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (isEditMode) {
                    // Update existing bill
                    const updatedBill = {
                        ...editingBill,
                        ...billData
                    };
                    setBills(prevBills => prevBills.map(bill =>
                        bill.id === editingBill.id ? updatedBill : bill
                    ));
                    showNotification('Bill updated successfully!', 'success');
                } else {
                    // Add new bill
                    const newBill = {
                        id: bills.length + 1,
                        ...billData,
                        createdAt: new Date().toISOString().split('T')[0]
                    };
                    setBills([...bills, newBill]);
                    showNotification('Bill created successfully!', 'success');
                }
            } else {
                if (isEditMode) {
                    // Update existing bill
                    const { data } = await api.put(`/bills/${editingBill.id}`, billData);
                    if (data.success) {
                        // Refresh bills list
                        const billsData = await api.get('/bills');
                        if (billsData.data.success) {
                            setBills(billsData.data.data);
                        }
                        showNotification('Bill updated successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to update bill.', 'error');
                    }
                } else {
                    // Create new bill
                    const { data } = await api.post('/bills', billData);
                    if (data.success) {
                        // Refresh bills list
                        const billsData = await api.get('/bills');
                        if (billsData.data.success) {
                            setBills(billsData.data.data);
                        }
                        showNotification('Bill created successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to create bill.', 'error');
                    }
                }
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} bill:`, error);
            showNotification(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the bill.`, 'error');
        } finally {
            setIsBillLoading(false);
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingBill(null);
            resetBillForm();
        }
    };

    // Handle payment form submission
    const handleAddPaymentSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!newPaymentId.trim() || !newBillNumberForPayment.trim() || !newPaymentAmount.trim()) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        setIsPaymentLoading(true);

        try {
            const paymentData = {
                paymentId: newPaymentId.trim(),
                billNumber: newBillNumberForPayment.trim(),
                amount: parseFloat(newPaymentAmount),
                paymentMethod: newPaymentMethod,
                status: newPaymentStatus,
                paidAt: newPaymentStatus === 'Completed' ? new Date().toISOString().split('T')[0] : null
            };

            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (isEditPaymentMode) {
                    // Update existing payment
                    const updatedPayment = {
                        ...editingPayment,
                        ...paymentData
                    };
                    setPayments(prevPayments => prevPayments.map(payment =>
                        payment.id === editingPayment.id ? updatedPayment : payment
                    ));
                    showNotification('Payment updated successfully!', 'success');
                } else {
                    // Add new payment
                    const newPayment = {
                        id: payments.length + 1,
                        ...paymentData,
                        createdAt: new Date().toISOString().split('T')[0]
                    };
                    setPayments([...payments, newPayment]);
                    showNotification('Payment created successfully!', 'success');
                }
            } else {
                if (isEditPaymentMode) {
                    // Update existing payment
                    const { data } = await api.put(`/payments/${editingPayment.id}`, paymentData);
            if (data.success) {
                        // Refresh payments list
                        const paymentsData = await api.get('/payments');
                        if (paymentsData.data.success) {
                            setPayments(paymentsData.data.data);
                        }
                        showNotification('Payment updated successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to update payment.', 'error');
                    }
            } else {
                    // Create new payment
                    const { data } = await api.post('/payments', paymentData);
                    if (data.success) {
                        // Refresh payments list
                        const paymentsData = await api.get('/payments');
                        if (paymentsData.data.success) {
                            setPayments(paymentsData.data.data);
                        }
                        showNotification('Payment created successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to create payment.', 'error');
                    }
                }
            }
        } catch (error) {
            console.error(`Error ${isEditPaymentMode ? 'updating' : 'creating'} payment:`, error);
            showNotification(`An error occurred while ${isEditPaymentMode ? 'updating' : 'creating'} the payment.`, 'error');
        } finally {
            setIsPaymentLoading(false);
            setIsModalOpen(false);
            setIsEditPaymentMode(false);
            setEditingPayment(null);
            resetPaymentForm();
        }
    };

    // Handle delete bill
    const handleDeleteBill = async () => {
        if (!currentBillId) return;

        setIsDeleting(true);

        try {
            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Remove bill from local state
                setBills(prevBills => prevBills.filter(bill => bill.id !== currentBillId));
                showNotification('Bill deleted successfully!', 'success');
                } else {
                // Make actual API call
                const { data } = await api.delete(`/bills/${currentBillId}`);

                if (data.success) {
                    // Refresh bills list
                    const billsData = await api.get('/bills');
                    if (billsData.data.success) {
                        setBills(billsData.data.data);
                    }
                    showNotification('Bill deleted successfully!', 'success');
            } else {
                    showNotification(data.message || 'Failed to delete bill.', 'error');
            }
            }
        } catch (error) {
            console.error('Error deleting bill:', error);
            showNotification('An error occurred while deleting the bill.', 'error');
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setRowActionModal(false);
            setCurrentBillId(null);
            setActiveTab(originalTab); // Return to original tab
        }
    };

    // Handle delete payment
    const handleDeletePayment = async () => {
        if (!currentPaymentId) return;

        setIsDeleting(true);

        try {
            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Remove payment from local state
                setPayments(prevPayments => prevPayments.filter(payment => payment.id !== currentPaymentId));
                showNotification('Payment deleted successfully!', 'success');
            } else {
                // Make actual API call
                const { data } = await api.delete(`/payments/${currentPaymentId}`);

                if (data.success) {
                    // Refresh payments list
                    const paymentsData = await api.get('/payments');
                    if (paymentsData.data.success) {
                        setPayments(paymentsData.data.data);
                    }
                    showNotification('Payment deleted successfully!', 'success');
                } else {
                    showNotification(data.message || 'Failed to delete payment.', 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
            showNotification('An error occurred while deleting the payment.', 'error');
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
            setRowActionModal(false);
            setCurrentPaymentId(null);
            setActiveTab(originalTab); // Return to original tab
        }
    };

    // Handle delete button click
    const handleDeleteClick = () => {
        setRowActionModal(false);
        setOriginalTab(activeTab); // Store current tab before switching
        setActiveTab('delete');
        setIsModalOpen(true);
    };

    // Handle edit bill button click
    const handleEditBillClick = () => {
        const billToEdit = bills.find(bill => bill.id === currentBillId);
        if (billToEdit) {
            setEditingBill(billToEdit);
            setNewBillNumber(billToEdit.billNumber);
            setNewCustomerName(billToEdit.customerName);
            setNewCustomerEmail(billToEdit.customerEmail);
            setNewAmount(billToEdit.amount.toString());
            setNewDueDate(billToEdit.dueDate);
            setNewStatus(billToEdit.status);
            setIsEditMode(true);
            setRowActionModal(false);
            setActiveTab('bills');
            setIsModalOpen(true);
        }
    };

    // Handle edit payment button click
    const handleEditPaymentClick = () => {
        const paymentToEdit = payments.find(payment => payment.id === currentPaymentId);
        if (paymentToEdit) {
            setEditingPayment(paymentToEdit);
            setNewPaymentId(paymentToEdit.paymentId);
            setNewBillNumberForPayment(paymentToEdit.billNumber);
            setNewPaymentAmount(paymentToEdit.amount.toString());
            setNewPaymentMethod(paymentToEdit.paymentMethod);
            setNewPaymentStatus(paymentToEdit.status);
            setIsEditPaymentMode(true);
            setRowActionModal(false);
            setActiveTab('payments');
            setIsModalOpen(true);
        }
    };


    // Fetch bills and payments (simulated API call)
    const fetchBillsAndPayments = async () => {
        setIsLoading(true);

        try {
            // Fetch bills
            const { data: billsData } = await api.get('/bills');
            const rawBills = Array.isArray(billsData) ? billsData : billsData?.data || [];
            setBills(rawBills);

            // Fetch payments (separate try-catch to not affect bills)
            try {
                const { data: paymentsData } = await api.get('/payments');
                const rawPayments = Array.isArray(paymentsData) ? paymentsData : paymentsData?.data || [];
                setPayments(rawPayments);
            } catch (paymentsError) {
                console.error('Error fetching payments:', paymentsError);
                setPayments(demoPayments);
            }

        } catch (error) {
            console.error('Error fetching bills:', error);
            // Fallback to demo data
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            setBills(demoBills);
            setPayments(demoPayments);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBillsAndPayments();
    }, []);

    // Recalculate totals when bills or payments change
    useEffect(() => {
        calculateOutstandingBillsTotal();
    }, [bills]);

    useEffect(() => {
        calculatePaymentsTotal();
    }, [payments]);

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
        }, 3000);
    };

    // Filtered and sorted bills
    const filteredBills = useMemo(() => {
        const search = searchTerm || '';
        let filtered = bills.filter(bill =>
            (bill.billNumber || '').toLowerCase().includes(search.toLowerCase()) ||
            (bill.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (bill.customerEmail || '').toLowerCase().includes(search.toLowerCase()) ||
            (bill.status || '').toLowerCase().includes(search.toLowerCase()) ||
            (bill.amount || 0).toString().includes(search)
        );

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // Handle numeric comparisons for amount
                if (sortConfig.key === 'amount') {
                    const aVal = a.amount || 0;
                    const bVal = b.amount || 0;
                    if (aVal === bVal) return 0;
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                // Handle status sorting
                if (sortConfig.key === 'status') {
                    if (a.status === b.status) return 0;
                    if (sortConfig.direction === 'asc') {
                        return a.status === 'Paid' ? -1 : 1;
                    } else {
                        return a.status === 'Paid' ? 1 : -1;
                    }
                }

                // Handle other string comparisons
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sorting: show newest data at the top (by ID descending)
            filtered.sort((a, b) => {
                const aId = a.id || a._id || 0;
                const bId = b.id || b._id || 0;
                return bId - aId; // Descending order (newest first)
            });
        }

        return filtered;
    }, [bills, searchTerm, sortConfig]);

    // Filtered and sorted payments
    const filteredPayments = useMemo(() => {
        const search = searchTerm || '';
        let filtered = payments.filter(payment =>
            (payment.paymentId || '').toLowerCase().includes(search.toLowerCase()) ||
            (payment.billNumber || '').toLowerCase().includes(search.toLowerCase()) ||
            (payment.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (payment.paymentMethod || '').toLowerCase().includes(search.toLowerCase()) ||
            (payment.status || '').toLowerCase().includes(search.toLowerCase()) ||
            (payment.amount || 0).toString().includes(search)
        );

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // Handle numeric comparisons for amount
                if (sortConfig.key === 'amount') {
                    const aVal = a.amount || 0;
                    const bVal = b.amount || 0;
                    if (aVal === bVal) return 0;
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                // Handle status sorting
                if (sortConfig.key === 'status') {
                    if (a.status === b.status) return 0;
                    if (sortConfig.direction === 'asc') {
                        return a.status === 'Completed' ? -1 : 1;
                    } else {
                        return a.status === 'Completed' ? 1 : -1;
                    }
                }

                // Handle other string comparisons
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sorting: show newest data at the top (by ID descending)
            filtered.sort((a, b) => {
                const aId = a.id || a._id || 0;
                const bId = b.id || b._id || 0;
                return bId - aId; // Descending order (newest first)
            });
        }

        return filtered;
    }, [payments, searchTerm, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil((activeTab === 'bills' ? filteredBills.length : filteredPayments.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = activeTab === 'bills'
        ? filteredBills.slice(startIndex, endIndex)
        : filteredPayments.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

    // Pagination navigation functions
    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const resetForm = () => {
        resetBillForm();
        resetPaymentForm();
    };

    // Export data to CSV
    const handleExportData = async () => {
        setIsExporting(true);

        // Add a small delay to make the loading state visible
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            let csvContent = '';
            let filename = '';

            if (activeTab === 'bills') {
                // Export bills data
                const headers = ['S/N', 'Bill Number', 'Customer Name', 'Customer Email', 'Amount', 'Status', 'Due Date'];
                const rows = filteredBills.map((bill, index) => [
                    index + 1,
                    `"${bill.billNumber}"`,
                    `"${bill.customerName}"`,
                    `"${bill.customerEmail}"`,
                    bill.amount,
                    `"${bill.status}"`,
                    `"${bill.dueDate}"`
                ]);

                csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
                filename = `bills-${new Date().toISOString().split('T')[0]}.csv`;
            } else {
                // Export payments data
                const headers = ['S/N', 'Payment ID', 'Bill Number', 'Customer Name', 'Amount', 'Payment Method', 'Status', 'Paid At'];
                const rows = filteredPayments.map((payment, index) => [
                    index + 1,
                    `"${payment.paymentId}"`,
                    `"${payment.billNumber}"`,
                    `"${payment.customerName}"`,
                    payment.amount,
                    `"${payment.paymentMethod}"`,
                    `"${payment.status}"`,
                    `"${payment.paidAt || 'N/A'}"`
                ]);

                csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
                filename = `payments-${new Date().toISOString().split('T')[0]}.csv`;
            }

            // Create and download the file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            showNotification(`${activeTab === 'bills' ? 'Bills' : 'Payments'} data exported successfully!`, 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // Handle row action click
    const handleRowActionClick = (id, event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({
            top: buttonRect.bottom + window.scrollY + 8,
            left: buttonRect.right - 160 + window.scrollX // 160px is min-width of dropdown
        });

        if (activeTab === 'bills') {
            setCurrentBillId(id);
            setCurrentPaymentId(null);
            setActionType('bill');
        } else {
            setCurrentPaymentId(id);
            setCurrentBillId(null);
            setActionType('payment');
        }

        setRowActionModal(true);
    };

    // Close row action modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (rowActionModal && modalRef.current && !modalRef.current.contains(event.target)) {
                setRowActionModal(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [rowActionModal]);

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        setCurrentBillId(null);
        setCurrentPaymentId(null);
        setIsEditMode(false);
        setEditingBill(null);
        setIsEditPaymentMode(false);
        setEditingPayment(null);
        // Return to original tab when closing delete modal
        if (activeTab === 'delete') {
            setActiveTab(originalTab);
        }
        // Don't reset actionType here - let it be preserved for the next modal
    };

    // Status badge
    const StatusBadge = ({ status, type = 'bill' }) => {
        let color = 'text-zinc-500';
        
        if (type === 'bill') {
            if (status === 'Paid') color = 'text-green-700';
            else if (status === 'Overdue') color = 'text-red-600';
            else if (status === 'Outstanding') color = 'text-yellow-600';
            else if (status === 'Cancelled') color = 'text-gray-500';
        } else if (type === 'payment') {
            if (status === 'Completed') color = 'text-green-700';
            else if (status === 'Failed') color = 'text-red-600';
            else if (status === 'Pending') color = 'text-yellow-600';
            else if (status === 'Refunded') color = 'text-blue-600';
        }
        
        return <span className={`font-medium ${color}`}>{status}</span>;
    };

    // Pagination Component
    const PaginationComponent = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center text-sm text-zinc-700">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-300 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-700 border border-zinc-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Portal-based dropdown component
    const DropdownPortal = () => {
        if (!rowActionModal) return null;

        return createPortal(
            <div
                ref={modalRef}
                className="fixed z-[9999] bg-white rounded-lg shadow-lg border border-zinc-200 py-1 min-w-[160px]"
                style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                }}
            >
                {actionType === 'bill' ? (
                    <>
                        <button
                            onClick={handleEditBillClick}
                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Edit bill
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEditPaymentClick}
                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Edit payment
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>,
            document.body
        );
    };

    const [isVerifyPaymentModalOpen, setIsVerifyPaymentModalOpen] = useState(false);
    const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);
    const [selectedReceiptId, setSelectedReceiptId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Handle navigation to outstanding bills
    const handleSeeAllOutstanding = () => {
        console.log('Navigating to outstanding bills...');
        navigate('/outstanding-bills');
    };

    // Handle verify payment
    const handleVerifyPayment = async () => {
        if (!selectedReceiptId) {
            showNotification('Please select a receipt ID to verify.', 'error');
            return;
        }

        setIsVerifying(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Find the payment by receipt ID
            const payment = payments.find(p => p.receiptId === selectedReceiptId);
            
            if (payment) {
                showNotification(`Payment verified successfully! Receipt ID: ${selectedReceiptId}`, 'success');
                setIsVerifyPaymentModalOpen(false);
                setIsVerifiedSuccess(true);
                setSelectedReceiptId('');
            } else {
                showNotification('Receipt ID not found. Please check and try again.', 'error');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            showNotification('An error occurred while verifying the payment.', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex sans h-screen">
            <Sidebar addkey="1" activeRoute="/bills-and-receipts" />
            <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                <Topbar />
                <div className="bg-zinc-100 font-sans">
                    <main className="p-4 md:px-4">
                        <div className="p-4 md:p-8 font-sans">
                            {/* Notification */}
                            {notification.visible && (
                                <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-white flex items-center space-x-2
                                      ${notification.type === 'success' ? 'bg-green-700' : 'bg-red-500'}`}
                                >
                                    {notification.type === 'success' ? <CheckCircleIconSolid className="h-5 w-5" /> : <ExclamationTriangleIconSolid className="h-5 w-5" />}
                                    <span>{notification.message}</span>
                                    <button onClick={() => setNotification({ ...notification, visible: false })} className="ml-auto">
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">Bills & Receipts</h1>
                                    <p className="text-zinc-500 text-lg font-light">Manage cleared and outstanding payments</p>
                                </div>
                            </header>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-6 mb-8">
                                {isLoading ? (
                                    // Skeleton loader for cards
                                    <>
                                        {/* Outstanding Bills Card Skeleton */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6 animate-pulse">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="h-10 w-10 bg-zinc-200 rounded"></div>
                                                    <div className="h-4 bg-zinc-200 rounded w-24"></div>
                                                    <div className="h-8 bg-zinc-200 rounded w-32"></div>
                                                </div>
                                                <div className="h-8 bg-zinc-200 rounded w-16"></div>
                                            </div>
                                        </div>

                                        {/* Payments Card Skeleton */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6 animate-pulse">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="h-10 w-10 bg-zinc-200 rounded-full"></div>
                                                    <div className="h-4 bg-zinc-200 rounded w-20"></div>
                                                    <div className="h-8 bg-zinc-200 rounded w-28"></div>
                                                </div>
                                                <div className="h-8 bg-zinc-200 rounded w-16"></div>
                                            </div>
                                        </div>

                                        {/* Verify Payment Card Skeleton */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6 animate-pulse">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center mb-4 mx-auto">
                                                    <div className="h-12 w-12 bg-zinc-200 rounded"></div>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-4 bg-zinc-200 rounded w-24"></div>
                                                    <div className="h-5 w-5 bg-zinc-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Outstanding Bills Card */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6 hover:bg-green-800 hover:text-white transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="text-green-800 group-hover:text-white">
                                                        <OutstandingIcon className="h-10 w-10" style={{ color: 'inherit' }} />
                                                    </div>
                                                    <p className="text-zinc-500 group-hover:text-white text-sm mb-1">Outstanding Bills</p>
                                                    <p className="text-2xl font-bold text-green-800 group-hover:text-white mb-4">N {outstandingBillsTotal.toLocaleString()}</p>
                                                </div>
                                                <button 
                                                    className="px-4 py-2 text-green-800 group-hover:text-white text-sm rounded-md transition-colors duration-200" 
                                                    onClick={handleSeeAllOutstanding}
                                                >
                                                    See all
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payments Card */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6 hover:bg-green-800 hover:text-white transition-all duration-200 cursor-pointer group">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-2">
                                                    <div className="text-green-800 group-hover:text-white bg-green-800 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                                                        <ReceiptIcon className="h-10 w-10" style={{ color: 'inherit' }} />
                                                    </div>
                                                    <p className="text-zinc-500 group-hover:text-white text-sm mb-1">Payments</p>
                                                    <p className="text-2xl font-bold text-green-800 group-hover:text-white mb-4">N {paymentsTotal.toLocaleString()}</p>
                                                </div>
                                                <button className="px-4 py-2 text-green-800 group-hover:text-white text-sm rounded-md transition-colors duration-200" onClick={() => navigate('/payments')}>
                                                    See all
                                                </button>
                                            </div>
                                        </div>

                                        {/* Verify Payment Card */}
                                        <div className="flex-1 min-w-[200px] bg-white rounded-lg p-6  hover:bg-green-800 hover:text-white transition-all duration-200 cursor-pointer group">
                                            <div className="text-center">
                                                <div className="flex items-center justify-center mb-4 mx-auto">
                                                    <div className="text-green-800 group-hover:text-white">
                                                        <VerifyFillIcon className="h-15 w-15" style={{ color: 'inherit' }}/>
                                                        
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center gap-2 mb-1" onClick={() => setIsVerifyPaymentModalOpen(true)}>
                                                    <p className="text-zinc-500 group-hover:text-white text-sm">Verify Payment</p>
                                                    <ArrowRightIcon className="h-5 w-5 text-green-600 group-hover:text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Active selection */}
                            <div className='inline-flex gap-7 text-lg mb-7 border-b border-zinc-200'>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'bills'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('bills')}
                                >
                                    Bills
                                </button>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'payments'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('payments')}
                                >
                                    Payments
                                </button>
                            </div>


                            <div className="overflow-x-auto">

                                {isLoading ? (
                                    <SkeletonLoader />
                                ) : (activeTab === 'bills' ? filteredBills.length === 0 : filteredPayments.length === 0) ? (
                                    <div className="flex flex-col justify-center items-center mt-20">
                                        <h2 className="text-xl mb-1 sans">
                                            {activeTab === 'bills' ? 'No bills found' : 'No payments found'}
                                        </h2>
                                        <p className="text-zinc-400 mt-2 font-light">
                                            {activeTab === 'bills'
                                                ? 'There are no bills matching your search.'
                                                : 'There are no payments matching your search.'
                                            }
                                        </p>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="mt-6 text-zinc-600 pointer lg:w-1/2 rounded-xl text-lg mb-6 flex flex-row items-center font-light justify-center p-3"
                                        >
                                            <PlusIcon className="mr-2 h-5 w-5" />
                                            {activeTab === 'bills' ? 'Add New Bill' : 'Add New Payment'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                                        <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                                            <thead className="border-b border-zinc-200">
                                                {activeTab === 'bills' ? (
                                                    <tr>
                                                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                                                            <div className="flex items-center">
                                                                S/N
                                                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('billNumber')}>
                                                            <div className="flex items-center">
                                                                Bill ID
                                                                <SortIcon direction={sortConfig.key === 'billID' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('customerName')}>
                                                            <div className="flex items-center">
                                                                Customer Name
                                                                <SortIcon direction={sortConfig.key === 'customerName' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('customerEmail')}>
                                                            <div className="flex items-center">
                                                                Address
                                                                <SortIcon direction={sortConfig.key === 'address' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                                            <div className="flex items-center">
                                                                Phone Number
                                                                <SortIcon direction={sortConfig.key === 'phone' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dueDate')}>
                                                            <div className="flex items-center">
                                                                Due Date
                                                                <SortIcon direction={sortConfig.key === 'dueDate' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                                                            <div className="flex items-center">
                                                                Amount (₦)
                                                                {/* <SortIcon direction={sortConfig.key === 'amount' ? sortConfig.direction : null} /> */}
                                                            </div>
                                                        </th>
                                                        
                                                        
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                                                            <div className="flex items-center">
                                                                S/N
                                                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('paymentId')}>
                                                            <div className="flex items-center">
                                                                Transaction ID
                                                                <SortIcon direction={sortConfig.key === 'transactionId' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('billNumber')}>
                                                            <div className="flex items-center">
                                                                Receipt ID
                                                                <SortIcon direction={sortConfig.key === 'receiptId' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('customerName')}>
                                                            <div className="flex items-center">
                                                                Customer Name
                                                                <SortIcon direction={sortConfig.key === 'customerName' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                                            <div className="flex items-center">
                                                                Address
                                                                <SortIcon direction={sortConfig.key === 'address' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                                                            <div className="flex items-center">
                                                                Amount (₦)
                                                                <SortIcon direction={sortConfig.key === 'amount' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                                                            <div className="flex items-center">
                                                                Date
                                                                {/* <SortIcon direction={sortConfig.key === 'date' ? sortConfig.direction : null} /> */}
                                                            </div>
                                                        </th>
                                                       
                                                       
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200">
                                                {activeTab === 'bills' ? (
                                                    currentPageItems.map((bill, index) => (
                                                        <tr key={bill.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{startIndex + index + 1}.</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{bill.billNumber}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.customerName}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.address}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.phone}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{formatDateToDDMMYY(bill.dueDate)}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.amount?.toLocaleString()}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    currentPageItems.map((payment, index) => (
                                                        <tr key={payment.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{startIndex + index + 1}.</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{payment.transactionId}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{payment.receiptId}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{payment.customerName}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{payment.address}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{payment.amount?.toLocaleString()}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{formatDateToDDMMYY(payment.date)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <PaginationComponent />

                          

                            {/* verify modal */}
                            {isVerifyPaymentModalOpen && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-end items-center mb-10">
                                            
                                            <button 
                                                onClick={() => {
                                                    setIsVerifyPaymentModalOpen(false);
                                                    setSelectedReceiptId('');
                                                }} 
                                                className="text-zinc-400 hover:text-zinc-600"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-zinc-800 text-center mb-10">Verify Payment</h3>
                                        
                                        <div className="mb-6">
                                            <label htmlFor="receiptId" className="block text-sm font-medium text-zinc-500 mb-2">
                                                Receipt ID
                                            </label>
                                            {payments.length === 0 ? (
                                                <div className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl bg-zinc-50 text-zinc-500 text-center">
                                                    No payments available to verify
                                                </div>
                                            ) : (
                                                <select
                                                    id="receiptId"
                                                    value={selectedReceiptId}
                                                    onChange={(e) => setSelectedReceiptId(e.target.value)}
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 cursor-pointer"
                                                    required
                                                >
                                                    <option value="">Choose a receipt ID...</option>
                                                    {payments.map((payment) => (
                                                        <option key={payment.id} value={payment.receiptId}>
                                                            {payment.receiptId} - {payment.customerName} (₦{payment.amount?.toLocaleString()})
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        <div className="">
                                            <button
                                                onClick={handleVerifyPayment}
                                                disabled={isVerifying || !selectedReceiptId || payments.length === 0}
                                                className="bg-green-700 hover:bg-green-600 w-full text-white text-lg p-2 px-8 rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    'VERIFY'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* verified modal */}
                        {isVerifiedSuccess && (
                            <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-end items-center mb-1"> 
                                        <button 
                                            onClick={() => {
                                                setIsVerifiedSuccess(false);
                                            }} 
                                            className="text-zinc-400 hover:text-zinc-600"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center justify-center space-y-4 p-20">
                                        <VerifyFillIcon className="h-40 w-40 text-green-600 p-[-10px] m-[-40px] leading-none" />
                                        <h3 className="text-2xl font-semibold text-green-800">Verified!</h3>
                                        <p className="text-zinc-600">
                                            Payment verified successfully!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <DropdownPortal />
        </div>
    );
};

export default BillsAndReceipts;