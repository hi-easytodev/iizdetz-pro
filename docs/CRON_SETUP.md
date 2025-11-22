# 🕐 Vercel Cron Jobs Setup

This guide explains how to set up automated idea collection using Vercel Cron Jobs.

## Overview

The application automatically collects business ideas from various sources:
- **Hacker News** (Show HN posts) ✅ Implemented
- **Reddit** (r/SaaS, r/Entrepreneur, etc.) 🚧 Planned
- **Product Hunt** 🚧 Planned
- **Indie Hackers** 🚧 Planned

## Configuration

### 1. Cron Schedule

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/collect-ideas",
      "schedule": "0 8 * * *"
    }
  ]
}
```

**Schedule Format:** `0 8 * * *` (8:00 AM UTC daily)

You can modify the schedule using cron syntax:
- `0 8 * * *` - Daily at 8:00 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 0 1 * *` - Monthly on the 1st at midnight

### 2. Environment Variables

Set these environment variables in your Vercel project:

```bash
# Required for production security
CRON_SECRET=your-random-secret-here

# Database connection (already configured)
DATABASE_URL=postgresql://...

# API Keys (optional, for future integrations)
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
PRODUCTHUNT_API_KEY=...
```

**Generate a CRON_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect `vercel.json` and set up the cron job
4. Add environment variables in Vercel dashboard

## API Endpoint

### GET `/api/cron/collect-ideas`

Collects ideas from all configured sources and saves them to the database.

**Authentication:**
- Production: Requires `Authorization: Bearer <CRON_SECRET>` header
- Development: No authentication required

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-01-22T08:00:00.000Z",
  "stats": {
    "collected": 50,
    "unique": 45,
    "saved": 30,
    "skipped": 15,
    "errors": 0
  }
}
```

## Manual Testing

### Development (Local)

```bash
# Start the development server
npm run dev

# Trigger the cron job manually
curl http://localhost:3000/api/cron/collect-ideas \
  -X POST
```

### Production (Vercel)

```bash
# Trigger via Vercel CLI
curl https://your-app.vercel.app/api/cron/collect-ideas \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring

### View Logs in Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to **Logs** tab
3. Filter by **Cron Jobs**
4. Search for `[Cron]` to see collection logs

### Expected Log Output

```
[Cron] Starting idea collection job...
[Scraper] Starting idea collection...
[Scraper] Found 20 ideas from Hacker News
[Scraper] Collected 20 ideas in 1234ms
[Scraper] Deduplicated 20 → 18 ideas
[Cron] Job completed: { collected: 20, unique: 18, saved: 12, skipped: 6 }
```

## Troubleshooting

### Cron job not running

1. Check Vercel dashboard → Settings → Cron Jobs
2. Verify `vercel.json` is in the root directory
3. Redeploy your application
4. Check that you're on a Pro plan (Hobby plans have limited cron support)

### Authentication errors

```json
{ "error": "Unauthorized" }
```

**Solution:** Verify `CRON_SECRET` environment variable is set correctly

### Database errors

**Solution:** Check `DATABASE_URL` and ensure the `ideas` table exists:

```sql
SELECT * FROM ideas LIMIT 1;
```

### No ideas being collected

**Possible causes:**
- API rate limits (Hacker News Algolia API)
- Network issues
- All ideas already exist in database (check `skipped` count)

## Future Enhancements

- [ ] Add Reddit API integration (requires API key)
- [ ] Add Product Hunt API integration (requires API key)
- [ ] Add Indie Hackers scraping
- [ ] Add Twitter/X integration
- [ ] Implement AI-based filtering (only high-quality ideas)
- [ ] Add webhook notifications for new ideas
- [ ] Create admin dashboard for cron job management

## References

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Cron Expression Generator](https://crontab.guru/)
- [Hacker News Algolia API](https://hn.algolia.com/api)
