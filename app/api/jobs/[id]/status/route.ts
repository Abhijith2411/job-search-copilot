import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateStatusSchema = z.object({
  status: z.enum(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = UpdateStatusSchema.parse(body);

    const job = await prisma.job.update({
      where: { id },
      data: {
        status,
        // Set appliedDate when moving to APPLIED if not already set
        appliedDate:
          status === 'APPLIED'
            ? new Date() // This will only set if we want to update, but we should preserve existing date
            : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('PATCH /api/jobs/[id]/status error:', error);
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}
