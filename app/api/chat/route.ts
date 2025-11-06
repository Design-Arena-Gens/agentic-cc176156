import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Thi?u ANTHROPIC_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const messages = (body?.messages || []) as Array<{ role: "user" | "assistant"; content: string }>;

    // Convert to Anthropic Messages API format
    const anthropicMessages = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    const client = new Anthropic({ apiKey });

    const completion = await client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      temperature: 0.7,
      messages: anthropicMessages.length
        ? anthropicMessages
        : [{ role: "user", content: "Xin ch?o, b?n l? ai?" }],
    });

    // Extract text from content blocks
    const reply = completion.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const message = err?.message || "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
