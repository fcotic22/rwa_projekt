import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-prijava',
  standalone : false,
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})
export class PrijavaComponent {

  constructor(private router: Router, private recaptchaV3Service: ReCaptchaV3Service) {}

  ngOnInit(): void {
    this.provjeriPrijavu();
    const form = document.querySelector("form") as HTMLFormElement;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const korimeInput = document.getElementById("korime") as HTMLInputElement;
      let aktivan2fa = await this.provjeriAuth(korimeInput.value);
      if (aktivan2fa) {
        this.posaljiTOTP();
      } else {
        this.posaljiPrijavu();
      }
    });
  }

  ukljucen = false;
  totp = '';
  korime = '';  

  async provjeriAuth(korime: string){

    let odgovor2 = await fetch(`${environment.restServis}/aktivanAuth/${korime}`,{
      credentials: 'include' 
    });
    let rezultat2 = await odgovor2.json();
    console.log(rezultat2);
    return rezultat2.aktivan;
  }

  async provjeriPrijavu() {
    
    const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
      credentials: 'include' 
    });
    if (odgovor.ok) {
      const podaci = await odgovor.json();
      if (podaci.prijavljen) {
        let navOsobe = document.getElementById('navOsobe') as HTMLAnchorElement;
        let navAuth = document.getElementById('navAuth') as HTMLAnchorElement;
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible';   
      }
    }
  }

  async provjeriRecaptchu(){
    this.recaptchaV3Service.execute('prijava')
        .subscribe(async (token: string) => {
          //console.log("Token: " + token);
         try {
          let odgovor = await fetch(environment.restServis + "/recaptcha", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token }),
            credentials: 'include',
          });
          let rezultat = await odgovor.json();
          if(rezultat.uspjeh){
            console.log("ReCaptcha uspjesno validirana");
          }
          else{
            console.log("ReCaptcha nije validna");
            alert("ReCaptcha nije validna");
            //this.odjaviKorisnika();
          }
         } catch (error) {
          console.log("Greška prilikom validacije ReCaptcha : " + error);
          alert("Greška prilikom validacije ReCaptcha - konzola");
         } 
        });
  }
  

  async posaljiPrijavu() {
    const korimeInput = document.getElementById("korime") as HTMLInputElement;
    const lozinkaInput = document.getElementById("lozinka") as HTMLInputElement;

    let validanZahtjev = true;
    let greska = "";

    if (korimeInput.value.trim() == "") {
      validanZahtjev = false;
      greska += "Korisničko ime je obavezno.\n";
    }

    if (lozinkaInput.value.trim() == "") {
      validanZahtjev = false;
      greska += "Lozinka je obavezna.\n";
    }

    if (!validanZahtjev) {
      alert(greska);
    } else {
      await this.provjeriRecaptchu();
      try {
        const odgovor = await fetch(environment.restServis + "/prijava", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            korime: korimeInput.value,
            lozinka: lozinkaInput.value
          }),
          credentials: 'include'
        });

        if (odgovor.status === 200) {
          const podaci = await odgovor.json();
          if (podaci.uspjeh) {
            this.router.navigate(['/']);
          }
        } else {
          alert("Neispravno korisničko ime ili lozinka.");
        }
      } catch (error) {
        console.log("Greška" + error);
        alert("Greška prilikom prijave.");
      }
    }
  }

  async posaljiTOTP() {
    const korimeInput = document.getElementById("korime") as HTMLInputElement;
    const lozinkaInput = document.getElementById("lozinka") as HTMLInputElement;

    let validanZahtjev = true;
    let greska = "";

    if (korimeInput.value.trim() == "") {
      validanZahtjev = false;
      greska += "Korisničko ime je obavezno.\n";
    }

    if (lozinkaInput.value.trim() == "") {
      validanZahtjev = false;
      greska += "Lozinka je obavezna.\n";
    }

    if (!validanZahtjev) {
      alert(greska);
    } else {
      await this.provjeriRecaptchu();
      let odgovor = await fetch(environment.restServis + "/prijavaTOTP", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          korime: korimeInput.value,
          lozinka: lozinkaInput.value
        }),
        credentials: 'include'
      });
      let rezultat = await odgovor.json();
      console.log(rezultat);
      if (rezultat.uspjeh) {
        this.korime = rezultat.korisnik.korime;
        this.totp = rezultat.korisnik.tajniTOTP;
        this.ukljucen = true;

        this.potvrdiTOTP();
      } else {
        alert("Neispravno korisničko ime ili lozinka.");
        return;
      }
    }
  }

  async potvrdiTOTP() {
    const totp = document.getElementById("totp") as HTMLInputElement;
        
        if(totp &&this.ukljucen  && totp.value.trim() != ""){ 
          try {
              const odgovor = await fetch(environment.restServis + `/korisnici/${this.korime}/provjeriTOTP`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      totp: totp.value.trim()
                  }),
                  credentials: 'include'
              });
              console.log(odgovor);
              if (odgovor.status == 200) {
                  let odgovor = await fetch(environment.restServis + "/prijavaIspravanTOTP", {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          korime: this.korime
                      }),
                      credentials: 'include'
                  });
                  
                  this.router.navigate(['/']);
                  
              } else {
                  let rez = await odgovor.json();
                  console.log(rez.greska);
                  alert("Neispravan TOTP.");
                  this.odjaviKorisnika();
              }
          } catch (greska) {
              console.log("Greška " + greska);
              alert("Greška prilikom provjere TOTP.");
          }
        }
  }

  odjaviKorisnika() {
    fetch(environment.restServis + "/odjava", {
      method: 'GET',
      credentials: 'include'
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  odustani() {
    this.odjaviKorisnika();
  }
}