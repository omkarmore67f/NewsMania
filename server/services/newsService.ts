import axios from 'axios';
import { ArticleModel } from '../models/Article';

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

// Category Query Map to target exact tech keywords using NewsData.io query params
const CATEGORY_MAP: Record<string, { q?: string; category: string }> = {
  'AI': { q: 'artificial intelligence OR LLM OR generative AI', category: 'technology' },
  'Programming': { q: 'programming OR software engineering OR coding', category: 'technology' },
  'Java': { q: 'java programming OR jdk', category: 'technology' },
  'React': { q: 'reactjs OR react framework OR react native', category: 'technology' },
  'Cloud': { q: 'cloud computing OR serverless OR microservices', category: 'technology' },
  'Cyber Security': { q: 'cybersecurity OR malware OR cryptography OR infosec', category: 'technology' },
  'Startups': { q: 'tech startup OR venture capital OR y combinator', category: 'business' },
  'Business': { category: 'business' },
  'Current Affairs': { category: 'top' }
};

interface CacheEntry {
  results: any[];
  nextPage: string | null;
  timestamp: number;
}

// In-Memory API Cache to stay strictly within free plan limits (200 requests/day)
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache duration

/**
 * Fetch raw articles from NewsData.io with query parameters and pagination
 */
async function fetchNewsFromApiRaw(category: string, pageToken?: string): Promise<{ results: any[]; nextPage: string | null } | null> {
  if (!NEWSDATA_API_KEY || NEWSDATA_API_KEY === 'MY_NEWSDATA_API_KEY') {
    return null;
  }

  const mapping = CATEGORY_MAP[category] || { category: 'technology' };
  const params: any = {
    apikey: NEWSDATA_API_KEY,
    category: mapping.category,
    language: 'en'
  };

  if (mapping.q) {
    params.q = mapping.q;
  }
  if (pageToken) {
    params.page = pageToken;
  }

  try {
    const url = 'https://newsdata.io/api/1/news';
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.status === 'success') {
      return {
        results: response.data.results || [],
        nextPage: response.data.nextPage || null
      };
    }
    return null;
  } catch (error: any) {
    console.error(`[NEWS SERVICE] Error calling NewsData.io for category: ${category}, error:`, error.message);
    throw error;
  }
}

/**
 * Cached NewsData.io fetch wrapper
 */
async function fetchNewsFromApiCached(category: string, pageToken?: string): Promise<{ results: any[]; nextPage: string | null } | null> {
  const cacheKey = `${category}_${pageToken || 'first'}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[NEWS SERVICE] Returning cached NewsData.io API response for key: ${cacheKey}`);
    return {
      results: cached.results,
      nextPage: cached.nextPage
    };
  }

  const rawData = await fetchNewsFromApiRaw(category, pageToken);
  if (rawData) {
    apiCache.set(cacheKey, {
      results: rawData.results,
      nextPage: rawData.nextPage,
      timestamp: Date.now()
    });
  }
  return rawData;
}

/**
 * Reusable service that crawls multiple pages of news for a single category using the nextPage cursor
 */
export async function fetchCategoryMultiPage(category: string, maxPages: number = 2): Promise<any[]> {
  let allCategoryArticles: any[] = [];
  let nextPageToken: string | null = null;

  for (let i = 0; i < maxPages; i++) {
    try {
      const response: any = await fetchNewsFromApiCached(category, nextPageToken || undefined);
      if (!response || !response.results || response.results.length === 0) {
        break;
      }

      allCategoryArticles.push(...response.results);
      
      if (!response.nextPage) {
        break;
      }
      nextPageToken = response.nextPage;
    } catch (e) {
      // Exit pagination loop on failure to stay safe
      break;
    }
  }
  return allCategoryArticles;
}

/**
 * Synchronizes external news across all major technology categories, merges and deduplicates results
 */
export async function fetchAndSeedExternalNews(): Promise<number> {
  if (!NEWSDATA_API_KEY || NEWSDATA_API_KEY === 'MY_NEWSDATA_API_KEY') {
    console.log('[NEWS SERVICE] No NEWSDATA_API_KEY configured. Skipping live news synchronization.');
    return 0;
  }

  try {
    console.log('[NEWS SERVICE] Initiating sync for major categories...');
    let mergedArticles: any[] = [];

    // Fetch news separately for all major categories (Req 6)
    const categoriesToFetch = Object.keys(CATEGORY_MAP);
    for (const category of categoriesToFetch) {
      console.log(`[NEWS SERVICE] Fetching news for category: ${category}...`);
      // Fetch 2 pages of articles for each category using cursor pagination (Req 2 & 3)
      const categoryArticles = await fetchCategoryMultiPage(category, 2);
      
      // Inject category tag
      const tagged = categoryArticles.map(art => ({ ...art, mappedCategory: category }));
      mergedArticles.push(...tagged);
    }

    console.log(`[NEWS SERVICE] Total articles merged: ${mergedArticles.length}. Starting deduplication...`);

    // Merge and deduplicate articles (Req 7)
    const deduplicatedMap = new Map<string, any>();
    mergedArticles.forEach((art) => {
      if (!art.title || !art.content) return;
      const normalizedTitle = art.title.trim().toLowerCase();
      // Keep first occurrence
      if (!deduplicatedMap.has(normalizedTitle)) {
        deduplicatedMap.set(normalizedTitle, art);
      }
    });

    const uniqueArticles = Array.from(deduplicatedMap.values());
    console.log(`[NEWS SERVICE] Unique articles after deduplication: ${uniqueArticles.length}`);

    let addedCount = 0;
    for (const item of uniqueArticles) {
      // Check if article with similar title already exists in the database
      const exists = await ArticleModel.findOne({ title: item.title });
      if (exists) continue;

      const readTime = Math.max(3, Math.ceil(item.content.split(' ').length / 200));

      await ArticleModel.create({
        title: item.title,
        content: item.content,
        summary: item.description || '',
        keyTakeaways: [],
        importantFacts: [],
        author: item.creator ? item.creator[0] : 'NewsData Editorial',
        source: item.source_id || 'External News',
        date: item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
        readTime,
        category: item.mappedCategory,
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        viewsCount: Math.floor(Math.random() * 40),
        isFeatured: false,
        isBreaking: false,
        isAIPick: false
      });

      addedCount++;
    }

    console.log(`[NEWS SERVICE] Synchronization completed. Seeded ${addedCount} new articles into the database.`);
    return addedCount;
  } catch (error: any) {
    console.error('[NEWS SERVICE] Severe error during external synchronization:', error.message);
    return 0;
  }
}
