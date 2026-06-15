import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else loadLaporan();
});

function loadLaporan() {
  onSnapshot(collection(db, "invoice"), snap => {
    let pendapatan = 0, piutang = 0, transaksi = 0;
    const dataChart = {};

    snap.forEach(doc => {
      const d = doc.data();
      transaksi++;
      if (d.status === "lunas") {
        pendapatan += Number(d.total);
        const bulan = d.periode;
        dataChart[bulan] = (dataChart[bulan] || 0) + Number(d.total);
      } else {
        piutang += Number(d.total);
      }
    });

    document.getElementById("pendapatanBulan").textContent = "Rp " + pendapatan.toLocaleString("id-ID");
    document.getElementById("totalPiutang").textContent = "Rp " + piutang.toLocaleString("id-ID");
    document.getElementById("totalTransaksi").textContent = transaksi;

    new Chart(document.getElementById("chartPendapatan"), {
      type: 'bar',
      data: {
        labels: Object.keys(dataChart),
        datasets: [{ label: 'Pendapatan', data: Object.values(dataChart), backgroundColor: '#0d6efd' }]
      }
    });
  });
}

// Toggle Sidebar
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");
const wrapper = document.getElementById("wrapper");
toggleBtn?.addEventListener("click", () => {
  if (window.innerWidth <= 768) wrapper.classList.toggle("sidebar-active");
  else wrapper.classList.toggle("sidebar-collapsed");
});
closeBtn?.addEventListener("click", () => wrapper.classList.remove("sidebar-active"));