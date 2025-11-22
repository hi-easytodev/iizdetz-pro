import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { IdeaAnalysisPDF } from '@/lib/pdf/IdeaAnalysisPDF';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/export/pdf/[ideaId]
 *
 * Exports a complete idea analysis as a beautifully formatted PDF
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId: ideaIdStr } = await params;
    const ideaId = parseInt(ideaIdStr);

    if (isNaN(ideaId)) {
      return NextResponse.json({ error: 'Invalid idea ID' }, { status: 400 });
    }

    // Fetch idea details
    const idea = await db.getIdeaById(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Fetch all analyses for this idea
    const analyses = await db.getAnalysesByIdeaId(ideaId);

    if (!analyses || analyses.length === 0) {
      return NextResponse.json(
        { error: 'No analysis found for this idea' },
        { status: 404 }
      );
    }

    // Transform analyses into the format expected by PDF component
    const results: Record<string, any> = {};
    analyses.forEach((analysis: any) => {
      const content = typeof analysis.content === 'string'
        ? JSON.parse(analysis.content)
        : analysis.content;

      results[analysis.stage] = {
        stage: analysis.stage,
        analysis: analysis.markdown_content || content.analysis || '',
        citations: content.citations || [],
        relatedQuestions: content.relatedQuestions || [],
      };
    });

    // Generate PDF
    const pdfDocument = IdeaAnalysisPDF({
      idea: {
        title: idea.title,
        description: idea.description,
        category: idea.category || [],
        createdAt: idea.created_at,
      },
      results,
    }) as any;

    // Render to stream
    const stream = await renderToStream(pdfDocument);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF with proper headers
    const filename = `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
