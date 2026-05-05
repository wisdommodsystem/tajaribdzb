import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import PermissionRequest from "@/models/PermissionRequest";

// Get user's permission requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const requests = await PermissionRequest.find({ userId: session.user.discordId }).sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch permission requests" }, { status: 500 });
  }
}

// Submit a new permission request
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();
    if (!["Pic Perm", "Activity Perm", "Link Perm"].includes(type)) {
      return NextResponse.json({ error: "Invalid permission type" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if there's already a pending request of the same type
    const existing = await PermissionRequest.findOne({
      userId: session.user.discordId,
      type,
      status: "pending"
    });

    if (existing) {
      return NextResponse.json({ error: `You already have a pending request for ${type}` }, { status: 400 });
    }

    const newRequest = await PermissionRequest.create({
      userId: session.user.discordId,
      username: session.user.name || "Unknown",
      type,
      status: "pending"
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Permission request error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
