import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/PSPs/Sidebar';
import Topbar from '../components/PSPs/Topbar';
import { create } from 'zustand';

// --- HEROICONS SVGs ---
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-500 hover:text-red-600 transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


// --- MOCK API ---
// Simulates fetching initial schedule data
const fetchSchedule = () => {
    console.log("Fetching schedule...");
    return new Promise(resolve => {
        setTimeout(() => {
            const mockData = [
                { id: 1, day: 'Monday', startTime: '07:00', endTime: '09:00' },
                { id: 2, day: 'Thursday', startTime: '07:00', endTime: '09:00' },
                { id: 3, day: 'Friday', startTime: '07:00', endTime: '09:00' },
            ];
            console.log("Fetched data:", mockData);
            resolve(mockData);
        }, 1000);
    });
};

// Simulates saving the schedule data
const saveSchedule = (schedule) => {
    console.log("Saving schedule...", schedule);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Schedule saved successfully!");
            resolve({ success: true, data: schedule });
        }, 1000);
    });
};


// --- ZUSTAND STORE for state management ---
const useScheduleStore = create((set) => ({
    schedule: [],
    isLoading: true,
    isSaving: false,
    setSchedule: (schedule) => set({ schedule, isLoading: false }),
    addDay: () => set(state => {
        const newId = Math.max(0, ...state.schedule.map(s => s.id)) + 1;
        return {
            schedule: [...state.schedule, { id: newId, day: 'Monday', startTime: '09:00', endTime: '17:00' }]
        };
    }),
    updateDay: (id, field, value) => set(state => {
        const newSchedule = state.schedule.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        // Validate time
        if (field === 'startTime' || field === 'endTime') {
            const updatedItem = newSchedule.find(item => item.id === id);
            if (updatedItem) {
                const start = parseInt(updatedItem.startTime.replace(':', ''), 10);
                const end = parseInt(updatedItem.endTime.replace(':', ''), 10);
                if (end <= start) {
                    // Simple validation: if end is before or same as start, adjust end time by 1 hour
                    const [h, m] = updatedItem.startTime.split(':');
                    let newEndHour = parseInt(h, 10) + 1;
                    if (newEndHour > 23) newEndHour = 23; // cap at 23:00
                    const newEndTime = `${String(newEndHour).padStart(2, '0')}:${m}`;
                    return { schedule: state.schedule.map(item => item.id === id ? { ...item, [field]: value, endTime: newEndTime } : item) };
                }
            }
        }
        return { schedule: newSchedule };
    }),
    removeDay: (id) => set(state => ({
        schedule: state.schedule.filter(item => item.id !== id)
    })),
    setSaving: (isSaving) => set({ isSaving }),
}));


// --- CONSTANTS ---
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// --- HELPER FUNCTIONS ---
const formatTime12Hour = (time24) => {
    if (!time24) return { hour: '00', minute: '00', period: 'AM' };
    const [h, m] = time24.split(':');
    let hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert hour to 12-hour format
    return {
        hour: String(hour).padStart(2, '0'),
        minute: m,
        period: period,
    };
};

const to24Hour = (hour, minute, period) => {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h !== 12) {
        h += 12;
    }
    if (period === 'AM' && h === 12) {
        h = 0;
    }
    return `${String(h).padStart(2, '0')}:${minute}`;
};


// --- UI COMPONENTS ---

const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className="relative w-full" ref={ref}>
            <button
                type="button"
                className="w-full bg-white border border-zinc-300 rounded-md py-2 px-3 text-left flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? "text-zinc-800" : "text-zinc-500"}>
                    {value || placeholder}
                </span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-zinc-200 rounded-md shadow-lg">
                    <ul className="max-h-60 overflow-auto">
                        {options.map((option) => (
                            <li
                                key={option}
                                className="px-3 py-2 hover:bg-zinc-100 cursor-pointer text-zinc-800"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const TimeInput = ({ label, time24, onChange }) => {
    const { hour, minute, period } = formatTime12Hour(time24);

    const handleHourChange = (e) => {
        let newHour = e.target.value.replace(/[^0-9]/g, '');
        if (parseInt(newHour, 10) > 12) newHour = '12';
        if (parseInt(newHour, 10) < 1) newHour = '1';
        onChange(to24Hour(newHour || '0', minute, period));
    };

    const handleMinuteChange = (e) => {
        let newMinute = e.target.value.replace(/[^0-9]/g, '');
        if (parseInt(newMinute, 10) > 59) newMinute = '59';
        onChange(to24Hour(hour, newMinute.padStart(2, '0') || '00', period));
    };

    const togglePeriod = (newPeriod) => {
        if (period !== newPeriod) {
            onChange(to24Hour(hour, minute, newPeriod));
        }
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm text-zinc-600 mb-1">{label}</label>
            <div className="flex items-center space-x-1">
                <input
                    type="text"
                    maxLength="2"
                    value={hour}
                    onChange={handleHourChange}
                    className="w-12 text-center bg-white border border-zinc-300 rounded-md p-2"
                />
                <span className="font-bold text-zinc-500">:</span>
                <input
                    type="text"
                    maxLength="2"
                    value={minute}
                    onChange={handleMinuteChange}
                    className="w-12 text-center bg-white border border-zinc-300 rounded-md p-2"
                />
                <div className="flex flex-col space-y-1 ml-1">
                    <button
                        type="button"
                        onClick={() => togglePeriod('AM')}
                        className={`px-2 py-0.5 text-xs rounded transition-colors ${period === 'AM' ? 'bg-green-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        onClick={() => togglePeriod('PM')}
                        className={`px-2 py-0.5 text-xs rounded transition-colors ${period === 'PM' ? 'bg-green-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}
                    >
                        PM
                    </button>
                </div>
            </div>
        </div>
    );
};


const ScheduleRow = ({ item, onUpdate, onRemove }) => {
    const handleTimeChange = (field, newTime) => {
        let otherTime;
        let newStartTime = item.startTime;
        let newEndTime = item.endTime;

        if (field === 'startTime') {
            newStartTime = newTime;
            otherTime = item.endTime;
        } else {
            newEndTime = newTime;
            otherTime = item.startTime;
        }

        const startMinutes = parseInt(newStartTime.split(':')[0]) * 60 + parseInt(newStartTime.split(':')[1]);
        const endMinutes = parseInt(newEndTime.split(':')[0]) * 60 + parseInt(newEndTime.split(':')[1]);

        if (endMinutes - startMinutes < 60) {
            const [h, m] = newStartTime.split(':');
            const newEndHour = (parseInt(h) + 1) % 24;
            newEndTime = `${String(newEndHour).padStart(2, '0')}:${m}`;
        }

        onUpdate(item.id, 'startTime', newStartTime);
        onUpdate(item.id, 'endTime', newEndTime);
    };


    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0 p-4 border border-zinc-200 rounded-lg bg-white">
            <div className="flex-1">
                <label className="text-sm text-zinc-600 mb-1 block">Select days</label>
                <CustomSelect
                    value={item.day}
                    onChange={(day) => onUpdate(item.id, 'day', day)}
                    options={DAYS_OF_WEEK}
                    placeholder="Select a day"
                />
            </div>
            <TimeInput label="Start" time24={item.startTime} onChange={(time) => handleTimeChange('startTime', time)} />
            <div className="hidden sm:flex items-center self-end pb-4">
                <ArrowRightIcon />
            </div>
            <TimeInput label="End" time24={item.endTime} onChange={(time) => handleTimeChange('endTime', time)} />
            <div className="flex items-center justify-end sm:self-end sm:pb-2">
                <button type="button" onClick={() => onRemove(item.id)} title="Remove schedule">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function ServiceConfiguration() {
    const { schedule, isLoading, isSaving, setSchedule, addDay, updateDay, removeDay, setSaving } = useScheduleStore();

    useEffect(() => {
        fetchSchedule().then(data => {
            setSchedule(data);
        });
    }, [setSchedule]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveSchedule(schedule);
            // Optionally show a success message
        } catch (error) {
            console.error("Failed to save schedule", error);
            // Optionally show an error message
        } finally {
            setSaving(false);
        }
    };

    // Sort schedule by day of the week
    const sortedSchedule = [...schedule].sort((a, b) => {
        return DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
    });

    return (
        <div className="flex sans h-screen">
            <Sidebar addkey="1" />
            <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                <Topbar />
                <div className="bg-zinc-100 font-sans">
                    <main className="p-4 md:px-4">
                        <div className="p-4 md:p-8 font-sans">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-zinc-800">Service Configuration</h1>
                                <p className="text-zinc-600 mt-1">Set the days and time you will be active</p>
                            </header>

                            <main className="space-y-4">
                                {isLoading ? (
                                    <p className="text-zinc-500">Loading schedule...</p>
                                ) : (
                                    sortedSchedule.map(item => (
                                        <ScheduleRow key={item.id} item={item} onUpdate={updateDay} onRemove={removeDay} />
                                    ))
                                )}

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={addDay}
                                        className="flex items-center space-x-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
                                    >
                                        <PlusIcon />
                                        <span>Add new</span>
                                    </button>
                                </div>
                            </main>

                            <footer className="mt-8">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading}
                                    className="bg-green-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-800 disabled:bg-zinc-400 transition-colors w-full sm:w-auto"
                                >
                                    {isSaving ? 'Saving...' : 'Save changes'}
                                </button>
                            </footer>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}