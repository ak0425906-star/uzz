"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MemoryCard({ memory, onDelete, onView, index }) {
    const categoryColors = {
        milestone: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
        date: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
        travel: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
        everyday: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
        special: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    };

    const categoryLabels = {
        milestone: "🏆 Milestone",
        date: "💕 Date",
        travel: "✈️ Travel",
        everyday: "☀️ Everyday",
        special: "⭐ Special",
    };

    const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group relative rounded-[2.5rem] glass-morphism p-5 border-white/5 transition-all duration-700 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-black/10"
        >
            {/* Pulsing Outer Glow (Invisible until hover) */}
            <motion.div 
                className="absolute inset-0 rounded-[2.5rem] bg-white opacity-0 blur-2xl -z-10 group-hover:opacity-[0.03] transition-opacity duration-1000" 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* High-End Image Container */}
            <div className="relative mb-6 rounded-[2rem] overflow-hidden aspect-square bg-[#050505] border border-white/5">
                <Image
                    src={memory.imageUrl || "https://images.unsplash.com/photo-1436891620584-47fd0e565afb?q=80&w=800&auto=format&fit=crop"}
                    alt={memory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />

                {/* Minimalist Badge */}
                <div className="absolute inset-x-4 top-4 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full glass bg-black/40 text-[9px] font-black uppercase tracking-[0.3em] text-white/50 border border-white/5">
                        {categoryLabels[memory.category] || "☀️ Everyday"}
                    </span>
                    {memory.audioUrl && (
                        <div className="px-3 py-1 rounded-full glass bg-purple-500/20 text-[8px] font-black uppercase tracking-[0.2em] text-purple-300 border border-purple-500/30 flex items-center gap-1.5 animate-pulse">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
                            </span>
                            ECHO
                        </div>
                    )}
                    <div className="w-8 h-8 rounded-full glass bg-black/40 flex items-center justify-center text-sm border border-white/5">
                        {memory.mood}
                    </div>
                </div>
            </div>

            {/* Content Overhaul */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_white]" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                        {new Date(memory.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                </div>

                <h3 className="text-xl font-black text-white px-1 tracking-tight group-hover:text-glow transition-all">
                    {memory.title}
                </h3>

                {memory.description && (
                    <p className="text-[11px] text-white/25 leading-relaxed line-clamp-2 px-1 font-medium tracking-wide">
                        {memory.description}
                    </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(memory);
                        }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all ml-1 group/btn"
                    >
                        EXPLORE <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
                    </button>

                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(memory._id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
