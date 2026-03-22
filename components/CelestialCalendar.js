"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const UPCOMING_EVENTS = [
    { date: "2026-03-25", name: "Full Worm Moon", icon: "🌕", type: "Moon" },
    { date: "2026-04-13", name: "Lyrids Meteor Shower", icon: "🌠", type: "Meteors" },
    { date: "2026-04-27", name: "Pink Supermoon", icon: "🌕", type: "Supermoon" },
    { date: "2026-05-05", name: "Eta Aquariids", icon: "☄️", type: "Meteors" },
];

export default function CelestialCalendar() {
    const [futureEvents, setFutureEvents] = useState([]);

    useEffect(() => {
        const today = new Date();
        const filtered = UPCOMING_EVENTS.filter(e => new Date(e.date) >= today).slice(0, 2);
        setFutureEvents(filtered);
    }, []);

    return (
        <div className="flex flex-col h-full justify-between">
            <div>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">
                    CELESTIAL CALENDAR
                </h3>
                <p className="text-[10px] text-white/20 uppercase font-bold leading-relaxed mb-6">
                    Upcoming cosmic alignments for our universe.
                </p>
            </div>

            <div className="space-y-4">
                {futureEvents.map((event, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-colors group"
                    >
                        <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{event.icon}</span>
                        <div>
                            <p className="text-[10px] font-black text-white tracking-tight">{event.name}</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold mt-0.5">
                                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-[8px] text-white/10 uppercase font-black italic tracking-widest">Orbital Path: Sync</span>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
