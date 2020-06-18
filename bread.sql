BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "bread" (
	"id"	INTEGER,
	"String"	TEXT,
	"Integer"	INTEGER,
	"Float"	FLOAT,
	"Date"	Date,
	"Boolean"	Boolean,
	PRIMARY KEY("id")
);
INSERT INTO "bread" ("id","String","Integer","Float","Date","Boolean") VALUES (1,'Mario',12,1.5,'2020-02-01','false'),
 (2,'aka',90,2.5,'2020-02-02','true'),
 (3,'super sekali',0,1.45,'kosong','false');
COMMIT;
