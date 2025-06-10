document.getElementById('plantForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const tekstur = parseFloat(document.getElementById('tekstur').value);
  const kelembapan = parseFloat(document.getElementById('kelembapan').value);
  const ph = parseFloat(document.getElementById('ph').value);

  const result = getJenisTanaman(tekstur, kelembapan, ph);

  document.getElementById('result').innerHTML = `
    <h3>Hasil Identifikasi</h3>
    <p><strong>Jenis Tanaman yang Cocok:</strong> ${result}</p>
  `;
});

function getJenisTanaman(tekstur, kelembapan, ph) {
  const rules = [
    {
      tanaman: "Cabai",
      tekstur: [0.02, 0.1],
      kelembapan: [71, 80],
      ph: [6.6, 7.5]
    },
    {
      tanaman: "Jagung",
      tekstur: [0.2, 2.0],
      kelembapan: [40, 60],
      ph: [5.6, 6.5]
    },
    {
      tanaman: "Padi",
      tekstur: [0.2, 2.0],
      kelembapan: [61, 70],
      ph: [5.6, 6.5]
    },
    {
      tanaman: "Kacang Tanah",
      tekstur: [0.02, 0.1],
      kelembapan: [71, 80],
      ph: [6.6, 7.5]
    },
    {
      tanaman: "Kedelai",
      tekstur: [0.2, 2.0],
      kelembapan: [61, 70],
      ph: [5.6, 6.5]
    },
    {
      tanaman: "Semangka",
      tekstur: [0.2, 2.0],
      kelembapan: [61, 70],
      ph: [5.6, 6.5]
    }
  ];

  // Cari semua tanaman yang cocok
  const cocok = rules.filter(rule =>
    tekstur >= rule.tekstur[0] && tekstur <= rule.tekstur[1] &&
    kelembapan >= rule.kelembapan[0] && kelembapan <= rule.kelembapan[1] &&
    ph >= rule.ph[0] && ph <= rule.ph[1]
  );

  if (cocok.length === 0) {
    return "Tidak ditemukan tanaman yang cocok berdasarkan parameter tersebut.";
  }

  // Kembalikan semua tanaman yang cocok (jika lebih dari satu)
  return cocok.map(r => r.tanaman).join(", ");
}
