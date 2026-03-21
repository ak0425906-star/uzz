"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarField from "@/components/StarField";
import MemoryCard from "@/components/MemoryCard";
import AddMemoryForm from "@/components/AddMemoryForm";
import MemoryDetailModal from "@/components/MemoryDetailModal";

export default function MemoriesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchMemories();
        }
    }, [status]);

    const fetchMemories = async () => {
        try {
            const res = await fetch("/api/memories");
            if (!res.ok) {
                console.error("Fetch memories failed:", res.status);
                return;
            }
            const data = await res.json();
            setMemories(data.memories || []);
        } catch (err) {
            console.error("Failed to fetch memories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = (newMemory) => {
        setMemories((prev) => [newMemory, ...prev]);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this memory?")) return;
        try {
            const res = await fetch(`/api/memories?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setMemories((prev) => prev.filter((m) => m._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    const filteredMemories =
        filter === "all"
            ? memories
            : memories.filter((m) => m.category === filter);

    const categories = [
        { value: "all", label: "All" },
        { value: "milestone", label: "🏆 Milestones" },
        { value: "date", label: "💕 Dates" },
        { value: "travel", label: "✈️ Travel" },
        { value: "everyday", label: "☀️ Everyday" },
        { value: "special", label: "⭐ Special" },
    ];

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#060614] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="relative min-h-screen bg-[#060614] pt-24 md:pt-32 pb-40 md:pb-12 px-4">
            <StarField />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-16 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                            <h1 className="text-6xl sm:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                                MEMORY <br />
                                <span className="text-gradient">TIMELINE</span>
                            </h1>
                        </div>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.5em] font-black ml-6">
                            {memories.length} CELESTIAL MOMENTS CAPTURED
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Custom Category Switcher */}
                        <div className="flex p-2 glass-morphism rounded-full border-white/5 overflow-x-auto no-scrollbar max-w-full sm:max-w-md bg-black/20">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setFilter(cat.value)}
                                    className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 relative whitespace-nowrap ${filter === cat.value ? "text-black" : "text-white/40 hover:text-white"
                                        }`}
                                >
                                    {filter === cat.value && (
                                        <motion.div
                                            layoutId="filter-pill"
                                            className="absolute inset-0 bg-white rounded-full shadow-lg shadow-white/5"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{cat.label.split(' ')[1] || cat.label}</span>
                                </button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowForm(true)}
                            className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-white/5 whitespace-nowrap"
                        >
                            + NEW CAPTURE
                        </motion.button>
                    </div>
                </motion.div>


                {/* Constellation Timeline */}
                {filteredMemories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 rounded-[4rem] glass-morphism border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full translate-y-1/2" />
                        <span className="text-7xl block mb-8 grayscale opacity-50">📸</span>
                        <h3 className="text-2xl text-white font-black uppercase tracking-tighter italic mb-4">
                            {filter !== "all" ? `No ${filter} moments FOUND` : "The void is waiting"}
                        </h3>
                        <p className="text-xs text-white/20 uppercase tracking-[0.3em] font-black mb-10">
                            EVERY LOVE STORY HAS ITS FIRST CHAPTER
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-8 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
                        >
                            Capture First Light ✨
                        </button>
                    </motion.div>
                ) : (
                    <div className="relative">
                        {/* Central Constellation Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block lg:block" />
                        
                        <div className="space-y-24 md:space-y-40">
                            {filteredMemories.map((memory, index) => (
                                <div key={memory._id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                    {/* Card */}
                                    <div className="w-full md:w-[45%]">
                                        <MemoryCard
                                            memory={memory}
                                            index={index}
                                            onDelete={handleDelete}
                                            onView={(mem) => setSelectedMemory(mem)}
                                        />
                                    </div>

                                    {/* Timeline Node */}
                                    <div className="relative flex items-center justify-center w-full md:w-[10%]">
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_white] z-20"
                                        />
                                        <div className="absolute w-[400px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent scale-x-150 rotate-[15deg] opacity-20 hidden md:block" />
                                    </div>

                                    {/* Empty Space for balancing */}
                                    <div className="hidden md:block md:w-[45%]" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showForm && (
                    <AddMemoryForm
                        onAdd={handleAdd}
                        onClose={() => setShowForm(false)}
                    />
                )}
                {selectedMemory && (
                    <MemoryDetailModal
                        memory={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
