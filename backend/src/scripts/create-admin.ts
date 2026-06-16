import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createUsersWorkflow } from "@medusajs/medusa/core-flows";

export default async function createAdmin({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Ensuring admin user exists...");
  
  try {
    const { result } = await createUsersWorkflow(container).run({
      input: {
        users: [
          {
            email: "admin@goamrit.com",
            first_name: "Admin",
            last_name: "GoAmrit",
          }
        ]
      }
    });
    logger.info("Admin user 'admin@goamrit.com' was set up successfully.");
    logger.info("Note: For Medusa 2.x, passwords may be set via the onboarding or a separate auth provider.");
  } catch (err: any) {
    logger.error("Error creating admin: " + err.message);
  }
}
