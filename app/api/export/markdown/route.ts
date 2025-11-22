import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAnalysisResults } from '@/lib/ai/pipeline';
import { generateMarkdownReport, generateFilename } from '@/lib/export/markdown';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ideaId = searchParams.get('ideaId');

  if (!ideaId) {
    return NextResponse.json(
      { error: 'ideaId is required' },
      { status: 400 }
    );
  }

  try {
    // Get idea from database
    const idea = await db.getIdeaById(parseInt(ideaId, 10));

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Get analysis results
    const analysisResults = await getAnalysisResults(parseInt(ideaId, 10));

    if (!analysisResults) {
      return NextResponse.json(
        { error: 'No analysis results found for this idea' },
        { status: 404 }
      );
    }

    // Generate markdown
    const markdown = generateMarkdownReport(
      {
        title: idea.title,
        description: idea.description,
        categories: idea.category,
        sourceUrl: idea.source_url,
        score: idea.score,
      },
      analysisResults
    );

    // Generate filename
    const filename = generateFilename(idea.title, 'md');

    // Return as downloadable file
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export analysis' },
      { status: 500 }
    );
  }
}
