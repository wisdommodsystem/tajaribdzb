import { NextResponse } from "next/server";
import { fetchLeaderboard } from "@/lib/fetchLeaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = (searchParams.get("sortBy") as "voice" | "text") || "voice";
    
    const leaderboard = await fetchLeaderboard(50, sortBy);
    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
