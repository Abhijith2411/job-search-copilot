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
  const [uploadMode, setUploadMode] = useState<'text' | 'file'>('text');

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
      setUploadMode('text');
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
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Resume Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
        >
          {showForm ? 'Cancel' : '+ Upload Resume'}
        </button>
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="mb-4 p-4 bg-slate-800 rounded border border-slate-700 space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="radio"
                checked={uploadMode === 'text'}
                onChange={() => setUploadMode('text')}
                className="w-4 h-4"
              />
              Paste Text
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="radio"
                checked={uploadMode === 'file'}
                onChange={() => setUploadMode('file')}
                className="w-4 h-4"
              />
              Upload File
            </label>
          </div>

          {uploadMode === 'text' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full h-40 p-3 bg-slate-950 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="space-y-2">
              <label className="block">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-slate-500 transition">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <p className="text-slate-400 text-sm">
                    Click to select a file or drag and drop
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Supported: .txt, .pdf, .doc, .docx
                  </p>
                </div>
              </label>
              {content && (
                <div className="bg-slate-950 border border-slate-600 rounded p-3">
                  <p className="text-green-400 text-sm mb-2">✓ File loaded successfully</p>
                  <p className="text-slate-400 text-xs">
                    {content.substring(0, 100)}...
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading || !content.trim()}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition"
          >
            {isLoading ? 'Processing...' : 'Upload'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {resumes.length === 0 ? (
          <p className="text-slate-400 text-sm">No resumes yet. Upload one to get started.</p>
        ) : (
          resumes.map((resume, idx) => (
            <div key={resume.id} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 transition">
              <div className="flex-1">
                <div className="text-sm text-slate-300">
                  Resume {resumes.length - idx}
                  {resume.isActive && <span className="ml-2 px-2 py-0.5 bg-green-600/30 text-green-300 text-xs rounded">Active</span>}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(resume.uploadedAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                {!resume.isActive && (
                  <button
                    onClick={() => handleSetActive(resume.id)}
                    className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                  >
                    Set Active
                  </button>
                )}
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition"
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
