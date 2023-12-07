set check_function_bodies = off;

-- inserts a row into public.profiles
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
  insert into public.profiles (id, name, display_name)
  values (new.id, new.raw_user_meta_data ->> 'name', display_name);
  return new;
end;
$function$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
