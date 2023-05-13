-- FUNCTION: public.get_attendance(integer)

-- DROP FUNCTION IF EXISTS public.get_attendance(integer);

CREATE OR REPLACE FUNCTION public.get_attendance(
	access_code integer)
    RETURNS TABLE(id integer, username character varying, name character varying, marked_at timestamp with time zone, email character varying, ip_address character varying, device_identifier character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY SELECT att."ID",us."Username", us."Name", att."MarkedAt", us."Email", att."IPAddress", att."DeviceIdentifier"
        FROM "Users" us
        LEFT OUTER JOIN "Attendance" att ON us."Username" = att."MarkedBy" AND att."AccessCode" = access_code
        ORDER BY att."MarkedAt";
END;
$BODY$;

ALTER FUNCTION public.get_attendance(integer)
    OWNER TO "AttendifyDBAdmin";
