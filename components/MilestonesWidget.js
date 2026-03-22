"use client";

import { motion } from "framer-motion";

const RANKS = [
    { title: "Star Dust", icon: "✨", minDays: 0, minMemories: 0, color: "from-gray-400 to-slate-500" },
    { title: "Neophyte Stargazers", icon: "🔭", minDays: 30, minMemories: 10, color: "from-blue-400 to-indigo-500" },
    { title: "Binary System", icon: "♊", minDays: 90, minMemories: 50, color: "from-purple-400 to-pink-500" },
    { title: "Constellation Creators", icon: "🎨", minDays: 180, minMemories: 100, color: "from-yellow-400 to-orange-500" },
    { title: "Supernova Pair", icon: "💥", minDays: 365, minMemories: 250, color: "from-red-400 to-rose-600" },
    { title: "Universal Legends", icon: "🌌", minDays: 730, minMemories: 500, color: "from-cyan-400 to-blue-600" },
];

export default function MilestonesWidget({ daysTogether, totalMemories }) {
    // Calculate current rank
    let currentRankIndex = 0;
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (daysTogether >= RANKS[i].minDays || totalMemories >= RANKS[i].minMemories) {
            currentRankIndex = i;
            break;
        }
    }

    const currentRank = RANKS[currentRankIndex];
    const nextRank = RANKS[currentRankIndex + 1];
    
    // Calculate progress to next rank
    let progress = 100;
    if (nextRank) {
        const memoryProgress = Math.min((totalMemories / nextRank.minMemories) * 100, 100);
        const dayProgress = Math.min((daysTogether / nextRank.minDays) * 100, 100);
        progress = Math.max(memoryProgress, dayProgress);
    }

    return (
        <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">CURRENT RANK</h3>
                    <p className={`text-xl font-black bg-gradient-to-r ${currentRank.color} bg-clip-text text-transparent uppercase italic tracking-tighter`}>
                        {currentRank.title}
                    </p>
                </div>
                <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {currentRank.icon}
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <div className="flex justify-between items-end">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                        {nextRank ? `Next Rank: ${nextRank.title}` : "Maximum Ascension Reached"}
                    </p>
                    {nextRank && (
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                            {Math.round(progress)}%
                        </p>
                    )}
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={`h-full bg-gradient-to-r ${currentRank.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                    />
                </div>
            </div>

            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
        </div>
    );
}
