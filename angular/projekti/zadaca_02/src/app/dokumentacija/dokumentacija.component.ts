import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dokumentacija',
  standalone: false,
  
  templateUrl: './dokumentacija.component.html',
  styleUrl: './dokumentacija.component.scss'
})
export class DokumentacijaComponent {

  putanja = environment.restServis + '/dokumentacija/slike/';
  
  constructor(private router: Router) {
  }


  prebaciNaPrijavu() {
    this.router.navigate(['/prijava']);
  }

  ngOnInit() {
    this.provjeriPrijavu();
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
      }
    }
  }
}
