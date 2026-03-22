"use client";

import { useState, memo } from "react";
import { motion } from "framer-motion";

function SOSWidget() {
    const [status, setStatus] = useState("idle"); // idle, sending, success, error

    const sendPing = async (type) => {
        setStatus("sending");
        try {
            const res = await fetch("/api/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });
            if (res.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch (err) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <div>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">
                    COSMIC SOS
                </h3>
                <p className="text-[10px] text-white/20 uppercase font-bold leading-relaxed">
                    Alert your partner instantly on their phone.
                </p>
            </div>

            <div className="flex gap-4">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendPing("SOS")}
                    disabled={status === "sending"}
                    className="flex-1 aspect-square rounded-3xl bg-red-600/20 border border-red-500/30 flex flex-col items-center justify-center gap-2 group hover:bg-red-600/30 transition-all"
                >
                    <span className="text-3xl group-hover:scale-125 transition-transform">🚨</span>
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">SEND SOS</span>
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => sendPing("LOVE")}
                    disabled={status === "sending"}
                    className="flex-1 aspect-square rounded-3xl bg-pink-600/20 border border-pink-500/30 flex flex-col items-center justify-center gap-2 group hover:bg-pink-600/30 transition-all"
                >
                    <span className="text-3xl group-hover:scale-125 transition-transform">💖</span>
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">SEND LOVE</span>
                </motion.button>
            </div>

            <div className="mt-4 flex items-center justify-center">
                {status === "sending" && <span className="text-[8px] text-white/20 animate-pulse uppercase font-black italic">Transmitting...</span>}
                {status === "success" && <span className="text-[8px] text-green-400 uppercase font-black italic">Transmission Received ✨</span>}
                {status === "error" && <span className="text-[8px] text-red-500 uppercase font-black italic">Sync Failed 📶</span>}
                {status === "idle" && <div className="h-2" />}
            </div>
        </div>
    );
}

export default memo(SOSWidget);
