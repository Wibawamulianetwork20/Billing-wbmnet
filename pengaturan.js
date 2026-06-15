import { db } from "./firebase.js";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =====================
   REF SETTINGS
===================== */
const settingRef = doc(db, "settings", "app");

/* =====================
   LOAD DATA AWAL
===================== */
async function loadSetting() {

  const snap = await getDoc(settingRef);

  if (snap.exists()) {

    const data = snap.data();

    document.getElementById("namaAdmin").value = data.namaAdmin || "";
    document.getElementById("namaISP").value = data.namaISP || "";
    document.getElementById("tarifDefault").value = data.tarifDefault || "";

  }

}

loadSetting();

/* =====================
   SIMPAN PROFIL
===================== */
document.getElementById("btnSimpanProfil").addEventListener("click", async () => {

  await setDoc(settingRef, {
    namaAdmin: document.getElementById("namaAdmin").value,
    namaISP: document.getElementById("namaISP").value
  }, { merge: true });

  alert("Profil disimpan");

});

/* =====================
   SIMPAN TARIF
===================== */
document.getElementById("btnSimpanTarif").addEventListener("click", async () => {

  await setDoc(settingRef, {
    tarifDefault: Number(document.getElementById("tarifDefault").value)
  }, { merge: true });

  alert("Tarif disimpan");

});

/* =====================
   BACKUP DATA
===================== */
document.getElementById("btnBackup").addEventListener("click", async () => {

  const snap = await getDocs(collection(db, "pelanggan"));

  let data = [];

  snap.forEach(doc => {
    data.push(doc.data());
  });

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-isp.json";
  a.click();

});

/* =====================
   RESET DATA (HATI-HATI)
===================== */
document.getElementById("btnReset").addEventListener("click", async () => {

  if (!confirm("Yakin hapus semua data pelanggan?")) return;

  const snap = await getDocs(collection(db, "pelanggan"));

  snap.forEach(async (d) => {
    await deleteDoc(doc(db, "pelanggan", d.id));
  });

  alert("Semua data dihapus");

});