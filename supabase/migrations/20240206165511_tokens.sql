create table "public"."tokens" (
    "id" uuid not null default gen_random_uuid(),
    "width" integer not null,
    "height" integer not null,
    "x" integer not null,
    "y" integer not null,
    "data" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "character_id" uuid not null,
    "map_id" uuid not null,
    "campaign_id" uuid not null
);


alter table "public"."tokens" enable row level security;

CREATE UNIQUE INDEX tokens_pkey ON public.tokens USING btree (id);

alter table "public"."tokens" add constraint "tokens_pkey" PRIMARY KEY using index "tokens_pkey";

alter table "public"."tokens" add constraint "tokens_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tokens" validate constraint "tokens_character_id_fkey";

alter table "public"."tokens" add constraint "tokens_map_id_fkey" FOREIGN KEY (map_id) REFERENCES maps(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tokens" validate constraint "tokens_map_id_fkey";

alter table "public"."tokens" add constraint "tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tokens" validate constraint "tokens_user_id_fkey";

alter table "public"."tokens" add constraint "tokens_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tokens" validate constraint "tokens_campaign_id_fkey";


create policy "Tokens can be viewed by anyone"
on "public"."tokens"
as permissive
for select
to public
using (true);

create policy "Tokens can be created by the game masters of the campaign and the owner of the character"
on "public"."tokens"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id) OR (has_character_permissions(character_id)));

create policy "Tokens can be updated by the game masters of the campaign and the owner of the character"
on "public"."tokens"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaign_id) OR (has_character_permissions(character_id)));

create policy "Tokens can be deleted by the game masters of the campaign and the owner of the character"
on "public"."tokens"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id) OR (has_character_permissions(character_id)));
