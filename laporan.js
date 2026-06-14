import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pelangganRef = collection(db, "pelanggan");

let chartInstance = null;

/* =========================
   LOAD LAPORAN
========================= */
async function loadLaporan() {
  const snap = await getDocs(pelangganRef);

  let hariIni = 0;
  let bulanIni = 0;
  let tahunIni = 0;

  let dataBulanan = Array(12).fill(0);
  let excelData = [];

  const now = new Date();

  snap.forEach((item) => {
    const d = item.data();

    if (d.status !== "LUNAS") return;

    const harga = Number(d.harga || 0);

    // FIX: createdAt aman (Firestore timestamp / fallback)
    let tgl = d.createdAt?.toDate
      ? d.createdAt.toDate()
      : d.tanggal
      ? new Date(d.tanggal)
      : new Date();

    excelData.push({
      Nama: d.nama || "-",
      Paket: d.paket || "-",
      Nominal: harga,
      Tanggal: tgl.toLocaleDateString("id-ID")
    });

    /* =====================
       PERHITUNGAN
    ===================== */
    if (tgl.toDateString() === now.toDateString()) {
      hariIni += harga;
    }

    if (
      tgl.getMonth() === now.getMonth() &&
      tgl.getFullYear() === now.getFullYear()
    ) {
      bulanIni += harga;
    }

    if (tgl.getFullYear() === now.getFullYear()) {
      tahunIni += harga;
    }

    dataBulanan[tgl.getMonth()] += harga;
  });

  /* =========================
     UPDATE UI
  ========================= */
  document.getElementById("hariIni").textContent =
    "Rp " + hariIni.toLocaleString("id-ID");

  document.getElementById("bulanIni").textContent =
    "Rp " + bulanIni.toLocaleString("id-ID");

  document.getElementById("tahunIni").textContent =
    "Rp " + tahunIni.toLocaleString("id-ID");

  /* =========================
     CHART (FIX DUPLICATE)
  ========================= */
  buatChart(dataBulanan);

  /* =========================
     EXPORT EXCEL (FIX DUPLIKAT EVENT)
  ========================= */
  const btn = document.getElementById("btnExport");

  if (btn && !btn.dataset.bound) {
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Laporan");

      XLSX.writeFile(wb, "laporan_wbm_net.xlsx");
    });
  }
}

/* =========================
   CHART (FIX MEMORY LEAK)
========================= */
function buatChart(data) {
  const ctx = document.getElementById("chartPendapatan");

  if (!ctx) return;

  // HAPUS chart lama kalau ada
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Jan","Feb","Mar","Apr","Mei","Jun",
        "Jul","Agu","Sep","Okt","Nov","Des"
      ],
      datasets: [
        {
          label: "Pendapatan",
          data: data
        }
      ]
    }
  });
}

/* =========================
   START
========================= */
loadLaporan();