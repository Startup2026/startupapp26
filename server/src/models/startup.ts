import mongoose, { Schema, Document } from 'mongoose';

export interface IStartup extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
}

const StartupSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
}, { timestamps: true });

export const Startup = mongoose.model<IStartup>('Startup', StartupSchema);
