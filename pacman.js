// variabili del punteggio riusate in game.js
let punteggio = 0;
let palliniMangiati = 0;

// oggetto pacman con posizione e direzione iniziale
let pacman = {
  riga: 16,
  colonna: 9,
  boccaAperta: true,
  boccaAngolo: 0.25, // quanto si apre la bocca
  direzione: { dr: 0, dc: 0 }, // direzione di ora
  prossimaDirezione:{ dr: 0, dc: 0 },  // direzione da prendere

  muovi: function() {
    // prova a cambiare direzione se la nuova cella è libera
    let nuovaRiga = this.riga + this.prossimaDirezione.dr;
    let nuovaColonna = this.colonna + this.prossimaDirezione.dc;
    if (!labirinto.èMuro(nuovaRiga, nuovaColonna)) {
      this.direzione = { ...this.prossimaDirezione };
    }

    // aggiorna posizione se la nuova posizione è libera
    nuovaRiga = this.riga + this.direzione.dr;
    nuovaColonna = this.colonna + this.direzione.dc;
    if (!labirinto.èMuro(nuovaRiga, nuovaColonna)) {
      this.riga = nuovaRiga;
      this.colonna = nuovaColonna;
    }

    // tunnel
    if (this.riga === 10) {
      if (this.colonna < 0) this.colonna = labirinto.COLONNE - 1;
      if (this.colonna >= labirinto.COLONNE) this.colonna = 0;
    }

    // controlla se pacman è sopra un pallino e lo mangia
    const valoreCella = labirinto.griglia[this.riga][this.colonna];
    if (valoreCella === 0) {
      labirinto.griglia[this.riga][this.colonna] = 2; // rimuove il pallino dalla griglia
      punteggio += 10;
      palliniMangiati++;
    } else if (valoreCella === 3) {
      labirinto.griglia[this.riga][this.colonna] = 2; // rimuove il pallino grande dalla griglia
      punteggio += 50;
      palliniMangiati++;
    }

    // aggiorna il punteggio mostrato nell'html
    document.getElementById('punteggio').textContent = punteggio;
  },

  // disegna pacman sul canvas nella posizione attuale
  disegna: function() {
    const x = this.colonna * labirinto.CELLA + labirinto.CELLA / 2;
    const y = this.riga * labirinto.CELLA + labirinto.CELLA / 2;
    const raggio = labirinto.CELLA / 2 - 2;

    // rotazione bocca in base alla direzione
    let angolo = 0;
    if (this.direzione.dc ===  1) angolo = 0; // destra
    else if (this.direzione.dc === -1) angolo = Math.PI; // sinistra
    else if (this.direzione.dr === -1) angolo = -Math.PI / 2; // su
    else if (this.direzione.dr === 1) angolo =  Math.PI / 2; // giù

    let bocca;
    if (this.boccaAperta) {
      bocca = this.boccaAngolo * Math.PI; // bocca aperta
    } else {
      bocca = 0.02; // bocca chiusa
    }

    // disegna pacman come cerchio senza la parte della bocca
    labirinto.ctx.fillStyle = '#FFD700';
    labirinto.ctx.beginPath();
    labirinto.ctx.moveTo(x, y);
    labirinto.ctx.arc(x, y, raggio, angolo + bocca, angolo + Math.PI * 2 - bocca);
    labirinto.ctx.closePath();
    labirinto.ctx.fill();
  }
};

// vede il tasto premuto e vede se prossimaDirezione è libera per il movimento
document.addEventListener('keydown', function(evento) {
  const tasti = {
    'ArrowUp': { dr: -1, dc:  0 }, // su
    'ArrowDown': { dr:  1, dc:  0 }, // giù
    'ArrowLeft': { dr:  0, dc: -1 }, // sinistra
    'ArrowRight': { dr:  0, dc:  1 }, // destra
  };
  if (tasti[evento.key]) {
    evento.preventDefault(); // impedisce alla pagina di scorrere con le frecce
    pacman.prossimaDirezione = tasti[evento.key];
  }
});