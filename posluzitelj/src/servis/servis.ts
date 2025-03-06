import { __dirname, __filename,  dajPortServis } from '../zajednicko/esm_pomocnik.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import sesija from 'express-session'
import kolacici from 'cookie-parser'
import { fileURLToPath } from 'url';
import { RestKorisnik} from "./restKorisnik.js";
import { RestTMDB } from "./restTMDB.js";
import { RestFilm } from "./restFilm.js";
import { RestOsoba } from "./restOsoba.js";
import { Konfiguracija } from '../zajednicko/konfiguracija.js';
import {provjeriJWT} from '../zajednicko/jwtValidator.js';
import {HtmlUpravitelj} from '../htmlUpravitelj.js';
import {FetchUpravitelj} from '../fetchUpravitelj.js';
import {provjeriSesiju} from '../zajednicko/jwtValidator.js';

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors({
    origin: function (origin, povratniPoziv) {
        //console.log(origin);
        if (!origin || origin.startsWith("http://spider.foi.hr:") || origin.startsWith("http://localhost:")) {
            povratniPoziv(null, true);
        } else {
            povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));


let konfig = new Konfiguracija();

konfig.ucitajKonf().then(pokreniServer).catch((error: Error | any) => {
    if (process.argv.length == 2) {
        console.log("Nije upisan naziv datoteke");
    } else if (error.path != undefined) {
        console.log("Nije moguće otvoriti datoteku" + error.path);
    } else {
        console.log("Greška:" + error.message);
    }
});


function pokreniServer() {
    let port = dajPortServis("fcotic22");
    if (process.argv[3] != undefined) {
        port = process.argv[3];
    }

    server.use(kolacici());
    server.use(sesija({
       secret: konfig.dajKonf().tajniKljucSesija,
       saveUninitialized: true,
       cookie: {  maxAge: 1000 * 60 * 60 * 3 },
       resave: false
    }));

    const _filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_filename);

        server.use("/servis/app/dokumentacija/slike",express.static(path.join(_dirname, '../../dokumentacija/slike')));

    server.get('/servis/app/dokumentacija', (zahtjev, odgovor) => {
        const dokumentacijaPutanja = path.join(_dirname, '../../dokumentacija/dokumentacija.html');
        odgovor.sendFile(dokumentacijaPutanja);
    });


    server.use("/js", express.static(path.join(_dirname, '../jsk')));
    server.use("/css", express.static(path.join(_dirname, '../css')));

    pripremiPutanjeResursKorisnika();
    pripremiPutanjeResursTMDB();
    pripremiPutanjeResursFilm();
    pripremiPutanjeResursOsoba();
    
    pripremiPutanjeAutentifikacija(port);
    pripremiPutanjeZaDohvatJWT();

    server.use("/", express.static(__dirname() + "/../../angular/browser"));
    server.get("*" , (zahtjev, odgovor) => {
        odgovor.sendFile(path.join(__dirname() + "/../../angular/browser/index.html"));
    });

    server.use((zahtev, odgovor) => {
        odgovor.status(404).send("Nepostojeći URL");
    });

    server.listen(port, () => {
        console.log("Server je pokrenut na portu", port);
    });
}

function pripremiPutanjeResursKorisnika() {
    let restKorisnik = new RestKorisnik();
    
    server.post("/servis/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava.bind(restKorisnik));
    server.get("/servis/korisnici", provjeriJWT, restKorisnik.getKorisnici.bind(restKorisnik));
    server.post("/servis/korisnici", restKorisnik.postKorisnici.bind(restKorisnik)); 
    server.put("/servis/korisnici", provjeriJWT,restKorisnik.putKorisnici.bind(restKorisnik));
    server.delete("/servis/korisnici", provjeriJWT, restKorisnik.deleteKorisnici.bind(restKorisnik));
    
    server.get("/servis/korisnici/:korime", restKorisnik.getKorisnik.bind(restKorisnik));
    server.post("/servis/korisnici/:korime", provjeriJWT, restKorisnik.postKorisnik.bind(restKorisnik)); 
    server.put("/servis/korisnici/:korime", provjeriJWT, restKorisnik.putKorisnik.bind(restKorisnik));
    server.delete("/servis/korisnici/:korime", provjeriJWT, restKorisnik.deleteKorisnik.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/pristup',  restKorisnik.provjeriPristup.bind(restKorisnik));
    

    server.post('/servis/korisnici/:korime/zahtjev', provjeriJWT, restKorisnik.dodajZahtjev.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/zahtjev', provjeriJWT, restKorisnik.dohvatiZahtjev.bind(restKorisnik));
    server.delete('/servis/korisnici/:korime/zahtjev', provjeriJWT,  restKorisnik.obrisiZahtjev.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/potvrdiZahtjev', provjeriJWT, restKorisnik.potvrdiZahtjev.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/odbijZahtjev', provjeriJWT, restKorisnik.odbijZahtjev.bind(restKorisnik));
    server.delete('/servis/korisnici/:korime/izbrisiPristup', provjeriJWT, restKorisnik.izbrisiPristup.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/ukljuciAuth', provjeriJWT, restKorisnik.ukljuciAuth.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/iskljuciAuth', provjeriJWT, restKorisnik.iskljuciAuth.bind(restKorisnik));
    server.get('/servis/korisnici/:korime/aktivanAuth', restKorisnik.aktivanAuth.bind(restKorisnik));    
    server.post('/servis/app/korisnici/:korime/provjeriTOTP', restKorisnik.provjeriTOTP.bind(restKorisnik));
}

function pripremiPutanjeResursTMDB() {
    let restTMDB = new RestTMDB(konfig.dajKonf()["tmdbApiKeyV3"]);

    server.get("/servis/app/api/tmdb/osobe", provjeriSesiju, provjeriJWT, restTMDB.getOsobe.bind(restTMDB));
    server.get("/servis/app/api/tmdb/osoba/:id",provjeriSesiju, provjeriJWT, restTMDB.getOsobu.bind(restTMDB));
    server.post("/servis/app/api/tmdb/osobe", provjeriSesiju, provjeriJWT, restTMDB.postOsobu.bind(restTMDB));
    server.get("/servis/app/api/tmdb/osoba/:id/filmovi", provjeriSesiju, provjeriJWT,  restTMDB.getFilmoviOsobe.bind(restTMDB));
    server.get("/servis/app/api/tmdb/osoba/:id/sviFilmovi", provjeriSesiju, provjeriJWT, restTMDB.getSveFilmoveOsobe.bind(restTMDB));
    server.get("/servis/app/api/tmdb/osoba/:id/slike", provjeriSesiju, provjeriJWT,  restTMDB.getSlikeOsobe.bind(restTMDB));
}
function pripremiPutanjeResursFilm() {
    let restFilm = new RestFilm();
    server.get("/servis/app/film/:id", provjeriSesiju, provjeriJWT, restFilm.getFilm.bind(restFilm));
    server.post("/servis/app/film/:id", provjeriSesiju, provjeriJWT, restFilm.postFilmId.bind(restFilm));
    server.post("/servis/app/film", provjeriSesiju, provjeriJWT, restFilm.postFilm.bind(restFilm));
    server.put("/servis/app/film", provjeriSesiju, provjeriJWT, restFilm.putFilm.bind(restFilm));
    server.get("/servis/app/film", restFilm.getFilmovi.bind(restFilm));
    server.delete("/servis/app/film", provjeriSesiju, provjeriJWT, restFilm.deleteFilm.bind(restFilm));
    server.delete("/servis/app/film/:id", provjeriSesiju, provjeriJWT, restFilm.deleteFilmId.bind(restFilm));
}

function pripremiPutanjeResursOsoba(){
    let restOsoba = new RestOsoba();
    server.get("/servis/app/osoba/:id", provjeriSesiju, provjeriJWT, restOsoba.getOsobu.bind(restOsoba));
    server.put("/servis/app/osoba", provjeriSesiju, provjeriJWT, restOsoba.putOsoba.bind(restOsoba));
    server.put("/servis/app/osoba/:id", provjeriSesiju, provjeriJWT, restOsoba.putOsoba.bind(restOsoba));
    server.post("/servis/app/osoba/:id", provjeriSesiju, provjeriJWT, restOsoba.postOsobaId.bind(restOsoba));
    server.get("/servis/app/osobe", provjeriSesiju, provjeriJWT, restOsoba.getOsobeStranica.bind(restOsoba));
    server.get("/servis/app/osoba/:id/film", provjeriSesiju, provjeriJWT, restOsoba.getFilmoveOsobe.bind(restOsoba));
    server.put("/servis/app/osoba/:id/film", provjeriSesiju, provjeriJWT, restOsoba.putFilmoveOsobi.bind(restOsoba));
    server.delete("/servis/app/osoba" , provjeriSesiju, provjeriJWT, restOsoba.deleteOsobuBezId.bind(restOsoba));
    server.delete("/servis/app/osoba/:id/film", provjeriSesiju, provjeriJWT, restOsoba.deleteFilmoveOsobe.bind(restOsoba));
    server.post("/servis/app/osoba", provjeriSesiju, provjeriJWT, restOsoba.postOsobaStranica.bind(restOsoba));
    server.delete("/servis/app/osoba/:id", provjeriSesiju, provjeriJWT, restOsoba.deleteOsobu.bind(restOsoba));
}


function pripremiPutanjeAutentifikacija(port : number) {
  let htmlUpravitelj = new HtmlUpravitelj(konfig.dajKonf().jwtTajniKljuc, parseInt(konfig.dajKonf().jwtValjanost), port);
  server.get("/servis/app/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
  server.post("/servis/app/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
  server.get("/servis/app/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
  server.get("/servis/app/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
  server.post("/servis/app/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
  server.post("/servis/app/prijavaTOTP", htmlUpravitelj.prijavaTOTP.bind(htmlUpravitelj));
  server.post("/servis/app/prijavaIspravanTOTP", htmlUpravitelj.prijavaIspravanTOTP.bind(htmlUpravitelj));
  server.get("/servis/app/provjeriPrijavu", htmlUpravitelj.provjeriPrijavu.bind(htmlUpravitelj));
  server.get("/servis/app/provjeriPristup", provjeriSesiju, htmlUpravitelj.provjeriPristup.bind(htmlUpravitelj));
  server.post("/servis/app/zahtjevZaPristup",provjeriSesiju, htmlUpravitelj.zahtjevZaPristup.bind(htmlUpravitelj));
  server.get("/servis/app/korisnici",provjeriSesiju, htmlUpravitelj.korisnici.bind(htmlUpravitelj));
  server.get("/servis/app/korisnik/:korime",provjeriSesiju, htmlUpravitelj.korisnik.bind(htmlUpravitelj));

  server.get("/servis/app/postojiZahtjev", htmlUpravitelj.postojiZahtjev.bind(htmlUpravitelj));
  server.get("/servis/app/postojiZahtjev/:korime",  provjeriSesiju, htmlUpravitelj.postojiZahtjevKorime.bind(htmlUpravitelj));
  server.get("/servis/app/potvrdiZahtjev/:korime", provjeriSesiju, htmlUpravitelj.potvrdiZahtjev.bind(htmlUpravitelj));
  server.get("/servis/app/odbijZahtjev/:korime", provjeriSesiju,htmlUpravitelj.odbijZahtjev.bind(htmlUpravitelj));
  server.get("/servis/app/obrisiKorisnika/:korime",provjeriSesiju, htmlUpravitelj.obrisiKorisnika.bind(htmlUpravitelj));
  server.put("/servis/app/azurirajKorisnika/:korime",provjeriSesiju, htmlUpravitelj.azurirajKorisnika.bind(htmlUpravitelj)); 
  server.get("/servis/app/obrisiPristup/:korime",provjeriSesiju, htmlUpravitelj.obrisiPristup.bind(htmlUpravitelj));
  server.get("/servis/app/postojiPristup/:korime",provjeriSesiju, htmlUpravitelj.postojiPristup.bind(htmlUpravitelj));
  server.get('/servis/app/ukljuciAuth/:korime', provjeriSesiju , htmlUpravitelj.ukljuciAuth.bind(htmlUpravitelj));
  server.get('/servis/app/iskljuciAuth/:korime', provjeriSesiju , htmlUpravitelj.iskljuciAuth.bind(htmlUpravitelj));
  server.get('/servis/app/aktivanAuth/:korime' , htmlUpravitelj.aktivanAuth.bind(htmlUpravitelj));
  server.post('/servis/app/recaptcha', htmlUpravitelj.recaptcha.bind(htmlUpravitelj));
}

function pripremiPutanjeZaDohvatJWT(){
	  let fetchUpravitelj = new FetchUpravitelj(konfig.dajKonf().jwtTajniKljuc, konfig.dajKonf().jwtValjanost);
    server.post("/servis/app/getJWT", fetchUpravitelj.getJWT.bind(fetchUpravitelj));
}
