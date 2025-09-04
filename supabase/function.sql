create function handle_new_user()
returns trigger as $$
begin
  insert into users (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();


