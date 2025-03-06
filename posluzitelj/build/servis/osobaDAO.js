import Baza from "../zajednicko/baza.js";
export class OsobaDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024fcotic22_servis.sqlite");
    }
    async dohvatiOsobu(id) {
        const sql = "SELECT * FROM osoba WHERE id = ?";
        let osoba = await this.baza.izvrsiUpitPromiseAll(sql, [id]);
        //console.log(JSON.stringify(osoba));
        return osoba;
    }
    async dohvatiOsobe(stranica) {
        let offset = (stranica - 1) * 20;
        const sql = "SELECT * FROM osoba LIMIT ? OFFSET ?";
        let osobe = await this.baza.izvrsiUpitPromiseAll(sql, [20, offset]);
        return osobe;
    }
    async dodajOsobu(novaOsoba) {
        const sql = "INSERT INTO osoba (id, ime, prezime, popularnost, poznat_po, profilna_slika) VALUES (?, ?, ?, ?, ?, ?)";
        try {
            await this.baza.izvrsiUpitPromise(sql, [novaOsoba.id, novaOsoba.ime, novaOsoba.prezime, novaOsoba.popularnost, novaOsoba.poznat_po, novaOsoba.profilna_slika]);
            return true;
        }
        catch (greska) {
            console.log("greska prilikom dodavanja osobe: " + greska);
            return false;
        }
    }
    async brisiOsobu(id) {
        const sql2 = "DELETE FROM uloga WHERE id_osoba = ?";
        const sql = "DELETE FROM osoba WHERE id = ?";
        try {
            await this.baza.izvrsiUpitPromise(sql2, [id]);
            await this.baza.izvrsiUpitPromise(sql, [id]);
            return true;
        }
        catch (greska) {
            console.log("greska prilikom brisanja osobe: " + greska);
            return false;
        }
    }
}
