require('dotenv').config({path:'../.env'});
const db = require('./db');

const seedAdmin = async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node seed-admin.js <email> <full_name>");
    console.error("Example: node seed-admin.js admin@example.com 'Super Admin'");
    process.exit(1);
  }

  const email = args[0];
  const fullName = args[1];

  try {
    const queryText = `
      INSERT INTO users (email, full_name, role)
      VALUES ($1, $2, 'ADMIN')
      ON CONFLICT (email) DO UPDATE 
      SET role = 'ADMIN', full_name = EXCLUDED.full_name
      RETURNING *;
    `;
    
    const result = await db.query(queryText, [email, fullName]);
    
    console.log("Successfully seeded admin user:");
    console.log(result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
