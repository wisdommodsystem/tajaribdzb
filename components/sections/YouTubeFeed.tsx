"use client";

import { useEffect, useState } from "react";
import { Youtube, ExternalLink, Play } from "lucide-react";

export function YouTubeFeed() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setVideos(data);
        } else {
          setError(data.error || "حدث خطأ أثناء جلب الفيديوهات");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) return (
    <div className="py-24 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      <p className="mt-4 text-slate-400">جاري تحميل الفيديوهات...</p>
    </div>
  );

  if (error) return (
    <div className="py-24 text-center">
      <p className="text-red-500 font-medium">{error}</p>
      <p className="mt-2 text-sm text-slate-500">يرجى التحقق من API Key و Channel ID في ملف .env</p>
    </div>
  );

  if (videos.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0b10]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <h2 className="flex items-center justify-center gap-3 text-3xl font-bold text-white md:justify-start">
              <Youtube className="h-8 w-8 text-red-600" />
              آخر إنتاجاتنا على اليوتيوب
            </h2>
            <p className="mt-2 text-slate-400">تابع أحدث الحلقات والنقاشات الفلسفية من دائرة الحكمة</p>
          </div>
          <a
            href="https://www.youtube.com/@Wisdom_Circle0/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl bg-red-600/10 px-6 py-3 text-sm font-bold text-red-500 transition hover:bg-red-600 hover:text-white"
          >
            مشاهدة الكل
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#111320] transition hover:border-red-600/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 font-bold text-white transition group-hover:text-red-500">
                  {video.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {video.description}
                </p>
                <div className="mt-auto pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {new Date(video.publishedAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
