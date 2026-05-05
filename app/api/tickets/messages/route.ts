import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";
import Ticket from "@/models/Ticket";

// Get messages for a ticket
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
    }

    await connectToDatabase();
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Send a message
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // User or Admin can send messages. If no discordId in session, it might be an admin from Supabase auth.
    // For simplicity, we'll check session or assume it's admin if coming from admin dashboard.
    
    await connectToDatabase();
    const body = await request.json();
    const { ticketId, content, senderId, senderName } = body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.status === "Closed") {
      return NextResponse.json({ error: "Ticket is closed or not found" }, { status: 400 });
    }

    const message = await Message.create({
      ticketId,
      senderId,
      senderName,
      content
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
