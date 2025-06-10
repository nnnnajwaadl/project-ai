// Fungsi keanggotaan segitiga
function triangleMembership(x, a, b, c) {
  if (x <= a || x >= c) return 0;
  else if (x === b) return 1;
  else if (x > a && x < b) return (x - a) / (b - a);
  else if (x > b && x < c) return (c - x) / (c - b);
}

// Fuzzifikasi pH tanah
function fuzzifyPH(ph) {
  return {
    asam: triangleMembership(ph, 4.0, 5.0, 6.0),
    netral: triangleMembership(ph, 5.5, 6.5, 7.5),
    basa: triangleMembership(ph, 7.0, 8.0, 9.0)
  };
}

// Fuzzifikasi kadar N, P, K (rendah, sedang, tinggi)
function fuzzifyNPK(x) {
  return {
    rendah: triangleMembership(x, 0, 10, 20),
    sedang: triangleMembership(x, 15, 25, 35),
    tinggi: triangleMembership(x, 30, 40, 50)
  };
}

// Aturan fuzzy menggunakan operator min (AND)
function ruleBase(phFuzzy, nFuzzy, pFuzzy, kFuzzy) {
  let rules = [];

  // Rule 1: IF pH netral AND N tinggi AND P sedang AND K sedang THEN kesuburan tinggi
  let r1 = Math.min(phFuzzy.netral, nFuzzy.tinggi, pFuzzy.sedang, kFuzzy.sedang);
  rules.push({ kesuburan: 'tinggi', value: r1 });

  // Rule 2: IF pH asam AND N rendah THEN kesuburan rendah
  let r2 = Math.min(phFuzzy.asam, nFuzzy.rendah);
  rules.push({ kesuburan: 'rendah', value: r2 });

  // Rule 3: IF pH basa AND P rendah THEN kesuburan rendah
  let r3 = Math.min(phFuzzy.basa, pFuzzy.rendah);
  rules.push({ kesuburan: 'rendah', value: r3 });

  // Rule 4: IF N sedang AND P sedang AND K sedang THEN kesuburan sedang
  let r4 = Math.min(nFuzzy.sedang, pFuzzy.sedang, kFuzzy.sedang);
  rules.push({ kesuburan: 'sedang', value: r4 });

  // Rule 5: IF K tinggi AND pH netral THEN kesuburan tinggi
  let r5 = Math.min(kFuzzy.tinggi, phFuzzy.netral);
  rules.push({ kesuburan: 'tinggi', value: r5 });

  // Rule 6: IF N rendah AND P rendah AND K rendah THEN kesuburan rendah
  let r6 = Math.min(nFuzzy.rendah, pFuzzy.rendah, kFuzzy.rendah);
  rules.push({ kesuburan: 'rendah', value: r6 });

  return rules;
}

// Defuzzifikasi centroid
function defuzzify(rules) {
  const crispValues = {
    rendah: 25,
    sedang: 50,
    tinggi: 75
  };

  let numerator = 0;
  let denominator = 0;

  for (const rule of rules) {
    numerator += rule.value * crispValues[rule.kesuburan];
    denominator += rule.value;
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

// Kategori kesuburan berdasarkan nilai defuzzifikasi
function getKategoriKesuburan(value) {
  if (value >= 60) return 'Tinggi';
  if (value >= 40) return 'Sedang';
  return 'Rendah';
}

// Kualitas tanah berdasarkan level kesuburan
function getKualitasTanah(level) {
  if (level === 'Tinggi') return 'Baik';
  if (level === 'Sedang') return 'Cukup Baik';
  return 'Buruk';
}

// Rekomendasi tanaman sederhana berdasar kualitas
function getRekomendasi(level) {
  if (level === 'Tinggi') return 'Padi, Jagung, Sayuran';
  if (level === 'Sedang') return 'Kedelai, Ubi, Pisang';
  return 'Perbaiki tanah dengan pupuk organik dan kapur';
}

document.getElementById('soilForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const ph = parseFloat(document.getElementById('ph').value);
  const nitrogen = parseFloat(document.getElementById('nitrogen').value);
  const phosphor = parseFloat(document.getElementById('phosphor').value);
  const potassium = parseFloat(document.getElementById('potassium').value);

  // Fuzzifikasi
  const phFuzzy = fuzzifyPH(ph);
  const nFuzzy = fuzzifyNPK(nitrogen);
  const pFuzzy = fuzzifyNPK(phosphor);
  const kFuzzy = fuzzifyNPK(potassium);

  // Inferensi dengan aturan fuzzy
  const rules = ruleBase(phFuzzy, nFuzzy, pFuzzy, kFuzzy);

  // Defuzzifikasi hasil
  const defuzzValue = defuzzify(rules);

  // Hasil kategori dan output
  const levelKesuburan = getKategoriKesuburan(defuzzValue);
  const kualitas = getKualitasTanah(levelKesuburan);
  const rekomendasi = getRekomendasi(levelKesuburan);

  // Tampilkan hasil di web
  document.getElementById('result').innerHTML = `
    <h3>Hasil Analisis</h3>
    <p><strong>Level Kesuburan:</strong> ${levelKesuburan}</p>
    <p><strong>Kualitas Tanah:</strong> ${kualitas}</p>
    <p><strong>Rekomendasi:</strong> ${rekomendasi}</p>
  `;
});
