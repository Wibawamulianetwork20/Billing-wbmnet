import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const settingRef = doc(db, "settings", "app");

/* =========================
   LOAD SETTING
========================= */
async function loadSetting() {
  const snap = await getDoc(settingRef);

  if (!snap.exists()) return;

  const d = snap.data();

  const namaIsp = document.getElementById("namaIsp");
  const waAdmin = document.getElementById("waAdmin");
  const rekening = document.getElementById("rekening");
  const qris = document.getElementById("qris");
  const alamat = document.getElementById("alamat");

  if (namaIsp) namaIsp.value = d.namaIsp || "";
  if (waAdmin) waAdmin.value = d.waAdmin || "";
  if (rekening) rekening.value = d.rekening || "";
  if (qris) qris.value = d.qris || "";
  if (alamat) alamat.value = d.alamat || "";
}

/* =========================
   SIMPAN SETTING
========================= */
document.getElementById("btnSimpanSetting").addEventListener("click", async () => {
  try {
    await setDoc(settingRef, {
      namaIsp: document.getElementById("namaIsp")?.value || "",
      waAdmin: document.getElementById("waAdmin")?.value || "",
      rekening: document.getElementById("rekening")?.value || "",
      qris: document.getElementById("qris")?.value || "",
      alamat: document.getElementById("alamat")?.value || "",
      updatedAt: new Date()
    });

    alert("Pengaturan berhasil disimpan");
  } catch (err) {
    console.log(err);
    alert("Gagal menyimpan setting");
  }
});

/* =========================
   START
========================= */
loadSetting();