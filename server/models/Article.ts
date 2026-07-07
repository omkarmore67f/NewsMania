import { Schema, model, Document } from 'mongoose';

export interface IArticle {
  id: string;
  title: string;
  content: string;
  summary?: string;
  keyTakeaways?: string[];
  importantFacts?: string[];
  simplifiedContent?: string; // Cache for ELF10 (Explain Like I'm 10)
  author: string;
  source: string;
  date: string;
  readTime: number; // in minutes
  category: string;
  imageUrl: string;
  viewsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isAIPick: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDocument extends Omit<IArticle, 'id'>, Document {
  id: string;
}

const ArticleSchema = new Schema<ArticleDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    keyTakeaways: { type: [String], default: [] },
    importantFacts: { type: [String], default: [] },
    simplifiedContent: { type: String },
    author: { type: String, default: 'NewsMania Editorial' },
    source: { type: String, default: 'NewsMania AI' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readTime: { type: Number, default: 3 },
    category: { type: String, required: true, index: true },
    imageUrl: { type: String, default: '' },
    viewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    isAIPick: { type: Boolean, default: false }
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

export const ArticleModel = model<ArticleDocument>('Article', ArticleSchema);
