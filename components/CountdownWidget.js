"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";

export default function CountdownWidget() {
    const { data: session, update } = useSession();
    const [targetDate, setTargetDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState("");
    const [editName, setEditName] = useState("");
    const [milestoneName, setMilestoneName] = useState("Our Special Day");
    const [isCelebrated, setIsCelebrated] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const celebrationTriggered = useRef(false);

    // Initial fetch and polling for changes from partner
    useEffect(() => {
        const syncMilestone = async () => {
            try {
                const res = await fetch("/api/milestone");
                if (res.ok) {
                    const data = await res.json();
                    if (data.anniversaryDate) {
                        calculateNextOccurrence(new Date(data.anniversaryDate));
                    }
                    if (data.milestoneName) {
                        setMilestoneName(data.milestoneName);
                    }
                }
            } catch (err) {
                console.error("Failed to sync milestone:", err);
            }
        };

        syncMilestone();
        const interval = setInterval(syncMilestone, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const calculateNextOccurrence = (baseDate) => {
        const now = new Date();
        let next = new Date(now.getFullYear(), baseDate.getMonth(), baseDate.getDate());

        if (next < now) {
            next.setFullYear(now.getFullYear() + 1);
        }
        setTargetDate(next);
    };

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                if (!celebrationTriggered.current) {
                    triggerCelebration();
                    celebrationTriggered.current = true;
                }
                setTimeout(() => calculateNextOccurrence(targetDate), 5000); // Reset after 5s
                return;
            }

            // Reset celebration trigger if target date is in the future
            if (difference > 1000) {
                celebrationTriggered.current = false;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const triggerCelebration = () => {
        setIsCelebrated(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
        });
        
        // Notification toast would go here if available
        setTimeout(() => setIsCelebrated(false), 10000);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    anniversaryDate: editDate || session?.user?.anniversaryDate,
                    milestoneName: editName
                }),
            });
            if (res.ok) {
                // local update for instant feedback
                setMilestoneName(editName);
                if (editDate) calculateNextOccurrence(new Date(editDate));
                setIsEditing(false);
                
                // Optional: update session to keep it fresh
                await update({
                    anniversaryDate: editDate || session?.user?.anniversaryDate,
                    milestoneName: editName
                });
            }
        } catch (err) {
            console.error("Failed to update milestone", err);
        }
    };

    const stats = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
    ];

    return (
        <>
            <div className={`transition-all duration-700 bg-gradient-to-br ${isCelebrated ? 'from-pink-600 to-purple-600 scale-105 shadow-[0_0_50px_rgba(236,72,153,0.3)]' : 'from-indigo-900/40 to-purple-900/40 border-white/10'} border rounded-3xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />
                
                {isCelebrated && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"
                    />
                )}

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
                                {isCelebrated ? "✨ HAPPY ✨" : "COUNTDOWN TO"}
                            </h3>
                            <p className="text-white font-black text-sm uppercase tracking-widest italic text-gradient">
                                {milestoneName}
                            </p>
                        </div>
                        <span className={`text-2xl transition-all duration-500 ${isCelebrated ? 'scale-150 rotate-[360deg]' : 'group-hover:rotate-12'}`}>
                            {isCelebrated ? "🎉" : "⏳"}
                        </span>
                    </div>

                    {isCelebrated ? (
                        <div className="h-[60px] flex items-center justify-center">
                            <motion.p 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-xl font-black text-white uppercase tracking-[0.3em] italic"
                            >
                                IT&apos;S TIME! 💕
                            </motion.p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <motion.div
                                        key={stat.value}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tighter"
                                    >
                                        {String(stat.value).padStart(2, '0')}
                                    </motion.div>
                                    <div className="text-[8px] uppercase tracking-widest text-white/30 font-black mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/40 italic font-medium">
                            {isCelebrated ? "Shared with your love" : (targetDate ? "A cosmic appointment" : "Sync your stars")}
                        </span>
                        {!isCelebrated && (
                             <button
                                onClick={() => {
                                    setEditDate(timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds === 0 ? "" : (targetDate?.toISOString().split('T')[0] || ""));
                                    setEditName(milestoneName);
                                    setIsEditing(true);
                                }}
                                className="text-[10px] text-purple-400 font-bold uppercase tracking-widest hover:text-purple-300 cursor-pointer transition-colors"
                            >
                                Edit Milestone →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-[#0a0a1a] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px]" />

                            <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">SYNC <span className="text-gradient">STARS</span></h2>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-10">Define your next milestone</p>

                            <form onSubmit={handleSave} className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Milestone Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editName}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="OUR NEXT ADVENTURE"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-black text-xs tracking-widest uppercase"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black ml-2">Date of Destiny</label>
                                    <input
                                        type="date"
                                        required
                                        value={editDate}
                                        onFocus={(e) => e.target.select()}
                                        max="2100-12-31"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length > 10) return;
                                            setEditDate(val);
                                        }}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 font-black text-xs"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-5 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-5 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 hover:scale-105 transition-all"
                                    >
                                        Calibrate
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
