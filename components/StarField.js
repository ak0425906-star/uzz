"use client";

import { useEffect, useRef } from "react";

export default function StarField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        
        const stars = [];
        const layerCount = 3;
        const starCount = 200;

        // Initialize stars
        const initStars = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars.length = 0;
            
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2,
                    opacity: Math.random(),
                    speed: Math.random() * 0.05 + 0.02,
                    layer: Math.floor(Math.random() * layerCount) + 1,
                    blinkSpeed: Math.random() * 0.02 + 0.005,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                // Update opacity for blinking
                star.opacity += star.blinkSpeed;
                if (star.opacity > 1 || star.opacity < 0) {
                    star.blinkSpeed = -star.blinkSpeed;
                }

                // Parallax drift (based on layer)
                star.y -= star.speed * star.layer;
                if (star.y < 0) star.y = canvas.height;

                // Draw star
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.opacity)})`;
                ctx.fill();
                
                // Add soft glow to closer stars
                if (star.layer > 1) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = "white";
                } else {
                    ctx.shadowBlur = 0;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        initStars();
        draw();

        const handleResize = () => {
            initStars();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base Universe Gradient */}
            <div className="absolute inset-0 bg-[#060614]" />
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(123,97,255,0.08),_transparent_70%)]" />
            
            <canvas 
                ref={canvasRef} 
                className="w-full h-full opacity-60" 
            />

            {/* Nebula Atmosphere - Animated CSS Layer */}
            <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,_rgba(123,97,255,0.15),_transparent_50%),_radial-gradient(circle_at_80%_70%,_rgba(77,168,255,0.15),_transparent_50%)] blur-[120px] animate-nebula-float" />
            </div>
        </div>
    );
}
