import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260410040238 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" add column if not exists "category_ids" jsonb not null default '[]', add column if not exists "tags" jsonb not null default '[]';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "blog_post" drop column if exists "category_ids", drop column if exists "tags";`);
  }

}
