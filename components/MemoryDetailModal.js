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
            className="fixed inset-0 z-[300] flex items-center justify-center p-0 lg:p-6 bg-[#060614] lg:bg-[#060614]/90 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full lg:h-auto lg:max-w-6xl glass-morphism border-white/10 rounded-0 lg:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] max-h-screen lg:max-h-[90vh] flex flex-col lg:flex-row"
            >
                {/* Visual Section - Multi-Image Gallery */}
                <div className="w-full lg:w-3/5 h-[60vh] lg:h-auto relative overflow-hidden group flex flex-col bg-black">
                    <div 
                        className="flex-1 relative overflow-hidden flex items-center justify-center cursor-pointer"
                        onClick={() => setShowUI(!showUI)}
                    >
                        {/* Stories-style Progress Bars */}
                        <AnimatePresence>
                            {showUI && images.length > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-6 inset-x-6 flex gap-1.5 z-40 transition-opacity"
                                >
                                    {images.map((_, idx) => (
                                        <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-white"
                                                initial={{ width: 0 }}
                                                animate={{ width: idx < activeImageIndex ? "100%" : idx === activeImageIndex ? "100%" : "0%" }}
                                                transition={{ duration: idx === activeImageIndex ? 0.4 : 0 }}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0, x: 50, scale: 1.1 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = offset.x;
                                    if (swipe < -50) handleNext();
                                    else if (swipe > 50) handlePrev();
                                }}
                                src={images[activeImageIndex]}
                                alt={memory.title}
                                className="w-full h-full object-cover lg:object-contain"
                            />
                        </AnimatePresence>
                        
                        {/* Desktop Navigation Arrows */}
                        <AnimatePresence>
                            {showUI && images.length > 1 && (
                                <>
                                    <motion.button 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onClick={handlePrev}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-30 hidden lg:flex"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </motion.button>
                                    <motion.button 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        onClick={handleNext}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-30 hidden lg:flex"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </motion.button>
                                </>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {showUI && (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-t from-[#060614] via-transparent to-transparent lg:hidden transition-opacity" 
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Image Selector Thumbnails */}
                    <AnimatePresence>
                        {showUI && images.length > 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-6 inset-x-0 flex justify-center gap-2 px-12 z-40 overflow-x-auto no-scrollbar pb-2 transition-all"
                            >
                                {images.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-2xl ${
                                            activeImageIndex === idx ? "border-white scale-110 shadow-white/20" : "border-white/5 opacity-40"
                                        }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Content Section */}
                <AnimatePresence>
                    {showUI && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, width: 0 }}
                            className="flex-1 p-8 lg:p-16 flex flex-col overflow-y-auto custom-scrollbar bg-[#060614]/50 relative z-10"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="space-y-4">
                                    <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                                        {categoryLabels[memory.category] || "☀️ Everyday"}
                                    </span>
                                    <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">
                                        {formattedDate.toUpperCase()}
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                                    {memory.mood}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                                    {memory.title}
                                </h2>
                            </div>

                            <div className="flex-1">
                                <p className="text-lg lg:text-xl text-white/70 leading-relaxed font-medium italic opacity-90 mb-10 border-l border-white/10 pl-6">
                                    {memory.description || "The silence of the cosmos holds this moment's secret."}
                                </p>

                                {memory.audioUrl && (
                                    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 mb-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                                <span className="text-lg">🎙️</span>
                                            </div>
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Audio Memory</p>
                                        </div>
                                        <audio controls src={memory.audioUrl} className="w-full h-8 opacity-40 hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl"
                                >
                                    CLOSE
                                </button>
                                <span className="text-[9px] text-white/10 uppercase tracking-[0.5em] font-black">
                                    UZZ 🌕
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
