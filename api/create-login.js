const { sql, requireAdmin, genTempPassword } = require('./_db');
const { hashPassword } = require('./_hash');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { requesterId, username, displayName, rank } = req.body || {};
  if (!requesterId || !username || !displayName || !rank) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  try {
    await requireAdmin(requesterId);

    const email = `${username.toLowerCase()}@staff.alliance`;
    const tempPassword = genTempPassword();
    const passwordHash = hashPassword(tempPassword);

    const rows = await sql`
      INSERT INTO staff (username, display_name, rank, email, password_hash)
      VALUES (${username}, ${displayName}, ${rank}, ${email}, ${passwordHash})
      RETURNING id, username, display_name AS display, rank, email
    `;

    res.status(200).json({ ...rows[0], tempPassword });
  } catch (e) {
    if (e.code === '23505') { // unique_violation
      res.status(409).json({ error: 'That username is already in use.' });
      return;
    }
    console.error(e);
    res.status(e.statusCode || 500).json({ error: e.message || 'Could not create login.' });
  }
};
