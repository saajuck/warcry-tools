const data = [];

function calculerDps({ attaques, degat, degatCrit }) {
  const pCrit = 1 / 6;
  const dpsParAttaque = (
    (1 / 3) * (pCrit * degatCrit + (4 / 6) * degat) +
    (1 / 3) * (pCrit * degatCrit + (2 / 6) * degat) +
    (1 / 3) * (pCrit * degatCrit + (1 / 6) * degat)
  );
  return +(attaques * dpsParAttaque).toFixed(3);
}

function comparer(entites, configCritères) {
  const minMax = {};
  for (const { champ } of configCritères) {
    const valeurs = entites.map(e => e[champ]);
    minMax[champ] = {
      min: Math.min(...valeurs),
      max: Math.max(...valeurs)
    };
  }

  return entites.map(entite => {
    let score = 0;
    for (const { champ, poids, optimiser } of configCritères) {
      const { min, max } = minMax[champ];
      let val = entite[champ];
      let norm = (max === min) ? 0.5 : (val - min) / (max - min);
      if (optimiser === "min") norm = 1 - norm;
      score += poids * norm;
    }
    return { ...entite, score: +score.toFixed(3) };
  }).sort((a, b) => b.score - a.score);
}

let PONDERATION = {
  cout: 0.8,
  attaques: 0.1,
  force: 0.1,
  degat: 0.1,
  degatCrit: 0.1,
  range: 0.05,
  dps: 0.8,
  pv: 0.2,
  endurance: 0.3,
  movement: 0.3
};

const criteres = [
  { champ: "cout", poids: PONDERATION.cout, optimiser: "min" },
  { champ: "attaques", poids: PONDERATION.attaques, optimiser: "max" },
  { champ: "force", poids: PONDERATION.force, optimiser: "max" },
  { champ: "degat", poids: PONDERATION.degat, optimiser: "max" },
  { champ: "degatCrit", poids: PONDERATION.degatCrit, optimiser: "max" },
  { champ: "range", poids: PONDERATION.range, optimiser: "max" },
  { champ: "dps", poids: PONDERATION.dps, optimiser: "max" },
  { champ: "pv", poids: PONDERATION.pv, optimiser: "max" },
  { champ: "endurance", poids: PONDERATION.endurance, optimiser: "max" },
  { champ: "movement", poids: PONDERATION.movement, optimiser: "max" },
];

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const entite = Object.fromEntries(formData.entries());

  // Convertir les valeurs en numérique
  for (const key in entite) {
    if (key !== "nom" && !key.includes("Ponderation")) entite[key] = parseFloat(entite[key]);
  }
  entite.dps = calculerDps(entite);

  // Ajouter le personnage à la liste
  data.push(entite);

  // Mettre à jour les pondérations si nécessaire
  const pond = {};
  for (const key in formData.entries()) {
    if (key.includes("Ponderation")) {
      const crit = key.replace('Ponderation', '');
      pond[crit] = parseFloat(formData.get(key));
    }
  }

  // Mettre à jour les pondérations
  PONDERATION = { ...PONDERATION, ...pond };

  e.target.reset(); // Reset form
});

document.getElementById("calculer").addEventListener("click", () => {
  const results = comparer(data, criteres);
  afficherResultats(results);
});

function afficherResultats(data) {
  const table = document.getElementById("resultats");
  if (data.length === 0) return;
  const cols = Object.keys(data[0]);

  table.innerHTML = `
    <thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>
      ${data.map(row =>
        `<tr>${cols.map(c => `<td>${row[c]}</td>`).join("")}</tr>`
      ).join("")}
    </tbody>
  `;
}
