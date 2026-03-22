"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import StarField from "@/components/StarField";

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="relative min-h-screen bg-[#060614] overflow-hidden">
            <StarField />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
                
                {/* Full Moon Centerpiece */}
                <div className="relative mb-12">
                {/* Breathing Halo */}
                    <motion.div
                        animate={{ 
                            scale: [1, 1.15, 1],
                            opacity: [0.15, 0.35, 0.15],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-[-60px] rounded-full bg-[radial-gradient(circle,_rgba(200,210,230,0.15)_0%,_transparent_70%)]"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-[0_0_60px_rgba(200,210,230,0.35),0_0_120px_rgba(200,210,230,0.15)]"
                    >
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
                    </motion.div>

                    {/* Orbiting Elements (Very slow) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 120, 240].map((angle, i) => (
                            <motion.div
                                key={i}
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-100px] flex items-center justify-center"
                            >
                                <motion.div 
                                    style={{ rotate: -(angle + (i * 360)) }} 
                                    className="w-12 h-12 glass-morphism rounded-xl border-white/10 flex items-center justify-center text-xl shadow-2xl"
                                >
                                    {["📸", "💬", "💖"][i]}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                    className="relative text-center space-y-12"
                >
                    <div className="space-y-6">
                        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            UZZ <span className="text-gradient">🌕</span>
                        </h1>
                        <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.8em] font-black max-w-2xl mx-auto leading-loose text-glow">
                            Your memories, written in the stars. <br className="hidden sm:block" /> immortalizing love across celestial dimensions.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
                    >
                        {session ? (
                            <Link href="/dashboard">
                                <motion.div
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-16 py-6 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] transition-all"
                                >
                                    ENTER DASHBOARD
                                </motion.div>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/register">
                                    <motion.div
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-16 py-6 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] transition-all"
                                    >
                                        INITIALIZE ORBIT
                                    </motion.div>
                                </Link>
                                <Link href="/auth/login">
                                    <motion.div
                                        whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.05)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-16 py-6 rounded-full glass-morphism border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] transition-all"
                                    >
                                        RECONNECT
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Features Overhaul */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1.2 }}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl w-full mt-40"
                >
                    {[
                        {
                            num: "CHRONOS",
                            title: "CONSTELLATION TIMELINE",
                            desc: "A rhythmic journey through your shared existence, mapped like stars in the void.",
                            icon: "✨"
                        },
                        {
                            num: "ECHOES",
                            title: "VOICE OF THE COSMOS",
                            desc: "Captured sound waves and sealed thoughts drifting through the starlight.",
                            icon: "🎙️"
                        },
                        {
                            num: "NEBULA",
                            title: "DORMANT DREAMS",
                            desc: "Mapping the future you'll build together among the galaxies.",
                            icon: "🌌"
                        },
                    ].map((feature, i) => (
                        <div key={i} className="p-12 rounded-[4rem] glass-morphism border-white/5 relative group hover:border-white/20 hover:bg-white/[0.02] transition-all duration-1000 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-500/10 transition-colors" />
                            
                            <span className="text-[9px] font-black text-white/20 block mb-10 group-hover:text-purple-400 transition-colors tracking-[0.5em]">
                                PROTOCOL // {feature.num}
                            </span>
                            
                            <div className="text-4xl mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-xl font-black text-white mb-6 tracking-[0.1em] uppercase italic leading-none">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-white/30 leading-relaxed font-medium tracking-wider">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Minimalist Footnote */}
                <div className="relative mt-32 mb-12 flex flex-col items-center gap-6 opacity-20 hover:opacity-100 transition-opacity duration-1000">
                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
                    <p className="text-[9px] text-white uppercase tracking-[1em] font-black">
                        UZZ 🌕 BEYOND TIME
                    </p>
                </div>
            </div>
        </div>
    );
}
