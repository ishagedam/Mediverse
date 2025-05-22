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
  y: -30, opacity: 0, duration: 1
});

gsap.from(".section2 .elem", {
  scrollTrigger: { trigger: ".section2", start: "top 80%" },
  y: 50, opacity: 0, duration: 1, stagger: 0.2
});

// Show only top doctors on load and render star rating
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".docs").forEach(doc => {
    const rating = parseFloat(doc.dataset.rating);
    const ratingDiv = doc.querySelector(".rating");

    if (rating >= 4) {
      doc.style.display = "block";

      // Show stars
      const fullStars = Math.floor(rating);
      const stars = "⭐".repeat(fullStars);
      ratingDiv.textContent = `${stars} (${rating})`;
    } else {
      doc.style.display = "none";
    }
  });
});

// Filter doctors by department
function filterDoctorsByDepartment(dept) {
  document.querySelectorAll(".docs").forEach(doc => {
    doc.style.display = doc.dataset.department === dept ? "block" : "none";
  });
}

// Service click triggers doctor filter
document.querySelectorAll(".section2 .elem").forEach(elem => {
  elem.addEventListener("click", () => {
    const dept = elem.dataset.department;
    filterDoctorsByDepartment(dept);
    document.querySelector("#doctors").scrollIntoView({ behavior: "smooth" });
  });
});
