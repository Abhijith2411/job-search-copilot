export function getLinkedInMessagePrompt(
  jobTitle: string,
  company: string,
  userName: string = 'Abhijith',
  hiringManagerName: string = 'Hiring Manager'
): string {
  return `You are an expert at crafting LinkedIn connection messages that get responses from hiring managers.

Job: ${jobTitle} at ${company}
Your Name: ${userName}
Hiring Manager Name: ${hiringManagerName}

Create a LinkedIn connection request message that:
1. Opens with a specific reference (not generic)
2. Mentions the role you applied for
3. Shows genuine interest in the company/role
4. Is professional but personable
5. Has a clear purpose (discuss the role, learn more)
6. Under 300 characters (LinkedIn limit for initial message)

Requirements:
- NO flattery or compliments about them personally
- Reference something specific about company/role
- Mention your relevant background briefly
- Make it feel authentic, not templated
- Include a light call to action

Create the LinkedIn message:`;
}

export function getLinkedInMessageSystemPrompt(): string {
  return `You are an expert at LinkedIn outreach and networking. Your job is to craft connection messages
that break through the noise and get positive responses from hiring managers and recruiters.
Focus on:
- Specific, genuine references to the company or role
- Authentic voice that doesn't sound templated
- Clear value proposition for the connection
- Brevity and directness
- Professional but approachable tone
- Showing you've done research, not just mass-applying`;
}
