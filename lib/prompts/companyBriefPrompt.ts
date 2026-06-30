export function getCompanyBriefPrompt(
  company: string,
  jobTitle: string
): string {
  return `You are an expert company researcher. Create a one-page company research brief for an interview.

Company: ${company}
Role: ${jobTitle}

Create a brief that includes:
1. Company Overview (2-3 sentences)
   - What they do, size, industry

2. Recent News & Milestones
   - 2-3 recent achievements or news items

3. Industry Position
   - Market standing, competitors, unique value

4. Interview Talking Points (3 specific things)
   - Specific insights that show you did research
   - Can reference in conversation naturally

5. Culture & Values
   - Known company values/culture fit

Requirements:
- Practical and scannable (short sections)
- Use what's public knowledge
- Focus on what helps in an interview
- Include specific, mention-able details
- Max 300 words total

Create the company brief:`;
}

export function getCompanyBriefSystemPrompt(): string {
  return `You are an expert at company research and interview preparation. Your job is to create concise,
actionable company research briefs that help candidates stand out in interviews.
Focus on:
- Publicly known information about the company
- Recent news, milestones, and market position
- Specific details that show genuine research
- Interview talking points that feel natural
- Company culture and values
- Information useful for conversation, not just facts`;
}
