-- Table: public.Attendance

-- DROP TABLE IF EXISTS public."Attendance";

CREATE TABLE IF NOT EXISTS public."Attendance"
(
    "ID" integer NOT NULL DEFAULT nextval('"Attendance_ID_seq"'::regclass),
    "AccessCode" integer NOT NULL,
    "MarkedBy" character varying COLLATE pg_catalog."default" NOT NULL,
    "MarkedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "IPAddress" character varying COLLATE pg_catalog."default" NOT NULL,
    "DeviceIdentifier" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT access_code_fk FOREIGN KEY ("AccessCode")
        REFERENCES public."AccessCodes" ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Attendance"
    OWNER to "AttendifyDBAdmin";