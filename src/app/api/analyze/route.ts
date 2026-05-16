import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No valid resume text provided" }, { status: 400 });
    }

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
    const analysis = JSON.parse(response.text());

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze resume with Gemini. Please check your API key." }, { status: 500 });
  }
}
