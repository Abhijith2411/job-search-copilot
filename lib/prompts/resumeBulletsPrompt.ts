export function getResumeBulletsPrompt(
  jobTitle: string,
  company: string,
  jobDescription: string | null,
  resumeContent: string
): string {
  return `You are an expert resume writer. Generate 4-6 tailored bullet points that showcase relevant experience for this job.

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription || 'Not provided'}

My Resume:
${resumeContent}

Requirements:
- Generate 4-6 bullet points (not more)
- Start each with an action verb
- Include specific metrics/results when possible
- Directly match job requirements
- Use industry keywords from the job description
- Format as bullet points (• prefix)
- Tailor to this specific role, not generic bullets

Generate the bullet points:`;
}

export function getResumeBulletsSystemPrompt(): string {
  return `You are an expert resume strategist. Your job is to rewrite resume bullets to perfectly match job requirements.
Focus on:
- Extracting the most relevant experience from the candidate's background
- Using strong action verbs
- Including quantifiable results/metrics
- Matching keywords from the job description
- Making achievements specific and impactful`;
}
