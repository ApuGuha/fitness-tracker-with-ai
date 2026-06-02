import Plan from '../models/Plan.js';
import User from '../models/User.js';

const AI_PROVIDERS = {
  openrouter: {
    name: 'OpenRouter (Free)',
    free: true,
    requiresKey: 'OPENROUTER_API_KEY',
    generate: async (prompt, user) => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://fitsync-ai.com',
          'X-Title': 'FitSync AI'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an expert fitness and nutrition AI assistant. Always respond with valid JSON only.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter error: ${err}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    }
  }
};

export const getAvailableModels = async (req, res) => {
  const available = [];
  
  for (const [key, provider] of Object.entries(AI_PROVIDERS)) {
    const hasKey = !!(process.env[provider.requiresKey] && !process.env[provider.requiresKey].includes('your-'));
    available.push({
      id: key,
      name: provider.name,
      free: provider.free,
      available: hasKey
    });
  }
  
  res.json(available);
};

const getDefaultProvider = () => {
  for (const [key, provider] of Object.entries(AI_PROVIDERS)) {
    if (process.env[provider.requiresKey] && !process.env[provider.requiresKey].includes('your-')) {
      return { key, provider };
    }
  }
  throw new Error('No AI provider is configured. Please set API keys in .env file.');
};

export const generatePlan = async (req, res) => {
  try {
    const { concern } = req.body;
    if (!concern) {
      return res.status(400).json({ error: 'Concern or request details are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { provider } = getDefaultProvider();

    const prompt = `
You are an expert fitness and nutrition AI assistant. 
The user has the following profile:
- Age: ${user.profile?.age || 'Unknown'}
- Height: ${user.profile?.height || 'Unknown'} cm
- Weight: ${user.profile?.weight || 'Unknown'} kg
- Target Weight: ${user.profile?.targetWeight || 'Unknown'} kg
- Fitness Goals: ${user.profile?.fitnessGoals || 'None specified'}
- Activity Level: ${user.profile?.activityLevel || 'None specified'}
- Dietary Preferences: ${user.profile?.dietaryPreferences || 'None specified'}

The user has the following concern/request:
"${concern}"

Based on their profile and concern, create a detailed, highly structured Diet Chart and Workout Plan.
You MUST format your response strictly as a JSON object with this shape:
{
  "dietChart": {
    "summary": "Short explanation of the diet approach.",
    "dailyCalories": "e.g. 2000 kcal",
    "meals": [
      { "name": "Breakfast", "recommendation": "...", "calories": "..." },
      { "name": "Lunch", "recommendation": "...", "calories": "..." },
      { "name": "Dinner", "recommendation": "...", "calories": "..." },
      { "name": "Snacks", "recommendation": "...", "calories": "..." }
    ]
  },
  "workoutPlan": {
    "summary": "Short explanation of the workout approach.",
    "frequency": "e.g. 4 days a week",
    "exercises": [
      { "day": "Monday", "focus": "...", "routines": ["...", "..."] },
      { "day": "Wednesday", "focus": "...", "routines": ["...", "..."] }
    ]
  }
}
Return ONLY valid JSON.
`;

    const responseText = await provider.generate(prompt, user);
    
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    const newPlan = new Plan({
      userId: user._id,
      concern,
      dietChart: parsedData.dietChart,
      workoutPlan: parsedData.workoutPlan
    });

    await newPlan.save();

    res.json(newPlan);

  } catch (error) {
    console.error('Error generating AI plan:', error);
    res.status(500).json({ error: 'Failed to generate plan. ' + error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.userId });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
};
