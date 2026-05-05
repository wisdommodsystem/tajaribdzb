"use client";

import { Shield, ShieldCheck, EyeOff, MessageSquare, MonitorPlay, Radio, Mic, FileWarning, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

const categories = [
  {
    title: "Respect And General Behavior",
    icon: ShieldCheck,
    rules: [
      { title: "Respect and Kindness", desc: "All members must treat others with respect and kindness. Insults, harassment, bullying, or provocation are not allowed." },
      { title: "Maintain Civil Discussions", desc: "All discussions must remain calm and respectful. Arguments, drama, and stirring conflict are prohibited." },
      { title: "Respect Ongoing Conversations", desc: "Do not interrupt others or derail active discussions." },
      { title: "No Backseat Moderation", desc: "Do not attempt to enforce rules yourself or correct other members. Leave moderation to the staff team." },
      { title: "Respect Staff Decisions", desc: "Moderators and administrators must be respected. Public arguments with staff may result in punishment." }
    ]
  },
  {
    title: "Prohibited Content",
    icon: EyeOff,
    rules: [
      { title: "No NSFW or Inappropriate Content", desc: "This includes images, videos, links, sexual comments, or anything related to NSFW content." },
      { title: "No Streaming or Sharing NSFW Content", desc: "NSFW content is strictly prohibited in streams or screen sharing." },
      { title: "No Illegal Activities Displayed", desc: "Showing illegal activities in chat, streams, or camera is forbidden." },
      { title: "No Discussion of Illegal Activities", desc: "Talking about hacking, fraud, drugs, scams, or any illegal activity is strictly prohibited." },
      { title: "No Gore or Disturbing Content", desc: "Posting violent, bloody, shocking, or disturbing content (including graphic wildlife footage) is not allowed." }
    ]
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    rules: [
      { title: "Respect Privacy", desc: "Sharing personal information (name, address, phone number, accounts, etc.) is strictly forbidden." },
      { title: "No Doxxing or Threats", desc: "Leaking personal information or threatening any member will result in an immediate ban." },
      { title: "No Impersonation", desc: "Impersonating another member or staff is prohibited." },
      { title: "No Alternate Accounts (Alts)", desc: "Using alternate accounts will result in a permanent ban on all associated accounts." }
    ]
  },
  {
    title: "Spam & Advertising",
    icon: MessageSquare,
    rules: [
      { title: "No Spam", desc: "Flooding chat, sending text walls, repeated mentions, or duplicate messages is not allowed." },
      { title: "No Repetitive Media", desc: "Do not repeatedly send the same images, emojis, or content." },
      { title: "No Inappropriate Emojis or Dotting", desc: "Using inappropriate emojis, stickers, or unnecessary dotting is prohibited." },
      { title: "No Advertising", desc: "Promoting other servers, Discord invites (.gg links), or external content without staff permission is not allowed." }
    ]
  },
  {
    title: "Channels & Rooms",
    icon: MonitorPlay,
    rules: [
      { title: "Use Channels Properly", desc: "Each channel has a specific purpose. Stay on topic." },
      { title: "Respect Channel Topics", desc: "Do not go off-topic in text or voice channels." },
      { title: "Appropriate Names & Profile Pictures", desc: "Inappropriate usernames or profile pictures must be changed immediately when requested." }
    ]
  },
  {
    title: "Voice Channels & Streaming",
    icon: Mic,
    rules: [
      { title: "No Toxic Behavior in Voice", desc: "Toxic or disruptive behavior in public voice channels is not allowed." },
      { title: "No Soundboard Abuse", desc: "Using soundboards to troll or disturb others is prohibited." },
      { title: "No Voice Changers", desc: "Voice changers are not allowed." },
      { title: "One Music Bot Per Channel", desc: "Only one music bot is permitted per voice channel." },
      { title: "No NSFW or Illegal Content on Camera", desc: "Displaying NSFW or illegal content via camera will result in an immediate ban." }
    ]
  },
  {
    title: "Recording Rules",
    icon: Radio,
    rules: [
      { title: "Consent Required Before Recording", desc: "All members must be informed and give permission before recording. Recording without consent is strictly prohibited." },
      { title: "No Private Recording Without Permission", desc: "Recording private conversations or calls without consent from all parties is forbidden. Sharing recordings outside the server without permission is also prohibited." },
      { title: "No Misuse of Recordings", desc: "Using recordings for harassment, blackmail, mockery, or drama will result in punishment." },
      { title: "Administration Recording Rights", desc: "Staff may record for moderation, documentation, or events. These recordings are kept confidential and only shared when necessary." },
      { title: "No Leaking Recordings", desc: "Sharing server recordings outside the server without staff approval is strictly forbidden." }
    ]
  },
  {
    title: "Links & Files",
    icon: FileWarning,
    rules: [
      { title: "No Suspicious Links or Files", desc: "Sending malicious or suspicious links/files will result in punishment." }
    ]
  }
];

export function ServerRules() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".rule-card");
    elements.forEach((el) => observer.observe(elements[0] === el ? el : el)); // Observe all

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[#0a0b14]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">Community Standards</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
            Server <span className="text-blue-500">Rules</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium">
            By joining the server, you agree to these terms and conditions. <br />
            <span className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Ignorance of the law is no excuse.</span>
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="rule-card opacity-0 translate-y-10 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="h-full rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <cat.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">{cat.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {cat.rules.map((rule, rIdx) => (
                    <div key={rIdx} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">{rule.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed pl-3 border-l border-white/5">
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle className="h-24 w-24 text-blue-400" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest italic">Important Notes</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Administration reserves the right to modify rules
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Punishments vary by violation severity
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Warnings, mutes, kicks, or bans may apply
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
