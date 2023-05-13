-- FUNCTION: public.getallstudentsreport()

-- DROP FUNCTION IF EXISTS public.getallstudentsreport();

CREATE OR REPLACE FUNCTION public.getallstudentsreport(
	)
    RETURNS TABLE(rno bigint, "Username" character varying, "Name" character varying, "Email" character varying, "Present" bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY SELECT row_number() over(ORDER BY COALESCE(sub."Present", 0) desc) as rno, us."Username", us."Name", us."Email", COALESCE(sub."Present", 0) as "Present"
                  FROM "Users" as us
                  LEFT JOIN (SELECT "MarkedBy", COUNT("MarkedBy") as "Present" FROM "Attendance" GROUP BY ("MarkedBy")) as sub
                  ON us."Username" = sub."MarkedBy"
                  ORDER BY "Present" DESC;
END;
$BODY$;

ALTER FUNCTION public.getallstudentsreport()
    OWNER TO "AttendifyDBAdmin";
