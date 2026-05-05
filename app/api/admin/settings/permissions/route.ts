import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

// Get current permission role settings
export async function GET() {
  try {
    await connectToDatabase();
    const keys = ["pic_perm_role_id", "activity_perm_role_id", "link_perm_role_id"];
    const settings = await Settings.find({ key: { $in: keys } });
    
    const result = {
      pic_perm_role_id: settings.find(s => s.key === "pic_perm_role_id")?.value || "",
      activity_perm_role_id: settings.find(s => s.key === "activity_perm_role_id")?.value || "",
      link_perm_role_id: settings.find(s => s.key === "link_perm_role_id")?.value || ""
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// Update permission role settings
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const updates = Object.entries(body).map(([key, value]) => {
      return Settings.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    });

    await Promise.all(updates);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
