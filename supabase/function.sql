-- Create function to increment view_count
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update posts
  set view_count = coalesce(view_count, 0) + 1
  where id = post_id;
end;
$$ language plpgsql security definer;

-- Allow anon (or authenticated) to call this function
grant execute on function increment_view_count(uuid) to anon, authenticated;
