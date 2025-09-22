// api/partners.js - Vercel serverless
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    const { organization, name, email, message, source } = req.body || {};
    if (!organization || !name || !email) return res.status(400).json({ error: 'Missing required fields' });

    const lead = { organization, name, email, message: message||'', source: source||'landing', receivedAt: new Date().toISOString() };
    console.log('Novo lead partner:', lead);

    // Envia para webhook externo (Make/Zapier/Slack/webhook.site) se definido
    const webhook = process.env.PARTNERS_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lead) });
      } catch (err) { console.error('Webhook send error', err); }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error /api/partners', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
