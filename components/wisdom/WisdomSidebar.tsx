"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Trophy, Users, Menu, X } from "lucide-react";

export function WisdomSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md md:hidden fixed top-0 left-0 right-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="relative group/logo">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#5865F2] to-[#D4AF37] rounded-lg blur-[2px] opacity-20" />
            <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-[#0a0e1a]">
              <img 
                src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                alt="Wisdom Logo" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-black text-white uppercase tracking-wider leading-none">Wisdom</h2>
            <span className="text-[7px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mt-0.5">Strategic Platform</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 p-5 transition-transform duration-300 z-[120] md:relative md:translate-x-0 md:flex md:min-h-screen md:bg-slate-950/60 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col w-full">
          <div className="px-6 py-8 mb-4 hidden md:block border-b border-white/[0.03]">
            <div className="flex items-center gap-4 group/brand cursor-default">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#5865F2] to-[#D4AF37] rounded-xl blur-md opacity-10 group-hover/brand:opacity-25 transition-all duration-700" />
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-[#0a0e1a] shadow-lg transition-transform duration-500 group-hover/brand:scale-105">
                  <img 
                    src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                    alt="Wisdom Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-black text-white tracking-tighter leading-none uppercase italic">Wisdom</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-[#D4AF37] font-black tracking-widest uppercase opacity-80">Strategic</span>
                  <span className="text-[9px] text-slate-500 font-bold tracking-tighter uppercase opacity-60">Platform</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="space-y-3">
            <Link
              href="/wisdom"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-slate-200 transition hover:border-gold/40"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/wisdom"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-slate-200 transition hover:border-electric/40"
            >
              <Trophy className="h-4 w-4" />
              Hall of Fame
            </Link>
            <Link
              href="/wisdom"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-slate-200 transition hover:border-white/30"
            >
              <Users className="h-4 w-4" />
              Community
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
