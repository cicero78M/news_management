const fs = require('fs');
const db = require('../src/db');

async function run() {
  const initSql = fs.readFileSync('sql/init.sql', 'utf-8');
  const seedSql = fs.readFileSync('sql/seed.sql', 'utf-8');
  await db.query(initSql);
  await db.query(seedSql);
  console.log('Database initialized');
  process.exit();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
