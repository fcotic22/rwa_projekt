import { TMDBklijent } from "./klijentTMDB.js";
import { OsobaDAO } from "./osobaDAO.js";
export class RestTMDB {
    tmdbKlijent;
    osobaDAO;
    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        this.osobaDAO = new OsobaDAO();
        this.tmdbKlijent.dohvatiFilm(500).then().catch(console.log);
    }
    getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let stranica = zahtjev.query["stranica"];
        let trazi = zahtjev.query["trazi"];
        if (stranica == null ||
            trazi == null ||
            typeof stranica != "string" ||
            typeof trazi != "string") {
            odgovor.status(417);
            odgovor.send({ greska: "neocekivani podaci" });
            return;
        }
        this.tmdbKlijent.dohvatiOsobe(trazi, parseInt(stranica))
            .then((osobe) => {
            //console.log(osobe);
            odgovor.status(200).send(osobe);
        })
            .catch((greska) => {
            odgovor.status(400).json(greska);
        });
    }
    async getOsobu(zahtjev, odgovor) {
        odgovor.type("application/json");
        let id = zahtjev.params["id"];
        if (id == null || id == undefined) {
            odgovor.status(417).send({ greska: "id nije poslan" });
            return;
        }
        let osobaBaza = await this.osobaDAO.dohvatiOsobu(parseInt(id));
        if (osobaBaza.length > 0) {
            const osoba = await this.tmdbKlijent.dohvatiOsobu(parseInt(id));
            odgovor.status(200).send(osoba);
        }
        else {
            odgovor.status(400).send({ greska: "osoba nije pronadjena u bazi" });
        }
    }
    async getFilmoviOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let id = zahtjev.params["id"];
        if (id == null || id == undefined) {
            odgovor.status(417).send({ greska: "id nije poslan" });
            return;
        }
        let filmovi = await this.tmdbKlijent.dohvatiFilmoveOsobe(parseInt(id));
        if (filmovi) {
            odgovor.status(200).send(filmovi.slice(0, 20));
        }
        else {
            odgovor.status(400).send({ greska: "filmovi nisu pronadjeni" });
        }
    }
    async getSveFilmoveOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let id = zahtjev.params["id"];
        if (id == null || id == undefined) {
            odgovor.status(417).send({ greska: "id nije poslan" });
            return;
        }
        let filmovi = await this.tmdbKlijent.dohvatiFilmoveOsobe(parseInt(id));
        if (filmovi) {
            odgovor.status(200).send(filmovi);
        }
        else {
            odgovor.status(400).send({ greska: "filmovi nisu pronadjeni" });
        }
    }
    async getSlikeOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        let id = zahtjev.params["id"];
        if (id == null || id == undefined) {
            odgovor.status(417).send({ greska: "id nije poslan" });
            return;
        }
        let slike = await this.tmdbKlijent.dohvatiSlikeOsobe(parseInt(id));
        if (slike) {
            odgovor.status(200).send(slike);
        }
        else {
            odgovor.status(400).send({ greska: "slike nisu pronadjene" });
        }
    }
    async postOsobu(zahtjev, odgovor) {
        odgovor.type("application/json");
        let osoba = zahtjev.body;
        if (osoba == null && osoba == undefined) {
            odgovor.status(417);
            odgovor.send({ greska: "osoba nije poslana" });
            return;
        }
        let dodana = await this.osobaDAO.dodajOsobu(osoba);
        if (dodana) {
            odgovor.status(200).send({ dodana: true });
        }
        else {
            odgovor.status(400).send({ dodana: false });
        }
    }
}
