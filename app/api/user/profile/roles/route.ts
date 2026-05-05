import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import CustomRole from "@/models/CustomRole";
import { updateDiscordMemberRole } from "@/lib/discordMember";

// Get user's selected roles
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const profile = await UserProfile.findOne({ discordId: session.user.discordId })
      .populate({
        path: "selectedRoles",
        populate: { path: "categoryId" }
      });
    
    return NextResponse.json(profile?.selectedRoles || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user roles" }, { status: 500 });
  }
}

// Save user's selected roles and sync with Discord
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const discordUserId = session?.user?.discordId;
    
    if (!discordUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { roleIds: newRoleIds } = body; // Array of MongoDB ObjectIds

    await connectToDatabase();
    
    // 1. Get previous profile to see what changed
    const oldProfile = await UserProfile.findOne({ discordId: discordUserId }).populate("selectedRoles");
    const oldRoleIds = oldProfile?.selectedRoles.map((r: any) => r._id.toString()) || [];
    
    // 2. Determine roles to add and remove
    const rolesToAdd = newRoleIds.filter((id: string) => !oldRoleIds.includes(id));
    const rolesToRemove = oldRoleIds.filter((id: string) => !newRoleIds.includes(id));

    console.log("Syncing Roles:", { rolesToAdd, rolesToRemove });

    // 3. Fetch Discord Role IDs for all affected roles
    const allAffectedIds = [...rolesToAdd, ...rolesToRemove];
    const rolesData = await CustomRole.find({ _id: { $in: allAffectedIds } });
    const discordRoleMap = new Map(rolesData.map(r => [r._id.toString(), r.discordRoleId]));

    // 4. Sync with Discord API
    const syncPromises = [];

    for (const mongoId of rolesToAdd) {
      const discordRoleId = discordRoleMap.get(mongoId);
      if (discordRoleId) {
        syncPromises.push(updateDiscordMemberRole(discordUserId, discordRoleId, "add"));
      }
    }

    for (const mongoId of rolesToRemove) {
      const discordRoleId = discordRoleMap.get(mongoId);
      if (discordRoleId) {
        syncPromises.push(updateDiscordMemberRole(discordUserId, discordRoleId, "remove"));
      }
    }

    // Wait for all Discord API calls to complete
    await Promise.all(syncPromises);

    // 5. Update MongoDB
    const profile = await UserProfile.findOneAndUpdate(
      { discordId: discordUserId },
      { selectedRoles: newRoleIds },
      { upsert: true, new: true }
    );

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Profile sync error:", error);
    return NextResponse.json({ error: "Failed to sync roles with Discord" }, { status: 500 });
  }
}
