alter table "public"."maps" drop constraint "maps_media_id_fkey";

alter table "public"."media" alter column "id" drop default;

alter table "public"."media" add constraint "media_id_fkey" FOREIGN KEY (id) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."media" validate constraint "media_id_fkey";

alter table "public"."maps" add constraint "maps_media_id_fkey" FOREIGN KEY (media_id) REFERENCES media(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."maps" validate constraint "maps_media_id_fkey";

alter table "public"."media" drop column "thumbnail_url";

alter table "public"."media" drop column "extension";

alter table "public"."media" drop column "format";

alter table "public"."media" drop column "name";

alter table "public"."media" alter column "height" drop not null;

alter table "public"."media" alter column "width" drop not null;

alter table "public"."media" alter column "size" drop not null;
