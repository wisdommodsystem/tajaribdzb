import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Message from "@/models/Message";

// Get all tickets for admin
export async function GET() {
  try {
    await connectToDatabase();
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// Update ticket status or delete
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { ticketId, status } = body;

    const ticket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    await connectToDatabase();
    await Ticket.findByIdAndDelete(ticketId);
    await Message.deleteMany({ ticketId });

    return NextResponse.json({ message: "Ticket deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
