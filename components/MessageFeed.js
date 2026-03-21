"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const QUICK_MESSAGES = [
    { text: "I love you ❤️", emoji: "❤️" },
    { text: "Miss you 🥺", emoji: "🥺" },
    { text: "Thinking of you 💭", emoji: "💭" },
    { text: "You're my world 🌍", emoji: "🌍" },
];

export default function MessageFeed() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0; // Newest at top
        }
    }, [messages]);

    const sendMessage = async (content) => {
        if (!content.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                setInput("");
                fetchMessages();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                    MESSAGE FEED
                </h3>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] text-white/20 uppercase font-black">Live Sync</span>
                </div>
            </div>

            {/* Messages List */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar pr-2"
            >
                <AnimatePresence initial={false}>
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center opacity-20 italic text-[10px] uppercase tracking-widest text-white/50">
                            No pings yet...
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-2xl text-xs ${
                                    msg.userId === session?.user?.id 
                                    ? "bg-purple-600/20 border border-purple-500/20 ml-4" 
                                    : "bg-white/5 border border-white/5 mr-4"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-black text-[9px] text-white/40 uppercase tracking-tighter">
                                        {msg.userId === session?.user?.id ? "YOU" : msg.authorName.split(' ')[0]}
                                    </span>
                                    <span className="text-[8px] text-white/20 uppercase">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-white/90 font-medium leading-relaxed">{msg.content}</p>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                {QUICK_MESSAGES.map((msg, i) => (
                    <button
                        key={i}
                        onClick={() => sendMessage(msg.text)}
                        disabled={loading}
                        className="py-2.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                    >
                        {msg.emoji}
                    </button>
                ))}
            </div>

            {/* Custom Input */}
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                    placeholder="Wink at partner..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-4 pr-12 text-[10px] text-white focus:outline-none focus:border-purple-500/50 font-medium placeholder:text-white/10"
                />
                <button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1.5 p-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-20"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
