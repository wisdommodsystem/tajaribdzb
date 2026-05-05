"use client";

import { useState, useEffect } from "react";
import { Youtube, X, Bell } from "lucide-react";

export function YouTubePopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenYoutubePopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenYoutubePopup", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111320]/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Background Accent */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />
        
        <button 
          onClick={closePopup}
          className="absolute right-3 top-3 text-slate-500 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
            <Youtube className="h-6 w-6" />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold text-white">ادعم مجتمعنا! ⭕</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              اشترك في قناتنا على اليوتيوب لمتابعة آخر الحلقات والنقاشات الفلسفية ودعم استمراريتنا.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <a
            href="https://www.youtube.com/@Wisdom_Circle0/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closePopup}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
          >
            <Bell className="h-4 w-4" />
            اشترك الآن
          </a>
          <button
            onClick={closePopup}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
