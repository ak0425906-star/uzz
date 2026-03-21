"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function StarField() {
    const [stars, setStars] = useState([]);
    const [shootingStars, setShootingStars] = useState([]);
    const { scrollY } = useScroll();
    
    // Parallax transforms
    const yDeep = useTransform(scrollY, [0, 5000], [0, 500]);
    const yMid = useTransform(scrollY, [0, 5000], [0, 800]);
    const yClose = useTransform(scrollY, [0, 5000], [0, 1200]);

    useEffect(() => {
        // Multi-layered star system
        const layers = [
            { count: 150, layer: "deep", size: [1, 2], duration: [4, 6] },
            { count: 100, layer: "mid", size: [2, 3], duration: [3, 5] },
            { count: 40, layer: "close", size: [3, 5], duration: [2, 4] }
        ];

        const allStars = layers.flatMap(({ count, layer, size, duration }, layerIdx) => 
            Array.from({ length: count }).map((_, i) => ({
                id: `${layer}-${i}`,
                layer,
                size: Math.random() * (size[1] - size[0]) + size[0],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                duration: Math.random() * (duration[1] - duration[0]) + duration[0],
                delay: Math.random() * 10,
                opacity: Math.random() * 0.5 + 0.3
            }))
        );
        setStars(allStars);

        // Shooting stars interval
        const shootingStarInterval = setInterval(() => {
            if (Math.random() > 0.4) {
                const id = Date.now();
                setShootingStars(prev => [...prev, {
                    id,
                    left: `${Math.random() * 50}%`,
                    top: `${Math.random() * 50}%`,
                    angle: 45
                }]);
                setTimeout(() => {
                    setShootingStars(prev => prev.filter(s => s.id !== id));
                }, 3000);
            }
        }, 8000);

        return () => clearInterval(shootingStarInterval);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base Universe Gradient */}
            <div className="absolute inset-0 bg-[#050505]" />
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_rgba(123,97,255,0.08),_transparent_70%)]" />
            
            {/* Parallax Layers */}
            <motion.div style={{ y: yDeep }} className="absolute inset-0">
                {stars.filter(s => s.layer === "deep").map(star => (
                    <StarNode key={star.id} star={star} />
                ))}
            </motion.div>

            <motion.div style={{ y: yMid }} className="absolute inset-x-0 -inset-y-20">
                {stars.filter(s => s.layer === "mid").map(star => (
                    <StarNode key={star.id} star={star} />
                ))}
            </motion.div>

            <motion.div style={{ y: yClose }} className="absolute inset-x-0 -inset-y-40">
                {stars.filter(s => s.layer === "close").map(star => (
                    <StarNode key={star.id} star={star} />
                ))}
            </motion.div>

            {/* Shooting Stars */}
            {shootingStars.map(s => (
                <motion.div
                    key={s.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                    animate={{ 
                        x: 800, 
                        y: 800 * Math.tan(s.angle * Math.PI / 180),
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px] w-[150px] origin-left"
                    style={{ left: s.left, top: s.top, transform: `rotate(${s.angle}deg)` }}
                />
            ))}

            {/* Nebula Atmosphere */}
            <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-20">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_30%,_rgba(123,97,255,0.15),_transparent_50%),_radial-gradient(circle_at_80%_70%,_rgba(77,168,255,0.15),_transparent_50%)] blur-[100px]" 
                />
            </div>
        </div>
    );
}

function StarNode({ star }) {
    return (
        <motion.div
            className="absolute rounded-full bg-white shadow-[0_0_10px_white]"
            animate={{
                opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
                scale: [0.8, 1, 0.8],
            }}
            transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
            }}
            style={{
                width: star.size,
                height: star.size,
                left: star.left,
                top: star.top,
            }}
        />
    );
}
