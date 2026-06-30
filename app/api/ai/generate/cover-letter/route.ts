import { prisma } from '@/lib/db';
import { generateWithOpenRouter } from '@/lib/openrouter';
import { getCoverLetterPrompt, getCoverLetterSystemPrompt } from '@/lib/prompts/coverLetterPrompt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GenerateCoverLetterSchema = z.object({
  jobId: z.string(),
  resumeContent: z.string(),
  tone: z.string().optional().default('professional'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, resumeContent, tone } = GenerateCoverLetterSchema.parse(body);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const prompt = getCoverLetterPrompt(
      job.title,
      job.company,
      job.description,
      resumeContent,
      tone
    );
    const systemPrompt = getCoverLetterSystemPrompt();

    const output = await generateWithOpenRouter({
      prompt,
      systemPrompt,
    });

    const generation = await prisma.aIGeneration.create({
      data: {
        jobId,
        generationType: 'COVER_LETTER',
        prompt,
        output,
        model: 'openrouter/auto',
      },
    });

    return NextResponse.json({ generation, output });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Cover letter generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
