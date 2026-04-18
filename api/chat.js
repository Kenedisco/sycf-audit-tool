module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { businessIntel, chatHistory = [], questionCount = 0 } = req.body;

  const system = `You are Kennedy, Music Director of Sound You Can Feel (SYCF), a Dubai-based sonic branding consultancy. You are gathering information to build a bespoke music strategy for a business.

Your job is to ask ONE focused question at a time to gather the most useful information for building their music strategy. Be warm, expert, and genuinely curious. Show you've read their brief carefully.

Key info to gather across 2-3 questions:
- Trading hours and how the vibe shifts throughout the day
- Their target clientele / ideal customer profile  
- Any specific music preferences, references, or things to avoid

After the user has answered 2-3 questions, respond with a JSON object ONLY:
{"done": true, "summary": "brief summary of what you learned"}

Otherwise respond with plain text — your next question. No JSON unless done. No markdown bold (**text**). Keep responses warm and concise.`;

  const messages = [
    { role: 'user', content: `Business brief: ${businessIntel}` },
    ...chatHistory
  ];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system,
        messages
      })
    });

    const rawText = await response.text();
    if (!response.ok) {
      let errMsg = `API error ${response.status}`;
      try { errMsg = JSON.parse(rawText)?.error?.message || errMsg; } catch (_) {}
      return res.status(response.status).json({ error: errMsg });
    }

    const data = JSON.parse(rawText);
    const text = data.content?.[0]?.text?.trim() || '';

    // Check if done
    const cleanText = text.replace(/```json[\s\S]*?```|```/g, '').trim();
    try {
      const parsed = JSON.parse(cleanText);
      if (parsed.done) return res.status(200).json({ done: true, summary: parsed.summary, text });
    } catch (_) {}

    // Force done after 3 questions
    if (questionCount >= 2) {
      return res.status(200).json({ done: true, summary: '', text });
    }

    return res.status(200).json({ done: false, text });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
