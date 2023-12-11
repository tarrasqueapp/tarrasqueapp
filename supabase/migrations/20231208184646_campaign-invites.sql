create table "public"."invites" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying not null,
    "campaign_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."invites" enable row level security;

CREATE UNIQUE INDEX invites_pkey ON public.invites USING btree (id);

alter table "public"."invites" add constraint "invites_pkey" PRIMARY KEY using index "invites_pkey";

alter table "public"."invites" add constraint "invites_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."invites" validate constraint "invites_campaign_id_fkey";

create policy "Invites can be viewed by anyone"
on "public"."invites"
as permissive
for select
to public
using (true);

create policy "Invites can be created by game masters of the campaign"
on "public"."invites"
as permissive
for insert
to authenticated
with check (auth.uid() IN (
    SELECT memberships.user_id
    FROM memberships
    WHERE (memberships.campaign_id = campaign_id) AND (memberships.role = 'GAME_MASTER'::campaign_member_role)));

create policy "Invites can be deleted by game masters of the campaign and the invitee"
on "public"."invites"
as permissive
for delete
to authenticated
using (auth.uid() IN (
    SELECT memberships.user_id
    FROM memberships
    WHERE (memberships.campaign_id = campaign_id) AND (memberships.role = 'GAME_MASTER'::campaign_member_role)) OR (auth.jwt() ->> 'email' = email));
