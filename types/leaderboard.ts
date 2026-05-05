export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar: string | null;
  level: number;
  xp: number;
  voiceLevel: number;
  voiceMinutes: number;
  combinedScore: number;
}
