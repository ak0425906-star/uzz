"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["future", "love", "lust", "marriage", "kids", "career", "plans"];

export default function StellarSpinner() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [currentCategory, setCurrentCategory] = useState("");

    const spin = async () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSelectedTopic(null);
        setCurrentCategory("");
        
        const extraSpins = 5 + Math.floor(Math.random() * 5);
        const randomDegree = Math.random() * 360;
        const newRotation = rotation + (extraSpins * 360) + randomDegree;
        
        setRotation(newRotation);

        // Fetch new topic while spinning
        try {
            const res = await fetch("/api/spinner");
            const data = await res.json();
            
            setTimeout(async () => {
                setSelectedTopic(data.topic);
                setCurrentCategory(data.topic?.id?.split("-")[0] || "");
                setIsSpinning(false);

                // Mark as visited in background
                if (data.topic?.id) {
                    await fetch("/api/spinner", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ topicId: data.topic.id })
                    });
                }
            }, 3000);
        } catch (err) {
            console.error(err);
            setIsSpinning(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden min-h-[500px]">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5" />
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                    <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">
                        Infinite Bond Generator
                    </h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse" />
                </motion.div>
                
                <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                    {/* Outer Glow Ring */}
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    {/* The Wheel */}
                    <motion.div
                        animate={{ rotate: rotation }}
                        transition={{ duration: 3, ease: [0.15, 0, 0, 1] }}
                        className="w-full h-full rounded-full border-[12px] border-white/5 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0a0a1a]"
                    >
                        {/* Conic Gradient Slices */}
                        <div 
                            className="absolute inset-0 opacity-40 mix-blend-screen"
                            style={{ 
                                background: "conic-gradient(from 0deg, #06b6d4 0deg 51.4deg, #3b82f6 51.4deg 102.8deg, #8b5cf6 102.8deg 154.2deg, #ec4899 154.2deg 205.6deg, #f43f5e 205.6deg 257deg, #f59e0b 257deg 308.4deg, #10b981 308.4deg 360deg)" 
                            }}
                        />

                        {/* Category Labels */}
                        {CATEGORIES.map((cat, i) => (
                            <div 
                                key={cat}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom h-1/2 flex flex-col items-center pt-4"
                                style={{ transform: `translate(-50%, -100%) rotate(${(i * 360) / CATEGORIES.length + (360 / (CATEGORIES.length * 2))}deg)` }}
                            >
                                <span className="text-[7px] md:text-[8px] font-black text-white uppercase tracking-[0.2em] opacity-80 vertical-text">
                                    {cat}
                                </span>
                            </div>
                        ))}

                        {/* Center Hub */}
                        <div className="absolute inset-0 flex items-center justify-center p-12 md:p-16">
                            <div className="w-full h-full rounded-full bg-[#060614] border border-white/10 shadow-inner flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_white] z-10" />
                                {isSpinning && (
                                    <motion.div 
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 bg-cyan-500/20 blur-xl"
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Pointer - Top */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
                        <div className="w-6 h-8 bg-white clip-path-triangle shadow-[0_0_15px_rgba(255,255,255,0.8)] filter drop-shadow-lg" />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={spin}
                    disabled={isSpinning}
                    className="mt-12 group relative px-10 py-4 rounded-full overflow-hidden transition-all disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-white" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 text-[10px] font-black text-black group-hover:text-white uppercase tracking-[0.3em] transition-colors">
                        {isSpinning ? "CONSULTING CONSTELLATIONS..." : "IGNITE CONNECTION"}
                    </span>
                </motion.button>

                <AnimatePresence mode="wait">
                    {selectedTopic && (
                        <motion.div
                            key={selectedTopic.id}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-12 w-full max-w-md p-8 rounded-[2.5rem] glass-morphism border-white/10 text-center relative group overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full" />
                            
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4 block">
                                    THE STARS HAVE SPOKEN
                                </span>
                                <p className="text-lg md:text-xl font-bold text-white leading-tight mb-2 tracking-tight">
                                    &ldquo;{selectedTopic.text}&rdquo;
                                </p>
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-4 font-bold border-t border-white/5 pt-4">
                                    Deep Dive: {CATEGORIES.find(c => selectedTopic.id.startsWith(c.slice(0,3))) || "Shared Future"}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .clip-path-triangle {
                    clip-path: polygon(50% 100%, 0 0, 100% 0);
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
}
