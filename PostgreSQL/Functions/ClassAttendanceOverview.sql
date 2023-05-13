-- FUNCTION: public.classattendanceoverview()

-- DROP FUNCTION IF EXISTS public.classattendanceoverview();

CREATE OR REPLACE FUNCTION public.classattendanceoverview(
	)
    RETURNS TABLE(rno bigint, id integer, accesscode character varying, createdat timestamp with time zone, accepting boolean, present bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  RETURN QUERY SELECT row_number() OVER (ORDER BY ac."CreatedAt" DESC) as rno,
                        ac."ID",
                        ac."AccessCode",
                        ac."CreatedAt",
						ac."Accepting",
                        COALESCE(sub.Present, 0) as Present
                 FROM "AccessCodes" as ac
                 LEFT JOIN (SELECT "AccessCode", count("AccessCode") as Present FROM "Attendance" GROUP BY "AccessCode") as sub
                 ON ac."ID"=sub."AccessCode"
                 ORDER BY ac."CreatedAt" DESC;
END;
$BODY$;

ALTER FUNCTION public.classattendanceoverview()
    OWNER TO "AttendifyDBAdmin";
