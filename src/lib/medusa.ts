import Medusa from "@medusajs/js-sdk";

export const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_aaf0825eff0e69ee4eb05eb6470e5d6d67f33ac6f3a71370d74e9ec004df1f77",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
});
