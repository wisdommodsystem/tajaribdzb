import { Facebook, Instagram, Youtube } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";

export const SOCIAL_LINKS = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Wisdom_Circle0",
    icon: Youtube
  },
  {
    name: "Instagram",
    href: "http://www.instagram.com/wisdom_circle0",
    icon: Instagram
  },
  {
    name: "Discord",
    href: "https://discord.gg/qusXGtgK8j",
    icon: FaDiscord
  },
  {
    name: "Facebook",
    href: "http://www.facebook.com/mazigh.apollo",
    icon: Facebook
  }
] as const;
