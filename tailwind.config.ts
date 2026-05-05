// Define the Config type locally to avoid missing module errors
type Config = {
  darkMode?: string | string[] | boolean;
  content?: string[];
  theme?: {
    extend?: Record<string, any>;
  };
  plugins?: any[];
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        ash: "#1a1a1a",
        bone: "#f5f5f5",
        muted: "#737373",
        accent: "#ffffff"
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(212, 175, 55, 0.3)"
      },
      backgroundImage: {
        "cinematic-radial":
          "radial-gradient(circle at top, rgba(47,128,255,0.18), transparent 42%), radial-gradient(circle at 80% 10%, rgba(212,175,55,0.12), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;
