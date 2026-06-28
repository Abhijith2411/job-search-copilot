'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import JobColumn from './JobColumn';
import AddJobForm from './AddJobForm';
import { Status, Job as JobType } from '@/lib/types';

const COLUMNS: { status: Status; label: string }[] = [
  { status: 'WISHLIST', label: 'Wishlist' },
  { status: 'APPLIED', label: 'Applied' },
  { status: 'INTERVIEWING', label: 'Interviewing' },
  { status: 'OFFER', label: 'Offer' },
  { status: 'REJECTED', label: 'Rejected' },
];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    void fetchJobs();
  }, [fetchJobs]);

  const handleJobAdded = (newJob: JobType) => {
    setJobs((prev) => [newJob, ...prev]);
    setShowAddForm(false);
  };

  const handleJobDeleted = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleStatusChange = async (jobId: string, newStatus: Status) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: newStatus,
                appliedDate:
                  newStatus === 'APPLIED' && !job.appliedDate
                    ? new Date().toISOString()
                    : job.appliedDate,
              }
            : job
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as Status;

    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status !== newStatus) {
      handleStatusChange(jobId, newStatus);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-full bg-canvas p-6">
        <div className="max-w-7xl mx-auto">
          {/* Add Job Button */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-button"
            >
              + Add Job
            </button>
          </div>

          {/* Add Job Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-semantic-overlay bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-surface-1 rounded-lg p-8 max-w-md w-full border border-hairline">
                <AddJobForm
                  onJobAdded={handleJobAdded}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-surface-2 border border-hairline rounded-lg text-ink-muted">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-ink-subtle">Loading jobs...</p>
            </div>
          )}

          {/* Kanban Board */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {COLUMNS.map(({ status, label }) => (
                <JobColumn
                  key={status}
                  status={status}
                  label={label}
                  jobs={jobs.filter((job) => job.status === status)}
                  onJobDeleted={handleJobDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
