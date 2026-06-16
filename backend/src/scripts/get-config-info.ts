import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStockLocationsWorkflow } from "@medusajs/medusa/core-flows";

export default async function getRegionAndWarehouse({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const regionModuleService = container.resolve(Modules.REGION);
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("--- DIAGNOSTIC DATA ---");

  // 1. Get Store Info
  const [store] = await storeModuleService.listStores();
  logger.info(`Store ID: ${store?.id}`);

  // 2. Find India Region
  const regions = await regionModuleService.listRegions({
    name: "India"
  }, { take: 1 });

  if (regions.length > 0) {
    logger.info(`India Region ID: ${regions[0].id}`);
    logger.info(`India Region Currency: ${regions[0].currency_code}`);
  } else {
    logger.error("India region not found. Please run add-inr-support.ts first.");
  }

  // 3. Create Indian Warehouse
  const existingStockLocations = await stockLocationModuleService.listStockLocations({
    name: "Indian Warehouse"
  });

  if (existingStockLocations.length > 0) {
    logger.info(`Indian Warehouse already exists. ID: ${existingStockLocations[0].id}`);
  } else {
    logger.info("Creating 'Indian Warehouse'...");
    try {
      const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            {
              name: "Indian Warehouse",
              address: {
                city: "Delhi",
                country_code: "IN",
                address_1: "GoAmrit Hub"
              }
            }
          ]
        }
      });
      logger.info(`Successfully created Indian Warehouse. ID: ${stockLocationResult[0].id}`);
    } catch (err: any) {
      logger.error(`Failed to create Indian Warehouse: ${err.message}`);
    }
  }

  logger.info("--- END DIAGNOSTIC DATA ---");
}
