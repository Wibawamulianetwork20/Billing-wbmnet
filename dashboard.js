import { db, auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   TANGGAL
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const tanggalEl = document.getElementById("tanggal");

  if (tanggalEl) {
    tanggalEl.textContent =
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
  }
});

/* =====================
   LOADING UI
===================== */
function setLoading(state) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("totalPelanggan", state ? "..." : "0");
  set("totalLunas", state ? "..." : "0");
  set("totalBelum", state ? "..." : "0");
  set("totalMenunggak", state ? "..." : "0");
  set("totalPendapatan", state ? "Loading..." : "Rp 0");
}

/* =====================
   DASHBOARD REALTIME
===================== */
function loadDashboard() {
  setLoading(true);

  const ref = collection(db, "pelanggan");

  onSnapshot(ref, (snap) => {
    let totalPelanggan = 0;
    let totalLunas = 0;
    let totalBelum = 0;
    let totalMenunggak = 0;
    let totalPendapatan = 0;

    const now = Date.now();

    snap.forEach((doc) => {
      const d = doc.data();
      totalPelanggan++;

      const harga = Number(d.harga || 0);

      if (d.status === "LUNAS") {
        totalLunas++;
        totalPendapatan += harga;
      } else {
        const jatuhTempo = d.jatuhTempo
          ? new Date(d.jatuhTempo).getTime()
          : null;

        if (jatuhTempo && jatuhTempo < now) {
          totalMenunggak++;
        } else {
          totalBelum++;
        }
      }
    });

    /* =====================
       UPDATE UI
    ===================== */
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set("totalPelanggan", totalPelanggan);
    set("totalLunas", totalLunas);
    set("totalBelum", totalBelum);
    set("totalMenunggak", totalMenunggak);

    set(
      "totalPendapatan",
      "Rp " + totalPendapatan.toLocaleString("id-ID")
    );

    setLoading(false);
  });
}

/* =====================
   LOGOUT
===================== */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    if (!confirm("Logout sekarang?")) return;

    try {
      await signOut(auth);
      location.href = "index.html";
    } catch (err) {
      console.log("Logout error:", err);
    }
  });
}

/* =====================
   SERVICE WORKER (PWA)
===================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("PWA aktif"))
      .catch((err) => console.log("SW error:", err));
  });
}

/* =====================
   START APP
===================== */
document.addEventListener("DOMContentLoaded", loadDashboard);