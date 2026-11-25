import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Definiranje __dirname za ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Funkcija koristi besplatan servis Security Trails za dohvat subdomena (podomena) za traženu domenu.
// Ulaz je domena, a izlaz je lista internetskih adresa za tu istu domenu. Internetska adresa = subdomena + domena.
async function getSubdomains(domain) {
    try {
        // Ključ je spremljen u API/api_security_trails i stavio sam ga u .gitignore.
        const keyPath = path.join(__dirname, 'APIs', 'api_security_trails');
        const apiKey = (await fs.readFile(keyPath, 'utf-8')).trim();

        // HTTP GET zahtjev sa odgovarajućim URL-om za API upit prema javnom servisu.
        const url = `https://api.securitytrails.com/v1/domain/${domain}/subdomains`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'APIKEY': apiKey
            }
        });

        // Upravljanje greškom, ako nema ispravnog odgovora.
        if (!response.ok) {
            throw new Error(`SecurityTrails API greška: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Izgradnja liste internetskih adresa. Točnije, spajanje subdomene i domene.
        const internetAddressList = (data.subdomains || []).map(sub => `${sub}.${domain}`);

        // Dodavanje same domene u listu.
        if (!internetAddressList.includes(domain)) {
            internetAddressList.push(domain);
        }

        return internetAddressList; // Vraća listu internetskih adresa.

    } catch (error) {
        console.error('Greška prilikom dohvaćanja subdomena:', error.message);
        throw error;
    }
}

// Test ispravnosti.
(async () => {
    const targetDomain = 'unipu.hr';
    const allDomains = await getSubdomains(targetDomain);
    console.log(allDomains);
})();