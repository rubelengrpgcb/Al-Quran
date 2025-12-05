
import { GoogleGenAI, Type } from "@google/genai";
import { TafsirResponse } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const getAyahTafsir = async (
  surahName: string,
  ayahNumber: number,
  arabicText: string,
  translation: string
): Promise<TafsirResponse> => {
  try {
    const prompt = `
      Provide a comprehensive Tafsir (interpretation) in Bengali for the following verse from the Holy Quran.
      
      Surah: ${surahName}
      Ayah Number: ${ayahNumber}
      Arabic: ${arabicText}
      Bengali Translation: ${translation}

      Please structure the response as a JSON object with the following fields:
      - "tafsir": A detailed explanation of the verse's meaning, historical context (Shan-e-Nuzul if applicable), and spiritual lessons. (String)
      - "keyThemes": A list of 3-5 key concepts or keywords derived from this verse. (Array of Strings)
      - "context": A brief 1-2 sentence summary of the background context. (String)
      - "pronunciation": The Bengali pronunciation (transliteration) of the Arabic text so a Bengali speaker can read it. (String)
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tafsir: { type: Type.STRING },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            context: { type: Type.STRING },
            pronunciation: { type: Type.STRING }
          },
          required: ["tafsir", "keyThemes", "context", "pronunciation"]
        },
        systemInstruction: "You are a knowledgeable Islamic scholar and educator capable of explaining the Quran in clear, respectful, and accurate Bengali."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as TafsirResponse;

  } catch (error) {
    console.error("Error fetching Tafsir:", error);
    throw error;
  }
};


export const getSurahSummary = async (surahName: string): Promise<string> => {
   try {
    const prompt = `
      Provide a comprehensive summary for Surah ${surahName} in Bengali.
      
      Please include:
      1. A concise summary of the Surah's main themes and lessons.
      2. A brief summary of the general Tafsir (interpretation) of this Surah.
      
      Combine these into a single, flowing text. 
      If a specific Tafsir summary is not available in your knowledge base, please explicitly state in Bengali: "Tafsir summary will be added later."
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "Summary not available.";
   } catch (error) {
     console.error("Error fetching summary:", error);
     return "Could not load summary at this time.";
   }
}
