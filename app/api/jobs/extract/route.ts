import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ExtractSchema = z.object({
  url: z.string().url('Invalid URL'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = ExtractSchema.parse(body);

    // Fetch the job posting page
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Try to extract title and company from common meta tags or page content
    const titleMatch = html.match(
      /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
    ) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
      html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

    const title = titleMatch ? titleMatch[1].trim() : null;

    // For now, return basic extracted data
    // In a real scenario, you might use OpenRouter to parse this more intelligently
    // or use a specialized job parsing library
    return NextResponse.json({
      title: title || 'Untitled Position',
      company: 'Unknown Company', // This would come from meta tags or OpenRouter parsing
      url,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Handle timeout or fetch errors gracefully
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'URL fetch timeout. Please try entering the job details manually.' },
          { status: 408 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('POST /api/jobs/extract error:', error);
    return NextResponse.json(
      { error: 'Failed to extract job information' },
      { status: 500 }
    );
  }
}
