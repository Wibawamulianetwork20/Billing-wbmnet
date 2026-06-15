import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   ELEMENT
===================== */
const select = document.getElementById("selectPelanggan");
const box = document.getElementById("invoiceBox");

const invNama = document.getElementById("invNama");
const invHp = document.getElementById("invHp");
const invPaket = document.getElementById("invPaket");
const invPeriode = document.getElementById("invPeriode");
const invTotal = document.getElementById("invTotal");

/* =====================
   LOAD PELANGGAN LIST
===================== */
const ref = collection(db, "pelanggan");

let dataPelanggan = [];

onSnapshot(ref, (snap) => {

  select.innerHTML = `<option value="">-- Pilih Pelanggan --</option>`;
  dataPelanggan = [];

  snap.forEach((docSnap) => {

    const d = docSnap.data();

    dataPelanggan.push({
      id: docSnap.id,
      ...d
    });

    select.innerHTML += `
      <option value="${docSnap.id}">
        ${d.nama} - ${d.paket}
      </option>
    `;
  });

});

/* =====================
   GENERATE INVOICE
===================== */
document.getElementById("btnGenerate").addEventListener("click", () => {

  const id = select.value;
  const periode = document.getElementById("periode").value;

  if (!id || !periode) {
    alert("Pilih pelanggan & periode!");
    return;
  }

  const user = dataPelanggan.find(p => p.id === id);

  if (!user) return;

  invNama.textContent = user.nama;
  invHp.textContent = user.hp;
  invPaket.textContent = user.paket;
  invPeriode.textContent = periode;
  invTotal.textContent = "Rp " + Number(user.harga).toLocaleString("id-ID");

  box.style.display = "block";

});

/* =====================
   WHATSAPP INVOICE
===================== */
document.getElementById("btnWA").addEventListener("click", () => {

  const nama = invNama.textContent;
  const hp = invHp.textContent;
  const paket = invPaket.textContent;
  const periode = invPeriode.textContent;
  const total = invTotal.textContent;

  if (!hp) return;

  const msg = `📡 *TAGIHAN INTERNET WBM NET*

Nama: ${nama}
Paket: ${paket}
Periode: ${periode}

Total: ${total}

Segera lakukan pembayaran agar layanan tidak terputus.`;

  window.open(`https://wa.me/${hp}?text=${encodeURIComponent(msg)}`);

});