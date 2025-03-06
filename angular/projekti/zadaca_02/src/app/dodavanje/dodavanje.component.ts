import { Component } from '@angular/core';
import { IOsoba, FilmTmdbI} from '../sucelja/Inteface.js';
import {environment} from '../../environments/environment.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dodavanje',
  standalone: false,
  
  templateUrl: './dodavanje.component.html',
  styleUrl: './dodavanje.component.scss',
})
export class DodavanjeComponent {
  
  ime: string = '';
  nadjeneOsobe: Array<IOsoba> = new Array<IOsoba>();
  prviPut : boolean = false;
  filmovi: Array<FilmTmdbI> = new Array<FilmTmdbI>();

  constructor(private router : Router) {}

  ngOnInit() {
    this.provjeriPrijavu();
  }

  prebaciNaPrijavu() {
    fetch(`${environment.restServis}/odjava`, {
      method: 'GET',
      credentials: 'include'
    }).then(() => {
      this.router.navigate(['/prijava']);
    });
  }

  async provjeriPrijavu() {
    
    const odgovor = await fetch(`${environment.restServis}/provjeriPrijavu`, {
      credentials: 'include' 
    });

    if (odgovor.ok) {
      const podaci = await odgovor.json();
      if (podaci.prijavljen && podaci.korime == 'admin') {
        let prijavaButton = document.getElementById('prijava') as HTMLButtonElement;
        prijavaButton.textContent = 'Odjava'; 
      }
      else{
        alert("Nemate pristup ovoj stranici!");
        this.router.navigate(['/']);
      }
    }
  }

  async trazi(ime: string){
    
    let odgovor = await fetch(environment.restServis + '/api/tmdb/osobe?trazi=' + ime + '&stranica=1', {
      credentials: 'include' 
    });
    let podaci = await odgovor.json();
    
    this.nadjeneOsobe = podaci.map((osoba: any) => ({
          id: osoba.id,
          ime: osoba.name.substring(0, osoba.name.indexOf(' ')),
          prezime: osoba.name.substring(osoba.name.indexOf(' ') + 1),
          poznat_po: osoba.known_for_department,
          popularnost: osoba.popularity,
          profilna_slika: osoba.profile_path
     })); 

     setTimeout(async () => { 
       for (const osoba of this.nadjeneOsobe) {
        let dodajGumb = document.getElementById('dodaj_' + osoba.id);
        let obrisiGumb = document.getElementById('obrisi_' + osoba.id);
        if (await this.postoji(osoba) == true) {
          dodajGumb?.setAttribute('disabled', 'true');
          dodajGumb?.classList.add('disabledGumb');
          obrisiGumb?.removeAttribute('disabled');
          obrisiGumb?.classList.remove('disabledGumb');
        } else {
          dodajGumb?.removeAttribute('disabled');
          dodajGumb?.classList.remove('disabledGumb');
          obrisiGumb?.setAttribute('disabled', 'true');
          obrisiGumb?.classList.add('disabledGumb');
        }
       }
     }, 0);
     this.prviPut = true;
  }

  async postoji(osoba: IOsoba) : Promise<boolean>{
    let odgovor = await fetch(environment.restServis + '/osoba/' + osoba.id, {
      credentials: 'include' 
    });
    let postoji = await odgovor.json();
    //console.log(postoji);
    if(postoji.length > 0){  
      return true;
    }
    else{
      return false;
    }
  }

  async dodaj(osoba: IOsoba){
    let osobaPostoji = await this.postoji(osoba);
    if(osobaPostoji){
      alert('Osoba već postoji');
      return;
    }
     
    let odgovor = await fetch(`${environment.restServis}/api/tmdb/osoba/${osoba.id}/filmovi`, {
      credentials: 'include' 
    });
    let podatci = await odgovor.json();
    this.filmovi = podatci;
    
      for(const film of this.filmovi){
        //console.log(film);
        try {
          let odgovor = await fetch(environment.restServis + '/film', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(film), 
            credentials: 'include' 
            
          });
          let filmOdgovor = await odgovor.json();
          console.log(filmOdgovor);
        } catch (greska) {
          console.log("Greška prilikom dodavanja ovog filma: "+ film);
        }  
      }
  
      let odgovor3 = await fetch(environment.restServis + '/api/tmdb/osobe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(osoba),
        credentials: 'include' 
      });
      let osobaOdgovor = await odgovor3.json();
      
      if(osobaOdgovor.dodana){
        this.ime = '';
        this.nadjeneOsobe = [];
        this.prviPut = false; 
        alert('Osoba je uspješno dodana');
      }
      else{
        alert('Greška prilikom dodavanja osobe');
      }

      let odgovor2 = await fetch(`${environment.restServis}/osoba/${osoba.id}/film`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.filmovi),
        credentials: 'include' 
      });
      let ulogaOdgovor = await odgovor2.json();
      
      if(ulogaOdgovor.status == "uspjeh"){
        alert('Filmovi su uspješno dodani osobi');
      }
      else{
        alert('Greška prilikom dodavanja filmova osobi');           
      }
  }

  async obrisi(id: number){
    
    let odgovor = await fetch(environment.restServis + '/osoba/' + id + '/film', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    let obrisani = await odgovor.json();

    if(obrisani.status == "uspjeh"){
      alert('Filmovi su uspješno obrisani');
    }
    else{
      alert('Greška prilikom brisanja filmova');
    }

    let odgovor2 = await fetch(environment.restServis + '/osoba/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    let osoba = await odgovor2.json();
    
    if(osoba.obrisana){
      this.ime = '';
      this.nadjeneOsobe = [];
      this.prviPut = false;
      alert('Osoba je uspješno obrisana');
    }
    else{
      alert('Greška prilikom brisanja osobe');
    }
  }
}
