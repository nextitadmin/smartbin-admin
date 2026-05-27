import React, { useState, useEffect } from 'react';
import { CloseIcon, ChevronLeftIcon, ChevronDownIcon, CheckIcon } from '../icons';

/**
 * FinishDeliveryModal Component
 * A responsive modal for capturing delivery completion details.
 */
export const FinishDeliveryModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverType: '',
        isAttested: false,
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const receiverOptions = ['Owner', 'Relative', 'Acquaintance'];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.receiverName || !formData.receiverType || !formData.isAttested) {
            return;
        }

        // Log data as requested
        console.log('Finalizing Delivery with Data:', formData);

        // Execute callback and close
        onSubmit(formData);
        onClose();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsDropdownOpen(false);
        if (isDropdownOpen) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between px-6 pt-8 pb-4">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeftIcon className="w-7 h-7" strokeWidth={2.5} />
                    </button>

                    <h2 className="text-[28px] font-bold text-[#1A1A1A] tracking-tight">
                        Finish delivery
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <CloseIcon className="w-7 h-7" strokeWidth={2.5} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-10 mt-4 space-y-8">

                    {/* Receiver Name Input */}
                    <div className="space-y-3">
                        <label className="block text-lg font-bold text-[#1A1A1A]">
                            Receiver name
                        </label>
                        <input
                            type="text"
                            placeholder="Who received the package?"
                            required
                            className="w-full px-5 py-4 text-lg border-[1.5px] border-gray-200 rounded-2xl focus:border-green-700 focus:ring-0 transition-all placeholder:text-gray-300 outline-none"
                            value={formData.receiverName}
                            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                        />
                    </div>

                    {/* Receiver Type Dropdown */}
                    <div className="space-y-3 relative">
                        <label className="block text-lg font-bold text-[#1A1A1A]">
                            Receiver type
                        </label>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                            className={`flex w-full items-center justify-between px-5 py-4 text-lg border-[1.5px] rounded-2xl transition-all outline-none ${isDropdownOpen ? 'border-green-700 ring-1 ring-green-700' : 'border-gray-200'
                                }`}
                        >
                            <span className={formData.receiverType ? 'text-gray-900' : 'text-gray-300'}>
                                {formData.receiverType || "Receiver type"}
                            </span>
                            <ChevronDownIcon
                                className={`text-gray-800 w-6 h-6 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden py-2 animate-in slide-in-from-top-2 duration-150">
                                {receiverOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className="w-full flex items-center justify-between px-6 py-4 text-left text-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => setFormData({ ...formData, receiverType: option })}
                                    >
                                        {option}
                                        {formData.receiverType === option && <CheckIcon className="w-5 h-5 text-green-700" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Attestation Checkbox */}
                    <div className="flex items-center gap-4 py-2">
                        <div className="relative flex items-center">
                            <input
                                id="attest"
                                type="checkbox"
                                required
                                className="peer h-7 w-7 appearance-none rounded-lg border-2 border-gray-300 checked:bg-green-700 checked:border-green-700 transition-all cursor-pointer"
                                checked={formData.isAttested}
                                onChange={(e) => setFormData({ ...formData, isAttested: e.target.checked })}
                            />
                            <CheckIcon
                                className="absolute left-1.5 w-[18px] h-[18px] text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                strokeWidth={4}
                            />
                        </div>
                        <label htmlFor="attest" className="text-lg font-medium text-gray-700 cursor-pointer select-none">
                            I attest that the delivery has been made
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!formData.receiverName || !formData.receiverType || !formData.isAttested}
                        className="w-full py-5 bg-[#00703C] hover:bg-[#005a30] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-green-900/10 mt-4"
                    >
                        Finish delivery
                    </button>
                </form>
            </div>
        </div>
    );
};

// Demo Wrapper for display purposes
export default function App() {
    const [showModal, setShowModal] = useState(true);

    const handleComplete = (data) => {
        // This is where you'd typically send data to an API
        console.log("Success! Data received in parent component:", data);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-green-700 text-white font-bold rounded-xl shadow-lg hover:bg-green-800 transition-all"
            >
                Open Finish Delivery Modal
            </button>

            <FinishDeliveryModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleComplete}
            />
        </div>
    );
}