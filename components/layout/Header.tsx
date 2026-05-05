"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SOCIAL_LINKS } from "@/constants/social";
import { LogIn, LogOut } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111320]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-slate-100">
          <div className="h-9 w-9 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <img 
              src="https://i.postimg.cc/7YXBBpPW/wisdomlogo.png" 
              alt="Wisdom Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hidden sm:block">Wisdom Circle Community</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 transition hover:text-[#5865F2]"
              aria-label={name}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </nav>

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#1e2235] px-4 py-2 text-sm text-slate-200 transition hover:bg-[#2a2f45]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn("discord", { callbackUrl: "/discord" })}
            className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4752c4]"
          >
            <LogIn className="h-4 w-4" />
            Join with Discord
          </button>
        )}
      </div>
    </header>
  );
}
