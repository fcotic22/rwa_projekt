import Baza from "../zajednicko/baza.js";
import { provjeriTOTP } from "../zajednicko/totp.js";
//data access object
export class KorisnikDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024fcotic22_web.sqlite");
    }
    async dohvatiSveKorisnike() {
        const sql = 'SELECT * FROM korisnik';
        var korisnici = await this.baza.izvrsiUpitPromiseAll(sql, []);
        var rezultat = new Array();
        for (var kor of korisnici) {
            let k = { ime: kor["ime"], prezime: kor["prezime"], adresa: kor["adresa"], datum_rodjenja: kor["datum_rodjenja"], spol: kor["spol"], korime: kor["korime"], lozinka: kor["lozinka"], email: kor["email"], tip_korisnika_id: kor["tip_korisnika_id"], tajniTOTP: kor["tajniTOTP"], aktivacijski_kod: kor["aktivacijski_kod"], aktivan: kor["aktivan"] };
            rezultat.push(k);
        }
        return rezultat;
    }
    async dohvatiKorisnika(korime) {
        const sql = 'SELECT * FROM korisnik WHERE korime = ?';
        var korisnik = (await this.baza.izvrsiUpitPromiseAll(sql, [korime]))[0];
        if (korisnik) {
            return {
                ime: korisnik["ime"],
                prezime: korisnik["prezime"],
                adresa: korisnik["adresa"],
                datum_rodjenja: korisnik["datum_rodjenja"],
                spol: korisnik["spol"],
                korime: korisnik["korime"],
                lozinka: korisnik["lozinka"],
                email: korisnik["email"],
                tip_korisnika_id: korisnik["tip_korisnika_id"],
                tajniTOTP: korisnik["tajniTOTP"],
                aktivacijski_kod: korisnik["aktivacijski_kod"],
                aktivan: korisnik["aktivan"]
            };
        }
        else {
            return null;
        }
    }
    async dodajKorisnika(korisnik) {
        var sql = 'INSERT INTO korisnik (ime, prezime, adresa, datum_rodjenja, spol, korime, lozinka, email, tip_korisnika_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const postoji = await this.dohvatiKorisnika(korisnik.korime);
        if (postoji == null) {
            try {
                await this.baza.izvrsiUpit(sql, [korisnik.ime, korisnik.prezime, korisnik.adresa, korisnik.datum_rodjenja, korisnik.spol, korisnik.korime, korisnik.lozinka, korisnik.email, 2]);
                return true;
            }
            catch (error) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    async obrisiKorisnika(korime) {
        var sql = 'DELETE FROM korisnik WHERE korime = ?';
        try {
            await this.baza.izvrsiUpit(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom brisanja korisnika:", error);
            return false;
        }
    }
    async azurirajKorisnika(korime, korisnik) {
        var sql = 'UPDATE korisnik SET ime = ?, prezime = ?, adresa = ?, datum_rodjenja = ?, spol = ?, lozinka = ?, email = ?, tip_korisnika_id = ? WHERE korime = ?';
        try {
            await this.baza.izvrsiUpitPromise(sql, [korisnik.ime, korisnik.prezime, korisnik.adresa, korisnik.datum_rodjenja, korisnik.spol, korisnik.lozinka, korisnik.email, korisnik.tip_korisnika_id, korisnik.korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom ažuriranja korisnika:", error);
            return false;
        }
    }
    async provjeriAuth(korime) {
        var korisnik = await this.dohvatiKorisnika(korime);
        if (korisnik?.tajniTOTP == '' || korisnik?.tajniTOTP == null) {
            return false;
        }
        else {
            return korisnik.tajniTOTP;
        }
    }
    async aktivanAuth(korime) {
        var korisnik = await this.dohvatiKorisnika(korime);
        if (korisnik?.aktivan == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    async ukljuciAuth(korime, tajniTOTP) {
        const korisnik = await this.dohvatiKorisnika(korime);
        if (korisnik?.tajniTOTP == tajniTOTP) {
            var sql = 'UPDATE korisnik SET aktivan = 1 WHERE korime = ?';
            try {
                await this.baza.izvrsiUpitPromise(sql, [korime]);
                console.log(`Auth uključen za ${korime}, postojeći tajni ključ: ${korisnik.tajniTOTP}`);
                return true;
            }
            catch (error) {
                console.error("Greška prilikom uključivanja autentifikacije:", error);
                return false;
            }
        }
        else {
            var sql = 'UPDATE korisnik SET tajniTOTP = ?, aktivan = 1 WHERE korime = ?';
            try {
                await this.baza.izvrsiUpitPromise(sql, [tajniTOTP, korime]);
                console.log(`Auth uključen za ${korime}, novi tajni ključ: ${tajniTOTP}`);
                return true;
            }
            catch (error) {
                console.error("Greška prilikom uključivanja autentifikacije:", error);
                return false;
            }
        }
    }
    async iskljuciAuth(korime) {
        var sql = 'UPDATE korisnik SET aktivan = 0 WHERE korime = ?';
        try {
            await this.baza.izvrsiUpitPromise(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom isključivanja autentifikacije:", error);
            return false;
        }
    }
    async provjeriTOTP(korime, totp) {
        try {
            let korisnik = await this.dohvatiKorisnika(korime);
            //console.log("korisnik: ", korisnik);
            if (korisnik && korisnik.tajniTOTP) {
                let rezultat = provjeriTOTP(totp, korisnik.tajniTOTP);
                return rezultat;
            }
            else {
                console.log("Korisnik nije pronađen ili nema TOTP.");
                return false;
            }
        }
        catch (error) {
            console.error("Greška prilikom provjere TOTP:", error);
            return false;
        }
    }
    async oznaciTOTPVerifikaciju(korime) {
        const sql = 'UPDATE korisnik SET totpVerified = 1 WHERE korime = ?';
        try {
            await this.baza.izvrsiUpitPromise(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom označavanja TOTP verifikacije:", error);
            return false;
        }
    }
}
export class KorisnikDAOservis {
    baza2;
    constructor() {
        this.baza2 = new Baza("podaci/RWA2024fcotic22_servis.sqlite");
    }
    async dohvatiKorisnikaServis(korime) {
        const sql = 'SELECT * FROM korisnik WHERE korime = ?';
        var korisnik = (await this.baza2.izvrsiUpitPromiseAll(sql, [korime]))[0];
        if (korisnik != undefined) {
            return korisnik;
        }
        else {
            return null;
        }
    }
    async dodajZahtjevServis(korime) {
        const sql = 'INSERT INTO zahtjev(korime) VALUES (?)';
        try {
            await this.baza2.izvrsiUpitPromise(sql, [korime]);
            return true;
        }
        catch (greska) {
            console.log("Greska sa zahtjevom: " + greska);
            return false;
        }
    }
    async dajZahtjev(korime) {
        const sql = 'SELECT * FROM zahtjev WHERE korime = ?';
        try {
            const zahtjev = await this.baza2.izvrsiUpitPromiseAll(sql, [korime]);
            // console.log("zahtjev iz baze u dajZahtjev korisnikDAO:", zahtjev);
            if (zahtjev.length > 0) {
                return zahtjev[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error("Greška prilikom dohvaćanja zahtjeva:", error);
            return null;
        }
    }
    async potvrdiZahtjev(korime) {
        const sqlInsert = 'INSERT INTO korisnik(korime) VALUES (?)';
        const sqlDelete = 'DELETE FROM zahtjev WHERE korime = ?';
        try {
            const zahtjev = await this.dajZahtjev(korime);
            //console.log("zahtjev dohvaćen iz baze u potvrdiZahtjev:", zahtjev);
            if (zahtjev == null) {
                return false;
            }
            await this.baza2.izvrsiUpitPromise(sqlInsert, [korime]);
            await this.baza2.izvrsiUpitPromise(sqlDelete, [korime]);
            return true;
        }
        catch (error) {
            console.log("Greška prilikom potvrde zahtjeva:", error);
            return false;
        }
    }
    async obrisiZahtjev(korime) {
        const sql = 'DELETE FROM zahtjev WHERE korime = ?';
        try {
            await this.baza2.izvrsiUpitPromise(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom brisanja zahtjeva:", error);
            return false;
        }
    }
    async obrisiPristup(korime) {
        const sql = 'DELETE FROM korisnik WHERE korime = ?';
        try {
            await this.baza2.izvrsiUpitPromise(sql, [korime]);
            return true;
        }
        catch (error) {
            console.error("Greška prilikom brisanja pristupa:", error);
            return false;
        }
    }
}
