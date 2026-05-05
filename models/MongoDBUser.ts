// @ts-ignore
import mongoose, { Schema, Document } from "mongoose";

// تصحيح الـ Interface لتشمل كل الحقول المستخدمة في الـ Schema
export interface IMongoDBUser extends Document {
  userId: string;
  username: string;
  avatar: string | null;
  textLevel: number;
  totalXP: number;
  combinedScore: number;
  totalVoiceMinutes: number; // حقل جديد
  voiceLevel: number;        // حقل جديد
  lastMessageTimestamp?: number; 
  createdAt: Date;
  updatedAt: Date;
}

const MongoDBUserSchema = new Schema<IMongoDBUser>(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String, default: null },
    combinedScore: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    textLevel: { type: Number, default: 0 },
    totalVoiceMinutes: { type: Number, default: 0 },
    voiceLevel: { type: Number, default: 0 },
    lastMessageTimestamp: { type: Number },
    // من الأفضل ترك Mongoose يتعامل مع التواريخ تلقائياً عبر timestamps: true
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { 
    collection: "users",
    // تفعيل التحديث التلقائي لـ createdAt و updatedAt
    timestamps: true 
  }
);

// تصدير الموديل مع التحقق من وجوده مسبقاً لتفادي مشاكل الـ Hot Reload في Next.js
export default mongoose.models.MongoDBUser || 
  mongoose.model<IMongoDBUser>("MongoDBUser", MongoDBUserSchema);