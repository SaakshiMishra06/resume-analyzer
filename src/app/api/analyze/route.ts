import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 });
    }

    const prompt = `Analyze this resume and return ONLY a raw JSON object. 
    Fields: score (0-100), summary, strengths (array), improvements (array), suggestions (array of {title, desc}), level, timestamp.
    
    Resume: ${text}`;

    // Direct REST API call - Bulletproof method
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "AI failed to respond");
    }

    const analysis = JSON.parse(data.candidates[0].content.parts[0].text);
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
