"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import StarField from "@/components/StarField";

export default function MessagesPage() {
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
        const interval = setInterval(fetchMessages, 5000); // Faster polling for full page
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
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
        <div className="relative min-h-screen bg-[#060614] pt-24 pb-36 md:pb-12 px-4 overflow-hidden flex flex-col">
            <StarField />

            <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                            COSMIC <span className="text-gradient">CHAT</span>
                        </h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black mt-1">
                            A private channel in UZZ 🌕
                        </p>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 glass-morphism rounded-[3rem] p-6 sm:p-10 mb-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full" />

                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4 flex flex-col-reverse"
                    >
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg._id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] sm:max-w-[70%] space-y-2`}>
                                        <div className={`flex items-center gap-2 mb-1 ${msg.userId === session?.user?.id ? "justify-end" : "justify-start"}`}>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest leading-none">
                                                {msg.userId === session?.user?.id ? "YOU" : msg.authorName}
                                            </span>
                                        </div>
                                        <div className={`p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative group ${
                                            msg.userId === session?.user?.id 
                                            ? "bg-gradient-to-br from-purple-600/20 to-indigo-600/30 border border-purple-500/30 text-white rounded-tr-none" 
                                            : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                                        }`}>
                                            <p className="text-sm sm:text-base font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Input Area */}
                <form 
                    onSubmit={sendMessage}
                    className="relative"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message to your love..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-8 pr-24 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all font-medium placeholder:text-white/10 backdrop-blur-xl"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-3 top-2.5 bottom-2.5 px-8 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-white/5"
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
}
