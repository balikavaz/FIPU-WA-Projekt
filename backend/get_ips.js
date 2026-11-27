import dns from 'dns/promises';

// Funkcija koristi ugrađeni Node.js DNS modul za mapiranje IP adrese na internetsku adresu.
// Ulaz: internetska adresa -> izlaz IP adresa. je internetska adresa (npr. 'www.unipu.hr' ili 'unipu.hr'), a izlaz je jedna IPv4 adresa.
async function getIp(internetAddress) {
    try {
        // Čišćenje i normalizacija ulaza (u slučaju da ima nepotrebnih znakova).
        const cleanAddress = internetAddress.replace(/^https?:\/\//, '').split('/')[0];

        // Spremanje IP adrese u varijablu.
        const result = await dns.lookup(cleanAddress, { family: 4 });

        return result.address; // Vraća IP adresu.

    } catch (error) {
        console.error(`Greška prilikom dohvaćanja IP adrese za ${internetAddress}:`, error.message);
        throw error;
    }
}

// Test ispravnosti.
(async () => {
    const targetAddress = 'www.unipu.hr';
    const ipAddress = await getIp(targetAddress);
    console.log(ipAddress);
})();