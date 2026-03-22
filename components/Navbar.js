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
        { href: "/starmap", label: "Star Map", icon: "🗺️" },
        { href: "/letters", label: "Archive", icon: "💌" },
        { href: "/our-story", label: "Stats", icon: "📊" },
    ];

    const isActive = (path) => pathname === path;

    return (
        <>
            {/* Premium Floating Navbar */}
            <nav className="fixed top-6 inset-x-0 z-[100] px-4 md:px-6 pointer-events-none">
                <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto glass-morphism p-1.5 rounded-full border-white/[0.06] bg-black/30">

                    {/* Brand Mark */}
                    <Link href="/dashboard" className="ml-1">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-white/[0.03] transition-colors"
                        >
                            {/* CSS Moon */}
                            <div className="relative w-3 h-3">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e8e8e8] to-[#9ea3a8] shadow-[0_0_8px_rgba(200,210,230,0.4)]" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-l from-transparent to-black/20" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70">
                                UZZ
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <div className={`relative px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] transition-all duration-500 ${isActive(link.href)
                                    ? "text-white"
                                    : "text-white/30 hover:text-white/60"
                                    }`}>
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="nav-constellation"
                                            className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08]"
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {link.label}
                                        {isActive(link.href) && (
                                            <motion.div
                                                layoutId="nav-star"
                                                className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_white]"
                                            />
                                        )}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 mr-1.5">
                        <div className="hidden sm:block">
                            <ThemeSwitcher />
                        </div>
                        <div className="w-px h-5 bg-white/[0.06] mx-0.5 hidden sm:block" />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-white/15 hover:text-white/50 hover:bg-white/[0.03] transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 inset-x-6 z-[200] glass-morphism rounded-[2.5rem] border-white/[0.06] p-1.5 flex items-center justify-around bg-black/40 ring-1 ring-white/[0.03] pointer-events-auto">
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex-1 relative">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 transition-all duration-500 ${isActive(link.href) ? "text-white" : "text-white/15"
                                }`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="mobile-constellation"
                                    className="w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(200,210,230,0.8)]"
                                />
                            )}
                        </motion.div>
                    </Link>
                ))}
            </div>
        </>
    );
}
