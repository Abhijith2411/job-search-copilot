'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import JobColumn from './JobColumn';
import AddJobForm from './AddJobForm';
import { JobDetailModal } from './JobDetailModal';
import { ResumeUploader } from './ResumeUploader';
import { Job } from '@/lib/types';

const COLUMNS = [
  { status: 'WISHLIST', label: 'Wishlist' },
  { status: 'APPLIED', label: 'Applied' },
  { status: 'INTERVIEWING', label: 'Interviewing' },
  { status: 'OFFER', label: 'Offer' },
  { status: 'REJECTED', label: 'Rejected' },
];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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
    fetchJobs();
  }, [fetchJobs]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleJobAdded = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setShowAddForm(false);
  };

  const handleJobDeleted = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      const updatedJob = await response.json();

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;

    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status !== newStatus) {
      handleStatusChange(jobId, newStatus);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-linear-canvas">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-display-md font-display font-semibold text-linear-ink mb-6 tracking-tight">
              Job Tracker
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-linear-primary text-white rounded-md hover:bg-linear-primary-hover focus:ring-2 focus:ring-linear-primary-focus focus:ring-opacity-50 font-button text-button transition-all"
            >
              + Add Job
            </button>
          </div>

          {/* Add Job Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-linear-overlay bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-linear-surface-2 rounded-lg p-6 max-w-md w-full border border-linear-hairline-strong shadow-lg">
                <AddJobForm
                  onJobAdded={handleJobAdded}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          )}

          {/* Job Detail Modal */}
          {selectedJob && (
            <JobDetailModal
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onDelete={handleJobDeleted}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 text-body">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-16 text-linear-ink-subtle text-body">
              Loading jobs...
            </div>
          ) : (
            <>
              <ResumeUploader />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                {COLUMNS.map(({ status, label }) => (
                  <JobColumn
                    key={status}
                    status={status}
                    label={label}
                    jobs={jobs.filter((job) => job.status === status)}
                    onJobDeleted={handleJobDeleted}
                    onJobSelect={setSelectedJob}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </DndContext>
  );
}
