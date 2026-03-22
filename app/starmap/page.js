"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import Link from "next/link";
import Image from "next/image";

const MOOD_STARS = {
    Happy:      { core: "#fde047", glow: "#eab308", shadow: "rgba(234,179,8,0.6)" },
    Love:       { core: "#f472b6", glow: "#ec4899", shadow: "rgba(236,72,153,0.6)" },
    Excited:    { core: "#fb923c", glow: "#f97316", shadow: "rgba(249,115,22,0.6)" },
    Calm:       { core: "#2dd4bf", glow: "#14b8a6", shadow: "rgba(20,184,166,0.6)" },
    Peaceful:   { core: "#60a5fa", glow: "#3b82f6", shadow: "rgba(59,130,246,0.6)" },
    Sad:        { core: "#818cf8", glow: "#6366f1", shadow: "rgba(99,102,241,0.6)" },
    Reflective: { core: "#a78bfa", glow: "#8b5cf6", shadow: "rgba(139,92,246,0.6)" },
};

const DEFAULT_STAR = { core: "#e2e8f0", glow: "#94a3b8", shadow: "rgba(148,163,184,0.6)" };

export default function LunarMemoryMap() {
    const [memories, setMemories] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await fetch("/api/memories");
                if (res.ok) {
                    const data = await res.json();
                    const sorted = (data.memories || []).sort((a, b) => new Date(a.date) - new Date(b.date));
                    const mapped = sorted.map((m, index) => {
                        const hash = m._id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const orbitDistance = 160 + index * 55 + (hash % 35);
                        const speed = 18 + index * 4 + (hash % 8);
                        const points = 4 + (hash % 5); // 4-8 ray points → unique shapes
                        return {
                            ...m,
                            orbitDistance,
                            speed,
                            startAngle: hash % 360,
                            size: 14 + (hash % 10),
                            points,
                        };
                    });
                    setMemories(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch memories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMemories();
    }, []);

    if (loading) return null;

    return (
        <div className="relative min-h-screen bg-[#030308] overflow-hidden flex items-center justify-center">
            <StarField />

            {/* Header */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic"
                >
                    OUR <span className="moon-gradient">CONSTELLATION</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black mt-2"
                >
                    Every star a memory, orbiting our moon
                </motion.p>
            </div>

            {/* ═══ THE MOON ═══ */}
            <div className="relative z-10 w-36 h-36 md:w-56 md:h-56 flex-shrink-0 pointer-events-none">
                {/* Outermost Halo */}
                <div className="absolute inset-[-120px] rounded-full bg-[radial-gradient(circle,_rgba(200,210,230,0.12)_0%,_transparent_70%)]" />

                {/* Ethereal Glow Ring */}
                <motion.div
                    animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[-40px] rounded-full border border-white/5 bg-slate-300/5 blur-2xl"
                />

                {/* Moon Body */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_60px_rgba(200,210,230,0.35),0_0_120px_rgba(200,210,230,0.15)]">
                    {/* Base Surface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8e8e8] via-[#c8ccd0] to-[#9ea3a8]" />

                    {/* Crater Texture */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute w-[18%] h-[18%] top-[20%] left-[25%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.15)_60%,_transparent_100%)]" />
                        <div className="absolute w-[12%] h-[12%] top-[55%] left-[60%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.12)_60%,_transparent_100%)]" />
                        <div className="absolute w-[25%] h-[25%] top-[35%] left-[40%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.1)_60%,_transparent_100%)]" />
                        <div className="absolute w-[10%] h-[10%] top-[70%] left-[30%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.14)_60%,_transparent_100%)]" />
                        <div className="absolute w-[8%] h-[8%] top-[15%] left-[65%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.12)_60%,_transparent_100%)]" />
                        <div className="absolute w-[15%] h-[15%] top-[60%] left-[15%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.08)_60%,_transparent_100%)]" />
                    </div>

                    {/* Mare (Dark Seas) */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute w-[40%] h-[35%] top-[15%] left-[20%] rounded-[60%] bg-[#8a8d90] blur-[8px]" />
                        <div className="absolute w-[30%] h-[20%] top-[50%] left-[45%] rounded-[50%] bg-[#8a8d90] blur-[6px]" />
                    </div>

                    {/* Light Refraction (Terminator Edge) */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/25 rounded-full" />

                    {/* Specular Highlight */}
                    <div className="absolute top-[10%] left-[15%] w-[35%] h-[35%] rounded-full bg-white/20 blur-[15px]" />
                </div>
            </div>

            {/* ═══ ORBIT RINGS & GLOWING STARS ═══ */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                {memories.map((mem) => {
                    const palette = MOOD_STARS[mem.mood] || DEFAULT_STAR;
                    return (
                        <div
                            key={mem._id}
                            className="absolute border border-white/[0.03] rounded-full"
                            style={{
                                width: mem.orbitDistance * 2,
                                height: mem.orbitDistance * 2,
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
                                    whileHover={{ scale: 1.3 }}
                                >
                                    {/* Star Outer Glow */}
                                    <div
                                        className="absolute inset-0 blur-2xl scale-[3] opacity-30 group-hover:opacity-70 transition-opacity duration-500 rounded-full"
                                        style={{ backgroundColor: palette.glow }}
                                    />

                                    {/* Star Rays (CSS) */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8 + mem.points, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-6px] opacity-40 group-hover:opacity-80 transition-opacity"
                                        style={{
                                            background: `conic-gradient(${Array.from({ length: mem.points * 2 }, (_, i) =>
                                                i % 2 === 0 ? `${palette.glow} ${(i / (mem.points * 2)) * 100}%` : `transparent ${(i / (mem.points * 2)) * 100}%`
                                            ).join(", ")})`,
                                            clipPath: "circle(50%)",
                                            filter: "blur(2px)",
                                        }}
                                    />

                                    {/* Star Core */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.15, 1],
                                            opacity: [0.85, 1, 0.85],
                                        }}
                                        transition={{
                                            duration: 2 + (mem.points % 3),
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="relative rounded-full"
                                        style={{
                                            width: mem.size,
                                            height: mem.size,
                                            backgroundColor: palette.core,
                                            boxShadow: `0 0 ${mem.size}px ${palette.shadow}, 0 0 ${mem.size * 2}px ${palette.shadow}, inset 0 0 ${mem.size / 3}px rgba(255,255,255,0.5)`,
                                        }}
                                    />

                                    {/* Label */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block z-[40]">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            {mem.title}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    );
                })}
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
                                className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] opacity-25 rounded-full"
                                style={{ backgroundColor: (MOOD_STARS[selectedMemory.mood] || DEFAULT_STAR).glow }}
                            />

                            <button
                                onClick={() => setSelectedMemory(null)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <span className="text-2xl font-black">✕</span>
                            </button>

                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                                    {new Date(selectedMemory.date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
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
                                    <span
                                        className="px-4 py-1.5 rounded-full border text-[10px] font-black text-white uppercase tracking-widest"
                                        style={{
                                            borderColor: (MOOD_STARS[selectedMemory.mood] || DEFAULT_STAR).glow,
                                            backgroundColor: `${(MOOD_STARS[selectedMemory.mood] || DEFAULT_STAR).shadow}`,
                                        }}
                                    >
                                        {selectedMemory.mood}
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

            {/* Hint */}
            <div className="fixed bottom-12 left-12 z-20 hidden md:block">
                <p className="text-[9px] text-white/15 uppercase tracking-[0.3em] font-black">
                    Tap a star to revisit a memory
                </p>
            </div>

            <style jsx>{`
                .moon-gradient {
                    background: linear-gradient(to right, #c8ccd0, #e8e8e8, #9ea3a8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
}

