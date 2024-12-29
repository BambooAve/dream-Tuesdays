import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all messages from the session
    const { data: messages, error: messagesError } = await supabase
      .from('vivid_vision_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    // Format conversation for GPT
    const conversation = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate vivid vision using GPT-4
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating vivid visions - detailed descriptions of someone's ideal future exactly 365 days from now, written in present tense as if it's already happened. Focus on specific achievements, emotional states, and tangible changes across all life areas. Be specific and personal, using details from their conversation."
          },
          ...conversation,
          {
            role: "user",
            content: "Based on our conversation, create a vivid vision of my life exactly 365 days from now. Write in present tense, be specific about achievements and changes, and make it personal to me. Include specific details we discussed."
          }
        ],
        temperature: 0.7,
      }),
    });

    const visionResponse = await openAIResponse.json();
    const vividVision = visionResponse.choices[0].message.content;

    // Extract goals using GPT-4
    const goalsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting specific, actionable goals from conversations and categorizing them. Categories are: HEALTH_AND_WELLNESS, CAREER_AND_PROFESSIONAL_GROWTH, FINANCIAL_GOALS, PERSONAL_DEVELOPMENT, RELATIONSHIPS_AND_SOCIAL_LIFE, TRAVEL_AND_ADVENTURE, HABITS_AND_LIFESTYLE_CHANGES, CREATIVITY_AND_EXPRESSION, COMMUNITY_AND_CONTRIBUTION, SPIRITUALITY_AND_PURPOSE"
          },
          ...conversation,
          {
            role: "user",
            content: "Extract specific goals from our conversation and return them as a JSON array. Each goal should have: category_type (from the list above), title (short goal title), and description (detailed explanation). Format as valid JSON."
          }
        ],
        temperature: 0.7,
      }),
    });

    const goalsData = await goalsResponse.json();
    const goals = JSON.parse(goalsData.choices[0].message.content);

    // Update user's profile with vivid vision
    const { error: visionError } = await supabase
      .from('profiles')
      .update({ vivid_vision: vividVision })
      .eq('id', userId);

    if (visionError) throw visionError;

    // Get user's categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, type')
      .eq('user_id', userId);

    if (categoriesError) throw categoriesError;

    // Create goals in the database
    let goalsCreated = 0;
    for (const goal of goals) {
      const category = categories.find(c => c.type === goal.category_type);
      if (category) {
        const { error: goalError } = await supabase
          .from('goals')
          .insert({
            user_id: userId,
            category_id: category.id,
            title: goal.title,
            description: goal.description,
          });
        
        if (!goalError) goalsCreated++;
      }
    }

    console.log(`Processed chat completion for session ${sessionId}:`);
    console.log(`- Created ${goalsCreated} goals`);
    console.log(`- Generated and saved vivid vision`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        goalsCreated,
        vividVision 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing chat completion:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});