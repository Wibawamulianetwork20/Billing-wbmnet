// auth.js
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, getIdTokenResult } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
if(btnLogin) btnLogin.dataset.text = btnLogin.innerText;
if(btnRegister) btnRegister.dataset.text = btnRegister.innerText;

function setLoading(btn, state){
  if(!btn) return;
  btn.disabled = state;
  btn.innerText = state ? 'Loading...' : btn.dataset.text;
}

// MODAL CONTROL - export biar bisa dipanggil dari HTML
window.bukaModal = function(){
  document.getElementById('modalAuth').style.display = 'flex';
  switchModal('login');
}

window.tutupModal = function(){
  document.getElementById('modalAuth').style.display = 'none';
  document.getElementById('errorLogin').style.display = 'none';
  document.getElementById('errorRegister').style.display = 'none';
  document.getElementById('successRegister').style.display = 'none';
}

window.switchModal = function(type){
  document.getElementById('boxLogin').classList.remove('active');
  document.getElementById('boxRegister').classList.remove('active');
  document.getElementById('box' + type.charAt(0).toUpperCase() + type.slice(1)).classList.add('active');
}

// REGISTER
if(btnRegister){
btnRegister.onclick = async () => {
  const nama = document.getElementById('regNama').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const nohp = document.getElementById('regHP').value.trim();
  const pass = document.getElementById('regPass').value;
  const errorEl = document.getElementById('errorRegister');
  const successEl = document.getElementById('successRegister');
  
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  
  if(!nama || !email || !nohp || !pass){
    errorEl.innerText = 'Semua field wajib diisi';
    errorEl.style.display = 'block';
    return;
  }
  if(pass.length < 6){
    errorEl.innerText = 'Password minimal 6 karakter';
    errorEl.style.display = 'block';
    return;
  }
  
  setLoading(btnRegister, true);
  
  try{
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, 'users', userCred.user.uid), {
      nama, email, nohp, role: 'pelanggan', createdAt: serverTimestamp()
    });
    successEl.innerText = 'Daftar berhasil! Silakan login';
    successEl.style.display = 'block';
    setTimeout(() => switchModal('login'), 1500);
  }catch(err){
    errorEl.innerText = err.message.replace('Firebase: ', '');
    errorEl.style.display = 'block';
  }
  setLoading(btnRegister, false);
}
}

// LOGIN
if(btnLogin){
btnLogin.onclick = async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errorEl = document.getElementById('errorLogin');
  errorEl.style.display = 'none';
  
  if(!email || !pass){
    errorEl.innerText = 'Email dan password wajib diisi';
    errorEl.style.display = 'block';
    return;
  }
  
  setLoading(btnLogin, true);
  
  try{
    await signInWithEmailAndPassword(auth, email, pass);
    tutupModal();
    window.location.href = 'pelanggan.html';
  }catch(err){
    errorEl.innerText = 'Email atau password salah';
    errorEl.style.display = 'block';
  }
  setLoading(btnLogin, false);
}
}

// CEK ROLE + NAVBAR
onAuthStateChanged(auth, async user => {
  const navAuth = document.getElementById('navAuth');
  if(!navAuth) return;
  
  if(user){
    const token = await getIdTokenResult(user, true);
    if(token.claims.admin === true){
      navAuth.innerHTML = '<a href="admin.html" class="btn-nav">Admin Panel</a> <button onclick="logout()" class="btn-logout">Logout</button>';
    } else {
      navAuth.innerHTML = '<a href="pelanggan.html" class="btn-nav">Pelanggan Panel</a> <button onclick="logout()" class="btn-logout">Logout</button>';
    }
  } else {
    navAuth.innerHTML = '<button onclick="bukaModal()" class="btn-nav">Login</button>';
  }
});

window.logout = () => signOut(auth);
