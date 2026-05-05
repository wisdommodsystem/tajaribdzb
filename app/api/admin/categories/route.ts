import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import CustomRole from "@/models/CustomRole";

// Get all categories
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({});
    const safeCategories = (categories || []).map(cat => ({
      ...cat.toObject(),
      name: cat.name || 'Unnamed Category'
    }));
    return NextResponse.json(safeCategories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Add a new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, icon } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    
    // إزالة كافة أنواع التحقق اليدوي للسماح بالتكرار المطلق
    // استخدام insertOne خام (raw) لتجنب أي تعارض مع فهارس (indexes) قديمة في الموديل
    const collection = Category.collection;

    // توليد slug عشوائي فريد تماماً لكل عملية إدخال لتجنب تعارض الفهرس القديم slug_1
    const uniqueSlug = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const result = await collection.insertOne({
      name: trimmedName,
      slug: uniqueSlug,
      icon: icon || "Tag",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("[Category API] Category created (Force Mode):", result.insertedId);
    return NextResponse.json({ _id: result.insertedId, name: trimmedName, icon: icon || "Tag" }, { status: 201 });
  } catch (error: any) {
    console.error("[Category API] CRITICAL ERROR:", error);
    
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

// Delete a category
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Check if any roles are using this category
    const rolesCount = await CustomRole.countDocuments({ categoryId: id });
    if (rolesCount > 0) {
      return NextResponse.json({ error: "Cannot delete category while roles are assigned to it" }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
