import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker
// @ts-ignore
import("pdfjs-dist/build/pdf.worker.mjs");

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

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    
    let resumeText = "";

    try {
      if (file.type === "application/pdf") {
        const loadingTask = pdfjs.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }
        resumeText = fullText;
      } else {
        resumeText = Buffer.from(bytes).toString("utf-8");
      }
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return NextResponse.json({ error: "Could not read this PDF file. Please try a different one." }, { status: 400 });
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: "Could not extract enough text from resume" }, { status: 400 });
    }

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
