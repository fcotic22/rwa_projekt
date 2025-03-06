import { KorisnikDAO, KorisnikDAOservis } from "./korisnikDAO.js";
import { kreirajTajniKljuc } from "../zajednicko/totp.js";
export class RestKorisnik {
    kdao;
    kdao_servis;
    constructor() {
        this.kdao = new KorisnikDAO();
        this.kdao_servis = new KorisnikDAOservis();
    }
    //KORISNIK
    getKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        this.kdao.dohvatiSveKorisnike().then((korisnici) => {
            odgovor.send(JSON.stringify(korisnici));
        });
    }
    async postKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        let podaci = zahtjev.body;
        let poruka = await this.kdao.dodajKorisnika(podaci);
        if (poruka)
            odgovor.status(200);
        else
            odgovor.status(400);
        odgovor.send(JSON.stringify(poruka));
    }
    deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    putKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    getKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        let korime = zahtjev.params["korime"];
        if (korime == undefined) {
            odgovor.send({ greska: "Nepostojeće korime" });
            return;
        }
        this.kdao.dohvatiKorisnika(korime).then((korisnik) => {
            odgovor.send(JSON.stringify(korisnik));
        });
    }
    getKorisnikPrijava(zahtjev, odgovor) {
        odgovor.type("application/json");
        let korime = zahtjev.params["korime"];
        if (korime == undefined) {
            odgovor.status(400);
            odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
            return;
        }
        this.kdao.dohvatiKorisnika(korime).then((korisnik) => {
            if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka) {
                korisnik.lozinka = "";
                odgovor.send(JSON.stringify(korisnik));
            }
            else {
                odgovor.status(400);
                odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
            }
        }).catch((err) => {
            odgovor.send({ greska: "Greška prilokom prijave" });
        });
    }
    postKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    putKorisnik = async (zahtjev, odgovor) => {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    };
    deleteKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        var korime = zahtjev.params["korime"];
        this.kdao.obrisiKorisnika(korime).then((rezultat1) => {
            this.kdao_servis.obrisiPristup(korime).then((rezultat2) => {
                this.kdao_servis.obrisiZahtjev(korime).then((rezultat3) => {
                    if (rezultat1 && rezultat2 && rezultat3) {
                        odgovor.status(200).send({ obrisan: true });
                    }
                    else {
                        odgovor.status(400).send({ obrisan: false });
                    }
                });
            });
        }).catch((greska) => {
            console.error(`Greška prilikom brisanja korisnika: ${greska}`);
            odgovor.status(400).send({ greska: "Greška prilikom brisanja korisnika" });
        });
    }
    provjeriPristup(zahtjev, odgovor) {
        odgovor.type("application/json");
        var korime = zahtjev.params["korime"];
        this.kdao_servis.dohvatiKorisnikaServis(korime).then((korisnik) => {
            if (korisnik != undefined && korisnik != null) {
                odgovor.status(200).send({ pristup: true });
            }
            else {
                odgovor.status(400).send({ pristup: false });
            }
        }).catch((greska) => {
            console.log(`Greška prilikom provjere pristupa: ${greska}`);
            odgovor.status(400).send({ greska: "Greška prilikom provjere pristupa" });
        });
    }
    async dohvatiZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        //console.log("korime iz dohvatiZahtjev rest:", korime);
        try {
            const zahtjev = await this.kdao_servis.dajZahtjev(korime);
            //console.log("zahtjev iz dohvatiZahtjev:", zahtjev);
            if (zahtjev) {
                odgovor.status(200).json(zahtjev);
            }
            else {
                odgovor.status(400).json({ poruka: "Zahtjev ne postoji" });
            }
        }
        catch (error) {
            console.error("Greška prilikom dohvaćanja zahtjeva:", error);
            odgovor.status(400).json({ message: "Greška prilikom dohvaćanja zahtjeva" });
        }
    }
    async dodajZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        //console.log("korime iz resta:", korime);
        try {
            const result = await this.kdao_servis.dodajZahtjevServis(korime);
            if (result) {
                odgovor.status(201).json({ poruka: "Zahtjev dodan na servisu" });
            }
            else {
                odgovor.status(400).json({ poruka: "Zahtjev nije dodan na servisu" });
            }
        }
        catch (error) {
            console.error("Greška pri dodavanju zahtjeva u dodajZahtjev:", error);
            odgovor.status(400).json({ greska: "Greška pri dodavanju zahtjeva " });
        }
    }
    async potvrdiZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        try {
            const rezultat = await this.kdao_servis.potvrdiZahtjev(korime);
            if (rezultat) {
                odgovor.status(201).json({ poruka: "Zahtjev potvrđen" });
            }
            else {
                odgovor.status(400).json({ greska: "zahtjev nije potvrđen" });
            }
        }
        catch (greska) {
            console.error(`Greška prilikom potvrde zahtjeva: ${greska}`);
            odgovor.status(400).json({ greska: "Greška prilikom potvrde zahtjeva" });
        }
    }
    async odbijZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        //console.log("korime iz potvrdi zahtjev:", korime);
        try {
            const rezultat = await this.kdao_servis.obrisiZahtjev(korime);
            //console.log("rezultat iz potvrdi zahtjev: " + rezultat);
            if (rezultat) {
                odgovor.status(201).json({ poruka: "Zahtjev odbijen" });
            }
            else {
                odgovor.status(400).json({ greska: "zahtjev nije odbijen" });
            }
        }
        catch (greska) {
            console.error("Greška prilikom potvrde zahtjeva: ${greska}");
            odgovor.status(400).json({ greska: "Greška prilikom potvrde zahtjeva" });
        }
    }
    async obrisiZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        //console.log("korime:", korime);
        try {
            const result = await this.kdao_servis.obrisiZahtjev(korime);
            if (result) {
                odgovor.status(200).json({ message: "Zahtjev obrisan" });
            }
            else {
                odgovor.status(400).json({ message: "Zahtjev nije obrisan" });
            }
        }
        catch (error) {
            console.error("Greška prilikom brisanja zahtjeva:", error);
            odgovor.status(400).json({ greska: "Greška prilikom brisanja zahtjeva" });
        }
    }
    async izbrisiPristup(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        console.log("korime iz brisanja pristupa:", korime);
        try {
            const result = await this.kdao_servis.obrisiPristup(korime);
            if (result) {
                odgovor.status(200).json({ poruka: "Pristup obrisan" });
            }
            else {
                odgovor.status(400).json({ poruka: "Pristup nije obrisan" });
            }
        }
        catch (error) {
            console.error("Greška prilikom brisanja pristupa:", error);
            odgovor.status(400).json({ greska: "Greška prilikom brisanja pristupa" });
        }
    }
    async ukljuciAuth(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        const imaKljuc = await this.kdao.provjeriAuth(korime);
        const aktivanTOTP = await this.kdao.aktivanAuth(korime);
        if (imaKljuc == false) {
            try {
                var totpKljuc = kreirajTajniKljuc(korime);
                console.log("Generirani tajni TOTP ključ za: " + korime + " " + totpKljuc);
                const result = await this.kdao.ukljuciAuth(korime, totpKljuc);
                if (result) {
                    odgovor.status(200).json({ poruka: "Auth uključen", tajniKod: totpKljuc });
                }
                else {
                    odgovor.status(400).json({ poruka: "Auth nije uključen" });
                }
            }
            catch (error) {
                console.error("Greška prilikom uključivanja auth:", error);
                odgovor.status(400).json({ greska: "Greška prilikom uključivanja auth" });
            }
        }
        else if (aktivanTOTP) {
            console.log("Auth već uključen za " + korime + " tajni ključ:" + imaKljuc);
            odgovor.status(200).json({ poruka: "Auth već uključen", tajniKod: imaKljuc });
        }
        else {
            const result = await this.kdao.ukljuciAuth(korime, imaKljuc);
            console.log("Auth ponovno aktivan za " + korime + " tajni ključ:" + imaKljuc);
            odgovor.status(200).json({ poruka: "Auth ponovno aktivan", tajniKod: imaKljuc });
        }
    }
    async iskljuciAuth(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        //console.log("korime iz iskljuciAuth:", korime);
        try {
            const result = await this.kdao.iskljuciAuth(korime);
            if (result) {
                odgovor.status(200).json({ iskljucen: true });
            }
            else {
                odgovor.status(400).json({ iskljucen: false });
            }
        }
        catch (error) {
            console.error("Greška prilikom isključivanja auth:", error);
            odgovor.status(400).json({ greska: "Greška prilikom isključivanja auth" });
        }
    }
    async aktivanAuth(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params["korime"];
        try {
            const result = await this.kdao.aktivanAuth(korime);
            if (result) {
                odgovor.status(200).json({ aktivan: true });
            }
            else {
                odgovor.status(400).json({ aktivan: false });
            }
        }
        catch (error) {
            console.error("Greška prilikom provjere auth:", error);
            odgovor.status(400).json({ greska: "Greška prilikom provjere auth" });
        }
    }
    async provjeriTOTP(zahtjev, odgovor) {
        odgovor.type("application/json");
        let korime = zahtjev.params["korime"];
        let totp = zahtjev.body.totp;
        if (korime == undefined || totp == undefined) {
            odgovor.status(400).json({ greska: "Krivi podaci!" });
            return;
        }
        try {
            let ispravan = await this.kdao.provjeriTOTP(korime, totp);
            if (ispravan) {
                odgovor.status(200).json({ uspjeh: true });
            }
            else {
                odgovor.status(400).json({ greska: "Neispravan TOTP!" });
            }
        }
        catch (error) {
            console.error("Greška prilikom provjere TOTP:", error);
            odgovor.status(400).json({ greska: "Greška prilikom provjere TOTP" });
        }
    }
}
