import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult, TrendAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Step 1: Search for current prices using the Google Search tool.
 * We cannot use JSON schema here because googleSearch is active.
 */
export const searchProductPrices = async (query: string): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Find the current market price for "${query}" from major reliable retailers. 
      List 3-5 specific retailers with their current prices if available. 
      Keep the response concise and focused on price and availability.`,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using search tools
      },
    });

    const text = response.text || "No details found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks: groundingChunks as any[], // Casting for simpler consumption
    };
  } catch (error) {
    console.error("Search API Error:", error);
    throw new Error("Failed to search for product prices.");
  }
};

/**
 * Step 2: Analyze trends and generate chart data.
 * This does NOT use search, but uses the model's training data to estimate trends 
 * and generate a structured JSON response.
 */
export const analyzePriceTrends = async (query: string, currentPriceText: string): Promise<TrendAnalysis> => {
  try {
    const model = 'gemini-2.5-flash';

    const prompt = `
      Analyze the price trends for the product: "${query}".
      Based on general market knowledge and the following recent search context: "${currentPriceText.substring(0, 500)}...",
      generate a realistic 6-month price history dataset (6 data points, one per month) ending today.
      
      Determine if it's a good time to buy.
      
      Return ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            averagePrice: { type: Type.NUMBER, description: "Average market price over last 6 months" },
            targetPrice: { type: Type.NUMBER, description: "A good 'deal' price to aim for" },
            currentEstimatedPrice: { type: Type.NUMBER, description: "The best current price found or estimated" },
            verdict: { type: Type.STRING, enum: ['BUY_NOW', 'WAIT', 'NEUTRAL'] },
            reasoning: { type: Type.STRING, description: "Short explanation of the verdict (max 2 sentences)" },
            history: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Month name, e.g., 'Jan'" },
                  price: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
        throw new Error("No data returned from analysis.");
    }

    const data = JSON.parse(response.text) as TrendAnalysis;
    return data;
  } catch (error) {
    console.error("Analysis API Error:", error);
    // Return a fallback if analysis fails, so the app doesn't break completely
    return {
        productName: query,
        averagePrice: 0,
        targetPrice: 0,
        currentEstimatedPrice: 0,
        verdict: 'NEUTRAL',
        reasoning: "Could not analyze historical trends at this time.",
        history: []
    };
  }
};
