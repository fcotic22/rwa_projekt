import dsPromise from "fs/promises";

type tipKonf = { jwtTajniKljuc: string, jwtValjanost: string, tajniKljucSesija: string, tmdbApiKeyV3: string, tmdbApiKeyV4: string };

export class Konfiguracija {
    private konf: tipKonf;
    constructor() { 
        this.konf = this.initKonf(); 
    }
    
    private initKonf (){
        return { jwtTajniKljuc: "", jwtValjanost: "", tajniKljucSesija:"", tmdbApiKeyV3: "", tmdbApiKeyV4: "" } 
	}
    
        dajKonf() {return this.konf; }


    public async ucitajKonf() {
        if(process.argv[2] == undefined){
            throw new Error("Nije navedena putanja do konfiguracijske datoteke");
        }
        else {
            try { 
                const podatci = await dsPromise.readFile(process.argv[2], "utf-8"); 
                this.pretvoriJSONkonfig(podatci);
                this.provjeriPodatkeKonfiguracije();
                //console.log(this.konf);
            }
            catch (error) {
                console.error("Neuspješno učitavanje konfiguracije:", error);
                throw error;
            }
        }
    }

    private pretvoriJSONkonfig(podaci: string) {
		//console.log(podaci);
		let konf: { [kljuc: string]: string } = {};
		var nizPodataka = podaci.split("\n");
		for (let podatak of nizPodataka) {
			var podatakNiz = podatak.split("#");
			var naziv = podatakNiz[0];
			if (typeof naziv != "string" || naziv == "") continue;
			var vrijednost: string = podatakNiz[1] ?? "";
			konf[naziv] = vrijednost;
		}
		this.konf = konf as tipKonf;
	}

	private provjeriPodatkeKonfiguracije() {
		//if (this.konf.tmdbApiKeyV3 == undefined || this.konf.tmdbApiKeyV3.trim() == "") {
		//	throw new Error("Fali TMDB API ključ u tmdbApiKeyV3");
	//	}
		if (this.konf.jwtValjanost == undefined || this.konf.jwtValjanost.trim() == "") {
			throw new Error("Fali JWT valjanost");
		}
		if (this.konf.jwtTajniKljuc == undefined || this.konf.jwtTajniKljuc.trim() == "") {
			throw new Error("Fali JWT tajni kljuc");
		}
		if(this.konf.tajniKljucSesija == undefined || this.konf.tajniKljucSesija.trim() == ""){
			throw new Error("Fali tajni ključ sesije");
		}
		if(isNaN(parseInt(this.konf.jwtValjanost))){
			throw new Error("JWT valjanost nije u broj");			
		}
		if(this.konf.jwtValjanost < "15" || this.konf.jwtValjanost > "300"){
			throw new Error("JWT valjanost nije u ispravnom rasponu: 15 do 300 s");			
		}
		if(this.konf.jwtTajniKljuc.indexOf("#") != -1){
			throw new Error("JWT tajni ključ nije u ispravnom formatu - sadrži znak #");
		}
		var regex = /^[a-z0-9!%$]{100,200}$/;
		if(regex.test(this.konf.jwtTajniKljuc)){
			throw new Error("JWT tajni ključ nije u ispravnom formatu");
		}
		if(regex.test(this.konf.tajniKljucSesija)){
			throw new Error("Tajni ključ sesije nije u ispravnom formatu");
		}
	}

}