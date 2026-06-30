'use client';

import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';
import { Job } from '@/lib/types';

interface JobColumnProps {
  status: string;
  label: string;
  jobs: Job[];
  onJobDeleted: (jobId: string) => void;
}

export default function JobColumn({ status, label, jobs, onJobDeleted }: JobColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-96 flex flex-col"
    >
      <div className="mb-4 pb-3 border-b border-slate-700">
        <h2 className="text-sm font-semibold text-white">{label}</h2>
        <p className="text-xs text-slate-400 mt-1">{jobs.length} jobs</p>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onDeleted={onJobDeleted} />
        ))}
        {jobs.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">No jobs</div>
        )}
      </div>
    </div>
  );
}
