'use client';

import { useState } from 'react';
import { GeneratorSuite } from './AIGenerators/GeneratorSuite';
import { Job } from '@/lib/types';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onDelete: (jobId: string) => void;
}

export function JobDetailModal({ job, onClose, onDelete }: JobDetailModalProps) {
  const [showGenerators, setShowGenerators] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete(job.id);
      onClose();
    } catch (err) {
      alert('Failed to delete job');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (showGenerators) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Generate Content</h2>
            <button
              onClick={() => setShowGenerators(false)}
              className="text-slate-400 hover:text-white text-xl"
            >
              ←
            </button>
          </div>
          <div className="p-6">
            <GeneratorSuite
              job={job}
              onClose={() => {
                setShowGenerators(false);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">{job.title}</h2>
            <p className="text-slate-400 text-sm">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {job.url && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">Job URL</h3>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm break-all"
              >
                {job.url}
              </a>
            </div>
          )}

          {job.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">Description</h3>
              <p className="text-slate-400 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
                {job.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">Status</h3>
              <p className="text-slate-300 text-sm capitalize">{job.status}</p>
            </div>
            {job.appliedDate && (
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">Applied</h3>
                <p className="text-slate-300 text-sm">
                  {new Date(job.appliedDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-700 flex gap-2">
            <button
              onClick={() => setShowGenerators(true)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition font-medium"
            >
              Generate Kit 🚀
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
