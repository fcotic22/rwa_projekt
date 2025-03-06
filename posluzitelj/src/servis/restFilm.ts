import { Request, Response } from "express";
import { FilmDAO } from "./filmDAO.js";
import { FilmTmdbI } from "../Inteface.js";

export class RestFilm {
    private fdao: FilmDAO;

    constructor() {
        this.fdao = new FilmDAO();
        }
    
        async postFilmId(zahtjev: Request, odgovor: Response) {
            odgovor.type("application/json");
            odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
        }
    
        async putFilm(zahtjev: Request, odgovor: Response) {
            odgovor.type("application/json");
            odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
        }

        async deleteFilm(zahtjev: Request, odgovor: Response) {
            odgovor.type("application/json");
            odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
        }
    

    async getFilm(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let filmId = parseInt(zahtjev.params["id"] || "0");
        if (isNaN(filmId)) {
            odgovor.status(400).send(JSON.stringify({ greska: "Neispravan ID filma" }));
            return;
        }
        try {
            let film = await this.fdao.dohvatiFilm(filmId);
            odgovor.status(200).send(JSON.stringify(film));
        } catch (error) {
            odgovor.status(400).send(JSON.stringify({ greska: "Greška prilikom dohvaćanja filma" }));
        }
    }

    async postFilm (zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let film = zahtjev.body as FilmTmdbI;
        if(film != undefined && film != null){
            try {
                let dodan = await this.fdao.dodajFilm(film);
                odgovor.status(201).json({dodan : dodan});
            } catch (error) {
                odgovor.status(400).json(JSON.stringify({ greska: "Greška prilikom dodavanja filma" , dodan: false}));
            }
        }
        else{
            odgovor.status(400).json(JSON.stringify({ greska: "Nisu poslani podaci o filmu", dodan:false }));
        }
    } 

    async getFilmovi(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let stranica = parseInt(zahtjev.query["stranica"] as string || "1");
        let datumOd = parseInt(zahtjev.query["datumOd"] as string || "0");
        let datumDo = parseInt(zahtjev.query["datumDo"] as string || "0");
        try {
            let filmovi = await this.fdao.dohvatiFilmoveStranicaDatumi(stranica, datumOd, datumDo);
            odgovor.status(200).json(filmovi);
        } catch (error) {
            odgovor.status(400).json({ greska: "Greška prilikom dohvaćanja filmova" });
        }
    }

    async deleteFilmId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let filmId = parseInt(zahtjev.params["id"] || "0");
        if (isNaN(filmId)) {
            odgovor.status(400).send(JSON.stringify({ greska: "Neispravan ID filma" }));
            return;
        }
        try {
            let poruka = await this.fdao.izbrisiFilm(filmId);
            odgovor.status(201).send(JSON.stringify(poruka));
        } catch (error) {
            odgovor.status(500).send(JSON.stringify({ greska: "Greška prilikom brisanja filma" }));
        }
    }
}