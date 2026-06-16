import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260416092935 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cms_settings" drop constraint if exists "cms_settings_key_unique";`);
    this.addSql(`create table if not exists "cms_settings" ("id" text not null, "key" text not null, "seo_title" text null, "seo_description" text null, "seo_keywords" text null, "seo_og_image" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cms_settings_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cms_settings_key_unique" ON "cms_settings" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_cms_settings_deleted_at" ON "cms_settings" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "blog_category" add column if not exists "seo_title" text null, add column if not exists "seo_description" text null, add column if not exists "seo_keywords" text null, add column if not exists "seo_og_image" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cms_settings" cascade;`);

    this.addSql(`alter table if exists "blog_category" drop column if exists "seo_title", drop column if exists "seo_description", drop column if exists "seo_keywords", drop column if exists "seo_og_image";`);
  }

}
