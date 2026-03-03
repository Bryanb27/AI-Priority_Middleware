import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a task prioritization AI. Analyze the task and return ONLY a number from 1 to 10 representing urgency and impact.",
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
      temperature: 0,
    });

    const score = completion.choices[0].message.content;

    return NextResponse.json({ score });
  } catch (error) {
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}