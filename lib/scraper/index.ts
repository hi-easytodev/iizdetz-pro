/**
 * Idea Scraper Service
 *
 * Collects business ideas from various sources:
 * - Reddit (r/SaaS, r/EntrepreneurRideAlong, r/Entrepreneur)
 * - Product Hunt
 * - Indie Hackers
 * - Hacker News
 * - Twitter/X
 */

export interface ScrapedIdea {
  title: string;
  description: string;
  sourceUrl: string;
  source: 'reddit' | 'producthunt' | 'indiehackers' | 'hackernews' | 'twitter';
  categories: string[];
  metadata?: {
    upvotes?: number;
    comments?: number;
    author?: string;
    createdAt?: Date;
  };
}

/**
 * Scrape ideas from Reddit
 */
async function scrapeReddit(): Promise<ScrapedIdea[]> {
  const ideas: ScrapedIdea[] = [];

  // Subreddits to monitor
  const subreddits = [
    'SaaS',
    'EntrepreneurRideAlong',
    'Entrepreneur',
    'startups',
    'SideProject',
    'IMadeThis',
  ];

  // TODO: Implement Reddit API integration
  // For now, return mock data for demonstration
  console.log('[Scraper] Reddit scraping not yet implemented');

  return ideas;
}

/**
 * Scrape ideas from Product Hunt
 */
async function scrapeProductHunt(): Promise<ScrapedIdea[]> {
  const ideas: ScrapedIdea[] = [];

  // TODO: Implement Product Hunt API integration
  console.log('[Scraper] Product Hunt scraping not yet implemented');

  return ideas;
}

/**
 * Scrape ideas from Indie Hackers
 */
async function scrapeIndieHackers(): Promise<ScrapedIdea[]> {
  const ideas: ScrapedIdea[] = [];

  // TODO: Implement Indie Hackers scraping
  console.log('[Scraper] Indie Hackers scraping not yet implemented');

  return ideas;
}

/**
 * Scrape ideas from Hacker News
 */
async function scrapeHackerNews(): Promise<ScrapedIdea[]> {
  const ideas: ScrapedIdea[] = [];

  // Using HN Algolia API to find "Show HN" posts
  try {
    const response = await fetch(
      'https://hn.algolia.com/api/v1/search?tags=show_hn&hitsPerPage=20'
    );
    const data = await response.json();

    for (const hit of data.hits) {
      if (hit.title && hit.url) {
        ideas.push({
          title: hit.title.replace(/^Show HN:\s*/i, ''),
          description: hit.story_text || hit.title,
          sourceUrl: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          source: 'hackernews',
          categories: ['Tech', 'Show HN'],
          metadata: {
            upvotes: hit.points,
            comments: hit.num_comments,
            author: hit.author,
            createdAt: new Date(hit.created_at),
          },
        });
      }
    }

    console.log(`[Scraper] Found ${ideas.length} ideas from Hacker News`);
  } catch (error) {
    console.error('[Scraper] Error scraping Hacker News:', error);
  }

  return ideas;
}

/**
 * Main scraper function - collects ideas from all sources
 */
export async function collectIdeas(): Promise<ScrapedIdea[]> {
  console.log('[Scraper] Starting idea collection...');

  const startTime = Date.now();

  // Run all scrapers in parallel
  const [reddit, producthunt, indiehackers, hackernews] = await Promise.allSettled([
    scrapeReddit(),
    scrapeProductHunt(),
    scrapeIndieHackers(),
    scrapeHackerNews(),
  ]);

  // Combine results
  const allIdeas: ScrapedIdea[] = [];

  if (reddit.status === 'fulfilled') allIdeas.push(...reddit.value);
  if (producthunt.status === 'fulfilled') allIdeas.push(...producthunt.value);
  if (indiehackers.status === 'fulfilled') allIdeas.push(...indiehackers.value);
  if (hackernews.status === 'fulfilled') allIdeas.push(...hackernews.value);

  const elapsed = Date.now() - startTime;

  console.log(`[Scraper] Collected ${allIdeas.length} ideas in ${elapsed}ms`);

  return allIdeas;
}

/**
 * Filter and deduplicate ideas
 */
export function deduplicateIdeas(ideas: ScrapedIdea[]): ScrapedIdea[] {
  const seen = new Set<string>();
  const unique: ScrapedIdea[] = [];

  for (const idea of ideas) {
    // Create a fingerprint based on title and source
    const fingerprint = `${idea.title.toLowerCase().trim()}-${idea.source}`;

    if (!seen.has(fingerprint)) {
      seen.add(fingerprint);
      unique.push(idea);
    }
  }

  console.log(`[Scraper] Deduplicated ${ideas.length} → ${unique.length} ideas`);

  return unique;
}

/**
 * Score and rank ideas based on engagement metrics
 */
export function scoreIdeas(ideas: ScrapedIdea[]): ScrapedIdea[] {
  return ideas.sort((a, b) => {
    const scoreA = (a.metadata?.upvotes || 0) + (a.metadata?.comments || 0) * 2;
    const scoreB = (b.metadata?.upvotes || 0) + (b.metadata?.comments || 0) * 2;
    return scoreB - scoreA;
  });
}
