import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../SuperAdmin/Sidebar';
import Topbar from '../SuperAdmin/Topbar';


// Helper function to convert number to words (Nigerian Naira)
const numberToWordsNaira = (num) => {
    if (num === null || num === undefined) return '';
    if (num === 0) return 'Zero Naira Only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    let word = '';

    const toWords = (n) => {
        if (n === 0) return '';
        if (n < 10) return ones[n] + ' ';
        if (n < 20) return teens[n - 10] + ' ';
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '') + ' ';
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + toWords(n % 100, '') : '') + ' ';
        return '';
    };

    let i = 0;
    let number = num;
    while (number > 0) {
        if (number % 1000 !== 0) {
            word = toWords(number % 1000, '') + thousands[i] + (i > 0 ? ' ' : '') + word;
        }
        number = Math.floor(number / 1000);
        i++;
    }

    return word.trim() + ' Naira Only';
};

// Default data for the receipt, embedded directly for standalone use



const BillsReceipt = () => {
    console.log('PaymentReceipt component is rendering');
    let navigate = useNavigate()
    const [receiptData, setReceiptData] = useState({});
    const [loading, setLoading] = useState(true);

    // Mock payment data that matches the Payments.jsx data structure
    const mockPaymentData = {
        "PAY-001": {
            recipientName: "Adetutu James",
            transactionId: "TXN-001-2025",
            paymentId: "PAY-001",
            transactionRef: "REF-001-2025",
            phoneNumber: "+234 801 234 5678",
            transactionDate: "26-05-2025 10:30:00",
            paymentItems: [
                { description: "Smart bin service fee", amount: 15000 },
                { description: "Installation and setup fee", amount: 8500 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Three Thousand Five Hundred Naira Only",
            address: "123 Victoria Island, Lagos",
            paymentMethod: "Bank Transfer",
            status: "Completed"
        },
        "PAY-002": {
            recipientName: "John Doe",
            transactionId: "TXN-002-2025",
            paymentId: "PAY-002",
            transactionRef: "REF-002-2025",
            phoneNumber: "+234 802 345 6789",
            transactionDate: "28-05-2025 14:15:00",
            paymentItems: [
                { description: "Monthly subscription", amount: 25000 },
                { description: "Maintenance fee", amount: 12000 },
                { description: "Service upgrade", amount: 8000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Forty Five Thousand Naira Only",
            address: "456 Ikoyi, Lagos",
            paymentMethod: "Card Payment",
            status: "Pending"
        },
        "PAY-003": {
            recipientName: "Jane Smith",
            transactionId: "TXN-003-2025",
            paymentId: "PAY-003",
            transactionRef: "REF-003-2025",
            phoneNumber: "+234 803 456 7890",
            transactionDate: "30-05-2025 09:45:00",
            paymentItems: [
                { description: "Service fee", amount: 18000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Eighteen Thousand Naira Only",
            address: "789 Lekki, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Completed"
        },
        "PAY-004": {
            recipientName: "Mike Johnson",
            transactionId: "TXN-004-2025",
            paymentId: "PAY-004",
            transactionRef: "REF-004-2025",
            phoneNumber: "+234 804 567 8901",
            transactionDate: "01-06-2025 11:20:00",
            paymentItems: [
                { description: "Quarterly payment", amount: 32000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Thirty Two Thousand Naira Only",
            address: "321 Surulere, Lagos",
            paymentMethod: "Bank Transfer",
            status: "Failed"
        },
        "PAY-005": {
            recipientName: "Sarah Wilson",
            transactionId: "TXN-005-2025",
            paymentId: "PAY-005",
            transactionRef: "REF-005-2025",
            phoneNumber: "+234 805 678 9012",
            transactionDate: "03-06-2025 16:45:00",
            paymentItems: [
                { description: "Maintenance fee", amount: 12000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twelve Thousand Naira Only",
            address: "654 Yaba, Lagos",
            paymentMethod: "Card Payment",
            status: "Completed"
        },
        "PAY-006": {
            recipientName: "David Brown",
            transactionId: "TXN-006-2025",
            paymentId: "PAY-006",
            transactionRef: "REF-006-2025",
            phoneNumber: "+234 806 789 0123",
            transactionDate: "05-06-2025 08:30:00",
            paymentItems: [
                { description: "Installation fee", amount: 22000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Two Thousand Naira Only",
            address: "987 Ikeja, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Pending"
        },
        "PAY-007": {
            recipientName: "Lisa Davis",
            transactionId: "TXN-007-2025",
            paymentId: "PAY-007",
            transactionRef: "REF-007-2025",
            phoneNumber: "+234 807 890 1234",
            transactionDate: "07-06-2025 13:15:00",
            paymentItems: [
                { description: "Service upgrade", amount: 28000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Eight Thousand Naira Only",
            address: "147 Gbagada, Lagos",
            paymentMethod: "Bank Transfer",
            status: "Completed"
        },
        "PAY-008": {
            recipientName: "Robert Taylor",
            transactionId: "TXN-008-2025",
            paymentId: "PAY-008",
            transactionRef: "REF-008-2025",
            phoneNumber: "+234 808 901 2345",
            transactionDate: "10-06-2025 09:00:00",
            paymentItems: [
                { description: "Monthly subscription", amount: 19500 }
            ],
            currencySymbol: "₦",
            amountInWords: "Nineteen Thousand Five Hundred Naira Only",
            address: "258 Victoria Island, Lagos",
            paymentMethod: "Card Payment",
            status: "Completed"
        },
        "PAY-009": {
            recipientName: "Grace Okafor",
            transactionId: "TXN-009-2025",
            paymentId: "PAY-009",
            transactionRef: "REF-009-2025",
            phoneNumber: "+234 809 012 3456",
            transactionDate: "12-06-2025 15:30:00",
            paymentItems: [
                { description: "Service fee", amount: 31000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Thirty One Thousand Naira Only",
            address: "369 Ikoyi, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Failed"
        },
        "PAY-010": {
            recipientName: "Emmanuel Adebayo",
            transactionId: "TXN-010-2025",
            paymentId: "PAY-010",
            transactionRef: "REF-010-2025",
            phoneNumber: "+234 810 123 4567",
            transactionDate: "15-06-2025 12:00:00",
            paymentItems: [
                { description: "Installation fee", amount: 27500 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Seven Thousand Five Hundred Naira Only",
            address: "741 Lekki, Lagos",
            paymentMethod: "Bank Transfer",
            status: "Completed"
        },
        // Additional entries for the reconciliation page
        "PAY-011": {
            recipientName: "Smart Bin Customer 11",
            transactionId: "TXN-011-2025",
            paymentId: "PAY-011",
            transactionRef: "REF-011-2025",
            phoneNumber: "+234 811 234 5678",
            transactionDate: "16-06-2025 10:30:00",
            paymentItems: [
                { description: "Waste Collection Service", amount: 20050 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Thousand Fifty Naira Only",
            address: "123 Main Street, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Completed"
        },
        "PAY-012": {
            recipientName: "Smart Bin Customer 12",
            transactionId: "TXN-012-2025",
            paymentId: "PAY-012",
            transactionRef: "REF-012-2025",
            phoneNumber: "+234 812 345 6789",
            transactionDate: "17-06-2025 14:15:00",
            paymentItems: [
                { description: "Smart Bin purchase", amount: 20100 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Thousand One Hundred Naira Only",
            address: "456 Business District, Lagos",
            paymentMethod: "In-app wallet",
            status: "Completed"
        },
        "PAY-013": {
            recipientName: "Smart Bin Customer 13",
            transactionId: "TXN-013-2025",
            paymentId: "PAY-013",
            transactionRef: "REF-013-2025",
            phoneNumber: "+234 813 456 7890",
            transactionDate: "18-06-2025 09:45:00",
            paymentItems: [
                { description: "Waste Collection Service", amount: 20150 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Thousand One Hundred Fifty Naira Only",
            address: "789 Residential Area, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Completed"
        },
        "PAY-014": {
            recipientName: "Smart Bin Customer 14",
            transactionId: "TXN-014-2025",
            paymentId: "PAY-014",
            transactionRef: "REF-014-2025",
            phoneNumber: "+234 814 567 8901",
            transactionDate: "19-06-2025 11:20:00",
            paymentItems: [
                { description: "Smart Bin purchase", amount: 20200 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Thousand Two Hundred Naira Only",
            address: "321 Commercial Street, Lagos",
            paymentMethod: "In-app wallet",
            status: "Completed"
        },
        "PAY-015": {
            recipientName: "Smart Bin Customer 15",
            transactionId: "TXN-015-2025",
            paymentId: "PAY-015",
            transactionRef: "REF-015-2025",
            phoneNumber: "+234 815 678 9012",
            transactionDate: "20-06-2025 16:45:00",
            paymentItems: [
                { description: "Waste Collection Service", amount: 20250 }
            ],
            currencySymbol: "₦",
            amountInWords: "Twenty Thousand Two Hundred Fifty Naira Only",
            address: "654 Industrial Zone, Lagos",
            paymentMethod: "Alat by Wema",
            status: "Completed"
        },
        "PAY-016": {
            recipientName: "Lagos Business Center",
            transactionId: "TXN-016-2025",
            paymentId: "PAY-016",
            transactionRef: "REF-016-2025",
            phoneNumber: "+234 816 789 0123",
            transactionDate: "22-06-2025 11:30:00",
            paymentItems: [
                { description: "Smart bin rental fee", amount: 30000 },
                { description: "Monthly maintenance", amount: 15000 },
                { description: "Waste collection service", amount: 12000 },
                { description: "Environmental compliance fee", amount: 8000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Sixty Five Thousand Naira Only",
            address: "789 Business District, Lagos",
            paymentMethod: "Bank Transfer",
            status: "Completed"
        },
        "PAY-017": {
            recipientName: "Victoria Island Mall",
            transactionId: "TXN-017-2025",
            paymentId: "PAY-017",
            transactionRef: "REF-017-2025",
            phoneNumber: "+234 817 890 1234",
            transactionDate: "24-06-2025 14:45:00",
            paymentItems: [
                { description: "Smart bin installation", amount: 45000 },
                { description: "Setup and configuration", amount: 20000 },
                { description: "Training and support", amount: 10000 }
            ],
            currencySymbol: "₦",
            amountInWords: "Seventy Five Thousand Naira Only",
            address: "123 Victoria Island, Lagos",
            paymentMethod: "Card Payment",
            status: "Completed"
        }
    };

    const fetchData = async () => {
        const currentId = localStorage.getItem('paymentId');
        const paymentDataString = localStorage.getItem('paymentData');
        console.log('Payment ID from localStorage:', currentId);
        console.log('Payment data from localStorage:', paymentDataString);
        setLoading(true);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let receiptData;
            
            // First try to use data from localStorage (from Reconciliation page)
            if (paymentDataString) {
                const parsedData = JSON.parse(paymentDataString);
                console.log('Using data from reconciliation table:', parsedData);
                
                // Calculate total amount for amountInWords if not provided
                const totalAmount = parsedData.paymentItems ? 
                    parsedData.paymentItems.reduce((sum, item) => sum + item.amount, 0) : 
                    parseFloat(parsedData.amount) || 0;
                
                receiptData = {
                    recipientName: parsedData.recipientName || "Customer Name",
                    transactionId: parsedData.transactionId || `TXN-${currentId}`,
                    paymentId: parsedData.paymentId || currentId || "PAY-UNKNOWN",
                    transactionRef: parsedData.transactionRef || `REF-${currentId}`,
                    phoneNumber: parsedData.phoneNumber || "+234 800 000 0000",
                    transactionDate: parsedData.transactionDate || new Date().toLocaleString(),
                    paymentItems: parsedData.paymentItems || [{ description: "Payment for services", amount: totalAmount }],
                    currencySymbol: parsedData.currencySymbol || "₦",
                    amountInWords: parsedData.amountInWords || numberToWordsNaira(totalAmount),
                    address: parsedData.address || "Address not available",
                    paymentMethod: parsedData.paymentMethod || "Unknown",
                    status: parsedData.status || "Unknown"
                };
            } else {
                // Fallback to mock data if available
                const mockData = mockPaymentData[currentId];
                if (mockData) {
                    receiptData = mockData;
                } else {
                    // Default fallback
                    receiptData = {
                        recipientName: "Customer Name",
                        transactionId: currentId ? `TXN-${currentId}` : "TXN-UNKNOWN",
                        paymentId: currentId || "PAY-UNKNOWN",
                        transactionRef: currentId ? `REF-${currentId}` : "REF-UNKNOWN",
                        phoneNumber: "+234 800 000 0000",
                        transactionDate: new Date().toLocaleString(),
                        paymentItems: [
                            { description: "Payment for services", amount: 0 }
                        ],
                        currencySymbol: "₦",
                        amountInWords: "Zero Naira Only",
                        address: "Address not available",
                        paymentMethod: "Unknown",
                        status: "Unknown"
                    };
                }
            }
            
            console.log('Setting receipt data:', receiptData);
            setReceiptData(receiptData);
        } catch (error) {
            console.log("Error fetching receipt data:", error);
            // Set default data on error
            setReceiptData({
                recipientName: "Customer Name",
                transactionId: "TXN-ERROR",
                paymentId: currentId || "PAY-ERROR",
                transactionRef: "REF-ERROR",
                phoneNumber: "+234 800 000 0000",
                transactionDate: new Date().toLocaleString(),
                paymentItems: [
                    { description: "Payment for services", amount: 0 }
                ],
                currencySymbol: "₦",
                amountInWords: "Zero Naira Only",
                address: "Address not available",
                paymentMethod: "Unknown",
                status: "Error"
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const receiptRef = useRef(null);


    const amountInWords = receiptData.amountInWords;


    const handleDownloadPdf = () => {
        const input = receiptRef.current;
        if (!input) {
            console.error("Receipt element not found");
            return;
        }

        html2canvas(input, {
            scale: 3,
            useCORS: true,
            logging: true,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                const topMarginMm = 10; // Reduced top margin to move receipt up
                const marginMm = 5;
                const pdfPageWidthMm = pdf.internal.pageSize.getWidth();
                const pdfPageHeightMm = pdf.internal.pageSize.getHeight();
                const effectiveWidthMm = pdfPageWidthMm - (2 * marginMm);
                const effectiveHeightMm = pdfPageHeightMm - topMarginMm - marginMm;
                const canvasWidthPx = canvas.width;
                const canvasHeightPx = canvas.height;
                const aspectRatio = canvasHeightPx / canvasWidthPx;

                let imageDisplayWidthMm = effectiveWidthMm;
                let imageDisplayHeightMm = imageDisplayWidthMm * aspectRatio;

                if (imageDisplayHeightMm > effectiveHeightMm) {
                    imageDisplayHeightMm = effectiveHeightMm;
                    imageDisplayWidthMm = imageDisplayHeightMm / aspectRatio;
                }

                const xOffsetMm = marginMm + (effectiveWidthMm - imageDisplayWidthMm) / 2;
                const yOffsetMm = topMarginMm;
                // const yOffsetMm = marginMm + (effectiveHeightMm - imageDisplayHeightMm) / 2;

                pdf.addImage(imgData, 'PNG', xOffsetMm, yOffsetMm, imageDisplayWidthMm, imageDisplayHeightMm);
                pdf.save(`receipt-${receiptData.transactionId || 'download'}.pdf`);
            })
            .catch(err => {
                console.error("Error generating PDF:", err);
                alert("An error occurred while generating the PDF. Please check the console for details.");
            });
    };
    const goBack = () => {
        // Always navigate back to reconciliation since this is the SuperAdmin Receipt component
        navigate("/reconciliation");
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <Sidebar />
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Topbar */}
                    <Topbar />
                    
                    {/* Loading Content */}
                    <div className="flex-1 flex justify-center items-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading receipt...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Debug: Show if no receipt data
    if (!receiptData || Object.keys(receiptData).length === 0) {
        return (
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar */}
                <Sidebar />
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Topbar */}
                    <Topbar />
                    
                    {/* Error Content */}
                    <div className="flex-1 flex justify-center items-center">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-red-600 mb-4">No Receipt Data</h2>
                            <p className="text-gray-600 mb-4">Unable to load receipt data</p>
                            <button
                                onClick={goBack}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Back to Previous Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar />
                
                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className='flex justify-between w-full px-5 md:px-20'>

                        <button
                            onClick={goBack}
                            className="mt-8  hover:bg-[#f4f4f4] text-[#555] font-semibold transition duration-150 ease-in-out flex p-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:ring-opacity-50"

                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                            <span>  Back</span>
                        </button>

                        {/* Download Button */}
                        <button
                            onClick={handleDownloadPdf}
                            className="mt-8 bg-[#15803d] hover:bg-[#16a34a] text-[#ffffff] font-semibold   rounded-lg shadow-md transition duration-150 ease-in-out flex p-4 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:ring-opacity-50"
                        >
                            <span className='px-2'> Download</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>

                        </button>
                    </div>

                    <div className="p-4 sm:p-8 flex flex-col items-center min-h-screen font-sans">
                        <div ref={receiptRef} className="w-full max-w-4xl bg-[#ffffff] p-8">
                            {/* Header Section with Logo and Title */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center flex-col">
                                    <img src="/images/sealLogo.svg" alt="Lagos State Seal" className="h-16 w-16 mr-4" />
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#333333] ">
                                            UTILITIES SERVICE PROVIDER 
                                        </p>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                                        INITIATIVE BY THE LAGOS
                                        </p>
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                                         STATE GOVERNMENT
                                        </p>
                                        {/* <p className="text-xs font-bold uppercase tracking-wide text-gray-800">
                                            LAGOS STATE GOVERNMENT
                                        </p> */}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                                        UTILITIES SERVICE PROVIDER INITIATIVE BY THE
                                    </p>
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#333333]">
                                        LAGOS STATE GOVERNMENT
                                    </p>
                                    <p className="text-xs text-[#4F4F4F] mt-1">Address: Lagos House, Marina Lagos State</p>
                                </div>
                            </div>

                            {/* Blue separator line */}
                            <div className="w-full h-0.5 bg-[#D7DAE0] mb-10"></div>

                            {/* Billing Information */}
                            <div className="flex justify-between mb-20">
                                <div>
                                    <p className="text-sm text-[#828282] mb-2">BILLED TO</p>
                                    <p className="text-lg font-semibold text-[#333333]">{receiptData.recipientName}</p>
                                    <p className="text-sm text-[#828282] mt-1">Payer ID: {receiptData.paymentId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#4988D3] mb-2">BILL REF: {receiptData.transactionRef}</p>
                                    <p className="text-lg font-bold text-[#4988D3]"></p>
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-[#828282]">Issued on</p>
                                            <p className="text-sm">{new Date(receiptData.transactionDate).toLocaleDateString('en-GB', { 
                                            day: '2-digit', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#828282]">Payment Due</p>
                                            <p className="text-sm">{new Date(new Date(receiptData.transactionDate).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { 
                                            day: '2-digit', 
                                            month: 'long', 
                                            year: 'numeric' 
                                        })}</p>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <div className="mb-6 bg-[#FAFAFA] px-3 pb-10">
                                <div className="grid grid-cols-12 gap-1 text-sm py-3">
                                    <div className='col-span-1'>S/N</div>
                                    <div className='col-span-8'>DESCRIPTION</div>
                                    <div className='col-span-3 text-end'>AMOUNT</div>
                                </div>
                                <div className='border-b border-[#D7DAE0] h-0.5 mx-auto'></div>
                                {receiptData.paymentItems?.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-1 py-2 text-sm">
                                        <div className='col-span-1'>{index + 1}</div>
                                        <div className='col-span-8'>{item.description}</div>
                                        <div className="font-semibold col-span-3 text-end text-base">
                                            {receiptData.currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Total row if more than 1 item */}
                                {receiptData.paymentItems && receiptData.paymentItems.length > 1 && (
                                    <div className="grid grid-cols-12 gap-1 py-2 text-sm border-t border-[#D7DAE0] mt-2">
                                        <div className='col-span-1'></div>
                                        <div className='col-span-8 font-bold'>TOTAL</div>
                                        <div className="font-bold col-span-3 text-end text-base">
                                            {receiptData.currencySymbol}{receiptData.paymentItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thank you message */}
                            <div className="flex justify-between items-center mb-20">
                                <p className="text-sm font-semibold text-[#333333]">Thank you!</p>
                            </div>

                            {/* Footer */}
                            <div className='border-b border-[#D7DAE0] w- h-0.5 mx-auto'></div>
                            <div className="text-center text-xs text-[#828282] mt-5">
                                <p>USP Initiative</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillsReceipt;