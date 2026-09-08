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

    const fetchData = async () => {
        const currentId = localStorage.getItem('paymentId');
        const paymentDataString = localStorage.getItem('paymentData');
        console.log('Payment ID from localStorage:', currentId);
        console.log('Payment data from localStorage:', paymentDataString);
        setLoading(true);
        
        try {
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
                    recipientName: parsedData.recipientName || "N/A",
                    transactionId: parsedData.transactionId || (currentId ? `TXN-${currentId}` : "N/A"),
                    paymentId: parsedData.paymentId || currentId || "N/A",
                    transactionRef: parsedData.transactionRef || (currentId ? `REF-${currentId}` : "N/A"),
                    phoneNumber: parsedData.phoneNumber || "N/A",
                    transactionDate: parsedData.transactionDate || new Date().toLocaleString(),
                    paymentItems: parsedData.paymentItems || (totalAmount > 0 ? [{ description: "Payment for services", amount: totalAmount }] : []),
                    currencySymbol: parsedData.currencySymbol || "₦",
                    amountInWords: parsedData.amountInWords || numberToWordsNaira(totalAmount),
                    address: parsedData.address || "N/A",
                    paymentMethod: parsedData.paymentMethod || "N/A",
                    status: parsedData.status || "N/A"
                };
            } else {
                receiptData = {
                    recipientName: "N/A",
                    transactionId: currentId ? `TXN-${currentId}` : "N/A",
                    paymentId: currentId || "N/A",
                    transactionRef: currentId ? `REF-${currentId}` : "N/A",
                    phoneNumber: "N/A",
                    transactionDate: new Date().toLocaleString(),
                    paymentItems: [],
                    currencySymbol: "₦",
                    amountInWords: "Zero Naira Only",
                    address: "N/A",
                    paymentMethod: "N/A",
                    status: "N/A"
                };
            }
            
            console.log('Setting receipt data:', receiptData);
            setReceiptData(receiptData);
        } catch (error) {
            console.log("Error fetching receipt data:", error);
            // Set default data on error
            setReceiptData({
                recipientName: "N/A",
                transactionId: currentId ? `TXN-${currentId}` : "N/A",
                paymentId: currentId || "N/A",
                transactionRef: "N/A",
                phoneNumber: "N/A",
                transactionDate: new Date().toLocaleString(),
                paymentItems: [],
                currencySymbol: "₦",
                amountInWords: "Zero Naira Only",
                address: "N/A",
                paymentMethod: "N/A",
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