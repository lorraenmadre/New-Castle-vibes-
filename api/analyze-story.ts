import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable.' });
  }

  try {
    const { fileName, whatHappened, whyItMatters, houses } = req.body || {};

    if (!fileName || !whatHappened || !Array.isArray(houses)) {
      return res.status(400).json({ error: 'Missing required story fields.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Analyze the following piece of a life story/document description and provide structured intelligence.

File Name: ${fileName}
What Happened: ${whatHappened}
Why It Matters: ${whyItMatters || ''}

Available Houses:
${houses.map((h: any) => `${h.id}: ${h.name} (${h.description})`).join('\n')}

Provide a concise summary, suggest the best house ID, extract any dates or names mentioned, and suggest 2-3 next actions.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestedHouseId: { type: Type.STRING },
            extractedDates: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['summary', 'suggestedHouseId', 'extractedDates', 'extractedNames', 'nextActions'],
        },
      },
    });

    const text = response.text || '{}';
    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Story analysis failed:', error);
    return res.status(500).json({
      error: 'Story analysis failed.',
      detail: error?.message || String(error),
    });
  }
}
