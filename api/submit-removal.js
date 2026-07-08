const { sql } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { username, reason, submittedBy } = req.body || {};
  if (!username || !reason || !submittedBy) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }
  try {
    const rows = await sql`
      INSERT INTO removals (username, reason, status, submitted_by)
      VALUES (${username}, ${reason}, 'pending', ${submittedBy})
      RETURNING id, username, reason, status, submitted_by AS "submittedBy"
    `;
    res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not submit removal.' });
  }
};
