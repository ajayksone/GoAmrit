import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

export default async function createVedicCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  
  const vedicCategories = [
    { name: "Atta", handle: "atta" },
    { name: "Desi Ghee", handle: "desi-ghee" },
    { name: "Oils", handle: "edible-oil" },
    { name: "Pickles", handle: "pickle" },
    { name: "Spices", handle: "spices" },
    { name: "Honey", handle: "honey" },
    { name: "Pulses", handle: "pulses" }
  ];

  logger.info("Initializing creation of Vedic categories...");
  
  for (const vc of vedicCategories) {
    try {
      const existing = await productModuleService.listProductCategories({
         handle: vc.handle
      }, { take: 1 });

      if (existing.length > 0) {
        logger.info(`Category '${vc.name}' (${vc.handle}) already exists. Skipping.`);
        continue;
      }

      logger.info(`Creating category: ${vc.name} (${vc.handle})...`);
      
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [{
            name: vc.name,
            handle: vc.handle,
            is_active: true
          }]
        }
      });
      logger.info(`Successfully created: ${vc.name}`);
    } catch (err: any) {
      logger.error(`Failed to create category '${vc.name}': ${err.message}`);
    }
  }

  logger.info("Category initialization process complete.");
}
