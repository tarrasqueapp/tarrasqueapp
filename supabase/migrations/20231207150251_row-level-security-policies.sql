-- Check if the user is a game master in a specific campaign
CREATE FUNCTION is_game_master_in_campaign(campaign_id uuid) RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM campaign_memberships
        WHERE campaign_memberships.campaign_id = is_game_master_in_campaign.campaign_id
          AND campaign_memberships.user_id = auth.uid()
          AND campaign_memberships.role = 'GAME_MASTER'::campaign_member_role
    );
END;
$$ LANGUAGE plpgsql;


alter table "public"."profiles" enable row level security;

create policy "Profiles can be viewed by anyone"
on "public"."profiles"
as permissive
for select
to public
using (true);

create policy "Profiles can be updated by their owners"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


alter table "public"."setup" enable row level security;

create policy "Setup can be viewed by anyone"
on "public"."setup"
as permissive
for select
to public
using (true);

create policy "Setup can be created if it does not exist"
on "public"."setup"
as permissive
for insert
to public
with check ((( SELECT count(*) AS count
  FROM setup setup_1) = 0));

create policy "Setup can be updated if setup is not completed"
on "public"."setup"
as permissive
for update
to public
using ((( SELECT setup_1.step
  FROM setup setup_1
  WHERE (setup_1.id = 1)) <> 'COMPLETED'::setup_step))
with check ((( SELECT setup_1.step
  FROM setup setup_1
  WHERE (setup_1.id = 1)) <> 'COMPLETED'::setup_step));


alter table "public"."media" enable row level security;

create policy "Media can be viewed by anyone"
on "public"."media"
as permissive
for select
to public
using (true);

create policy "Media can be created by authenticated users"
on "public"."media"
as permissive
for insert
to authenticated
with check (true);

create policy "Media can be updated if the size is not set"
on "public"."media"
as permissive
for update
to authenticated
using ((( SELECT media_1.size
  FROM media media_1
  WHERE (media_1.id = id)) IS NULL));


alter table "public"."campaigns" enable row level security;

create policy "Campaigns can be viewed by anyone"
on "public"."campaigns"
as permissive
for select
to public
using (true);

create policy "Campaigns can be created by authenticated users"
on "public"."campaigns"
as permissive
for insert
to authenticated
with check (true);

create policy "Campaigns can be updated by their game masters"
on "public"."campaigns"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaigns.id));

create policy "Campaigns can be deleted by their game masters"
on "public"."campaigns"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaigns.id));


alter table "public"."campaign_memberships" enable row level security;

create policy "Campaign memberships can be viewed by anyone"
on "public"."campaign_memberships"
as permissive
for select
to public
using (true);

create policy "Campaign memberships can be created by game masters of the campaign"
on "public"."campaign_memberships"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Campaign memberships can be updated by game masters of the campaign"
on "public"."campaign_memberships"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaign_id));

create policy "Campaign memberships can be deleted by game masters of the campaign"
on "public"."campaign_memberships"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id));


alter table "public"."maps" enable row level security;

create policy "Maps can be viewed by anyone"
on "public"."maps"
as permissive
for select
to public
using (true);

create policy "Maps can be created by game masters of the campaign"
on "public"."maps"
as permissive
for insert
to authenticated
with check (is_game_master_in_campaign(campaign_id));

create policy "Maps can be updated by game masters of the campaign"
on "public"."maps"
as permissive
for update
to authenticated
using (is_game_master_in_campaign(campaign_id));

create policy "Maps can be deleted by game masters of the campaign"
on "public"."maps"
as permissive
for delete
to authenticated
using (is_game_master_in_campaign(campaign_id));


alter table "public"."plugins" enable row level security;

create policy "Plugins can be viewed by anyone"
on "public"."plugins"
as permissive
for select
to public
using (true);

create policy "Plugins can be installed by authenticated users"
on "public"."plugins"
as permissive
for insert
to authenticated
with check (true);

create policy "Plugins can be deleted by the user who installed them"
on "public"."plugins"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));
