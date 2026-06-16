const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:Kunj%23477@localhost:5432/medusa_db'
});

async function run() {
  await client.connect();
  const content = {
    text: "Welcome to GoAmrit",
    badgeText: "100% PURE & VEDIC",
    brandVideo: "/my-video.mp4",
    heroSlides: [
      {
        img: "/hero_website_banner_4.jpg",
        headline: "Vedic Bilona Purity",
        subheading: "Traditional Churned • 100% Raw • Farm Fresh",
        showCTA: true
      },
      {
        img: "/hero_website_banner_1.jpg",
        headline: "Bilona Ghee Offer",
        subheading: "Buy 1kg Bilona Ghee • Get 1 Pickle FREE",
        showCTA: true
      },
      {
        img: "/hero_website_banner_2.jpg",
        headline: "Grand Summer Sale",
        subheading: "Buy 1 Get 1 FREE on Handcrafted Pickles",
        showCTA: true
      },
      {
        img: "/hero_website_banner_3.jpg",
        headline: "A Tale of Traditions",
        subheading: "Families who pass down flavour, not just stories",
        showCTA: true
      }
    ]
  };
  
  // Try to find if 'home' already exists
  const check = await client.query("SELECT id FROM page WHERE handle = 'home'");
  if (check.rows.length === 0) {
    await client.query(`
      INSERT INTO page (id, title, handle, content, is_active, created_at, updated_at)
      VALUES ('page_home_01', 'Home', 'home', $1, true, NOW(), NOW())
    `, [JSON.stringify(content)]);
    console.log("Home page created.");
  } else {
    await client.query(`
      UPDATE page SET content = $1, updated_at = NOW() WHERE handle = 'home'
    `, [JSON.stringify(content)]);
    console.log("Home page updated.");
  }
  
  await client.end();
}

run();
