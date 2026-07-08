const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const RANK_TIERS = {
  "Community Executive": "owner",
  "Community Director": "shr",
  "Associate Director": "shr",
  "Assistant Director": "shr",
  "Senior Management": "hr",
  "Server Management": "hr",
  "Senior Administrative": "mr",
  "Server Administrative": "mr",
  "Senior Moderator": "mr",
  "Community Moderator": "mr"
};

function tierOf(rank) {
  return RANK_TIERS[rank] || "mr";
}

function isAdminTier(tier) {
  return tier === "owner" || tier === "shr";
}

// Looks up a staff member by id and confirms they are Owner/SHR.
// Throws if not found or not authorized.
async function requireAdmin(requesterId) {
  const rows = await sql`SELECT id, rank FROM staff WHERE id = ${requesterId}`;
  const requester = rows[0];
  if (!requester || !isAdminTier(tierOf(requester.rank))) {
    const err = new Error('Not authorized.');
    err.statusCode = 403;
    throw err;
  }
  return requester;
}

function genTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

module.exports = { sql, tierOf, isAdminTier, requireAdmin, genTempPassword };
