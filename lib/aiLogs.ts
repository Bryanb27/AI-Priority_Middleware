export type AILog = {
  id: string;
  timestamp: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  rawResponse: string;
  parsedScore: number;
  reasoning: string;
};

export const aiLogs: AILog[] = [];