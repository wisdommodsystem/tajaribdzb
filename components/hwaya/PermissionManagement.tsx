"use client";

import { useState, useEffect } from "react";
import { Shield, Check, X, Palette, Activity, ArrowUpRight, Clock, User, Settings2, Save } from "lucide-react";

export function PermissionManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [roleSettings, setRoleSettings] = useState({
    pic_perm_role_id: "",
    activity_perm_role_id: "",
    link_perm_role_id: ""
  });

  useEffect(() => {
    fetchRequests();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings/permissions", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setRoleSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleSettings)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
        setShowSettings(false);
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/permissions", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setRequests(data.filter(r => r !== null));
    } catch (error) {
      console.error("Failed to fetch permission requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status })
      });
      if (res.ok) {
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update request");
      }
    } catch (error) {
      console.error("Failed to update permission request:", error);
    }
  };

  if (loading) return <div className="text-slate-400">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Permission Requests</h1>
          <p className="text-sm text-slate-400">Review and manage member permission requests.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
              showSettings ? "bg-gold text-slate-950" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
            title="Role Settings"
          >
            <Settings2 className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
            <Shield className="h-6 w-6" />
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-gold">
              <Settings2 className="h-4 w-4" />
              Permission Role IDs
            </h2>
            <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <form onSubmit={handleSaveSettings} className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pic Perm Role ID</label>
              <input 
                type="text"
                value={roleSettings.pic_perm_role_id}
                onChange={(e) => setRoleSettings({...roleSettings, pic_perm_role_id: e.target.value})}
                placeholder="Discord Role ID"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Activity Perm Role ID</label>
              <input 
                type="text"
                value={roleSettings.activity_perm_role_id}
                onChange={(e) => setRoleSettings({...roleSettings, activity_perm_role_id: e.target.value})}
                placeholder="Discord Role ID"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Link Perm Role ID</label>
              <input 
                type="text"
                value={roleSettings.link_perm_role_id}
                onChange={(e) => setRoleSettings({...roleSettings, link_perm_role_id: e.target.value})}
                placeholder="Discord Role ID"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-gold/80 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSavingSettings ? "Saving..." : "Save Role Configurations"}
              </button>
            </div>
          </form>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium">No pending requests found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(requests || []).filter((req: any) => req !== null).map((req: any) => (
            <div key={req._id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#121623] p-6 transition-all hover:border-white/20 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  req.type === "Pic Perm" ? "bg-blue-400/10 text-blue-400" :
                  req.type === "Activity Perm" ? "bg-emerald-400/10 text-emerald-400" :
                  "bg-purple-400/10 text-purple-400"
                }`}>
                  {req.type === "Pic Perm" ? <Palette className="h-6 w-6" /> :
                   req.type === "Activity Perm" ? <Activity className="h-6 w-6" /> :
                   <ArrowUpRight className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{req.type || 'Request'}</h3>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      New Request
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#5865F2]" />
                      <span className="font-medium text-slate-200">{req.username || 'Unknown'}</span>
                      <span className="text-slate-600">({req.userId || 'No ID'})</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5 sm:pt-0 sm:border-0">
                <button
                  onClick={() => handleUpdateStatus(req._id, "rejected")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10 sm:flex-none"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(req._id, "approved")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 sm:flex-none"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
