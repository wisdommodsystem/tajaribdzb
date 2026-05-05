"use client";

import { useMemo, useState, useEffect } from "react";
import { UserRound, Shield, Palette, Gamepad2, Heart, Save, Tag, BarChart3, Users, Activity, Trophy, ArrowUpRight, LifeBuoy, Send, MessageSquare, LogOut, UserPlus, CheckCircle2, XCircle, Clock, Menu, X, Bell, Calendar as CalendarIcon, MapPin, Gift, ShieldCheck, EyeOff, FileWarning, Mic, Radio, AlertTriangle, Megaphone, AlertCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import type { DiscordMemberProfile } from "@/lib/discordMember";
import type { WebsiteInsights } from "@/lib/insights";
import { Leaderboard } from "@/components/wisdom/Leaderboard";

interface DiscordDashboardProps {
  profile: DiscordMemberProfile | null;
  insights: WebsiteInsights;
}

interface Category {
  _id: string;
  name: string;
}

interface CustomRole {
  _id: string;
  name: string;
  categoryId: Category | string;
  color: string;
}

type TabId = "profile" | "insights" | "support" | "leaderboard" | "apply" | "permissions" | "events" | "giveaways" | "rules";

function TabButton({ active, onClick, icon, label, color = "blue" }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color?: "blue" | "red" | "green" | "purple" | "amber" }) {
  const colors = {
    blue: "text-blue-400 border-blue-500 bg-blue-500/10",
    red: "text-red-400 border-red-500 bg-red-500/10",
    green: "text-emerald-400 border-green-500 bg-emerald-500/10",
    purple: "text-purple-400 border-purple-500 bg-purple-500/10",
    amber: "text-amber-400 border-amber-500 bg-amber-500/10",
  };

  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition-all duration-300 rounded-xl ${
        active
          ? `${colors[color]} font-bold shadow-sm`
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${active ? 'bg-white/10' : 'group-hover:bg-white/5'}`}>
        {icon}
      </div>
      <span className="text-sm font-medium tracking-tight">{label}</span>
      
      {active && (
        <div className={`absolute left-0 h-4 w-1 rounded-r-full bg-current`} />
      )}
    </button>
  );
}

export function DiscordDashboard({ profile, insights }: DiscordDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<CustomRole[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Permission Request State
  const [permRequests, setPermRequests] = useState<any[]>([]);
  const [isRequestingPerm, setIsRequestingPerm] = useState(false);

  // Staff Application State
  const [staffAppEnabled, setStaffAppEnabled] = useState(false);
  const [userStaffApp, setUserStaffApp] = useState<any>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appForm, setAppForm] = useState({
    age: "",
    contribution: "",
    department: "Verification Team" as "Verification Team" | "Event Hoster" | "Server Management"
  });

  // Ticket State
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ticketType, setTicketType] = useState<"Suggestions" | "Report" | "General">("General");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketInitialMsg, setTicketInitialMsg] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Events & Notifications State
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Giveaway State
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [isJoiningGiveaway, setIsJoiningGiveaway] = useState<string | null>(null);

  // Selected Notification for Modal
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  useEffect(() => {
    if (activeTab === "events") fetchEvents();
    if (activeTab === "giveaways") fetchGiveaways();
    fetchNotifications();
  }, [activeTab]);

  const fetchGiveaways = async () => {
    try {
      const res = await fetch("/api/giveaways", { cache: 'no-store' });
      const data = await res.json();
      // Fetch all giveaways (active and ended) for history if needed, 
      // but for now let's just make sure we handle the status correctly in the UI
      if (Array.isArray(data)) setGiveaways(data);
    } catch (error) {
      console.error("Failed to fetch giveaways:", error);
    }
  };

  const handleJoinGiveaway = async (giveawayId: string) => {
    setIsJoiningGiveaway(giveawayId);
    try {
      const res = await fetch("/api/giveaways", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Successfully joined the giveaway!");
        fetchGiveaways();
      } else {
        alert(data.error || "Failed to join giveaway");
      }
    } catch (error) {
      console.error("Failed to join giveaway:", error);
    } finally {
      setIsJoiningGiveaway(null);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events", { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        const validNotifications = data.filter(n => n !== null && typeof n === 'object');
        setNotifications(validNotifications);
        // An unread notification is one where the user's Discord ID is NOT in the readBy array
        const unread = validNotifications.filter((n: any) => !n.readBy?.includes(profile?.id)).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      if (id) {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: id }),
          cache: "no-store"
        });
      } else {
        // Mark all as read logic - loop through unread and mark them
        const unread = notifications.filter((n: any) => n !== null && !n.readBy?.includes(profile?.id));
        await Promise.all(unread.map(n => 
          fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: n._id }),
            cache: "no-store"
          })
        ));
      }
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };


  const joinedDate = useMemo(() => {
    if (!profile?.joinedAt) {
      return "Unknown";
    }
    return new Date(profile.joinedAt).toLocaleDateString();
  }, [profile?.joinedAt]);

  useEffect(() => {
    if (profile) {
      fetchCategories();
      fetchAvailableRoles();
      fetchUserSelectedRoles();
      fetchUserTickets();
      fetchStaffAppStatus();
      fetchPermRequests();
    }
  }, [profile]);

  const fetchPermRequests = async () => {
    try {
      const res = await fetch("/api/user/permissions", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setPermRequests(data.filter(r => r !== null));
    } catch (error) {
      console.error("Failed to fetch permission requests:", error);
    }
  };

  const handleRequestPerm = async (type: string) => {
    setIsRequestingPerm(true);
    try {
      const res = await fetch("/api/user/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Request for ${type} submitted successfully!`);
        fetchPermRequests();
      } else {
        alert(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Failed to request permission:", error);
    } finally {
      setIsRequestingPerm(false);
    }
  };

  const fetchStaffAppStatus = async () => {
    try {
      const res = await fetch("/api/user/apply", { cache: "no-store" });
      const data = await res.json();
      setStaffAppEnabled(data.isEnabled);
      setUserStaffApp(data.application);
    } catch (error) {
      console.error("Failed to fetch staff app status:", error);
    }
  };

  const handleApplyStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingApp(true);
    try {
      const res = await fetch("/api/user/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appForm)
      });
      if (res.ok) {
        fetchStaffAppStatus();
      }
    } catch (error) {
      console.error("Failed to submit staff application:", error);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  useEffect(() => {
    if (activeTicket) {
      fetchTicketMessages(activeTicket._id);
      const interval = setInterval(() => fetchTicketMessages(activeTicket._id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeTicket]);

  useEffect(() => {
    if (activeTab === "leaderboard" && leaderboard.length === 0) {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await fetch("/api/user/leaderboard", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setLeaderboard(data.filter(l => l !== null));
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const res = await fetch("/api/user/tickets", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data.filter(t => t !== null));
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/messages?ticketId=${ticketId}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data.filter(m => m !== null));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTicket(true);
    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: ticketType,
          subject: ticketSubject,
          message: ticketInitialMsg
        })
      });
      if (res.ok) {
        setTicketSubject("");
        setTicketInitialMsg("");
        fetchUserTickets();
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket) return;

    try {
      const res = await fetch("/api/tickets/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeTicket._id,
          content: newMessage,
          senderId: profile?.username || "user",
          senderName: profile?.displayName || "User"
        })
      });
      if (res.ok) {
        setNewMessage("");
        fetchTicketMessages(activeTicket._id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        const validCats = data
          .filter(c => c !== null && typeof c === 'object' && c._id)
          .map(c => ({
            ...c,
            name: c.name || 'Unnamed Category'
          }));
        setCategories(validCats);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchAvailableRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles", { cache: "no-store" });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format");
      }
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const validRoles = data
          .filter((r: any) => r !== null && typeof r === 'object')
          .map((role: any) => {
            let cat = role.categoryId;
            if (!cat || typeof cat !== 'object') {
              cat = { name: 'Uncategorized', _id: 'none' };
            }
            return {
              ...role,
              name: role.name || 'Unnamed Role',
              categoryId: cat
            };
          });
        setAvailableRoles(validRoles);
      } else {
        setAvailableRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch available roles:", error);
      setAvailableRoles([]);
    }
  };

  const fetchUserSelectedRoles = async () => {
    try {
      const res = await fetch("/api/user/profile/roles", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSelectedRoleIds(data.filter(r => r !== null).map((r: any) => r._id));
      }
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
    }
  };

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSaveRoles = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleIds: selectedRoleIds }),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        // Refresh the page to get the latest roles from Discord
        window.location.reload();
      } else {
        const error = await res.json();
        alert(`Failed to sync roles: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to save roles:", error);
      alert("An error occurred while saving roles.");
    } finally {
      setIsSaving(false);
    }
  };

  const rolesByCategory = useMemo(() => {
    const grouped: Record<string, CustomRole[]> = {};
    const validCategories = (categories || []).filter(cat => cat && typeof cat === 'object' && cat._id);
    const validRoles = (availableRoles || []).filter(role => role !== null && typeof role === 'object');
    
    validCategories.forEach(cat => {
      grouped[cat._id] = validRoles.filter(role => {
        // فحص دفاعي صارم لـ categoryId
        const catObj = role.categoryId;
        const roleCatId = (catObj && typeof catObj === 'object') 
          ? (catObj._id || null) 
          : catObj;
        
        return roleCatId === cat._id;
      });
    });
    return grouped;
  }, [availableRoles, categories]);

  const visibleCategories = useMemo(() => {
    return (categories || []).filter(cat => 
      cat && typeof cat === 'object' && cat._id && rolesByCategory[cat._id] && rolesByCategory[cat._id].length > 0
    );
  }, [categories, rolesByCategory]);

  return (
    <div className="flex min-h-screen bg-void flex-col md:flex-row">
      {/* Mobile Top Bar */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-[#1a1c23] px-6 md:hidden fixed top-0 left-0 right-0 z-[100] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative group/logo">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#5865F2] to-[#D4AF37] rounded-lg blur-[2px] opacity-20" />
              <div className="relative h-9 w-9 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-[#1a1c23]">
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
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${
                  showNotifications 
                    ? "bg-blue-500/10 text-blue-400" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-swing" : ""}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white border-2 border-[#1a1c23]">
                    {unreadCount > 9 ? "+9" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 bg-[#0d0e14] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[150] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Broadcasts</h4>
                    </div>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center">
                        <p className="text-[10px] font-bold text-slate-600 uppercase italic">No transmissions</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = !n.readBy?.includes(profile?.id);
                        return (
                          <div 
                            key={n._id} 
                            className={`p-4 transition-all duration-300 cursor-pointer ${isUnread ? 'bg-blue-500/[0.02]' : 'opacity-60'}`}
                            onClick={() => {
                              setSelectedNotification(n);
                              if (isUnread) markAsRead(n._id);
                            }}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <span className="text-xs font-black text-white uppercase truncate">{n.title}</span>
                              <span className="text-[8px] text-slate-600 italic whitespace-nowrap">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-2">{n.message}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#1a1c23] border-r border-white/[0.05] transition-transform duration-300 z-[120] md:relative md:translate-x-0 md:flex md:h-screen md:sticky md:top-0 flex-col ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar px-2">
          <div className="flex items-center justify-between px-4 mb-3">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Menu</p>
          </div>
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => { setActiveTab("profile"); setIsMobileMenuOpen(false); }} 
            icon={<UserRound className="h-4 w-4" />} 
            label="Home" 
            color="green"
          />
          <TabButton 
            active={activeTab === "rules"} 
            onClick={() => { setActiveTab("rules"); setIsMobileMenuOpen(false); }} 
            icon={<ShieldCheck className="h-4 w-4" />} 
            label="Rules" 
            color="amber"
          />
          <TabButton 
            active={activeTab === "giveaways"} 
            onClick={() => { setActiveTab("giveaways"); setIsMobileMenuOpen(false); }} 
            icon={<Gift className="h-4 w-4" />} 
            label="Giveaways" 
            color="purple"
          />
          <TabButton 
            active={activeTab === "events"} 
            onClick={() => { setActiveTab("events"); setIsMobileMenuOpen(false); }} 
            icon={<CalendarIcon className="h-4 w-4" />} 
            label="Events" 
            color="amber"
          />
          <TabButton 
            active={activeTab === "leaderboard"} 
            onClick={() => { setActiveTab("leaderboard"); setIsMobileMenuOpen(false); }} 
            icon={<Trophy className="h-4 w-4" />} 
            label="Leaderboard" 
            color="red"
          />
          <TabButton 
            active={activeTab === "insights"} 
            onClick={() => { setActiveTab("insights"); setIsMobileMenuOpen(false); }} 
            icon={<BarChart3 className="h-4 w-4" />} 
            label="Activity" 
            color="blue"
          />
          <TabButton 
            active={activeTab === "support"} 
            onClick={() => { setActiveTab("support"); setIsMobileMenuOpen(false); }} 
            icon={<LifeBuoy className="h-4 w-4" />} 
            label="Support" 
            color="amber"
          />
          
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-6 mb-3">Staff</p>
          <TabButton 
            active={activeTab === "apply"} 
            onClick={() => { setActiveTab("apply"); setIsMobileMenuOpen(false); }} 
            icon={<UserPlus className="h-4 w-4" />} 
            label="Applications" 
            color="purple"
          />
          <TabButton 
            active={activeTab === "permissions"} 
            onClick={() => { setActiveTab("permissions"); setIsMobileMenuOpen(false); }} 
            icon={<Shield className="h-4 w-4" />} 
            label="Permissions" 
            color="blue"
          />
        </nav>

        {/* Profile Footer (as seen in image) */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl mb-4 mx-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex-shrink-0 overflow-hidden border border-white/10">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white uppercase">
                    {profile?.displayName[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{profile?.displayName || 'Entity'}</span>
                <span className="text-[9px] text-slate-500 truncate">@{profile?.username || 'scholar'}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-500 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-white/[0.05] bg-[#1a1c23]/50 backdrop-blur-md px-12 z-[90]">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Link Active</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${
                  showNotifications 
                    ? "bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-swing" : ""}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white border-2 border-[#1a1c23] shadow-lg">
                    {unreadCount > 9 ? "+9" : unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-[#0d0e14] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Transmission Log</h4>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => markAsRead()}
                        className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/[0.03]">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto opacity-20">
                          <Bell className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Static silence...</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = !n.readBy?.includes(profile?.id);
                        return (
                          <div 
                            key={n._id} 
                            className={`p-5 transition-all duration-300 cursor-pointer group hover:bg-white/[0.03] ${isUnread ? 'bg-blue-500/[0.02]' : 'opacity-60'}`}
                            onClick={() => {
                              setSelectedNotification(n);
                              if (isUnread) markAsRead(n._id);
                            }}
                          >
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  {isUnread && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                  <span className="text-xs font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                                    {n.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                                    n.type === 'Alert' ? 'bg-red-500/10 text-red-400' :
                                    n.type === 'Event' ? 'bg-amber-500/10 text-amber-400' :
                                    n.type === 'Gift' ? 'bg-purple-500/10 text-purple-400' :
                                    'bg-blue-500/10 text-blue-400'
                                  }`}>
                                    {n.type}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-slate-600 whitespace-nowrap mt-0.5 tracking-tighter uppercase italic">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                              {n.message}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 bg-void p-4 pt-20 md:p-12 md:pt-12 transition-all duration-1000 overflow-y-auto custom-scrollbar">
        {activeTab === "rules" && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            {/* Header - Inspired by Image Aesthetic */}
            <div className="relative overflow-hidden rounded-[3rem] bg-[#0d0e14] border border-white/5 p-12 text-center shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50" />
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[80px] rounded-full" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Official Server Policies</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                    Wisdom <span className="text-blue-500">Circle</span>
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto border-t border-white/5 pt-6">
                    Membership in this server requires strict adherence to our regulations. <br />
                    Administrative action will be taken against any violators.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 py-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">"Give Respect, Get Respect"</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
                </div>
              </div>
            </div>

            {/* Rules List - Inspired by Numbered List in Image */}
            <div className="space-y-4">
              {[
                { 
                  id: "1", 
                  title: "INTEGRITY", 
                  desc: "Treat every member with respect. No insults, slurs, or harassment.",
                  icon: ShieldCheck,
                  color: "blue"
                },
                { 
                  id: "2", 
                  title: "CIVIL DISCOURSE", 
                  desc: "Avoid toxicity and escalating conflicts. Maintain a philosophical environment.",
                  icon: MessageSquare,
                  color: "purple"
                },
                { 
                  id: "3", 
                  title: "NO NSFW", 
                  desc: "Explicit or adult content is strictly prohibited. Keep the sanctuary clean.",
                  icon: EyeOff,
                  color: "red"
                },
                { 
                  id: "4", 
                  title: "LEGALITY", 
                  desc: "No discussions of illegal activities, hacking, or fraud. Follow global laws.",
                  icon: FileWarning,
                  color: "amber"
                },
                { 
                  id: "5", 
                  title: "SPAM CONTROL", 
                  desc: "No flood-messaging or unnecessary mentions. Respect the focus of others.",
                  icon: Bell,
                  color: "blue"
                },
                { 
                  id: "6", 
                  title: "PRIVACY", 
                  desc: "Sharing others' personal data (doxing) leads to a permanent ban.",
                  icon: Shield,
                  color: "red"
                },
                { 
                  id: "7", 
                  title: "VOICE ETIQUETTE", 
                  desc: "No voice changers or soundboard abuse in public voice channels.",
                  icon: Mic,
                  color: "purple"
                },
                { 
                  id: "8", 
                  title: "CONSENT", 
                  desc: "Recording voice calls without permission is forbidden. Privacy is key.",
                  icon: Radio,
                  color: "amber"
                }
              ].map((rule) => (
                <div key={rule.id} className="group relative flex items-center gap-6 p-6 rounded-[2rem] bg-[#0d0e14] border border-white/5 transition-all duration-500 hover:border-blue-500/30 hover:bg-white/[0.03] overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${rule.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-slate-700 italic group-hover:text-blue-500 transition-colors">
                      {rule.id}.
                    </span>
                    <div className={`p-3 rounded-2xl bg-${rule.color}-500/10 border border-${rule.color}-500/20 group-hover:scale-110 transition-transform`}>
                      <rule.icon className={`h-6 w-6 text-${rule.color}-400`} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-wider">{rule.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{rule.desc}</p>
                  </div>

                  <div className="hidden md:block opacity-0 group-hover:opacity-10 transition-opacity absolute right-8">
                    <rule.icon className="h-24 w-24 text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 text-center relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-[0.2em] italic">Final Notice</h3>
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
                    Staff reserve the right to interpret and enforce these rules at their discretion. 
                    Respect is the cornerstone of our community.
                  </p>
                  <div className="pt-4 flex justify-center gap-8">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">© 2026 Wisdom Circle</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Protocol Version 1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Wisdom Circle Profile
              </h1>
              <p className="mt-1 text-sm text-slate-300">
                Your identity and roles inside Wisdom Circle.
              </p>
            </div>

            {profile ? (
              <>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101523]">
                  {/* Banner Section */}
                  <div className="relative h-32 w-full bg-[#1a1f33]">
                    {profile.bannerUrl ? (
                      <img
                        src={profile.bannerUrl}
                        alt="Profile Banner"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-r from-[#5865F2]/20 to-[#D4AF37]/20" />
                    )}
                    
                    {/* Avatar Overlap */}
                    <div className="absolute -bottom-8 left-6">
                      {profile.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt={profile.displayName}
                          className="h-20 w-20 rounded-full border-4 border-[#101523] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#101523] bg-[#5865F2] text-2xl font-bold text-white">
                          {profile.displayName[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-10">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">
                          {profile.displayName}
                        </h2>
                        <span className="text-xs text-slate-500 font-mono">
                          ID: {profile.id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">@{profile.username}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Joined server: {joinedDate}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-white/5 pt-6">
                      <p className="mb-3 inline-flex items-center gap-2 text-sm text-slate-300">
                        <Shield className="h-4 w-4 text-[#D4AF37]" />
                        Server Roles
                      </p>

                      {profile.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                      {(profile?.roles || []).filter((r: any) => r !== null).map((role: any) => (
                        <span
                          key={role.id || Math.random().toString()}
                          className="rounded-full border border-white/15 px-3 py-1 text-sm transition-colors hover:bg-white/5"
                          style={{ color: role.color || '#9ca3af' }}
                        >
                          {role.name || 'Unknown'}
                        </span>
                      ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No roles found.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customize Profile Section */}
                <div className="rounded-2xl border border-white/10 bg-[#101523] p-5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-medium text-white">Customize your profile</h2>
                      <p className="text-xs text-slate-400">Select roles to display on your profile</p>
                    </div>
                    <button
                      onClick={handleSaveRoles}
                      disabled={isSaving}
                      className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-xs font-medium text-white hover:bg-[#4752c4] disabled:opacity-50 transition"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {visibleCategories.map((category) => (
                      <div key={category._id}>
                        <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
                          <Tag className="h-3.5 w-3.5" />
                          {category.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(rolesByCategory[category._id] || []).map((role) => (
                            <RoleBadge
                              key={role._id}
                              role={role}
                              isSelected={selectedRoleIds.includes(role._id)}
                              onClick={() => handleToggleRole(role._id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {visibleCategories.length === 0 && (
                      <p className="text-sm text-slate-500 italic">No customization categories available.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
                <p className="text-slate-400">Loading profile data...</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "permissions" && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">Permission Request Center</h1>
              <p className="text-sm text-slate-400">Request special permissions to enhance your strategic presence.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { type: "Pic Perm", icon: Palette, color: "text-blue-400", bg: "bg-blue-400/10", desc: "Share images and strategic visual data." },
                { type: "Activity Perm", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "Showcase your real-time activities." },
                { type: "Link Perm", icon: ArrowUpRight, color: "text-purple-400", bg: "bg-purple-400/10", desc: "Share external strategic resources." }
              ].map((perm) => {
                const existing = permRequests.find(r => r.type === perm.type);
                const isPending = existing?.status === "pending";
                const isApproved = existing?.status === "approved";

                return (
                  <div key={perm.type} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121623] p-6 transition-all hover:border-white/20">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${perm.bg} ${perm.color}`}>
                      <perm.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">{perm.type}</h3>
                    <p className="mb-6 text-xs leading-relaxed text-slate-400">{perm.desc}</p>
                    
                    {isApproved ? (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        GRANTED
                      </div>
                    ) : (
                      <button
                        disabled={isPending || isRequestingPerm}
                        onClick={() => handleRequestPerm(perm.type)}
                        className={`w-full rounded-lg py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
                          isPending 
                            ? "bg-amber-500/10 text-amber-500 cursor-default"
                            : "bg-white/5 text-white hover:bg-[#5865F2] hover:text-white"
                        }`}
                      >
                        {isPending ? "PENDING REVIEW" : "REQUEST PERM"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {permRequests.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#121623] overflow-hidden">
                <div className="border-b border-white/5 bg-white/5 px-6 py-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Request History</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {permRequests.map((req) => (
                    <div key={req._id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          req.type === "Pic Perm" ? "bg-blue-400/10 text-blue-400" :
                          req.type === "Activity Perm" ? "bg-emerald-400/10 text-emerald-400" :
                          "bg-purple-400/10 text-purple-400"
                        }`}>
                          {req.type === "Pic Perm" ? <Palette className="h-4 w-4" /> :
                           req.type === "Activity Perm" ? <Activity className="h-4 w-4" /> :
                           <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{req.type}</p>
                          <p className="text-[10px] text-slate-500">{new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        req.status === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                        req.status === "rejected" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-500"
                      }`}>
                        {req.status === "pending" && <Clock className="h-3 w-3" />}
                        {req.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                        {req.status === "rejected" && <XCircle className="h-3 w-3" />}
                        {req.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase italic bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Community Insights</h1>
                <p className="mt-2 text-sm text-slate-400 font-medium">
                  Advanced metrics and strategic data from the <span className="text-[#D4AF37]">Wisdom Circle</span> ecosystem.
                </p>
              </div>
              <a 
                href="https://malahida.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Main Website</span>
                  <span className="text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors">malahida.com</span>
                </div>
                <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="h-5 w-5 text-[#D4AF37]" />
                </div>
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <InsightCard 
                title="Strategic Members" 
                value={insights.totalMembers} 
                icon={<Users className="h-5 w-5 text-blue-400" />}
                trend="+12% this month"
              />
              <InsightCard 
                title="Active Scholars" 
                value={insights.onlineNow} 
                icon={<Activity className="h-5 w-5 text-emerald-400" />}
                trend="Real-time dialogue"
              />
              <InsightCard 
                title="Grand Champion" 
                value={insights.topChampion} 
                icon={<Trophy className="h-5 w-5 text-amber-400" />}
                trend="Leaderboard peak"
              />
              <InsightCard 
                title="Collective Wisdom" 
                value={insights.engagementScore} 
                icon={<BarChart3 className="h-5 w-5 text-purple-400" />}
                trend="Community pulse"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151a2b] to-[#0a0e1a] p-8 transition-all hover:border-[#D4AF37]/30">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Shield className="h-24 w-24 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-4">Strategic Mission</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Wisdom Circle isn't just a community; it's a strategic platform dedicated to intellectual growth and critical analysis. Our mission is to provide the tools and environment for profound dialogue.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                  <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.3em]">Foundation</span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151a2b] to-[#0a0e1a] p-8 transition-all hover:border-[#5865F2]/30">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="h-24 w-24 text-[#5865F2]" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-4">Community Pulse</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every interaction within our ecosystem contributes to a larger pool of collective insights. From mentorship sessions to event hosting, your presence shapes the future of the platform.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#5865F2]/40 to-transparent" />
                  <span className="text-[10px] text-[#5865F2] font-black uppercase tracking-[0.3em]">Evolution</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 mb-4">
                  <ArrowUpRight className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Rising Momentum</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
                  The community is showing strong growth in active dialogues and mentorship sessions. Keep contributing to raise the collective wisdom!
                </p>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <div className="p-4 rounded-2xl bg-[#0a0e1a] border border-white/5 flex items-center justify-between min-w-[280px]">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Growth Rate</span>
                  <span className="text-emerald-400 font-black tracking-tighter">+24.8%</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0a0e1a] border border-white/5 flex items-center justify-between min-w-[280px]">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Engagement</span>
                  <span className="text-blue-400 font-black tracking-tighter">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        ) }
        {activeTab === "support" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl font-semibold text-white">Support & Report</h1>
              <p className="mt-1 text-sm text-slate-300">
                Open a ticket to contact our administrative team.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              {/* Left Side: Ticket Chat or Create Form */}
              <div className="rounded-2xl border border-white/10 bg-[#101523] p-6 min-h-[500px] flex flex-col">
                {activeTicket ? (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setActiveTicket(null)}
                          className="text-slate-400 hover:text-white transition"
                        >
                          ←
                        </button>
                        <div>
                          <h3 className="font-medium text-white">{activeTicket.subject}</h3>
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${
                            activeTicket.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {activeTicket.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-[#0a0e1a]/50 rounded-xl custom-scrollbar">
                      {messages.map((msg, i) => (
                        <div 
                          key={i} 
                          className="flex items-start gap-3 group hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded-lg transition-colors"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {msg.senderId === 'admin' ? (
                              <img 
                                src="https://i.postimg.cc/m2tZ8HQj/joulaybib-3ryan-a77.gif" 
                                alt="Wisdom AI" 
                                className="h-10 w-10 rounded-full border border-purple-500/30 object-cover"
                              />
                            ) : (
                              profile?.avatarUrl ? (
                                <img 
                                  src={profile.avatarUrl} 
                                  alt={msg.senderName} 
                                  className="h-10 w-10 rounded-full border border-white/10 object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center text-sm font-bold text-white uppercase">
                                  {msg.senderName[0]}
                                </div>
                              )
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-sm font-semibold ${msg.senderId === 'admin' ? 'text-purple-400' : 'text-white'}`}>
                                {msg.senderId === 'admin' ? 'Wisdom AI' : msg.senderName}
                              </span>
                              {msg.senderId === 'admin' && (
                                <span className="bg-[#5865F2] text-[10px] text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                  <Shield className="h-2.5 w-2.5" />
                                  BOT
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-medium">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed break-words">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {activeTicket.status === "Open" ? (
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-[#5865F2] p-2.5 text-white hover:bg-[#4752c4] transition"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-slate-500 italic">This ticket is closed and read-only.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleCreateTicket} className="space-y-4 flex-1">
                    <h3 className="text-lg font-medium text-white mb-4">Open a new Ticket</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Issue Category</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "Suggestions", label: "Idea", icon: Palette, color: "blue" },
                            { id: "Report", label: "Alert", icon: FileWarning, color: "red" },
                            { id: "General", label: "Inquiry", icon: MessageSquare, color: "purple" }
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setTicketType(type.id as any)}
                              className={`relative group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                                ticketType === type.id 
                                  ? `bg-${type.color}-500/20 border-${type.color}-500/50 shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
                                  : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                                ticketType === type.id ? `bg-${type.color}-500/20` : "bg-white/5"
                              }`}>
                                <type.icon className={`h-5 w-5 ${ticketType === type.id ? `text-${type.color}-400` : "text-slate-400"}`} />
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${
                                ticketType === type.id ? `text-${type.color}-400` : "text-slate-500"
                              }`}>
                                {type.label}
                              </span>
                              {ticketType === type.id && (
                                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full bg-${type.color}-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-[#101523] animate-in zoom-in`} />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                        <input 
                          type="text"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="What is this about?"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2] transition-colors placeholder:text-slate-600"
                          required
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Message</label>
                        <textarea 
                          value={ticketInitialMsg}
                          onChange={(e) => setTicketInitialMsg(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          className="w-full h-40 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2] resize-none transition-colors placeholder:text-slate-600"
                          required
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isCreatingTicket}
                      className="w-full mt-6 group relative overflow-hidden rounded-xl bg-[#5865F2] py-4 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#4752c4] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                    >
                      <span className="relative z-10">{isCreatingTicket ? "Transmitting..." : "Submit Ticket"}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                  </form>
                )}
              </div>

              {/* Right Side: Ticket History */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Your Recent Tickets
                </h3>
                <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket._id}
                      onClick={() => setActiveTicket(ticket)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        activeTicket?._id === ticket._id 
                          ? 'bg-[#5865F2]/10 border-[#5865F2]/50' 
                          : 'bg-[#151a2b] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37]">{ticket.type}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          ticket.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white truncate">{ticket.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-2">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                  {tickets.length === 0 && (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-white/5 bg-white/2">
                      <p className="text-xs text-slate-600">No tickets yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "leaderboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Leaderboard />
          </div>
        )}

        {activeTab === "giveaways" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-20 px-4">
            {/* Header Section - Modern Sleek */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Lucky <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Giveaways</span>
              </h1>
              <p className="text-slate-500 text-sm md:text-base font-medium tracking-wide">
                Challenge your luck and win strategic rewards
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1">
              {giveaways.length === 0 ? (
                <div className="rounded-[2.5rem] border border-white/5 bg-[#0d0e14] p-24 text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50" />
                  <div className="relative z-10">
                    <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
                      <Gift className="h-10 w-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-400">No Active Giveaways</h3>
                    <p className="text-slate-600 mt-2">The treasury is currently being replenished.</p>
                  </div>
                </div>
              ) : (
                giveaways.map((giveaway) => {
                  const hasJoined = giveaway.participants?.some((p: any) => p.discordId === profile?.id);
                  const isEndingSoon = new Date(giveaway.endDate).getTime() - new Date().getTime() < 86400000;
                  const isEnded = giveaway.status === "Ended";

                  return (
                    <div key={giveaway._id} className={`relative group rounded-[3rem] border transition-all duration-700 overflow-hidden min-h-[500px] ${
                      isEnded 
                        ? "bg-[#05060a] border-white/5 grayscale-[0.5] opacity-80" 
                        : "bg-[#0a0b10] border-white/[0.03] hover:border-blue-500/30 hover:shadow-[0_0_50px_rgba(59,130,246,0.15)]"
                    }`}>
                      {/* Full Background Image Layer */}
                      {giveaway.imageUrl && (
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={giveaway.imageUrl} 
                            alt="" 
                            className={`h-full w-full object-cover transition-all duration-1000 ${isEnded ? 'opacity-10' : 'opacity-40 group-hover:opacity-60 group-hover:scale-105'}`}
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-b from-[#0a0b10]/40 via-[#0a0b10]/80 to-[#0a0b10]`} />
                        </div>
                      )}

                      <div className="relative z-10 p-8 md:p-12">
                        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                          {/* Left Column: Stats & Info */}
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-3xl bg-white/[0.03] border border-white/[0.05] p-6 backdrop-blur-md relative group/card overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-20 transition-opacity">
                                  <Trophy className="h-12 w-12 text-blue-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Prize Pool</span>
                                <div className="text-3xl font-bold text-white tracking-tight">{giveaway.prize}</div>
                                <div className="mt-1 text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                                  {isEnded ? "Final Reward" : "Guaranteed Reward"}
                                </div>
                              </div>
                              <div className="rounded-3xl bg-white/[0.03] border border-white/[0.05] p-6 backdrop-blur-md relative group/card overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-20 transition-opacity">
                                  <Users className="h-12 w-12 text-purple-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Entries</span>
                                <div className="text-3xl font-bold text-white tracking-tight">{giveaway.participants?.length || 0}</div>
                                <div className="mt-1 text-[10px] text-purple-400 font-bold uppercase tracking-tighter">Scholars Joined</div>
                              </div>
                            </div>

                            <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-sm space-y-6">
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Giveaway Details</span>
                                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{giveaway.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                  {giveaway.description}
                                </p>
                              </div>

                              {isEnded && giveaway.winners?.length > 0 ? (
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Victory Protocol: Winners</span>
                                  <div className="flex flex-wrap gap-4">
                                    {giveaway.winners.map((winner: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
                                        <img src={winner.avatar || `https://ui-avatars.com/api/?name=${winner.username}`} className="h-8 w-8 rounded-full border border-emerald-500/30" alt="" />
                                        <span className="text-sm font-black text-white">{winner.username}</span>
                                        <Trophy className="h-4 w-4 text-emerald-400" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="pt-6 border-t border-white/5 flex items-center gap-6">
                                  <div className="flex -space-x-3">
                                    {giveaway.participants?.slice(0, 5).map((p: any, i: number) => (
                                      <img 
                                        key={i} 
                                        src={p.avatar || `https://ui-avatars.com/api/?name=${p.username}`} 
                                        className="h-10 w-10 rounded-full border-2 border-[#0a0b10] shadow-2xl transition-transform hover:scale-110 hover:z-10" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                    ))}
                                    {giveaway.participants?.length > 5 && (
                                      <div className="h-10 w-10 rounded-full bg-[#1a1c23] border-2 border-[#0a0b10] flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        +{giveaway.participants.length - 5}
                                      </div>
                                    )}
                                  </div>
                                  <div className="h-10 w-px bg-white/5" />
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Top Candidates</span>
                                    <span className="text-[10px] text-slate-500">Joined the protocol recently</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Interaction Card */}
                          <div className={`rounded-[2.5rem] border p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between ${
                            isEnded ? "bg-black/40 border-white/5" : "bg-[#0d0e14] border-white/10"
                          }`}>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12">
                              <Gift className="h-48 w-48 text-white" />
                            </div>

                            <div className="space-y-8 relative z-10">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Status</span>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                                  isEnded 
                                    ? "bg-slate-500/10 border-slate-500/20" 
                                    : "bg-blue-500/10 border-blue-500/20"
                                }`}>
                                  <div className={`h-1.5 w-1.5 rounded-full ${isEnded ? 'bg-slate-500' : 'bg-blue-400 animate-pulse'}`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isEnded ? 'text-slate-500' : 'text-blue-400'}`}>
                                    {isEnded ? 'Archived' : 'Active'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {isEnded ? "Ended On" : "Time Remaining"}
                                  </span>
                                  <span className={`text-sm font-bold ${isEndingSoon && !isEnded ? 'text-red-400' : 'text-slate-300'}`}>
                                    {new Date(giveaway.endDate).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r transition-all duration-1000 ${
                                      isEnded ? 'from-slate-700 to-slate-800 w-full' : 'from-blue-500 to-purple-600 w-[70%]'
                                    } ${isEndingSoon && !isEnded ? 'animate-pulse' : ''}`}
                                  />
                                </div>
                              </div>

                              <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Winners Count</span>
                                  <span className="text-white font-bold">{giveaway.winnersCount || 1}</span>
                                </div>
                                {!isEnded && (
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">Your Chance</span>
                                    <span className="text-blue-400 font-bold">
                                      {giveaway.participants?.length > 0 
                                        ? `${((giveaway.winnersCount || 1) / giveaway.participants.length * 100).toFixed(1)}%`
                                        : '100%'
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-8 relative z-10">
                              {isEnded ? (
                                <div className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 text-xs font-black uppercase tracking-[0.3em]">
                                  <XCircle className="h-4 w-4" />
                                  Protocol Closed
                                </div>
                              ) : hasJoined ? (
                                <div className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.3em]">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Joined
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleJoinGiveaway(giveaway._id)}
                                  disabled={isJoiningGiveaway === giveaway._id}
                                  className="group/btn w-full relative flex items-center justify-center gap-3 bg-white text-black hover:bg-blue-50 px-6 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-50 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                  {isJoiningGiveaway === giveaway._id ? "Processing..." : "Join Now"}
                                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-20 px-4">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-[3rem] bg-[#0d0e14] border border-white/5 p-12 text-center shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50" />
              <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-500/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[80px] rounded-full" />
              
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Live Strategic Calendar</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                    Strategic <span className="text-blue-500">Pulse</span>
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto border-t border-white/5 pt-6">
                    Participate in exclusive intellectual sessions, high-level lectures, and community dialogues.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 py-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Collective Immersion</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {events.length === 0 ? (
                <div className="md:col-span-2 rounded-[3rem] border-2 border-dashed border-white/5 p-24 text-center bg-white/[0.01] backdrop-blur-sm">
                  <div className="h-24 w-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
                    <CalendarIcon className="h-12 w-12 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tight">Synchronizing Events...</h3>
                  <p className="text-base text-slate-600 mt-3 font-medium">The collective is currently preparing new intellectual sessions.</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event._id} className="group relative flex flex-col rounded-[2.5rem] border border-white/10 bg-[#11131c] transition-all duration-500 hover:border-[#D4AF37]/40 hover:bg-[#151825] hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Event Header with Date Box */}
                    <div className="p-8 border-b border-white/[0.03] flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-3">
                        <div className={`inline-flex w-fit px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border ${
                          event.type === 'Lecture' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          event.type === 'Discussion' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                        }`}>
                          {event.type}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                          {event.title}
                        </h3>
                      </div>
                      <div className="h-20 w-20 rounded-[1.5rem] bg-[#D4AF37] flex flex-col items-center justify-center text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex-shrink-0 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <span className="text-[12px] font-black leading-none uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-4xl font-black leading-none mt-1">{new Date(event.date).getDate()}</span>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-8 flex-1 space-y-8">
                      <p className="text-base text-slate-400 leading-relaxed font-medium line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Time</span>
                          <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <Clock className="h-4 w-4 text-[#D4AF37]" />
                            <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Sector</span>
                          <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <MapPin className="h-4 w-4 text-[#D4AF37]" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-8 pt-0 mt-auto flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-slate-600">
                        <Shield className="h-5 w-5 opacity-40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Clearance Active</span>
                      </div>

                      <a 
                        href={event.eventUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(88,101,242,0.2)] transition-all active:scale-95 group/btn"
                      >
                        Join Session
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Participation Protocol */}
            <div className="rounded-[3rem] border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
              <div className="h-20 w-20 rounded-[2rem] bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <Shield className="h-10 w-10 text-[#D4AF37]" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Community Engagement Protocol</h4>
                <p className="text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed">
                  Scholars are required to maintain high standards of critical thinking and mutual respect. Arrive 5 minutes early for profound immersion.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "apply" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-2xl font-semibold text-white">Staff Application</h1>
              <p className="mt-1 text-sm text-slate-300">
                Join our management team and help shape the Wisdom Circle.
              </p>
            </div>

            {userStaffApp ? (
              <div className="rounded-2xl border border-white/10 bg-[#101523] p-8 text-center space-y-4">
                {userStaffApp.status === "pending" && (
                  <>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                      <Clock className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Application Pending</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                      Your application has been received! Our administration is currently reviewing it. You will be notified here once a decision is made.
                    </p>
                  </>
                )}
                {userStaffApp.status === "accepted" && (
                  <>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Application Accepted!</h3>
                    <p className="text-emerald-400/80 max-w-md mx-auto">
                      Congratulations! You have been accepted as a pending staff member. Please check your Discord as you will be mentioned soon for a voice interview.
                    </p>
                  </>
                )}
                {userStaffApp.status === "rejected" && (
                  <>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                      <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Application Rejected</h3>
                    <p className="text-red-400/80 max-w-md mx-auto">
                      Unfortunately, your application was not accepted at this time.
                    </p>
                    {userStaffApp.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10 text-sm text-slate-300">
                        <span className="font-bold text-red-400 block mb-1">Reason:</span>
                        {userStaffApp.rejectionReason}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : staffAppEnabled ? (
              <form onSubmit={handleApplyStaff} className="space-y-6 rounded-2xl border border-white/10 bg-[#101523] p-6 max-w-2xl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">How old are you? (Real Age)</label>
                    <input 
                      type="text" 
                      required
                      value={appForm.age}
                      onChange={(e) => setAppForm({...appForm, age: e.target.value})}
                      placeholder="Enter your real age..."
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">What will you offer to the server?</label>
                    <textarea 
                      required
                      value={appForm.contribution}
                      onChange={(e) => setAppForm({...appForm, contribution: e.target.value})}
                      placeholder="Describe your skills and plans..."
                      className="w-full h-32 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Which department do you want to join?</label>
                    <select 
                      required
                      value={appForm.department}
                      onChange={(e) => setAppForm({...appForm, department: e.target.value as any})}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#5865F2]"
                    >
                      <option value="Verification Team">Verification Team</option>
                      <option value="Event Hoster">Event Hoster</option>
                      <option value="Server Management">Server Management {`{Staff}`}</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmittingApp}
                  className="w-full rounded-xl bg-[#5865F2] py-4 text-sm font-bold text-white hover:bg-[#4752c4] transition-all disabled:opacity-50"
                >
                  {isSubmittingApp ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#101523] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/10 mb-4">
                  <UserPlus className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-white">Applications are Closed</h3>
                <p className="mt-2 text-slate-400">
                  The recruitment period is currently over. Please check back later or follow our announcements on Discord.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Notification Modal - Modern & Luxurious */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedNotification(null)}
        >
          <div className="absolute inset-0 bg-[#05060a]/90 backdrop-blur-xl" />
          
          <div 
            className="relative w-full max-w-lg bg-[#0d0e14] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Glow Decoration */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                    selectedNotification.type === 'Alert' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    selectedNotification.type === 'Event' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    selectedNotification.type === 'Gift' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {selectedNotification.type === 'Announcement' && <Bell className="h-6 w-6" />}
                    {selectedNotification.type === 'Alert' && <AlertCircle className="h-6 w-6" />}
                    {selectedNotification.type === 'Event' && <CalendarIcon className="h-6 w-6" />}
                    {selectedNotification.type === 'Gift' && <Gift className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-0.5">Transmission</span>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tight truncate">{selectedNotification.title}</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(selectedNotification.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-base text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                      {selectedNotification.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Category</span>
                    <span className="text-[10px] font-bold text-white uppercase">{selectedNotification.type}</span>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Target</span>
                    <span className="text-[10px] font-bold text-white uppercase">{selectedNotification.target}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 pt-0">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-blue-50 transition-all active:scale-95"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
);
}

function InsightCard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151a2b] p-5 transition-all hover:border-[#5865F2]/50 hover:bg-[#1a2138]">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#5865F2]/5 blur-2xl transition-all group-hover:bg-[#5865F2]/10" />
      
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white/5 p-2.5 transition-colors group-hover:bg-[#5865F2]/20">
          {icon}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Live
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-1 text-2xl font-bold text-white tracking-tight">
          {value}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-slate-500">{trend}</span>
      </div>
    </article>
  );
}

function RoleBadge({
  role,
  isSelected,
  onClick,
}: {
  role: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  if (!role) return null;
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all ${
        isSelected
          ? "border-[#5865F2] bg-[#5865F2]/10 text-white"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: role.color || '#5865F2' }}
      />
      {role.name || 'Unknown'}
      {isSelected && (
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5865F2] text-[10px] text-white">
          ✓
        </div>
      )}
    </button>
  );
}
