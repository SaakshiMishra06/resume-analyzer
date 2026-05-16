import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Extract Text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let resumeText = "";
    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      resumeText = data.text;
    } else {
      // For non-PDF, try reading as text (simple fallback)
      resumeText = buffer.toString("utf-8");
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: "Could not extract enough text from resume" }, { status: 400 });
    }

    // 2. Send to OpenAI for Analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS (Applicant Tracking System) and professional resume reviewer. 
          Analyze the provided resume text and return a structured JSON response with the following fields:
          - score: (number 0-100)
          - summary: (brief professional overview)
          - strengths: (array of 3 strings)
          - improvements: (array of 3 strings)
          - suggestions: (array of 3 objects with 'title' and 'desc')
          - level: (string: 'Poor', 'Fair', 'Good', 'Excellent')
          - timestamp: (string: current ISO timestamp)
          
          Be critical but constructive. Focus on keywords, quantifiable metrics, and professional formatting.`
        },
        {
          role: "user",
          content: `Analyze this resume text: \n\n ${resumeText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze resume" }, { status: 500 });
  }
}
