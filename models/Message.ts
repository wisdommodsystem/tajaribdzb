import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  senderId: string; // discordId or "admin"
  senderName: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
