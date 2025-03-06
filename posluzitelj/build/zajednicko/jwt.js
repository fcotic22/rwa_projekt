import jwt from "jsonwebtoken";
export function kreirajToken(korisnik, tajniKljucJWT, trajanjeJWT) {
    return jwt.sign({ korime: korisnik.korime }, tajniKljucJWT, {
        expiresIn: parseInt(trajanjeJWT),
    });
}
export function provjeriToken(zahtjev, tajniKljucJWT) {
    if (!zahtjev.headers.authorization) {
        return { validan: false, error: "JWT nije prihvaćen" };
    }
    const token = zahtjev.headers.authorization.split(" ")[1] ?? "";
    try {
        const podaci = jwt.verify(token, tajniKljucJWT);
        return { validan: true, podaci };
    }
    catch (e) {
        console.log("GReska prilikom provjere JWT_ " + e);
        return { validan: false, error: "JWT nije prihvaćen" };
    }
}
export function dajToken(zahtjev) {
    return zahtjev.headers.authorization || null;
}
export function ispisiDijelove(token) {
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
export function dajTijelo(token) {
    const dijelovi = token.split(".");
    if (!dijelovi[1])
        return {};
    return JSON.parse(dekodirajBase64(dijelovi[1]));
}
export function dajZaglavlje(token) {
    const dijelovi = token.split(".");
    if (!dijelovi[0])
        return {};
    return JSON.parse(dekodirajBase64(dijelovi[0]));
}
function dekodirajBase64(data) {
    const buff = Buffer.from(data, "base64");
    return buff.toString("ascii");
}
