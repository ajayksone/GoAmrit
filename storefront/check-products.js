const { Medusa } = require("@medusajs/js-sdk");

const sdk = new Medusa({
  baseUrl: "http://localhost:9000",
  publishableKey: "pk_aaf0825eff0e69ee4eb05eb6470e5d6d67f33ac6f3a71370d74e9ec004df1f77",
  debug: true
});

async function check() {
  try {
    const { products } = await sdk.store.product.list();
    console.log("Products found in Medusa STORE:");
    products.forEach(p => console.log(`- Title: ${p.title}, Handle: ${p.handle}, ID: ${p.id}`));
  } catch (e) {
    console.error("SDK Error:", e);
  }
}

check();
