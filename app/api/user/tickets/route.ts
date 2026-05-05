import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Message from "@/models/Message";

// Create a new ticket
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { type, subject, message } = body;

    if (!type || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Create the ticket
    const ticket = await Ticket.create({
      discordId: session.user.discordId,
      username: session.user.name || "Unknown",
      type,
      subject,
      status: "Open"
    });

    // 2. Create the initial message
    await Message.create({
      ticketId: ticket._id,
      senderId: session.user.discordId,
      senderName: session.user.name || "Unknown",
      content: message
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

// Get user tickets
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const tickets = await Ticket.find({ discordId: session.user.discordId }).sort({ createdAt: -1 });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
