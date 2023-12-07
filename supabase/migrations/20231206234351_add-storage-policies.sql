create policy "Give all users view access to all assets"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'tarrasqueapp'::text));


create policy "Give users DELETE access to their own folder"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'tarrasqueapp'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users INSERT access to their own folder"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'tarrasqueapp'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users UPDATE access to their own folder"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'tarrasqueapp'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



