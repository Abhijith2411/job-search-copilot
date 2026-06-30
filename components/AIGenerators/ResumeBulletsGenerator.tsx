'use client';

import { Job } from '@/lib/types';

import { useState, useEffect } from 'react';


interface Resume {
  id: string;
  isActive: boolean;
  content: string;
}

interface GeneratorProps {
  job: Job;
  onClose: () => void;
}

export function ResumeBulletsGenerator({ job, onClose }: GeneratorProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [customResume, setCustomResume] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch('/api/resumes');
        const data = await res.json();
        setResumes(data.resumes || []);
        const active = data.resumes?.find((r: Resume) => r.isActive);
        if (active) {
          setSelectedResumeId(active.id);
        }
      } catch {
        setError('Failed to load resumes');
      }
    };
    fetchResumes();
  }, []);

  const handleGenerate = async () => {
    setError('');
    setIsLoading(true);

    try {
      const resumeContent = useCustom ? customResume : (resumes.find(r => r.id === selectedResumeId)?.content || '');

      if (!resumeContent.trim()) {
        setError('Please provide resume content');
        setIsLoading(false);
        return;
      }

      const res = await fetch('/api/ai/generate/resume-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          resumeContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded p-4">
        <h3 className="font-semibold text-white mb-3">Resume</h3>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="radio"
              checked={!useCustom}
              onChange={() => setUseCustom(false)}
              className="w-4 h-4"
            />
            Use Uploaded Resume
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input
              type="radio"
              checked={useCustom}
              onChange={() => setUseCustom(true)}
              className="w-4 h-4"
            />
            Use Custom Resume
          </label>
        </div>

        {!useCustom && resumes.length > 0 ? (
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="w-full p-2 bg-slate-950 border border-slate-600 rounded text-white text-sm"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                Resume {r.isActive ? '(Active)' : ''}
              </option>
            ))}
          </select>
        ) : useCustom ? (
          <textarea
            value={customResume}
            onChange={(e) => setCustomResume(e.target.value)}
            placeholder="Paste your resume here..."
            className="w-full h-24 p-2 bg-slate-950 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <p className="text-slate-400 text-sm">No resumes available. Please upload one first.</p>
        )}
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 rounded text-sm">{error}</div>}

      {output && (
        <div className="bg-slate-800 border border-slate-700 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white">Generated Resume Bullets</h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 p-3 bg-slate-950 border border-slate-600 rounded text-white text-sm whitespace-pre-wrap"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition"
        >
          {isLoading ? 'Generating...' : 'Generate Bullets'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
