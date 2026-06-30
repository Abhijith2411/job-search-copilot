export type Status = 'WISHLIST' | 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';

export interface Job {
  id: string;
  title: string;
  company: string;
  url?: string | null;
  description?: string | null;
  status: Status;
  appliedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  content: string;
  isActive: boolean;
  uploadedAt: string;
}

export interface AIGeneration {
  id: string;
  jobId: string;
  generationType: 'COVER_LETTER' | 'RESUME_BULLETS' | 'INTERVIEW_QUESTIONS' | 'COMPANY_BRIEF' | 'LINKEDIN_MESSAGE';
  prompt: string;
  output: string;
  model: string;
  createdAt: string;
}
