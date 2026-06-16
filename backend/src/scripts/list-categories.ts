import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function listAllCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModuleService = container.resolve(Modules.PRODUCT);
  
  logger.info("Listing all Product Categories in Backend (with fields)...");
  
  try {
    // In Medusa 2.x, list methods often require explicit selection of fields if not all are returned by default
    const categories = await productModuleService.listProductCategories({}, { 
      select: ["id", "name", "handle"],
      skip: 0, 
      take: 100 
    });
    
    logger.info(`Found ${categories.length} total categories.`);
    categories.forEach((c: any) => {
      logger.info(` - ${c.name} (${c.handle}) [ID: ${c.id}]`);
    });
  } catch (err: any) {
    logger.error("Error listing categories: " + err.message);
  }
}
