import { FilmBazaI, FilmoviTmdbI, FilmTmdbI } from "../Inteface.js";
import Baza from "../zajednicko/baza.js";

export class FilmDAO {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024fcotic22_servis.sqlite");
    }

    async dohvatiFilm(filmId: number): Promise<FilmTmdbI> {
        const sql = 'SELECT * FROM film WHERE id = ?';
        const film = await this.baza.izvrsiUpitPromiseAll(sql, [filmId]) as FilmTmdbI;
        return film;
    }

    async dohvatiFilmoveStranica(stranica: number): Promise<FilmTmdbI[]> {
        const offset = (stranica - 1) * 20;
        const sql = `
            SELECT * FROM film 
            LIMIT 20 OFFSET ?
        `;
        
        const filmovi = await this.baza.izvrsiUpitPromiseAll(sql, [offset]) as FilmTmdbI[];
        //console.log(filmovi);
        return filmovi;
        
    }

    async dodajFilmoveOsobi(id_osoba: number, filmovi: Array<FilmTmdbI>) {
        const sqlInsert = "INSERT INTO uloga (id_osoba, id_film, uloga) VALUES (?, ?, ?)"
        for (const film of filmovi) {
            try {
                await this.baza.izvrsiUpitPromise(sqlInsert, [id_osoba, film.id, film.character]);
            } catch (greska) {
                    console.log("Greska prilikom dodavanja uloge: " + greska);
                    return false;
            }
        }  
        return true;
    }
    
    async dohvatiFilmoveOsobe(id_osoba : number, stranica : number) {
        let offset : number;
        stranica == 0 ? offset = 0: offset = (stranica - 1) * 20;
           
        if(offset == 0){
            var sql = "SELECT f.* FROM film f JOIN uloga u ON f.id = u.id_film WHERE u.id_osoba = ?";
            var filmovi = await this.baza.izvrsiUpitPromiseAll(sql, [id_osoba]) as FilmTmdbI[];
        }   
        else{
            var sql = "SELECT f.* FROM film f JOIN uloga u ON f.id = u.id_film WHERE u.id_osoba = ? LIMIT 20 OFFSET ?";
            var filmovi = await this.baza.izvrsiUpitPromiseAll(sql, [id_osoba, offset]) as FilmTmdbI[];
        }
        return filmovi;
    }

    async dohvatiFilmoveStranicaDatumi(stranica: number, datumOd?: number, datumDo?: number): Promise<FilmTmdbI[]> {
        const offset = (stranica - 1) * 20;
        let sql = 'SELECT * FROM film LIMIT 20 OFFSET ?';
        let params: any[] = [offset];

        if (datumOd || datumDo) {
            sql = 'SELECT * FROM film WHERE datum_izdavanja BETWEEN ? AND ? LIMIT 20 OFFSET ?';
            params = [
                datumOd ? new Date(datumOd).toISOString() : new Date(0).toISOString(),
                datumDo ? new Date(datumDo).toISOString() : new Date().toISOString(),
                offset
            ];
        }
        
        const filmovi = await this.baza.izvrsiUpitPromiseAll(sql, params) as Array<FilmTmdbI>;
        
        return filmovi;
    }

    async dodajFilm(film: FilmTmdbI) {
        const sqlInsert = "INSERT INTO film (id, naslov, jezik, originalni_naslov, popularnost, slika_postera, datum_izdavanja, lik) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [
            film.id,
            film.title,
            film.original_language,
            film.original_title,
            film.popularity,
            film.poster_path,
            film.release_date,
            film.character,
        ];
        try {
            await this.baza.izvrsiUpitPromise(sqlInsert, params);
            return true;
        } catch (greska) {
            console.error("greška kod dodavanja filma:" +greska);
            return false;    
        }
            
        }
    
    async izbrisiFilm(filmId: number): Promise<boolean> {
        const sql = 'DELETE FROM film WHERE id = ?';
        try {
            await this.baza.izvrsiUpitPromise(sql, [filmId]);
            return true;
        } catch (greska) {
            console.error("greška prilikom brisanja filma"+ greska);
            return false;
        }
    }

    async obrisiFilmoveOsobe(id_osoba : number) {
        const sqlDelete = "DELETE FROM uloga WHERE id_osoba = ? AND id_film = ?";
        const filmovi = await this.dohvatiFilmoveOsobe(id_osoba, 0);

        for (const film of filmovi) {
            try {
                await this.baza.izvrsiUpitPromise(sqlDelete, [id_osoba, film.id]);
                await this.izbrisiFilm(film.id);
            } catch (greska) {
                console.log("Greska prilikom brisanja uloge: " + greska);
                return false;
            }
        }
        return true;
    }
}