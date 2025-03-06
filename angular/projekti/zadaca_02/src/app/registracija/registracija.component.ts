import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Ikorisnik } from '../sucelja/Inteface.js';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registracija',
  standalone: false,
  
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})
export class RegistracijaComponent {

  constructor(private router: Router,private recaptchaV3Service: ReCaptchaV3Service) {}

  validan = true;

  ngOnInit() {
    this.provjeriPrijavu();
  }

  prebaciNaPrijavu() {
    this.router.navigate(['/prijava']);
  }

  async provjeriPrijavu() {
    
    const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
      credentials: 'include' 
    });

    if (odgovor.ok) {
      const podaci = await odgovor.json();
      if (podaci.prijavljen) {
        let prijavaButton = document.getElementById('prijava') as HTMLButtonElement;
        prijavaButton.textContent = 'Odjava'; 
        prijavaButton.addEventListener('click', async () => {
          fetch(`${environment.restServis}/odjava`, {
            method: 'GET',
            credentials: 'include'
          }).then(() => {
            this.router.navigate(['/']);
          });
        });
        let navOsobe = document.getElementById('navOsobe') as HTMLAnchorElement;
        let navAuth = document.getElementById('navAuth') as HTMLAnchorElement;
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible'; 
      }
    }
  }

  async provjeriRecaptchu() {
    this.recaptchaV3Service.execute('registracija')
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
            this.validan = false;
          }
         } catch (greska) {
          console.log("Greška prilikom validacije ReCaptcha : " + greska);
          alert("Greška prilikom validacije ReCaptcha - konzola");
          this.validan = false;
         } 
        });
  }



  async posaljiRegistraciju(event : Event) {
    event.preventDefault();
    let validanZahtjev = true;
    
    
    const ime = document.getElementById("ime") as HTMLInputElement
    const prezime = document.getElementById("prezime") as HTMLInputElement;
    const adresa = document.getElementById("adresa") as HTMLInputElement;
    const datum_rodjenja = document.getElementById("datum_rodjenja") as HTMLInputElement;
    const spol = document.getElementById("spol") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const korime = document.getElementById("korime") as HTMLInputElement;
    const lozinka = document.getElementById("lozinka") as HTMLInputElement;
   
    let greska = "";
        
        if(!this.validan)
        {
          greska += "ReCaptcha nije validna.\n";
          validanZahtjev = false;
        }

        if (!email.value) {
            greska += "Email je obavezan.\n";
            validanZahtjev = false;
        }

        if (!korime.value) {
            greska += "Korisničko ime je obavezno.\n";
            validanZahtjev = false;
        }

        if (!lozinka.value) {
            greska += "Lozinka je obavezna.\n";
            validanZahtjev = false;
        }

        if (!validanZahtjev) {
            alert(greska);
        }
        
        else{
          try {

            const korisnik : Ikorisnik = {
              ime : ime.value,
              prezime : prezime.value,
              adresa : adresa.value,
              datum_rodjenja : datum_rodjenja.value,
              spol : spol.value,
              korime : korime.value,
              lozinka : lozinka.value,
              email : email.value,
              tip_korisnika_id : 2,
              tajniTOTP : "",
              aktivacijski_kod : 0,
              aktivan : 0
            }

            const odgovor = await fetch( environment.restServis + "/registracija", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(korisnik)
            });
            if (odgovor.status == 200) {
              //alert("Uspješna registracija.");
              await this.provjeriRecaptchu();
              this.router.navigate(['/prijava']);
            } else {
              alert("Neuspješna registracija. Pokušajte ponovno.");
            }
          } catch (greska) {
            alert("Neuspješna registracija.");
            console.log(greska);
          }       
        }
  }
}
