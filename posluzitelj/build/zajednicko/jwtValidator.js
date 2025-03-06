import { provjeriToken, dajTijelo } from './jwt.js';
import { Konfiguracija } from './konfiguracija.js';
import { KorisnikDAO } from '../servis/korisnikDAO.js';
import { dajPortServis } from './esm_pomocnik.js';
export async function provjeriJWT(zahtjev, odgovor, iduce) {
    odgovor.type("application/json");
    const konfiguracija = new Konfiguracija();
    await konfiguracija.ucitajKonf();
    const tajniKljucJWT = konfiguracija.dajKonf().jwtTajniKljuc;
    const trajanjeJWT = konfiguracija.dajKonf().jwtValjanost;
    const provjera = provjeriToken(zahtjev, tajniKljucJWT);
    const tijelo = dajTijelo(zahtjev.headers.authorization);
    const korisnik = await provjeriKorisnikaUBazi(tijelo["korime"], tijelo["tip_korisnika_id"]);
    //ispisiDijelove(zahtjev.headers.authorization as string);
    if (!provjera.validan) {
        console.log("JWT nije prihvaćen 406");
        odgovor.status(406).json({ error: "JWT nije prihvaćen" });
    }
    else if (!korisnik) {
        console.log("nevaljali korisnik 406");
        odgovor.status(422).json({ error: "nevaljani korisnik u JWT" });
    }
    else {
        console.log("JWT prihvaćen 200");
        iduce();
    }
}
export async function provjeriSesiju(zahtjev, odgovor, next) {
    let sesija = zahtjev.session;
    // console.log("PRovjeri sesiju korime: ", sesija.korime);
    if (sesija.korime == null || sesija.korime == undefined) {
        odgovor.status(401).json({ greska: "Niste prijavljeni!" });
        console.log("Niste prijavljeni 401");
        return;
    }
    const konfiguracija = new Konfiguracija();
    await konfiguracija.ucitajKonf();
    const port = dajPortServis("fcotic22");
    try {
        const jwtOdgovor = await fetch(`http://localhost:${port}/servis/app/getJWT`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sesija)
        });
        if (jwtOdgovor.status !== 201) {
            odgovor.status(jwtOdgovor.status).json(await jwtOdgovor.json());
            console.log("Greska u provjeriSesiju 401");
            return;
        }
        const jwtPodaci = await jwtOdgovor.json();
        sesija.jwt = jwtPodaci.jwt;
        zahtjev.headers.authorization = `Bearer ${jwtPodaci.jwt}`;
        next();
    }
    catch (error) {
        console.error("Greska u provjeriSesiju:", error);
        odgovor.status(500).json({ greska: "Greška prilikom provjere sesije" });
    }
}
async function provjeriKorisnikaUBazi(korime, tip_korisnika) {
    var kdao = new KorisnikDAO();
    var korisnik = await kdao.dohvatiKorisnika(korime);
    if (korisnik != null) {
        return true;
    }
    else
        return false;
}
