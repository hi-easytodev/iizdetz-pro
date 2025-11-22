# 🔐 User Authentication

## Overview

The AI Idea Analyzer uses NextAuth.js v5 for authentication, supporting multiple OAuth providers. Users can sign in with Google or GitHub to save and manage their idea analyses.

## Features

- ✅ OAuth authentication (Google, GitHub)
- ✅ Automatic user creation on first sign-in
- ✅ JWT-based sessions (no database session storage)
- ✅ User profile with name, email, and avatar
- ✅ Protected routes and API endpoints
- ✅ Personalized analysis history
- ✅ Email notifications (when configured)

## Setup

### 1. Install Dependencies

```bash
npm install next-auth@beta react-icons
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Set Up OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env.local`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: "AI Idea Analyzer"
   - Homepage URL: `http://localhost:3000` (or your domain)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Generate a new client secret
6. Copy Client ID and Client Secret to `.env.local`

### 4. Run Database Migration

```bash
psql $POSTGRES_URL -f lib/db/migrations/002_add_users_and_auth.sql
```

This creates:
- `users` table for storing user profiles
- `user_id` column in `ideas` and `pipeline_runs` tables
- Indexes for performance

## Usage

### Client-Side Authentication

```tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}!</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign In</button>;
}
```

### Server-Side Authentication

```tsx
import { auth } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### API Route Protection

```ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your protected logic here
  return NextResponse.json({ data: 'Protected data' });
}
```

## Architecture

```
┌─────────────────────┐
│   Client (Browser)  │
└──────────┬──────────┘
           │ Sign In
           ▼
┌─────────────────────┐
│  /auth/signin page  │
│  - Google button    │
│  - GitHub button    │
└──────────┬──────────┘
           │ OAuth redirect
           ▼
┌─────────────────────┐
│  OAuth Provider     │
│  (Google/GitHub)    │
└──────────┬──────────┘
           │ Callback
           ▼
┌─────────────────────┐
│ /api/auth/callback  │
│  - Verify token     │
│  - Create/update    │
│    user in DB       │
└──────────┬──────────┘
           │ JWT Session
           ▼
┌─────────────────────┐
│   Protected Routes  │
│  - Saved analyses   │
│  - User profile     │
└─────────────────────┘
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ideas Table (with user_id)

```sql
ALTER TABLE ideas
ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
```

## Components

### AuthButton

Shows sign in/out button with user profile:

```tsx
import { AuthButton } from '@/components/AuthButton';
import { auth } from '@/lib/auth';

export default async function Header() {
  const session = await auth();
  return <AuthButton session={session} />;
}
```

### SessionProvider

Wraps app for client-side session access:

```tsx
// app/layout.tsx
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

## Security Best Practices

1. **Secret Key**: Generate with `openssl rand -base64 32`
2. **HTTPS Only**: Always use HTTPS in production
3. **Callback URLs**: Whitelist only your domains
4. **Session Duration**: Default 30 days (configurable)
5. **CSRF Protection**: Built-in with NextAuth.js
6. **Rate Limiting**: Add to prevent brute force (TODO)

## Troubleshooting

### "Configuration" error

- Ensure all environment variables are set
- Check that `NEXTAUTH_SECRET` is defined
- Verify OAuth credentials are correct

### "Callback URL mismatch"

- Update authorized redirect URIs in OAuth provider
- Format: `https://yourdomain.com/api/auth/callback/{provider}`

### Database connection errors

- Verify `POSTGRES_URL` is correct
- Ensure users table exists (run migration)
- Check database permissions

## Testing

### Manual Test

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click "Continue with Google" or "Continue with GitHub"
4. Authorize the app
5. Verify redirect to homepage
6. Check user is created in database:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
   ```

### Test Protected Route

```tsx
// app/test/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TestPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

## Migration from Public to Authenticated

To migrate existing analyses to require authentication:

1. Keep `user_id` as nullable initially
2. Allow public access for backward compatibility
3. Encourage sign-in with banner
4. After transition period, make `user_id` required

## Future Enhancements

- [ ] Email/password authentication
- [ ] Two-factor authentication (2FA)
- [ ] Social auth (Twitter, LinkedIn)
- [ ] Magic link sign-in
- [ ] Role-based access control (RBAC)
- [ ] Team/organization support
- [ ] SSO for enterprises
- [ ] Account deletion flow

## License

Uses NextAuth.js (ISC License)
