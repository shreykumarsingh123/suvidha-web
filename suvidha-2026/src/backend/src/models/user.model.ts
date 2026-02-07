import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {
  mobileNumber: string;
  otp: string;
  otpExpires: Date;
  lastLogin: Date;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  mobileNumber: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpires: { type: Date },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
