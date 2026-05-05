import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const LOGO_URL = "https://i.postimg.cc/qRdBPxX4/Gemini-Generated-Image-isu247isu247isu2-removebg-preview.png";

export const metadata: Metadata = {
  title: {
    default: "Wisdom Circle | مجتمع الحكمة الفلسفي و malahida.com",
    template: "%s | Wisdom Circle"
  },
  description: "المنصة الرسمية لمجتمع Wisdom Circle المرتبط بـ malahida.com. أكبر تجمع فكري للمثقفين في المغرب وشمال أفريقيا للنقاشات الفلسفية، نقد الأديان، الفكر الحر، والمنطق.",
  keywords: [
    "Wisdom Circle", "malahida.com", "سيرفر ويزدوم سيركل", "ديسكورد مثقفين المغرب", 
    "فلسفة", "نقد الأديان", "حوار عقلاني", "منطق", "فكر حر", "شمال أفريقيا", 
    "Morocco Intellectual Discord", "North Africa Philosophy", "Rational Debate"
  ],
  authors: [{ name: "Wisdom Circle Team" }],
  creator: "Wisdom Circle",
  publisher: "Wisdom Circle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wiscircle.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wisdom Circle | مجتمع الحكمة الفلسفي في المغرب",
    description: "انضم إلى Wisdom Circle، البيئة الفكرية الرائدة في شمال أفريقيا للنقاشات العقلانية والعلمية بالتعاون مع malahida.com.",
    url: "https://wiscircle.online",
    siteName: "Wisdom Circle",
    images: [
      {
        url: LOGO_URL,
        width: 800,
        height: 800,
        alt: "Wisdom Circle Logo",
      },
    ],
    locale: "ar_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisdom Circle | مجتمع الحكمة الفلسفي",
    description: "أفضل سيرفر ديسكورد للحوار الفكري في المغرب والوطن العربي.",
    images: [LOGO_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: LOGO_URL,
    shortcut: LOGO_URL,
    apple: LOGO_URL,
  },
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://wiscircle.online/#organization",
    "name": "Wisdom Circle",
    "alternateName": ["ويزدوم سيركل", "malahida.com community"],
    "url": "https://wiscircle.online",
    "logo": LOGO_URL,
    "sameAs": [
      "https://malahida.com",
      "https://discord.gg/qusXGtgK8j",
      "https://www.youtube.com/@Wisdom_Circle0",
      "http://www.instagram.com/wisdom_circle0",
      "http://www.facebook.com/mazigh.apollo"
    ],
    "description": "مجتمع فكري وفلسفي رائد في المغرب وشمال أفريقيا، يركز على الحوار العقلاني، نقد الأديان، والبحث العلمي والمنطقي.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "community support",
      "url": "https://discord.gg/qusXGtgK8j"
    },
    "potentialAction": {
      "@type": "JoinAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://discord.gg/qusXGtgK8j",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Organization",
        "name": "Wisdom Circle Discord Server"
      }
    }
  };

  return (
    <html lang="ar" className={`dark ${sans.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-void text-bone">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
