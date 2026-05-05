import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  discordId: string;
  username: string;
  avatar: string;
  selectedRoles: mongoose.Types.ObjectId[];
  lastSeen: Date;
}

const UserProfileSchema: Schema = new Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String },
  avatar: { type: String },
  selectedRoles: [{ type: Schema.Types.ObjectId, ref: "CustomRole" }],
  lastSeen: { type: Date, default: Date.now }
});

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
