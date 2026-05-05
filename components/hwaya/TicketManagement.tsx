"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Trash2, 
  XCircle, 
  CheckCircle, 
  Send, 
  User, 
  Shield, 
  Search, 
  Clock, 
  MoreHorizontal,
  ChevronLeft,
  LifeBuoy,
  Hash
} from "lucide-react";

export function TicketManagement() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket._id);
      const interval = setInterval(() => fetchMessages(activeTicket._id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeTicket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data.filter(t => t !== null));
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/tickets/messages?ticketId=${ticketId}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data.filter(m => m !== null));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
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
          senderId: "admin",
          senderName: "Wisdom AI"
        })
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages(activeTicket._id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: id, status })
    });
    fetchTickets();
    if (activeTicket?._id === id) {
      setActiveTicket({ ...activeTicket, status });
    }
  };

  const deleteTicket = async (id: string) => {
    if (!confirm("Are you sure? This will delete all messages.")) return;
    await fetch(`/api/admin/tickets?ticketId=${id}`, { method: "DELETE" });
    fetchTickets();
    if (activeTicket?._id === id) setActiveTicket(null);
  };

  const filteredTickets = tickets.filter(t => 
    t.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[750px] animate-in fade-in duration-700">
      {/* Sidebar: Unified Ticket List */}
      <div className={`w-full lg:w-[400px] flex flex-col bg-[#0d0e14] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all ${activeTicket ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5 space-y-6 bg-white/[0.02]">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center border border-[#5865F2]/20">
                    <MessageSquare className="h-5 w-5 text-[#5865F2]" />
                 </div>
                 <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Nexus Tickets</h2>
              </div>
              <span className="text-[10px] font-black bg-[#5865F2]/20 text-[#5865F2] px-3 py-1 rounded-full border border-[#5865F2]/20">
                {tickets.length} ACTIVE
              </span>
           </div>

           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-[#5865F2] transition-colors" />
              <input 
                type="text" 
                placeholder="Search database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#5865F2]/50 transition-all placeholder:text-slate-700"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredTickets.map((t: any) => (
            <button
              key={t._id}
              onClick={() => setActiveTicket(t)}
              className={`group w-full text-left p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                activeTicket?._id === t._id 
                  ? 'bg-[#5865F2]/10 border-[#5865F2]/30 shadow-lg shadow-[#5865F2]/5' 
                  : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className={`text-[8px] font-black px-2 py-1 rounded-lg tracking-widest uppercase ${
                  t.type === 'Report' ? 'bg-red-500/10 text-red-400' : 
                  t.type === 'Suggestions' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {t.type}
                </span>
                <span className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tighter ${
                  t.status === 'Open' ? 'text-emerald-500' : 'text-slate-600'
                }`}>
                  <div className={`h-1 w-1 rounded-full ${t.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                  {t.status}
                </span>
              </div>
              <p className="text-sm font-bold text-white mb-4 line-clamp-1 group-hover:text-[#5865F2] transition-colors relative z-10">{t.subject}</p>
              
              <div className="flex items-center justify-between relative z-10 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center border border-white/10">
                    <User className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{t.username}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                   <Clock className="h-2.5 w-2.5" />
                   <span className="text-[9px] font-mono">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>

              {activeTicket?._id === t._id && (
                <div className="absolute top-0 right-0 h-full w-1 bg-[#5865F2]" />
              )}
            </button>
          ))}
          {filteredTickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
               <Hash className="h-10 w-10 text-slate-600 mb-2" />
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No matching logs</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat: Modern Communication Interface */}
      <div className={`flex-1 flex flex-col bg-[#0d0e14] rounded-[2.5rem] border border-white/5 overflow-hidden transition-all ${activeTicket ? 'flex' : 'hidden lg:flex'}`}>
        {activeTicket ? (
          <>
            {/* Communication Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTicket(null)}
                  className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-white tracking-tight uppercase italic leading-none">{activeTicket.subject}</h2>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Origin: {activeTicket.username}</span>
                     <div className="h-1 w-1 rounded-full bg-slate-800" />
                     <span className="text-[10px] text-[#5865F2] font-black uppercase tracking-widest italic">Encrypted Uplink</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
                   <div className={`h-2 w-2 rounded-full ${activeTicket.status === 'Open' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{activeTicket.status}</span>
                </div>
                <button 
                  onClick={() => updateStatus(activeTicket._id, activeTicket.status === "Open" ? "Closed" : "Open")}
                  className={`p-2.5 rounded-2xl transition-all active:scale-95 border ${
                    activeTicket.status === 'Open' 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                  title={activeTicket.status === 'Open' ? "Deactivate Link" : "Restore Link"}
                >
                  {activeTicket.status === 'Open' ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                </button>
                <button 
                  onClick={() => deleteTicket(activeTicket._id)}
                  className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Neural Message Flow */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#0a0c14]/30 custom-scrollbar">
              {messages.map((msg: any, i: number) => {
                const isAdmin = msg.senderId === 'admin';
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                  >
                    <div className={`flex max-w-[85%] gap-4 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 h-10 w-10 rounded-2xl border flex items-center justify-center shadow-lg ${
                        isAdmin 
                          ? 'bg-[#5865F2]/20 border-[#5865F2]/30' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        {isAdmin ? (
                          <Shield className="h-5 w-5 text-[#5865F2]" />
                        ) : (
                          <User className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className={`space-y-2 ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-[#5865F2]' : 'text-slate-400'}`}>
                            {isAdmin ? 'System Overlord' : (msg.senderName || 'Subject')}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <div className={`p-5 rounded-[2rem] text-sm leading-relaxed ${
                          isAdmin 
                            ? 'bg-[#5865F2] text-white rounded-tr-none shadow-xl shadow-[#5865F2]/10' 
                            : 'bg-[#151a2b] text-slate-300 rounded-tl-none border border-white/5'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Response Module */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <form onSubmit={handleSendMessage} className="relative group">
                <input
                  type="text"
                  placeholder="Inject response into flow..."
                  className="w-full rounded-[2rem] bg-black/60 border border-white/10 pl-6 pr-16 py-4 text-sm text-white focus:outline-none focus:border-[#5865F2]/50 transition-all placeholder:text-slate-700"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white hover:bg-[#4752c4] transition-all disabled:opacity-20 active:scale-90 shadow-lg shadow-[#5865F2]/20"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 via-transparent to-transparent" />
            <div className="relative z-10 space-y-6">
               <div className="h-24 w-24 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto shadow-3xl">
                  <LifeBuoy className="h-10 w-10 text-slate-700 animate-spin-slow" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Nexus Standby</h3>
                  <p className="text-sm text-slate-500 max-w-[280px] mx-auto font-medium">
                    Waiting for tactical link. Select a transmission from the registry to begin communication.
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
