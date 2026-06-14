import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const pelangganRef = collection(db, "pelanggan");

let setting = {};

/* =========================
   LOAD SETTING
========================= */
async function loadSetting() {
  const snap = await getDoc(doc(db, "settings", "app"));

  if (snap.exists()) {
    setting = snap.data();
  }
}

/* =========================
   ESCAPE HTML
========================= */
const escapeHTML = (str = "") =>
  String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));

/* =========================
   LOAD INVOICE (FIXED)
========================= */
async function loadInvoice() {
  await loadSetting();

  const snap = await getDocs(pelangganRef);

  const tbody = document.getElementById("tbodyInvoice");

  if (!tbody) return;

  let html = "";
  let no = 1;
  const tahun = new Date().getFullYear();

  snap.forEach((item) => {
    const d = item.data();

    const invoiceNo = `INV-${tahun}-${String(no).padStart(4, "0")}`;

    const harga = Number(d.harga || 0);

    html += `
      <tr>
        <td>${invoiceNo}</td>
        <td>${escapeHTML(d.nama)}</td>
        <td>${escapeHTML(d.hp)}</td>
        <td>${escapeHTML(d.paket)}</td>
        <td>Rp ${harga.toLocaleString("id-ID")}</td>
        <td>
          <span class="badge ${
            d.status === "LUNAS" ? "bg-success" : "bg-danger"
          }">
            ${d.status || "BELUM"}
          </span>
        </td>
        <td>
          <button class="btn btn-primary btn-sm"
            onclick="cetakInvoice(
              '${invoiceNo}',
              '${escapeHTML(d.nama)}',
              '${escapeHTML(d.paket)}',
              '${harga}'
            )">
            <i class="bi bi-printer"></i>
          </button>

          <button class="btn btn-success btn-sm"
            onclick="kirimWA(
              '${d.hp}',
              '${escapeHTML(d.nama)}',
              '${escapeHTML(d.paket)}',
              '${harga}'
            )">
            <i class="bi bi-whatsapp"></i>
          </button>
        </td>
      </tr>
    `;

    no++;
  });

  tbody.innerHTML = html;
}

/* =========================
   CETAK INVOICE
========================= */
window.cetakInvoice = (invoice, nama, paket, harga) => {
  const win = window.open("", "", "width=800,height=600");

  const isi = `
    <html>
    <head>
      <title>Invoice ${invoice}</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h2 { margin: 0; }
        hr { margin: 10px 0; }
      </style>
    </head>
    <body>
      <h2>WBM NET</h2>
      <hr>
      <p><b>Invoice:</b> ${invoice}</p>
      <p><b>Nama:</b> ${nama}</p>
      <p><b>Paket:</b> ${paket}</p>
      <p><b>Tagihan:</b> Rp ${Number(harga).toLocaleString("id-ID")}</p>
    </body>
    </html>
  `;

  win.document.write(isi);
  win.document.close();
  win.print();
};

/* =========================
   KIRIM WHATSAPP (FIXED)
========================= */
window.kirimWA = (hp, nama, paket, harga) => {
  if (!hp) return alert("Nomor HP kosong");

  // lebih aman (08 / +62 / 62)
  let fixHp = String(hp).replace(/[^0-9]/g, "");

  if (fixHp.startsWith("0")) {
    fixHp = "62" + fixHp.slice(1);
  }

  const pesan = `Halo ${nama}

Tagihan internet Anda:

Paket : ${paket}
Nominal : Rp ${Number(harga).toLocaleString("id-ID")}

Terima kasih.
WBM NET`;

  window.open(
    `https://wa.me/${fixHp}?text=${encodeURIComponent(pesan)}`
  );
};

/* =========================
   START
========================= */
loadInvoice();