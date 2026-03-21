"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeartPulse from "./HeartPulse";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Don't show navbar on landing or auth pages
    if (
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname === "/messages"
    ) {
        return null;
    }

    const navLinks = [
        { href: "/dashboard", label: "Home", icon: "🌌" },
        { href: "/messages", label: "Messages", icon: "💬" },
        { href: "/memories", label: "Timeline", icon: "💫" },
        { href: "/journal", label: "Moods", icon: "📓" },
        { href: "/letters", label: "Archive", icon: "💌" },
        { href: "/our-story", label: "Stats", icon: "📊" },
    ];

    const isActive = (path) => pathname === path;

    return (
        <>
            {/* High-End Floating Navbar */}
            <nav className="fixed top-8 inset-x-0 z-[100] px-6 pointer-events-none">
                <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto glass-morphism p-2 rounded-full border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black/20 backdrop-blur-2xl">
                    
                    {/* Brand */}
                    <Link href="/dashboard" className="ml-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
                        >
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                                UZZ 🌕
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Menu - Minimalist */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative ${isActive(link.href)
                                    ? "text-black"
                                    : "text-white/40 hover:text-white"
                                    }`}>
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="nav-pill-premium"
                                            className="absolute inset-0 bg-white rounded-full shadow-lg"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Action Section */}
                    <div className="flex items-center gap-2 mr-2">
                         <div className="hidden sm:block">
                            <ThemeSwitcher />
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
                        
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-white/20 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation - Minimal Cosmic Style */}
            <div className="md:hidden fixed bottom-8 inset-x-8 z-[200] glass-morphism rounded-[3rem] border-white/10 p-2 flex items-center justify-around shadow-[0_30px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5 pointer-events-auto">
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex-1 relative">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 transition-all duration-500 ${isActive(link.href) ? "text-white" : "text-white/20"
                                }`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="mobile-dot-premium"
                                    className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
                                />
                            )}
                        </motion.div>
                    </Link>
                ))}
            </div>
        </>
    );
}
