import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import StaffApplication from "@/models/StaffApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Get application status
    const application = await StaffApplication.findOne({ userId: session.user.discordId }).sort({ createdAt: -1 });
    
    // Get if staff apps are enabled
    const settings = await Settings.findOne({ key: "staff_apps_enabled" });
    const isEnabled = settings ? settings.value : false;
    
    console.log(`[Apply API] User ${session.user.discordId} status: ${isEnabled ? 'Enabled' : 'Disabled'}`);

    return NextResponse.json({ 
      application, 
      isEnabled 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // Check if enabled
    const settings = await Settings.findOne({ key: "staff_apps_enabled" });
    if (!settings || !settings.value) {
      return NextResponse.json({ error: "Applications are currently closed" }, { status: 403 });
    }

    // Check if already has a pending application
    const existing = await StaffApplication.findOne({ 
      userId: session.user.discordId,
      status: "pending" 
    });
    if (existing) {
      return NextResponse.json({ error: "You already have a pending application" }, { status: 400 });
    }

    const { age, contribution, department } = await req.json();

    const newApp = await StaffApplication.create({
      userId: session.user.discordId,
      username: session.user.name || "Unknown",
      displayName: session.user.name || "Unknown",
      age,
      contribution,
      department,
      status: "pending"
    });

    return NextResponse.json(newApp);
  } catch (error) {
    console.error("Staff application error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
