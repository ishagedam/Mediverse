
var menu = document.querySelector("#nav i")
var cross = document.querySelector("#full i")

gsap.from("#nav h2",{
      y:-30,
      opacity:0,
      duaration:1,
      delay:0.5
})

var tl = gsap.timeline()                             /* {paused:true} = stop automation*/
 tl.to("#full",{
    right: 0,
    duration: 0.6,
 })

 tl.from("#full h4",{     
    x:150,
    duration:0.6,
    stagger:0.2,
    opacity:0,
    
 })


 tl.from("#full i",{
    opacity:0
 })
 tl.pause()

menu.addEventListener("click",function(){
   tl.play()
   
})

cross.addEventListener("click",function(){
   tl.reverse()
})

// gsap.from(".services h3",{
//    x:-100,
//    opacity:0,
//    duration:0.5,
//    scrollTrigger:{
//       trigger:".services h3",
//       scroller:"body",
//       markers:true,
//       start:"top 50%"

//    }
// })

var tl2 = gsap.timeline({
   scrollTrigger:{
      trigger:".section2",
      scroller:"body",
      markers:true,
      start:"top 50%", 
      end: "top 0%",
      scrub:true,
      toggleActions: "play reverse play reverses"

    }
})

tl2.from(".services",{
   y:30,
   opacity:0,
   duration:0.5
   
})

tl2.from(".elem.line1.left",{
   x:-300,
   opacity:0,
   duration:1,
   
},"anim")

tl2.from(".elem.line1.right",{
   x:300,
   opacity:0,
   duration:1,
},"anim")


tl2.from(".elem.line2.left",{
   x:-300,
   opacity:0,
   duration:1,
},"anime")
tl2.from(".elem.line2.right",{
   x:300,
   opacity:0,
   duration:1,
},"anime")


tl2.from(".elem.line3.left",{
   x:-300,
   opacity:0,
   duration:1,
},"pp")
tl2.from(".elem.line3.right",{
   x:300,
   opacity:0,
   duration:1,
},"pp")


// Show form on button click
document.getElementById("openFormBtn").addEventListener("click", () => {
  const formContainer = document.getElementById("appointmentFormContainer");
  formContainer.style.display = "block";

  gsap.fromTo(
    formContainer,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
  );

  gsap.fromTo(
    "#formHeading",
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
  );
});

// Reset form
document.getElementById("resetBtn").addEventListener("click", () => {
  const form = document.getElementById("appointmentForm");
  form.reset();
});

// Close form on clicking the × button
document.getElementById("closeFormBtn").addEventListener("click", () => {
  gsap.to("#appointmentFormContainer", {
    opacity: 0,
    y: 50,
    duration: 0.6,
    onComplete: () => {
      document.getElementById("appointmentFormContainer").style.display = "none";
    }
  });
});

tl2.from(".section3 .let h2",{
   y:-20,
   duration:1,
   delay:0.1,
   opacity:0,
   scale:0.2
});

gsap.from(".section3.let p",{
   scale:0.2,
   duration:2,
   stagger:0.05,
   opacity:0,
   color:purple,
})
