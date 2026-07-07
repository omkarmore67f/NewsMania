import { Schema, model, Document } from 'mongoose';

export interface IBookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface BookmarkDocument extends Omit<IBookmark, 'id'>, Document {
  id: string;
}

const BookmarkSchema = new Schema<BookmarkDocument>(
  {
    userId: { type: String, required: true, index: true },
    articleId: { type: String, required: true, index: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
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

export const BookmarkModel = model<BookmarkDocument>('Bookmark', BookmarkSchema);
