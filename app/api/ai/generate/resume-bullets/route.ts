import { prisma } from '@/lib/db';
import { generateWithOpenRouter } from '@/lib/openrouter';
import { getResumeBulletsPrompt, getResumeBulletsSystemPrompt } from '@/lib/prompts/resumeBulletsPrompt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GenerateResumeBulletsSchema = z.object({
  jobId: z.string(),
  resumeContent: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, resumeContent } = GenerateResumeBulletsSchema.parse(body);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const prompt = getResumeBulletsPrompt(
      job.title,
      job.company,
      job.description,
      resumeContent
    );
    const systemPrompt = getResumeBulletsSystemPrompt();

    const output = await generateWithOpenRouter({
      prompt,
      systemPrompt,
    });

    const generation = await prisma.aIGeneration.create({
      data: {
        jobId,
        generationType: 'RESUME_BULLETS',
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
    console.error('Resume bullets generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate resume bullets' },
      { status: 500 }
    );
  }
}
