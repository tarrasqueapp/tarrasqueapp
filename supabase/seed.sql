-- create setup
INSERT INTO
  public.setup (id, step)
VALUES
  (1, 'COMPLETED');

-- create user
INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4 (),
    'authenticated',
    'authenticated',
    'rsolomou@gmail.com',
    crypt ('4CQ1FLn&v6bhCSRT', gen_salt ('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    '{"name":"Richard Solomou"}',
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  );

-- create user email identity
INSERT INTO
  auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    select
      uuid_generate_v4 (),
      id,
      format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    from
      auth.users
  );

-- create bucket
INSERT INTO
  storage.buckets (id, name, created_at, updated_at, public, allowed_mime_types)
VALUES
  (
    'tarrasqueapp',
    'tarrasqueapp',
    current_timestamp,
    current_timestamp,
    true,
    '{"image/*", "video/*"}'::text[]
  );

-- create first campaign
INSERT INTO
  public.campaigns (
    id,
    name,
    created_at,
    user_id
  )
VALUES
  (
    uuid_generate_v4 (),
    'First Campaign',
    current_timestamp,
    (select id from auth.users limit 1)
  );

-- create first membership
INSERT INTO
  public.memberships (
    id,
    role,
    color,
    user_id,
    campaign_id,
    created_at
  )
VALUES
  (
    uuid_generate_v4 (),
    'GAME_MASTER'::campaign_member_role,
    '#000000',
    (select id from auth.users limit 1),
    (select id from public.campaigns limit 1),
    current_timestamp
  );

-- create second campaign
INSERT INTO
  public.campaigns (
    id,
    name,
    created_at,
    user_id
  )
VALUES
  (
    uuid_generate_v4 (),
    'Second Campaign',
    current_timestamp,
    (select id from auth.users limit 1)
  );

-- create second membership
INSERT INTO
  public.memberships (
    id,
    role,
    color,
    user_id,
    campaign_id,
    created_at
  )
VALUES
  (
    uuid_generate_v4 (),
    'PLAYER'::campaign_member_role,
    '#FF0000',
    (select id from auth.users limit 1),
    (select id from public.campaigns limit 1 offset 1),
    current_timestamp
  );
