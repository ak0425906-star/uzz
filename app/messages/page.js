"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StarField from "@/components/StarField";

export default function MessagesPage() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [partnerName, setPartnerName] = useState("Partner");
    const scrollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
                
                // Try to find partner name from messages if not set
                if (partnerName === "Partner" && data.messages?.length > 0) {
                    const otherMsg = data.messages.find(m => m.userId !== session?.user?.id);
                    if (otherMsg) setPartnerName(otherMsg.authorName);
                }
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000); 
        return () => clearInterval(interval);
    }, [session]);

    // Scroll to bottom on load and new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;
        
        const content = input;
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#060614] flex flex-col overflow-hidden">
            <StarField />

            {/* Sticky Mobile Header */}
            <div className="relative z-[110] bg-[#060614]/80 backdrop-blur-2xl border-b border-white/5 px-4 pt-12 pb-4 flex items-center gap-4 shadow-2xl">
                <Link href="/dashboard">
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.div>
                </Link>
                
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-black text-xs shadow-lg shadow-purple-500/20">
                        {partnerName[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-white uppercase tracking-widest">{partnerName}</h1>
                        <div className="flex items-center gap-1.5 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-white/30 uppercase tracking-tighter">Connected in Outer Space</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar relative z-10 flex flex-col"
            >
                <div className="flex-1" /> {/* Spacer to push messages to bottom if few */}
                <AnimatePresence initial={false}>
                    {[...messages].reverse().map((msg, i) => (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[85%] group`}>
                                <div className={`px-5 py-3.5 rounded-[1.8rem] text-sm font-medium shadow-xl transition-all ${
                                    msg.userId === session?.user?.id 
                                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-br-sm shadow-purple-900/20" 
                                    : "bg-white/10 border border-white/5 text-white/90 rounded-bl-sm backdrop-blur-md"
                                }`}>
                                    {msg.content}
                                </div>
                                <div className={`flex items-center gap-2 mt-1 px-2 ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}>
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Sticky Input Footer */}
            <div className="relative z-[110] bg-[#060614]/80 backdrop-blur-2xl border-t border-white/5 px-4 pt-4 pb-10">
                <form onSubmit={sendMessage} className="relative flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message..."
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-3.5 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium placeholder:text-white/20"
                        />
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-20 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:shadow-inner"
                    >
                         <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current rotate-90 scale-x-[-1]">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
