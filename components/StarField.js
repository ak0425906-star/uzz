"use client";

import { useEffect, useRef, useCallback } from "react";

const STAR_COLORS = [
    [255, 255, 255],    // Pure white
    [200, 220, 255],    // Ice blue
    [255, 240, 200],    // Warm gold
    [220, 200, 255],    // Faint violet
    [180, 220, 255],    // Pale cyan
    [255, 210, 180],    // Soft peach
];

export default function StarField() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    const getStarColor = useCallback((index) => {
        return STAR_COLORS[index % STAR_COLORS.length];
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const stars = [];
        const STAR_COUNT = 280;

        const initStars = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars.length = 0;

            for (let i = 0; i < STAR_COUNT; i++) {
                const layer = Math.random() < 0.15 ? 3 : Math.random() < 0.4 ? 2 : 1;
                const color = getStarColor(i);
                stars.push({
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    x: 0,
                    y: 0,
                    size: layer === 3 ? 1.5 + Math.random() * 1.5 : layer === 2 ? 0.8 + Math.random() : 0.3 + Math.random() * 0.6,
                    opacity: Math.random() * 0.6 + 0.2,
                    blinkSpeed: 0.003 + Math.random() * 0.015,
                    blinkDir: Math.random() > 0.5 ? 1 : -1,
                    layer,
                    driftSpeed: 0.015 + Math.random() * 0.035,
                    color,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const isActive = mouseRef.current.active;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                // Blink
                star.opacity += star.blinkSpeed * star.blinkDir;
                if (star.opacity > 0.95) { star.blinkDir = -1; }
                if (star.opacity < 0.1) { star.blinkDir = 1; }

                // Gentle upward drift
                star.baseY -= star.driftSpeed * star.layer;
                if (star.baseY < -10) {
                    star.baseY = canvas.height + 10;
                    star.baseX = Math.random() * canvas.width;
                }

                // Cursor parallax (desktop)
                let px = 0, py = 0;
                if (isActive) {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const factor = star.layer * 8;
                    px = ((mx - centerX) / centerX) * factor;
                    py = ((my - centerY) / centerY) * factor;
                }

                star.x = star.baseX + px;
                star.y = star.baseY + py;

                const [r, g, b] = star.color;
                const alpha = Math.max(0, Math.min(1, star.opacity));

                // Glow for closer stars
                if (star.layer >= 2) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
                    ctx.fill();
                }

                // Core
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        initStars();
        draw();

        const handleResize = () => initStars();

        let throttle = false;
        const handleMouse = (e) => {
            if (throttle) return;
            throttle = true;
            requestAnimationFrame(() => {
                mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
                throttle = false;
            });
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouse);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouse);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [getStarColor]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-[#030308]" />

            {/* Multi-tone Nebula */}
            <div className="absolute inset-0 opacity-50">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(88,28,135,0.08),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(30,58,138,0.06),_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,_rgba(15,23,42,0.15),_transparent_60%)]" />
            </div>

            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />

            {/* Animated Nebula Drift */}
            <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-15 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_25%_35%,_rgba(99,60,180,0.12),_transparent_45%),_radial-gradient(circle_at_75%_65%,_rgba(40,100,180,0.1),_transparent_50%)] blur-[100px] animate-nebula-float" />
            </div>
        </div>
    );
}
