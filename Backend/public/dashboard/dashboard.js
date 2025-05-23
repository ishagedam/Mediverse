async function fetchDoctorName() {
  const res = await fetch("/me");

  if (!res.ok) {
    window.location.href = "/dashboard/login.html";
    return;
  }

  const data = await res.json();

  // ✅ Set welcome text
  document.getElementById("welcome-heading").textContent = `Welcome, ${data.doctorName}`;

  // ✅ Set profile image
  document.getElementById("profile-pic").src = data.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // ✅ Load appointments for this doctor
  loadAppointments(data.doctorName);
}


async function loadAppointments(doctorName) {
  const res = await fetch(`/appointments?doctor=${encodeURIComponent(doctorName)}`);
  const appointments = await res.json();
  const tbody = document.querySelector("#appointmentsTable tbody");
  tbody.innerHTML = "";

  appointments.forEach((appt, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${appt.first_name} ${appt.last_name}</td>
      <td>${appt.age}</td>
      <td>${appt.gender}</td>
      <td>${appt.email}</td>
      <td>${appt.date}</td>
      <td>${appt.time}</td>
    `;
    tbody.appendChild(row);
  });

  // GSAP Animation
  gsap.from("#appointmentsTable tbody tr", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5
  });
}

function logout() {
  document.cookie = "token=; Max-Age=0";
  window.location.href = "/dashboard/login.html";
}

fetchDoctorName();

// 🌙 Theme toggle logic
const themeToggleBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggleBtn.textContent = theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";
}

function toggleTheme() {
  const current = localStorage.getItem("theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", current);
  applyTheme(current);
}

themeToggleBtn.addEventListener("click", toggleTheme);

// ✅ Auto-detect system preference on first load
document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = localStorage.getItem("theme");

  if (!savedTheme) {
    // Detect system dark mode preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    savedTheme = prefersDark ? "dark" : "light";
    localStorage.setItem("theme", savedTheme);
  }

  applyTheme(savedTheme);
});


// 🧠 Apply saved theme on load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});
function toggleTheme() {
  const current = localStorage.getItem("theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", current);
  applyTheme(current);
  themeToggleBtn.textContent = current === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode";
}
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("My Appointments", 14, 15);
  doc.autoTable({
    html: "#appointmentsTable",
    startY: 20,
    theme: "striped",
    headStyles: { fillColor: [37, 117, 252] }
  });

  doc.save("appointments.pdf");
}
function exportExcel() {
  const table = document.getElementById("appointmentsTable");
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.table_to_sheet(table);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
  XLSX.writeFile(workbook, "appointments.xlsx");
}
