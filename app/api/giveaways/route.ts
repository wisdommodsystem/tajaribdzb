import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Giveaway from "@/models/Giveaway";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch active giveaways OR ended ones with winners to show history
    const giveaways = await Giveaway.find({ 
      $or: [
        { status: "Active" },
        { status: "Ended", winners: { $exists: true, $not: { $size: 0 } } }
      ]
    }).sort({ status: 1, endDate: 1 });
    return NextResponse.json(giveaways);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch giveaways" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { giveawayId } = body;

    if (!giveawayId) {
      return NextResponse.json({ error: "Giveaway ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    const giveaway = await Giveaway.findById(giveawayId);

    if (!giveaway) {
      return NextResponse.json({ error: "Giveaway not found" }, { status: 404 });
    }

    if (giveaway.status !== "Active") {
      return NextResponse.json({ error: "Giveaway is not active" }, { status: 400 });
    }

    // Check if user already joined
    const alreadyJoined = giveaway.participants.some(
      (p: any) => p.discordId === session.user.discordId
    );

    if (alreadyJoined) {
      return NextResponse.json({ error: "Already joined" }, { status: 400 });
    }

    // Add user to participants
    giveaway.participants.push({
      discordId: session.user.discordId,
      username: session.user.name,
      avatar: session.user.image,
      joinedAt: new Date()
    });

    await giveaway.save();

    return NextResponse.json({ message: "Joined successfully" });
  } catch (error) {
    console.error("Join giveaway error:", error);
    return NextResponse.json({ error: "Failed to join giveaway" }, { status: 500 });
  }
}
