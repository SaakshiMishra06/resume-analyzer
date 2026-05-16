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

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages.map((m: any) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      })),
    });

    const aiText = response.choices[0].message.content;

    // Save to Database if it's the start of a session or a major milestone
    // For simplicity, we'll log every interview "start" or interaction
    if (user && messages.length === 1) {
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
