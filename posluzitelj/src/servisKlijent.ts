import * as kodovi from "./zajednicko/kodovi.js";
import { Ikorisnik } from "./Inteface.js";

export class ServisKlijent {
  private portRest: number;
  private jwtToken: string;

  constructor(portRest: number, jwtToken: string) {
    this.portRest = portRest;
    this.jwtToken = jwtToken;
  }

  async dodajKorisnika(korisnik: Ikorisnik): Promise<boolean> {
    let tijelo: Ikorisnik = {
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      adresa: korisnik.adresa,
      datum_rodjenja: korisnik.datum_rodjenja,
      spol: korisnik.spol,
      korime: korisnik.korime,
      lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "sol"),
      email: korisnik.email,
      tip_korisnika_id: korisnik.tip_korisnika_id,
      tajniTOTP: korisnik.tajniTOTP,
      aktivacijski_kod: korisnik.aktivacijski_kod,
      aktivan: korisnik.aktivan,
    };

    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "POST",
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
    };
    let odgovor = await fetch(
      "http://localhost:" + this.portRest + "/servis/korisnici",
      parametri
    );
    if (odgovor.status == 200) {
      console.log("Korisnik ubačen na servisu");
      return true;
    } else {
      console.log(odgovor.status);
      //console.log(await odgovor.text());
      return false;
    }
  }

  async prijaviKorisnika(korime: string, lozinka: string): Promise<Ikorisnik | false> {
    lozinka = kodovi.kreirajSHA256(lozinka, "sol");
    let tijelo = {
      lozinka: lozinka,
    };

    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    //console.log("JWT token: " + this.jwtToken);
    let parametri = {
      method: "POST",
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
    };
    let odgovor = await fetch("http://localhost:" +this.portRest + "/servis/korisnici/" + korime +"/prijava",parametri);

    if (odgovor.status == 200) {
      let korisnik = JSON.parse(await odgovor.text()) as Ikorisnik;
      if (korisnik.tajniTOTP == null) {
        korisnik.tajniTOTP = "";
      }
      return korisnik;
    } else {
      return false;
    }
  }

  async provjeriPristup(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/pristup",
      parametri
    );
    if (odgovor.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  async ukljuciAuth(korime: string): Promise<string | boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      `http://localhost:${this.portRest}/servis/korisnici/${korime}/ukljuciAuth`,
      parametri
    );
    let rezultat = await odgovor.json();
    if (odgovor.status == 200) {
      return rezultat.tajniKod;
    } else {
      return false;
    }
  }

  async iskljuciAuth(korime: string) {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/iskljuciAuth",
      parametri
    );
    let rezultat = await odgovor.json();
    //console.log(rezultat);
    if (rezultat.iskljucen) {
      return true;
    } else {
      return false;
    }
  }

  async aktivanAuth(korime: string) {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);
    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };
    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/aktivanAuth",
      parametri
    );
    let rezultat = await odgovor.json();
    //console.log(rezultat);
    if (rezultat.aktivan) {
      return true;
    } else {
      return false;
    }
  }

  async recaptcha(token: string) {
    try {
        let parametri = { method: "POST" };
        const kljuc = '6LffBa8qAAAAALuESCjWiRNi-L1MAnezdXpEtJ2e';
        const o = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${kljuc}&response=${token}`, {
            method: 'POST'
        });
        let recaptchaStatus = JSON.parse(await o.text());
        console.log(recaptchaStatus);
        if (recaptchaStatus.success && recaptchaStatus.score > 0.5) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Greška prilikom validacije reCAPTCHA:", error);
        return false;
    }
}

  async dodajZahtjev(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "POST",
      body: JSON.stringify({ korime: korime }),
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/zahtjev",
      parametri
    );
    console.log("Odgovor iz servisKlijent: " + odgovor);
    if (odgovor.status == 201) {
      return true;
    } else {
      console.log(`Response text: ${await odgovor.text()}`);
      return false;
    }
  }

  async dohvatiZahtjev(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/zahtjev",
      parametri
    );
    if (odgovor.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  async potvrdiZahtjev(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/potvrdiZahtjev",
      parametri
    );
    if (odgovor.status == 201) {
      return true;
    } else {
      return false;
    }
  }

  async odbijZahtjev(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/odbijZahtjev",
      parametri
    );
    if (odgovor.status == 201) {
      return true;
    } else {
      return false;
    }
  }

  async obrisiKorisnika(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "DELETE",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" + this.portRest + "/servis/korisnici/" + korime,
      parametri
    );

    if ((await odgovor.json()).obrisan) {
      return true;
    } else {
      return false;
    }
  }

  async obrisiPristup(korime: string): Promise<boolean> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "DELETE",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" +
        this.portRest +
        "/servis/korisnici/" +
        korime +
        "/izbrisiPristup",
      parametri
    );

    if (odgovor.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  async dohvatiKorisnika(korime: string): Promise<Ikorisnik | null> {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" + this.portRest + "/servis/korisnici/" + korime,
      parametri
    );
    if (odgovor.status == 200) {
      return JSON.parse(await odgovor.text());
    } else {
      return null;
    }
  }

  async azurirajKorisnika(korisnik: Ikorisnik): Promise<boolean> {
    let tijelo = {
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      adresa: korisnik.adresa,
      datum_rodjenja: korisnik.datum_rodjenja,
      spol: korisnik.spol,
      korime: korisnik.korime,
      lozinka: korisnik.lozinka,
      email: korisnik.email,
      tip_korisnika_id: korisnik.tip_korisnika_id,
    };

    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);
    //console.log("JWT token iz azurirajKorisnika servisKlijent: " + this.jwtToken);

    let parametri = {
      method: "PUT",
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      `http://localhost:${this.portRest}/servis/korisnici/${korisnik.korime}`,
      parametri
    );

    if (odgovor.status == 200) {
      return true;
    } else {
      return false;
    }
  }

  async dohvatiKorisnike() {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" + this.portRest + "/servis/korisnici",
      parametri
    );
    if (odgovor.status == 200) {
      return JSON.parse(await odgovor.text());
    } else {
      return null;
    }
  }

  async dohvatiZahtjeve() {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "GET",
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      "http://localhost:" + this.portRest + "/servis/korisnici/zahtjev",
      parametri
    );
    if (odgovor.status == 200) {
      return JSON.parse(await odgovor.text());
    } else {
      return null;
    }
  }

  async provjeriTOTP(korime: string, totp: string): Promise<boolean> {
    let tijelo = { totp: totp };
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    zaglavlje.set("Authorization", `Bearer ${this.jwtToken}`);

    let parametri = {
      method: "POST",
      body: JSON.stringify(tijelo),
      headers: zaglavlje,
    };

    let odgovor = await fetch(
      `http://localhost:${this.portRest}/servis/korisnici/${korime}/provjeriTOTP`,
      parametri
    );
    if (odgovor.status == 200) {
      return true;
    } else {
      return false;
    }
  }
}
