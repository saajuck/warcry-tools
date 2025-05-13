const data = [];

const PONDERATION = {
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
  { champ: "movement", poids: PONDERATION.movement, optimiser: "max" }
];

function calculerDps({ attaques, degat, degatCrit }) {
  const pCrit = 1 / 6;
  const dpsParAttaque =
    (1 / 3) * (pCrit * degatCrit + (4 / 6) * degat) +
    (1 / 3) * (pCrit * degatCrit + (2 / 6) * degat) +
    (1 / 3) * (pCrit * degatCrit + (1 / 6) * degat);
  return (attaques * dpsParAttaque).toFixed(3);
}

function comparer(entites, configCritères) {
  const minMax = {};
  for (const { champ } of configCritères) {
    const valeurs = entites.map(e => parseFloat(e[champ]));
    minMax[champ] = { min: Math.min(...valeurs), max: Math.max(...valeurs) };
  }

  return entites.map(entite => {
    let score = 0;
    for (const { champ, poids, optimiser } of configCritères) {
      const { min, max } = minMax[champ];
      let val = parseFloat(entite[champ]);
      let norm = (max === min) ? 0.5 : (val - min) / (max - min);
      if (optimiser === "min") norm = 1 - norm;
      score += poids * norm;
    }
    return { ...entite, score: score.toFixed(3) };
  }).sort((a, b) => b.score - a.score);
}

function renderTable() {
  const tbody = document.querySelector("#resultatTable tbody");
  tbody.innerHTML = "";
  const resultats = comparer(data, criteres);

  resultats.forEach((entite, index) => {
    const tr = document.createElement("tr");

    const tdDelete = document.createElement("td");
    tdDelete.className = "delete-btn";
    tdDelete.textContent = "❌";
    tdDelete.onclick = () => {
      data.splice(index, 1);
      renderTable();
    };
    tr.appendChild(tdDelete);

    ["nom", "cout", "attaques", "force", "degat", "degatCrit", "pv", "movement", "range", "endurance", "dps", "score"].forEach(champ => {
      const td = document.createElement("td");
      td.textContent = entite[champ];
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  document.getElementById("resultatTable").style.display = data.length ? "table" : "none";
}

document.getElementById("personnageForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const obj = Object.fromEntries(formData.entries());

  for (let key in obj) {
    if (key !== "nom") obj[key] = parseFloat(obj[key]);
  }

  obj.dps = calculerDps(obj);
  data.push(obj);
  renderTable();
  form.reset();
});
