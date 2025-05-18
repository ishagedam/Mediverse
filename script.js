// Navbar Slide Menu
const menuIcon = document.querySelector("#nav i");
const fullNav = document.querySelector("#full");
const closeIcon = document.querySelector("#full i");

const tl = gsap.timeline({ paused: true });

tl.to("#full", { right: 0, duration: 0.6, ease: "power2.out" });
tl.from("#full h4", { x: 150, opacity: 0, duration: 0.5, stagger: 0.2 });
tl.from("#full i", { opacity: 0 });

menuIcon.addEventListener("click", () => tl.play());
closeIcon.addEventListener("click", () => tl.reverse());

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

gsap.from(".section-heading", {
  scrollTrigger: {
    trigger: ".section-heading",
    start: "top 80%",
  },
  y: -30,
  opacity: 0,
  duration: 1
});


// Animate service cards on scroll
gsap.from(".section2 .elem", {
  scrollTrigger: {
    trigger: ".section2",
    start: "top 80%",
    toggleActions: "play none none none",
  },
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.2,
  ease: "power2.out"
});

ScrollTrigger.create({
   trigger: ".section2",
   start: "top 80%",
   onEnter: () => console.log("✅ Services section triggered")
 }); 

// Appointment Form
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeFormBtn");
const formContainer = document.getElementById("appointmentFormContainer");
const form = document.getElementById("appointmentForm");

openBtn.addEventListener("click", () => {
  formContainer.style.display = "block";
  gsap.fromTo(formContainer, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6 });
});

closeBtn.addEventListener("click", () => {
  gsap.to(formContainer, {
    opacity: 0,
    y: 50,
    duration: 0.6,
    onComplete: () => formContainer.style.display = "none"
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
});
