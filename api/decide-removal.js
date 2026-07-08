const { sql, requireAdmin } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { requesterId, removalId, decision } = req.body || {};
  if (!requesterId || !removalId || !['done', 'denied'].includes(decision)) {
    res.status(400).json({ error: 'Missing or invalid fields.' });
    return;
  }
  try {
    await requireAdmin(requesterId);
    await sql`UPDATE removals SET status = ${decision} WHERE id = ${removalId}`;
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(e.statusCode || 500).json({ error: e.message || 'Could not update removal.' });
  }
};
