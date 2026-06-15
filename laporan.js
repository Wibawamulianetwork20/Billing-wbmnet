import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   REF
===================== */
const ref = collection(db, "pelanggan");

/* =====================
   DATA GLOBAL
===================== */
let allData = [];

/* =====================
   LOAD REALTIME
===================== */
onSnapshot(ref, (snap) => {

  allData = [];

  snap.forEach((doc) => {
    allData.push(doc.data());
  });

  renderLaporan(allData);

});

/* =====================
   FILTER BUTTON
===================== */
document.getElementById("btnFilter").addEventListener("click", () => {

  const bulan = document.getElementById("filterBulan").value;

  if (!bulan) {
    renderLaporan(allData);
    return;
  }

  const filtered = allData.filter(d => {
    return d.jatuhTempo && d.jatuhTempo.includes(bulan);
  });

  renderLaporan(filtered);

});

/* =====================
   RENDER LAPORAN
===================== */
function renderLaporan(data) {

  const table = document.getElementById("tabelLaporan");

  let totalPendapatan = 0;
  let aktif = 0;
  let menunggak = 0;

  table.innerHTML = "";

  const now = new Date();

  data.forEach(d => {

    const harga = Number(d.harga || 0);
    const jatuhTempo = d.jatuhTempo ? new Date(d.jatuhTempo) : null;

    let status = d.status || "AKTIF";

    if (status === "LUNAS") {
      totalPendapatan += harga;
      aktif++;
    } else if (jatuhTempo && jatuhTempo < now) {
      menunggak++;
    }

    table.innerHTML += `
      <tr>
        <td>${d.nama}</td>
        <td>${d.paket}</td>
        <td>Rp ${harga.toLocaleString("id-ID")}</td>
        <td>${status}</td>
        <td>${d.jatuhTempo || "-"}</td>
      </tr>
    `;
  });

  document.getElementById("totalPendapatan").textContent =
    "Rp " + totalPendapatan.toLocaleString("id-ID");

  document.getElementById("totalAktif").textContent = aktif;
  document.getElementById("totalMenunggak").textContent = menunggak;

}