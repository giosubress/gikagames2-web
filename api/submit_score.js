{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Questo \'e8 il codice Node.js che Vercel eseguir\'e0\
\
// Nota: Le librerie come Supabase e Fetch saranno gestite automaticamente da Vercel.\
\
// --- Configurazione: Le tue chiavi segrete ---\
// Vercel prelever\'e0 questi valori dalle Variabili d'Ambiente che hai impostato\
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;\
const SUPABASE_URL = process.env.SUPABASE_URL;\
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;\
\
// Importa Supabase Client (questa riga richiede la libreria Supabase installata)\
// Per ora, lasciala come commento per non bloccarti:\
// const \{ createClient \} = require('@supabase/supabase-js'); \
\
// Chiave di sicurezza semplice per i test iniziali. \
// Ricorda di impostare una chiave segreta molto complessa per la produzione!\
const API_SECRET = 'GIKA_SECURE_API_KEY_123'; \
\
// Funzione principale che risponde alla richiesta dal tuo gioco\
module.exports = async (req, res) => \{\
    // Il client deve inviare una richiesta POST\
    if (req.method !== 'POST') \{\
        return res.status(405).json(\{ error: 'Method Not Allowed' \});\
    \}\
\
    // Estrai i dati inviati dal gioco\
    const \{ user_id, username, score, secret_key \} = req.body;\
    \
    // --- 1. Controllo di Sicurezza Semplice ---\
    if (!secret_key || secret_key !== API_SECRET) \{ \
        return res.status(403).json(\{ error: 'Access Denied: Invalid Key' \});\
    \}\
\
    if (!user_id || typeof score !== 'number' || score < 0) \{\
         return res.status(400).json(\{ error: 'Invalid data provided.' \});\
    \}\
\
    try \{\
        // --- 2. Connessione a Supabase (Logica Concettuale) ---\
        \
        // Questo \'e8 il punto in cui il codice si connette al tuo DB Supabase \
        // usando SUPABASE_URL e SUPABASE_SERVICE_KEY e esegue l'upsert \
        // (inserisce se non esiste, aggiorna se il punteggio \'e8 pi\'f9 alto).\
\
        console.log(`Punteggio valido ricevuto: $\{username\} - $\{score\}`);\
\
        // --- 3. Notifica Telegram ---\
        await sendScoreToTelegram(user_id, score);\
\
        // Risposta positiva al gioco\
        res.status(200).json(\{ \
            success: true, \
            message: 'Score submitted and Telegram updated.' \
        \});\
\
    \} catch (error) \{\
        console.error('API Error:', error);\
        res.status(500).json(\{ error: 'Internal Server Error', details: error.message \});\
    \}\
\};\
\
// Funzione che chiama l'API di Telegram per aggiornare la classifica\
async function sendScoreToTelegram(userId, score) \{\
    const apiUrl = `https://api.telegram.org/bot$\{TELEGRAM_BOT_TOKEN\}/setGameScore`;\
\
    // fetch non \'e8 nativo in Node.js, ma Vercel lo supporta\
    const response = await fetch(apiUrl, \{\
        method: 'POST',\
        headers: \{ 'Content-Type': 'application/json' \},\
        body: JSON.stringify(\{\
            user_id: userId,\
            score: score,\
            force: true // Forza l'aggiornamento anche se non \'e8 un record personale.\
        \})\
    \});\
    return response.json();\
\}}
