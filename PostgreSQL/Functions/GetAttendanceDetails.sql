-- FUNCTION: public.get_attendance_details(integer)

-- DROP FUNCTION IF EXISTS public.get_attendance_details(integer);

CREATE OR REPLACE FUNCTION public.get_attendance_details(
	access_code integer)
    RETURNS TABLE("Name" character varying, "ID" integer, "MarkedBy" character varying, "IPAddress" character varying, "MarkedAt" timestamp with time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
	RETURN QUERY 
		SELECT us."Name", sub2."ID", sub2."MarkedBy", sub2."IPAddress", sub2."MarkedAt"
		FROM "Users" AS us
		INNER JOIN 
		(
			SELECT att."ID",att."MarkedBy", att."IPAddress", att."MarkedAt" 
			FROM "Attendance" AS att
			INNER JOIN 
			(
				SELECT att1."AccessCode", att1."IPAddress" ,COUNT(att1."IPAddress")
				FROM "Attendance"  as att1
				WHERE "AccessCode"= access_code
				GROUP BY att1."IPAddress",att1."AccessCode"
				HAVING COUNT(att1."IPAddress") > 1
			) AS sub ON att."AccessCode" = sub."AccessCode" AND att."IPAddress" = sub."IPAddress"
		) AS sub2 ON us."Username" = sub2."MarkedBy"
		ORDER BY sub2."IPAddress", sub2."MarkedAt";
END;
$BODY$;

ALTER FUNCTION public.get_attendance_details(integer)
    OWNER TO "AttendifyDBAdmin";
