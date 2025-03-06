BEGIN;

CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);

CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "datum_rodjenja" VARCHAR(50),
  "spol" VARCHAR(50),
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100),
  "tip_korisnika_id" INTEGER NOT NULL,
  "tajniTOTP" VARCHAR(200),
  "aktivacijski_kod" INTEGER,
  "aktivan" INTEGER,
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);

CREATE INDEX "korisnik_fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_id");

INSERT INTO tip_korisnika(id, naziv) VALUES(1, 'administrator');
INSERT INTO tip_korisnika(id, naziv) VALUES(2, 'registrirani korisnik');
INSERT INTO tip_korisnika(id, naziv) VALUES(3, 'gost');

INSERT INTO korisnik(korime, lozinka, email, ime, prezime, tip_korisnika_id, tajniTOTP, aktivacijski_kod, aktivan) VALUES('admin', '3ea32460fb7f0aabf65af4ad6af233f15318d16ddf2e6ce56b2c411061b44dc2', 'rwa@student.foi.hr', '', '', 1, '', null, 0);
INSERT INTO korisnik(korime, lozinka, email, ime, prezime, tip_korisnika_id, tajniTOTP, aktivacijski_kod, aktivan) VALUES('obican', '3ea32460fb7f0aabf65af4ad6af233f15318d16ddf2e6ce56b2c411061b44dc2', 'rwa@foi.hr', '', '', 2, '', null, 0);
INSERT INTO korisnik(korime, lozinka, email, ime, prezime, tip_korisnika_id, tajniTOTP, aktivacijski_kod, aktivan) VALUES('gost', '3ea32460fb7f0aabf65af4ad6af233f15318d16ddf2e6ce56b2c411061b44dc2', 'rwa@foi.hr', '', '', 3, '', null, 0);
COMMIT;