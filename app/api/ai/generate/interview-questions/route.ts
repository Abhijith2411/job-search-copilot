import { prisma } from '@/lib/db';
import { generateWithOpenRouter } from '@/lib/openrouter';
import { getInterviewQuestionsPrompt, getInterviewQuestionsSystemPrompt } from '@/lib/prompts/interviewQuestionsPrompt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GenerateInterviewQuestionsSchema = z.object({
  jobId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = GenerateInterviewQuestionsSchema.parse(body);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const prompt = getInterviewQuestionsPrompt(
      job.title,
      job.company,
      job.description
    );
    const systemPrompt = getInterviewQuestionsSystemPrompt();

    const output = await generateWithOpenRouter({
      prompt,
      systemPrompt,
    });

    const generation = await prisma.aIGeneration.create({
      data: {
        jobId,
        generationType: 'INTERVIEW_QUESTIONS',
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
    console.error('Interview questions generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate interview questions' },
      { status: 500 }
    );
  }
}
