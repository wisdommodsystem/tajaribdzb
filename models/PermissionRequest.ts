import mongoose, { Schema, Document } from "mongoose";

export interface IPermissionRequest extends Document {
  userId: string;
  username: string;
  type: "Pic Perm" | "Activity Perm" | "Link Perm";
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const PermissionRequestSchema = new Schema<IPermissionRequest>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["Pic Perm", "Activity Perm", "Link Perm"],
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"],
      default: "pending" 
    },
  },
  { timestamps: true }
);

export default mongoose.models.PermissionRequest || 
  mongoose.model<IPermissionRequest>("PermissionRequest", PermissionRequestSchema);
