import mongoose from "mongoose";

const BroadcastNotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Announcement", "Alert", "Event", "Gift"], 
    default: "Announcement" 
  },
  target: { 
    type: String, 
    enum: ["All", "Specific"], 
    default: "All" 
  },
  recipientId: { type: String }, // Discord ID if target is Specific
  readBy: [{ type: String }], // Array of Discord IDs who read it
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.BroadcastNotification || mongoose.model("BroadcastNotification", BroadcastNotificationSchema);
