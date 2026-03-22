"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ToastProvider";

export default function AnniversaryVault() {
    const toast = useToast();
    const [anniversaries, setAnniversaries] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "",
        date: new Date().toISOString().split("T")[0],
        type: "yearly",
        description: "",
        isImportant: false
    });

    useEffect(() => {
        fetchAnniversaries();
    }, []);

    const fetchAnniversaries = async () => {
        try {
            const res = await fetch("/api/anniversaries");
            if (res.ok) {
                const data = await res.json();
                setAnniversaries(data.anniversaries || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/anniversaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                toast.love("Date recorded in the stars! ✨");
                setIsAdding(false);
                fetchAnniversaries();
                setForm({
                    title: "",
                    date: new Date().toISOString().split("T")[0],
                    type: "yearly",
                    description: "",
                    isImportant: false
                });
            }
        } catch (err) {
            toast.error("Failed to sync date");
        }
    };

    const deleteAnniversary = async (id) => {
        if (!confirm("Remove this date from history?")) return;
        try {
            const res = await fetch(`/api/anniversaries?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.notify("Date removed");
                fetchAnniversaries();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
                        Important Dates
                    </h3>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Our Shared Timeline</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                    +
                </button>
            </div>

            <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                {anniversaries.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-white/5 rounded-3xl">
                        <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold italic">No dates recorded yet</p>
                    </div>
                ) : (
                    anniversaries.map((ann) => {
                        const date = new Date(ann.date);
                        const isToday = date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate();
                        
                        return (
                            <motion.div
                                key={ann._id}
                                layout
                                className={`p-4 rounded-2xl border transition-all group ${
                                    isToday 
                                    ? "bg-purple-500/10 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]" 
                                    : "bg-white/[0.03] border-white/5 hover:border-white/10"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-white truncate">{ann.title}</h4>
                                            {isToday && <span className="text-[8px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Today ✨</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                                                {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest opacity-60">
                                                {ann.type}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteAnniversary(ann._id)}
                                        className="opacity-0 group-hover:opacity-100 text-[10px] text-red-500/40 hover:text-red-500 transition-all p-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
                        onClick={() => setIsAdding(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md glass-morphism border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase italic">
                                RECORD A <span className="text-gradient">SPECIAL</span> DATE
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        placeholder="Our First Kiss, Skydiving Trip..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={form.date}
                                            onChange={e => setForm({...form, date: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Cycle</label>
                                        <select
                                            value={form.type}
                                            onChange={e => setForm({...form, type: e.target.value})}
                                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
                                        >
                                            <option value="yearly">Yearly 🔄</option>
                                            <option value="once">Once ✨</option>
                                            <option value="monthly">Monthly 🌙</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">Description (Optional)</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        rows={3}
                                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium resize-none"
                                        placeholder="Add a sweet note..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        SAVE DATE ✨
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
