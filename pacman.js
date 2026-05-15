// variabili del punteggio (usate anche in game.js)
let punteggio      = 0;
let palliniMangiati = 0;

// oggetto che rappresenta pacman con la sua posizione e direzione
let pacman = {
  riga: 16,   // riga di partenza
  colonna: 9,   // colonna di partenza
  boccaAperta: true, // true = bocca aperta, false = bocca chiusa
  boccaAngolo: 0.25, // quanto si apre la bocca
  direzione: { dr: 0, dc: 0 }, // direzione in cui si sta muovendo ora
  prossimaDirezione:{ dr: 0, dc: 0 }  // direzione che vuole prendere appena possibile
};

// ascolta i tasti freccia e salva la direzione voluta in prossimaDirezione
document.addEventListener('keydown', function(evento) {
  const tasti = {
    'ArrowUp':    { dr: -1, dc:  0 }, // su
    'ArrowDown':  { dr:  1, dc:  0 }, // giù
    'ArrowLeft':  { dr:  0, dc: -1 }, // sinistra
    'ArrowRight': { dr:  0, dc:  1 }, // destra
  };
  if (tasti[evento.key]) {
    evento.preventDefault(); // impedisce alla pagina di scorrere con le frecce
    pacman.prossimaDirezione = tasti[evento.key];
  }
});

// sposta pacman di una cella e mangia eventuali pallini
function muoviPacman() {
  // prova a cambiare direzione se la nuova cella è libera
  let nuovaRiga    = pacman.riga    + pacman.prossimaDirezione.dr;
  let nuovaColonna = pacman.colonna + pacman.prossimaDirezione.dc;
  if (!èMuro(nuovaRiga, nuovaColonna)) {
    pacman.direzione = { ...pacman.prossimaDirezione };
  }

  // muovi nella direzione attuale se la cella davanti è libera
  nuovaRiga    = pacman.riga    + pacman.direzione.dr;
  nuovaColonna = pacman.colonna + pacman.direzione.dc;
  if (!èMuro(nuovaRiga, nuovaColonna)) {
    pacman.riga    = nuovaRiga;
    pacman.colonna = nuovaColonna;
  }

  // teletrasporto tunnel riga 10: esce a sinistra → rientra a destra e viceversa
  if (pacman.riga === 10) {
    if (pacman.colonna < 0)        pacman.colonna = COLONNE - 1;
    if (pacman.colonna >= COLONNE) pacman.colonna = 0;
  }

  // controlla se pacman è sopra un pallino e lo mangia
  const valoreCella = griglia[pacman.riga][pacman.colonna];
  if (valoreCella === 0) {
    griglia[pacman.riga][pacman.colonna] = 2; // rimuove il pallino dalla griglia
    punteggio += 10;
    palliniMangiati++;
  } else if (valoreCella === 3) {
    griglia[pacman.riga][pacman.colonna] = 2; // rimuove il pallino grande dalla griglia
    punteggio += 50;
    palliniMangiati++;
  }

  // aggiorna il punteggio mostrato nell'html
  document.getElementById('punteggio').textContent = punteggio;
}

// disegna pacman sul canvas nella sua posizione attuale
function disegnaPacman() {
  // posizione in pixel del centro di pacman
  const x = pacman.colonna * CELLA + CELLA / 2;
  const y = pacman.riga    * CELLA + CELLA / 2;
  const raggio = CELLA / 2 - 2;

  // angolo di rotazione in base alla direzione
  let angolo = 0;
  if (pacman.direzione.dc ===  1) angolo = 0; // destra
  else if (pacman.direzione.dc === -1) angolo = Math.PI; // sinistra
  else if (pacman.direzione.dr === -1) angolo = -Math.PI / 2; // su
  else if (pacman.direzione.dr ===  1) angolo =  Math.PI / 2; // giù

  // apertura della bocca: aperta o quasi chiusa
 if (pacman.boccaAperta) {
  bocca = pacman.boccaAngolo * Math.PI; // bocca aperta
} else {
  bocca = 0.02; // bocca quasi chiusa
}

  // disegna pacman come cerchio con uno spicchio mancante (la bocca)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, raggio, angolo + bocca, angolo + Math.PI * 2 - bocca);
  ctx.closePath();
  ctx.fill();
}