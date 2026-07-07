import { Schema, model, Document } from 'mongoose';

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  interests: string[];
  preferredCategories: string[];
  history: string[]; // List of article IDs read (stored as strings in interface)
  createdAt: string;
  updatedAt: string;
}

export interface UserDocument extends Omit<IUser, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    interests: { type: [String], default: [] },
    preferredCategories: { type: [String], default: [] },
    history: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const UserModel = model<UserDocument>('User', UserSchema);
