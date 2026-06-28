'use client';

import { useDraggable } from '@dnd-kit/core';
import { Job } from '@/lib/types';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onJobDeleted: (jobId: string) => void;
}

export default function JobCard({ job, onJobDeleted }: JobCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${job.title}" from ${job.company}?`)) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete job');
      onJobDeleted(job.id);
    } catch (error) {
      alert('Failed to delete job');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-surface-2 border border-hairline rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-primary' : 'hover:bg-surface-3'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-body font-medium text-ink truncate">{job.title}</h4>
          <p className="text-body-sm text-ink-muted truncate">{job.company}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-2 text-ink-subtle hover:text-ink transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {job.appliedDate && (
        <p className="text-caption text-ink-tertiary mt-2">
          Applied: {new Date(job.appliedDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
