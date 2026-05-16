import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: "v1" });

        const chat = model.startChat({
          history: messages.slice(0, -1).map((m: any) => ({
            role: m.role === "ai" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
          generationConfig: {
            maxOutputTokens: 200,
          },
        });

        const lastMessage = messages[messages.length - 1].text;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return NextResponse.json({ text: response.text() });
      } catch (err: any) {
        console.error(`Failed with model ${modelName}:`, err.message);
        lastError = err;
        continue;
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("Gemini Interview Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
