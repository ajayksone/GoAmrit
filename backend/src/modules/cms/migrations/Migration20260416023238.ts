import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260416023238 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" add column if not exists "related_product_category_id" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" drop column if exists "related_product_category_id";`);
  }

}
