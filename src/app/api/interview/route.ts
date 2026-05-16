import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer for a modern software engineering company. 
          Your goal is to conduct a realistic mock interview. 
          - Keep your responses concise (1-3 sentences).
          - Focus on behavioral and technical skills.
          - Ask one follow-up question at a time.
          - Provide subtle, constructive feedback if the user's answer is weak.`
        },
        ...messages.map((m: any) => ({
          role: (m.role === "ai" ? "assistant" : "user") as "assistant" | "user",
          content: m.text as string
        }))
      ],
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ text: aiMessage });
  } catch (error: any) {
    console.error("Interview AI Error:", error);
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}
