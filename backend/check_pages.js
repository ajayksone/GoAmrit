const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Kunj%23477@localhost:5432/medusa_db'
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT title, handle FROM page");
  console.log(JSON.stringify(res.rows));
  await client.end();
}

run();
