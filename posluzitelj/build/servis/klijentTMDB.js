export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async dohvatiFilm(id) {
        let resurs = "/movie/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async pretraziFilmovePoNazivu(trazi, stranica) {
        let resurs = "/search/movie";
        let parametri = { sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async obaviZahtjev(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=0c505b52daa65852e206d86a405d4ff6";
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        //console.log(zahtjev);
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
    async dohvatiOsobu(id) {
        let resurs = "/person/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        let osoba = JSON.parse(odgovor);
        const mapiranaOsoba = {
            id: osoba.id,
            ime: osoba.name.split(' ')[0] || '',
            prezime: osoba.name.split(' ')[1] || '',
            poznat_po: osoba.known_for_department,
            popularnost: osoba.popularity,
            profilna_slika: osoba.profile_path
        };
        return mapiranaOsoba;
    }
    async dohvatiOsobe(trazi, stranica) {
        let resurs = "/search/person";
        let parametri = { page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor).results;
    }
    async dohvatiFilmoveOsobe(id) {
        let resurs = "/person/" + id + "/movie_credits";
        let parametri = { page: 1 };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor).cast;
    }
    async dohvatiSlikeOsobe(id) {
        let resurs = "/person/" + id + "/images";
        let odgovor = await this.obaviZahtjev(resurs);
        let slike = new Array();
        for (let slika of JSON.parse(odgovor).profiles) {
            slike.push(slika.file_path);
        }
        return slike;
    }
}
