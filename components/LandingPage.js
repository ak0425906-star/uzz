"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

const FEATURES = [
    {
        tag: "CHRONOS",
        title: "Memory\nConstellation",
        desc: "Every shared moment mapped as a glowing star in your private cosmos. Tap to relive.",
        accent: "rgba(168, 85, 247, 0.15)",
    },
    {
        tag: "ECHOES",
        title: "Cosmic\nMessages",
        desc: "Sealed thoughts and voice waves drifting through the dark, waiting to be found.",
        accent: "rgba(59, 130, 246, 0.15)",
    },
    {
        tag: "NEBULA",
        title: "Future\nBlueprints",
        desc: "Map the dreams you'll build together — plans, dates, and promises among galaxies.",
        accent: "rgba(236, 72, 153, 0.15)",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    }),
};

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="relative min-h-screen bg-[#030308] overflow-hidden">
            <StarField />

            {/* ═══ HERO ═══ */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">

                {/* ── The Moon ── */}
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-16"
                >
                    {/* God-Rays behind the moon */}
                    <div className="absolute inset-[-120%] pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 origin-center"
                                    style={{
                                        width: "2px",
                                        height: "200%",
                                        transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                                        background: `linear-gradient(to bottom, transparent, rgba(200,210,230,0.04) 30%, rgba(200,210,230,0.02) 50%, transparent)`,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Outer Halo */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-[-80px] rounded-full bg-[radial-gradient(circle,_rgba(200,210,230,0.12)_0%,_transparent_65%)]"
                    />

                    {/* Moon Body */}
                    <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden shadow-[0_0_80px_rgba(200,210,230,0.3),0_0_160px_rgba(200,210,230,0.1)]">
                        {/* Base Surface */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#eaeaea] via-[#ccced2] to-[#9ea3a8]" />

                        {/* Detailed Crater System */}
                        <div className="absolute inset-0 opacity-35">
                            <div className="absolute w-[20%] h-[20%] top-[18%] left-[22%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.18)_50%,_transparent_100%)]" />
                            <div className="absolute w-[14%] h-[14%] top-[52%] left-[58%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.14)_50%,_transparent_100%)]" />
                            <div className="absolute w-[28%] h-[28%] top-[32%] left-[38%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.1)_50%,_transparent_100%)]" />
                            <div className="absolute w-[11%] h-[11%] top-[68%] left-[28%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.16)_50%,_transparent_100%)]" />
                            <div className="absolute w-[9%] h-[9%] top-[12%] left-[62%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.12)_50%,_transparent_100%)]" />
                            <div className="absolute w-[16%] h-[16%] top-[58%] left-[12%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.09)_50%,_transparent_100%)]" />
                            <div className="absolute w-[7%] h-[7%] top-[40%] left-[72%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.12)_50%,_transparent_100%)]" />
                            <div className="absolute w-[6%] h-[6%] top-[78%] left-[52%] rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.1)_50%,_transparent_100%)]" />
                        </div>

                        {/* Mare (Dark Seas) */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute w-[42%] h-[38%] top-[12%] left-[18%] rounded-[60%] bg-[#7d8185] blur-[10px]" />
                            <div className="absolute w-[32%] h-[22%] top-[48%] left-[42%] rounded-[55%] bg-[#7d8185] blur-[8px]" />
                            <div className="absolute w-[18%] h-[15%] top-[65%] left-[15%] rounded-[50%] bg-[#7d8185] blur-[6px]" />
                        </div>

                        {/* Terminator Edge */}
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/30 rounded-full" />

                        {/* Specular Highlight */}
                        <div className="absolute top-[8%] left-[12%] w-[38%] h-[38%] rounded-full bg-white/25 blur-[18px]" />

                        {/* Rim Light */}
                        <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
                    </div>

                    {/* Particle Orbits (replace emojis) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[
                            { size: 110, speed: 35, dotSize: 4, color: "rgba(168,85,247,0.6)" },
                            { size: 130, speed: 50, dotSize: 3, color: "rgba(59,130,246,0.5)" },
                            { size: 95, speed: 42, dotSize: 3.5, color: "rgba(236,72,153,0.5)" },
                        ].map((orbit, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: orbit.speed, repeat: Infinity, ease: "linear" }}
                                className="absolute flex items-center justify-center"
                                style={{
                                    inset: `-${orbit.size}px`,
                                }}
                            >
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                                    style={{
                                        width: orbit.dotSize,
                                        height: orbit.dotSize,
                                        backgroundColor: orbit.color,
                                        boxShadow: `0 0 12px ${orbit.color}, 0 0 24px ${orbit.color}`,
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Title Block ── */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="relative text-center space-y-14"
                >
                    <div className="space-y-5">
                        <motion.h1
                            variants={fadeUp}
                            custom={0}
                            className="text-7xl sm:text-8xl md:text-[11rem] font-black text-white leading-[0.85] tracking-[-0.04em] uppercase italic"
                            style={{ textShadow: "0 0 60px rgba(200,210,230,0.08)" }}
                        >
                            UZZ
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            custom={1}
                            className="text-[10px] md:text-xs text-white/35 uppercase tracking-[0.6em] font-medium max-w-lg mx-auto leading-loose"
                        >
                            Your memories, written in the stars.
                            <br className="hidden sm:block" />
                            <span className="text-white/20">Immortalizing love across celestial dimensions.</span>
                        </motion.p>
                    </div>

                    {/* ── CTAs ── */}
                    <motion.div
                        variants={fadeUp}
                        custom={2}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
                    >
                        {session ? (
                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(200,210,230,0.12)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="btn-cosmic px-14 py-5 rounded-full bg-white text-[#030308] text-[11px] font-bold uppercase tracking-[0.3em]"
                                >
                                    Enter Dashboard
                                </motion.div>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/register">
                                    <motion.div
                                        whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(200,210,230,0.12)" }}
                                        whileTap={{ scale: 0.97 }}
                                        className="btn-cosmic px-14 py-5 rounded-full bg-white text-[#030308] text-[11px] font-bold uppercase tracking-[0.3em]"
                                    >
                                        Begin Your Orbit
                                    </motion.div>
                                </Link>
                                <Link href="/auth/login">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="btn-cosmic px-14 py-5 rounded-full glass-morphism text-white/70 text-[11px] font-bold uppercase tracking-[0.3em] hover:text-white"
                                    >
                                        Reconnect
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* ── Feature Cards ── */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full mt-40 px-2"
                >
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            custom={i}
                            className="glass-card p-10 md:p-12 rounded-[2.5rem] relative group overflow-hidden"
                        >
                            {/* Ambient Glow */}
                            <div
                                className="absolute top-0 right-0 w-40 h-40 blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                                style={{ background: feature.accent }}
                            />

                            {/* Decorative Star */}
                            <div
                                className="w-2 h-2 rounded-full mb-8 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:shadow-[0_0_12px_currentColor]"
                                style={{ backgroundColor: feature.accent.replace("0.15", "0.8") }}
                            />

                            <span className="text-[9px] font-semibold text-white/15 block mb-6 group-hover:text-white/30 transition-colors tracking-[0.5em] uppercase">
                                {feature.tag}
                            </span>

                            <h3 className="text-xl md:text-2xl font-bold text-white/90 mb-5 tracking-tight leading-tight whitespace-pre-line">
                                {feature.title}
                            </h3>

                            <p className="text-[13px] text-white/25 leading-relaxed font-normal group-hover:text-white/40 transition-colors">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Footer Pulse ── */}
                <div className="relative mt-36 mb-12 flex flex-col items-center gap-6 opacity-15 hover:opacity-60 transition-opacity duration-1000">
                    <motion.div
                        animate={{ scaleY: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"
                    />
                    <p className="text-[8px] text-white uppercase tracking-[1.2em] font-medium">
                        UZZ · Beyond Time
                    </p>
                </div>
            </div>
        </div>
    );
}
