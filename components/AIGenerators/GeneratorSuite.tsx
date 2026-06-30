'use client';

import { useState } from 'react';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { ResumeBulletsGenerator } from './ResumeBulletsGenerator';
import { InterviewQuestionsGenerator } from './InterviewQuestionsGenerator';
import { CompanyBriefGenerator } from './CompanyBriefGenerator';
import { LinkedInMessageGenerator } from './LinkedInMessageGenerator';
import { Job } from '@/lib/types';

interface GeneratorSuiteProps {
  job: Job;
  onClose: () => void;
}

type GeneratorType = 'menu' | 'cover-letter' | 'resume-bullets' | 'interview' | 'company' | 'linkedin';

export function GeneratorSuite({ job, onClose }: GeneratorSuiteProps) {
  const [currentGenerator, setCurrentGenerator] = useState<GeneratorType>('menu');

  const handleGeneratorOpen = (generator: GeneratorType) => {
    setCurrentGenerator(generator);
  };

  const handleGeneratorClose = () => {
    setCurrentGenerator('menu');
  };

  if (currentGenerator === 'cover-letter') {
    return <CoverLetterGenerator job={job} onClose={handleGeneratorClose} />;
  }

  if (currentGenerator === 'resume-bullets') {
    return <ResumeBulletsGenerator job={job} onClose={handleGeneratorClose} />;
  }

  if (currentGenerator === 'interview') {
    return <InterviewQuestionsGenerator job={job} onClose={handleGeneratorClose} />;
  }

  if (currentGenerator === 'company') {
    return <CompanyBriefGenerator job={job} onClose={handleGeneratorClose} />;
  }

  if (currentGenerator === 'linkedin') {
    return <LinkedInMessageGenerator job={job} onClose={handleGeneratorClose} />;
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 border border-slate-700 rounded p-4">
        <h2 className="text-xl font-semibold text-white mb-2">AI Generation Suite</h2>
        <p className="text-slate-400 text-sm">Generate tailored content for {job.title} at {job.company}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => handleGeneratorOpen('cover-letter')}
          className="text-left p-4 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 hover:bg-slate-750 transition"
        >
          <h3 className="font-semibold text-white mb-1">📝 Cover Letter</h3>
          <p className="text-slate-400 text-sm">Generate a personalized cover letter</p>
        </button>

        <button
          onClick={() => handleGeneratorOpen('resume-bullets')}
          className="text-left p-4 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 hover:bg-slate-750 transition"
        >
          <h3 className="font-semibold text-white mb-1">⭐ Resume Bullets</h3>
          <p className="text-slate-400 text-sm">Generate tailored resume bullets for this role</p>
        </button>

        <button
          onClick={() => handleGeneratorOpen('interview')}
          className="text-left p-4 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 hover:bg-slate-750 transition"
        >
          <h3 className="font-semibold text-white mb-1">💡 Interview Questions</h3>
          <p className="text-slate-400 text-sm">Get likely interview questions with tips</p>
        </button>

        <button
          onClick={() => handleGeneratorOpen('company')}
          className="text-left p-4 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 hover:bg-slate-750 transition"
        >
          <h3 className="font-semibold text-white mb-1">🏢 Company Brief</h3>
          <p className="text-slate-400 text-sm">Research brief: news, position, talking points</p>
        </button>

        <button
          onClick={() => handleGeneratorOpen('linkedin')}
          className="text-left p-4 bg-slate-800 border border-slate-700 rounded hover:border-slate-600 hover:bg-slate-750 transition"
        >
          <h3 className="font-semibold text-white mb-1">🔗 LinkedIn Message</h3>
          <p className="text-slate-400 text-sm">Personalized message to hiring managers</p>
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
      >
        Close
      </button>
    </div>
  );
}
