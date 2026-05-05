"use client";

import { useState } from "react";
import { LogoutButton } from "@/components/hwaya/LogoutButton";
import { RoleManagement } from "@/components/hwaya/RoleManagement";
import { TicketManagement } from "@/components/hwaya/TicketManagement";
import { 
  LayoutDashboard, 
  Settings2, 
  LifeBuoy, 
  UserPlus, 
  Shield, 
  Menu, 
  X, 
  Calendar,
  Gift,
  Bell,
  Activity,
  Trophy,
  Users,
  ChevronRight,
  Zap,
  Globe
} from "lucide-react";
import { StaffManagement } from "@/components/StaffManagement";
import { PermissionManagement } from "@/components/hwaya/PermissionManagement";
import { EventManagement } from "@/components/hwaya/EventManagement";
import { GiveawayManagement } from "@/components/hwaya/GiveawayManagement";
import { NotificationManagement } from "@/components/hwaya/NotificationManagement";

interface HwayaDashboardClientProps {
  insights: {
    totalMembers: string;
    onlineNow: string;
    topChampion: string;
    engagementScore: string;
  };
}

type TabId = "insights" | "roles" | "tickets" | "staff" | "permissions" | "events" | "giveaways" | "notifications";

export function HwayaDashboardClient({ insights }: HwayaDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("insights");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "insights", label: "Neural Insights", icon: Activity, color: "text-blue-400" },
    { id: "events", label: "Temporal Events", icon: Calendar, color: "text-emerald-400" },
    { id: "giveaways", label: "Strategic Gifts", icon: Gift, color: "text-purple-400" },
    { id: "notifications", label: "Global Uplink", icon: Bell, color: "text-amber-400" },
    { id: "roles", label: "Identity Forge", icon: Settings2, color: "text-[#D4AF37]" },
    { id: "tickets", label: "Support Nexus", icon: LifeBuoy, color: "text-rose-400" },
    { id: "staff", label: "Human Resources", icon: UserPlus, color: "text-cyan-400" },
    { id: "permissions", label: "Security Keys", icon: Shield, color: "text-indigo-400" },
  ];

  return (
    <div className="flex min-h-screen bg-[#05070a] text-slate-200 selection:bg-[#5865F2]/30">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0c14] border-r border-white/5 transition-transform duration-500 lg:relative lg:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full p-6">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-10 px-2 group cursor-default">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#5865F2] to-[#D4AF37] rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700" />
              <div className="relative h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e14] shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img 
                  src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
                  alt="Wisdom Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-white tracking-tighter leading-none uppercase italic">Wisdom</h2>
              <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mt-1 opacity-70">Overlord Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
            <div className="px-3 mb-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Core Modules</span>
            </div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabId); setIsMobileMenuOpen(false); }}
                className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-[#5865F2]/10 text-white border border-[#5865F2]/20 shadow-[0_0_20px_rgba(88,101,242,0.1)]"
                    : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 transition-colors ${activeTab === item.id ? item.color : "text-slate-600 group-hover:text-slate-400"}`} />
                  <span className="uppercase tracking-widest">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="h-3 w-3 text-[#5865F2]" />}
              </button>
            ))}
          </nav>

          {/* Footer Sidebar */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
            <div className="px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Network Status</span>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400/80 uppercase">Uplink Secured</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0c14]/80 px-6 lg:hidden sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10">
                <img src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" alt="Logo" className="h-full w-full object-cover" />
             </div>
             <span className="text-xs font-black text-white uppercase tracking-widest">Dashboard</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {activeTab === "insights" ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <div className="h-px w-8 bg-[#5865F2]" />
                       <span className="text-[10px] font-black text-[#5865F2] uppercase tracking-[0.5em]">Real-time Telemetry</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                      Neural <span className="text-blue-500">Insights</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium max-w-md">
                      Monitoring the intellectual pulse and strategic growth of the <span className="text-[#D4AF37]">Wisdom Circle</span> ecosystem.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
                     <Globe className="h-5 w-5 text-slate-600" />
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Last Sync</span>
                        <span className="text-xs font-mono text-white leading-none uppercase">System Synchronized</span>
                     </div>
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <InsightCard title="Total Scholars" value={insights.totalMembers} icon={<Users className="h-5 w-5" />} color="blue" />
                  <InsightCard title="Active Flux" value={insights.onlineNow} icon={<Activity className="h-5 w-5" />} color="emerald" />
                  <InsightCard title="Zenith Champion" value={insights.topChampion} icon={<Trophy className="h-5 w-5" />} color="amber" />
                  <InsightCard title="Strategic Pulse" value={insights.engagementScore} icon={<Zap className="h-5 w-5" />} color="purple" />
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                   <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0d0e14] to-[#05070a] p-10 transition-all hover:border-[#5865F2]/30 shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Activity className="h-32 w-32 text-[#5865F2]" />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Activity className="h-5 w-5 text-blue-400" />
                         </div>
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Growth Trajectory</h3>
                         <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            The ecosystem is experiencing a high-velocity increase in intellectual exchange. Membership retention has peaked at an all-time high of <span className="text-emerald-400">94.2%</span>.
                         </p>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-4/5 bg-gradient-to-r from-blue-600 to-cyan-400" />
                         </div>
                      </div>
                   </div>

                   <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0d0e14] to-[#05070a] p-10 transition-all hover:border-[#D4AF37]/30 shadow-2xl">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Shield className="h-32 w-32 text-[#D4AF37]" />
                      </div>
                      <div className="relative z-10 space-y-6">
                         <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                            <Shield className="h-5 w-5 text-[#D4AF37]" />
                         </div>
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Security Protocol</h3>
                         <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Automated moderation systems are operating at optimal efficiency. All strategic sectors are verified and secured against external interference.
                         </p>
                         <div className="flex gap-2">
                            {[1,2,3,4,5].map(i => <div key={i} className="h-1 flex-1 bg-[#D4AF37]/40 rounded-full" />)}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : activeTab === "events" ? (
              <EventManagement />
            ) : activeTab === "giveaways" ? (
              <GiveawayManagement />
            ) : activeTab === "notifications" ? (
              <NotificationManagement />
            ) : activeTab === "roles" ? (
              <RoleManagement />
            ) : activeTab === "tickets" ? (
              <TicketManagement />
            ) : activeTab === "staff" ? (
              <StaffManagement />
            ) : (
              <PermissionManagement />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InsightCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-transparent border-blue-500/20 text-blue-400",
    emerald: "from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/20 to-transparent border-amber-500/20 text-amber-400",
    purple: "from-purple-500/20 to-transparent border-purple-500/20 text-purple-400",
  };

  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border bg-[#0d0e14] p-8 transition-all duration-500 hover:scale-[1.02] shadow-xl ${colors[color]}`}>
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="relative z-10 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tighter uppercase italic">
          {value}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10" />
    </div>
  );
}
