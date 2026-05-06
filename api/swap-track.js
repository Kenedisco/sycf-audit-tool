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

Track ${trackIndex + 1} needs to be replaced. Generate ONE track that genuinely fits this brand's identity and concept.

CRITICAL RULES:
1. Match music to BRAND IDENTITY and CUISINE — never to geographic location.
2. The replacement must be meaningfully different from all tracks already listed.
3. NEVER suggest: Michael Bublé, Norah Jones, Jack Johnson, generic lo-fi, elevator jazz.
4. Dig deep — avoid the obvious first choice. Prefer deeper cuts and less obvious artists.
5. At least consider whether a post-2010 track would serve better than a classic.

REFERENCE LIBRARY — draw from these by category:

ITALIAN / MEDITERRANEAN: Bruno Martino, Mina, Pino Daniele, Lucio Battisti, Domenico Modugno, Luigi Tenco, Fabrizio De André, Ornella Vanoni, Fred Buscaglione, Ennio Morricone, Diodato, Mahmood, Calcutta, Giovanni Allevi, Paolo Fresu, Ludovico Einaudi, Stefano Bollani, Enrico Pieranunzi

FRENCH / PARISIAN: Serge Gainsbourg, Jacques Brel, Barbara, Juliette Gréco, Henri Salvador, Michel Legrand, Benjamin Biolay, Camille, Melody Gardot, Pomme, Clara Luciani, Jacky Terrasson, Stacey Kent

JAPANESE / CITY POP: Ryuichi Sakamoto, Haruomi Hosono, Tatsuro Yamashita, Mariya Takeuchi, Anri, Miki Matsubara, Taeko Ohnuki, Nujabes, Cornelius, Ichiko Aoba, Hiroshi Yoshimura, Ryo Fukui

LATIN / BRAZILIAN: João Gilberto, Tom Jobim, Caetano Veloso, Gal Costa, Milton Nascimento, Seu Jorge, Bebel Gilberto, Elza Soares, Natalia Lafourcade, Jorge Drexler, Rodrigo Amarante, Bomba Estéreo (acoustic)

ARABIC / MIDDLE EASTERN: Fairuz, Um Kulthum, Warda Al-Jazairia, Marcel Khalife, Ziad Rahbani, Yasmine Hamdan, Anouar Brahem, Rabih Abou-Khalil, Natacha Atlas

LUXURY SPA / WELLNESS: Brian Eno, Harold Budd, Stars of the Lid, William Basinski, Max Richter, Ólafur Arnalds, Nils Frahm, Balmorhea, Jon Hopkins, Four Tet (quiet sets)

MODERN UPSCALE RESTAURANT / BAR: Sade, Massive Attack, Portishead, Bonobo, Quantic, Thievery Corporation, Nicolas Jaar, Tom Misch, Alfa Mist, Jordan Rakei, Erykah Badu, Moses Sumney, Lianne La Havas

LUXURY RETAIL / FASHION: Laurent Garnier, Floating Points, James Blake, Bon Iver, Weyes Blood, The XX, Trentemøller, Apparat, Perfume Genius

ROOFTOP / SUNDOWNER: Röyksopp, Bicep, Khruangbin, Tame Impala, Black Coffee, Themba, Bombino, Nicola Cruz, El Buho

BRUNCH / DAYTIME: GoGo Penguin, Portico Quartet, Alfa Mist, Fleet Foxes, José González, Leon Bridges, Anderson .Paak, Celeste, Corinne Bailey Rae

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
