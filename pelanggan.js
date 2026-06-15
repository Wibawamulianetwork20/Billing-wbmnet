import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   FIRESTORE REF
===================== */
const ref = collection(db, "pelanggan");

/* =====================
   ADD PELANGGAN (SAFE VERSION)
===================== */
const btn = document.getElementById("btnSimpan");

if (btn) {
  btn.addEventListener("click", async () => {

    const nama = document.getElementById("nama")?.value || "";
    const hp = document.getElementById("hp")?.value || "";
    const paket = document.getElementById("paket")?.value || "";
    const harga = Number(document.getElementById("harga")?.value || 0);
    const jatuhTempo = document.getElementById("jatuhTempo")?.value || "";

    if (!nama || !hp || !paket || !harga) {
      alert("Lengkapi data!");
      return;
    }

    try {
      btn.disabled = true;

      await addDoc(ref, {
        nama,
        hp,
        paket,
        harga,
        status: "AKTIF",
        jatuhTempo,
        createdAt: Date.now()
      });

      alert("Pelanggan berhasil ditambahkan");

      
         // setelah alert("Pelanggan berhasil ditambahkan");
   
   // close modal
   const modal = bootstrap.Modal.getInstance(document.getElementById('modalTambah'));
   modal.hide();
   
   // reset form
   ["nama","hp","paket","harga","jatuhTempo"].forEach(id => {
     const el = document.getElementById(id);
     if (el) el.value = "";
   });

    } catch (e) {
      console.error("Add error:", e);
      alert("Gagal menambah pelanggan");
    }

    btn.disabled = false;
  });
}

/* =====================
   REALTIME RENDER (OPTIMIZED)
===================== */
onSnapshot(ref, (snap) => {

  const table = document.getElementById("tabelPelanggan");
  if (!table) return;

  table.innerHTML = "";

  const now = Date.now();

  snap.forEach((docSnap) => {

    const d = docSnap.data();

    const jatuhTempo = d.jatuhTempo
      ? new Date(d.jatuhTempo).getTime()
      : null;

    let status = d.status || "AKTIF";

    if (status !== "NONAKTIF" && jatuhTempo && jatuhTempo < now) {
      status = "MENUNGGAK";
    }

    const badge =
      status === "AKTIF"
        ? "success"
        : status === "MENUNGGAK"
        ? "danger"
        : "dark";

    const row = `
      <tr>
        <td>${d.nama || "-"}</td>
        <td>${d.hp || "-"}</td>
        <td>${d.paket || "-"}</td>
        <td>Rp ${(d.harga || 0).toLocaleString("id-ID")}</td>
        <td><span class="badge bg-${badge}">${status}</span></td>
        <td>${d.jatuhTempo || "-"}</td>
        <td>
          <button class="btn btn-sm btn-success"
            onclick="kirimWA('${d.nama}','${d.hp}','${d.harga}')">
            <i class="bi bi-whatsapp"></i>
          </button>

          <button class="btn btn-sm btn-danger"
            onclick="hapus('${docSnap.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;

    table.insertAdjacentHTML("beforeend", row);
  });

}, (error) => {
  console.error("Realtime error:", error);
});

/* =====================
   DELETE
===================== */
window.hapus = async (id) => {

  if (!confirm("Hapus pelanggan ini?")) return;

  try {
    await deleteDoc(doc(db, "pelanggan", id));
  } catch (e) {
    console.error("Delete error:", e);
  }
};

/* =====================
   WHATSAPP BILLING
===================== */
window.kirimWA = (nama, hp, harga) => {

  if (!hp) return;

  const msg = `Halo ${nama}

Tagihan internet Anda:
Rp ${(harga || 0).toLocaleString("id-ID")}

Segera lakukan pembayaran agar layanan tidak terputus.`;

  window.open(
    `https://wa.me/${hp}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

/* =====================
   SEARCH (FAST + SAFE)
===================== */
const search = document.getElementById("search");

if (search) {
  search.addEventListener("input", (e) => {

    const keyword = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#tabelPelanggan tr");

    rows.forEach(row => {

      const nama = row.children[0]?.textContent?.toLowerCase() || "";

      row.style.display = nama.includes(keyword) ? "" : "none";

    });

  });
}