"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MOOD_COLORS = {
    Happy: "from-pink-500 via-rose-400 to-amber-400",
    Love: "from-pink-600 via-fuchsia-500 to-rose-500",
    Excited: "from-orange-500 via-amber-400 to-yellow-300",
    Calm: "from-teal-500 via-emerald-400 to-cyan-400",
    Peaceful: "from-blue-500 via-indigo-400 to-purple-400",
    Sad: "from-indigo-600 via-slate-500 to-blue-900",
    Reflective: "from-violet-600 via-purple-500 to-slate-800",
    Blessed: "from-amber-300 via-yellow-200 to-white",
};

export default function NebulaMood() {
    const [mood, setMood] = useState("Peaceful");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMood = async () => {
            try {
                const res = await fetch("/api/memories");
                if (res.ok) {
                    const data = await res.json();
                    const memories = data.memories || [];
                    if (memories.length > 0) {
                        // Get the most recent mood
                        setMood(memories[0].mood || "Peaceful");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch mood for nebula:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMood();
    }, []);

    const gradientClass = MOOD_COLORS[mood] || MOOD_COLORS["Peaceful"];

    return (
        <div className="flex flex-col h-full justify-between relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">
                    NEBULA MOOD
                </h3>
                <p className="text-[10px] text-white/20 uppercase font-bold leading-relaxed">
                    The emotional frequency of our shared space.
                </p>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
                {/* Animated Nebula Core */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 180, 270, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={`w-32 h-32 rounded-full bg-gradient-to-tr ${gradientClass} blur-[40px] opacity-40`}
                />
                
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`absolute w-24 h-24 rounded-full bg-gradient-to-bl ${gradientClass} blur-[30px] opacity-60`}
                />

                <div className="absolute text-center z-20">
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em] mb-1">CURRENT VIBE</p>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
                        {loading ? "Syncing..." : mood}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
}
