let frame       = 0;     // conta i frame passati dall'inizio
let finePartita = false; // diventa true quando si vince o si perde

// funzione che disegna tutto insieme ad ogni frame
function disegna() {
  disegnaLabirinto(); // da labirinto.js
  disegnaPacman();    // da pacman.js
  disegnaFantasma();  // da fantasma.js
}

function loop() {
  if (finePartita) return; // se la partita è finita si ferma tutto
  frame++;

  // aggiorna pacman ogni 8 frame (circa 7 volte al secondo)
  if (frame % 8 === 0) {
    muoviPacman();
    pacman.boccaAperta = !pacman.boccaAperta; // alterna bocca aperta/chiusa
  }

  // aggiorna il fantasma ogni 16 frame (più lento di pacman)
  if (frame % 16 === 0) {
    muoviFantasma();
    controllaCollisione(); // controlla se il fantasma ha preso pacman
  }

  disegna();

  // controlla se ha vinto
  if (palliniMangiati >= totallePallini) {
    finePartita = true;
    disegna();
    document.getElementById('messaggio').textContent = 'HAI VINTO, il tuo punteggio è: ' + punteggio;
    return;
  }

  requestAnimationFrame(loop);
}
loop();