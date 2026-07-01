'use client';

import { useEffect, useState } from 'react';

interface Resume {
  id: string;
  content: string;
  isActive: boolean;
  uploadedAt: string;
}

export function ResumeUploader() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch {
      setError('Failed to load resumes');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const text = await file.text();
      if (!text.trim()) {
        throw new Error('File appears to be empty');
      }
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!content.trim()) {
      setError('Resume content cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload resume');
      }

      setContent('');
      setShowForm(false);
      await fetchResumes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: true }),
      });

      if (!res.ok) throw new Error('Failed to set active resume');
      await fetchResumes();
    } catch {
      setError('Failed to update resume');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete resume');
      await fetchResumes();
    } catch {
      setError('Failed to delete resume');
    }
  };

  return (
    <div className="bg-linear-surface-1 border border-linear-hairline rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-card-title font-display font-semibold text-linear-ink">
          Resume Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-linear-primary hover:bg-linear-primary-hover text-white text-button rounded-md transition-all"
        >
          {showForm ? 'Cancel' : '+ Upload Resume'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 text-red-300 p-3 rounded mb-4 text-body">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-4 p-4 bg-linear-surface-2 rounded border border-linear-hairline space-y-3">
          <label className="block">
            <div className="border-2 border-dashed border-linear-hairline-strong rounded-lg p-6 text-center cursor-pointer hover:border-linear-primary transition-colors">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="hidden"
              />
              <p className="text-linear-ink text-body font-button">
                📄 Click to select a file or drag and drop
              </p>
              <p className="text-linear-ink-subtle text-caption mt-2">
                Supported: .txt, .pdf, .doc, .docx
              </p>
            </div>
          </label>

          {content && (
            <div className="bg-linear-surface-3 border border-linear-hairline rounded p-3">
              <p className="text-linear-success text-body mb-2">✓ File loaded successfully</p>
              <p className="text-linear-ink-subtle text-caption line-clamp-2">
                {content.substring(0, 150)}...
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading || !content.trim()}
            className="w-full px-4 py-2 bg-linear-success hover:bg-linear-success/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-all font-button text-button"
          >
            {isLoading ? 'Processing...' : 'Upload Resume'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {resumes.length === 0 ? (
          <p className="text-linear-ink-subtle text-body">No resumes yet. Upload one to get started.</p>
        ) : (
          resumes.map((resume, idx) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-3 bg-linear-surface-2 border border-linear-hairline rounded-lg hover:border-linear-hairline-strong transition-colors"
            >
              <div className="flex-1">
                <div className="text-body text-linear-ink">
                  Resume {resumes.length - idx}
                  {resume.isActive && (
                    <span className="ml-2 px-2 py-0.5 bg-linear-success/20 text-linear-success text-caption rounded">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-caption text-linear-ink-subtle mt-1">
                  {new Date(resume.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                {!resume.isActive && (
                  <button
                    onClick={() => handleSetActive(resume.id)}
                    className="px-2 py-1 text-caption bg-linear-primary hover:bg-linear-primary-hover text-white rounded-md transition-all"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="px-2 py-1 text-caption bg-red-600/50 hover:bg-red-600 text-red-200 rounded-md transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
