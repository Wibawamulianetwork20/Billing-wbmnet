let customers = [];
let activeTicketData = null;

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: {"Content-Type": "application/json"},
    ...options
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Request gagal");
  return data;
}

async function init() {
  try {
    const status = await api("/api/status");
    document.getElementById("status").textContent =
      `WhatsApp: ${status.whatsapp} | Firebase: ${status.firebase ? "OK" : "OFF"}`;

    const data = await api("/api/customers");
    customers = data.customers;
    renderCustomers();
  } catch (e) {
    document.getElementById("customers").textContent = e.message;
  }
}

function renderCustomers() {
  const q = document.getElementById("search").value.toLowerCase();
  const box = document.getElementById("customers");
  const filtered = customers.filter(c =>
    `${c.id} ${c.nama} ${c.whatsapp} ${c.paket}`.toLowerCase().includes(q)
  );

  box.innerHTML = filtered.map(c => `
    <label class="customer">
      <input type="checkbox" class="customer-check" value="${escapeHtml(c.id)}">
      <span>
        <strong>${escapeHtml(c.id)} - ${escapeHtml(c.nama)}</strong>
        <small>${escapeHtml(c.whatsapp)} • ${escapeHtml(c.paket)}</small>
      </span>
    </label>
  `).join("") || "Tidak ada data.";
}

function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function selectAll(value) {
  document.querySelectorAll(".customer-check").forEach(x => x.checked = value);
}

async function createTicket() {
  try {
    const customerIds = [...document.querySelectorAll(".customer-check:checked")].map(x => x.value);
    const body = {
      ticketNo: document.getElementById("ticketNo").value,
      area: document.getElementById("area").value,
      status: document.getElementById("ticketStatus").value,
      tikor: document.getElementById("tikor").value,
      createdDescription: document.getElementById("description").value,
      planAction: document.getElementById("planAction").value,
      customerIds
    };

    const data = await api("/api/ticket", {
      method: "POST",
      body: JSON.stringify(body)
    });

    document.getElementById("activeTicket").value = data.ticket.ticketNo;
    activeTicketData = data.ticket;
    renderTicket(data.ticket);
    alert(`Ticket ${data.ticket.ticketNo} berhasil dibuat.`);
  } catch (e) {
    alert(e.message);
  }
}

async function loadTicket() {
  try {
    const no = document.getElementById("activeTicket").value.trim();
    if (!no) return alert("Masukkan nomor ticket.");
    const data = await api(`/api/ticket/${encodeURIComponent(no)}`);
    activeTicketData = data.ticket;
    renderTicket(data.ticket);
  } catch (e) {
    alert(e.message);
  }
}

function renderTicket(t) {
  const lines = [
    `NO TICKET : ${t.ticketNo}`,
    `STATUS : ${t.status}`,
    `AREA : ${t.area}`,
    `PELANGGAN TERDAMPAK : ${(t.customers || []).length}`,
    "",
    `INFO : ${t.createdDescription || "-"}`,
    `TIKOR : ${t.tikor || "-"}`,
    `PLAN : ${t.planAction || "-"}`,
    "",
    "PROGRESS:"
  ];
  (t.progress || []).forEach(p => lines.push(`${p.time} | ${p.text}`));
  document.getElementById("ticketView").textContent = lines.join("\n");
}

async function addProgress() {
  try {
    const no = document.getElementById("activeTicket").value.trim();
    const text = document.getElementById("progressText").value.trim();
    const status = document.getElementById("progressStatus").value;
    const sendWhatsApp = document.getElementById("sendProgress").checked;

    if (!no || !text) return alert("Nomor ticket dan progress wajib diisi.");

    const data = await api(`/api/ticket/${encodeURIComponent(no)}/progress`, {
      method: "POST",
      body: JSON.stringify({ text, status, sendWhatsApp })
    });

    activeTicketData = data.ticket;
    renderTicket(data.ticket);
    document.getElementById("progressText").value = "";

    const ok = data.sendResults?.filter(x => x.success).length || 0;
    const fail = data.sendResults?.filter(x => !x.success).length || 0;
    alert(`Progress tersimpan. WhatsApp berhasil: ${ok}, gagal: ${fail}`);
  } catch (e) {
    alert(e.message);
  }
}

async function sendCurrent() {
  try {
    const no = document.getElementById("activeTicket").value.trim();
    if (!no) return alert("Masukkan nomor ticket.");
    const data = await api(`/api/ticket/${encodeURIComponent(no)}/send`, { method: "POST" });
    const ok = data.sendResults?.filter(x => x.success).length || 0;
    const fail = data.sendResults?.filter(x => !x.success).length || 0;
    alert(`Pengiriman selesai. Berhasil: ${ok}, gagal: ${fail}`);
  } catch (e) {
    alert(e.message);
  }
}

document.getElementById("search").addEventListener("input", renderCustomers);
init();
