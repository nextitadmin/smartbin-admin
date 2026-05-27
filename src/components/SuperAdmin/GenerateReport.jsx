import React, { useState, useEffect } from 'react';

// --- SVG Icon Components (Raw Hero Icons) ---

const XMarkIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const CalendarDaysIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.54 0c-.342.052-.682.107-1.022.166m1.022-.165L5.8 19.673a2.25 2.25 0 0 0 2.244 2.077H15.92a2.25 2.25 0 0 0 2.244-2.077L19.228 5.79m-14.456 0a48.108 48.108 0 0 1 3.478-.397m12.54 0a48.108 48.108 0 0 1-3.478-.397m0 0a48.108 48.108 0 0 1-3.478-.397m0 0a48.108 48.108 0 0 0-3.478-.397M9.75 4.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875v-.75Z" />
    </svg>
);

const CheckCircleIcon = ({ className = "w-[93px] h-[93px]" }) => (
    <img
      src="/images/successimage.png"
      alt="Success"
      className={`${className} object-contain`}
    />
);  

const XCircleIcon = ({ className = "w-12 h-12" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

// Custom animated spinner
const LoadingSpinner = () => (
    <svg className="animate-spin h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Helper Components ---

// Custom Select Component
const CustomSelect = ({ children, ...props }) => (
    <div className="relative w-full">
        <select
            className="appearance-none w-full bg-white border border-zinc-300 text-zinc-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-green-500"
            {...props}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
        </div>
    </div>
);

// Custom Input Component
const CustomInput = ({ icon, ...props }) => (
    <div className="relative w-full">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
        <input
            className={`w-full bg-white border border-zinc-300 text-zinc-700 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-green-500 ${icon ? 'pl-10' : ''}`}
            {...props}
        />
    </div>
);

// Custom Radio Component
const CustomRadio = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="hidden"
        />
        <span className={`w-5 h-5 flex items-center justify-center rounded-full border border-zinc-400 ${checked ? 'bg-green-600 border-green-600' : 'bg-white'}`}>
            {checked && <span className="w-2 h-2 rounded-full bg-white"></span>}
        </span>
        <span className="text-zinc-700">{label}</span>
    </label>
);

// --- Main Modal Component ---

const GenerateReportModal = ({ isOpen, onClose }) => {
    // 'form', 'processing', 'success', 'error'
    const [modalState, setModalState] = useState('form');
    const [reportMethod, setReportMethod] = useState('manual'); // 'manual' or 'auto'
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [primaryEmail, setPrimaryEmail] = useState('jidemomodu@gmail.com');
    const [secondaryEmails, setSecondaryEmails] = useState([]);
    const [reportSchedule, setReportSchedule] = useState('quarterly');
    const [day, setDay] = useState('thursday');
    const [time, setTime] = useState('09:00');

    const [processingStartTime, setProcessingStartTime] = useState(null);

    // Resets the form and closes the modal
    const handleClose = () => {
        setModalState('form');
        setReportMethod('manual');
        setReportType('');
        // ... reset other fields if needed
        onClose();
    };

    // Resets the form to its initial state
    const resetToForm = () => {
        setModalState('form');
        // Don't reset form fields, user might want to correct something
    };

    // --- Dynamic Email Field Handlers ---
    const addSecondaryEmail = () => {
        setSecondaryEmails([...secondaryEmails, { id: Date.now(), value: '' }]);
    };

    const removeSecondaryEmail = (id) => {
        setSecondaryEmails(secondaryEmails.filter(email => email.id !== id));
    };

    const updateSecondaryEmail = (id, value) => {
        setSecondaryEmails(
            secondaryEmails.map(email =>
                email.id === id ? { ...email, value } : email
            )
        );
    };

    // --- Form Submission Handler ---
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally validate fields

        // Start processing
        setModalState('processing');
        setProcessingStartTime(Date.now());
    };

    // --- Effect to manage the 5-second minimum processing & simulation ---
    useEffect(() => {
        if (modalState === 'processing' && processingStartTime) {
            const minDisplayTime = 5000; // 5 seconds

            // Simulate API call duration (e.g., 1s to 3s)
            const apiCallDuration = Math.random() * 2000 + 1000;

            const apiCallTimer = setTimeout(() => {
                // 50/50 chance of success or error
                const isSuccess = Math.random() > 0.5;
                const nextState = isSuccess ? 'success' : 'error';

                const timeElapsed = Date.now() - processingStartTime;
                const remainingTime = minDisplayTime - timeElapsed;

                if (remainingTime > 0) {
                    // If 5s hasn't passed, wait for the remaining time
                    setTimeout(() => {
                        setModalState(nextState);
                    }, remainingTime);
                } else {
                    // If 5s has already passed, update state immediately
                    setModalState(nextState);
                }

            }, apiCallDuration);

            return () => clearTimeout(apiCallTimer);
        }
    }, [modalState, processingStartTime]);


    // --- Render Functions for Each Modal State ---

    const renderForm = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-zinc-900">Generate Report</h2>
                <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-800">
                    <XMarkIcon className="w-7 h-7" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                {/* Report Type */}
                <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-1">Report type</label>
                    <CustomSelect value={reportType} onChange={(e) => setReportType(e.target.value)} required>
                        <option value="" disabled>Select report type</option>
                        <option value="revenue">Revenue report</option>
                        <option value="user_registration">User Registration</option>
                        <option value="bin_request">Bin Request Lifecycle</option>
                        <option value="waste_pickup">Waste Pickup</option>
                        <option value="unpaid_bills">Unpaid Bills</option>
                    </CustomSelect>
                </div>

                {/* Report Method */}
                <div>
                    <label className="block text-sm font-medium text-zinc-600 mb-2">Report method</label>
                    <div className="flex space-x-6">
                        <CustomRadio
                            label="Manual Reporting"
                            name="reportMethod"
                            value="manual"
                            checked={reportMethod === 'manual'}
                            onChange={() => setReportMethod('manual')}
                        />
                        <CustomRadio
                            label="Auto Reporting"
                            name="reportMethod"
                            value="auto"
                            checked={reportMethod === 'auto'}
                            onChange={() => setReportMethod('auto')}
                        />
                    </div>
                </div>

                {/* --- Conditional Fields --- */}

                {reportMethod === 'manual' && (
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-zinc-600 mb-1">Start Date</label>
                            <CustomInput
                                type="date"
                                icon={<CalendarDaysIcon className="text-zinc-500" />}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-zinc-600 mb-1">End Date</label>
                            <CustomInput
                                type="date"
                                icon={<CalendarDaysIcon className="text-zinc-500" />}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

                {reportMethod === 'auto' && (
                    <div className="flex flex-col space-y-5">
                        {/* Primary Email */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-1">Primary email</label>
                            <CustomInput
                                type="email"
                                value={primaryEmail}
                                onChange={(e) => setPrimaryEmail(e.target.value)}
                                placeholder="Enter primary email"
                                required
                            />
                        </div>

                        {/* Secondary Emails */}
                        {secondaryEmails.map((email, index) => (
                            <div key={email.id} className="flex items-center space-x-2">
                                <CustomInput
                                    type="email"
                                    value={email.value}
                                    onChange={(e) => updateSecondaryEmail(email.id, e.target.value)}
                                    placeholder={`Secondary email ${index + 1}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSecondaryEmail(email.id)}
                                    className="p-2 text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSecondaryEmail}
                            className="flex items-center space-x-1 text-sm font-medium text-green-600 hover:text-green-800 self-start"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add secondary emails</span>
                        </button>

                        {/* Report Schedule */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-1">Report schedule</label>
                            <CustomSelect value={reportSchedule} onChange={(e) => setReportSchedule(e.target.value)} required>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </CustomSelect>
                        </div>

                        {/* Date & Time */}
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">Date</label>
                                <CustomSelect value={day} onChange={(e) => setDay(e.target.value)} required>
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                </CustomSelect>
                            </div>
                            <div className="w-full">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">Time</label>
                                <CustomInput
                                    type="time"
                                    icon={<ClockIcon className="text-zinc-500" />}
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Helper Text */}
                        <p className="text-xs text-blue-600">
                            Report will be sent first Thursday of the month after quarter ends by 9:00AM
                        </p>

                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    Generate report
                </button>
            </form>
        </>
    );

    const renderProcessing = () => (
        <div className="flex flex-col items-center justify-center text-center py-8">
            <LoadingSpinner />
            <h2 className="text-2xl font-semibold text-zinc-900 mt-6 mb-2">Report is processing</h2>
            <p className="text-zinc-600 max-w-xs mb-8">
                Your request is processing. We will let you know the moment it is ready.
            </p>
            <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
                Back to reports
            </button>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center text-center py-8">
            <CheckCircleIcon className="w-16 h-16 text-green-600" />
            <h2 className="text-2xl font-semibold text-zinc-900 mt-6 mb-2">Report Generated</h2>
            <p className="text-zinc-600 max-w-xs mb-8">
                Your report has been successfully generated and sent.
            </p>
            <button
                onClick={handleClose}
                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
                Done
            </button>
        </div>
    );

    const renderError = () => (
        <div className="flex flex-col items-center justify-center text-center py-8">
            <XCircleIcon className="w-16 h-16 text-red-600" />
            <h2 className="text-2xl font-semibold text-zinc-900 mt-6 mb-2">Error Generating Report</h2>
            <p className="text-zinc-600 max-w-xs mb-8">
                Something went wrong while generating your report. Please try again.
            </p>
            <button
                onClick={resetToForm}
                className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
                Try Again
            </button>
        </div>
    );

    // Helper to render the correct modal content
    const renderModalContent = () => {
        switch (modalState) {
            case 'form':
                return renderForm();
            case 'processing':
                return renderProcessing();
            case 'success':
                return renderSuccess();
            case 'error':
                return renderError();
            default:
                return renderForm();
        }
    };

    if (!isOpen) return null;

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-zinc-900/50 flex items-center justify-center p-4 z-50">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                {renderModalContent()}
            </div>
        </div>
    );
};

export default GenerateReportModal;



