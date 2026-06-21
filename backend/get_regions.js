const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Kunj%23477@localhost:5432/medusa_db'
});

async function run() {
  try {
    await client.connect();
    const res = await client.query("SELECT id, name, currency_code FROM region");
    console.log("Regions in DB:", JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
