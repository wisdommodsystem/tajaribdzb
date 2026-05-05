import { NextResponse } from "next/server";
import { fetchLeaderboard } from "@/lib/fetchLeaderboard";

export async function GET() {
  try {
    const leaderboard = await fetchLeaderboard(50);
    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard from database" }, { status: 500 });
  }
}
