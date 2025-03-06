BEGIN;
CREATE TABLE "osoba"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "ime" VARCHAR(45),
  "prezime" VARCHAR(45),
  "poznat_po" TEXT,
  "popularnost" INTEGER,
  "profilna_slika" VARCHAR(45),
  CONSTRAINT "id_UNIQUE"
    UNIQUE("id")
);

CREATE TABLE "film"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naslov" TEXT ,
  "jezik" VARCHAR(45),
  "originalni_naslov" TEXT,
  "popularnost" INTEGER ,
  "slika_postera" TEXT,
  "datum_izdavanja" DATETIME,
  "lik" VARCHAR(45),
  CONSTRAINT "id_UNIQUE"
  UNIQUE("id")
);
CREATE TABLE "uloga"(
  "id_osoba" INTEGER NOT NULL,
  "id_film" INTEGER NOT NULL,
  "uloga" VARCHAR(45),
  PRIMARY KEY("id_osoba","id_film"),
  CONSTRAINT "fk_uloga_Osoba"
    FOREIGN KEY("id_osoba")
    REFERENCES "osoba"("id"),
  CONSTRAINT "fk_uloga_Film"
    FOREIGN KEY("id_film")
    REFERENCES "film"("id")
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
);
CREATE INDEX "uloga.fk_uloga_Osoba_idx" ON "uloga" ("id_osoba");
CREATE INDEX "uloga.fk_uloga_Film1_idx" ON "uloga" ("id_film");


CREATE TABLE "korisnik"(
  "korime" VARCHAR(50) NOT NULL
);

CREATE TABLE "zahtjev"(
"korime" VARCHAR(50) NOT NULL
);

INSERT INTO korisnik(korime) VALUES('admin');
INSERT INTO korisnik(korime) VALUES('obican');

INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3223, 'Robert', 'Downey Jr.', 'Acting', '90', '/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (16828, 'Chris', 'Evans', 'Acting', '85', '/a52ncG9JskJtqrryE0KakPPBkHJ.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (1245, 'Scarlett', 'Johansson', 'Acting', '88', '/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (74568, 'Chris', 'Hemsworth', 'Acting', '80', '/piQGdoIQOF3C1EI5cbYZLAW1gfj.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (103, 'Mark', 'Ruffalo', 'Acting', '75', '/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (17604, 'Jeremy', 'Renner', 'Acting', '70', '/yB84D1neTYXfWBaV0QOE9RF2VCu.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (1136406, 'Tom', 'Holland', 'Acting', '78', '/bBRlrpJm9XkNSg0YT5LCaxqoFMX.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (71580, 'Benedict', 'Cumberbatch', 'Acting', '82', '/fBEucxECxGLKVHBznO0qHtCGiMO.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (172069, 'Chadwick', 'Boseman', 'Acting', '85', '/nL16SKfyP1b7Hk6LsuWiqMfbdb8.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (22226, 'Paul', 'Rudd', 'Acting', '77', '/6jtwNOLKy0LdsRAKwZqgYMAfd5n.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (8404, 'Dan', 'Brown', 'Writing', '4.427', '/xck7tOHw3OjWXxKTuGdlzTgjsBO.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (5620, 'Kevin', 'Farley', 'Acting', '10.944', '/jpXmfRfd3fzvyC0bBqEbw8R2Meu.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (17921, 'Clem', 'Caserta', 'Acting', '7.208', '/d3Vm8hym67OrDkMZPU9bXZKZeWj.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (10924, 'Henry', 'Daniell', 'Acting', '4.549', '/5g4V2fKBAI5TGjqfItfsnPjqZN9.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (12840, 'John', 'Badham', 'Directing', '8.039', '/hh0EssedcgUOICkZywbVuwVOJO4.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (11286, 'Nick', 'Enright', 'Writing', '0.576', '/7NJucC4whSIgE8lTZqeBIolXlpI.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (19650, 'Gil', 'Delamare', 'Acting', '0.788', '/h6a15Idt4Oaec1BOUvj28Tz8414.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3085, 'James', 'Caan', 'Acting', '37.81', '/v3flJtQEyczxENi29yJyvnN6LVt.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (4071, 'Otto', 'Kruger', 'Acting', '6.646', '/nGSvwcSyD0645Vuv1xTJbzA21aq.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (9235, 'Nicoletta', 'Braschi', 'Acting', '4.653', '/9IeE3Iz9HXZVTrvhjSCKlR4FLxB.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3974, 'Miloš', 'Forman', 'Directing', '5.081', '/O2Crxh0l3u1mxHvjA6003gEpi7.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (7633, 'Leslie', 'Nielsen', 'Acting', '32.211', '/tA1N6zgXhpvcT5H0QCjGEoCtT9Q.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3386, 'Robert', 'E.', 'Writing', '1.075', '/iE7lnnDjEK3P2N772cpL6BvVNiE.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (9358, 'Pierre', 'Guffroy', 'Art', '0.7', '/2ZNLlKQY1wrRgXm41ZMf7n87KtE.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (8906, 'Annette', 'Charles', 'Acting', '2.023', '/4nOeQndvJzGaJJKLTyKqqydad9H.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (10718, 'Julian', 'Doyle', 'Editing', '0.737', '/5Ob1qeKC7OTULmB65dkYlTd1wBi.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (15903, 'George', 'Carlin', 'Acting', '9.975', '/6YKQHJzml6XviUADpSC6kfF56W9.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (1767, 'Todd', 'C.', 'Editing', '1.219', '/rupfgkwcPg0YaNCvDpcPP6jdwZb.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (4890, 'Brian', 'Tarantina', 'Acting', '2.93', '/1EysTrCLtGQ0rQBg6EqZkOWoamR.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (1736, 'James', 'Remar', 'Acting', '25.44', '/56LwfMaMge2LmWYI46O6R2Wm0YX.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (2480, 'Tam', 'White', 'Acting', '0.952', '/rQfnxz1NraIgiyvQxObsB3uCDMG.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (8770, 'Francesco', 'De', 'Acting', '5.579', '/s8uOepBCIS6dpZ0OnLjnjXjE6z2.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (6573, 'William', 'Sadler', 'Acting', '13.575', '/rWeb2kjYCA7V9MC9kRwRpm57YoY.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (13930, 'Bruce', 'Moriarty', 'Directing', '0.639', '/jxtO2eWlOZJUa2FQB6iq7vvPk5O.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (19196, 'Eric', 'Deulen', 'Acting', '2.537', '/RTQxsBDOMbCxLth6va6mZPifVn.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (6787, 'Adolfo', 'Lastretti', 'Acting', '3.095', '/wssCNcdZ7ziWSbNYpABhJ62eHAe.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (542, 'Kimberly', 'Campbell', 'Acting', '3.99', '/srUMT8MhY0i0CnPNOqdORuxL6JS.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3451, 'Mel', 'Stuart', 'Directing', '2.081', '/yzET7bb06cxRBpk0tuQuqmUCOOA.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (3053, 'Sophie', 'Lee', 'Acting', '2.195', '/rbKriPoggoHFRL9HWqyZ33C55Dx.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (231, 'Greg', 'Bryk', 'Acting', '9.074', '/1I3SxKFvQSam6KOMT4j5f0nFxRg.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (6160, 'Sylvia', 'Nasar', 'Writing', '1.094', '/zDZEdGQ9MD6jGXr1YPR5eFNimKV.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (5247, 'John', 'Fiedler', 'Acting', '9.513', '/6vfLLGeGuO6Ko0VRnyhgE2v6RUu.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (6232, 'Carrie', 'Hilton', 'Production', '28.459', '/oV6zgHmWq9yfSHJ3gE33Tzpbch6.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (7396, 'Peter', 'Farrelly', 'Directing', '8.105', '/3PDYOFfk5NLmNcEz6SFZmdmqVZr.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (14920, 'Kathryn', 'McGuire', 'Acting', '0.977', '/cAkTiaCzQTEE7PwUxrg2klxUXjS.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (14704, 'Park', 'Overall', 'Acting', '4.336', '/fKl0zP4HuzMPxTvXZqDGHpN6U.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (10798, 'Groucho', 'Marx', 'Acting', '5.579', '/gWBbLObdWqarlUiRbR9MfgJONEM.jpg');
INSERT INTO osoba (id, ime, prezime, poznat_po, popularnost, profilna_slika) VALUES (19386, 'Jacqueline', 'Jehanneuf', 'Acting', '2.129', '/3tWCbxebmPjwMHpN1fZ0CcrTW6U.jpg');

INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (10, 'Ant-Man', 'English', 'Ant-Man', 85, 'antman.jpg', '2015-07-17', 'Scott Lang');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (1, 'Iron Man', 'English', 'Iron Man', 95, 'ironman.jpg', '2008-05-02', 'Tony Stark');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (2, 'Captain America: The First Avenger', 'English', 'Captain America: The First Avenger', 90, 'captainamerica.jpg', '2011-07-22', 'Steve Rogers');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (3, 'Black Widow', 'English', 'Black Widow', 85, 'blackwidow.jpg', '2021-07-09', 'Natasha Romanoff');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (4, 'Thor', 'English', 'Thor', 88, 'thor.jpg', '2011-05-06', 'Thor');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (5, 'The Avengers', 'English', 'The Avengers', 98, 'avengers.jpg', '2012-05-04', 'Bruce Banner');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (6, 'Hawkeye', 'English', 'Hawkeye', 75, 'hawkeye.jpg', '2021-11-24', 'Clint Barton');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (7, 'Spider-Man: Homecoming', 'English', 'Spider-Man: Homecoming', 92, 'spiderman.jpg', '2017-07-07', 'Peter Parker');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (8, 'Doctor Strange', 'English', 'Doctor Strange', 87, 'doctorstrange.jpg', '2016-11-04', 'Stephen Strange');
INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (9, 'Black Panther', 'English', 'Black Panther', 94, 'blackpanther.jpg', '2018-02-16', 'Challa');


INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (3223, 10138, 'Tony Stark');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (16828, 1771, 'Steve Rogers');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (1245, 24428, 'Natasha Romanoff');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (74568, 877188, 'Thor');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (103, 877188, 'Bruce Banner');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (17604, 10195, 'Clint Barton');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (1136406, 580489, 'Peter Parker');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (71580, 877188, 'Stephen Strange');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (172069, 1076032, 'Challa');
INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (22226, 50647, 'Scott Lang');

COMMIT;
