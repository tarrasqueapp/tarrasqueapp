create table "public"."campaign_invites" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying not null,
    "campaign_id" uuid not null,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."campaign_invites" enable row level security;

CREATE UNIQUE INDEX campaign_invites_pkey ON public.campaign_invites USING btree (id);

alter table "public"."campaign_invites" add constraint "campaign_invites_pkey" PRIMARY KEY using index "campaign_invites_pkey";

alter table "public"."campaign_invites" add constraint "campaign_invites_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."campaign_invites" validate constraint "campaign_invites_campaign_id_fkey";

alter table "public"."campaign_invites" add constraint "campaign_invites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."campaign_invites" validate constraint "campaign_invites_user_id_fkey";

create policy "Campaign invites can be viewed by game masters of the campaign and the invitee"
on "public"."campaign_invites"
as permissive
for select
to authenticated
using (is_game_master_in_campaign(campaign_id) OR (auth.jwt() ->> 'email' = email));

create policy "Campaign invites can be created by game masters of the campaign"
on "public"."campaign_invites"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Campaign invites can be deleted by game masters of the campaign and the invitee"
on "public"."campaign_invites"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id) OR (auth.jwt() ->> 'email' = email));
