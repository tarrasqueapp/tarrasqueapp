CREATE OR REPLACE FUNCTION execute_schema_tables(_schema text, _query text)
RETURNS text AS
$$
DECLARE
row record;
BEGIN
FOR row IN SELECT tablename FROM pg_tables AS t
WHERE t.schemaname = _schema
LOOP
-- run query
EXECUTE format(_query, row.tablename);
END LOOP;
RETURN 'success';
END;
$$ LANGUAGE 'plpgsql';

SELECT execute_schema_tables('public', 'ALTER PUBLICATION supabase_realtime ADD TABLE %I;');
