import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Word count targets for different lengths
const LENGTH_TARGETS = {
  short: { min: 100, max: 300, target: 200 },
  medium: { min: 300, max: 600, target: 450 },
  long: { min: 600, max: 1000, target: 800 }
};

export const generateStory = async ({ prompt, length, title }) => {
  try {
    const lengthSpec = LENGTH_TARGETS[length];
    
    // Build the system prompt
    const systemPrompt = `You are an expert fiction writer who creates engaging, well-structured stories. Your task is to write a complete story based on the user's prompt.

REQUIREMENTS:
- Write a ${length} story (${lengthSpec.target} words, between ${lengthSpec.min}-${lengthSpec.max} words)
- Use an engaging and creative tone
- Include a clear beginning, middle, and end
- Create engaging characters and dialogue
- Use descriptive language and vivid imagery
- Ensure the story is complete and satisfying
- Keep content appropriate for all audiences
- Format with proper paragraph breaks

RESPONSE FORMAT:
Return a JSON object with exactly this structure:
{
  "title": "An engaging story title",
  "content": "The complete story content with proper paragraph formatting"
}

Make sure the JSON is valid and properly escaped.`;

    // Build the user prompt
    const userPrompt = `Story Prompt: ${prompt}

${title ? `Suggested Title: ${title}` : ''}

Please write the story now, following all the requirements above.`;

    // Generate content
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let storyData;
    try {
      // Clean up the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      storyData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw response:', text);
      
      // Fallback: try to extract title and content manually
      const titleMatch = text.match(/"title":\s*"([^"]+)"/);
      const contentMatch = text.match(/"content":\s*"([\s\S]+?)"\s*\}/);
      
      if (titleMatch && contentMatch) {
        storyData = {
          title: titleMatch[1],
          content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
        };
      } else {
        // Final fallback
        storyData = {
          title: title || 'Generated Story',
          content: text.replace(/```json|```/g, '').trim()
        };
      }
    }

    // Validate response
    if (!storyData.title || !storyData.content) {
      throw new Error('Invalid story structure received from AI');
    }

    // Clean up content formatting
    storyData.content = storyData.content
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    // Estimate token usage (rough approximation)
    const tokensUsed = Math.ceil((prompt.length + storyData.content.length) / 4);

    return {
      title: storyData.title,
      content: storyData.content,
      tokensUsed
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('AI service quota exceeded. Please try again later.');
    } else if (error.message?.includes('API_KEY_INVALID')) {
      throw new Error('AI service configuration error.');
    } else if (error.message?.includes('SAFETY')) {
      throw new Error('Content safety filters were triggered. Please try a different, family-friendly prompt.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    } else {
      throw new Error(`Story generation failed: ${error.message}`);
    }
  }
};