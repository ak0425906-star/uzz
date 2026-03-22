"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceVault({ onUploadComplete, initialAudioUrl }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(initialAudioUrl || "");
    const [uploading, setUploading] = useState(false);
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const canvasRef = useRef(null);
    const chunksRef = useRef([]);
    const animationRef = useRef(null);
    const analyzerRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [stream]);

    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(mediaStream);

            const recorder = new MediaRecorder(mediaStream);
            setMediaRecorder(recorder);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                await uploadAudio(blob);
            };

            recorder.start();
            setIsRecording(true);
            visualize(mediaStream);
        } catch (err) {
            console.error("Microphone access denied:", err);
            alert("Please allow microphone access to record an Echo.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
    };

    const visualize = (mediaStream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(mediaStream);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 64;
        source.connect(analyzer);
        analyzerRef.current = analyzer;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            if (!isRecording) return;
            animationRef.current = requestAnimationFrame(draw);
            analyzer.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Draw Glow-Wave
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.4;
                const angle = (i / bufferLength) * Math.PI * 2;
                
                const x1 = centerX + Math.cos(angle) * 40;
                const y1 = centerY + Math.sin(angle) * 40;
                const x2 = centerX + Math.cos(angle) * (40 + barHeight);
                const y2 = centerY + Math.sin(angle) * (40 + barHeight);

                ctx.beginPath();
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 + (barHeight / 100)})`;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                // Outer Glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = "rgba(168, 85, 247, 0.5)";
            }
        };

        draw();
    };

    const uploadAudio = async (blob) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", blob, "echo.webm");
            
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
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">COSMIC ECHO</h3>
                    <p className="text-[10px] text-white/20 uppercase font-black mt-1">Capture the sound of this moment</p>
                </div>
                {audioUrl && !isRecording && (
                    <button 
                        onClick={() => { setAudioUrl(""); onUploadComplete(""); }}
                        className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Delete Echo ✕
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center justify-center py-4 min-h-[120px]">
                <AnimatePresence mode="wait">
                    {!isRecording ? (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center"
                        >
                            {audioUrl ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                        <span className="text-2xl">🎵</span>
                                    </div>
                                    <audio src={audioUrl} controls className="h-10 opacity-60 hover:opacity-100 transition-opacity" />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-purple-500/30 transition-all group/btn"
                                >
                                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse group-hover/btn:scale-125 transition-transform" />
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="recording"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <canvas 
                                ref={canvasRef} 
                                width={200} 
                                height={200} 
                                className="mb-4"
                            />
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="px-8 py-3 rounded-full bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-red-500/20"
                            >
                                Stop Transmitting
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {uploading && (
                <div className="mt-4 text-center">
                    <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest animate-pulse italic">
                        Sending Echo to the stars...
                    </p>
                </div>
            )}
        </div>
    );
}
