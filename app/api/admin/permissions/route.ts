import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PermissionRequest from "@/models/PermissionRequest";
import Settings from "@/models/Settings";

// Get all pending permission requests for admin
export async function GET() {
  try {
    await connectToDatabase();
    const requests = await PermissionRequest.find({ status: "pending" }).sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch permission requests" }, { status: 500 });
  }
}

// Update permission request status (Approve/Reject)
export async function PATCH(req: Request) {
  try {
    const { requestId, status } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();
    const permissionRequest = await PermissionRequest.findById(requestId);
    if (!permissionRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    permissionRequest.status = status;
    await permissionRequest.save();

    // If approved, give Discord Role
    if (status === "approved") {
      const settingsKey = `${permissionRequest.type.toLowerCase().replace(" ", "_")}_role_id`;
      const settings = await Settings.findOne({ key: settingsKey });
      
      const roleId = settings?.value;
      const guildId = process.env.DISCORD_GUILD_ID;
      const botToken = process.env.DISCORD_BOT_TOKEN;

      if (roleId && guildId && botToken) {
        try {
          const discordRes = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/members/${permissionRequest.userId}/roles/${roleId}`,
            {
              method: "PUT",
              headers: { Authorization: `Bot ${botToken.trim()}` },
            }
          );
          if (!discordRes.ok) {
            console.error(`[Discord API] Failed to assign role ${roleId} to user ${permissionRequest.userId}`);
          }
        } catch (err) {
          console.error("Failed to assign discord role:", err);
        }
      }
    }

    return NextResponse.json(permissionRequest);
  } catch (error) {
    console.error("Admin permission update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
