'use client';

import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';
import { Job } from '@/lib/types';

interface JobColumnProps {
  status: string;
  label: string;
  jobs: Job[];
  onJobDeleted: (jobId: string) => void;
  onJobSelect: (job: Job) => void;
}

export default function JobColumn({ status, label, jobs, onJobDeleted, onJobSelect }: JobColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-linear-surface-3 rounded-lg p-4 min-h-96 flex flex-col border border-linear-hairline"
    >
      <div className="mb-4 pb-3 border-b border-linear-hairline">
        <h2 className="text-headline font-display font-semibold text-linear-ink">
          {label}
        </h2>
        <p className="text-caption text-linear-ink-subtle mt-1">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onDeleted={onJobDeleted} onSelect={onJobSelect} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-8 text-linear-ink-subtle text-body">
            No jobs
          </div>
        )}
      </div>
    </div>
  );
}
