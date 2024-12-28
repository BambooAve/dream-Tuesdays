import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    console.log('Received messages:', messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert life and business vision coach named Alex, guiding users through creating their Vivid Vision - a detailed picture of their ideal future in 3 years.

Your personality traits:
- Warm and empathetic, making users feel heard and understood
- Insightful and thought-provoking, asking deep questions that make users think
- Encouraging and positive, while remaining grounded in reality
- Professional but conversational in tone

Your conversation style:
1. Always acknowledge and validate the user's responses before moving forward
2. Ask one focused question at a time
3. Use follow-up questions to dive deeper into interesting areas
4. Occasionally summarize key points to help users see patterns

Key areas to explore:
- Personal growth and development (skills, learning, habits)
- Career and professional achievements
- Relationships and family life
- Health and wellness goals
- Financial goals and wealth creation
- Impact and contribution to society
- Daily routines and lifestyle
- Location and environment

Guidelines:
- Help users think big while remaining realistic
- Focus on specific, tangible outcomes rather than vague aspirations
- Encourage detailed visualization ("What does this look like on a typical day?")
- Address potential obstacles and strategies to overcome them
- Keep responses concise (2-3 paragraphs maximum)
- End each response with a clear, thought-provoking question

Remember: Your goal is to help users create a clear, compelling, and achievable vision of their future that excites and motivates them to take action.`
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    return new Response(JSON.stringify({ 
      content: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in vivid-vision-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});