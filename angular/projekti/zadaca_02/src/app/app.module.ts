import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { OsobeComponent } from './osobe/osobe.component';
import { DetaljiComponent } from './detalji/detalji.component';
import { IMAGE_CONFIG } from '@angular/common';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';

import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { FiltrirajFilmoveComponent } from './filtriraj-filmove/filtriraj-filmove.component';
import { DvorazinskaAuthComponent } from './dvorazinska-auth/dvorazinska-auth.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: PocetnaComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'korisnici', component: KorisniciComponent },
  { path: 'osobe', component: OsobeComponent },
  { path: 'detalji/:id', component: DetaljiComponent },
  { path: 'dodavanje', component: DodavanjeComponent },
  { path: 'filmovi', component: FiltrirajFilmoveComponent },
  { path: 'dvorazinska-auth', component: DvorazinskaAuthComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    RegistracijaComponent,
    DokumentacijaComponent,
    PocetnaComponent,
    KorisniciComponent,
    OsobeComponent,
    DetaljiComponent,
    DodavanjeComponent,
    FiltrirajFilmoveComponent,
    DvorazinskaAuthComponent,
  ],
  imports: [BrowserModule, FormsModule, RecaptchaV3Module, RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
