import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// GANTI CONFIG FIREBASE KAMU
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const selectPelanggan = document.getElementById('selectPelanggan');
const periode = document.getElementById('periode');
const btnGenerate = document.getElementById('btnGenerate');
const btnText = document.getElementById('btnText');
const invoiceBox = document.getElementById('invoiceBox');
const btnWA = document.getElementById('btnWA');

let dataPelanggan = {};

// Set periode default bulan ini
periode.value = new Date().toISOString().slice(0,7);

// Load pelanggan
async function loadPelanggan() {
  const snap = await getDocs(collection(db, 'pelanggan'));
  selectPelanggan.innerHTML = '<option value="">-- Pilih Pelanggan Dulu --</option>';
  snap.forEach(doc => {
    const d = doc.data();
    dataPelanggan[doc.id] = d;
    selectPelanggan.innerHTML += `<option value="${doc.id}">${d.nama} - ${d.paket}</option>`;
  });
}
loadPelanggan();

// Generate Invoice
btnGenerate.addEventListener('click', () => {
  const id = selectPelanggan.value;
  const bln = periode.value;
  
  if(!id) return alert('Pilih pelanggan dulu!');
  if(!bln) return alert('Pilih periode dulu!');

  btnGenerate.classList.add('loading');
  btnText.textContent = 'Loading...';

  setTimeout(() => {
    const p = dataPelanggan[id];
    const [tahun, bulan] = bln.split('-');
    const namaBulan = new Date(bln).toLocaleDateString('id-ID', {month: 'long', year: 'numeric'});
    
    document.getElementById('invNo').textContent = `INV/${tahun}${bulan}/${id.slice(0,6).toUpperCase()}`;
    document.getElementById('invNama').textContent = p.nama;
    document.getElementById('invHp').textContent = p.hp;
    document.getElementById('invAlamat').textContent = p.alamat;
    document.getElementById('invPaket').textContent = `${p.paket} - ${p.bandwidth} Mbps`;
    document.getElementById('invPeriode').textContent = namaBulan;
    document.getElementById('invTotal').textContent = `Rp${p.harga.toLocaleString('id-ID')}`;
    
    invoiceBox.style.display = 'block';
    btnGenerate.classList.remove('loading');
    btnText.textContent = 'Generate Invoice';
  }, 800);
});

// Kirim WhatsApp
btnWA.addEventListener('click', () => {
  const nama = document.getElementById('invNama').textContent;
  const hp = document.getElementById('invHp').textContent.replace(/\D/g,'');
  const paket = document.getElementById('invPaket').textContent;
  const periodeTxt = document.getElementById('invPeriode').textContent;
  const total = document.getElementById('invTotal').textContent;
  const noInv = document.getElementById('invNo').textContent;

  const pesan = `Halo ${nama}%0A%0A` +
    `Tagihan Internet WBM.NET%0A` +
    `No Invoice: ${noInv}%0A` +
    `Paket: ${paket}%0A` +
    `Periode: ${periodeTxt}%0A` +
    `Total: ${total}%0A%0A` +
    `Mohon transfer sebelum tgl 10 ya.%0A` +
    `BCA 1234567890 a.n WBM NET%0A%0A` +
    `Konfirmasi pembayaran bisa reply WA ini. Terima kasih 🙏`;

  window.open(`https://wa.me/62${hp.slice(1)}?text=${pesan}`, '_blank');
});
