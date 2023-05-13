-- Table: public.AccessCodes

-- DROP TABLE IF EXISTS public."AccessCodes";

CREATE TABLE IF NOT EXISTS public."AccessCodes"
(
    "ID" integer NOT NULL DEFAULT nextval('"AccessCodes_ID_seq"'::regclass),
    "AccessCode" character varying COLLATE pg_catalog."default" NOT NULL,
    "CreatedBy" character varying COLLATE pg_catalog."default" NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "Accepting" boolean NOT NULL DEFAULT true,
    "ModifiedAt" timestamp with time zone DEFAULT now(),
    CONSTRAINT "AccessCodes_pkey" PRIMARY KEY ("ID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."AccessCodes"
    OWNER to "AttendifyDBAdmin";