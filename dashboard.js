import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "index.html";
  else {
    document.getElementById("userRole").textContent = "role: " + (user.email || "admin");
    loadDashboard();
  }
});

document.getElementById("tanggal").textContent = new Date().toLocaleDateString("id-ID", {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

function loadDashboard() {
  onSnapshot(collection(db, "pelanggan"), (snap) => {
    let total = snap.size, lunas = 0, belum = 0, menunggak = 0, pendapatan = 0;
    snap.forEach(doc => {
      const d = doc.data();
      if (d.status === "lunas") { lunas++; pendapatan += Number(d.tagihan || 0); }
      else if (d.status === "belum") belum++;
      else if (d.status === "menunggak") menunggak++;
    });
    document.getElementById("totalPelanggan").textContent = total;
    document.getElementById("totalLunas").textContent = lunas;
    document.getElementById("totalBelum").textContent = belum;
    document.getElementById("totalMenunggak").textContent = menunggak;
    document.getElementById("totalPendapatan").textContent = "Rp " + pendapatan.toLocaleString("id-ID");
  });
}

document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault();
  signOut(auth).then(() => window.location.href = "index.html");
});

// Toggle Sidebar
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");
const wrapper = document.getElementById("wrapper");

toggleBtn?.addEventListener("click", () => {
  if (window.innerWidth <= 768) wrapper.classList.toggle("sidebar-active");
  else wrapper.classList.toggle("sidebar-collapsed");
});
closeBtn?.addEventListener("click", () => wrapper.classList.remove("sidebar-active"));
wrapper?.addEventListener("click", e => {
  if (e.target === wrapper && wrapper.classList.contains("sidebar-active")) {
    wrapper.classList.remove("sidebar-active");
  }
});