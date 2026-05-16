import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API Key is missing. Please add it to Vercel." }, { status: 500 });
    }

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No valid resume text provided" }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
          - timestamp: (string: current ISO timestamp)`
        },
        {
          role: "user",
          content: `Analyze this resume text: \n\n ${text}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    // Save to Database for History if user is logged in
    if (user) {
      await supabase.from("analyses").insert({
        user_id: user.id,
        score: analysis.score,
        level: analysis.level,
        summary: analysis.summary
      });
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Groq Analysis Error:", error);
    return NextResponse.json({ error: `AI Analysis Error: ${error.message}` }, { status: 500 });
  }
}
