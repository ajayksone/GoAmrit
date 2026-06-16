import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260416070042 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "menu_item" ("id" text not null, "label" text not null, "url" text null, "type" text check ("type" in ('page', 'blog_category', 'custom')) not null default 'custom', "reference_id" text null, "parent_id" text null, "order" integer not null default 0, "menu_key" text not null default 'header', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "menu_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_menu_item_deleted_at" ON "menu_item" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "blog_post" add column if not exists "seo_title" text null, add column if not exists "seo_description" text null, add column if not exists "seo_keywords" text null, add column if not exists "seo_og_image" text null;`);
    this.addSql(`alter table if exists "blog_post" alter column "category_ids" drop default;`);
    this.addSql(`alter table if exists "blog_post" alter column "category_ids" type jsonb using ("category_ids"::jsonb);`);
    this.addSql(`alter table if exists "blog_post" alter column "category_ids" drop not null;`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" drop default;`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" type jsonb using ("tags"::jsonb);`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" drop not null;`);

    this.addSql(`alter table if exists "page" add column if not exists "seo_title" text null, add column if not exists "seo_description" text null, add column if not exists "seo_keywords" text null, add column if not exists "seo_og_image" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "menu_item" cascade;`);

    this.addSql(`alter table if exists "blog_post" drop column if exists "seo_title", drop column if exists "seo_description", drop column if exists "seo_keywords", drop column if exists "seo_og_image";`);

    this.addSql(`alter table if exists "blog_post" alter column "category_ids" type jsonb using ("category_ids"::jsonb);`);
    this.addSql(`alter table if exists "blog_post" alter column "category_ids" set default '[]';`);
    this.addSql(`alter table if exists "blog_post" alter column "category_ids" set not null;`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" type jsonb using ("tags"::jsonb);`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" set default '[]';`);
    this.addSql(`alter table if exists "blog_post" alter column "tags" set not null;`);

    this.addSql(`alter table if exists "page" drop column if exists "seo_title", drop column if exists "seo_description", drop column if exists "seo_keywords", drop column if exists "seo_og_image";`);
  }

}
