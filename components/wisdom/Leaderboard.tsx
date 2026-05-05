"use client";

import { useState, useEffect } from "react";
import { Crown, Trophy, Medal, Star, Mic, MessageSquare, Flame, Info, Sparkles, Zap, Users, Target, Clock, Gift, Gem } from "lucide-react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export function Leaderboard() {
  const [sortBy, setSortBy] = useState<"voice" | "text">("voice");
  const { data, loading, error } = useLeaderboard(sortBy);
  const [timeLeft, setTimeLeft] = useState("12 : 06 : 42");

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setTimeLeft(
        `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const announcements = [
    "🏆 تسلق المراتب الآن للمشاركة في مسابقات Wisdom Circle الكبرى!",
    "✨ مستواك يعكس مساهمتك الإستراتيجية في الدائرة.",
    "🔥 يحصل أسياد الصوت على وصول حصري لجلسات التوجيه الإستراتيجي.",
    "🎁 يتم اختيار الفائزين بالجوائز الشهرية بناءً على نشاط الـ Leveling.",
  ];

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">Ranking the most active scholars in the circle.</p>
        </div>
        
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 p-1.5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <button
            onClick={() => setSortBy("voice")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
              sortBy === "voice" 
                ? "bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            Voice Mastery
          </button>
          <button
            onClick={() => setSortBy("text")}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
              sortBy === "text" 
                ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Text Mastery
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[2rem] bg-[#1a1c23] p-7 border border-white/5 shadow-2xl transition-all hover:border-emerald-500/30">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-4xl font-black text-white tracking-tighter">1,277</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Total Registered</p>
            </div>
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
              <Users className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] bg-[#1a1c23] p-7 border border-white/5 shadow-2xl transition-all hover:border-blue-500/30">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-4xl font-black text-white tracking-tighter">{data.length > 0 ? data.length * 12 : 600}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Scholars</p>
            </div>
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
              <Target className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] bg-[#1a1c23] p-7 border border-white/5 shadow-2xl transition-all hover:border-amber-500/30">
          <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEASON RESET</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{timeLeft}</p>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">HRS Left</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium">Rewards distributed at the end of the countdown.</p>
          </div>
        </div>
      </div>

      {/* Podium Cards (Top 3) */}
      <div className="grid gap-6 sm:grid-cols-3 items-end pt-20 max-w-5xl mx-auto">
        {/* Rank 2 */}
        {top3[1] && (
          <div className="order-2 sm:order-1 group relative rounded-[2rem] bg-[#1a1c23] p-6 border border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:border-slate-400/20 h-[300px] flex flex-col justify-between">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl border-4 border-slate-400 overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-[#0a0e1a]">
                  {top3[1].avatar ? (
                    <img src={top3[1].avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-400">{top3[1].username[0]}</div>
                  )}
                </div>
                <div className="absolute -right-2 -bottom-1 h-8 w-8 rounded-xl bg-slate-400 flex items-center justify-center text-sm font-black text-white shadow-lg">2</div>
              </div>
            </div>
            
            <div className="mt-10 text-center space-y-0.5">
              <h3 className="text-lg font-bold text-white truncate px-2">{top3[1].username}</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Silver Scholar</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 uppercase">Level</span>
                <span className="text-white">{sortBy === "voice" ? top3[1].voiceLevel : top3[1].level}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 uppercase">{sortBy === "voice" ? "Mins" : "XP"}</span>
                <span className="text-white">{(sortBy === "voice" ? top3[1].voiceMinutes : top3[1].xp).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-bold text-emerald-500 uppercase">Score</span>
                <span className="text-base font-black text-emerald-400">{Math.floor(top3[1].combinedScore).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 */}
        {top3[0] && (
          <div className="order-1 sm:order-2 group relative rounded-[2.5rem] bg-gradient-to-b from-[#1e1f26] to-[#1a1c23] p-8 border border-amber-500/20 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.15)] transition-all hover:scale-[1.03] h-[360px] flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-t-[2.5rem]" />
            
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20">
              <div className="relative">
                <div className="absolute -inset-3 bg-amber-500/10 blur-xl rounded-full animate-pulse" />
                <div className="h-28 w-28 rounded-[2rem] border-4 border-amber-500 overflow-hidden shadow-xl shadow-amber-500/20 relative z-10 bg-[#0a0e1a]">
                  {top3[0].avatar ? (
                    <img src={top3[0].avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-amber-500">{top3[0].username[0]}</div>
                  )}
                </div>
                <div className="absolute -right-2 -bottom-2 h-11 w-11 rounded-2xl bg-amber-500 flex items-center justify-center text-xl font-black text-white shadow-xl ring-4 ring-[#1a1c23]">1</div>
                <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-8 text-amber-500 animate-bounce" />
              </div>
            </div>
            
            <div className="mt-14 text-center space-y-0.5">
              <h3 className="text-xl font-black text-white truncate px-2 group-hover:text-amber-400 transition-colors">{top3[0].username}</h3>
              <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em]">Grand Master</p>
            </div>

            <div className="bg-amber-500/5 rounded-[1.5rem] p-5 space-y-4 border border-amber-500/10">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-amber-500/60 uppercase">Mastery</span>
                <span className="text-lg font-black text-white">{sortBy === "voice" ? top3[0].voiceLevel : top3[0].level}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-amber-500/60 uppercase">{sortBy === "voice" ? "Minutes" : "XP"}</span>
                <span className="text-white">{(sortBy === "voice" ? top3[0].voiceMinutes : top3[0].xp).toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-amber-500/20 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-[9px] font-black text-white uppercase">Score</span>
                </div>
                <span className="text-2xl font-black text-amber-400">{Math.floor(top3[0].combinedScore).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {top3[2] && (
          <div className="order-3 group relative rounded-[2rem] bg-[#1a1c23] p-6 border border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:border-amber-800/20 h-[300px] flex flex-col justify-between">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl border-4 border-amber-800 overflow-hidden shadow-lg -rotate-3 group-hover:rotate-0 transition-transform duration-500 bg-[#0a0e1a]">
                  {top3[2].avatar ? (
                    <img src={top3[2].avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-bold text-amber-800">{top3[2].username[0]}</div>
                  )}
                </div>
                <div className="absolute -right-2 -bottom-1 h-8 w-8 rounded-xl bg-amber-800 flex items-center justify-center text-sm font-black text-white shadow-lg">3</div>
              </div>
            </div>
            
            <div className="mt-10 text-center space-y-0.5">
              <h3 className="text-lg font-bold text-white truncate px-2">{top3[2].username}</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Bronze Scholar</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 uppercase">Level</span>
                <span className="text-white">{sortBy === "voice" ? top3[2].voiceLevel : top3[2].level}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500 uppercase">{sortBy === "voice" ? "Mins" : "XP"}</span>
                <span className="text-white">{(sortBy === "voice" ? top3[2].voiceMinutes : top3[2].xp).toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] font-bold text-amber-700 uppercase">Score</span>
                <span className="text-base font-black text-amber-600">{Math.floor(top3[2].combinedScore).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Ranking Table */}
      <div className="rounded-[3rem] bg-[#1a1c23] p-10 border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Star className="h-6 w-6 text-blue-500" />
            Global Ranking
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/5 via-white/5 to-transparent mx-8 hidden sm:block" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
            Top 50 Candidates
          </span>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="pb-4 text-left pl-6">Rank</th>
                <th className="pb-4 text-left">Candidate</th>
                <th className="pb-4 text-center">Mastery LVL</th>
                <th className="pb-4 text-center">{sortBy === "voice" ? "Total Time" : "Total XP"}</th>
                <th className="pb-4 text-right pr-6">Score</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="h-6 w-6 text-blue-500 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Synchronizing Archives...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rest.map((entry, index) => (
                  <tr key={entry.id} className="group transition-all duration-300">
                    <td className="py-4 pl-6 bg-white/[0.02] rounded-l-[1.5rem] group-hover:bg-white/[0.05] transition-colors border-y border-l border-white/5 group-hover:border-white/10">
                      <div className="h-10 w-10 rounded-2xl bg-[#0a0e1a] border border-white/5 flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-white group-hover:border-blue-500/30 transition-all">
                        #{index + 4}
                      </div>
                    </td>
                    <td className="py-4 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5 group-hover:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-blue-500/50 transition-all duration-500 group-hover:scale-110">
                            {entry.avatar ? (
                              <img src={entry.avatar} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-900 text-[10px] font-bold">NULL</div>
                            )}
                          </div>
                          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#1a1c23] group-hover:animate-ping" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                            {entry.username}
                          </span>
                          <span className="text-[9px] font-mono text-slate-600">SCHOLAR_{entry.id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5 group-hover:border-white/10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-black text-white border border-white/5 group-hover:border-white/20">
                        {sortBy === "voice" ? entry.voiceLevel : entry.level}
                      </div>
                    </td>
                    <td className="py-4 text-center bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors border-y border-white/5 group-hover:border-white/10">
                      <span className="text-sm font-black text-slate-300 group-hover:text-white transition-colors">
                        {(sortBy === "voice" ? entry.voiceMinutes : entry.xp).toLocaleString()}
                        <span className="text-[10px] text-slate-600 ml-1.5 font-bold uppercase">{sortBy === "voice" ? "MIN" : "XP"}</span>
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right bg-white/[0.02] rounded-r-[1.5rem] group-hover:bg-white/[0.05] transition-colors border-y border-r border-white/5 group-hover:border-white/10">
                      <span className="text-lg font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                        {Math.floor(entry.combinedScore).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements/Guidelines */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {announcements.map((text, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[2rem] bg-[#1a1c23]/50 p-6 border border-white/5 hover:bg-[#1a1c23] hover:border-white/10 transition-all">
            <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-white/[0.02] rounded-full blur-xl group-hover:bg-white/[0.05] transition-all" />
            <div className="h-10 w-10 mb-4 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:scale-110 transition-all duration-500">
              {i === 0 ? <Trophy className="h-5 w-5" /> : i === 1 ? <Sparkles className="h-5 w-5" /> : i === 2 ? <Mic className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors font-medium">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
