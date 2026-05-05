"use client";

import { useState, useEffect } from "react";
import { Bell, Send, Trash2, Megaphone, AlertCircle, Calendar, Gift } from "lucide-react";

export function NotificationManagement() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newNotif, setNewNotif] = useState({
    title: "",
    message: "",
    type: "Announcement",
    target: "All",
    recipientId: ""
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      console.log("Attempting to send notification:", newNotif);
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotif)
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setNewNotif({ title: "", message: "", type: "Announcement", target: "All", recipientId: "" });
        fetchNotifications();
      } else {
        alert(`Error: ${result.error || "Unknown error"}\nDetails: ${result.details || "None"}`);
      }
    } catch (error) {
      console.error("Failed to send:", error);
      alert("Failed to send notification. Check console for details.");
    } finally {
      setIsSending(false);
    }
  };

  const deleteNotif = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchNotifications();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  if (loading) return <div className="text-slate-400">Loading protocol...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#151a2b] p-6">
        <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tighter italic">
          <Megaphone className="h-5 w-5 text-blue-500" />
          Broadcast Notification
        </h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Title</label>
              <input
                type="text"
                value={newNotif.title}
                onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Server Maintenance"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
              <select
                value={newNotif.type}
                onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Announcement">Announcement</option>
                <option value="Alert">Alert</option>
                <option value="Event">Event</option>
                <option value="Gift">Gift</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Scope</label>
              <select
                value={newNotif.target}
                onChange={(e) => setNewNotif({ ...newNotif, target: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Scholars</option>
                <option value="Specific">Specific Member (Discord ID)</option>
              </select>
            </div>
            {newNotif.target === "Specific" && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Discord ID</label>
                <input
                  type="text"
                  value={newNotif.recipientId}
                  onChange={(e) => setNewNotif({ ...newNotif, recipientId: e.target.value })}
                  className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 1234567890"
                  required
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transmission Message</label>
            <textarea
              value={newNotif.message}
              onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
              className="w-full h-24 rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Enter the core message of the broadcast..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Transmitting..." : "Send Notification"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#151a2b] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#0f1424]">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest italic">Broadcast Log</h2>
        </div>
        <div className="divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm italic">No active transmissions found.</div>
          ) : (
          (notifications || []).filter((n: any) => n !== null).map((notif: any) => (
            <div key={notif._id} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition group">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center border border-white/5 ${
                  notif.type === 'Announcement' ? 'bg-blue-500/10 text-blue-400' :
                  notif.type === 'Alert' ? 'bg-red-500/10 text-red-400' :
                  notif.type === 'Event' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {notif.type === 'Announcement' && <Megaphone className="h-5 w-5" />}
                  {notif.type === 'Alert' && <AlertCircle className="h-5 w-5" />}
                  {notif.type === 'Event' && <Calendar className="h-5 w-5" />}
                  {notif.type === 'Gift' && <Gift className="h-5 w-5" />}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{notif.title || 'Broadcast'}</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 text-slate-500 uppercase">
                      {notif.target === 'All' ? 'GLOBAL' : 'SPECIFIC'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{notif.message}</p>
                  <div className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteNotif(notif._id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition active:scale-90"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}
