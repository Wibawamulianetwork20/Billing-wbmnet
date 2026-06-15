import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const errorMsg = document.getElementById("errorMsg");

function setLoading(btn, state) {
  btn.disabled = state;
  btn.textContent = state ? "Loading..." : btn.dataset.text;
}

// Simpan text asli tombol
btnLogin.dataset.text = btnLogin.textContent;
btnRegister.dataset.text = btnRegister.textContent;

/* REGISTER */
btnRegister?.addEventListener("click", async () => {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!email || !password) {
    errorMsg.textContent = "Email dan password wajib diisi";
    return;
  }

  setLoading(btnRegister, true);
  errorMsg.textContent = "";

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    
    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      email: email,
      role: "admin",
      ispId: "isp1",
      createdAt: Date.now()
    });

    alert("Register berhasil, silakan login");
    showLogin();

  } catch (err) {
    errorMsg.textContent = err.message;
  }

  setLoading(btnRegister, false);
});

/* LOGIN */
btnLogin?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    errorMsg.textContent = "Email dan password wajib diisi";
    return;
  }

  setLoading(btnLogin, true);
  errorMsg.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // replace biar gak bisa back ke login
    window.location.replace("dashboard.html?v=" + Date.now());

  } catch (err) {
    errorMsg.textContent = "Login gagal: " + err.message;
  }

  setLoading(btnLogin, false);
});

/* SESSION CHECK */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    localStorage.setItem("role", data.role);
    localStorage.setItem("ispId", data.ispId);
    localStorage.setItem("email", data.email);
  } catch (e) {
    console.log("Session error", e);
  }
});
