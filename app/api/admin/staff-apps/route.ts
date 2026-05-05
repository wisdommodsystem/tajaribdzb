import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";
import StaffApplication from "@/models/StaffApplication";

export async function GET() {
  try {
    await connectToDatabase();
    const applications = await StaffApplication.find().sort({ createdAt: -1 });
    const settings = await Settings.findOne({ key: "staff_apps_enabled" });
    
    return NextResponse.json({ 
      applications, 
      isEnabled: settings ? settings.value : false 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isEnabled } = await req.json();
    await connectToDatabase();
    
    await Settings.findOneAndUpdate(
      { key: "staff_apps_enabled" },
      { value: isEnabled },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, isEnabled });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
