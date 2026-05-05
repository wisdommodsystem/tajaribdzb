"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, MapPin, Clock, Tag } from "lucide-react";

export function EventManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "Discord",
    type: "General",
    imageUrl: "",
    eventUrl: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events", { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Auto-fix common Postimg non-direct links
    let fixedImageUrl = newEvent.imageUrl;
    if (fixedImageUrl.includes('postimg.cc') && !fixedImageUrl.includes('i.postimg.cc')) {
      // Basic attempt to convert page link to direct link if possible, 
      // though usually we need the filename. For now, just alert the user.
      console.log("Potential non-direct link detected");
    }

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newEvent, imageUrl: fixedImageUrl })
      });
      if (res.ok) {
        setNewEvent({ title: "", description: "", date: "", location: "Discord", type: "General", imageUrl: "", eventUrl: "" });
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  if (loading) return <div className="text-slate-400">Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#151a2b] p-4 md:p-6">
        <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#D4AF37]" />
          Schedule New Event
        </h2>
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="e.g. Strategic Philosophy Lecture"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Date & Time</label>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="Discord Voice / Stage"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
              >
                <option value="General">General</option>
                <option value="Lecture">Lecture</option>
                <option value="Discussion">Discussion</option>
                <option value="Tournament">Tournament</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                <span>Image URL (Direct Link)</span>
                <span className="text-[#D4AF37] normal-case">Use "Direct Link" from Postimg</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEvent.imageUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewEvent({ ...newEvent, imageUrl: val });
                    if (val && val.includes('postimg.cc') && !val.includes('i.postimg.cc')) {
                      // It's a page link, not a direct link
                      alert("Please use the 'Direct Link' from Postimages (usually starts with i.postimg.cc)");
                    }
                  }}
                  className="flex-1 rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                  placeholder="https://i.postimg.cc/..."
                />
                {newEvent.imageUrl && (
                  <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10 bg-[#0f1424]">
                    <img src={newEvent.imageUrl} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Event Link (Discord/External)</label>
              <input
                type="text"
                value={newEvent.eventUrl}
                onChange={(e) => setNewEvent({ ...newEvent, eventUrl: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="https://discord.gg/..."
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full h-24 rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] resize-none"
              placeholder="What is this event about?"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#4752c4] transition active:scale-95 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Scheduling..." : "Schedule Event"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#151a2b] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#0f1424]">
          <h2 className="text-sm font-semibold text-white">Upcoming Events</h2>
        </div>
        <div className="divide-y divide-white/5">
          {events.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No events scheduled.</div>
          ) : (
          (events || []).filter((e: any) => e !== null).map((event: any) => (
            <div key={event._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition">
              <div className="flex items-center gap-4">
                {event.imageUrl && (
                  <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={event.imageUrl} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{event.title || 'Event'}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      event.type === 'Lecture' ? 'bg-blue-500/10 text-blue-400' :
                      event.type === 'Discussion' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.date ? new Date(event.date).toLocaleString() : 'Date Unknown'}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location || 'Discord'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteEvent(event._id)}
                className="self-end sm:self-center p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition active:scale-90"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
