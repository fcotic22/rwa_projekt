import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Ikorisnik } from '../sucelja/Inteface';

@Component({
  selector: 'app-korisnici',
  standalone: false,
  
  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss'
})
export class KorisniciComponent {

  korisnici = new Array<Ikorisnik>();
  zahtjevi: {[korime: string]: boolean} = {};
  pristupi: {[korime: string]: boolean} = {};

  constructor(private router : Router) {}
  


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.provjeriPrijavu();
    this.dohvatiKorisnike();
  }

  prebaciNaPocetnu() {
    fetch(`${environment.restServis}/odjava`, {
      method: 'GET',
      credentials: 'include'
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  async provjeriPrijavu() {
    
    const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
      credentials: 'include' 
    });

    if (odgovor.ok) {
      const podaci = await odgovor.json();
      if (podaci.prijavljen && podaci.korime == 'admin') {
        let navKorisnici = document.getElementById('navKorisnici') as HTMLAnchorElement;
        navKorisnici.style.visibility = 'visible';
        let prijavaButton = document.getElementById('prijava') as HTMLButtonElement;
        prijavaButton.textContent = 'Odjava'; 
      }
      else{
        alert("Nemate pristup ovoj stranici!");
        this.router.navigate(['/']);
      }
    }
  }

  async dohvatiKorisnike() {
    const odgovor = await fetch(`${environment.restServis}/korisnici`, {
      credentials: 'include'
    });
    if (odgovor.ok) {
      this.korisnici = await odgovor.json();
      for(let korisnik in this.korisnici){
        this.zahtjevi[this.korisnici[korisnik].korime] = await this.postojiZahtjev(this.korisnici[korisnik].korime);
        this.pristupi[this.korisnici[korisnik].korime] = await this.postojiPristup(this.korisnici[korisnik].korime);
      }
    }
  }

    async obrisi(korime : string){
      let odgovor = await fetch(`${environment.restServis}/obrisiKorisnika/`+korime,{
        credentials: 'include' 
      });
      let korisnik = await odgovor.json();
      //console.log(odgovor);
      //console.log(odgovor.status + " status");
      //console.log(korisnik.obrisan + " obrisan");
      if(korisnik.obrisan){
        alert("Uspjesno obrisan korisnik: " + korime);
        this.dohvatiKorisnike();
      }
      else{
        alert("Greška prilikom brisanja korisnika!");
      }
    }

    async potvrdi(korime : string){
        let odgovor = await fetch(`${environment.restServis}/potvrdiZahtjev/`+korime, {
          credentials: 'include' 
        });
        let korisnik = await odgovor.json();
      if(korisnik.potvrdjen){
        alert("Uspjesno potvrđen pristup za korisnika: " + korime);
        this.dohvatiKorisnike();
      }
      else{
        alert("Greška prilikom prihvaćanja zahtjeva!");
      }
    }

    async odbij(korime : string){
      let odgovor = await fetch(`${environment.restServis}/odbijZahtjev/`+korime, {
        credentials: 'include' 
      });
      let korisnik = await odgovor.json();
      if(korisnik.odbijen){
        alert("Uspjesno odbijen zahtjev za pristup za korisnika: " + korime);
        this.dohvatiKorisnike();
      }
      else{
        alert("Greška prilikom odbijanja zahtjeva!");
      }
    }

    async izbrisiPristup(korime : string){
      let odgovor = await fetch(`${environment.restServis}/obrisiPristup/`+korime, {
        credentials: 'include' 
      });
      let korisnik = await odgovor.json();
      if(korisnik.obrisan){
        alert("Uspjesno obrisan pristup za korisnika: " + korime);
        this.dohvatiKorisnike();
      }
      else{
        alert("Greška prilikom brisanja pristupa!");
      }
    }

    async postojiZahtjev(korime : string){
      const odgovor = await fetch(`${environment.restServis}/postojiZahtjev/`+korime, {
        credentials: 'include'
      });
      const korisnik = await odgovor.json();
      //console.log(korisnik.upisan + " zathjev upisan je li?");
      return korisnik.upisan;
    }

    async postojiPristup(korime : string){
      const odgovor = await fetch(`${environment.restServis}/postojiPristup/`+korime, {
        credentials: 'include'
      });
      const korisnik = await odgovor.json();
     // console.log(korisnik.pristup + "pristup je li?");
      return korisnik.pristup;
    }
}
