import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, onSnapshot, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
  else loadInvoice();
});

function loadInvoice() {
  onSnapshot(collection(db, "invoice"), snap => {
    let html = "";
    snap.forEach(doc => {
      const d = doc.data();
      const badge = d.status === "lunas"? "success" : "warning";
      html += `<tr>
        <td>${d.noInvoice}</td>
        <td>${d.namaPelanggan}</td>
        <td>${d.periode}</td>
        <td>Rp ${Number(d.total).toLocaleString("id-ID")}</td>
        <td><span class="badge bg-${badge}">${d.status}</span></td>
        <td><button class="btn btn-sm btn-success" onclick="bayarInvoice('${doc.id}')">Bayar</button></td>
      </tr>`;
    });
    document.getElementById("tabelInvoice").innerHTML = html || '<tr><td colspan="6" class="text-center text-muted">Belum ada invoice</td></tr>';
  });
}

window.bayarInvoice = async (id) => {
  await updateDoc(doc(db, "invoice", id), { status: "lunas", tglBayar: new Date() });
};

document.getElementById("btnBuatInvoice").addEventListener("click", async () => {
  const nama = prompt("Nama pelanggan:");
  const periode = prompt("Periode misal 10-2026:");
  const total = prompt("Total tagihan:");
  if (nama && periode && total) {
    await addDoc(collection(db, "invoice"), {
      noInvoice: "INV" + Date.now(),
      namaPelanggan: nama,
      periode,
      total: Number(total),
      status: "belum",
      created: new Date()
    });
  }
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