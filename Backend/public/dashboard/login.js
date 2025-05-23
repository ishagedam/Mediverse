document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("/doctor-names");
    const names = await res.json();
    const select = document.getElementById("doctor");
  
    names.forEach(row => {
      const option = document.createElement("option");
      option.value = row.doctor_name;
      option.textContent = row.doctor_name;
      select.appendChild(option);
    });
  
    // Animate login card
    gsap.from(".login-card", {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: "power3.out"
    });
  });
  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const doctor = document.getElementById("doctor").value;
    const password = document.getElementById("password").value;
    const spinner = document.getElementById("spinner");
    const loginText = document.getElementById("login-text");
  
    spinner.style.display = "inline-block";
    loginText.textContent = "Logging in...";
  
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor, password }),
      });
  
      if (!res.ok) {
        spinner.style.display = "none";
        loginText.textContent = "Login";
        return alert("Login failed. Check credentials.");
      }
  
      window.location.href = "/dashboard/dashboard.html";
    } catch (err) {
      spinner.style.display = "none";
      loginText.textContent = "Login";
      alert("Server error during login.");
    }
  });
// Modal functionality
const modal = document.getElementById("forgot-modal");
const openBtn = document.getElementById("forgot-password-btn");
const closeBtn = document.querySelector(".modal .close");

openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

document.getElementById("forgot-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value;
  alert(`Reset link sent to ${email}`);
  modal.style.display = "none";
});
  