import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dvorazinska-auth',
  standalone: false,
  templateUrl: './dvorazinska-auth.component.html',
  styleUrl: './dvorazinska-auth.component.scss'
})
export class DvorazinskaAuthComponent {

    podaci: any;
    ukljucena! : boolean;
    tajniKod: string = '';

    constructor(private router: Router) { }

    async ngOnInit() {
      await this.provjeriPrijavu();
      await this.provjeriAktivnostAuth();
    }

    prebaciNaPrijavu() {
      this.router.navigate(['/prijava']);
    }
  
    async provjeriPrijavu() {
      const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
        credentials: 'include' 
      });
      const odgovor2 = await fetch(`${environment.restServis}/provjeriPristup`, {
        credentials: 'include' 
      });
  
      if (odgovor.ok) {
        const podaci = await odgovor.json();
        const podaci2 = await odgovor2.json();
        this.podaci = podaci;
        if (podaci.prijavljen && podaci2.pristup) {
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
        else{
          alert("Nemate pristup ovoj stranici!");
          this.router.navigate(['/']);
        }
      }
    }

    async provjeriAktivnostAuth(){
      let odgovor = await fetch(`${environment.restServis}/aktivanAuth/${this.podaci.korime}`,{
        credentials: 'include' 
      });
      let rezultat = await odgovor.json();
      console.log(rezultat);
      if(rezultat.aktivan){
        this.ukljucena = true;
        this.tajniKod = rezultat.tajniKod;
      }
      else{
        this.ukljucena = false;
      }
    }

    async ukljuciAuth(){
      let odgovor = await fetch(`${environment.restServis}/ukljuciAuth/${this.podaci.korime}`,{
        credentials: 'include' 
      });

      let rezultat = await odgovor.json();
      if(rezultat.ukljucen){
        this.ukljucena = true;
        this.tajniKod = rezultat.tajniKod;
      }
      else{
        alert("Greska pri ukljucivanju 2FA!");
      }
  }

    async iskljuciAuth(){
      let odgovor = await fetch(`${environment.restServis}/iskljuciAuth/${this.podaci.korime}`,{
        credentials: 'include' 
      });
      console.log(odgovor);
      let rezultat = await odgovor.json();
      console.log(rezultat);
      if(rezultat.iskljucen) {
        this.ukljucena = false;
        this.tajniKod = '';
      }
      else{
        alert("Greska pri iskljucivanju 2FA!");
      }
    }
}
