import { Request, Response } from 'express';
import { OsobaDAO } from './osobaDAO.js';
import { FilmDAO } from './filmDAO.js';
import { FilmTmdbI } from 'src/Inteface.js';

export class RestOsoba {
    private osobaDAO: OsobaDAO;
    private filmDAO: FilmDAO;

    constructor() {
        this.osobaDAO = new OsobaDAO();
        this.filmDAO = new FilmDAO();
    }

    postOsobaId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ poruka: "zabranjena metoda" }));
    }


    putOsoba(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ poruka: "zrbranjena metoda" }));
    }

    deleteOsobuBezId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ poruka: "zrbranjena metoda" }));
    }


    async getOsobu(zahtjev: Request, odgovor: Response) {
        const id = parseInt(zahtjev.params["id"] || "0");
    
        if (isNaN(id) || id === 0) {
            odgovor.status(400).json({ greska: "Nepostojeci id" });
            return;
        }
    
        try {
            const osoba = await this.osobaDAO.dohvatiOsobu(id);
            if (osoba) {
                odgovor.status(200).json(osoba);
            } else {
                odgovor.status(404).json({ greska: "nije nađena osoba" });
            }
        } catch (error: any) {
            console.log("Greška u getOsoba:", error);
            odgovor.status(400).json({ greska: error });
        }
    }
    

    async getOsobeStranica(zahtjev: Request, odgovor: Response) {
        if(zahtjev.query["stranica"]) {
            let stranica = parseInt(zahtjev.query["stranica"] as string);
            let osobe = await this.osobaDAO.dohvatiOsobe(stranica);
            odgovor.status(200).json(osobe);
        }
        else {
            //console.log("Nisu poslani parametar stranica");
            odgovor.status(400).send({greska: "Nisu poslani parametar stranica"});
        }
    }

    async getFilmoveOsobe(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let id = parseInt(zahtjev.params["id"] || "0");
        let osoba = await this.osobaDAO.dohvatiOsobu(id);
        if(id == 0) odgovor.status(400).send({greska: "Nisu poslani parametar id"});
        else {
            let stranica = parseInt(zahtjev.query["stranica"] as string);
            let filmovi = await this.filmDAO.dohvatiFilmoveOsobe(id, stranica);
            if(filmovi.length>0){
                odgovor.status(200).json(filmovi);
            }
            else{
                odgovor.status(400).send({greska: "Nepostojeći resurs"});
            }
        }
    }

    async putFilmoveOsobi(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let id = parseInt(zahtjev.params["id"] || "0");
        if (id == 0) {
            odgovor.status(400).json({greska: "Nisu poslani parametar id"});
        } else {
            try {
                let filmovi = zahtjev.body as Array<FilmTmdbI>;                
                if (filmovi.length > 0) {
                    let dodani = await this.filmDAO.dodajFilmoveOsobi(id, filmovi);
                    
                    if (dodani) {
                        odgovor.status(201).json({status: "uspjeh"});
                    } else {
                        odgovor.status(400).json({status: "neuspjeh"});
                    }
                } else {
                    odgovor.status(400).json({greska: "Nisu poslani podaci o filmovima"});
                }
            } catch (greska) {
                console.log("Greška u postFilmoveOsobi:", greska);
                odgovor.status(400).json({status: "neuspjeh"});
            }
        }
    }

    async deleteFilmoveOsobe(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let id = parseInt(zahtjev.params["id"] || "0");
        if (id == 0) {
            odgovor.status(400).json({greska: "Nisu poslani parametar id"});
        } else {
            try {
                let obrisani = await this.filmDAO.obrisiFilmoveOsobe(id);
                if (obrisani) {
                    odgovor.status(200).json({status: "uspjeh"});
                } else {
                    odgovor.status(400).json({status: "neuspjeh"});
                }
            } catch (greska) {
                console.log("Greška u deleteFilmoveOsobe:", greska);
                odgovor.status(400).json({status: "neuspjeh"});
            }
        }       
    }

    async postOsobaStranica(zahtjev: Request, odgovor: Response) {
        const novaOsoba = zahtjev.body;
        const dodanaOsoba = await this.osobaDAO.dodajOsobu(novaOsoba);
        if(dodanaOsoba) odgovor.status(201).json(dodanaOsoba);
        else odgovor.status(400).json({greska: "Nije moguće dodati osobu"});
    }

    async deleteOsobu(zahtjev: Request, odgovor: Response) {
        let id = parseInt(zahtjev.params["id"] || "0") ;
        if(id == 0) {
            odgovor.status(400).json({greska: "Nisu poslani parametar id"});
        }
        else{
            let rezultat = await this.osobaDAO.brisiOsobu(id);
            if(rezultat) {
                odgovor.status(200).json({obrisana: true});
            }
            else {
                odgovor.status(400).json({obrisana: false});
            }

        }
    }
}