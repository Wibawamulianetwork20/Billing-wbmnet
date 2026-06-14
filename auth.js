import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById("btnLogin")
.addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    alert("Login berhasil");

    location.href = "dashboard.html";

  } catch (error) {

    console.error(error);

    alert("password atau user salah");

  }

});