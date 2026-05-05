import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch upcoming and ongoing events
    const events = await Event.find({
      status: { $in: ["Upcoming", "Ongoing"] },
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }).sort({ date: 1 });
    
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
