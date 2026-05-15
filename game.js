let frame       = 0;     // conta i frame passati dall'inizio
let finePartita = false; // diventa true quando si vince o si perde

// funzione che disegna tutto insieme ad ogni frame
function disegna() {
  labirinto.disegna(); // da labirinto.js
  pacman.disegna();    // da pacman.js
  fantasma.disegna();  // da fantasma.js
}

function loop() {
  if (finePartita) return; // se la partita è finita si ferma tutto
  frame++;

  // aggiorna pacman ogni 8 frame (circa 7 volte al secondo)
  if (frame % 8 === 0) {
    pacman.muovi();
    pacman.boccaAperta = !pacman.boccaAperta; // alterna bocca aperta/chiusa
    fantasma.controllaCollisione(); // controlla collisione dopo movimento pacman
  }

  // aggiorna il fantasma ogni 16 frame (più lento di pacman)
  if (frame % 16 === 0) {
    fantasma.muovi();
    fantasma.controllaCollisione(); // controlla collisione dopo movimento fantasma
  }

  disegna();

  // controlla se ha vinto
  if (palliniMangiati >= labirinto.totalePallini) {
    finePartita = true;
    disegna();
    document.getElementById('messaggio').textContent = 'HAI VINTO, il tuo punteggio è: ' + punteggio;
    return;
  }

  requestAnimationFrame(loop);
}
loop();