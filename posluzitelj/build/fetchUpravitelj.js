import * as jwt from "./zajednicko/jwt.js";
export class FetchUpravitelj {
    tajniKljucJWT;
    jwtTrajanje;
    constructor(tajniKljucJWT, jwtTrajanje) {
        this.tajniKljucJWT = tajniKljucJWT;
        this.jwtTrajanje = jwtTrajanje;
    }
    async getJWT(zahtjev, odgovor) {
        odgovor.type("json");
        let sesija = zahtjev.body;
        //console.log("FetchUpravitelj korime: ", sesija.korime);
        if (sesija['korime'] != null) {
            let k = { korime: sesija.korime, tip_korisnika_id: sesija.tip_korisnika_id };
            let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT, this.jwtTrajanje);
            //console.log("Novi token: ", noviToken);
            odgovor.status(201).send({ jwt: noviToken });
            return;
        }
        else {
            odgovor.status(401).send({ greska: "nemam token!" });
        }
    }
    ;
}
