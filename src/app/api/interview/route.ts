import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing." }, { status: 500 });
    }

    const history = messages.map((m: any) => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "AI failed");
    }

    return NextResponse.json({ text: data.candidates[0].content.parts[0].text });

  } catch (error: any) {
    console.error("Interview Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
