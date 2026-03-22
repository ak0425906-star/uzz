"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOPICS = {
    future: [
        "Where in the world will we be 10 years from today?",
        "What's one dream you're afraid to say out loud?",
        "If we retired tomorrow, what would our typical Tuesday look like?",
        "What legacy do you want us to leave behind together?"
    ],
    love: [
        "What's one thing I do that makes you feel truly seen?",
        "When did you first realize our connection was more than just a crush?",
        "What's your favorite way to be comforted by me?",
        "How has your definition of love changed since we met?"
    ],
    lust: [
        "If we had 24 hours in a secret city, what's one bold thing we'd try?",
        "What's a fantasy you've been shy about sharing?",
        "What's the most attractive thing about my personality?",
        "Where is the wildest place you've ever thought about us being together?"
    ],
    marriage: [
        "What's one tradition from your family you want us to carry on?",
        "What does a 'successful' long-term partnership look like to you?",
        "What's your biggest fear about 'forever' and how can we face it?",
        "If we had a wedding, what's the one non-negotiable detail for you?"
    ],
    kids: [
        "If we had a child, which of your traits would you most want them to inherit?",
        "What kind of parent do you think I would be?",
        "How would you want to balance 'us' time and 'family' time?",
        "What’s one lesson you definitely want to teach a next generation?"
    ],
    career: [
        "How can I better support your professional dreams this year?",
        "If you could start any business today, what would it be?",
        "Would you ever move across the world for your dream job if I was with you?",
        "What’s one work achievement you're proud of that I haven't celebrated enough?"
    ],
    plans: [
        "What is the very first thing we are doing the next time we see each other?",
        "What’s a trip we haven't talked about yet that we should take?",
        "If we had $10,000 to spend on one weekend, what's the plan?",
        "What's one thing we can start doing weekly to feel closer?"
    ]
};

const CATEGORIES = Object.keys(TOPICS);

export default function StellarSpinner() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [rotation, setRotation] = useState(0);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSelectedTopic(null);
        
        const newRotation = rotation + 1800 + Math.random() * 360; // At least 5 full spins
        setRotation(newRotation);

        setTimeout(() => {
            const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            const question = TOPICS[category][Math.floor(Math.random() * TOPICS[category].length)];
            setSelectedTopic({ category, question });
            setIsSpinning(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden h-full">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-10">Stellar Spinner</h3>
            
            <div className="relative w-48 h-48 md:w-64 md:h-64">
                {/* The Wheel */}
                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 3, ease: [0.45, 0.05, 0.55, 0.95] }}
                    className="w-full h-full rounded-full border-4 border-white/10 relative overflow-hidden shadow-2xl"
                    style={{ 
                        background: "conic-gradient(from 0deg, #6366f1 0deg 51deg, #a855f7 51deg 102deg, #ec4899 102deg 153deg, #f43f5e 153deg 204deg, #f59e0b 204deg 255deg, #10b981 255deg 306deg, #06b6d4 306deg 360deg)" 
                    }}
                >
                    {CATEGORIES.map((cat, i) => (
                        <div 
                            key={cat}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom h-1/2 flex flex-col items-center pt-2"
                            style={{ transform: `translate(-50%, -100%) rotate(${(i * 360) / CATEGORIES.length}deg)` }}
                        >
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter mix-blend-overlay">
                                {cat}
                            </span>
                        </div>
                    ))}
                    <div className="absolute inset-4 rounded-full bg-[#060614]/80 backdrop-blur-sm border border-white/5 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                    </div>
                </motion.div>

                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-white clip-path-triangle z-20 shadow-xl" />
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="mt-10 px-8 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
                {isSpinning ? "Consulting Stars..." : "IGNITE TOPIC"}
            </button>

            <AnimatePresence>
                {selectedTopic && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/10 text-center relative overflow-hidden group w-full"
                    >
                        <span className="text-[9px] font-black text-purple-400/80 uppercase tracking-[0.3em] mb-2 block">
                            {selectedTopic.category} • REVEALED
                        </span>
                        <p className="text-sm md:text-lg font-bold text-white italic leading-relaxed">
                            &ldquo;{selectedTopic.question}&rdquo;
                        </p>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 blur-2xl rounded-full" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
