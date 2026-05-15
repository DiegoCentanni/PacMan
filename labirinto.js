// 1 = muro, 0 = pallino piccolo, 2 = spazio vuoto, 3 = pallino grande
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
const RIGHE = mappa.length;
const COLONNE = mappa[0].length;

// quanti pixel occupa ogni cella sullo schermo
const CELLA = 28;

// prende il canvas dall'html e imposta larghezza e altezza in base alla mappa
const canvas = document.getElementById('canvas');
canvas.width  = COLONNE * CELLA;
canvas.height = RIGHE   * CELLA;

// ctx è il "pennello" con cui disegniamo dentro il canvas
const ctx = canvas.getContext('2d');

// copia modificabile della mappa (quella originale non viene mai toccata)
let griglia = mappa.map(riga => [...riga]);

// conta quanti pallini ci sono in totale all'inizio della partita
let totallePallini = 0;
for (let r = 0; r < RIGHE; r++)
  for (let c = 0; c < COLONNE; c++)
    if (griglia[r][c] === 0 || griglia[r][c] === 3) totallePallini++;

// restituisce true se la cella è un muro o fuori dalla mappa
// eccezione: nella riga 10 (tunnel) si può uscire dai bordi per il teletrasporto
function èMuro(r, c) {
  if (r === 10 && (c < 0 || c >= COLONNE)) return false; // tunnel: non è muro
  if (r < 0 || r >= RIGHE || c < 0 || c >= COLONNE) return true;
  return griglia[r][c] === 1;
}

// disegna tutte le celle della mappa: muri, pallini piccoli e pallini grandi
function disegnaLabirinto() {
  // sfondo nero
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < RIGHE; r++) {
    for (let c = 0; c < COLONNE; c++) {
      const x    = c * CELLA;
      const y    = r * CELLA;
      const cella = griglia[r][c];

      if (cella === 1) {
        // muro blu
        ctx.fillStyle = 'hsl(212, 100%, 26%)';
        ctx.fillRect(x + 1, y + 1, CELLA - 2, CELLA - 2);
        ctx.strokeStyle = 'hsl(212, 100%, 26%)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, CELLA - 4, CELLA - 4);

      } else if (cella === 0) {
        // pallino piccolo giallo
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + CELLA / 2, y + CELLA / 2, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (cella === 3) {
        // pallino grande giallo
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + CELLA / 2, y + CELLA / 2, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}