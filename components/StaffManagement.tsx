"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Shield, User, ToggleLeft, ToggleRight } from "lucide-react";

export function StaffManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/staff-apps", { cache: "no-store" });
      const data = await res.json();
      if (data.applications && Array.isArray(data.applications)) {
        setApplications(data.applications.filter((a: any) => a !== null));
      }
      setIsEnabled(data.isEnabled);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApps = async () => {
    try {
      const res = await fetch("/api/admin/staff-apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: !isEnabled })
      });
      if (res.ok) setIsEnabled(!isEnabled);
    } catch (error) {
      console.error("Failed to toggle applications:", error);
    }
  };

  const handleDecision = async (id: string, status: "accepted" | "rejected") => {
    if (status === "rejected" && !rejectionReason) {
      setSelectedApp(id);
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff-apps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason })
      });
      if (res.ok) {
        setRejectionReason("");
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  if (loading) return <div className="text-white">Loading applications...</div>;

  return (
    <div className="space-y-6">
      {/* Toggle Control */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div>
          <h3 className="font-medium text-white">Application System</h3>
          <p className="text-xs text-slate-400">Enable or disable new staff applications</p>
        </div>
        <button 
          onClick={toggleApps}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            isEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {isEnabled ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
          {isEnabled ? "ENABLED" : "DISABLED"}
        </button>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.length === 0 && (
          <p className="text-center py-12 text-slate-500 italic bg-white/5 rounded-xl border border-white/10">
            No applications received yet.
          </p>
        )}
        {applications.map((app) => (
          <div key={app._id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#5865F2]" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{app.username}</h4>
                  <p className="text-xs text-slate-400">ID: {app.userId}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {app.status}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Real Age</p>
                <p className="text-white">{app.age}</p>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Target Department</p>
                <p className="text-[#5865F2] font-bold">{app.department}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/20">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Contribution Proposal</p>
              <p className="text-slate-300 whitespace-pre-wrap">{app.contribution}</p>
            </div>

            {app.status === "pending" && (
              <div className="flex flex-col gap-3 pt-2">
                {selectedApp === app._id && (
                  <input 
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDecision(app._id, "accepted")}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2.5 rounded-xl border border-emerald-500/20 transition-all font-bold text-xs"
                  >
                    <Check className="h-4 w-4" /> ACCEPT
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedApp === app._id) {
                        handleDecision(app._id, "rejected");
                      } else {
                        setSelectedApp(app._id);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl border border-red-500/20 transition-all font-bold text-xs"
                  >
                    <X className="h-4 w-4" /> {selectedApp === app._id ? "CONFIRM REJECT" : "REJECT"}
                  </button>
                </div>
              </div>
            )}
            {app.status === "rejected" && app.rejectionReason && (
              <p className="text-xs text-red-400 italic">Rejection Reason: {app.rejectionReason}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
