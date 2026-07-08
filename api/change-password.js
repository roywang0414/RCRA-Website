const { sql } = require('./_db');
const { hashPassword, verifyPassword } = require('./_hash');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { staffId, oldPassword, newPassword } = req.body || {};
  if (!staffId || !oldPassword || !newPassword) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  try {
    const rows = await sql`SELECT id, password_hash FROM staff WHERE id = ${staffId}`;
    const user = rows[0];
    if (!user || !verifyPassword(oldPassword, user.password_hash)) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }
    const newHash = hashPassword(newPassword);
    await sql`UPDATE staff SET password_hash = ${newHash} WHERE id = ${staffId}`;
    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not change password.' });
  }
};
