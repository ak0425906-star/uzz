"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import Link from "next/link";
import Image from "next/image";

const MOOD_PLANETS = {
    Happy: "radial-gradient(circle at 30% 30%, #fde047, #ca8a04)", // Sun-like / Golden
    Love: "radial-gradient(circle at 30% 30%, #f472b6, #be185d)", // Pink / Deep Rose
    Excited: "radial-gradient(circle at 30% 30%, #fb923c, #c2410c)", // Orange / Fire
    Calm: "radial-gradient(circle at 30% 30%, #2dd4bf, #0f766e)", // Teal / Ocean
    Peaceful: "radial-gradient(circle at 30% 30%, #60a5fa, #1d4ed8)", // Blue / Earth-like
    Sad: "radial-gradient(circle at 30% 30%, #818cf8, #4338ca)", // Indigo / Deep Space
    Reflective: "radial-gradient(circle at 30% 30%, #a78bfa, #6d28d9)", // Violet / Nebula
};

export default function SolarSystemMap() {
    const [memories, setMemories] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await fetch("/api/memories");
                if (res.ok) {
                    const data = await res.json();
                    
                    // Assign Orbits & Speeds based on chronologically
                    const sorted = (data.memories || []).sort((a,b) => new Date(a.date) - new Date(b.date));
                    const mapped = sorted.map((m, index) => {
                        const hash = m._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        // Tiered orbits: start small, get farther out
                        const orbitDistance = 150 + (index * 60) + (hash % 40); 
                        const speed = 15 + (index * 5) + (hash % 10); // Seconds for full orbit
                        return {
                            ...m,
                            orbitDistance,
                            speed,
                            startAngle: (hash % 360),
                            size: 16 + (hash % 12),
                            isMoon: (hash % 4 === 0 && index > 3) // Every 4th is a moon? Maybe not, keep it simple first
                        };
                    });
                    setMemories(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch memories for solar system:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMemories();
    }, []);

    if (loading) return null;

    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center">
            <StarField />

            {/* Header Overlay */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic"
                >
                    OUR <span className="text-gradient">SOLAR</span> SYSTEM
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black mt-2"
                >
                    Every moment a world, orbiting our core
                </motion.p>
            </div>

            {/* The Sun - Central Core */}
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-200 via-orange-500 to-red-600 shadow-[0_0_150px_rgba(234,179,8,0.5)] flex items-center justify-center pointer-events-none"
            >
                <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-400/20 blur-3xl" />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest text-center px-4 leading-tight">
                    The <br /> Core
                </span>
            </motion.div>

            {/* Asteroid Belt (Decoration) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-[500px] h-[500px] border-[40px] border-dotted border-white/10 rounded-full animate-[spin_100s_linear_infinite]" />
            </div>

            {/* Orbits & Planet/Memories */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                {memories.map((mem) => (
                    <div 
                        key={mem._id}
                        className="absolute border border-white/5 rounded-full z-0"
                        style={{ 
                            width: mem.orbitDistance * 2, 
                            height: mem.orbitDistance * 2 
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: mem.speed, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 pointer-events-none"
                            style={{ rotate: mem.startAngle }}
                        >
                            <motion.div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMemory(mem);
                                }}
                                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 cursor-pointer pointer-events-auto group"
                                whileHover={{ scale: 1.2 }}
                            >
                                {/* Planet Atmosphere/Glow */}
                                <div 
                                    className="absolute inset-0 blur-2xl scale-[2.5] opacity-20 group-hover:opacity-60 transition-opacity duration-700 rounded-full"
                                    style={{ background: MOOD_PLANETS[mem.mood] || "white" }}
                                />
                                
                                {/* Planet Body */}
                                <div 
                                    className="relative rounded-full shadow-2xl border border-white/10 overflow-hidden"
                                    style={{ 
                                        width: mem.size, 
                                        height: mem.size,
                                        background: MOOD_PLANETS[mem.mood] || "white"
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/20" style={{ clipPath: "circle(50% at 70% 70%)" }} />
                                </div>

                                {/* Decorative Moons for some planets */}
                                {mem.isMoon && (
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0"
                                    >
                                        <div 
                                            className="absolute -top-4 left-1/2 w-2 h-2 rounded-full bg-slate-400 shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                                        />
                                    </motion.div>
                                )}

                                {/* Label */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block z-[40]">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        {mem.title}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* Memory Detail Modal */}
            <AnimatePresence>
                {selectedMemory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
                        onClick={() => setSelectedMemory(null)}
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
                                style={{ background: MOOD_PLANETS[selectedMemory.mood] || "white" }}
                            />

                            <button 
                                onClick={() => setSelectedMemory(null)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <span className="text-2xl uppercase font-black">✕</span>
                            </button>

                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                                    {new Date(selectedMemory.date).toLocaleDateString("en-US", { 
                                        month: "long", day: "numeric", year: "numeric" 
                                    })}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic mt-2 mb-6">
                                    {selectedMemory.title}
                                </h2>
                                
                                {selectedMemory.images?.[0] && (
                                    <div className="aspect-video rounded-[2rem] overflow-hidden mb-8 border border-white/10 relative">
                                        <Image
                                            src={selectedMemory.images[0]} 
                                            fill
                                            className="object-cover" 
                                            alt={selectedMemory.title} 
                                        />
                                    </div>
                                )}

                                <p className="text-white/60 text-lg leading-relaxed italic font-medium">
                                    &quot;{selectedMemory.description}&quot;
                                </p>

                                <div className="mt-10 flex items-center gap-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                                        Mood: {selectedMemory.mood}
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

            {/* Interaction Hint */}
            <div className="fixed bottom-12 left-12 z-20 hidden md:block">
                <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black">
                    Drag the system or tap a planet to recall
                </p>
            </div>
            
            <style jsx>{`
                .text-gradient {
                    background: linear-gradient(to right, #fbbf24, #f59e0b, #ea580c);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}
