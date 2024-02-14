set check_function_bodies = off;

-- insert a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $function$declare
begin
  -- Insert the new user's data into the public.profiles table
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email);

  -- Create a new campaign for the user
  insert into public.campaigns (id, name, user_id, created_at)
  values (extensions.uuid_generate_v4 (), new.raw_user_meta_data ->> 'name' || '''s Campaign', new.id, current_timestamp);

  -- Create a campaign membership for the user
  insert into public.campaign_memberships (id, role, color, user_id, campaign_id, created_at)
  values (extensions.uuid_generate_v4 (), 'GAME_MASTER'::campaign_member_role, '#000000', new.id, (select id from public.campaigns where user_id = new.id limit 1), current_timestamp);

  return new;
end;
$function$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- update the public.profiles table when a user's email is updated
create function public.handle_user_email_update()
returns trigger
language plpgsql
security definer set search_path = public
as $function$begin
  update public.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$function$;

-- trigger the function every time a user is updated
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute function handle_user_email_update();
