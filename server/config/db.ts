import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database JSON Structure
interface DatabaseSchema {
  users: any[];
  articles: any[];
  bookmarks: any[];
  analytics: {
    views: any[];
    dailyActiveUsers: any[];
    weeklyReads: { date: string; count: number }[];
    monthlyReads: { date: string; count: number }[];
  };
}

const DEFAULT_DB: DatabaseSchema = {
  users: [],
  articles: [],
  bookmarks: [],
  analytics: {
    views: [],
    dailyActiveUsers: [],
    weeklyReads: [],
    monthlyReads: []
  }
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error loading database file, resetting...', e);
    }
    this.saveToDisk(DEFAULT_DB);
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  private saveToDisk(dataToSave: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing to database file', e);
    }
  }

  public save() {
    this.saveToDisk(this.data);
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.save();
  }
}

export const dbInstance = new Database();

export class Model<T extends { id: string }> {
  private collectionKey: keyof DatabaseSchema;

  constructor(collectionKey: keyof DatabaseSchema) {
    this.collectionKey = collectionKey;
  }

  private getCollection(): T[] {
    return dbInstance.get(this.collectionKey) as unknown as T[];
  }

  private setCollection(collection: T[]) {
    dbInstance.set(this.collectionKey, collection);
  }

  public find(filter?: Partial<T> | ((item: T) => boolean)): T[] {
    const collection = this.getCollection();
    if (!filter) return collection;
    if (typeof filter === 'function') {
      return collection.filter(filter);
    }
    return collection.filter((item) => {
      for (const key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  public findOne(filter: Partial<T> | ((item: T) => boolean)): T | null {
    const results = this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  public findById(id: string): T | null {
    return this.findOne({ id } as any);
  }

  public create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const collection = this.getCollection();
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as T;

    collection.push(newItem);
    this.setCollection(collection);
    return newItem;
  }

  public findByIdAndUpdate(id: string, updates: Partial<T>): T | null {
    const collection = this.getCollection();
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...collection[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    collection[index] = updatedItem;
    this.setCollection(collection);
    return updatedItem;
  }

  public findByIdAndDelete(id: string): boolean {
    const collection = this.getCollection();
    const filtered = collection.filter((item) => item.id !== id);
    if (filtered.length === collection.length) return false;
    this.setCollection(filtered);
    return true;
  }
}
