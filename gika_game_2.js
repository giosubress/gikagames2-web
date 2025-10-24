// --- 1. VARIABILI E CONFIGURAZIONE ---
let TelegramUser = {};
let currentScore = 0;

// URL della tua API (Vercel)
// Il tuo gioco lo chiamerà quando finisce.
const API_ENDPOINT = 'https://gikagames2-web.vercel.app/api/submit_score'; 

// Chiave segreta concordata nel codice del backend (submit_score.js)
// Questo non è l'ID utente, ma un semplice codice per testare l'API.
const GIKA_API_KEY = 'GIKA_SECURE_API_KEY_123'; 


// --- 2. FUNZIONE PER OTTENERE I DATI TELEGRAM (CRUCIALE) ---
function getTelegramData() {
    const urlParams = new URLSearchParams(window.location.search);
    const tgAuth = urlParams.get('tgWebAppData'); 
    
    if (tgAuth) {
        // Analizza i dati per trovare l'oggetto utente
        const userPart = tgAuth.split('&').find(part => part.startsWith('user='));
        
        if (userPart) {
            try {
                // Decodifica e analizza l'oggetto utente
                const userJson = decodeURIComponent(userPart.substring(5));
                TelegramUser = JSON.parse(userJson);
                
                // Aggiorna l'interfaccia
                document.getElementById('user-id').textContent = TelegramUser.id;
                console.log("Dati utente Telegram caricati:", TelegramUser);
                return true;
            } catch (e) {
                console.error("Errore nell'analisi dei dati utente Telegram:", e);
            }
        }
    }
    document.getElementById('user-id').textContent = 'ANONIMO (Non da Telegram)';
    return false;
}


// --- 3. FUNZIONE DI INVIO PUNTEGGIO AL BACKEND ---
function sendScoreToBackend(finalScore) {
    if (!TelegramUser.id) {
        alert("Errore: Impossibile inviare il punteggio. L'utente non è autenticato da Telegram.");
        return; 
    }

    const payload = {
        user_id: TelegramUser.id,
        username: TelegramUser.username || TelegramUser.first_name || 'GikaPlayer', 
        score: finalScore,
        secret_key: GIKA_API_KEY // Per il controllo di sicurezza semplice nel backend
    };
    
    // Mostra un messaggio di attesa
    document.getElementById('game-info').innerHTML = `<h1>Inviando punteggio: ${finalScore}...</h1>`;

    fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Punteggio di ${finalScore} inviato con successo! Classifica aggiornata.`);
        } else {
            alert(`Errore nell'invio del punteggio: ${data.error || 'Server error.'}`);
        }
        // Il tuo gioco può chiudersi qui, o mostrare la schermata Game Over
        // Telegram.WebApp.close(); // Se vuoi chiudere la WebApp
    })
    .catch(error => {
        console.error("Errore di rete:", error);
        alert("Errore di rete: Controlla la connessione o l'URL dell'API.");
    });
}


// --- 4. FUNZIONI DI GIOCO (PLACEHOLDER) ---

// Questa funzione simula la fine del gioco
function simulateGameOver() {
    // Genera un punteggio casuale per il test
    currentScore = Math.floor(Math.random() * 1000) + 1; 
    document.getElementById('current-score').textContent = currentScore;
    
    // Chiama la funzione CRUCIALE per inviare il punteggio
    sendScoreToBackend(currentScore);
}

// Avvia l'estrazione dei dati Telegram all'avvio
getTelegramData();
