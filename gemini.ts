import { GoogleGenAI, Type } from "@google/genai";

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface SuspiciousSegment {
  text: string;
  reason: string;
  likelihood: RiskLevel;
}

export interface AnalysisResult {
  overallScore: number; // 0 to 100
  aiProbability: number;
  plagiarismProbability: number;
  summary: string;
  segments: SuspiciousSegment[];
  isAnalyzed: boolean;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeText(text: string): Promise<AnalysisResult> {
  if (!text || text.trim().length < 50) {
    throw new Error("Text is too short for meaningful analysis. Please provide at least 50 characters.");
  }

  const prompt = `
    Analyze the following text for plagiarism and AI-generated content.
    Provide a detailed breakdown including:
    1. Overall score (0-100, where 100 is highly suspicious).
    2. AI probability (percentage).
    3. Plagiarism probability (percentage).
    4. A concise summary of the findings.
    5. Specific segments that are suspicious with reasons.

    Text to analyze:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            aiProbability: { type: Type.NUMBER },
            plagiarismProbability: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  likelihood: { 
                    type: Type.STRING,
                    description: "one of: low, medium, high"
                  },
                },
                required: ["text", "reason", "likelihood"],
              },
            },
          },
          required: ["overallScore", "aiProbability", "plagiarismProbability", "summary", "segments"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      ...result,
      isAnalyzed: true,
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze text. Please try again later.");
  }
}
