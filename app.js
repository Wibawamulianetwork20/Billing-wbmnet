import { auth } from "firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("menu");
const navAuth = document.getElementById("navAuth");

function closeMenu(){
  if(!menuBtn || !navMenu) return;
  menuBtn.classList.remove("active");
  navMenu.classList.remove("active");
  menuBtn.setAttribute("aria-expanded","false");
}

if(menuBtn && navMenu){
  menuBtn.addEventListener("click",()=>{
    const active=menuBtn.classList.toggle("active");
    navMenu.classList.toggle("active",active);
    menuBtn.setAttribute("aria-expanded",active?"true":"false");
  });
  navMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
}

document.addEventListener("click",(event)=>{
  if(navMenu && menuBtn && !navMenu.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
});

function updateNav(user){
  if(!navAuth) return;
  const nama=localStorage.getItem("pelanggan_nama");
  const id=localStorage.getItem("pelanggan_id");

  if(user){
    navAuth.textContent="Logout";
    navAuth.onclick=async()=>{
      await signOut(auth);
      localStorage.removeItem("pelanggan_id");
      localStorage.removeItem("pelanggan_nama");
      localStorage.removeItem("pelanggan_idpel");
      location.reload();
    };
  }else if(id && nama){
    navAuth.textContent=`Halo, ${nama}`;
    navAuth.onclick=()=>location.href="pelanggan.html";
  }else{
    navAuth.textContent="My WBM";
    navAuth.onclick=()=>location.href="daftar.html";
  }
}

onAuthStateChanged(auth,updateNav);

const params=new URLSearchParams(location.search);
const paket=params.get("paket");
if(paket) sessionStorage.setItem("wbm_paket",paket);
