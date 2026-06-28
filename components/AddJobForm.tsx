'use client';

import { useState } from 'react';
import { Job } from '@/lib/types';

interface AddJobFormProps {
  onJobAdded: (job: Job) => void;
  onCancel: () => void;
}

type InputMode = 'url' | 'manual';

export default function AddJobForm({ onJobAdded, onCancel }: AddJobFormProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL Mode
  const [url, setUrl] = useState('');
  const [extractedTitle, setExtractedTitle] = useState('');
  const [extractedCompany, setExtractedCompany] = useState('');

  // Manual Mode
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');

  const handleExtractFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/jobs/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract job information from URL');
      }

      const data = await response.json();
      setExtractedTitle(data.title || '');
      setExtractedCompany(data.company || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitUrlMode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!extractedTitle || !extractedCompany) {
      setError('Please extract job details or enter them manually');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: extractedTitle,
          company: extractedCompany,
          url: url || null,
          description: null,
          status: 'WISHLIST',
        }),
      });

      if (!response.ok) throw new Error('Failed to create job');

      const newJob = await response.json();
      onJobAdded(newJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitManualMode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !company) {
      setError('Please enter job title and company');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          url: null,
          description: description || null,
          status: 'WISHLIST',
        }),
      });

      if (!response.ok) throw new Error('Failed to create job');

      const newJob = await response.json();
      onJobAdded(newJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-headline font-semibold mb-4">Add a Job</h2>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6 bg-canvas p-1 rounded-md">
        <button
          onClick={() => setMode('url')}
          className={`flex-1 py-2 px-3 rounded text-button transition-colors ${
            mode === 'url'
              ? 'bg-primary text-white'
              : 'bg-transparent text-ink hover:bg-surface-2'
          }`}
        >
          From URL
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-2 px-3 rounded text-button transition-colors ${
            mode === 'manual'
              ? 'bg-primary text-white'
              : 'bg-transparent text-ink hover:bg-surface-2'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-surface-2 border border-hairline rounded text-ink-muted text-body-sm">
          {error}
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <form onSubmit={handleExtractFromUrl} className="space-y-4">
          <div>
            <label className="block text-body font-medium text-ink mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !url}
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 transition-colors text-button"
          >
            {isLoading ? 'Extracting...' : 'Extract Job Details'}
          </button>

          {extractedTitle && (
            <div className="space-y-4 mt-6 pt-6 border-t border-hairline">
              <div>
                <label className="block text-body font-medium text-ink mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={extractedTitle}
                  onChange={(e) => setExtractedTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-body font-medium text-ink mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={extractedCompany}
                  onChange={(e) => setExtractedCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-2 bg-surface-2 text-ink rounded-md hover:bg-surface-3 transition-colors text-button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitUrlMode}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 transition-colors text-button"
                >
                  {isLoading ? 'Creating...' : 'Add Job'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <form onSubmit={handleSubmitManualMode} className="space-y-4">
          <div>
            <label className="block text-body font-medium text-ink mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-body font-medium text-ink mb-2">
              Company *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Acme Corp"
              className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-body font-medium text-ink mb-2">
              Job Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the job description..."
              rows={4}
              className="w-full px-3 py-2 bg-surface-2 border border-hairline rounded-md text-ink placeholder-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 bg-surface-2 text-ink rounded-md hover:bg-surface-3 transition-colors text-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50 transition-colors text-button"
            >
              {isLoading ? 'Creating...' : 'Add Job'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
