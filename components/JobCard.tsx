'use client';

import { useDraggable } from '@dnd-kit/core';
import { Job } from '@/lib/types';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onDeleted: (jobId: string) => void;
}

export default function JobCard({ job, onDeleted }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      onDeleted(job.id);
    } catch (err) {
      console.error('Delete failed:', err);
      setIsDeleting(false);
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const appliedDate = job.appliedDate
    ? new Date(job.appliedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-slate-700 border border-slate-600 rounded-lg p-3 cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'hover:bg-slate-600 hover:border-slate-500'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{job.title}</h3>
          <p className="text-xs text-slate-400 truncate">{job.company}</p>
          {appliedDate && (
            <p className="text-xs text-slate-500 mt-2">Applied: {appliedDate}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-400 hover:text-red-400 text-lg leading-none disabled:opacity-50 flex-shrink-0"
          title="Delete job"
        >
          ×
        </button>
      </div>
    </div>
  );
}
