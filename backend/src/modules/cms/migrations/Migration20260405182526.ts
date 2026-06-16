import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260405182526 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "testimonial" add column if not exists "productTitle" text null, add column if not exists "productThumb" text null, add column if not exists "price" integer null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "testimonial" drop column if exists "productTitle", drop column if exists "productThumb", drop column if exists "price";`);
  }

}
