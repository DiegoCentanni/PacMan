let fantasma = {
  riga:      1,
  colonna:   1,
  direzione: { dr: 0, dc: 1 },

  tutteLeDirezioni: [
    { dr: -1, dc:  0 },
    { dr:  1, dc:  0 },
    { dr:  0, dc: -1 },
    { dr:  0, dc:  1 },
  ],

  muovi: function() {
    const opposta = { dr: -this.direzione.dr, dc: -this.direzione.dc };

    const prossimaRiga    = this.riga    + this.direzione.dr;
    const prossimaColonna = this.colonna + this.direzione.dc;

    if (!labirinto.èMuro(prossimaRiga, prossimaColonna)) {
      this.riga    = prossimaRiga;
      this.colonna = prossimaColonna;
    } else {
      // cerca direzioni libere escludendo quella opposta TOGLIENDO DAL VETTORE LE DIREZIONI IMPOSSIBILI
      const direzioniLibere = this.tutteLeDirezioni.filter(function(d) {
        return !labirinto.èMuro(this.riga + d.dr, this.colonna + d.dc) &&
               !(d.dr === opposta.dr && d.dc === opposta.dc);
      }.bind(this));

      // se è un vicolo cieco accetta anche quella opposta
      let scelte = direzioniLibere;
      if (direzioniLibere.length === 0) {
        scelte = this.tutteLeDirezioni.filter(function(d) {
          return !labirinto.èMuro(this.riga + d.dr, this.colonna + d.dc);
        }.bind(this));
      }

      if (scelte.length > 0) {
        // sceglie a caso tra quelle disponibili
        this.direzione = scelte[Math.floor(Math.random() * scelte.length)];
        this.riga    += this.direzione.dr;
        this.colonna += this.direzione.dc;
      }
    }
  },

  controllaCollisione: function() {
    if (this.riga === pacman.riga && this.colonna === pacman.colonna) {
      finePartita = true;
      labirinto.disegna();
      document.getElementById('messaggio').textContent = 'HAI PERSO! Punteggio: ' + punteggio;
    }
  },

  // disegna il fantasma rosso con la forma a denti in basso
  disegna: function() {
    const x      = this.colonna * labirinto.CELLA + labirinto.CELLA / 2;
    const y      = this.riga    * labirinto.CELLA + labirinto.CELLA / 2;
    const raggio = labirinto.CELLA / 2 - 2;

    labirinto.ctx.fillStyle = '#FF0000';
    labirinto.ctx.beginPath();
    labirinto.ctx.arc(x, y - 2, raggio, Math.PI, 0);
    labirinto.ctx.lineTo(x + raggio, y + raggio - 2);
    labirinto.ctx.lineTo(x + raggio * 0.6, y + raggio * 0.5);
    labirinto.ctx.lineTo(x + raggio * 0.3, y + raggio - 2);
    labirinto.ctx.lineTo(x,                y + raggio * 0.5);
    labirinto.ctx.lineTo(x - raggio * 0.3, y + raggio - 2);
    labirinto.ctx.lineTo(x - raggio * 0.6, y + raggio * 0.5);
    labirinto.ctx.lineTo(x - raggio,       y + raggio - 2);
    labirinto.ctx.closePath();
    labirinto.ctx.fill();
  }
};