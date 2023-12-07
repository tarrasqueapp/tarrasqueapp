alter table "public"."profiles" drop constraint "profiles_avatar_id_fkey";

alter table "public"."profiles" add constraint "profiles_avatar_id_fkey" FOREIGN KEY (avatar_id) REFERENCES media(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_avatar_id_fkey";


