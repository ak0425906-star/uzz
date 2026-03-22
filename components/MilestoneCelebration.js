"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MilestoneCelebration({ rankTitle, rankIcon }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (rankTitle) {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [rankTitle]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none overflow-hidden"
                >
                    {/* Supernova Background Flash */}
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 4], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute w-screen h-screen bg-white rounded-full blur-[100px]"
                    />

                    {/* Content */}
                    <motion.div 
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="relative z-10 text-center px-6 py-12 rounded-[4rem] glass-morphism border-white/20 bg-black/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(255,255,255,0.1)]"
                    >
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: 3 }}
                            className="text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        >
                            {rankIcon}
                        </motion.div>
                        <h2 className="text-[12px] font-black text-white/50 uppercase tracking-[0.8em] mb-4">NEW RANK ASCENDED</h2>
                        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">
                            {rankTitle}
                        </h1>
                        <p className="mt-8 text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold italic">The universe witnesses your love.</p>
                    </motion.div>

                    {/* Stardust Particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{ 
                                x: (Math.random() - 0.5) * 1000, 
                                y: (Math.random() - 0.5) * 1000, 
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{ duration: 2, delay: Math.random() * 0.5 }}
                            className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
