module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { strategy, clientName, clientEmail, location } = req.body;

  if (!strategy || !clientEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const timeZoneRows = strategy.timeZones.map(z => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;font-weight:600;color:#222;">${z.label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#444;">${z.mood}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#444;">${z.genres}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#888;white-space:nowrap;">${z.bpm}</td>
    </tr>`).join('');

  const trackItems = strategy.tracks.map((t, i) => `
    <div style="margin-bottom:18px;">
      <p style="margin:0 0 4px;font-weight:700;color:#222;">${i + 1}. ${t.artist} — ${t.title}</p>
      <p style="margin:0;color:#555;line-height:1.6;">${t.description}</p>
    </div>`).join('');

  const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
  <div style="max-width:680px;margin:40px auto;background:#fff;">
    
    <!-- Header -->
    <div style="background:#0a0a0a;padding:40px 48px;text-align:center;">
      <p style="margin:0 0 6px;color:#C9A84C;letter-spacing:3px;font-size:11px;font-family:Arial,sans-serif;text-transform:uppercase;">Sound You Can Feel</p>
      <h1 style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:400;letter-spacing:1px;">Music Strategy & Direction</h1>
      <p style="margin:0;color:#888;font-size:13px;font-family:Arial,sans-serif;">Kennedy · Dubai UAE · SYCF Global Curator Network</p>
    </div>

    <!-- Business Header -->
    <div style="padding:36px 48px 24px;border-bottom:1px solid #eee;">
      <h2 style="margin:0 0 8px;font-size:24px;color:#111;font-weight:400;">${strategy.businessName}</h2>
      <p style="margin:0 0 12px;color:#C9A84C;font-style:italic;font-size:16px;">${strategy.tagline}</p>
      <p style="margin:0;color:#666;font-size:14px;font-family:Arial,sans-serif;">${strategy.businessDescription}</p>
    </div>

    <!-- Overview -->
    <div style="padding:28px 48px;border-bottom:1px solid #eee;">
      <h3 style="margin:0 0 12px;font-size:11px;letter-spacing:3px;color:#999;font-family:Arial,sans-serif;text-transform:uppercase;">Overview</h3>
      <p style="margin:0;color:#333;line-height:1.8;font-size:15px;">${strategy.overview}</p>
    </div>

    <!-- Sonic Personality -->
    <div style="padding:28px 48px;border-bottom:1px solid #eee;">
      <h3 style="margin:0 0 16px;font-size:11px;letter-spacing:3px;color:#999;font-family:Arial,sans-serif;text-transform:uppercase;">Sonic Personality</h3>
      <p style="margin:0;color:#333;font-style:italic;font-size:15px;">${strategy.sonicPersonality.join(' · ')}</p>
    </div>

    <!-- Music Direction -->
    <div style="padding:28px 48px;border-bottom:1px solid #eee;">
      <h3 style="margin:0 0 16px;font-size:11px;letter-spacing:3px;color:#999;font-family:Arial,sans-serif;text-transform:uppercase;">Music Direction</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif;">
        <thead>
          <tr style="background:#f8f8f8;">
            <th style="padding:10px 16px;text-align:left;font-size:10px;letter-spacing:2px;color:#999;text-transform:uppercase;font-weight:400;">Time</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;letter-spacing:2px;color:#999;text-transform:uppercase;font-weight:400;">Mood</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;letter-spacing:2px;color:#999;text-transform:uppercase;font-weight:400;">Genres</th>
            <th style="padding:10px 16px;text-align:left;font-size:10px;letter-spacing:2px;color:#999;text-transform:uppercase;font-weight:400;">BPM</th>
          </tr>
        </thead>
        <tbody>${timeZoneRows}</tbody>
      </table>
    </div>

    <!-- Reference Tracks -->
    <div style="padding:28px 48px;border-bottom:1px solid #eee;">
      <h3 style="margin:0 0 20px;font-size:11px;letter-spacing:3px;color:#999;font-family:Arial,sans-serif;text-transform:uppercase;">Sampler — 5 Reference Tracks</h3>
      ${trackItems}
    </div>

    ${strategy.azanNote ? `
    <div style="padding:20px 48px;border-bottom:1px solid #eee;background:#fafafa;">
      <p style="margin:0;color:#555;font-size:14px;font-family:Arial,sans-serif;">${strategy.azanNote}</p>
    </div>` : ''}

    <!-- What We Handle -->
    <div style="padding:28px 48px;border-bottom:1px solid #eee;">
      <h3 style="margin:0 0 16px;font-size:11px;letter-spacing:3px;color:#999;font-family:Arial,sans-serif;text-transform:uppercase;">What We Handle For You</h3>
      <p style="margin:0 0 16px;color:#333;font-size:15px;line-height:1.7;">Sound You Can Feel (SYCF) provides a fully automated music system and manages every aspect of your sonic environment:</p>
      <ul style="margin:0 0 20px;padding-left:20px;color:#444;font-family:Arial,sans-serif;font-size:14px;line-height:2;">
        <li>A bespoke soundscape that perfectly matches the mood throughout the day, every day</li>
        <li>Monthly playlist refreshes — so it never gets stale</li>
        <li>Compact digital music players, installed and configured</li>
        <li>Fully licensed music content — zero legal exposure for you</li>
        <li>Special playlists for events, seasons, and holidays</li>
        <li>Automated Azan silence system</li>
        <li>24/7 technical support</li>
        <li>Music live within days of signing</li>
      </ul>
      <p style="margin:0 0 20px;color:#333;font-size:15px;line-height:1.7;">We ensure the music consistently reflects <strong>${strategy.businessName}</strong>'s identity and keeps your guests feeling exactly the right way — with no stress or headache for you.</p>
      <p style="margin:0 0 24px;color:#333;font-size:15px;line-height:1.7;font-style:italic;">You have two choices. Take the strategy above and implement it yourself — or for just a few dollars a day, let SYCF manage your entire sonic environment. No stress, no headaches, no thinking about it ever again.</p>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://wa.me/971585991639" style="display:inline-block;margin:0 8px 12px;background:#0a0a0a;color:#C9A84C;padding:14px 28px;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">WhatsApp Kennedy</a>
        <a href="mailto:kennedy@soundyoucanfeel.me" style="display:inline-block;margin:0 8px 12px;border:1px solid #0a0a0a;color:#0a0a0a;padding:14px 28px;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Send Email</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:28px 48px;text-align:center;background:#0a0a0a;">
      <p style="margin:0 0 4px;color:#C9A84C;font-size:13px;letter-spacing:1px;">Kennedy · Music Director</p>
      <p style="margin:0;color:#666;font-size:12px;font-family:Arial,sans-serif;">Sound You Can Feel · Dubai UAE · soundyoucanfeel.me</p>
    </div>

  </div>
</body>
</html>`;

  const leadHtml = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;padding:32px;color:#333;">
  <h2 style="color:#C9A84C;">New Strategy Lead</h2>
  <table style="border-collapse:collapse;width:100%;max-width:500px;">
    <tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#555;">Name</td><td style="padding:8px 0;">${clientName}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${clientEmail}">${clientEmail}</a></td></tr>
    <tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#555;">Location</td><td style="padding:8px 0;">${location}</td></tr>
    <tr><td style="padding:8px 16px 8px 0;font-weight:bold;color:#555;">Business</td><td style="padding:8px 0;">${strategy.businessName}</td></tr>
  </table>
  <p style="margin-top:24px;color:#888;font-size:13px;">Strategy has been sent to the client automatically.</p>
</body>
</html>`;

  try {
    // Send to client
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'SYCF <kennedy@soundyoucanfeel.me>',
        to: [clientEmail],
        subject: `Your Music Strategy — ${strategy.businessName}`,
        html: clientHtml
      })
    });

    if (!clientRes.ok) {
      const err = await clientRes.text();
      console.error('Resend client error:', err);
      return res.status(500).json({ error: 'Email delivery failed. Please check your Resend configuration.' });
    }

    // Send lead notification to Kennedy
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'SYCF Leads <kennedy@soundyoucanfeel.me>',
        to: ['kennedy@soundyoucanfeel.me'],
        subject: `New Lead: ${strategy.businessName} — ${clientName}`,
        html: leadHtml
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Email delivery failed.' });
  }
};
