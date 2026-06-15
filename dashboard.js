import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   STATE CONTROL
===================== */
let unsubscribeSnapshot = null;

/* =====================
   DATE SAFE RENDER
===================== */
function setTanggal() {
  const el = document.getElementById("tanggal");
  if (!el) return;
  el.textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}
setTanggal();

/* =====================
   DASHBOARD CORE ISP - LANGSUNG JALAN
===================== */
function startDashboard() {
  if (unsubscribeSnapshot) unsubscribeSnapshot();

  unsubscribeSnapshot = onSnapshot(
    collection(db, "pelanggan"),
    (snap) => {
      console.log("Snapshot ke-trigger! Total doc:", snap.size);

      let total = 0, aktif = 0, belum = 0, menunggak = 0, pendapatan = 0;
      const now = Date.now();

      snap.forEach((doc) => {
        const d = doc.data();
        total++;
        const harga = Number(d.harga || 0);
        const status = d.status || "AKTIF";
        const jatuhTempo = d.jatuhTempo ? new Date(d.jatuhTempo).getTime() : null;

        if (status === "NONAKTIF") return;
        if (status === "LUNAS") {
          aktif++;
          pendapatan += harga;
        } else {
          belum++;
        }
        if (jatuhTempo && jatuhTempo < now && status !== "LUNAS") {
          menunggak++;
        }
      });

      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      set("totalPelanggan", total);
      set("totalLunas", aktif);
      set("totalBelum", belum);
      set("totalMenunggak", menunggak);
      set("totalPendapatan", "Rp " + pendapatan.toLocaleString("id-ID"));
    },
    (error) => {
      console.error("Firestore error:", error);
    }
  );
}

// LANGSUNG JALAN TANPA CEK LOGIN
startDashboard();

/* =====================
   LOGOUT - HAPUS AJA KALAU GAK PAKE AUTH
===================== */
// const logoutBtn = document.getElementById("logoutBtn");
// if (logoutBtn) { ... hapus semua ... }
