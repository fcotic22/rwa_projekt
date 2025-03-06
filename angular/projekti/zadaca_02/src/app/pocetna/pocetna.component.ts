import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; 
import { KorisniciComponent } from '../korisnici/korisnici.component';
// importamo environment varijable - viditi je li treba promjeniti na prod

@Component({
  selector: 'app-pocetna',
  standalone: false,

  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.scss'],
})
export class PocetnaComponent {
  constructor(private router: Router) {}

  prebaciNaPrijavu() {
    this.router.navigate(['/prijava']);
  }

  ngOnInit(): void {
    this.ucitajPodatke();
  }

  async ucitajPodatke() {
    const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
      credentials: 'include' 
    });

    if (odgovor.ok) {
      const podaci = await odgovor.json();
      let prijavaButton = document.getElementById('prijava') as HTMLButtonElement;
      let podatciKorisnik = document.getElementById('podatciKorisnik') as HTMLDivElement;
      let pristupButton = document.getElementById('pristup') as HTMLButtonElement;
      let navKorisnici = document.getElementById('navKorisnici') as HTMLAnchorElement;
      let navDodavanje = document.getElementById('navDodavanje') as HTMLAnchorElement;
      let navOsobe = document.getElementById('navOsobe') as HTMLAnchorElement;
      let navAuth = document.getElementById('navAuth') as HTMLAnchorElement;

      pristupButton.style.visibility = 'hidden';
      navKorisnici.style.visibility = 'hidden';
      navDodavanje.style.visibility = 'hidden';
      navOsobe.style.visibility = 'hidden';
      navAuth.style.visibility = 'hidden';

      if (podaci.prijavljen && podaci.korime == 'admin') {
        navKorisnici.style.visibility = 'visible';
        navDodavanje.style.visibility = 'visible';
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible';
      }
      if (podaci.prijavljen) {
        
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible';
        prijavaButton.textContent = 'Odjava';
        podatciKorisnik.textContent = `Prijavljeni ste kao: ${podaci.korisnik} (${podaci.korime})`;
        podatciKorisnik.innerHTML += `<p style = "font-weight: bold"> Podatci profila </p>`;
        podatciKorisnik.innerHTML += `<p> Ime i prezime: ${podaci.korisnik} </p>`;
        podatciKorisnik.innerHTML += `<p> Adresa: ${podaci.adresa} </p>`;
        podatciKorisnik.innerHTML += `<p> Email: ${podaci.email} </p>`;
        podatciKorisnik.innerHTML += `<p> Datum rođenja: ${podaci.datum} </p>`;
        podatciKorisnik.innerHTML += `<p> Spol: ${podaci.spol} </p>`;

        const ima = await fetch(`${environment.restServis}/provjeriPristup`, {
          credentials: 'include' 
        });

        if (ima.ok) {
          podatciKorisnik.innerHTML += `<p> Pristup servisu: omogućen</p>`;
          pristupButton.style.visibility = 'hidden';
        } else {
          podatciKorisnik.innerHTML += `<p> Pristup servisu: onemogućen</p>`;
          pristupButton.style.visibility = 'visible';
          pristupButton.removeAttribute('disabled');
          pristupButton.addEventListener('click', () => this.slanjeZahtjeva(podaci.korime));
        }

        prijavaButton.addEventListener('click', () => {
          fetch(`${environment.restServis}/odjava`, {
            method: 'GET',
            credentials: 'include' 
          }).then(() => {
            this.router.navigate(['/']);
          });
        });
      } else {
        prijavaButton.textContent = 'Prijava';
        podatciKorisnik.textContent = 'Niste prijavljeni!';
        navOsobe.style.visibility = 'hidden';
        navAuth.style.visibility = 'hidden';
        
          this.router.navigate(['/prijava']);
        
      }
    } else {
      alert('Greška prilikom provjere prijave.');
    }
  }

  async slanjeZahtjeva(korime: string) {
    const poslao = await fetch(`${environment.restServis}/postojiZahtjev`, {
      credentials: 'include' 
    });
    const postoji = await poslao.json();
    let pristupButton = document.getElementById('pristup') as HTMLButtonElement;

    if (postoji.upisan == true) {
      alert('Već ste poslali zahtjev za pristup servisu!');
      pristupButton.textContent = 'Zahtjev za pristup servisu je poslan!';
      pristupButton.classList.add('disabledGumb');
      pristupButton.disabled = true;
      return;
    } else {
      
      const parametri = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' as RequestCredentials, 
        body: JSON.stringify({ korisnicko: korime })
      };

      pristupButton.classList.remove('disabledGumb');
      const odgovor = await fetch(`${environment.restServis}/zahtjevZaPristup`, parametri);
      const rezultat = await odgovor.json();
      //console.log(rezultat);
      //console.log(parametri);
      if (rezultat.zahtjev == true) {
        alert('Zahtjev za pristup servisu je poslan!');
        pristupButton.textContent = 'Zahtjev za pristup servisu je poslan!';
        pristupButton.classList.add('disabledGumb');
        pristupButton.disabled = true;
      } else {
        alert('Zahtjev za pristup servisu nije poslan!');
        pristupButton.removeAttribute('disabled');
        pristupButton.classList.remove('disabledGumb');
        pristupButton.textContent = 'Pokušajte ponovo!';
      }
    }
  }
}