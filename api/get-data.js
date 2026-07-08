const { sql } = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const staffRows = await sql`
      SELECT id, username, display_name AS display, rank, email
      FROM staff
      ORDER BY id ASC
    `;
    const removalRows = await sql`
      SELECT id, username, reason, status, submitted_by AS "submittedBy"
      FROM removals
      ORDER BY created_at DESC
    `;
    res.status(200).json({ staff: staffRows, removals: removalRows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not load data.' });
  }
};
