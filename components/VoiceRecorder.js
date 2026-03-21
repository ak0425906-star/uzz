"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceRecorder({ onUploadComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const mimeType = mediaRecorder.current.mimeType || "audio/webm";
                const audioBlob = new Blob(audioChunks.current, { type: mimeType });
                uploadAudio(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Please allow microphone access to record voice memories!");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const uploadAudio = async (blob) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", blob, "voice-memory.wav");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setAudioUrl(data.url);
                onUploadComplete(data.url);
            }
        } catch (err) {
            console.error("Audio upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 mb-6 overflow-hidden relative group">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "bg-white/10"}`}>
                        <span className="text-xl">{isRecording ? "🔴" : "🎙️"}</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">
                            {isRecording ? "Capturing Sound..." : "Aural Memo"}
                        </p>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                            {audioUrl ? "Voice Captured" : "Record your voice"}
                        </p>
                    </div>
                </div>

                {!audioUrl ? (
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                            isRecording 
                            ? "bg-white text-black animate-pulse" 
                            : "bg-purple-600 text-white shadow-xl shadow-purple-500/20"
                        }`}
                    >
                        {isRecording ? "Stop & Transmit" : "Start Recording"}
                    </motion.button>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                             <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Received</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setAudioUrl(null); onUploadComplete(""); }}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {isRecording && (
                <div className="mt-6 flex gap-1 justify-center h-8 items-center bg-black/20 rounded-xl p-3">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                height: ["20%", "100%", "40%", "80%", "30%"],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ 
                                duration: 0.5, 
                                repeat: Infinity, 
                                delay: i * 0.05,
                                ease: "easeInOut"
                            }}
                            className="w-1 bg-red-500 rounded-full"
                        />
                    ))}
                </div>
            )}

            {uploading && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                </div>
            )}
        </div>
    );
}
