const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Kunj%23477@localhost:5432/medusa_db' });

client.connect().then(() => {
  client.query("SELECT token FROM api_key WHERE type = 'publishable'").then(res => {
    console.log("PUBLISHABLE_KEY=", res.rows[0]?.token);
    client.end();
  }).catch(console.error);
}).catch(console.error);
