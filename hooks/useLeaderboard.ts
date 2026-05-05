"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/types/leaderboard";

interface LeaderboardState {
  data: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

export function useLeaderboard(sortBy: "voice" | "text" = "voice") {
  const [state, setState] = useState<LeaderboardState>({
    data: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const response = await fetch(`/api/user/leaderboard?sortBy=${sortBy}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const payload = (await response.json()) as LeaderboardEntry[];

        if (isMounted) {
          setState({ data: payload, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    }

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [sortBy]);

  return state;
}
