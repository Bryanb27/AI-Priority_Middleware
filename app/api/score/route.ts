import OpenAI from "openai";
import { NextResponse } from "next/server";
import { aiLogs } from "@/lib/aiLogs";
import crypto from "crypto";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    const systemPrompt = `
You are an AI task prioritization engine.

Analyze the task and the impact of it and respond ONLY in valid JSON format:

{
  "score": number (1-10),
  "reasoning": "short explanation of why this priority was assigned"
}

Do not include anything else.
`;

    const userPrompt = `Title: ${title}\nDescription: ${description}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0].message.content;

    // Log do prompt (para auditoria)
    console.log("SYSTEM:", systemPrompt);
    console.log("USER:", userPrompt);
    console.log("LLM RESPONSE:", raw);

    const parsed = JSON.parse(raw || "{}");

    const score = Number(parsed.score);

    if (isNaN(score) || score < 1 || score > 10) {
      return NextResponse.json(
        { error: "Invalid score returned from AI" },
        { status: 500 }
      );
    }

    aiLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      model: "gpt-4o-mini",
      systemPrompt,
      userPrompt,
      rawResponse: raw || "",
      parsedScore: score,
      reasoning: parsed.reasoning,
    });

    return NextResponse.json({
      score,
      reasoning: parsed.reasoning,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}