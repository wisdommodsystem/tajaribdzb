import mongoose, { Schema, Document } from "mongoose";

export interface IStaffApplication extends Document {
  userId: string;
  username: string;
  displayName: string;
  age: string;
  contribution: string;
  department: "Verification Team" | "Event Hoster" | "Server Management";
  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffApplicationSchema = new Schema<IStaffApplication>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    age: { type: String, required: true },
    contribution: { type: String, required: true },
    department: { 
      type: String, 
      enum: ["Verification Team", "Event Hoster", "Server Management"],
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"],
      default: "pending" 
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.StaffApplication || 
  mongoose.model<IStaffApplication>("StaffApplication", StaffApplicationSchema);
