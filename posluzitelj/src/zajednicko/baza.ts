import SQLite from 'better-sqlite3';

export default class Baza {
    private vezaBaza;
    private putanja;

    constructor(putanja: string) {
        this.putanja = putanja;
        this.vezaBaza = new SQLite(this.putanja);
        this.vezaBaza.exec("PRAGMA foreign_keys = ON");
    }

    public spojiSeNaBazu(){
        this.vezaBaza = new SQLite(this.putanja);
        this.vezaBaza.exec("PRAGMA foreign_keys = ON");
    }

    public izvrsiUpit(sql: string, podatci: Array<string | number | null>){
        try {
            const rezultat = this.vezaBaza.prepare(sql).run(podatci);
            return rezultat;
        } catch (error) {
            console.error("Neuspješno izvršen upit:", error);
            throw error;
        }
    }

    public izvrsiUpitPromise(sql: string, podatci: Array<string | number | null>){
        return new Promise((uspjeh, greska) => {
            try {
                var rezultat = this.vezaBaza.prepare(sql).run(podatci);
                return uspjeh(rezultat);
            } catch (error) {
                console.error("Neuspješno izvršen upit:", error);
                return greska(error);
            }
        });
    }

    public izvrsiUpitPromiseAll(sql: string, podatci: Array<string | number | null>){
        return new Promise((uspjeh, greska) => {
            try {
                var rezultat = this.vezaBaza.prepare(sql).all(podatci);
                return uspjeh(rezultat);
            } catch (error) {
                console.error("Neuspješno izvršen upit:", error);
                return greska(error);
            }
        });
    }

    public azurirajPodatke(sql: string, podatci: Array<string | number>){
        try {
            const rezultat = this.vezaBaza.prepare(sql).run(podatci);
            return rezultat;
        } catch (error) {
            console.error("Neuspješno ažuriranje podataka:", error);
            throw error;
        }
    }

    public zatvoriVezu(){
        this.vezaBaza.close();
    }

}