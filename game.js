let frame= 0; // conta i frame passati dall'inizio
let finePartita = false; // diventa true quando si vince o si perde

//rimette tutto come all'inizio per una nuova partite
function resetGame() {
  labirinto.init();
  punteggio = 0;
  palliniMangiati = 0;
  finePartita = false;
  frame = 0;
  pacman.riga = 16;
  pacman.colonna = 9;
  pacman.direzione = { dr: 0, dc: 0 };
  pacman.prossimaDirezione = { dr: 0, dc: 0 };
  pacman.boccaAperta = true;
  fantasma.riga = 10;
  fantasma.colonna = 9;
  fantasma.direzione = { dr: -1, dc: 0 };
  document.getElementById('punteggio').textContent = punteggio;
  document.getElementById('messaggio').textContent = '';
  document.getElementById('reset').style.display = 'none';
  requestAnimationFrame(loop);
}
document.getElementById('reset').addEventListener('click', resetGame); // richiama resetGame
// svuota punteggio e il messaggio
document.getElementById('punteggio').textContent = punteggio;
document.getElementById('messaggio').textContent = '';

function disegna() {
  labirinto.disegna(); // da labirinto.js
  fantasma.disegna(); // da fantasma.js
  pacman.disegna(); // da pacman.js
}

// imposta il fine partita e disegna la posizione "finale" di pacman e fantasma e stampa i messaggi
function gameOver() {
  finePartita = true;
  disegna();
  document.getElementById('messaggio').textContent = 'HAI PERSO! Punteggio: ' + punteggio;
  document.getElementById('reset').style.display = 'inline-block';
}

function loop() {
  if (finePartita) return; // se la partita è finita si ferma tutto
  frame++;

  // aggiorna pacman ogni 8 frame e controlla se hai perso
  if (frame % 8 === 0) {
    pacman.muovi();
    pacman.boccaAperta = !pacman.boccaAperta; // alterna bocca aperta/chiusa
    if (fantasma.riga === pacman.riga && fantasma.colonna === pacman.colonna) {
      gameOver();
      return;
    }
  }

  // aggiorna il fantasma ogni 16 frame e controlla se hai perso
  if (frame % 16 === 0) {
    const pacmanPrima = { riga: pacman.riga, colonna: pacman.colonna };
    const fantasmaPrima = { riga: fantasma.riga, colonna: fantasma.colonna };
    fantasma.muovi();
    if (fantasma.riga === pacman.riga && fantasma.colonna === pacman.colonna) {
      gameOver();
      return;
    }
    if (fantasma.riga === pacmanPrima.riga && fantasma.colonna === pacmanPrima.colonna &&
        fantasmaPrima.riga === pacman.riga && fantasmaPrima.colonna === pacman.colonna) {
      gameOver();
      return;
    }
  }

  disegna();
  // controlla se ha vinto e fa uscire i vari messaggi con punteggio
  if (palliniMangiati >= labirinto.totalePallini) {
    finePartita = true;
    disegna();
    document.getElementById('messaggio').textContent = 'HAI VINTO, il tuo punteggio è: ' + punteggio;
    document.getElementById('reset').style.display = 'inline-block';
    return;
  }
  requestAnimationFrame(loop);
}

// avvia tutto quando la pagina viene caricata
loop();