import { Leaderboard } from "@/components/wisdom/Leaderboard";

export default function WisdomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gold">Wisdom Command Center</h1>
        <p className="mt-2 text-slate-300">
          Welcome back. Track the highest-performing members directly from our archives.
        </p>
      </div>
      <Leaderboard />
    </div>
  );
}
