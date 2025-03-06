import SQLite from 'better-sqlite3';
export default class Baza {
    vezaBaza;
    putanja;
    constructor(putanja) {
        this.putanja = putanja;
        this.vezaBaza = new SQLite(this.putanja);
        this.vezaBaza.exec("PRAGMA foreign_keys = ON");
    }
    spojiSeNaBazu() {
        this.vezaBaza = new SQLite(this.putanja);
        this.vezaBaza.exec("PRAGMA foreign_keys = ON");
    }
    izvrsiUpit(sql, podatci) {
        try {
            const rezultat = this.vezaBaza.prepare(sql).run(podatci);
            return rezultat;
        }
        catch (error) {
            console.error("Neuspješno izvršen upit:", error);
            throw error;
        }
    }
    izvrsiUpitPromise(sql, podatci) {
        return new Promise((uspjeh, greska) => {
            try {
                var rezultat = this.vezaBaza.prepare(sql).run(podatci);
                return uspjeh(rezultat);
            }
            catch (error) {
                console.error("Neuspješno izvršen upit:", error);
                return greska(error);
            }
        });
    }
    izvrsiUpitPromiseAll(sql, podatci) {
        return new Promise((uspjeh, greska) => {
            try {
                var rezultat = this.vezaBaza.prepare(sql).all(podatci);
                return uspjeh(rezultat);
            }
            catch (error) {
                console.error("Neuspješno izvršen upit:", error);
                return greska(error);
            }
        });
    }
    azurirajPodatke(sql, podatci) {
        try {
            const rezultat = this.vezaBaza.prepare(sql).run(podatci);
            return rezultat;
        }
        catch (error) {
            console.error("Neuspješno ažuriranje podataka:", error);
            throw error;
        }
    }
    zatvoriVezu() {
        this.vezaBaza.close();
    }
}
