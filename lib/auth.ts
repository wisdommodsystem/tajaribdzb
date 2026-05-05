import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import connectToDatabase from "./mongodb";
import UserProfile from "@/models/UserProfile";
import { headers } from "next/headers";

async function sendLoginLog(profile: any, ip: string, userAgent: string) {
  const webhookUrl = process.env.LOGGIN_WEBHOOK;
  if (!webhookUrl) {
    console.warn("[Webhook] LOGGIN_WEBHOOK is not defined in environment variables");
    return;
  }

  try {
    console.log("[Webhook] Attempting to send login log for user:", profile.username);
    let deviceType = "Desktop/Unknown";
    if (/mobile/i.test(userAgent)) deviceType = "Mobile Device";
    if (/tablet/i.test(userAgent)) deviceType = "Tablet";
    if (/android/i.test(userAgent)) deviceType = "Android";
    if (/iphone|ipad|ipod/i.test(userAgent)) deviceType = "iOS Device";

    const embed = {
      title: "🛡️ New User Authentication",
      color: 0x5865F2,
      thumbnail: {
        url: profile.image_url || (profile.avatar 
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` 
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.id.slice(-1)) % 5}.png`)
      },
      fields: [
        { name: "👤 Scholar Name", value: `\`${profile.global_name || profile.username}\``, inline: true },
        { name: "🆔 Discord ID", value: `\`${profile.id}\``, inline: true },
        { name: "🌐 IP Address", value: `\`${ip}\``, inline: false },
        { name: "📱 Device Info", value: `\`${deviceType}\``, inline: true },
        { name: "🕰️ Timestamp", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      ],
      footer: {
        text: "Wisdom Circle Security Protocol",
        icon_url: "https://i.postimg.cc/7YXBBpPW/wisdomlogo.png"
      }
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Wisdom Security Bot",
        avatar_url: "https://i.postimg.cc/7YXBBpPW/wisdomlogo.png",
        embeds: [embed]
      })
    });
    console.log("[Webhook] Login log sent successfully");
  } catch (err) {
    console.error("[Webhook] Failed to send webhook log:", err);
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // تفعيل وضع التصحيح لرؤية الأخطاء في سجلات Render
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify" } }
    })
  ],
  pages: {
    signIn: "/",
    error: "/" // توجيه أخطاء تسجيل الدخول للصفحة الرئيسية
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "id" in profile) {
        token.discordId = String(profile.id);
        
        // إعادة تفعيل الـ Webhook مع معالجة أفضل للأخطاء والـ IP
        try {
          let ip = "unknown";
          let userAgent = "unknown";
          
          try {
            const headersList = await headers();
            ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
            userAgent = headersList.get("user-agent") || "unknown";
          } catch (hErr) {
            console.warn("[Auth] Could not fetch headers for logging:", hErr);
          }
          
          await sendLoginLog(profile, ip, userAgent);
        } catch (webhookErr) {
          console.error("[Auth] Webhook logging failed:", webhookErr);
        }
        
        // محاولة تحديث البيانات في قاعدة البيانات
        try {
          await connectToDatabase();
          const p = profile as any;
          const avatarUrl = p.image_url || (p.avatar 
            ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png` 
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(p.id.slice(-1)) % 5}.png`);
            
          await UserProfile.findOneAndUpdate(
            { discordId: String(p.id) },
            { 
              username: p.global_name || p.username,
              avatar: avatarUrl,
              lastSeen: new Date()
            },
            { upsert: true }
          );
        } catch (err) {
          console.error("Database update error during JWT callback:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session && session.user && token.discordId) {
        (session.user as any).discordId = String(token.discordId);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("[Auth Redirect] url:", url, "baseUrl:", baseUrl);
      // توجيه المستخدم دائماً إلى لوحة تحكم ديسكورد بعد النجاح
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/discord`;
    }
  }
};
