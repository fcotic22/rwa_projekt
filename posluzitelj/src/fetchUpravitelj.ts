import * as jwt from "./zajednicko/jwt.js";
import { Request, Response } from "express";
import { RWASession } from "./htmlUpravitelj.js";
export class FetchUpravitelj {
  private tajniKljucJWT: string;
  private jwtTrajanje: string;

  constructor(tajniKljucJWT: string, jwtTrajanje: string) {
    this.tajniKljucJWT = tajniKljucJWT;
    this.jwtTrajanje = jwtTrajanje;
  }

  async getJWT (zahtjev:Request, odgovor:Response) {
    odgovor.type("json");
    let sesija = zahtjev.body as RWASession;
    //console.log("FetchUpravitelj korime: ", sesija.korime);
    if (sesija['korime'] != null) {
      let k = { korime: sesija.korime, tip_korisnika_id: sesija.tip_korisnika_id };
      let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT, this.jwtTrajanje);
      //console.log("Novi token: ", noviToken);
      odgovor.status(201).send({ jwt: noviToken });
      return;
    }
    else{
      odgovor.status(401).send({ greska: "nemam token!" });
    }
  };
}
