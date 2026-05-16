import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

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

    return NextResponse.json({ text: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Groq Interview Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
