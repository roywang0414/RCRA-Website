const { sql, requireAdmin } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { requesterId, staffId } = req.body || {};
  if (!requesterId || !staffId) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  try {
    await requireAdmin(requesterId);
    await sql`DELETE FROM staff WHERE id = ${staffId}`;
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(e.statusCode || 500).json({ error: e.message || 'Could not delete login.' });
  }
};
