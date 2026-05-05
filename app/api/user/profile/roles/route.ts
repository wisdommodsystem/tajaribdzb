import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import CustomRole from "@/models/CustomRole";
import { updateDiscordMemberRoles, getDiscordMemberProfile } from "@/lib/discordMember";

/**
 * تحسين واجهة برمجة التطبيقات لمزامنة الرتب:
 * 1. إضافة فحوصات أمان وتحقق من البيانات.
 * 2. استخدام PATCH لتحديث كافة الرتب دفعة واحدة لتجنب الـ Race Conditions.
 * 3. ضمان مزامنة دقيقة بين MongoDB و Discord.
 */

// جلب الرتب المختارة للمستخدم
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const discordId = (session as any)?.user?.discordId;

    if (!discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // جلب الملف الشخصي مع بيانات الرتب والتصنيفات
    const profile = await UserProfile.findOne({ discordId })
      .populate({
        path: "selectedRoles",
        populate: { path: "categoryId" }
      });
    
    // تصفية أي رتب قد تكون حذفت من قاعدة البيانات وبقيت في مصفوفة المستخدم
    const validRoles = profile?.selectedRoles?.filter((r: any) => r !== null) || [];
    
    return NextResponse.json(validRoles);
  } catch (error) {
    console.error("[Roles GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch user roles" }, { status: 500 });
  }
}

// حفظ الرتب والمزامنة مع Discord
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const discordUserId = (session as any)?.user?.discordId;
    
    if (!discordUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { roleIds } = body; // هذه هي الـ MongoIDs المختارة من الموقع

    if (!Array.isArray(roleIds)) {
      return NextResponse.json({ error: "Invalid roleIds format" }, { status: 400 });
    }

    await connectToDatabase();
    
    // 1. جلب بيانات الرتب المختارة من قاعدة البيانات للحصول على DiscordRoleIDs
    const selectedRolesData = await CustomRole.find({ _id: { $in: roleIds } });
    const selectedDiscordRoleIds = selectedRolesData.map(r => r.discordRoleId);

    // 2. جلب كافة الرتب "القابلة للاختيار" من قاعدة البيانات
    const allCustomRoles = await CustomRole.find({});
    const allCustomDiscordRoleIds = allCustomRoles.map(r => r.discordRoleId);

    // 3. جلب رتب المستخدم الحالية من Discord
    const discordProfile = await getDiscordMemberProfile(discordUserId);
    if (!discordProfile) {
      return NextResponse.json({ error: "Could not fetch Discord profile" }, { status: 500 });
    }

    // 4. بناء قائمة الرتب النهائية:
    // أ. الرتب التي يمتلكها المستخدم حالياً وليست من ضمن الرتب "القابلة للاختيار" (مثل رتب الإدارة، الألوان الثابتة، إلخ)
    const permanentRoles = discordProfile.roles
      .map(r => r.id)
      .filter(id => !allCustomDiscordRoleIds.includes(id));

    // ب. إضافة الرتب الجديدة التي اختارها المستخدم
    const finalRolesList = [...new Set([...permanentRoles, ...selectedDiscordRoleIds])];

    console.log(`[Sync] Updating all roles for ${discordUserId}. Final list size: ${finalRolesList.length}`);

    // 5. تحديث كافة الرتب في Discord بطلب PATCH واحد (أكثر استقراراً)
    const success = await updateDiscordMemberRoles(discordUserId, finalRolesList);

    if (!success) {
      return NextResponse.json({ error: "Failed to update roles in Discord" }, { status: 500 });
    }

    // 6. تحديث MongoDB
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { discordId: discordUserId },
      { selectedRoles: roleIds },
      { upsert: true, new: true }
    ).populate({
      path: "selectedRoles",
      populate: { path: "categoryId" }
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });

  } catch (error: any) {
    console.error("[Roles POST] Sync error:", error);
    return NextResponse.json({ 
      error: "Failed to sync roles", 
      details: error.message 
    }, { status: 500 });
  }
}
