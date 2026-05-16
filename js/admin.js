// admin.js — Admin login page
document.addEventListener("DOMContentLoaded", () => {
  const form     = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");

  // Demo credentials (in real app use server-side auth)
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";

  // If already logged in, skip to dashboard
  if (localStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "admin-dashboard.html";
    return;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("adminLoggedIn", "true");
      window.location.href = "admin-dashboard.html";
    } else {
      errorMsg.style.display = "block";
      errorMsg.textContent   = "Invalid username or password.";
      document.getElementById("password").value = "";
    }
  });

  // Toggle password visibility
  const toggle = document.getElementById("toggle-pw");
  const pwField = document.getElementById("password");
  toggle && toggle.addEventListener("click", () => {
    pwField.type = pwField.type === "password" ? "text" : "password";
    toggle.textContent = pwField.type === "password" ? "👁" : "🙈";
  });
});
