-- Check if the user has character permissions to a specific character
CREATE FUNCTION has_character_permissions(character_id uuid) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM character_permissions
        WHERE character_permissions.character_id = has_character_permissions.character_id
          AND character_permissions.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql;

create table "public"."characters" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying not null,
    "data" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "media_id" uuid,
    "campaign_id" uuid not null
);


alter table "public"."characters" enable row level security;

CREATE UNIQUE INDEX characters_pkey ON public.characters USING btree (id);

alter table "public"."characters" add constraint "characters_pkey" PRIMARY KEY using index "characters_pkey";

alter table "public"."characters" add constraint "characters_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."characters" validate constraint "characters_campaign_id_fkey";

alter table "public"."characters" add constraint "characters_media_id_fkey" FOREIGN KEY (media_id) REFERENCES media(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."characters" validate constraint "characters_media_id_fkey";

alter table "public"."characters" add constraint "characters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."characters" validate constraint "characters_user_id_fkey";


create table "public"."character_permissions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "character_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."character_permissions" enable row level security;

CREATE UNIQUE INDEX character_permissions_pkey ON public.character_permissions USING btree (id);

alter table "public"."character_permissions" add constraint "character_permissions_pkey" PRIMARY KEY using index "character_permissions_pkey";

alter table "public"."character_permissions" add constraint "character_permissions_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_permissions" validate constraint "character_permissions_character_id_fkey";

alter table "public"."character_permissions" add constraint "character_permissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_permissions" validate constraint "character_permissions_user_id_fkey";


create policy "Characters can be viewed by anyone"
on "public"."characters"
as permissive
for select
to public
using (true);

create policy "Character permissions can be viewed by anyone"
on "public"."character_permissions"
as permissive
for select
to public
using (true);

create policy "Characters can be created by game masters of the campaign"
on "public"."characters"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Character permissions can be created by game masters of the campaign"
on "public"."character_permissions"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign((SELECT campaign_id FROM characters WHERE id = character_id)));

create policy "Characters can be updated by game masters of the campaign and the users with permissions"
on "public"."characters"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaign_id) OR has_character_permissions(id));

create policy "Character permissions can be updated by game masters of the campaign"
on "public"."character_permissions"
as permissive
for update
to authenticated
using (is_game_master_in_campaign((SELECT campaign_id FROM characters WHERE id = character_id)));

create policy "Characters can be deleted by game masters of the campaign"
on "public"."characters"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id));

create policy "Character permissions can be deleted by game masters of the campaign"
on "public"."character_permissions"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign((SELECT campaign_id FROM characters WHERE id = character_id)));
