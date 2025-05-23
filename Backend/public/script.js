gsap.registerPlugin(ScrollTrigger);

// Navbar menu animation
const menuIcon = document.querySelector("#nav i");
const fullNav = document.querySelector("#full");
const closeIcon = document.querySelector("#full i");
const tl = gsap.timeline({ paused: true });

tl.to("#full", { right: 0, duration: 0.6, ease: "power2.out" });
tl.from("#full h4", { x: 150, opacity: 0, duration: 0.5, stagger: 0.2 });
tl.from("#full i", { opacity: 0 });

menuIcon.addEventListener("click", () => tl.play());
closeIcon.addEventListener("click", () => tl.reverse());

// Scroll animations
gsap.from(".section-heading", {
  scrollTrigger: { trigger: ".section-heading", start: "top 80%" },
  y: -30,
  opacity: 0,
  duration: 1,
});

// Load departments from DB
async function loadDepartments() {
  const res = await fetch("http://localhost:3000/departments");
  const departments = await res.json();
  const container = document.querySelector("#services-container");
  container.innerHTML = "";

  departments.forEach((dept) => {
    const elem = document.createElement("div");
    elem.className = "elem";
    elem.dataset.department = dept.name.toLowerCase();
    elem.innerHTML = `
      <div class="elem-part1">
        <h2>${dept.name}</h2>
        <h4>Learn more</h4>
      </div>
      <div class="img"><img src="${dept.image}" alt="${dept.name}" /></div>
    `;
    elem.addEventListener("click", () => {
      filterDoctorsByDepartment(dept.name.toLowerCase());
      document.getElementById("doctors-heading").textContent = `${dept.name} Doctors`;
      document.querySelector("#doctors").scrollIntoView({ behavior: "smooth" });
    });
    container.appendChild(elem);
  });
}

// Load doctors
async function loadDoctors() {
  const res = await fetch("http://localhost:3000/doctors");
  const doctors = await res.json();
  const firstRow = document.querySelector("#First-Row");
  const secondRow = document.querySelector("#Second-Row");
  firstRow.innerHTML = "";
  secondRow.innerHTML = "";

  doctors.forEach((doc, i) => {
    const card = document.createElement("div");
    card.className = "docs";
    card.dataset.department = doc.department.toLowerCase();
    card.dataset.rating = doc.rating;
    card.innerHTML = `
      <img src="${doc.image}" class="doc-img" />
      <h3>${doc.name}</h3>
      <h4>${doc.specialization}</h4>
      <div class="rating">⭐ ${doc.rating}</div>
    `;

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Book appointment with ${doc.name}`);

    function openModal() {
      document.getElementById("doctorName").value = doc.name;
      document.getElementById("modal-doctor-name").textContent = `Book Appointment with ${doc.name}`;
      document.getElementById("appointment-modal").style.display = "flex";
    }

    card.addEventListener("click", openModal);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });

    (i % 2 === 0 ? firstRow : secondRow).appendChild(card);
    if (doc.rating < 4) card.style.display = "none";
  });
}

function filterDoctorsByDepartment(dept) {
  document.querySelectorAll(".docs").forEach((doc) => {
    doc.style.display = doc.dataset.department === dept ? "block" : "none";
  });
}

document.getElementById("reset-filter").addEventListener("click", () => {
  document.getElementById("doctors-heading").textContent = "Top Doctors to Book";
  document.querySelectorAll(".docs").forEach((doc) => {
    const rating = parseFloat(doc.dataset.rating);
    doc.style.display = rating >= 4 ? "block" : "none";
  });
  document.querySelector("#doctors").scrollIntoView({ behavior: "smooth" });
});

// Modal close
document.querySelector(".modal .close").addEventListener("click", () => {
  document.getElementById("appointment-modal").style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target.id === "appointment-modal") {
    document.getElementById("appointment-modal").style.display = "none";
  }
});

// Disable past dates
window.addEventListener("DOMContentLoaded", () => {
  loadDepartments();
  loadDoctors();
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("appointmentDate").min = today;
});

// Input live validation
function validateInput(id, condition) {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (condition(input.value)) {
      input.classList.add("valid");
      input.classList.remove("invalid");
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
    }
  });
}

validateInput("age", (val) => parseInt(val) > 0);
validateInput("patientEmail", (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
validateInput("firstName", (val) => val.trim().length > 0);
validateInput("lastName", (val) => val.trim().length > 0);
validateInput("appointmentDate", (val) => val !== "");
validateInput("appointmentTime", (val) => val !== "");

// Form steps with animation
let currentStep = 1;

function nextStep() {
  if (validateStep1()) {
    gsap.to("#step-1", {
      opacity: 0,
      y: -30,
      duration: 0.3,
      onComplete: () => {
        document.getElementById("step-1").classList.remove("active");
        document.getElementById("step-2").classList.add("active");
        gsap.fromTo("#step-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 });
      },
    });
  }
}

function prevStep() {
  gsap.to("#step-2", {
    opacity: 0,
    y: 30,
    duration: 0.3,
    onComplete: () => {
      document.getElementById("step-2").classList.remove("active");
      document.getElementById("step-1").classList.add("active");
      gsap.fromTo("#step-1", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 });
    },
  });
}

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}

function clearError(id) {
  document.getElementById(id).textContent = "";
}

function validateStep1() {
  let valid = true;

  const first = document.getElementById("firstName").value.trim();
  const last = document.getElementById("lastName").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("patientEmail").value.trim();

  clearError("firstName-error");
  clearError("lastName-error");
  clearError("age-error");
  clearError("email-error");
  clearError("gender-error");

  if (!first) {
    showError("firstName-error", "First name is required.");
    valid = false;
  }
  if (!last) {
    showError("lastName-error", "Last name is required.");
    valid = false;
  }
  if (!age || age <= 0) {
    showError("age-error", "Enter a valid age.");
    valid = false;
  }
  if (!gender) {
    showError("gender-error", "Select gender.");
    valid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError("email-error", "Invalid email.");
    valid = false;
  }

  return valid;
}

// Final submit
document.getElementById("appointment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const timeRaw = document.getElementById("appointmentTime").value;
  const amPm = document.getElementById("amPm").value;
  const [hr, min] = timeRaw.split(":");
  let hour = parseInt(hr);

  if (amPm === "PM" && hour < 12) hour += 12;
  if (amPm === "AM" && hour === 12) hour = 0;

  // Validate business hours
  if (!(hour >= 10 && hour < 14 || hour >= 16 && hour <= 22)) {
    alert("Please select a time between 10am–2pm or 4pm–11pm.");
    return;
  }

  // ✅ MySQL-compatible 24-hour format with seconds
  const finalTime = `${hour.toString().padStart(2, "0")}:${min.padStart(2, "0")}:00`;

  const payload = {
    doctor: document.getElementById("doctorName").value,
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    age: parseInt(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    email: document.getElementById("patientEmail").value,
    date: document.getElementById("appointmentDate").value,
    time: finalTime,
  };

  try {
    const res = await fetch("http://localhost:3000/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert(await res.text());
    document.getElementById("appointment-form").reset();
    document.querySelectorAll(".form-step").forEach((s) => s.classList.remove("active"));
    document.getElementById("step-1").classList.add("active");
    document.getElementById("appointment-modal").style.display = "none";
  } catch (err) {
    console.error(err);
    alert("Failed to book appointment.");
  }
});
