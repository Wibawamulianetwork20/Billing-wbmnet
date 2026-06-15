import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else loadPengaturan();
});

async function loadPengaturan() {
  const ref = doc(db, "pengaturan", "isp");
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    document.getElementById("namaISP").value = d.nama || "";
    document.getElementById("alamatISP").value = d.alamat || "";
    document.getElementById("noWA").value = d.noWA || "";
  }
  document.getElementById("listPaket").innerHTML = `
    <div class="d-flex justify-content-between mb-2">
      <span>10 Mbps - Rp 150.000</span>
      <button class="btn btn-sm btn-outline-primary">Edit</button>
    </div>
    <div class="d-flex justify-content-between">
      <span>20 Mbps - Rp 250.000</span>
      <button class="btn btn-sm btn-outline-primary">Edit</button>
    </div>
  `;
}

document.getElementById("btnSimpanISP").addEventListener("click", async () => {
  await setDoc(doc(db, "pengaturan", "isp"), {
    nama: document.getElementById("namaISP").value,
    alamat: document.getElementById("alamatISP").value,
    noWA: document.getElementById("noWA").value
  });
  alert("Data tersimpan!");
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