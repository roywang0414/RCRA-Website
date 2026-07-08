import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Grab your hidden Neon connection string from Vercel's environment variables
  const sql = neon(process.env.DATABASE_URL);

  try {
    // 2. Run a test query (Replace 'your_table_name' with your actual Neon table name later)
    const response = await sql`SELECT * FROM your_table_name LIMIT 10;`;
    
    // 3. Send the data back to your website frontend
    return res.status(200).json(response);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from database' });
  }
}

