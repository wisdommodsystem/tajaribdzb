import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug?: string;
  icon?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true }, // إزالة unique: true
  slug: { type: String }, // إزالة unique: true
  icon: { type: String, default: "Tag" },
}, { 
  timestamps: true,
  strict: false // السماح بحقول إضافية غير معرفة
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
