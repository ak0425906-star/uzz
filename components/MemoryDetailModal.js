"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MemoryDetailModal({ memory, onClose }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showUI, setShowUI] = useState(true);

    if (!memory) return null;

    const images = memory.images && memory.images.length > 0 
        ? memory.images 
        : [memory.imageUrl || "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1200&auto=format&fit=crop"];

    const handleNext = (e) => {
        e?.stopPropagation();
        setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e) => {
        e?.stopPropagation();
        setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const categoryLabels = {
        milestone: "🏆 Milestone",
        date: "💕 Date",
        travel: "✈️ Travel",
        everyday: "☀️ Everyday",
        special: "⭐ Special",
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-0 lg:p-10 bg-[#050505] lg:bg-[#050505]/95 backdrop-blur-3xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full lg:h-[85vh] lg:max-w-7xl glass-morphism border-white/10 rounded-0 lg:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row bg-[#050505]"
            >
                {/* Visual Section */}
                <div className="w-full lg:w-[65%] h-[55vh] lg:h-auto relative overflow-hidden group bg-black">
                    <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => setShowUI(!showUI)}
                    >
                        {/* Premium Progress Indicators */}
                        <AnimatePresence>
                            {showUI && images.length > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-8 inset-x-8 flex gap-2 z-40"
                                >
                                    {images.map((_, idx) => (
                                        <div key={idx} className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-white shadow-[0_0_8px_white]"
                                                initial={{ width: 0 }}
                                                animate={{ width: idx < activeImageIndex ? "100%" : idx === activeImageIndex ? "100%" : "0%" }}
                                                transition={{ duration: idx === activeImageIndex ? 0.3 : 0 }}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0, filter: "blur(10px) brightness(0.5)", scale: 1.05 }}
                                animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
                                exit={{ opacity: 0, filter: "blur(10px) brightness(0.5)", scale: 0.95 }}
                                transition={{ duration: 0.6 }}
                                src={images[activeImageIndex]}
                                className="w-full h-full object-cover lg:object-contain relative z-10"
                            />
                        </AnimatePresence>
                        
                        {/* Subtle Background Glow behind active image */}
                        <div className="absolute inset-x-20 inset-y-40 bg-white/5 blur-[120px] rounded-full" />
                    </div>

                    {/* Navigation Controls */}
                    <AnimatePresence>
                        {showUI && images.length > 1 && (
                            <div className="hidden lg:block">
                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handlePrev} className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white z-50 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </motion.button>
                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={handleNext} className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white z-50 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </motion.button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col bg-[#080808] border-l border-white/5">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 p-10 lg:p-14 flex flex-col overflow-y-auto no-scrollbar"
                    >
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                        {categoryLabels[memory.category] || "MOMENT"}
                                    </span>
                                </div>
                                <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">
                                    {formattedDate.toUpperCase()}
                                </p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl glass-morphism border-white/10 flex items-center justify-center text-4xl shadow-2xl">
                                {memory.mood}
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-none text-glow">
                                {memory.title}
                            </h2>
                        </div>

                        <div className="flex-1 py-4 space-y-8">
                            <p className="text-xl lg:text-2xl text-white/60 leading-relaxed font-medium italic opacity-90 border-l-2 border-white/10 pl-8 py-2">
                                {memory.description || "In the vastness of time, this moment remains."}
                            </p>

                            {memory.audioUrl && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/40 relative">
                                            <span className="text-2xl">⚡</span>
                                            <div className="absolute inset-0 rounded-full border border-purple-500/50 animate-ping opacity-20" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-3">COSMIC ECHO PLAYING</p>
                                            <audio 
                                                src={memory.audioUrl} 
                                                controls 
                                                className="w-full h-10 custom-audio-player opacity-80 hover:opacity-100 transition-opacity" 
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                            <button
                                onClick={onClose}
                                className="px-12 py-4 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                DISMISS
                            </button>
                            <span className="text-[10px] text-white/10 uppercase tracking-[0.8em] font-black">
                                UZZ 🌕 SYSTEM
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Navigation (Images) */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 lg:hidden px-10 pointer-events-none">
                        {images.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeImageIndex === idx ? "bg-white w-4" : "bg-white/20"}`} />
                        ))}
                    </div>
                )}
                {/* Close handle for mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 text-white lg:hidden z-[100] backdrop-blur-xl border border-white/10"
                >
                    <span className="text-xl">✕</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
