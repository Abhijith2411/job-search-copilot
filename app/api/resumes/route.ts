import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateResumeSchema = z.object({
  content: z.string().min(10, 'Resume must be at least 10 characters'),
});

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = CreateResumeSchema.parse(body);

    // Set all other resumes to inactive
    await prisma.resume.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const resume = await prisma.resume.create({
      data: {
        content,
        isActive: true,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Resume creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create resume' },
      { status: 500 }
    );
  }
}
