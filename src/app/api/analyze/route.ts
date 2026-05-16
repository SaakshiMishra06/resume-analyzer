import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: "v1" });

        const prompt = `Analyze the provided resume text and return a structured JSON response. 
        IMPORTANT: Return ONLY the raw JSON object. Do not include any markdown formatting, backticks, or explanation.
        
        Fields required:
        - score: (number 0-100)
        - summary: (brief professional overview)
        - strengths: (array of 3 strings)
        - improvements: (array of 3 strings)
        - suggestions: (array of 3 objects with 'title' and 'desc')
        - level: (string: 'Poor', 'Fair', 'Good', 'Excellent')
        - timestamp: (string: current ISO timestamp)
        
        Resume Text: ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text();
        
        // Robust cleaning for JSON
        responseText = responseText.replace(/```json|```/g, "").trim();
        const analysis = JSON.parse(responseText);

        return NextResponse.json(analysis);
      } catch (err: any) {
        console.error(`Failed with ${modelName}:`, err.message);
        lastError = err;
        continue;
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: `AI Analysis Error: ${error.message}` }, { status: 500 });
  }
}
