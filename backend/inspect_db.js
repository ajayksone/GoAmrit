const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Kunj%23477@localhost:5432/medusa_db'
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log(JSON.stringify(res.rows.map(r => r.table_name)));
  await client.end();
}

run();
