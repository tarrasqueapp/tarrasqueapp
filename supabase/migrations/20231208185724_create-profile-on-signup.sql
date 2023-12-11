set check_function_bodies = off;

-- insert a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $function$declare
  display_name text;
begin
  -- Split the name to get the first segment
  display_name = split_part(NEW.raw_user_meta_data ->> 'name', ' ', 1);

  -- Insert the new user's data into the public.profiles table
  insert into public.profiles (id, name, display_name, email)
  values (new.id, new.raw_user_meta_data ->> 'name', display_name, new.email);
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
