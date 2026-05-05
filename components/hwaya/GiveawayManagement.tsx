"use client";

import { useState, useEffect } from "react";
import { Gift, Plus, Trash2, Clock, Users, Trophy } from "lucide-react";

export function GiveawayManagement() {
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreatingGiveaway] = useState(false);
  const [newGiveaway, setNewGiveaway] = useState({
    title: "",
    description: "",
    prize: "",
    endDate: "",
    winnersCount: 1,
    imageUrl: ""
  });

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      const res = await fetch("/api/admin/giveaways", { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setGiveaways(data);
    } catch (error) {
      console.error("Failed to fetch giveaways:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGiveaway = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingGiveaway(true);

    let fixedImageUrl = newGiveaway.imageUrl;
    // Auto-fix common Postimg non-direct links
    if (fixedImageUrl.includes('postimg.cc') && !fixedImageUrl.includes('i.postimg.cc')) {
      const parts = fixedImageUrl.split('/');
      const id = parts[parts.length - 1];
      if (id) {
        // Try to construct a direct link - postimg usually follows this pattern
        // Note: This is a best-effort fix, direct links are always preferred.
        fixedImageUrl = `https://i.postimg.cc/${id}/image.png`;
      }
    }

    try {
      const res = await fetch("/api/admin/giveaways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newGiveaway, imageUrl: fixedImageUrl })
      });
      if (res.ok) {
        setNewGiveaway({ title: "", description: "", prize: "", endDate: "", winnersCount: 1, imageUrl: "" });
        fetchGiveaways();
      }
    } catch (error) {
      console.error("Failed to create giveaway:", error);
    } finally {
      setIsCreatingGiveaway(false);
    }
  };

  const deleteGiveaway = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/giveaways?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchGiveaways();
    } catch (error) {
      console.error("Failed to delete giveaway:", error);
    }
  };

  const updateStatus = async (id: string, status: string, drawWinners = false) => {
    try {
      const res = await fetch("/api/admin/giveaways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, drawWinners })
      });
      if (res.ok) fetchGiveaways();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return <div className="text-slate-400">Loading giveaways...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#151a2b] p-4 md:p-6">
        <h2 className="mb-4 text-lg font-medium text-white flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#D4AF37]" />
          Create New Giveaway
        </h2>
        <form onSubmit={handleCreateGiveaway} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Giveaway Title</label>
              <input
                type="text"
                value={newGiveaway.title}
                onChange={(e) => setNewGiveaway({ ...newGiveaway, title: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="e.g. Monthly Nitro Giveaway"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">End Date & Time</label>
              <input
                type="datetime-local"
                value={newGiveaway.endDate}
                onChange={(e) => setNewGiveaway({ ...newGiveaway, endDate: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Prize</label>
              <input
                type="text"
                value={newGiveaway.prize}
                onChange={(e) => setNewGiveaway({ ...newGiveaway, prize: e.target.value })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="e.g. Discord Nitro 1 Month"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Winners Count</label>
              <input
                type="number"
                min="1"
                value={newGiveaway.winnersCount}
                onChange={(e) => setNewGiveaway({ ...newGiveaway, winnersCount: parseInt(e.target.value) })}
                className="w-full rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
              <span>Background Image URL</span>
              <span className="text-blue-400 normal-case font-medium">Use "Direct Link" (i.postimg.cc)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGiveaway.imageUrl}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewGiveaway({ ...newGiveaway, imageUrl: val });
                }}
                className="flex-1 rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                placeholder="https://i.postimg.cc/..."
              />
              {newGiveaway.imageUrl && (
                <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-[#0f1424]">
                  <img 
                    src={newGiveaway.imageUrl.includes('postimg.cc') && !newGiveaway.imageUrl.includes('i.postimg.cc')
                      ? `https://i.postimg.cc/${newGiveaway.imageUrl.split('/').pop()}/image.png`
                      : newGiveaway.imageUrl} 
                    alt="Preview" 
                    className="h-full w-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea
              value={newGiveaway.description}
              onChange={(e) => setNewGiveaway({ ...newGiveaway, description: e.target.value })}
              className="w-full h-24 rounded-lg bg-[#0f1424] border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#5865F2] resize-none"
              placeholder="Giveaway details and requirements..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#4752c4] transition active:scale-95 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Create Giveaway"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#151a2b] overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-[#0f1424]">
          <h2 className="text-sm font-semibold text-white">Manage Giveaways</h2>
        </div>
        <div className="divide-y divide-white/5">
          {giveaways.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">No giveaways found.</div>
          ) : (
            (giveaways || []).filter((g: any) => g !== null).map((giveaway: any) => (
              <div key={giveaway._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#5865F2]/10 flex items-center justify-center border border-white/10">
                    <Gift className="h-6 w-6 text-[#5865F2]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{giveaway.title || 'Giveaway'}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        giveaway.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                        giveaway.status === 'Ended' ? 'bg-red-500/10 text-red-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {giveaway.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {giveaway.prize}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {giveaway.participants?.length || 0} participants</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Ends: {giveaway.endDate ? new Date(giveaway.endDate).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {giveaway.status === 'Active' && (
                    <button
                      onClick={() => updateStatus(giveaway._id, 'Ended', true)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition"
                    >
                      End & Draw Winners
                    </button>
                  )}
                  {giveaway.status === 'Ended' && giveaway.winners?.length === 0 && (
                    <button
                      onClick={() => updateStatus(giveaway._id, 'Ended', true)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                    >
                      Draw Winners
                    </button>
                  )}
                  <button
                    onClick={() => deleteGiveaway(giveaway._id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition active:scale-90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
