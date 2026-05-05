import mongoose, { Schema, Document } from "mongoose";
import "./Category"; // ضمان تحميل موديل التصنيفات أولاً

export interface ICustomRole extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  color?: string;
  discordRoleId: string;
}

const CustomRoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: "Category",
    required: true 
  },
  color: { type: String, default: "#ffffff" },
  discordRoleId: { type: String, required: true },
});

export default mongoose.models.CustomRole || mongoose.model<ICustomRole>("CustomRole", CustomRoleSchema);
