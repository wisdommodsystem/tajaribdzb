import { NextResponse } from "next/server";


import connectToDatabase from "@/lib/mongodb";
import StaffApplication from "@/models/StaffApplication";
import Notification from "@/models/BroadcastNotification";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, rejectionReason } = await req.json();

    await connectToDatabase();
    
    // Use findOneAndUpdate for a more robust partial update
    const application = await StaffApplication.findOneAndUpdate(
      { _id: id },
      { 
        $set: { 
          status, 
          ...(rejectionReason ? { rejectionReason } : {}) 
        } 
      },
      { new: true }
    );

    if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Send Notification to user
    try {
      await Notification.create({
        recipientId: application.userId,
        target: "Specific",
        title: status === "accepted" ? "Application Accepted! 🎉" : "Application Update",
        message: status === "accepted" 
          ? `Congratulations! Your staff application for ${application.department} has been accepted. Check Discord for further instructions.` 
          : `We regret to inform you that your staff application for ${application.department} was not accepted at this time.`,
        type: status === "accepted" ? "Gift" : "Alert",
      });
    } catch (notifErr) {
      console.error("Failed to create notification:", notifErr);
    }

    // If accepted, give Discord Role
    if (status === "accepted") {
      const pendingRoleId = process.env.PENDING_STAFF_ROLE_ID;
      const guildId = process.env.DISCORD_GUILD_ID;
      const botToken = process.env.DISCORD_BOT_TOKEN;

      if (pendingRoleId && guildId && botToken) {
        // Run Discord fetch in background
        fetch(
          `https://discord.com/api/v10/guilds/${guildId}/members/${application.userId}/roles/${pendingRoleId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bot ${botToken}` },
          }
        ).catch(err => console.error("Non-blocking Discord Role Error:", err));
      }
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Staff Application PATCH Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
