-- FUNCTION: public.getallstudentsreport(character varying)

-- DROP FUNCTION IF EXISTS public.getallstudentsreport(character varying);

CREATE OR REPLACE FUNCTION public.getallstudentsreport(
	username character varying)
    RETURNS TABLE("Username" character varying, "Name" character varying, "Email" character varying, "Present" bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY SELECT us."Username", us."Name", us."Email", COALESCE(sub."Present", 0) as "Present"
                  FROM "Users" as us
                  LEFT JOIN (SELECT "MarkedBy", COUNT("MarkedBy") as "Present" FROM "Attendance" GROUP BY ("MarkedBy")) as sub
                  ON us."Username" = sub."MarkedBy"
                  WHERE us."Username" = username
                  ORDER BY "Present" DESC;
END;
$BODY$;

ALTER FUNCTION public.getallstudentsreport(character varying)
    OWNER TO "AttendifyDBAdmin";
