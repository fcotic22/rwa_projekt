import { Component, OnInit } from '@angular/core';
import { FilmTmdbI } from '../sucelja/Inteface';
import { environment } from '../../environments/environment';
import { FilmBazaI } from '../../../../../../posluzitelj/src/Inteface';

@Component({
  selector: 'app-filtriraj-filmove',
  standalone: false,
  templateUrl: './filtriraj-filmove.component.html',
  styleUrls: ['./filtriraj-filmove.component.scss'],
})
export class FiltrirajFilmoveComponent {
  datumOd: string | null;
  datumDo: string | null;
  filmovi: Array<FilmBazaI>;

  stranica: number;

  constructor() {
    this.datumOd = null;
    this.datumDo = null;
    this.filmovi = [];
    this.stranica = 1;
  }

  async filtriraj() {
    console.log('Datum Od:', this.datumOd);
    console.log('Datum Do:', this.datumDo);

    const parsDatumOd = this.datumOd ? new Date(this.datumOd) : null;
    const parsDatumDo = this.datumDo ? new Date(this.datumDo) : null;

    if (parsDatumOd && parsDatumDo && parsDatumOd > parsDatumDo) {
      alert('Datum "od" mora biti manji od datuma "do".');
      return;
    }

    try {
      const datumOd_ms = parsDatumOd ? parsDatumOd.getTime() : '';
      const datumDo_ms = parsDatumDo ? parsDatumDo.getTime() : '';
      
      let odgovor = await fetch(`${environment.restServis}/film?stranica=${this.stranica}&datumOd=${datumOd_ms}&datumDo=${datumDo_ms}`, {      
        credentials: 'include' 
      });

      if (odgovor.status == 200) {
        this.filmovi = await odgovor.json();
        //console.log(this.filmovi);
      } else {
        alert('Greška prilikom dohvaćanja filmova.');
      }

      if (this.filmovi.length === 0) {
        alert('Nema filmova za zadani raspon datuma ili za tu stranicu.');
      }
    } catch (error) {
      console.error('Greška:', error);
      alert('Dogodila se greška prilikom filtriranja.');
    }
  }
}
