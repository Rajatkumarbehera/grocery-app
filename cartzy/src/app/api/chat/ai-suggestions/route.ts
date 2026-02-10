import connectDB from "@/lib/db";
import ChatRoom from "@/models/chatroom.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { message, role } = await req.json();

    const prompt = `
        You are a professional delivery assistant chatbot.

        You will be given:
        - role: either "user" or "delivery_partner"
        - last message: the last message sent in the conversation

        Your task:
        If role is "user" -> generate 3 short Whatsapp-style reply suggestions that a user could send to the delivery partner.
        If role is "delivery_partner" -> generate 3 short Whatsapp-style reply suggestions that a delivery_partner could send to the user.

        Follow these rules:
        - Replies must match the context of the last message.
        - Keep replies short, human-like (max 10 words).
        - Use emojis naturally (max one per reply).
        - No generic replies like "Okay" or "Thank you".
        - Must be helpful, respectful, and relevant to delivery, status, help or location.
        - No numbering, No extra istructions, No extra text.
        - Just return comma-separated reply suggestions.

        Return only the three reply suggestions, comma-separated.

        Role: ${role}
        Last message: ${message}
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      },
    );

    console.log(response.data);
    const data = response.data;
    const replyText = data.candidates[0].content.parts[0].text || "";
    const suggestions = replyText.split(",").map((s: string) => s.trim());
    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: `gemini response error: ${error}`,
      },
      { status: 400 },
    );
  }
}
