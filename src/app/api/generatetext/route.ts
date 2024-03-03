import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OpenAI } from 'openai';


const openai = new OpenAI({
    apiKey: process.env.openai,
  });
  async function generateChatResponse(customQuery: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          // Assuming customQuery is a question from the user like "I like jackets, what do you recommend?"
          { role: "user", content: customQuery },
        ],
      });
  
      // Assuming the last message from the assistant is the response we want to use
      const lastMessage = completion.choices[0].message.content;
      return lastMessage || "No response from OpenAI";
    } catch (error) {
      console.error("Error generating chat response with OpenAI:", error);
      throw new Error('OpenAI chat generation failed');
    }
  }
  

  export async function POST(request: NextRequest) {
    try {
      const {parameter } = await request.json(); // customQuery is now expected in the request
  
      // Generate a chat response based on the custom query
      const chatResponse = await generateChatResponse(`Generate me a hip text message to send as marketing campaign for someone who likes ${parameter}! Only respond with the text`);
      console.log("OpenAI Chat Response:", chatResponse); // Debugging: Log the chat response
  
  
      // Return both the session info and the chat response
      return NextResponse.json({ chatResponse });
    } catch (err) {
      console.error(err); // Log the error for debugging
      return new Response(JSON.stringify({ error: { message: 'Failed to process request' }}), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

// The GET method implementation remains unchanged
