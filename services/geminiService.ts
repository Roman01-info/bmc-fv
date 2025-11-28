import { GoogleGenAI, Type } from "@google/genai";
import { BMCData, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

export const analyzeBMC = async (data: BMCData): Promise<AnalysisResult> => {
  const prompt = `
    Analyze the following Business Model Canvas (BMC) data provided in Bengali/English. 
    Act as a world-class business consultant.
    Provide the output strictly in Bengali language (Bangla).
    
    Data:
    - Key Partners: ${data.keyPartners}
    - Key Activities: ${data.keyActivities}
    - Key Resources: ${data.keyResources}
    - Value Propositions: ${data.valuePropositions}
    - Customer Relationships: ${data.customerRelationships}
    - Channels: ${data.channels}
    - Customer Segments: ${data.customerSegments}
    - Cost Structure: ${data.costStructure}
    - Revenue Streams: ${data.revenueStreams}

    Provide a JSON response with:
    1. Overall viability score (0-100).
    2. Executive summary (short paragraph).
    3. SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) - list of strings.
    4. Strategic Suggestions (list of actionable advice).
    5. Segment Analysis: Detailed feedback and score (0-10) for 'Value Proposition', 'Financial Viability', 'Market Fit'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            executiveSummary: { type: Type.STRING },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"],
            },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            segmentAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  segment: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                },
                required: ["segment", "feedback", "score"],
              },
            },
          },
          required: ["overallScore", "executiveSummary", "swot", "suggestions", "segmentAnalysis"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text from AI");
    }
  } catch (error) {
    console.error("Error analyzing BMC:", error);
    throw error;
  }
};