create type "public"."grid_type" as enum ('SQUARE', 'HEX_HORIZONTAL', 'HEX_VERTICAL');

create table "public"."grids" (
    "id" uuid not null default gen_random_uuid(),
    "type" grid_type not null default 'SQUARE'::"public"."grid_type",
    "width" real not null,
    "height" real not null,
    "offset_x" real not null,
    "offset_y" real not null,
    "color" character varying not null default '#000000'::character varying,
    "snap" boolean not null default true,
    "visible" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "map_id" uuid unique not null,
    "campaign_id" uuid not null
);


alter table "public"."grids" enable row level security;

CREATE UNIQUE INDEX grid_pkey ON public.grids USING btree (id);

alter table "public"."grids" add constraint "grid_pkey" PRIMARY KEY using index "grid_pkey";

alter table "public"."grids" add constraint "public_grid_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."grids" validate constraint "public_grid_campaign_id_fkey";

alter table "public"."grids" add constraint "public_grid_map_id_fkey" FOREIGN KEY (map_id) REFERENCES maps(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."grids" validate constraint "public_grid_map_id_fkey";

alter table "public"."grids" add constraint "public_grid_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."grids" validate constraint "public_grid_user_id_fkey";


create policy "Grids can be viewed by anyone"
on "public"."grids"
as permissive
for select
to public
using (true);

create policy "Grids can be created by the game masters of the campaign"
on "public"."grids"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Grids can be updated by the game masters of the campaign"
on "public"."grids"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaign_id));

