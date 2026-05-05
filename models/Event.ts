import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, default: "Discord" },
  imageUrl: { type: String },
  eventUrl: { type: String },
  type: { type: String, enum: ["Lecture", "Discussion", "Tournament", "General"], default: "General" },
  status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
