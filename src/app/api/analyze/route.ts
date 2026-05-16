import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing in Vercel settings." }, { status: 500 });
    }

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No valid resume text provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `You are an expert ATS (Applicant Tracking System) and professional resume reviewer. 
    Analyze the provided resume text and return a structured JSON response with the following fields:
    - score: (number 0-100)
    - summary: (brief professional overview)
    - strengths: (array of 3 strings)
    - improvements: (array of 3 strings)
    - suggestions: (array of 3 objects with 'title' and 'desc')
    - level: (string: 'Poor', 'Fair', 'Good', 'Excellent')
    - timestamp: (string: current ISO timestamp)
    
    Be critical but constructive. Focus on keywords, quantifiable metrics, and professional formatting.
    
    Resume Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up potential markdown blocks (e.g., ```json ... ```)
    responseText = responseText.replace(/```json|```/g, "").trim();
    
    const analysis = JSON.parse(responseText);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: "AI analysis failed. Please try again in a moment." }, { status: 500 });
  }
}
