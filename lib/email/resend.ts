import { Resend } from 'resend';

// Initialize Resend client lazily to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');
  }
  return resend;
}

export interface NewIdeasEmailData {
  to: string;
  userName: string;
  ideas: Array<{
    title: string;
    description: string;
    source: string;
    score: number;
    url: string;
  }>;
  totalIdeas: number;
}

/**
 * Send email notification about new ideas
 */
export async function sendNewIdeasEmail(data: NewIdeasEmailData) {
  try {
    const { to, userName, ideas, totalIdeas } = data;

    const result = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM || 'AI Idea Analyzer <noreply@yourdomain.com>',
      to,
      subject: `🚀 ${totalIdeas} New Business Ideas Added Today!`,
      html: generateNewIdeasEmailHTML(data),
    });

    console.log('[Email] Successfully sent new ideas email to:', to);
    return result;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    throw error;
  }
}

/**
 * Generate HTML for new ideas email
 */
function generateNewIdeasEmailHTML(data: NewIdeasEmailData): string {
  const { userName, ideas, totalIdeas } = data;

  const ideasHTML = ideas
    .map(
      (idea) => `
    <div style="background: #f9fafb; border-left: 4px solid #8b5cf6; padding: 16px; margin-bottom: 16px; border-radius: 8px;">
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">
        ${idea.title}
      </h3>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
        ${idea.description.slice(0, 200)}${idea.description.length > 200 ? '...' : ''}
      </p>
      <div style="display: flex; gap: 12px; align-items: center;">
        <span style="background: #8b5cf6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
          ${idea.source}
        </span>
        <span style="color: #10b981; font-weight: 600; font-size: 14px;">
          ⬆ ${idea.score} upvotes
        </span>
        <a href="${idea.url}" style="color: #8b5cf6; text-decoration: none; font-size: 14px; margin-left: auto;">
          View Details →
        </a>
      </div>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Business Ideas</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
        AI Idea Analyzer
      </h1>
      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
        Your Daily Business Ideas Digest
      </p>
    </div>

    <!-- Main Content -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <h2 style="margin: 0 0 8px 0; color: #1f2937; font-size: 24px;">
        Hi ${userName} 👋
      </h2>

      <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
        We've collected <strong style="color: #8b5cf6;">${totalIdeas} new business ideas</strong> from Reddit, Product Hunt, and Hacker News today. Here are the top ${ideas.length}:
      </p>

      <!-- Ideas List -->
      ${ideasHTML}

      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}"
           style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Analyze More Ideas
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
        You're receiving this email because you subscribed to new idea notifications.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        <a href="${process.env.NEXTAUTH_URL}/settings" style="color: #8b5cf6; text-decoration: none;">
          Manage preferences
        </a>
        ·
        <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #6b7280; text-decoration: none;">
          Unsubscribe
        </a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Send analysis complete email
 */
export async function sendAnalysisCompleteEmail(data: {
  to: string;
  userName: string;
  ideaTitle: string;
  ideaId: number;
}) {
  try {
    const { to, userName, ideaTitle, ideaId } = data;

    const result = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM || 'AI Idea Analyzer <noreply@yourdomain.com>',
      to,
      subject: `✅ Your Analysis is Complete: ${ideaTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">
        Hi ${userName} 👋
      </h2>

      <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
        Great news! We've completed the comprehensive 8-stage analysis for:
      </p>

      <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 24px; border-radius: 8px;">
        <h3 style="margin: 0; color: #1f2937; font-size: 18px;">
          ${ideaTitle}
        </h3>
      </div>

      <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
        Your analysis includes market research, competitive intelligence, revenue projections, and actionable go-to-market strategies.
      </p>

      <div style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/ideas/${ideaId}"
           style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          View Full Analysis
        </a>
      </div>

    </div>
  </div>
</body>
</html>
      `,
    });

    console.log('[Email] Successfully sent analysis complete email to:', to);
    return result;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    throw error;
  }
}
