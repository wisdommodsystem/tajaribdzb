import mongoose from "mongoose";

const GiveawaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  endDate: { type: Date, required: true },
  winnersCount: { type: Number, default: 1 },
  imageUrl: { type: String },
  participants: [{ 
    discordId: String,
    username: String,
    avatar: String,
    joinedAt: { type: Date, default: Date.now }
  }],
  winners: [{
    discordId: String,
    username: String,
    avatar: String
  }],
  status: { 
    type: String, 
    enum: ["Active", "Ended", "Cancelled"], 
    default: "Active" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Giveaway || mongoose.model("Giveaway", GiveawaySchema);
