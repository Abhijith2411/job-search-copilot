'use client';

import { Job } from '@/lib/types';

import { useState } from 'react';


interface GeneratorProps {
  job: Job;
  onClose: () => void;
}

export function LinkedInMessageGenerator({ job, onClose }: GeneratorProps) {
  const [userName, setUserName] = useState('Abhijith');
  const [hiringManagerName, setHiringManagerName] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/generate/linkedin-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          userName,
          hiringManagerName: hiringManagerName || 'Hiring Manager',
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
        <h3 className="text-lg font-semibold text-white mb-2">LinkedIn Connection Message</h3>
        <p className="text-slate-400 text-sm">Generate a personalized LinkedIn connection message to hiring managers at {job.company}.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 bg-slate-950 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Hiring Manager Name (Optional)</label>
          <input
            type="text"
            value={hiringManagerName}
            onChange={(e) => setHiringManagerName(e.target.value)}
            placeholder="e.g., Sarah Chen"
            className="w-full p-2 bg-slate-950 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {error && <div className="bg-red-900/20 border border-red-700 text-red-300 p-3 rounded text-sm">{error}</div>}

      {output && (
        <div className="bg-slate-800 border border-slate-700 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white">Generated Message</h3>
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
            className="w-full h-32 p-3 bg-slate-950 border border-slate-600 rounded text-white text-sm whitespace-pre-wrap"
          />
          <p className="text-xs text-slate-500 mt-2">💡 Tip: Copy this message and paste it directly into LinkedIn</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition"
        >
          {isLoading ? 'Generating...' : 'Generate Message'}
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
