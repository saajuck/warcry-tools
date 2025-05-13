
function calculerDps({ attaques, degat, degatCrit }) {
    const pCrit = 1 / 6;
    const pDegatTotal = (4 + 2 + 1) / 6; // somme proba normales (3+, 4+, 5+) = 7/6
  
    const dpsParAttaque = (
      (1 / 3) * (pCrit * degatCrit + (4 / 6) * degat) +
      (1 / 3) * (pCrit * degatCrit + (2 / 6) * degat) +
      (1 / 3) * (pCrit * degatCrit + (1 / 6) * degat)
    );
  
    return (attaques * dpsParAttaque).toFixed(3);
  }

function comparer(entites, configCritères) {
    // Extraire min/max pour chaque critère
    const minMax = {};
    for (const { champ } of configCritères) {
      const valeurs = entites.map(e => e[champ]);
      minMax[champ] = {
        min: Math.min(...valeurs),
        max: Math.max(...valeurs)
      };
    }
  
    // Normalisation + score pondéré
    return entites.map(entite => {
      let score = 0;
  
      for (const { champ, poids, optimiser } of configCritères) {
        const { min, max } = minMax[champ];
        let val = entite[champ];
        let norm = (max === min) ? 0.5 : (val - min) / (max - min);
  
        // Inverser si on veut minimiser
        if (optimiser === "min") norm = 1 - norm;
  
        score += poids * norm;
      }
  
      return { ...entite, score: score.toFixed(3) };
    }).sort((a, b) => b.score - a.score); // tri décroissant
  }



  const data = [
    { nom: "Vampire Lord", cout: 225, attaques: 4, force: 4, degat: 2, degatCrit: 6, pv: 25, movement: 5,range: 1, endurance: 5 },
    { nom: "Prince Duvalle", cout: 210, attaques: 4, force: 4, degat: 2, degatCrit: 6, pv: 26, movement: 5, range: 1,endurance: 4 },
    { nom: "Vyrkos", cout: 135, attaques: 4, force: 4, degat: 1, degatCrit: 5, pv: 15, movement: 8,range: 1, endurance: 3 },
    { nom: "Gorath", cout: 130, attaques: 2, force: 4, degat: 3, degatCrit: 6, pv: 18, movement: 5, range: 2, endurance: 4 },
    { nom: "Ennias Curse-Born", cout: 120, attaques: 4, force: 3, degat: 1, degatCrit: 4, pv: 16, movement: 6, range: 1, endurance: 3 },
    { nom: "Vellas Von Faine", cout: 105, attaques: 4, force: 3, degat: 1, degatCrit: 5, pv: 16, movement: 5, range: 1,endurance: 4 },
    { nom: "Vargheist", cout: 190, attaques: 4, force: 4, degat: 1, degatCrit: 4, pv: 28, movement: 8,range: 1, endurance: 4 },
    { nom: "Vargoyle", cout: 260, attaques: 4, force: 4, degat: 2, degatCrit: 5, pv: 28, movement: 8, range: 1,endurance: 4 },
    { nom: "Wight King", cout: 135, attaques: 4, force: 4, degat: 2, degatCrit: 5, pv: 25, movement: 3,range: 1, endurance: 5 },
    { nom: "Vargskyr", cout: 185, attaques: 2, force: 5, degat: 3, degatCrit: 6, pv: 32, movement: 6, range: 2, endurance: 4 },
    { nom: "Kosargi Nightguard", cout: 140, attaques: 2, force: 5, degat: 2, degatCrit: 5, pv: 30, movement: 4, range: 2, endurance: 4 },
    { nom: "Seneschal", cout: 100, attaques: 3, force: 5, degat: 2, degatCrit: 4, pv: 15, movement: 3, range: 1, endurance: 4 },
    { nom: "Champion with Halberd", cout: 75, attaques: 3, force: 3, degat: 1, degatCrit: 4, pv: 12, movement: 3, range: 2, endurance: 4 },
    { nom: "Champion with Mace", cout: 70, attaques: 4, force: 3, degat: 1, degatCrit: 3, pv: 12, movement: 3, range: 1, endurance: 4 },
    { nom: "gg Great Wight Blade", cout: 70, attaques: 3, force: 5, degat: 2, degatCrit: 4, pv: 10, movement: 3, range: 1, endurance: 3 },
    { nom: "gg Shield", cout: 60, attaques: 3, force: 4, degat: 1, degatCrit: 4, pv: 10, movement: 3, range: 1, endurance: 4 },
    { nom: "Skeleton with Blade", cout: 50, attaques: 3, force: 3, degat: 1, degatCrit: 3, pv: 8, movement: 3, range: 1, endurance: 4 },
    { nom: "Skeleton with Spear", cout: 50, attaques: 2, force: 3, degat: 1, degatCrit: 4, pv: 8, movement: 3, range: 2, endurance: 4 },
    { nom: "Abhorrant Archregent", cout: 205, attaques: 4, force: 4, degat: 3, degatCrit: 5, pv: 25, movement: 5, range: 1, endurance: 4 },
  ].map(obj => ({
    ...obj,
    dps: calculerDps(obj),
  }));

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
    { champ: "movement", poids: PONDERATION.movement, optimiser: "max" },
  ];
  
  console.table(comparer(data, criteres));