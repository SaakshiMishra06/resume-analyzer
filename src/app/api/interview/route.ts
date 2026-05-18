import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq API Key missing." }, { status: 500 });
    }

    // Fetch the latest resume analysis summary to personalize the interview
    let resumeContext = "";
    if (user) {
      const { data: latestAnalysis } = await supabase
        .from("analyses")
        .select("summary, level")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestAnalysis) {
        resumeContext = `The candidate's experience level is: "${latestAnalysis.level}". Here is their professional background/resume summary: "${latestAnalysis.summary}".`;
      }
    }

    const systemPrompt = `You are a professional AI Interview Coach. Your goal is to conduct a mock interview for the candidate.
    
    ${resumeContext ? `Conduct the interview based on the candidate's resume context:
    - Context: ${resumeContext}
    - Ask custom, challenging technical and behavioral questions related to the projects, skills, tools, and experience level described in their summary.` : "If no resume context is available, conduct a general mock interview for a software engineering role."}
    
    Rules for the mock interview:
    1. Ask ONLY ONE question at a time.
    2. Be critical but constructive, acting like a real interviewer from a top tech company (like Google, Apple, or Meta).
    3. If this is the start of the interview, greet the user by name (if known from email or background) or introduce yourself, briefly highlight that you've reviewed their background, and ask the very first custom question.
    4. Keep your responses concise and engaging. Do not write extremely long paragraphs.`;

    const userMessages = messages.map((m: any) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    }));

    // If history is empty, add a prompt to trigger the initial greeting and first question
    if (userMessages.length === 0) {
      userMessages.push({
        role: "user",
        content: "Please start the mock interview by introducing yourself as my AI Coach and asking the first question based on my resume/background if available."
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages
      ],
    });

    const aiText = response.choices[0].message.content;

    // Save a new interview session record in Supabase on initialization
    if (user && messages.length === 0) {
      await supabase.from("interviews").insert({
        user_id: user.id
      });
    }

    return NextResponse.json({ text: aiText });
  } catch (error: any) {
    console.error("Groq Interview Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
