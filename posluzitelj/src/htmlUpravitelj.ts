import { __dirname } from "./zajednicko/esm_pomocnik.js";
import ds from "fs/promises";
import { ServisKlijent } from "./servisKlijent.js";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Ikorisnik } from "./Inteface.js";

export interface RWASession extends Session {
  korisnik: any;
  korime: string;
  adresa: string;
  spol: string;
  datum_rodjenja: string;
  tip_korisnika_id: number;
  email: string;
  jwt: string;
  tajniTOTP: string;
}

export class HtmlUpravitelj {
  private tajniKljucJWT: string;
  private trajanjeJWT: number;
  private servisKlijent!: ServisKlijent;
  private portRest: number;

  constructor(tajniKljucJWT: string, trajanjeJWT: number, portRest: number) {
    this.tajniKljucJWT = tajniKljucJWT;
    this.trajanjeJWT = trajanjeJWT;
    this.portRest = portRest;
    }

    private initServisKlijent(zahtjev: Request) {
      let sesija = zahtjev.session as RWASession;
      let token = sesija.jwt || "";
     // console.log("Token htmlUpravitelj: " + token);
      this.servisKlijent = new ServisKlijent(this.portRest, token);
    }

  async registracija(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let greska = "";
    if (zahtjev.method == "POST") {
      
      let uspjeh = await this.servisKlijent.dodajKorisnika(zahtjev.body);
      if (uspjeh) {
        odgovor.status(200).json({ uspjeh: true });
        return;
      } else {
        odgovor.status(400).json({ greska: "Greška prilikom registracije." });
      }
    }
    else{
      odgovor.status(405).json({ greska: "Metoda nije dopuštena." });
    }
  }

  async korisnici(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    

    let korisnici = await this.servisKlijent.dohvatiKorisnike() as Array<Ikorisnik>;
    try {
      if(korisnici){
        odgovor.status(200).json(korisnici);
      }
      else{
        odgovor.status(400).json({ greska: "Greška prilikom dohvaćanja korisnika." });
      } 
    } catch (greska) {
      odgovor.status(400).json({ greska: "Greška prilikom dohvata" + greska });
      console.log("Greška prilikom dohvaćanja korisnika: " + greska);
    }
  }

  async provjeriPrijavu(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let sesija = zahtjev.session as RWASession;
    //console.log("sesija: " + sesija.korime + );
    if (sesija.korime) {
        odgovor.json({ prijavljen: true, korisnik: sesija.korisnik, korime: sesija.korime, adresa: sesija.adresa, spol: sesija.spol, datum_rodjenja: sesija.datum_rodjenja ,tip_korisnika_id: sesija.tip_korisnika_id, email: sesija.email, tajniTOTP: sesija.tajniTOTP });
    } else {
        odgovor.json({ prijavljen: false });
    }
}
  async provjeriPristup(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let sesija = zahtjev.session as RWASession;
    
    if (sesija.korime) {
        let pristup = await this.servisKlijent.provjeriPristup(sesija.korime);
        if (pristup) {
            odgovor.status(200).json({ pristup: true });
        } else {
            odgovor.status(401).json({ pristup: false });
        }
    } else {
        odgovor.status(401).json({ pristup: false });
    }
  }

  async zahtjevZaPristup(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    try {
      let korime = zahtjev.body.korisnicko as string;
      //console.log("ZAhtjev za pristup: " + korime);
      let dodan = await this.servisKlijent.dodajZahtjev(korime);
      //console.log("ZAhtjev za pristup dodan: " + dodan);
      if (dodan) {
          odgovor.status(201).json({ zahtjev: true });
      } else {
          odgovor.status(400).json({ zahtjev: false });
      }
    } catch (greska) {
      console.error("Error in zahtjevZaPristup:", greska);
      odgovor.status(400).json({ zahtjev: false, greska: "GReska" });
    }
  }

  async postojiZahtjev(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let sesija = zahtjev.session as RWASession;

    let upisan = await this.servisKlijent.dohvatiZahtjev(sesija.korime);
    if(upisan) odgovor.status(201).json({ upisan: true });      
    else odgovor.status(400).json({ upisan: false });
  }

  async postojiZahtjevKorime(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let upisan = await this.servisKlijent.dohvatiZahtjev(korime);
    if(upisan) odgovor.status(201).json({ upisan: true });      
    else odgovor.status(400).json({ upisan: false });
  }
  
  async potvrdiZahtjev(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let potvrdjen = await this.servisKlijent.potvrdiZahtjev(korime);
    if(potvrdjen) odgovor.status(200).json({ potvrdjen: true });      
    else odgovor.status(400).json({ potvrdjen: false });
  }

  async odbijZahtjev(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let odbijen = await this.servisKlijent.odbijZahtjev(korime);
    if(odbijen) odgovor.status(201).json({ odbijen: true });      
    else odgovor.status(400).json({ odbijen: false });
  }

  async obrisiKorisnika(zahtjev: Request, odgovor: Response){
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let odbijen = await this.servisKlijent.obrisiKorisnika(korime);
    //console.log("Obrisan htmlUpravitelj: " + odbijen);
    if(odbijen) odgovor.status(201).json({ obrisan: true });      
    else odgovor.status(400).json({ obrisan: false });
  }

  async obrisiPristup(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let izbrisan = await this.servisKlijent.obrisiPristup(korime);
    if(izbrisan) odgovor.status(201).json({ obrisan: true });      
    else odgovor.status(400).json({ obrisan: false });
  }

  async postojiPristup(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let pristup = await this.servisKlijent.provjeriPristup(korime);
    if(pristup) odgovor.status(200).json({ pristup: true });      
    else odgovor.status(400).json({ pristup: false });
  }

  async korisnik(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let korisnik = await this.servisKlijent.dohvatiKorisnika(korime);
    if (korisnik) {
      odgovor.status(200).json(korisnik);
    } else {
      odgovor.status(404).json({ greska: "Korisnik nije pronađen!" });
    }
  }

  async azurirajKorisnika(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let azuriran = await this.servisKlijent.azurirajKorisnika(zahtjev.body as Ikorisnik);
    if (azuriran) {
      odgovor.status(201).json({ azuriran: true });
    } else {
      odgovor.status(400).json({ azuriran: false });
    }
  }
  
  async odjava(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    let sesija = zahtjev.session as RWASession;
    sesija.korisnik = null;
    odgovor.status(200).json({ odjava: true });
    zahtjev.session.destroy((err : any)=>{console.log("Sesija uništena! Error (ako ima je):"+err)})
  }

  async prijava(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    
    if (zahtjev.method == "POST") {
      var korime = zahtjev.body.korime;
      var lozinka = zahtjev.body.lozinka;
      //console.log("korime " + korime + " lozinka " + lozinka);
      var korisnik = await this.servisKlijent.prijaviKorisnika(korime, lozinka);
      if (korisnik) {
        let sesija = zahtjev.session as RWASession;
        sesija.korisnik = korisnik.ime + " " + korisnik.prezime;
        sesija.korime = korisnik.korime;
        sesija.email = korisnik.email;
        sesija.adresa = korisnik.adresa;
        sesija.spol = korisnik.spol;
        sesija.datum_rodjenja = korisnik.datum_rodjenja;
        sesija.tip_korisnika_id = korisnik.tip_korisnika_id;
        sesija.tajniTOTP = korisnik.tajniTOTP;
        
        odgovor.status(200).json({ uspjeh: true, korisnik: korisnik });
      } else {
        odgovor.status(400).json({ uspjeh: false, message: "Neispravno korisničko ime ili lozinka." });
      }
    } else {
      odgovor.status(405).json({ uspjeh: false, message: "Metoda nije dopuštena." });
    }
}

  async prijavaTOTP(zahtjev: Request, odgovor: Response) {
    this.initServisKlijent(zahtjev);
    var korime = zahtjev.body.korime;
    var lozinka = zahtjev.body.lozinka;
    var korisnik = await this.servisKlijent.prijaviKorisnika(korime, lozinka);
    if(korisnik){
      
      odgovor.status(200).json({ uspjeh: true, korisnik: korisnik });
    }
    else{
      odgovor.status(400).json({ uspjeh: false});
    }
}

  async prijavaIspravanTOTP(zahtjev: Request, odgovor: Response){
    this.initServisKlijent(zahtjev);
    var korime = zahtjev.body.korime;
    var korisnik = await this.servisKlijent.dohvatiKorisnika(korime);
    if(korisnik){
      let sesija = zahtjev.session as RWASession;
        sesija.korisnik = korisnik.ime + " " + korisnik.prezime;
        sesija.korime = korisnik.korime;
        sesija.email = korisnik.email;
        sesija.adresa = korisnik.adresa;
        sesija.spol = korisnik.spol;
        sesija.datum_rodjenja = korisnik.datum_rodjenja;
        sesija.tip_korisnika_id = korisnik.tip_korisnika_id;
        sesija.tajniTOTP = korisnik.tajniTOTP;
      odgovor.status(200).json({ uspjeh: true, korisnik: korisnik });
    }
    else{
      odgovor.status(400).json({ uspjeh: false});
    }
  }



  async ukljuciAuth(zahtjev: Request, odgovor: Response){
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let korisnik = await this.servisKlijent.dohvatiKorisnika(korime);
    if(korisnik != null){
      let ukljucen = await this.servisKlijent.ukljuciAuth(korime);
      if(ukljucen != false)  {
        odgovor.status(201).json({ ukljucen: true, tajniKod: ukljucen });      
      }
      else {
        odgovor.status(400).json({ ukljucen: false });
      }
    }
    else{
      odgovor.status(404).json({ greska: "Korisnik nije pronađen u bazi!" });
    }
  }

  async iskljuciAuth(zahtjev: Request, odgovor: Response){
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let korisnik = await this.servisKlijent.dohvatiKorisnika(korime);
    if(korisnik != null){
      let iskljucen = await this.servisKlijent.iskljuciAuth(korime);
      if(iskljucen) {
        odgovor.status(201).json({ iskljucen: true });      
      }
      else {
        odgovor.status(400).json({ iskljucen: false });
      }
    }
    else{
      odgovor.status(404).json({ greska: "Korisnik nije pronađen u bazi!" });
    }
  }


  async aktivanAuth(zahtjev: Request, odgovor: Response){
    this.initServisKlijent(zahtjev);
    let korime = zahtjev.params["korime"] as string;
    let korisnik = await this.servisKlijent.dohvatiKorisnika(korime);
    if(korisnik != null){
      let aktivan = await this.servisKlijent.aktivanAuth(korime);
      if(aktivan) {
        odgovor.status(200).json({ aktivan: true , tajniKod: korisnik.tajniTOTP});      
      }
      else {
        odgovor.status(400).json({ aktivan: false });
      }
    }
    else{
      odgovor.status(404).json({ greska: "Korisnik nije pronađen u bazi!" });
    }
  }

  async recaptcha(zahtjev: Request, odgovor: Response) {
    try {
      let token = zahtjev.body.token;
      //console.log("Token iz htmlUpravitelj: " + token);
      let odgovorServisa = await this.servisKlijent.recaptcha(token);
      if (odgovorServisa) {
        odgovor.status(200).json({ uspjeh: true });
      } else {
        odgovor.status(400).json({ uspjeh: false });
      }
    } catch (greska) {
      odgovor.status(500).json({ uspjeh: false, greska: "Greška prilikom provjere reCAPTCHA." });
      console.error("Error in recaptcha:", greska);
    }
  }
}
