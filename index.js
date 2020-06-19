const colors = [
	'red',
	'blue',
	'green',
	'yellow'
];

const trans = [
  function skewPlus(target) {
    let tl = gsap.to(target, {
      skewX: "8deg",
      duration: heroDuration
    });
    return tl;
  },
  function skewMinus(target) {
    let tl = gsap.to(target, {
      skewX: "-10deg",
      duration: heroDuration
    });
    return tl;
  },
  function rotatePlus(target) {
    let tl = gsap.to(target, {
      rotate: "3deg",
      duration: heroDuration
    });
    return tl;
  },
  function rotateMinus(target) {
    let tl = gsap.to(target, {
      rotate: "-5deg",
      duration: heroDuration
    });
    return tl;
  },
	(target)=>(null),
	(target)=>(null),
	(target)=>(null),
	(target)=>(null)
];

Splitting();

// HERO CHARACTERS
const heroDuration = 2.2
const heroTimeline = gsap.timeline();
const chars = document.querySelectorAll(".char");

chars.forEach((v,i)=>{
  let rColor = colors[Math.floor(Math.random() * colors.length)];
  let rTrans = trans[Math.floor(Math.random() * trans.length)](v);
	heroTimeline.add(rTrans, i/10);
	v.classList.add(rColor);
});

const scrollTimeline = gsap.timeline({scrollTrigger: {
  scrub: true,
  trigger: "#hero",
  start: "top",
  end: "bottom +=20%"
}});

const words = document.querySelectorAll(".word");

words.forEach((word,wordIndex)=>{
  word.childNodes.forEach((char,charIndex)=>{
    scrollTimeline.to(char,{
      scale: 0.25,
      translateX: `-${charIndex * 75}%`,
      translateY: `-${wordIndex * 75}%`
    });
  });
});

// NAV SLIDER

const navBtn = document.querySelector("nav button");
const nav = document.querySelector("nav");

nav.addEventListener("click", ()=>{
		nav.classList.toggle("min");
});
