module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, location, businessIntel, azanRequired } = req.body;

  if (!name || !email || !businessIntel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const azanNote = azanRequired
    ? 'This is a GCC venue — include a note that SYCF provides automated Azan silence protocol.'
    : '';

  const prompt = `You are Kennedy, Music Director of Sound You Can Feel (SYCF), a Dubai-based sonic branding consultancy with 25 years experience serving luxury hospitality, retail and lifestyle brands across the GCC and globally.

Based on the business intelligence below, generate a professional Music Strategy & Direction document.

CLIENT DETAILS:
Name: ${name}
Location: ${location}
Business Intel: ${businessIntel}
${azanRequired ? 'Azan Silence Required: Yes' : ''}

Generate the strategy as a JSON object with EXACTLY this structure:
{
  "businessName": "full business name",
  "tagline": "a short evocative sonic brand tagline in quotes — poetic, luxury, specific to this brand",
  "businessDescription": "one sentence describing the business and its positioning",
  "overview": "2-3 sentences describing the sonic philosophy for this venue — evocative, specific, luxury tone",
  "sonicPersonality": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "timeZones": [
    {
      "label": "time range e.g. 7am – 12pm",
      "mood": "short mood descriptor",
      "genres": "comma-separated genre list",
      "bpm": "BPM range e.g. 95–108 BPM"
    }
  ],
  "tracks": [
    {
      "artist": "Artist Name",
      "title": "Track Title",
      "description": "2-3 sentences explaining why this track fits this specific venue — specific, expert, evocative"
    }
  ],
  "azanNote": "${azanNote}"
}

Rules:
- timeZones: generate 3-5 zones appropriate to the venue's operating hours and type
- tracks: exactly 5 reference tracks — chosen with surgical precision for THIS specific brand. Consider the venue's cuisine/culture, clientele demographic, geographic market, energy level, and brand positioning. A Latin-Japanese fusion restaurant needs tracks that reflect that fusion. A luxury spa in Riyadh needs completely different tracks to a beach club in Ibiza. Go deep — avoid defaulting to obvious "safe luxury BGM" artists. Draw from the full breadth of your music knowledge: explore subgenres, regional scenes, specific cultural influences relevant to this brand. Each track must have a clear, specific reason why it fits THIS venue and not any other.
- Tone throughout: luxury, expert, specific — never generic
- Respond ONLY with the JSON object, no markdown, no preamble`;

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
        max_tokens: 2000,
        system: 'You are a music strategy JSON generator. You ONLY output valid JSON. Never ask questions. Never write conversational text. Never use markdown. Output ONLY the JSON object requested, nothing else.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const rawText = await response.text();
    if (!response.ok) {
      let errMsg = `Anthropic API error ${response.status}`;
      try { errMsg = JSON.parse(rawText)?.error?.message || errMsg; } catch (_) {}
      return res.status(response.status).json({ error: errMsg });
    }

    let data;
    try { data = JSON.parse(rawText); } catch (_) {
      return res.status(500).json({ error: 'Invalid response from AI' });
    }

    const raw = data.content?.[0]?.text?.trim() || '';
    const clean = raw.replace(/```json[\s\S]*?```|```/g, '').trim();

    let strategy;
    try { strategy = JSON.parse(clean); } catch (_) {
      return res.status(500).json({ error: 'Strategy generation failed. Please try again.' });
    }

    return res.status(200).json({ strategy, clientName: name, clientEmail: email, location });

  } catch (err) {
    console.error('Strategy API error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
