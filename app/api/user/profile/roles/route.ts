import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import CustomRole from "@/models/CustomRole";
import { updateDiscordMemberRole } from "@/lib/discordMember";

/**
 * تحسين واجهة برمجة التطبيقات لمزامنة الرتب:
 * 1. إضافة فحوصات أمان وتحقق من البيانات.
 * 2. معالجة الأخطاء بشكل مفصل لكل رتبة.
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
    const { roleIds } = body;

    // التحقق من أن roleIds هي مصفوفة صالحة
    if (!Array.isArray(roleIds)) {
      return NextResponse.json({ error: "Invalid roleIds format" }, { status: 400 });
    }

    await connectToDatabase();
    
    // 1. جلب البيانات الحالية للمستخدم
    const profile = await UserProfile.findOne({ discordId: discordUserId });
    const currentRoleIds = profile?.selectedRoles?.map((id: any) => id.toString()) || [];
    
    // 2. تحديد الرتب التي سيتم إضافتها والتي سيتم حذفها
    const toAdd = roleIds.filter(id => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter((id: string) => !roleIds.includes(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      return NextResponse.json({ message: "No changes detected", profile });
    }

    // 3. جلب بيانات الرتب من Discord للتأكد من وجودها
    const affectedIds = [...toAdd, ...toRemove];
    const rolesData = await CustomRole.find({ _id: { $in: affectedIds } });
    const discordRoleMap = new Map(rolesData.map(r => [r._id.toString(), r.discordRoleId]));

    const errors: string[] = [];

    // 4. المزامنة مع Discord (تسلسلي لتجنب الـ Rate Limit)
    // نبدأ بالإضافات
    for (const mongoId of toAdd) {
      const discordRoleId = discordRoleMap.get(mongoId);
      if (discordRoleId) {
        const success = await updateDiscordMemberRole(discordUserId, discordRoleId, "add");
        if (!success) errors.push(`Failed to add role: ${mongoId}`);
        await new Promise(r => setTimeout(r, 300)); // تأخير بسيط
      }
    }

    // ثم الحذف
    for (const mongoId of toRemove) {
      const discordRoleId = discordRoleMap.get(mongoId);
      if (discordRoleId) {
        const success = await updateDiscordMemberRole(discordUserId, discordRoleId, "remove");
        if (!success) errors.push(`Failed to remove role: ${mongoId}`);
        await new Promise(r => setTimeout(r, 300));
      }
    }

    // 5. تحديث MongoDB بالرتب التي نجحت مزامنتها فقط (اختياري)
    // هنا سنقوم بتحديث الكل لضمان تطابق الواجهة، ولكن مع تسجيل الأخطاء
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { discordId: discordUserId },
      { selectedRoles: roleIds },
      { upsert: true, new: true }
    ).populate({
      path: "selectedRoles",
      populate: { path: "categoryId" }
    });

    return NextResponse.json({
      success: errors.length === 0,
      profile: updatedProfile,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error("[Roles POST] Sync error:", error);
    return NextResponse.json({ 
      error: "Failed to sync roles", 
      details: error.message 
    }, { status: 500 });
  }
}
