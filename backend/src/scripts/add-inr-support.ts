import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateStoresWorkflow, createRegionsWorkflow } from "@medusajs/medusa/core-flows";

export default async function addINRSupport({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const storeModuleService = container.resolve(Modules.STORE);
  const regionModuleService = container.resolve(Modules.REGION);
  
  logger.info("Starting INR support setup (v2)...");
  
  try {
    const [store] = await storeModuleService.listStores();
    if (!store) {
      logger.error("No store found.");
      return;
    }

    logger.info(`Updating store ${store.id} to include INR...`);
    
    // 1. Add INR and specify default currency
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: "eur", is_default: true },
            { currency_code: "usd" },
            { currency_code: "inr" }
          ],
        },
      },
    });
    logger.info("Successfully update store currencies with INR.");

    // 2. Create/Update India Region
    const list = await regionModuleService.listRegions({
      name: "India"
    }, { take: 1 });

    if (list.length > 0) {
      logger.info("Region 'India' already exists.");
    } else {
      logger.info("Creating 'India' region...");
      await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name: "India",
              currency_code: "inr",
              countries: ["in"],
              is_tax_inclusive: true,
              payment_providers: ["pp_system_default", "razorpay"]
            }
          ]
        }
      });
      logger.info("'India' region created successfully.");
    }

    logger.info("INR Support initialization complete.");
  } catch (err: any) {
    logger.error("Error adding INR support: " + err.message);
  }
}
