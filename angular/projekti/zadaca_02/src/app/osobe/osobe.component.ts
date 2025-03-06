import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IOsoba } from '../sucelja/Inteface';
import { environment } from '../../environments/environment.js';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-osobe',
  standalone: false,
  
  templateUrl: './osobe.component.html',
  styleUrl: './osobe.component.scss'
})
export class OsobeComponent {

  prikazaneOsobe : Array<IOsoba> = new Array<IOsoba>();
  osobe : Array<IOsoba> = new Array<IOsoba>();
  brojOsoba : Array<number> = [5,10,20,50];
  odabirStranice : number = 0;

  constructor(private router: Router) {}

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
        let btnDodaj = document.getElementById('btnDodavanje') as HTMLAnchorElement;
        if(podaci.prijavljen && podaci.korime=='admin') btnDodaj.style.visibility = 'visible';
        
        
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible';
      }
      else{
        alert("Nemate pristup ovoj stranici!");
        this.router.navigate(['/']);
      }
    }
  }

  ngOnInit(): void {
    this.provjeriPrijavu();
    this.ucitajOsobe();
  }
  
  prebaciNaPrijavu() {
    this.router.navigate(['/prijava']);
  }

  prebaciNaDetalje(id: number) {
    const selectedOsoba = this.osobe.find(osoba => osoba.id === id);
    if (selectedOsoba) {
      this.router.navigate([`/detalji/${id}`]);
    }
  }

  prebaciNaDodavanje(){
    this.router.navigate(['/dodavanje']);
  }

  zapisiOdabir(event : Event){  
    this.odabirStranice = parseInt((event.target as HTMLSelectElement).value);
    this.ucitajOsobe();
    //console.log(this.odabirStranice);
  }
  
  async ucitajOsobe(){
    let stranica = Math.ceil(this.odabirStranice / 20);

    if (stranica == 0) {
      var odgovor = await fetch(`${environment.restServis}/osobe?stranica=1`, {
        credentials: 'include' 
      });
      if (odgovor.ok) {
        let podaci = await odgovor.json();
        this.osobe = podaci;
      }
    } else {
      this.osobe = []; 
      for (let i = 1; i <= stranica; i++) {
        var odgovor = await fetch(`${environment.restServis}/osobe?stranica=${i}`,{
          credentials: 'include' 
        });
        if (odgovor.ok) {
          let podaci = await odgovor.json();
          this.osobe = this.osobe.concat(podaci);
        }
      }
    }
    
    if (this.odabirStranice != 0) {
      this.prikazaneOsobe = this.osobe.slice(0, this.odabirStranice);
    } else {
      this.prikazaneOsobe = this.osobe.slice(0, 10);
    }
  }

}
