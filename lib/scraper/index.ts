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

  // Subreddits to monitor for business ideas
  const subreddits = [
    { name: 'SaaS', category: 'SaaS' },
    { name: 'EntrepreneurRideAlong', category: 'Entrepreneurship' },
    { name: 'Entrepreneur', category: 'Business' },
    { name: 'startups', category: 'Startups' },
    { name: 'SideProject', category: 'Side Projects' },
    { name: 'IMadeThis', category: 'Tech' },
    { name: 'roastmystartup', category: 'Startups' },
    { name: 'Startup_Ideas', category: 'Ideas' },
  ];

  try {
    // Fetch from each subreddit in parallel
    const results = await Promise.allSettled(
      subreddits.map(async (sub) => {
        try {
          // Use Reddit's JSON API (no auth required for public posts)
          const url = `https://www.reddit.com/r/${sub.name}/hot.json?limit=10`;

          const response = await fetch(url, {
            headers: {
              'User-Agent': 'AI-Idea-Analyzer/1.0',
            },
          });

          if (!response.ok) {
            console.warn(`[Scraper] Reddit API error for r/${sub.name}: ${response.status}`);
            return [];
          }

          const data = await response.json();
          const subIdeas: ScrapedIdea[] = [];

          for (const post of data.data.children) {
            const postData = post.data;

            // Filter for relevant posts (exclude stickied, removed, etc.)
            if (
              postData.stickied ||
              postData.removed ||
              postData.over_18 ||
              postData.score < 5 // Minimum score threshold
            ) {
              continue;
            }

            // Extract title and description
            const title = postData.title;
            const description =
              postData.selftext ||
              postData.url ||
              title.slice(0, 200);

            // Skip if description is too short
            if (description.length < 20) continue;

            subIdeas.push({
              title,
              description,
              sourceUrl: `https://www.reddit.com${postData.permalink}`,
              source: 'reddit',
              categories: [sub.category, `r/${sub.name}`],
              metadata: {
                upvotes: postData.ups,
                comments: postData.num_comments,
                author: postData.author,
                createdAt: new Date(postData.created_utc * 1000),
              },
            });
          }

          console.log(`[Scraper] Found ${subIdeas.length} ideas from r/${sub.name}`);
          return subIdeas;
        } catch (error) {
          console.error(`[Scraper] Error scraping r/${sub.name}:`, error);
          return [];
        }
      })
    );

    // Combine all results
    for (const result of results) {
      if (result.status === 'fulfilled') {
        ideas.push(...result.value);
      }
    }

    console.log(`[Scraper] Total Reddit ideas collected: ${ideas.length}`);
  } catch (error) {
    console.error('[Scraper] Error in Reddit scraping:', error);
  }

  return ideas;
}

/**
 * Scrape ideas from Product Hunt
 */
async function scrapeProductHunt(): Promise<ScrapedIdea[]> {
  const ideas: ScrapedIdea[] = [];

  try {
    // Product Hunt doesn't have a public JSON API, but we can use their RSS feed
    // or scrape the public-facing pages. For now, using a simple approach.

    // Alternative: Use unofficial Product Hunt API endpoint
    const response = await fetch('https://www.producthunt.com/frontend/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Idea-Analyzer/1.0',
      },
      body: JSON.stringify({
        query: `
          query {
            posts(first: 20, order: VOTES) {
              edges {
                node {
                  id
                  name
                  tagline
                  description
                  url
                  votesCount
                  commentsCount
                  createdAt
                  user {
                    name
                  }
                  topics {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      console.warn('[Scraper] Product Hunt API returned:', response.status);
      // Fallback: Try alternative approach or skip
      return ideas;
    }

    const data = await response.json();

    if (data.data?.posts?.edges) {
      for (const edge of data.data.posts.edges) {
        const post = edge.node;

        const categories = post.topics?.edges?.map((t: any) => t.node.name) || ['Product Hunt'];

        ideas.push({
          title: post.name,
          description: post.tagline || post.description || post.name,
          sourceUrl: post.url || `https://www.producthunt.com/posts/${post.id}`,
          source: 'producthunt',
          categories: categories.slice(0, 3), // Top 3 categories
          metadata: {
            upvotes: post.votesCount,
            comments: post.commentsCount,
            author: post.user?.name,
            createdAt: new Date(post.createdAt),
          },
        });
      }

      console.log(`[Scraper] Found ${ideas.length} ideas from Product Hunt`);
    }
  } catch (error) {
    console.error('[Scraper] Error scraping Product Hunt:', error);
    // Product Hunt API might be rate-limited or changed, so we continue gracefully
  }

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
