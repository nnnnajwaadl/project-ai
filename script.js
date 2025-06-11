document.getElementById('plantForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const tekstur = parseFloat(document.getElementById('tekstur').value);
  const kelembapan = parseFloat(document.getElementById('kelembapan').value);
  const ph = parseFloat(document.getElementById('ph').value);

  if (
    isNaN(tekstur) || isNaN(kelembapan) || isNaN(ph) ||
    tekstur < 0.002 || tekstur > 0.2
  ) {
    document.getElementById('result').innerHTML = `<p style="color:red;">Input tidak valid. Tekstur tanah harus antara 0.002 - 0.2 mm.</p>`;
    return;
  }

  document.getElementById('result').innerHTML = "";

  const kesuburan = getKesuburan(ph, kelembapan);
  const rekomendasi = getRekomendasiTanaman(ph, tekstur);

  document.getElementById('result').innerHTML = `
    <h3>Hasil Analisis</h3>
    <p><strong>Tingkat Kesuburan:</strong> ${kesuburan}</p>
    <p><strong>Rekomendasi Tanaman:</strong> ${rekomendasi}</p>
  `;
});

function getKesuburan(ph, kelembapan) {
  if (ph <= 5.5 && kelembapan <= 60) return "Buruk";
  if (ph <= 5.5 && kelembapan > 60 && kelembapan <= 70) return "Sedang";
  if (ph <= 5.5 && kelembapan > 70) return "Buruk";

  if (ph > 5.0 && ph <= 7.5 && kelembapan <= 60) return "Sedang";
  if (ph > 5.0 && ph <= 7.5 && kelembapan > 60 && kelembapan <= 70) return "Baik";
  if (ph > 5.0 && ph <= 7.5 && kelembapan > 70) return "Sedang";

  if (ph > 7 && kelembapan <= 60) return "Buruk";
  if (ph > 7 && kelembapan > 60 && kelembapan <= 70) return "Sedang";
  if (ph > 7 && kelembapan > 70) return "Buruk";

  return "Tidak terdefinisi";
}

function getRekomendasiTanaman(ph, tekstur) {
  const hasil = [];

  if (ph <= 5.5 && tekstur >= 0.002 && tekstur <= 0.02) {
    hasil.push("Singkong");
  }

  if (ph > 5.0 && ph <= 7.5 && tekstur >= 0.02 && tekstur <= 0.2) {
    hasil.push("Jagung", "Kentang", "Kacang-kacangan", "Bawang Merah", "Pisang");
  }

  if (ph > 5.0 && ph <= 7.5 && tekstur >= 0.002 && tekstur <= 0.02) {
    hasil.push("Padi", "Kopi", "Sorgum", "Kacang Merah");
  }

  if (ph > 7 && tekstur >= 0.002 && tekstur <= 0.02) {
    hasil.push("Cabai", "Kacang Tanah");
  }

  if (ph > 7 && tekstur >= 0.02 && tekstur <= 0.2 && hasil.length === 0) {
    return "Tidak ditemukan tanaman yang cocok.";
  }

  if (hasil.length === 0) {
    return "Tidak ditemukan tanaman yang cocok.";
  }

  return hasil.join(", ");
}
