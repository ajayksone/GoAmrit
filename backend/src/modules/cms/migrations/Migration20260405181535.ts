import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260405181535 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "testimonial" ("id" text not null, "user_name" text not null, "content" text null, "type" text check ("type" in ('text', 'video')) not null default 'text', "video_url" text null, "thumbnail_url" text null, "product_handle" text null, "rating" integer not null default 5, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "testimonial_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_testimonial_deleted_at" ON "testimonial" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "testimonial" cascade;`);
  }

}
