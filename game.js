const mappa = [
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
];

// numero di righe e colonne della mappa
const RIGHE   = mappa.length;
const COLONNE = mappa[0].length;
const CELLA   = 28; //numero di pixel per cella singola

// prende il canvas dall'html e imposta larghezza e altezza in base alla mappa
const canvas = document.getElementById('canvas');
canvas.width  = COLONNE * CELLA;
canvas.height = RIGHE   * CELLA;
const ctx = canvas.getContext('2d');

// copia modificabile della mappa (quella originale non viene toccata)
let griglia = mappa.map(r => [...r]); 

// variabili per tenere traccia del punteggio e dei pallini
let punteggio      = 0;
let totallePallini = 0;
let palliniMangiati = 0;

// Conta quanti pallini ci sono in totale
for (let r = 0; r < RIGHE; r++) 
  for (let c = 0; c < COLONNE; c++)
    if (griglia[r][c] === 0 || griglia[r][c] === 3) totallePallini++;

// oggetto che rappresenta pacman con la sua posizione e direzione
let pac = {
  riga: 16,          // posizione di partenza (riga)
  col:  9,           // posizione di partenza (colonna)
  boccaAngolo: 0.25, // frazione di π per l'apertura della bocca (fissa, non si anima)
  direzione:   { dr: 0, dc: 0 }, // direzione attuale
  prossimaDir: { dr: 0, dc: 0 }  // direzione che verrà applicata appena possibile
};

// ascolta i tasti freccia e salva la direzione desiderata in prossimaDir
document.addEventListener('keydown', e => {
  const tasti = {
    'ArrowUp':    { dr: -1, dc:  0 },
    'ArrowDown':  { dr:  1, dc:  0 },
    'ArrowLeft':  { dr:  0, dc: -1 },
    'ArrowRight': { dr:  0, dc:  1 },
  };
  if (tasti[e.key]) {
    e.preventDefault();
    pac.prossimaDir = tasti[e.key];
  }
});

// restituisce true se la cella è un muro o fuori dalla mappa
function èMuro(r, c) {
  if (r < 0 || r >= RIGHE || c < 0 || c >= COLONNE) return true;
  return griglia[r][c] === 1;
}

// Vede se la posizione in cui vuole muoversi il pacman è libera, se è libera ci va senno no
function muoviPacman() {
  // prova a cambiare direzione se la nuova è libera
  let nr = pac.riga + pac.prossimaDir.dr;
  let nc = pac.col  + pac.prossimaDir.dc;
  if (!èMuro(nr, nc)) {
    pac.direzione = { ...pac.prossimaDir };
  }

  // muovi nella direzione attuale se la cella è libera
  nr = pac.riga + pac.direzione.dr;
  nc = pac.col  + pac.direzione.dc;
  if (!èMuro(nr, nc)) {
    pac.riga = nr;
    pac.col  = nc;
  }

  // controlla se pacman è su un pallino e lo mangia
  const cella = griglia[pac.riga][pac.col];
  if (cella === 0) {
    griglia[pac.riga][pac.col] = 2; // rimuove il pallino dalla griglia
    punteggio += 10;
    palliniMangiati++;
  } else if (cella === 3) {
    griglia[pac.riga][pac.col] = 2; // rimuove il pallino grande dalla griglia
    punteggio += 50;
    palliniMangiati++;
  }

  // aggiorna il punteggio mostrato nell'html
  document.getElementById('punteggio').textContent = punteggio;
}

// ridisegna tutto il canvas ad ogni frame
function disegna() {
  // sfondo nero
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // disegna ogni cella della mappa
  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      const x   = c * CELLA;
      const y   = r * CELLA;
      const val = griglia[r][c];

      if (val === 1) {
        // muro blu
        ctx.fillStyle = 'hsl(212, 100%, 26%)';
        ctx.fillRect(x + 1, y + 1, CELLA - 2, CELLA - 2);
        ctx.strokeStyle = 'hsl(212, 100%, 26%)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, CELLA - 4, CELLA - 4);

      } else if (val === 0) {
        // pallino piccolo giallo
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + CELLA / 2, y + CELLA / 2, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (val === 3) {
        // pallino grande giallo
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + CELLA / 2, y + CELLA / 2, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // calcola la posizione in pixel del centro di pacman
  const px     = pac.col  * CELLA + CELLA / 2;
  const py     = pac.riga * CELLA + CELLA / 2;
  const raggio = CELLA / 2 - 2;

  // ruota pacman in base alla direzione in cui si muove
  let angBase = 0;
  const d = pac.direzione;
  if      (d.dc ===  1) angBase = 0;             // destra
  else if (d.dc === -1) angBase = Math.PI;        // sinistra
  else if (d.dr === -1) angBase = -Math.PI / 2;  // su
  else if (d.dr ===  1) angBase =  Math.PI / 2;  // giù

  // bocca sempre aperta con angolo fisso
  const bocca = pac.boccaAngolo * Math.PI;

  // disegna il corpo di pacman come un cerchio con uno spicchio mancante (la bocca)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, raggio, angBase + bocca, angBase + Math.PI * 2 - bocca);
  ctx.closePath();
  ctx.fill();

  // crea l'occhio di pacman
  const occhioX = px + Math.cos(angBase - Math.PI / 4) * raggio * 0.5;
  const occhioY = py + Math.sin(angBase - Math.PI / 4) * raggio * 0.5;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(occhioX, occhioY, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

let frame    = 0;
let gameOver = false;

// loop principale del gioco, viene chiamato ad ogni frame dal browser
function loop() {
  if (gameOver) return;

  frame++;

  // aggiorna la logica ogni 8 frame (circa 7 volte al secondo)
  if (frame % 8 === 0) {
    muoviPacman();
  }

  disegna();

  // controlla se ha vinto (tutti i pallini mangiati)
  if (palliniMangiati >= totallePallini) {
    gameOver = true;
    disegna();
    document.getElementById('messaggio').textContent = 'HAI VINTO, il tuo punteggio è: ' + punteggio;
    return;
  }
  requestAnimationFrame(loop);
}
loop();