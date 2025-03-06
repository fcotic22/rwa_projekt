import jwt from "jsonwebtoken";
import { Request } from "express";

export function kreirajToken(
  korisnik: { korime: string; tip_korisnika_id: number },
  tajniKljucJWT: string,
  trajanjeJWT: string
) {
  return jwt.sign({ korime: korisnik.korime}, tajniKljucJWT, {
    expiresIn: parseInt(trajanjeJWT),
  });
}

export function provjeriToken(zahtjev: Request, tajniKljucJWT: string) {
  if (!zahtjev.headers.authorization) {
    return { validan: false, error: "JWT nije prihvaćen" };
  }

  const token = zahtjev.headers.authorization.split(" ")[1] ?? "";

  try {
    const podaci = jwt.verify(token, tajniKljucJWT);
    return { validan: true, podaci };
  } catch (e) {
    console.log("GReska prilikom provjere JWT_ "+ e);
    return { validan: false, error: "JWT nije prihvaćen" };
  }
}

export function dajToken(zahtjev: Request): string | null {
  return zahtjev.headers.authorization || null;
}

export function ispisiDijelove(token: string) {
  const dijelovi = token.split(".");
  if (dijelovi[0]) {
    console.log("Zaglavlje:", dekodirajBase64(dijelovi[0]));
  }
  if (dijelovi[1]) {
    console.log("Tijelo:", dekodirajBase64(dijelovi[1]));
  }
  if (dijelovi[2]) {
    console.log("Potpis:", dekodirajBase64(dijelovi[2]));
  }
}

export function dajTijelo(token: string): Record<string, any> {
  const dijelovi = token.split(".");
  if (!dijelovi[1]) return {};
  return JSON.parse(dekodirajBase64(dijelovi[1]));
}

export function dajZaglavlje(token: string): Record<string, any> {
  const dijelovi = token.split(".");
  if (!dijelovi[0]) return {};
  return JSON.parse(dekodirajBase64(dijelovi[0]));
}


function dekodirajBase64(data: string) {
  const buff = Buffer.from(data, "base64");
  return buff.toString("ascii");
}
