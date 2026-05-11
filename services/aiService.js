import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_API_KEY
});

export async function generateCoachingResponse(systemPrompt, userMessage) {

  try {

    const response = await client.chat.completions.create({

      model: 'meta-llama/Meta-Llama-3-70B-Instruct',

      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],

      temperature: 0.7,
      max_tokens: 300
      
    });
    console.log('AI Response:', response.choices[0].message.content);
    return response.choices[0].message.content;

  } catch (error) {

    console.log('AI Service Error:', error.message);

    if (error.response) {
      console.log(error.response.data);
    }

    return 'AI service temporarily unavailable.';
  }
}

export async function generateSessionTitle(message) {

  try {

    const response = await client.chat.completions.create({

      model: 'meta-llama/Meta-Llama-3-70B-Instruct',

      messages: [
        {
          role: 'system',
          content:
            'Generate a short business chat title in maximum 5 words.'
        },
        {
          role: 'user',
          content: message
        }
      ],

      temperature: 0.3,
      max_tokens: 20

    });

    return response.choices[0].message.content.trim();

  } catch (error) {

    console.log('Title Error:', error.message);

    return 'New Chat';
  }
}