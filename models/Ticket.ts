import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  discordId: string;
  username: string;
  type: "Suggestions" | "Report" | "General";
  subject: string;
  status: "Open" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["Suggestions", "Report", "General"] 
  },
  subject: { type: String, required: true },
  status: { type: String, default: "Open", enum: ["Open", "Closed"] },
}, { timestamps: true });

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
