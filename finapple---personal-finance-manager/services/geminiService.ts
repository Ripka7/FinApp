
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class financial advisor. Provide short, concise, and actionable financial advice based on the user's input.",
      },
    });
    return response.text || "Sorry, I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI advisor. Please try again later.";
  }
};
