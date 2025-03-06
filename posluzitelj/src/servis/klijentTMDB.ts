import { FilmoviTmdbI, ZanrTmdbI, IOsoba, FilmTmdbI } from "../Inteface.js";


export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc:string;
    constructor(apiKljuc:string){
       this.apiKljuc = apiKljuc;
    }

    public async dohvatiFilm(id:number){
       let resurs = "/movie/"+id;
       let odgovor = await this.obaviZahtjev(resurs);
       return JSON.parse(odgovor) as FilmoviTmdbI;
    }

    public async pretraziFilmovePoNazivu(trazi:string,stranica:number){
       let resurs = "/search/movie";
       let parametri = {sort_by: "popularity.desc",
                        include_adult: false,
                        page: stranica,
                        query: trazi};

       let odgovor = await this.obaviZahtjev(resurs,parametri);
       return JSON.parse(odgovor) as FilmoviTmdbI;
    }

    private async obaviZahtjev(resurs:string,parametri:{[kljuc:string]:string|number|boolean}={}){
        let zahtjev = this.bazicniURL+resurs+"?api_key=0c505b52daa65852e206d86a405d4ff6";
        for(let p in parametri){
            zahtjev+="&"+p+"="+parametri[p];
        }
        //console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }

    public async dohvatiOsobu(id:number){
         let resurs = "/person/"+id;
         let odgovor = await this.obaviZahtjev(resurs);
         let osoba = JSON.parse(odgovor);
         const mapiranaOsoba: IOsoba = {
            id: osoba.id,
            ime: osoba.name.split(' ')[0] || '',
            prezime: osoba.name.split(' ')[1] || '',
            poznat_po: osoba.known_for_department,
            popularnost: osoba.popularity,
            profilna_slika: osoba.profile_path
            };
         return mapiranaOsoba;
    }

      public async dohvatiOsobe(trazi:string,stranica:number){
         let resurs = "/search/person";
         let parametri = {page: stranica,
                           query: trazi};
   
         let odgovor = await this.obaviZahtjev(resurs,parametri);
         return JSON.parse(odgovor).results as Array<IOsoba>;
      }
      
   public async dohvatiFilmoveOsobe(id : number){
      let resurs = "/person/"+id+"/movie_credits";
      let parametri = { page: 1 };
      let odgovor = await this.obaviZahtjev(resurs, parametri);
      return JSON.parse(odgovor).cast as Array<FilmTmdbI>;
   }

   public async dohvatiSlikeOsobe(id : number){
      let resurs = "/person/"+id+"/images";
      let odgovor = await this.obaviZahtjev(resurs);
      let slike = new Array<string>();
      for(let slika of JSON.parse(odgovor).profiles){
         slike.push(slika.file_path);
      }
      return slike;
   }
}
