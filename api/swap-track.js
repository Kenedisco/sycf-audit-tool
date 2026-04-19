module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { businessName, businessIntel, currentTracks, trackIndex } = req.body;

  const currentList = currentTracks.map((t, i) => `${i + 1}. ${t.artist} — ${t.title}`).join('\n');

  const prompt = `You are Kennedy, Music Director of Sound You Can Feel (SYCF).

Business: ${businessName}
Brief: ${businessIntel}

Current reference tracks:
${currentList}

Track ${trackIndex + 1} needs to be replaced. Generate ONE track that genuinely fits this brand's identity and concept. CRITICAL: do not match music to the venue's geographic location — match it to the brand's culture, cuisine, and clientele. The replacement must be meaningfully different from all tracks already listed.

Respond ONLY with a JSON object:
{
  "artist": "Artist Name",
  "title": "Track Title",
  "description": "2-3 sentences explaining why this track fits this specific venue — specific, expert, evocative"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: 'You are a music track JSON generator. Output ONLY valid JSON. No markdown, no preamble.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const rawText = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: 'API error' });

    const data = JSON.parse(rawText);
    const text = data.content?.[0]?.text?.trim() || '';
    const clean = text.replace(/```json[\s\S]*?```|```/g, '').trim();
    const track = JSON.parse(clean);
    return res.status(200).json({ track });

  } catch (err) {
    console.error('Swap track error:', err);
    return res.status(500).json({ error: 'Failed to generate replacement track.' });
  }
};
