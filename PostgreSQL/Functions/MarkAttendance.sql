-- FUNCTION: public.MarkAttendance(character varying, character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public."MarkAttendance"(character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public."MarkAttendance"(
	in_accesscode character varying,
	in_markedby character varying,
	in_ipaddress character varying,
	in_deviceidentifier character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE ACCESS_CODE_ID INTEGER;
DECLARE DUPLICATE_FLAG INTEGER;
DECLARE CODE INTEGER;
BEGIN
	SELECT "ID" INTO ACCESS_CODE_ID FROM "AccessCodes" WHERE "AccessCode"=IN_AccessCode AND "Accepting"=true;

	IF ACCESS_CODE_ID IS NULL THEN
		CODE := -1;
	ELSE
		INSERT INTO "Attendance"("AccessCode", "MarkedBy", "IPAddress", "DeviceIdentifier")
		SELECT ACCESS_CODE_ID, IN_MarkedBy, IN_IPAddress, IN_DeviceIdentifier
		WHERE NOT EXISTS (
  		SELECT 1 FROM "Attendance"
 		 	WHERE "AccessCode" = ACCESS_CODE_ID  AND "MarkedBy" = IN_MarkedBy
		);
		GET DIAGNOSTICS CODE = ROW_COUNT;
		 
	END IF;

	RETURN CODE;
END;
$BODY$;

ALTER FUNCTION public."MarkAttendance"(character varying, character varying, character varying, character varying)
    OWNER TO "AttendifyDBAdmin";
