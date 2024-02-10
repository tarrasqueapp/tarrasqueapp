create table "public"."campaign_plugins" (
    "id" uuid not null default gen_random_uuid(),
    "campaign_id" uuid not null,
    "plugin_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."campaign_plugins" enable row level security;

CREATE UNIQUE INDEX campaign_plugins_pkey ON public.campaign_plugins USING btree (id);

alter table "public"."campaign_plugins" add constraint "campaign_plugins_pkey" PRIMARY KEY using index "campaign_plugins_pkey";

alter table "public"."campaign_plugins" add constraint "campaign_plugins_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."campaign_plugins" validate constraint "campaign_plugins_campaign_id_fkey";

alter table "public"."campaign_plugins" add constraint "campaign_plugins_plugin_id_fkey" FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."campaign_plugins" validate constraint "campaign_plugins_plugin_id_fkey";


create policy "Campaign plugins can be viewed by anyone"
on "public"."campaign_plugins"
as permissive
for select
to public
using (true);

create policy "Campaign plugins can be enabled by the game masters of the campaign"
on "public"."campaign_plugins"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Campaign plugins can be disabled by the game masters of the campaign"
on "public"."campaign_plugins"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id));
