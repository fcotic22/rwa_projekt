export interface Ikorisnik {
    ime : string;
    prezime : string;
    adresa : string;
    datum_rodjenja : string;
    spol: string
    korime : string;
    lozinka : string;
    email : string;
    tip_korisnika_id : number;
    tajniTOTP: string;
    aktivacijski_kod: number;
    aktivan: number;
}

export interface IOsoba{
    id: number;
    ime: string;
    prezime: string;
    poznat_po: string;
    popularnost: number;
    profilna_slika: string;
}
export interface ZanrTmdbI {
    id: number,
    name: string
  }
  
  export interface FilmoviTmdbI {
      page:number;
      results:Array<FilmTmdbI>;
      total_pages:number;
      total_results:number;
  }

  export interface FilmBazaI{
    id: number;
    naslov: string;
    originalni_naslov: string;
    jezik: string;
    popularnost: number;
    slika_postera: string;
    datum_izdavanja: string;
  }

  
  export interface FilmTmdbI {
    adult:boolean;
    backdrop_path:string;
    genre_ids:Array<number>;
    id:number;
    original_language:string;
    original_title:string;
    overview:string;
    character: string;    
    popularity:number;
    poster_path:string;
    release_date:string;
    title:string;
    video:boolean;
    vote_average:number;
    vote_count:number;
}
  
  export interface Zahtjev{
    korime: string;
  }