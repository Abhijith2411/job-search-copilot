'use client';

import { useState } from 'react';
import { Job } from '@/lib/types';

interface AddJobFormProps {
  onJobAdded: (job: Job) => void;
  onCancel: () => void;
}

export default function AddJobForm({ onJobAdded, onCancel }: AddJobFormProps) {
  const [isManual, setIsManual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    url: '',
    description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title || 'Untitled Position',
        company: formData.company || 'Unknown Company',
        url: formData.url || null,
        description: formData.description || null,
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const newJob = await response.json();
      onJobAdded(newJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Add Job</h2>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsManual(true)}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
            isManual
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setIsManual(false)}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition ${
            !isManual
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          From URL
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">{error}</div>}

      {/* Form Fields */}
      <div className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          required
        />

        {isManual ? (
          <textarea
            name="description"
            placeholder="Job Description (optional)"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
          />
        ) : (
          <input
            type="url"
            name="url"
            placeholder="Job Posting URL"
            value={formData.url}
            onChange={handleInputChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Job'}
        </button>
      </div>
    </form>
  );
}
