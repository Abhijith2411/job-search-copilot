'use client';

import { useDraggable } from '@dnd-kit/core';
import { Job } from '@/lib/types';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onDeleted: (jobId: string) => void;
  onSelect: (job: Job) => void;
}

export default function JobCard({ job, onDeleted, onSelect }: JobCardProps) {
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

  const getStatusColor = () => {
    switch (job.status) {
      case 'WISHLIST':
        return 'bg-linear-brand-secure';
      case 'APPLIED':
        return 'bg-linear-primary';
      case 'INTERVIEWING':
        return 'bg-linear-primary-hover';
      case 'OFFER':
        return 'bg-linear-success';
      case 'REJECTED':
        return 'bg-linear-ink-subtle';
      default:
        return 'bg-linear-primary';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(job)}
      className={`bg-linear-surface-1 border border-linear-hairline rounded-lg p-3 cursor-move transition-all group relative pl-4 ${
        isDragging
          ? 'opacity-50 scale-95 border-linear-primary'
          : 'hover:bg-linear-surface-2 hover:border-linear-hairline-strong'
      }`}
    >
      {/* Signature Status Bar - Left Edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getStatusColor()}`} />

      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-card-title font-display font-semibold text-linear-ink truncate">
            {job.title}
          </h3>
          <p className="text-body-sm text-linear-ink-muted truncate">
            {job.company}
          </p>
          {appliedDate && (
            <p className="text-caption text-linear-ink-subtle mt-2">
              Applied {appliedDate}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
          className="text-linear-ink-subtle hover:text-red-400 text-lg leading-none disabled:opacity-50 flex-shrink-0 transition-colors"
          title="Delete job"
        >
          ×
        </button>
      </div>
    </div>
  );
}
