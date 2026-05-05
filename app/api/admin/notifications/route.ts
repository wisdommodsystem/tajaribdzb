import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/BroadcastNotification";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, message, type, target, recipientId } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const newNotification = await Notification.create({
      title,
      message,
      type: type || "Announcement",
      target: target || "All",
      recipientId: target === "Specific" ? recipientId : undefined
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error: any) {
      console.error("Broadcast POST error details:", error);
      return NextResponse.json({ 
        error: "Failed to send notification", 
        details: error.message || String(error) 
      }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await Notification.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
