import { prisma } from '@/lib/db';
import { generateWithOpenRouter } from '@/lib/openrouter';
import { getCompanyBriefPrompt, getCompanyBriefSystemPrompt } from '@/lib/prompts/companyBriefPrompt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GenerateCompanyBriefSchema = z.object({
  jobId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId } = GenerateCompanyBriefSchema.parse(body);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const prompt = getCompanyBriefPrompt(job.company, job.title);
    const systemPrompt = getCompanyBriefSystemPrompt();

    const output = await generateWithOpenRouter({
      prompt,
      systemPrompt,
    });

    const generation = await prisma.aIGeneration.create({
      data: {
        jobId,
        generationType: 'COMPANY_BRIEF',
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
    console.error('Company brief generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate company brief' },
      { status: 500 }
    );
  }
}
