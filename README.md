fcotic22/rwa24_fcotic22

## Kod druge zadaće iz RWA 24/25

Zadaća 2 iz kolegija Razvoj web aplikacija tiče se na razvoja web aplikacije za upravljanje filmskim osobljem 
koristeći Angular za klijentsku stranu i Node.js za poslužiteljsku stranu, pri čemu se podaci pohranjuju u SQLite bazu. 
Ključni zadaci uključuju migraciju prethodne web aplikacije u Angular s TypeScript-om i SCSS-om, izradu REST servisa koji poslužuje aplikaciju, integraciju s vanjskim servisom TMDB isključivo putem backend-a te prilagodbu sustava autentifikacije dodavanjem reCaptcha v3 i dvofaktorske autentifikacije (TOTP s QR kodom). Implementira se filtriranje filmova s paginacijom, a za dodatne bodove omogućava se upload vlastitih slika filmova. <br>
Zadaća je gotovo u potpunosti implementirana (96% prema ocjeni).

#### !!! VAŽNO !!! <br>
Za pokretanje aplikacije na localhost:12222 potrebno je: <br>

1. Skinuti zip projekta na svoje računalo
2. Unzipati projekt
3. U bash terminalu naredbom "cd rwa_projekt-main/posluzitelj" se prebaciti u direktorij poslužitelj
4. Pokrenuti npm skriptu pripremi uz pomoć naredbe "npm run pripremi"
5. Pokrenuti npm skriptu servis koja pokreće server uz pomoć naredbe "npm run servis"
