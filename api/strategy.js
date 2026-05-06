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
- tracks: exactly 5 reference tracks chosen with surgical precision for THIS specific brand.

CRITICAL MUSIC MATCHING RULES:
1. Match music to the BRAND IDENTITY and CUISINE — never to the venue's geographic location. An Italian restaurant in Dubai plays Italian music. A Japanese restaurant in London plays Japanese-influenced music.

2. NEVER default to obvious or overplayed choices. Avoid: Michael Bublé, Norah Jones, Jack Johnson, generic lo-fi, elevator jazz. Dig deeper.

3. ALWAYS mix classics and contemporary. At least 2 of the 5 tracks must be post-2010.

4. Draw from this expanded reference library by category — go beyond obvious names:

ITALIAN / MEDITERRANEAN:
Classic: Bruno Martino, Mina, Pino Daniele, Lucio Battisti, Domenico Modugno, Luigi Tenco, Fabrizio De André, Ornella Vanoni, Sergio Endrigo, Peppino Di Capri, Ennio Morricone (non-film), Fred Buscaglione
Modern: Diodato, Mahmood, Calcutta, Carmen Consoli, Giovanni Allevi, Paolo Fresu, Ludovico Einaudi, Yann Tiersen (for French-Italian crossover)
Jazz/Bossa crossover: Enrico Pieranunzi, Stefano Bollani, Rita Marcotulli

FRENCH / PARISIAN:
Classic: Serge Gainsbourg, Jacques Brel, Barbara, Juliette Gréco, Henri Salvador, Georges Brassens, Michel Legrand, Claude François
Modern: Benjamin Biolay, Camille, Melody Gardot (Paris sessions), Pomme, Clara Luciani, Flavien Berger, Nicolas Jaar (French sets)
Jazz: Jacky Terrasson, Henri Texier, Stacey Kent (French repertoire)

JAPANESE / JAPANESE-INSPIRED:
Classic: Ryuichi Sakamoto, Haruomi Hosono, Yellow Magic Orchestra, Tatsuro Yamashita, Mariya Takeuchi
City Pop: Anri, Miki Matsubara, Junko Ohashi, Taeko Ohnuki
Modern: Nujabes, Cornelius, Shugo Tokumaru, Ichiko Aoba, Floating Points (Japanese sets), Hiroshi Yoshimura
Jazz: Ryo Fukui, Kotaro Oshio, Makoto Ozone

LATIN / SOUTH AMERICAN:
Brazilian: João Gilberto, Astrud Gilberto, Tom Jobim, Caetano Veloso, Gal Costa, Milton Nascimento, Gilberto Gil, Seu Jorge, Bebel Gilberto, Elza Soares
Cuban/Afro-Latin: Ibrahim Ferrer, Omara Portuondo, Chucho Valdés, Irakere, Los Van Van
Contemporary: Natalia Lafourcade, Mon Laferte, Jorge Drexler, Bomba Estéreo (acoustic), Rodrigo Amarante

ARABIC / MIDDLE EASTERN:
Classic: Fairuz, Um Kulthum, Abdel Halim Hafez, Warda Al-Jazairia, Sabah Fakhri
Modern: Marcel Khalife, Ziad Rahbani, Khaled (acoustic), Yasmine Hamdan, Mashrou' Leila
Fusion/Ambient: Anouar Brahem, Rabih Abou-Khalil, Omar Souleyman (ambient edits), Natacha Atlas

LUXURY HOTEL / SPA / WELLNESS:
Ambient: Brian Eno, Harold Budd, Stars of the Lid, William Basinski, Moby (Long Ambients), Max Richter, Ólafur Arnalds, Nils Frahm
Organic/Acoustic: Bonobo (acoustic), GoGo Penguin, Portico Quartet, Balmorhea
Deep Chill: Jon Hopkins, Four Tet (quiet sets), Floating Points, Caribou (ambient)

MODERN UPSCALE RESTAURANT / BAR:
Nu-Jazz / Trip-Hop: Sade, Massive Attack, Portishead, Lamb, Zero 7, Bonobo, Quantic, Thievery Corporation
Deep House / Sophisticated Electronic: Trentemøller, Nicolas Jaar, Tom Misch, Alfa Mist, Jordan Rakei
Neo-Soul: Erykah Badu, D'Angelo, Lalah Hathaway, Moses Sumney, Lianne La Havas

LUXURY RETAIL / FASHION:
Leftfield Electronic: Laurent Garnier, Floating Points, Peggy Gou (melodic), Modeselektor
Indie/Art Pop: Bon Iver, James Blake, Sufjan Stevens, Perfume Genius, Weyes Blood
Dark Luxury: These New Puritans, The XX, Trentemøller, Apparat

ROOFTOP / SUNDOWNER / POOLSIDE:
Balearic / Melodic House: Röyksopp, Trentemøller, Bicep, Khruangbin, Tame Impala (remixes)
Afro-House: Black Coffee, Themba, Enoo Napa
World / Organic: Bombino, Rodrigo y Gabriela, El Buho, Nicola Cruz

BRITISH / PUB / GASTROPUB:
Classic: The Kinks, Madness, Ian Dury, Nick Drake, Van Morrison, Richard Thompson
Indie: The National, Elbow, Laura Marling, Alt-J, Bon Iver
Jazz: Chet Baker, Bill Evans, Barney Wilen

BRUNCH / DAYTIME CAFÉ:
Nu-Jazz: Nils Frahm, GoGo Penguin, Alfa Mist, Portico Quartet
Indie Folk: Bon Iver, Fleet Foxes, José González, Sufjan Stevens
Soul/R&B: Leon Bridges, Anderson .Paak, Celeste, Corinne Bailey Rae

5. Each track must have a clear, specific reason why it fits THIS venue — not generic praise.

6. If the venue is multi-concept (e.g. retail + café, hotel + rooftop), blend appropriately across the 5 tracks.

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
        model: 'claude-sonnet-4-6',
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
