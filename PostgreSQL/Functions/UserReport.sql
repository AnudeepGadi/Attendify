-- FUNCTION: public.userreport(text)

-- DROP FUNCTION IF EXISTS public.userreport(text);

CREATE OR REPLACE FUNCTION public.userreport(
	in_marked_by text)
    RETURNS TABLE(rno bigint, id integer, accesscode integer, attendance_taken_on timestamp with time zone, marked_at timestamp with time zone, ip_address character varying, device_identifier character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT row_number() OVER () as rno, * from(SELECT at."ID", ac."ID" ,ac."CreatedAt" AS attendance_taken_on, at."MarkedAt" AS marked_at, at."IPAddress",at."DeviceIdentifier"
    FROM "AccessCodes" AS ac
    LEFT OUTER JOIN "Attendance" AS at
    ON ac."ID" = at."AccessCode" AND at."MarkedBy" = IN_MARKED_BY
    ORDER BY attendance_taken_on DESC)as sub ;   
END;
$BODY$;

ALTER FUNCTION public.userreport(text)
    OWNER TO "AttendifyDBAdmin";
