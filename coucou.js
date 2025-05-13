const PONDERATION = {
    dps: 0.8,
    pv: 0.2,
    endurance: 0.3,
    range: 0.05,
    movement: 0.3
  };
  
  const SOMME_PONDERATION = Object.values(PONDERATION).reduce((a, b) => a + b, 0);

  class Profil {
    constructor({ nom, cout, attaques, force, degat, degatCrit, pv, endurance, range = 1, movement }) {
      this.nom = nom;
      this.cout = cout;
      this.attaques = attaques;
      this.force = force;
      this.degat = degat;
      this.degatCrit = degatCrit;
      this.pv = pv;
      this.endurance = endurance;
      this.range = range;
      this.movement = movement;
    }
  
    static getProbas(force, defense) {
      if (force < defense) return { crit: 1 / 6, normal: 1 / 6 };
      if (force === defense) return { crit: 1 / 6, normal: 2 / 6 };
      return { crit: 1 / 6, normal: 3 / 6 };
    }
  
    getDpsMoyen(defenses = [3, 4, 5]) {
      let total = 0;
      for (const def of defenses) {
        const { crit, normal } = Profil.getProbas(this.force, def);
        const dps = this.attaques * (
          this.degat * normal + this.degatCrit * crit
        );
        total += dps;
      }
      return total / defenses.length;
    }
  
    getRangeScore() {
      if (this.range >= 3) return 0.5;
      if (this.range === 2) return 0.25;
      return 0;
    }
  
    static normalize(value, min, max) {
      if (max === min) return 0;
      return (value - min) / (max - min);
    }
  
    getIndiceBrut() {
      const dps = this.getDpsMoyen();
      const dpsNorm = Profil.normalize(dps, ...Profil.minMax.dps);
      const pvNorm = Profil.normalize(this.pv, ...Profil.minMax.pv);
      const endNorm = Profil.normalize(this.endurance, ...Profil.minMax.endurance);
      const rangeNorm = Profil.normalize(this.getRangeScore(), ...Profil.minMax.range);
      const moveNorm = Profil.normalize(this.movement, ...Profil.minMax.movement);
  
      return (
        dpsNorm * PONDERATION.dps +
        pvNorm * PONDERATION.pv +
        endNorm * PONDERATION.endurance +
        rangeNorm * PONDERATION.range +
        moveNorm * PONDERATION.movement
      ) / SOMME_PONDERATION;
    }
  
    getIndiceGlobal() {
      return this.getIndiceBrut() / Math.sqrt(this.cout) * 10;
    }
  
    getRow() {
      const dps = this.getDpsMoyen();
      const dpsNorm = Profil.normalize(dps, ...Profil.minMax.dps);
      const pvNorm = Profil.normalize(this.pv, ...Profil.minMax.pv);
      const endNorm = Profil.normalize(this.endurance, ...Profil.minMax.endurance);
      const rangeNorm = Profil.normalize(this.getRangeScore(), ...Profil.minMax.range);
      const moveNorm = Profil.normalize(this.movement, ...Profil.minMax.movement);
  
      const dpsW = dpsNorm * PONDERATION.dps;
      const pvW = pvNorm * PONDERATION.pv;
      const endW = endNorm * PONDERATION.endurance;
      const rangeW = rangeNorm * PONDERATION.range;
      const moveW = moveNorm * PONDERATION.movement;
  
      return {
        nom: this.nom,
        cout: this.cout,
        stats: `${this.attaques}A ${this.force}F ${this.degat}/${this.degatCrit} ${this.range}R ${this.movement}M ${this.pv}PV ${this.endurance}E`,
        dpsMoyen: dps.toFixed(2),
        indiceBrut: (dpsW + pvW + endW + rangeW + moveW).toFixed(3),
        indiceGlobal: this.getIndiceGlobal().toFixed(2),
        details: `dps ${dpsW.toFixed(3)} + pv ${pvW.toFixed(3)} + end ${endW.toFixed(3)} + range ${rangeW.toFixed(3)} + move ${moveW.toFixed(3)}`
      };
    }
  }
  
  
  const data = [
    { nom: "Vampire Lord", cout: 225, attaques: 4, force: 4, degat: 2, degatCrit: 6, pv: 25, movement: 5, endurance: 5 },
    { nom: "Prince Duvalle", cout: 210, attaques: 4, force: 4, degat: 2, degatCrit: 6, pv: 26, movement: 5, endurance: 4 },
    { nom: "Vyrkos", cout: 135, attaques: 4, force: 4, degat: 1, degatCrit: 5, pv: 15, movement: 8, endurance: 3 },
    { nom: "Gorath", cout: 130, attaques: 2, force: 4, degat: 3, degatCrit: 6, pv: 18, movement: 5, range: 2, endurance: 4 },
    { nom: "Ennias Curse-Born", cout: 120, attaques: 4, force: 3, degat: 1, degatCrit: 4, pv: 16, movement: 6, range: 1, endurance: 3 },
    { nom: "Vellas Von Faine", cout: 105, attaques: 4, force: 3, degat: 1, degatCrit: 5, pv: 16, movement: 5, endurance: 4 },
    { nom: "Vargheist", cout: 190, attaques: 4, force: 4, degat: 1, degatCrit: 4, pv: 28, movement: 8, endurance: 4 },
    { nom: "Vargoyle", cout: 260, attaques: 4, force: 4, degat: 2, degatCrit: 5, pv: 28, movement: 8, endurance: 4 },
    { nom: "Wight King", cout: 135, attaques: 4, force: 4, degat: 2, degatCrit: 5, pv: 25, movement: 3, endurance: 5 },
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
  ];
  // Calcul des min/max pour normalisation
  const allProfils = data.map(p => new Profil(p));
  Profil.minMax = {
    dps: [Math.min(...allProfils.map(p => p.getDpsMoyen())), Math.max(...allProfils.map(p => p.getDpsMoyen()))],
    pv: [Math.min(...allProfils.map(p => p.pv)), Math.max(...allProfils.map(p => p.pv))],
    endurance: [Math.min(...allProfils.map(p => p.endurance)), Math.max(...allProfils.map(p => p.endurance))],
    range: [Math.min(...allProfils.map(p => p.getRangeScore())), Math.max(...allProfils.map(p => p.getRangeScore()))],
    movement: [Math.min(...allProfils.map(p => p.movement)), Math.max(...allProfils.map(p => p.movement))]
  };
  
  // Affichage trié par indice global
  const profils = allProfils.sort((a, b) => b.getIndiceGlobal() - a.getIndiceGlobal());
  console.table(profils.map(p => p.getRow()));
  