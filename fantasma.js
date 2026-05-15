let fantasma = {
  riga:      1,
  colonna:   1,
  direzione: { dr: 0, dc: 1 }
};

const tutteLeDirezioni = [
  { dr: -1, dc:  0 },
  { dr:  1, dc:  0 },
  { dr:  0, dc: -1 },
  { dr:  0, dc:  1 },
];

function muoviFantasma() {
  const opposta = { dr: -fantasma.direzione.dr, dc: -fantasma.direzione.dc };

  const prossimaRiga    = fantasma.riga    + fantasma.direzione.dr;
  const prossimaColonna = fantasma.colonna + fantasma.direzione.dc;

  if (!èMuro(prossimaRiga, prossimaColonna)) {
    fantasma.riga    = prossimaRiga;
    fantasma.colonna = prossimaColonna;
  } else {
    // cerca direzioni libere escludendo quella opposta
    const direzioniLibere = tutteLeDirezioni.filter(function(d) {
      return !èMuro(fantasma.riga + d.dr, fantasma.colonna + d.dc) &&
             !(d.dr === opposta.dr && d.dc === opposta.dc);
    });

    // se è un vicolo cieco accetta anche quella opposta
    let scelte = direzioniLibere;
    if (direzioniLibere.length === 0) {
      scelte = tutteLeDirezioni.filter(function(d) {
        return !èMuro(fantasma.riga + d.dr, fantasma.colonna + d.dc);
      });
    }

    if (scelte.length > 0) {
      // sceglie a caso tra quelle disponibili
      fantasma.direzione = scelte[Math.floor(Math.random() * scelte.length)];
      fantasma.riga    += fantasma.direzione.dr;
      fantasma.colonna += fantasma.direzione.dc;
    }
  }
}

// se il fantasma tocca pacman si perde
function controllaCollisione() {
  if (fantasma.riga === pacman.riga && fantasma.colonna === pacman.colonna) {
    finePartita = true;
    disegna();
    document.getElementById('messaggio').textContent = 'HAI PERSO! Punteggio: ' + punteggio;
  }
}

// disegna il fantasma rosso con la forma a denti in basso
function disegnaFantasma() {
  const x      = fantasma.colonna * CELLA + CELLA / 2;
  const y      = fantasma.riga    * CELLA + CELLA / 2;
  const raggio = CELLA / 2 - 2;

  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.arc(x, y - 2, raggio, Math.PI, 0);
  ctx.lineTo(x + raggio, y + raggio - 2);
  ctx.lineTo(x + raggio * 0.6, y + raggio * 0.5);
  ctx.lineTo(x + raggio * 0.3, y + raggio - 2);
  ctx.lineTo(x,                y + raggio * 0.5);
  ctx.lineTo(x - raggio * 0.3, y + raggio - 2);
  ctx.lineTo(x - raggio * 0.6, y + raggio * 0.5);
  ctx.lineTo(x - raggio,       y + raggio - 2);
  ctx.closePath();
  ctx.fill();
}