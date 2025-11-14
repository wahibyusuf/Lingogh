
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { DailyPlan, DailyPlanTask, Source } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


export const startChat = (language: string): Chat => {
    const ai = getAiClient();
    const systemInstruction = `You are Lingogh, an expert, friendly, and encouraging ${language} language tutor. 
    Your goal is to help me learn ${language} in a natural, conversational way.
    - Keep your responses concise and engaging.
    - Simulate real-life conversations (e.g., at a café, asking for directions).
    - Introduce slang and cultural nuances where appropriate.
    - When I make a mistake, gently correct me and explain why, like a coach.
    - Test my knowledge creatively. For example, ask me to translate something, then rephrase it, then use it in a sentence.
    - When asked for phrases, provide them with context and pronunciation tips (in a simple format).
    - If asked about cultural topics or facts, provide accurate, up-to-date information.
    - Always respond in a mix of English and ${language} to aid learning, unless the user asks for English only. Start with an encouraging greeting in ${language}.`;
    
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<{ text: string, sources: Source[] }> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        const text = response.text;
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || '',
            }))
            .filter((source: Source) => source.uri && source.title);

        return { text, sources };
    } catch (error) {
        console.error("Error sending message:", error);
        return { text: "I'm sorry, I encountered an error. Please try again.", sources: [] };
    }
};

export const generateDailyPlan = async (language: string): Promise<DailyPlan | null> => {
    try {
        const ai = getAiClient();
        const prompt = `Create a personalized, 25-minute daily language learning plan for a beginner in ${language}. 
        The plan should include a balanced mix of listening, speaking, and writing activities.
        Format the response as a JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    description: { type: Type.STRING },
                                    type: { type: Type.STRING, enum: ['listening', 'speaking', 'writing', 'other'] }
                                },
                                required: ['description', 'type']
                            }
                        }
                    },
                    required: ['tasks']
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        const date = new Date().toISOString().split('T')[0];
        const tasksWithIds = jsonResponse.tasks.map((task: Omit<DailyPlanTask, 'id' | 'completed'>) => ({
            ...task,
            id: self.crypto.randomUUID(),
            completed: false,
        }));

        return { date, tasks: tasksWithIds };
    } catch (error) {
        console.error("Error generating daily plan:", error);
        return null;
    }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A vibrant, artistic image representing the phrase: "${prompt}". Stylize it to look like a beautiful, modern digital painting.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });
        
        const base64ImageBytes: string | undefined = response.generatedImages[0]?.image.imageBytes;
        if (base64ImageBytes) {
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};
