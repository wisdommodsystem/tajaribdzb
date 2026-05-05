import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CustomRole from "@/models/CustomRole";
import "@/models/Category"; // ضمان تسجيل موديل التصنيفات قبل عمل populate

// Get all roles
export async function GET() {
  try {
    await connectToDatabase();
    
    // فحص سلامة الموديلات قبل الطلب
    if (!CustomRole) {
      console.error("CustomRole model not found");
      return NextResponse.json({ error: "Model error" }, { status: 500 });
    }

    const roles = await CustomRole.find({}).populate("categoryId").lean();
    
    // التأكد من أن كل دور يحتوي على بيانات أساسية حتى لو فشل الـ populate
    const safeRoles = (roles || []).map(role => ({
      ...role,
      categoryId: role.categoryId || { name: 'Uncategorized', _id: 'none' }
    }));

    return NextResponse.json(safeRoles);
  } catch (error: any) {
    console.error("CRITICAL API ERROR [/api/admin/roles]:", error);
    // إرجاع مصفوفة فارغة مع الخطأ لتجنب انهيار الفرونت إند
    return NextResponse.json({ 
      error: error.message || "Internal Server Error",
      roles: [] 
    }, { status: 500 });
  }
}

// Add a new role
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, categoryId, color, discordRoleId } = body;

    if (!name || !categoryId || !discordRoleId) {
      return NextResponse.json({ error: "Name, category, and Discord Role ID are required" }, { status: 400 });
    }

    const newRole = await CustomRole.create({ name, categoryId, color, discordRoleId });
    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}

// Delete a role
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await CustomRole.findByIdAndDelete(id);
    return NextResponse.json({ message: "Role deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
