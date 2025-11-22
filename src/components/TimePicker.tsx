import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function TimePicker({ value, onChange, disabled }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState('09');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            const [time, periodPart] = value.split(' ');
            const [h, m] = time.split(':');
            setHour(h);
            setMinute(m);
            setPeriod(periodPart || 'AM');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleConfirm = () => {
        onChange(`${hour}:${minute} ${period}`);
        setIsOpen(false);
    };

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text text-sm focus:border-primary outline-none flex items-center gap-2 min-w-[120px] justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span>{value || '09:00 AM'}</span>
                <Clock className="w-4 h-4 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 bg-white dark:bg-surface border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex gap-2 mb-4">
                        {/* Hour Picker */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-text-secondary mb-2 text-center">Hour</label>
                            <div className="h-32 w-16 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {hours.map(h => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => setHour(h)}
                                        className={`w-full py-2 text-sm transition-colors ${hour === h
                                                ? 'bg-primary text-white font-bold'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-text'
                                            }`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Minute Picker */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-text-secondary mb-2 text-center">Min</label>
                            <div className="h-32 w-16 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {minutes.map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMinute(m)}
                                        className={`w-full py-2 text-sm transition-colors ${minute === m
                                                ? 'bg-primary text-white font-bold'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-text'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* AM/PM Picker */}
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-text-secondary mb-2 text-center">Period</label>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPeriod('AM')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'AM'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-text hover:bg-slate-200'
                                        }`}
                                >
                                    AM
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPeriod('PM')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === 'PM'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-text hover:bg-slate-200'
                                        }`}
                                >
                                    PM
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            )}
        </div>
    );
}
