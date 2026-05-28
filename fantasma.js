//posizione iniziale fantasma e dice che si muove verso l'alto per iniziare
let fantasma = {
  riga:10,
  colonna:9,
  direzione: { dr:-1, dc:0 },

  tutteLeDirezioni: [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ],

  muovi: function() {
    const opposta = { dr: -this.direzione.dr, dc: -this.direzione.dc }; // non fa tornare indietro fantasma
    //vede se la prossima direzione non è muro
    const direzioniLibere = this.tutteLeDirezioni.filter(function(d) {
      return !labirinto.èMuro(this.riga + d.dr, this.colonna + d.dc);
    }.bind(this));

    // rimuove la direzione opposta tra quelle possibili
    const direzioniNonOpposte = direzioniLibere.filter(function(d) {
      return !(d.dr === opposta.dr && d.dc === opposta.dc);
    });

    // sceglie direzione random se ci sono piu scelte 
    let scelte = direzioniNonOpposte.length > 0 ? direzioniNonOpposte : direzioniLibere;
    if (scelte.length > 1) {
      this.direzione = scelte[Math.floor(Math.random() * scelte.length)];
    } else if (scelte.length === 1) {
      this.direzione = scelte[0];
    }

    // aggiorna la posizione
    if (this.direzione) {
      this.riga += this.direzione.dr;
      this.colonna += this.direzione.dc;
      this.passaNelTunnel();
    }
  },

  //controlla se è nel tunnel
  passaNelTunnel: function() {
    if (this.riga !== 10) return;
    if (this.colonna < 0) this.colonna = labirinto.COLONNE - 1;
    if (this.colonna >= labirinto.COLONNE) this.colonna = 0;
  },

  // trova il centro della cella e disegna il fantasma
  disegna: function() {
    const x = this.colonna * labirinto.CELLA + labirinto.CELLA / 2;
    const y = this.riga * labirinto.CELLA + labirinto.CELLA / 2;
    const raggio = labirinto.CELLA / 2 - 2;
    labirinto.ctx.fillStyle = '#FF0000';
    labirinto.ctx.beginPath();
    labirinto.ctx.arc(x, y - 2, raggio, Math.PI, 0);
    labirinto.ctx.lineTo(x + raggio, y + raggio - 2);
    labirinto.ctx.lineTo(x + raggio * 0.6, y + raggio * 0.5);
    labirinto.ctx.lineTo(x + raggio * 0.3, y + raggio - 2);
    labirinto.ctx.lineTo(x, y + raggio * 0.5);
    labirinto.ctx.lineTo(x - raggio * 0.3, y + raggio - 2);
    labirinto.ctx.lineTo(x - raggio * 0.6, y + raggio * 0.5);
    labirinto.ctx.lineTo(x - raggio, y + raggio - 2);
    labirinto.ctx.closePath();
    labirinto.ctx.fill();
  }
};