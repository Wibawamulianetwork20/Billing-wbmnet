import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pelangganRef = collection(db, "pelanggan");

let semuaPelanggan = [];
let currentId = null;

/* =====================
   LOAD DATA
===================== */
async function loadData() {
  const snap = await getDocs(pelangganRef);

  semuaPelanggan = [];

  snap.forEach((item) => {
    semuaPelanggan.push({
      id: item.id,
      ...item.data()
    });
  });

  renderTable(semuaPelanggan);
}

/* =====================
   RENDER TABLE
===================== */
function renderTable(data) {
  let html = "";

  data.forEach((d) => {
    html += `
      <tr>
        <td>${d.nama || "-"}</td>
        <td>${d.hp || "-"}</td>
        <td>${d.paket || "-"}</td>
        <td>Rp ${(d.harga || 0).toLocaleString("id-ID")}</td>
        <td>${d.jatuhTempo || "-"}</td>
        <td>
          <span class="badge ${
            d.status === "LUNAS" ? "bg-success" : "bg-danger"
          }">
            ${d.status || "BELUM"}
          </span>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editData('${d.id}')">
            Edit
          </button>

          <button class="btn btn-danger btn-sm" onclick="hapusData('${d.id}')">
            Hapus
          </button>
        </td>
      </tr>
    `;
  });

  document.getElementById("tbody").innerHTML = html;
}

/* =====================
   SIMPAN / TAMBAH DATA
===================== */
async function simpanData(data) {
  await addDoc(pelangganRef, {
    nama: data.nama,
    hp: data.hp,
    paket: data.paket,
    harga: Number(data.harga || 0),
    status: "BELUM",
    jatuhTempo: data.jatuhTempo || null,
    createdAt: new Date()
  });

  await loadData();
}

/* =====================
   HAPUS DATA
===================== */
window.hapusData = async (id) => {
  const yakin = confirm("Hapus data ini?");
  if (!yakin) return;

  await deleteDoc(doc(db, "pelanggan", id));

  await loadData();
};

/* =====================
   EDIT DATA (AMBIL DATA)
===================== */
window.editData = async (id) => {
  const snap = await getDoc(doc(db, "pelanggan", id));

  if (snap.exists()) {
    const d = snap.data();

    currentId = id;

    document.getElementById("nama").value = d.nama;
    document.getElementById("hp").value = d.hp;
    document.getElementById("paket").value = d.paket;
    document.getElementById("harga").value = d.harga;
    document.getElementById("jatuhTempo").value = d.jatuhTempo || "";
  }
};

/* =====================
   UPDATE DATA
===================== */
async function updateData() {
  if (!currentId) return;

  await updateDoc(doc(db, "pelanggan", currentId), {
    nama: document.getElementById("nama").value,
    hp: document.getElementById("hp").value,
    paket: document.getElementById("paket").value,
    harga: Number(document.getElementById("harga").value || 0),
    jatuhTempo: document.getElementById("jatuhTempo").value
  });

  currentId = null;

  await loadData();
}

/* =====================
   BUTTON SIMPAN
===================== */
document.getElementById("btnSimpan").addEventListener("click", async () => {
  const data = {
    nama: document.getElementById("nama").value,
    hp: document.getElementById("hp").value,
    paket: document.getElementById("paket").value,
    harga: document.getElementById("harga").value,
    jatuhTempo: document.getElementById("jatuhTempo").value
  };

  if (!currentId) {
    await simpanData(data);
  } else {
    await updateData();
  }

  // reset form
  document.getElementById("nama").value = "";
  document.getElementById("hp").value = "";
  document.getElementById("paket").value = "";
  document.getElementById("harga").value = "";
  document.getElementById("jatuhTempo").value = "";
});

/* =====================
   START
===================== */
loadData();