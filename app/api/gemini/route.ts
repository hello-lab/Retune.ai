import { NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Compose prompt from chat history
function chatHistoryToPrompt(chatJson: { user: string; message: string }[]): string {
  return chatJson.map((c) => `${c.user}: ${c.message}`).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const chatJson = body.chatJson;
    if (!Array.isArray(chatJson)) {
      return new Response(JSON.stringify({ error: "Missing or invalid chatJson" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compose instructions and chat history for Gemini context
    const instructions = `You are an agent whose work is to infer what kind of songs the user wants to listen to on Spotify. Don't talk directly about which song; converse normally but in the detected parameter keep adding detected genres/moods/singers/languages.Its imperative to know the languages`;
    const prompt = instructions + "\n" + chatHistoryToPrompt(chatJson);

    // Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Configuration for structured response
    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["response", "detected"],
        properties: {
          response: { type: Type.STRING },
          detected: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
      systemInstruction: [
        { text: instructions },
      ],
    };

    const model = GEMINI_MODEL;
    const contents = [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    // Call Gemini using the SDK (non-streaming)
    const result = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // Parse the structured JSON result
    let responseText = "";
    let detected: string[] = [];
    try {
      const data = typeof result.text === "string"
        ? JSON.parse(result.text)
        : result.text;
      responseText = data.response ?? "";
      detected = Array.isArray(data.detected) ? data.detected : [];
    } catch (e) {
      responseText = typeof result.text === "string" ? result.text : JSON.stringify(result.text);
      detected = [];
    }

    return new Response(
      JSON.stringify({ response: responseText, detected }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}