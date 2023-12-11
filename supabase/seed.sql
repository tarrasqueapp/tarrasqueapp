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
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) (
    select
      uuid_generate_v4 (),
      id,
      format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
      'email',
      uuid_generate_v4 (),
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
