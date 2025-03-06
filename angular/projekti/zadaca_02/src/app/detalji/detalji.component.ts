import { Component } from '@angular/core';
import { FilmTmdbI, IOsoba } from '../sucelja/Inteface';
import { environment } from '../../environments/environment.js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalji',
  standalone: false,
  templateUrl: './detalji.component.html',
  styleUrls: ['./detalji.component.scss']
})
export class DetaljiComponent {
  
  osoba: IOsoba | undefined;
  osobaSlike : Array<string> = new Array<string>();
  prikazFilmovi : Array<FilmTmdbI> = new Array<FilmTmdbI>();
  dodatniFilmovi : Array<FilmTmdbI> = new Array<FilmTmdbI>();
  sviFilmovi: Array<FilmTmdbI> = new Array<FilmTmdbI>();
  trenutniOpis: string = "";
  trenutniFilm: FilmTmdbI | null = null;


  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit(){
    await this.provjeriPrijavu();
    this.route.params.subscribe(async params =>  {
      await this.dohvatiOsobu(params["id"]);
      await this.dohvatiSlike();
      await this.dohvatiFilmove();
    });
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
    const odgovor2 = await fetch(`${environment.restServis}/provjeriPristup`, {
      credentials: 'include' 
    });

    if (odgovor.ok) {
      const podaci = await odgovor.json();
      const podaci2 = await odgovor2.json();
      if (podaci.prijavljen && podaci2.pristup) {
        let navOsobe = document.getElementById('navOsobe') as HTMLAnchorElement;
        let navAuth = document.getElementById('navAuth') as HTMLAnchorElement;
        navOsobe.style.visibility = 'visible';
        navAuth.style.visibility = 'visible'; 
        let prijavaButton = document.getElementById('prijava') as HTMLButtonElement;
        prijavaButton.textContent = 'Odjava'; 
      }
      else{
        alert("Nemate pristup ovoj stranici!");
        this.router.navigate(['/']);
      }
    }
  }
  
  prikaziOpis(film: FilmTmdbI) {
    this.trenutniFilm = film;
  }

  sakrijOpis() {
    this.trenutniFilm = null;
  }

  async prebaciNaOsobe() {
    this.router.navigate(['/osobe']);
  }
  
  async dohvatiOsobu(id: number) {
    const odgovor = await fetch(`${environment.restServis}/api/tmdb/osoba/${id}`,{
      credentials: 'include' 
    });
    this.osoba = await odgovor.json();
  }


  async dohvatiSlike() {
    let odgovor = await fetch(`${environment.restServis}/api/tmdb/osoba/${this.osoba?.id}/slike`,{
      credentials: 'include' 
    });
    let podatci = await odgovor.json();
    this.osobaSlike = podatci;
  }

  async dohvatiFilmove() {
    let odgovor = await fetch(`${environment.restServis}/api/tmdb/osoba/${this.osoba?.id}/sviFilmovi`, {
      credentials: 'include' 
    });
    let podatci = await odgovor.json();
    this.sviFilmovi = podatci;
    this.prikazFilmovi = this.sviFilmovi.slice(0, 20);
  }


  ucitajJos() {
      if(this.prikazFilmovi.length < this.sviFilmovi.length) {
        this.prikazFilmovi = this.prikazFilmovi.concat(this.sviFilmovi.slice(this.prikazFilmovi.length, this.prikazFilmovi.length + 20));
      }
      else{
        alert("Nema više filmova za prikazati");
      }
    }
  }
