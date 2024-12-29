import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, userId } = await req.json();

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch the conversation
    const { data: messages } = await supabase
      .from('vivid_vision_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!messages || messages.length === 0) {
      throw new Error('No messages found for this session');
    }

    // Format conversation for OpenAI
    const conversation = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add system message to instruct GPT about goal extraction
    const systemMessage = {
      role: 'system',
      content: `You are a goal extraction specialist. Analyze the conversation and extract specific, actionable goals. 
      For each goal, determine:
      1. The most appropriate category from: HEALTH_AND_WELLNESS, CAREER_AND_PROFESSIONAL_GROWTH, FINANCIAL_GOALS, 
         PERSONAL_DEVELOPMENT, RELATIONSHIPS_AND_SOCIAL_LIFE, TRAVEL_AND_ADVENTURE, HABITS_AND_LIFESTYLE_CHANGES, 
         CREATIVITY_AND_EXPRESSION, COMMUNITY_AND_CONTRIBUTION, SPIRITUALITY_AND_PURPOSE
      2. A clear title
      3. A detailed description
      4. A suggested target date (if mentioned or implied)
      5. A priority level (1-5)
      
      Format your response as a JSON array of goals, each with these properties:
      {
        category_type: string (one of the above categories),
        title: string,
        description: string,
        target_date: string (YYYY-MM-DD format, or null),
        priority: number (1-5)
      }`
    };

    // Get AI to analyze conversation and extract goals
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...conversation],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse);

    let extractedGoals;
    try {
      extractedGoals = JSON.parse(aiResponse.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse goals from AI response');
    }

    // Get user's categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId);

    if (!categories) {
      throw new Error('No categories found for user');
    }

    // Create goals in database
    for (const goal of extractedGoals) {
      const category = categories.find(c => c.type === goal.category_type);
      if (category) {
        await supabase
          .from('goals')
          .insert({
            user_id: userId,
            category_id: category.id,
            title: goal.title,
            description: goal.description,
            target_date: goal.target_date,
            priority: goal.priority,
            status: 'in_progress'
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true, goalsCreated: extractedGoals.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-chat-completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});