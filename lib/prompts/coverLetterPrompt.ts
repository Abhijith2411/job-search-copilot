export function getCoverLetterPrompt(
  jobTitle: string,
  company: string,
  jobDescription: string | null,
  resumeContent: string,
  tone: string = 'professional'
): string {
  return `You are an expert cover letter writer. Write a compelling, personalized cover letter for the following job opportunity.

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription || 'Not provided'}

My Resume:
${resumeContent}

Requirements:
- Personalize it to the specific job and company
- Use a ${tone} tone
- Max 200 words
- Start with a strong hook (not "I am writing to apply")
- Connect my specific experience to their needs
- End with a clear call to action
- Make it sound like a real person wrote it

Please write the cover letter now:`;
}

export function getCoverLetterSystemPrompt(): string {
  return `You are an expert career coach and cover letter writer. Your job is to craft compelling,
personalized cover letters that stand out to recruiters. Focus on:
- Specific achievements from the candidate's background
- Direct connections between their skills and the job requirements
- Authentic voice that sounds like a real professional
- Strong opening and closing statements
- Concise, impactful language`;
}
