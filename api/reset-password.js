const { sql, requireAdmin, genTempPassword } = require('./_db');
const { hashPassword } = require('./_hash');

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
    const tempPassword = genTempPassword();
    const passwordHash = hashPassword(tempPassword);
    await sql`UPDATE staff SET password_hash = ${passwordHash} WHERE id = ${staffId}`;
    res.status(200).json({ tempPassword });
  } catch (e) {
    console.error(e);
    res.status(e.statusCode || 500).json({ error: e.message || 'Could not reset password.' });
  }
};
