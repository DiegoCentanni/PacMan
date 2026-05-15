// oggetto che rappresenta il labirinto
let labirinto = {
  // 1 = muro, 0 = pallino piccolo, 2 = spazio vuoto, 3 = pallino grande
  mappa: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,3,1,1,0,1,2,1,0,1,0,1,2,1,0,1,1,3,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,2,1,2,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,1,0,1,2,2,2,1,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,0,1,1,2,1,1,0,1,0,1,1,1,1],
    [2,2,2,2,0,0,0,1,2,2,2,1,0,0,0,2,2,2,2],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,1,0,1,2,2,2,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,2,1,2,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,3,1,1,0,1,2,1,0,1,0,1,2,1,0,1,1,3,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,2,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],

  // numero di righe e colonne della mappa
  RIGHE: 0,
  COLONNE: 0,

  // quanti pixel occupa ogni cella sullo schermo
  CELLA: 28,

  // prende il canvas dall'html e imposta larghezza e altezza in base alla mappa
  canvas: null,

  // ctx è il "pennello" con cui disegniamo dentro il canvas
  ctx: null,

  // copia modificabile della mappa (quella originale non viene mai toccata)
  griglia: null,

  // quanti pallini ci sono in totale all'inizio della partita
  totalePallini: 0,

  init: function() {
    this.RIGHE = this.mappa.length;
    this.COLONNE = this.mappa[0].length;
    this.canvas = document.getElementById('canvas');
    this.canvas.width  = this.COLONNE * this.CELLA;
    this.canvas.height = this.RIGHE   * this.CELLA;
    this.ctx = this.canvas.getContext('2d');
    this.griglia = this.mappa.map(riga => [...riga]);
    this.totalePallini = 0;
    for (let r = 0; r < this.RIGHE; r++)
      for (let c = 0; c < this.COLONNE; c++)
        if (this.griglia[r][c] === 0 || this.griglia[r][c] === 3) this.totalePallini++;
  },

  // restituisce true se la cella è un muro o fuori dalla mappa
  // eccezione: nella riga 10 (tunnel) si può uscire dai bordi per il teletrasporto
  èMuro: function(r, c) {
    if (r === 10 && (c < 0 || c >= this.COLONNE)) return false; // tunnel: non è muro
    if (r < 0 || r >= this.RIGHE || c < 0 || c >= this.COLONNE) return true;
    return this.griglia[r][c] === 1;
  },

  // disegna tutte le celle della mappa: muri, pallini piccoli e pallini grandi
  disegna: function() {
    // sfondo nero
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < this.RIGHE; r++) {
      for (let c = 0; c < this.COLONNE; c++) {
        const x    = c * this.CELLA;
        const y    = r * this.CELLA;
        const cella = this.griglia[r][c];

        if (cella === 1) {
          // muro blu
          this.ctx.fillStyle = 'hsl(212, 100%, 26%)';
          this.ctx.fillRect(x + 1, y + 1, this.CELLA - 2, this.CELLA - 2);
          this.ctx.strokeStyle = 'hsl(212, 100%, 26%)';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(x + 2, y + 2, this.CELLA - 4, this.CELLA - 4);

        } else if (cella === 0) {
          // pallino piccolo giallo
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.arc(x + this.CELLA / 2, y + this.CELLA / 2, 3, 0, Math.PI * 2);
          this.ctx.fill();

        } else if (cella === 3) {
          // pallino grande giallo
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.arc(x + this.CELLA / 2, y + this.CELLA / 2, 7, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }
};

// inizializza il labirinto
labirinto.init();