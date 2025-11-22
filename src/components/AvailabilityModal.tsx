import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface AvailabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type DaySchedule = {
    active: boolean;
    start: string;
    end: string;
};

type WeeklySchedule = {
    [key: string]: DaySchedule;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_SCHEDULE: WeeklySchedule = DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { active: true, start: '09:00', end: '17:00' }
}), {});

export default function AvailabilityModal({ isOpen, onClose }: AvailabilityModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE);

    useEffect(() => {
        const loadData = async () => {
            if (user && isOpen) {
                const docRef = doc(db, 'notaries', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().availability) {
                    setSchedule({ ...DEFAULT_SCHEDULE, ...docSnap.data().availability });
                }
            }
        };
        loadData();
    }, [user, isOpen]);

    const handleDayToggle = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day].active }
        }));
    };

    const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'notaries', user.uid);
            await updateDoc(docRef, { availability: schedule });
            onClose();
        } catch (error) {
            console.error("Error updating availability:", error);
            alert("Failed to update availability");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-surface w-full max-w-2xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif text-text">Manage Availability</h2>
                    </div>

                    <p className="text-text-secondary mb-8">Set your weekly working hours. Clients will see these times on your profile.</p>

                    <div className="space-y-4">
                        {DAYS.map(day => (
                            <div key={day} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                        <input
                                            type="checkbox"
                                            id={`toggle-${day}`}
                                            className="peer absolute w-12 h-6 opacity-0 z-10 cursor-pointer"
                                            checked={schedule[day]?.active}
                                            onChange={() => handleDayToggle(day)}
                                        />
                                        <label htmlFor={`toggle-${day}`} className={`block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer transition-colors peer-checked:bg-primary`}></label>
                                        <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6`}></span>
                                    </div>
                                    <span className="font-medium text-text w-24">{day}</span>
                                </div>

                                <div className={`flex items-center gap-2 transition-opacity ${schedule[day]?.active ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    <input
                                        type="time"
                                        value={schedule[day]?.start}
                                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text text-sm focus:border-primary outline-none"
                                    />
                                    <span className="text-text-secondary">-</span>
                                    <input
                                        type="time"
                                        value={schedule[day]?.end}
                                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-background text-text text-sm focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-text-secondary hover:text-text font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary hover:bg-primary-hover text-white px-8 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
