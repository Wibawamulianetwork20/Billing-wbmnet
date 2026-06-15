import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else loadPelanggan();
});

function loadPelanggan() {
  onSnapshot(collection(db, "pelanggan"), snap => {
    let html = "";
    let no = 1;
    snap.forEach(doc => {
      const d = doc.data();
      const badge = d.status === "lunas"? "success" : d.status === "menunggak"? "danger" : "warning";
      html += `<tr>
        <td>${no++}</td>
        <td>${d.nama}</td>
        <td>${d.alamat}</td>
        <td>${d.paket}</td>
        <td><span class="badge bg-${badge}">${d.status}</span></td>
        <td><button class="btn btn-sm btn-danger" onclick="hapusPelanggan('${doc.id}')"><i class="bi bi-trash"></i></button></td>
      </tr>`;
    });
    document.getElementById("tabelPelanggan").innerHTML = html || '<tr><td colspan="6" class="text-center text-muted">Belum ada data</td></tr>';
  });
}

window.hapusPelanggan = async (id) => {
  if (confirm("Hapus pelanggan ini?")) await deleteDoc(doc(db, "pelanggan", id));
};

document.getElementById("btnTambahPelanggan").addEventListener("click", async () => {
  const nama = prompt("Nama pelanggan:");
  const alamat = prompt("Alamat:");
  const paket = prompt("Paket:");
  const tagihan = prompt("Tagihan:");
  if (nama && alamat && paket) {
    await addDoc(collection(db, "pelanggan"), {
      nama, alamat, paket, tagihan: Number(tagihan), status: "belum", created: new Date()
    });
  }
});

// Toggle Sidebar sama kayak dashboard.js
const toggleBtn = document.getElementById("toggleSidebar");
const closeBtn = document.getElementById("closeSidebar");
const wrapper = document.getElementById("wrapper");
toggleBtn?.addEventListener("click", () => {
  if (window.innerWidth <= 768) wrapper.classList.toggle("sidebar-active");
  else wrapper.classList.toggle("sidebar-collapsed");
});
closeBtn?.addEventListener("click", () => wrapper.classList.remove("sidebar-active"));