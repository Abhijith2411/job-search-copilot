'use client';

import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';
import { Status, Job } from '@/lib/types';

interface JobColumnProps {
  status: Status;
  label: string;
  jobs: Job[];
  onJobDeleted: (jobId: string) => void;
}

export default function JobColumn({
  status,
  label,
  jobs,
  onJobDeleted,
}: JobColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-surface-1 rounded-lg border border-hairline p-4 min-h-96"
    >
      <div className="mb-4">
        <h3 className="text-card-title font-medium text-ink">{label}</h3>
        <p className="text-body-sm text-ink-subtle mt-1">{jobs.length} jobs</p>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-body-sm text-ink-tertiary text-center py-8">
            No jobs yet
          </p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobDeleted={onJobDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
