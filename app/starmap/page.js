"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import Link from "next/link";
import Image from "next/image";

const MOOD_COLORS = {
    Happy: "rgba(236, 72, 153, 0.5)", // Pink
    Love: "rgba(219, 39, 119, 0.5)", // Fuchsia
    Excited: "rgba(245, 158, 11, 0.5)", // Amber
    Calm: "rgba(20, 184, 166, 0.5)", // Teal
    Peaceful: "rgba(59, 130, 246, 0.5)", // Blue
    Sad: "rgba(79, 70, 229, 0.5)", // Indigo
    Reflective: "rgba(139, 92, 246, 0.5)", // Violet
};

export default function StarMapPage() {
    const [memories, setMemories] = useState([]);
    const [selectedStar, setSelectedStar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await fetch("/api/memories");
                if (res.ok) {
                    const data = await res.json();
                    // Assign positions based on ID hash for stability
                    const mapped = (data.memories || []).map(m => {
                        const hash = m._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        return {
                            ...m,
                            x: (hash % 80) + 10,
                            y: ((hash * 13) % 80) + 10,
                            size: 10 + (hash % 10), // Even bigger for visibility
                        };
                    });
                    setMemories(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch memories for star map:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMemories();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden">
            <StarField />

            {/* Header Overlay */}
            <div className="relative z-20 pt-32 px-8 text-center pointer-events-none">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic"
                >
                    OUR <span className="text-gradient">CONSTELLATION</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black mt-4"
                >
                    Every point of light is a moment we shared
                </motion.p>
            </div>

            {/* Constellation Lines Layer */}
            <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-20">
                {memories.length > 1 && [...memories].sort((a,b) => new Date(a.date) - new Date(b.date)).map((star, i) => {
                    if (i === 0) return null;
                    const prev = memories[i-1];
                    return (
                        <motion.line
                            key={`line-${star._id}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, delay: 1 + (i * 0.2) }}
                            x1={`${prev.x}%`}
                            y1={`${prev.y}%`}
                            x2={`${star.x}%`}
                            y2={`${star.y}%`}
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    );
                })}
            </svg>

            {/* The Map */}
            <div className="absolute inset-0 z-10">
                {memories.map((star) => (
                    <motion.div
                        key={star._id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: Math.random() * 2 }}
                        style={{ 
                            left: `${star.x}%`, 
                            top: `${star.y}%`,
                        }}
                        className="absolute cursor-pointer group"
                        onClick={() => setSelectedStar(star)}
                    >
                        {/* Star Glow */}
                        <div 
                            className="absolute inset-0 blur-xl scale-[4] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            style={{ backgroundColor: MOOD_COLORS[star.mood] || "rgba(255,255,255,0.2)" }}
                        />
                        
                        {/* Star Node */}
                        <motion.div
                            animate={{ 
                                scale: [1, 1.15, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{ 
                                duration: 2 + (star.x % 3), 
                                repeat: Infinity,
                                ease: "easeInOut" 
                            }}
                            className="relative rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                            style={{ 
                                width: star.size, 
                                height: star.size,
                                backgroundColor: MOOD_COLORS[star.mood] || "white",
                                boxShadow: `0 0 20px ${MOOD_COLORS[star.mood] || "white"}`
                            }}
                        />

                        {/* Label (Mobile: tap to see, Desktop: hover) */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                {star.title}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Memory Detail Modal */}
            <AnimatePresence>
                {selectedStar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                        onClick={() => setSelectedStar(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="max-w-xl w-full glass-morphism rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div 
                                className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] opacity-20 rounded-full"
                                style={{ backgroundColor: MOOD_COLORS[selectedStar.mood] || "white" }}
                            />

                            <button 
                                onClick={() => setSelectedStar(null)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <span className="text-2xl uppercase font-black">✕</span>
                            </button>

                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                                    {new Date(selectedStar.date).toLocaleDateString("en-US", { 
                                        month: "long", day: "numeric", year: "numeric" 
                                    })}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mt-2 mb-6">
                                    {selectedStar.title}
                                </h2>
                                
                                {selectedStar.images?.[0] && (
                                    <div className="aspect-video rounded-[2rem] overflow-hidden mb-8 border border-white/10 relative">
                                        <Image
                                            src={selectedStar.images[0]} 
                                            fill
                                            className="object-cover" 
                                            alt={selectedStar.title} 
                                        />
                                    </div>
                                )}

                                <p className="text-white/60 text-lg leading-relaxed italic font-medium">
                                    &quot;{selectedStar.description}&quot;
                                </p>

                                <div className="mt-10 flex items-center gap-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                                        Mood: {selectedStar.mood}
                                    </span>
                                    <Link 
                                        href="/memories" 
                                        className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:underline"
                                    >
                                        View in Timeline →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
