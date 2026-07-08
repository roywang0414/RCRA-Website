const { sql } = require('./_db');
const { verifyPassword } = require('./_hash');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }
  try {
    const rows = await sql`
      SELECT id, username, display_name AS display, rank, email, password_hash
      FROM staff
      WHERE lower(email) = lower(${email})
    `;
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Incorrect email or password.' });
      return;
    }
    delete user.password_hash;
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};
