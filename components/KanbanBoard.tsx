'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import JobColumn from './JobColumn';
import AddJobForm from './AddJobForm';
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
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Job Tracker</h1>
            <p className="text-slate-400 mb-4">Manage your job application pipeline</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Job
            </button>
          </div>

          {/* Add Job Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full border border-slate-700">
                <AddJobForm
                  onJobAdded={handleJobAdded}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading jobs...</div>
          ) : (
            /* Kanban Board */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
