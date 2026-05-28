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

  // quanti pixel occupa ogni cella sullo schermo
  CELLA: 28,

  //inizializza tutto prima che il gioco parta
  init: function() {
    // conta C e R
    this.RIGHE = this.mappa.length;
    this.COLONNE = this.mappa[0].length;
    //imposta la canvas moltiplicando le C per R per il num di pixel
    this.canvas = document.getElementById('canvas');
    this.canvas.width  = this.COLONNE * this.CELLA;
    this.canvas.height = this.RIGHE * this.CELLA;
    this.ctx = this.canvas.getContext('2d');

    //copia della mappa per ricomincia
    this.griglia = this.mappa.map(riga => [...riga]);
    const palliniDiPartenza = [];
    const buchiDelTunnel = [ [10, 0], [10, 18] ];

    //spostamento pallini da celle spawn a tunnel
    [[1, 1], [16, 9]].forEach(([r, c]) => {
      if (this.griglia[r][c] === 0 || this.griglia[r][c] === 3) {
        palliniDiPartenza.push(this.griglia[r][c]);
        this.griglia[r][c] = 2;
      }
    });
    palliniDiPartenza.forEach((tipo, index) => {
      const [r, c] = buchiDelTunnel[index];
      if (this.griglia[r][c] === 2) this.griglia[r][c] = tipo;
    });

    //controllo dei pallini presenti scorrendo cella per cella
    this.totalePallini = 0;
    for (let r = 0; r < this.RIGHE; r++)
      for (let c = 0; c < this.COLONNE; c++)
        if (this.griglia[r][c] === 0 || this.griglia[r][c] === 3) this.totalePallini++;
  },

  // restituisce true se la cella è un muro o fuori dalla mappa
  // eccezione: nella riga 10 (tunnel) si può uscire dai bordi per il teletrasporto
  èMuro: function(r, c) {
    if (r === 10 && (c < 0 || c >= this.COLONNE)) return false;
    if (r < 0 || r >= this.RIGHE || c < 0 || c >= this.COLONNE) return true;
    return this.griglia[r][c] === 1;
  },

  // disegna mappa
  disegna: function() {
    // sfondo nero
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // scorre le celle della griglia e calcola la posizione di ciascuna
    for (let r = 0; r < this.RIGHE; r++) {
      for (let c = 0; c < this.COLONNE; c++) {
        const x= c * this.CELLA;
        const y= r * this.CELLA;
        const cella = this.griglia[r][c];

        if (cella === 1) {
          // muro 
          this.ctx.fillStyle = 'hsl(212, 100%, 26%)';
          this.ctx.fillRect(x + 1, y + 1, this.CELLA - 2, this.CELLA - 2);
          this.ctx.strokeStyle = 'hsl(212, 100%, 26%)';
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(x + 2, y + 2, this.CELLA - 4, this.CELLA - 4);

        } else if (cella === 0) {
          // piccolo
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.arc(x + this.CELLA / 2, y + this.CELLA / 2, 3, 0, Math.PI * 2);
          this.ctx.fill();

        } else if (cella === 3) {
          // grande 
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