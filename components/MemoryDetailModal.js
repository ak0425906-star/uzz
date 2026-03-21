"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function MemoryDetailModal({ memory, onClose }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    if (!memory) return null;

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
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 bg-[#060614]/90 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl glass-morphism border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col lg:flex-row"
            >
                {/* Visual Section - Multi-Image Gallery */}
                <div className="w-full lg:w-3/5 h-[450px] lg:h-auto relative overflow-hidden group flex flex-col bg-black">
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0, x: 20, scale: 1.05 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                src={(memory.images && memory.images.length > 0) ? memory.images[activeImageIndex] : memory.imageUrl || "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=1200&auto=format&fit=crop"}
                                alt={memory.title}
                                className="w-full h-full object-cover lg:object-contain"
                            />
                        </AnimatePresence>
                        
                        {/* Navigation Arrows */}
                        {memory.images && memory.images.length > 1 && (
                            <>
                                <button 
                                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? memory.images.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={() => setActiveImageIndex(prev => (prev === memory.images.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}

                        {/* Photo Counter */}
                        {memory.images && memory.images.length > 0 && (
                            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 z-30">
                                <p className="text-[10px] font-black text-white/80 tracking-widest">
                                    {activeImageIndex + 1} / {memory.images.length}
                                </p>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#060614] via-transparent to-transparent lg:hidden" />
                    </div>

                    {/* Image Selector Thumbnails */}
                    {memory.images && memory.images.length > 1 && (
                        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2.5 px-12 z-20 overflow-x-auto no-scrollbar pb-2">
                            {memory.images.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 shadow-2xl ${
                                        activeImageIndex === idx ? "border-purple-500 scale-110 shadow-purple-500/20" : "border-white/5 opacity-40 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 p-12 hidden lg:block bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.6em] font-black mb-2 italic">Celestial Archive</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">{memory.title}</h3>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-10 lg:p-16 flex flex-col overflow-y-auto custom-scrollbar bg-[#060614]/50">
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-2">
                            <span className="px-5 py-2 rounded-full glass bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                {categoryLabels[memory.category] || "☀️ Everyday"}
                            </span>
                            <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black mt-4">
                                {formattedDate.toUpperCase()}
                            </p>
                        </div>
                        <div className="w-16 h-16 rounded-3xl glass bg-white/5 flex items-center justify-center text-4xl shadow-inner">
                            {memory.mood}
                        </div>
                    </div>

                    <div className="lg:hidden mb-10">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                            {memory.title}
                        </h2>
                    </div>

                    <div className="flex-1">
                        <p className="text-xl lg:text-2xl text-white/80 leading-relaxed font-medium italic opacity-90 mb-12 border-l-2 border-purple-500/30 pl-8">
                            "{memory.description || "The silence of the cosmos holds this moment's secret."}"
                        </p>

                        {memory.audioUrl && (
                            <div className="p-8 rounded-[3rem] glass-morphism border-white/10 bg-gradient-to-br from-purple-500/5 to-transparent mb-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-white flex items-center justify-center shadow-xl shadow-white/5">
                                        <span className="text-2xl">🎙️</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Audio Frequency</p>
                                        <p className="text-sm font-bold text-white">REPLAY SONIC MOMENT</p>
                                    </div>
                                </div>
                                <audio
                                    controls
                                    src={memory.audioUrl}
                                    className="w-full h-10 brightness-90 saturate-50 contrast-125 opacity-40 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl shadow-white/5"
                        >
                            RETURN
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">
                                STATIC FOREVER
                            </span>
                        </div>
                    </div>
                </div>

                {/* Close handle for mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full glass bg-black/40 text-white lg:hidden active:scale-90 transition-transform"
                >
                    <span className="text-xl">✕</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
