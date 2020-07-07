// =========GLOBAL TRIGGER FUNCTIONS=========

// Manipulates DOM so needs to be called first
Splitting();

// Trigger all JavaScript when page is ready
document.addEventListener('DOMContentLoaded', ready);

function ready() {
	// Build all GSAP timelines for #hero
	getHeroGSAP();
	// Build nav timelines & add click listener to nav
	buildNav();
	// Add colors to buttons & headers in portfolio
	addPortColors();
	// Add link styling
	addLinkHovers();
	// Build <section> ScrollTrigger animations
	buildSectionScrolls();
	// Build all GSAP timelines for SVG Ghost
	buildGhostTimeline();
}

// ================COLOUR DEFS================

// Array of color classes
const colors = [
	'red',
	'blue',
	'green',
	'yellow'
];

const bgColors = [
	'white',
	...colors
]

// Returns random color class name
function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

// Returns random background color
function getRandomBgColor() {
	return bgColors[Math.floor(Math.random() * bgColors.length)];
}

// ==================LINKS==================

// Grab all links
const links = Array.from(document.querySelectorAll("a:not(.custom-link)"));
// Adds link interaction styling
function addLinkHovers() {
		links.forEach((a) => {
			// Define transition, with duration dictated by element width
			a.style.transition = `box-shadow ${Math.max(230, a.offsetWidth)}ms ease-in`;
			a.onmouseenter = () => vertLinkEnter(a);
			a.onmouseleave = () => linkLeave(a);
			a.onfocus = () => vertLinkEnter(a);
			a.onblur = () => linkLeave(a);
		});
}

function horzLinkEnter(element) {
	// Adds inset box shadow to link from bottom
	element.style.boxShadow = -`0px -${element.offsetHeight * 0.8}px yellow inset`;
	element.style.webkitBoxShadow = `0px -${element.offsetHeight * 0.8}px yellow inset`;
	element.style.mozBoxShadow = `0px -${element.offsetHeight * 0.8}px yellow inset`;
}

function vertLinkEnter(element) {
	// Adds inset box shadow to link offset by width of element
	element.style.boxShadow = `${element.offsetWidth}px 0 yellow inset`;
	element.style.webkitBoxShadow = `${element.offsetWidth}px 0 yellow inset`;
	element.style.mozBoxShadow = `${element.offsetWidth}px 0 yellow inset`;
}

function linkLeave(element) {
	// Resets box shadow to invisible
	element.style.boxShadow = `0px 0 yellow inset`;
	element.style.webkitBoxShadow = `0px 0 yellow inset`;
	element.style.mozBoxShadow = `0px 0 yellow inset`;
}

//====================HERO====================

// Duration in seconds for initial character transforms
const heroDuration = 2.2

// Array of GSAP transform and null functions
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
	function rotateFull(target) {
		let tl = gsap.to(target, {
			rotate: "+=360deg",
			duration: heroDuration,
			repeatDelay: 3,
			repeat: -1,
			ease: "back.inOut(1.7)"
		});
		return tl;
	},
	(target)=>(null),
	(target)=>(null),
	(target)=>(null),
	(target)=>(null)
];

// List of all split characters in #hero
const chars = document.querySelectorAll("#hero .char");
// List of all split words in #hero
const words = document.querySelectorAll("#hero .word");
// Get #head element
const head = document.querySelector("#head");
// Get #head chars
const headChars = document.querySelectorAll("#head .char");

// Master function to get all #hero GSAP
function getHeroGSAP(){
	// Build a gsap timeline for inital #hero transforms
	buildCharacterAnimation(chars);
	// Build ScrollTrigger timeline for #hero characters
	buildScrollTimeline(words);
}

// Returns random transform tween
function getRandomTransform() {
	return trans[Math.floor(Math.random() * trans.length)];
}

// Create new timeline
const heroTimeline = gsap.timeline();
// Create header timeline
const headerTimeline = gsap.timeline();

// Expects array of characters
function buildCharacterAnimation(chars){
	// For each character...
	chars.forEach((v, i) => {
		// Pick random colour
		let rColor = getRandomColor();
		// Pick random transform
		let rTrans = getRandomTransform();
		// Add transform to timeline at index / 10 seconds
		heroTimeline.add(rTrans(v), i / 10);
		// Add color class to character
		v.style.color = rColor;
		// Add same transition & color to corresponding #head character
		addToHeader(rColor,rTrans,i);
	});
}

// Adds supplied color & trans to header
function addToHeader(color, trans, index) {
	// Try adding to headChars[index]
	try {
		// Change color in corresponding header
		headChars[index].style.color = color;
		// If trans supplied, 
		headerTimeline.add(trans(headChars[index]));
		// Catch error of index being beyond #head chars
	} catch { null };
}

// Expects array of words with characters
function buildScrollTimeline(words) {
	// Create new timeline
	const scrollTimeline = gsap.timeline({
		// Add ScrollTrigger
		scrollTrigger: {
			// Scrub animation with scroll in real time
			scrub: true,
			// Watch #hero element as trigger
			trigger: "#hero",
			// Start timeline when scroll and element are top aligned
			start: "top",
			// End timeline when bottom of scroll is 50% down the element
			end: "bottom +=50%",
			// Show header when animation is finished
			onLeave: ()=>{
				head.classList.add("show");
				heroTimeline.pause();
			},
			// Hide header when hero scrolls back into view
			onEnterBack: ()=>{
				head.classList.remove("show");
				heroTimeline.play();
			},
			// Show header if page loads past hero
			onRefresh: ({progress})=>{
				if(progress === 1){
					head.classList.add("show");
				};
			}
		}
	});
	// Iterate over words
	words.forEach(word => {
		// For each child(character)...
		word.childNodes.forEach((char, charIndex) => {
			// Add CharacterScrollAnimation to scrollTimeline
			scrollTimeline.add(buildCharacterScrollAnimation(char, charIndex));
		});
	});
}

// Expects character node element, index of character in word, index of word in hero
function buildCharacterScrollAnimation(char,charIndex){
	// Return gsap animation...
	return gsap.to(char, {
		// Transform origin either top right or top left depending on odd/even
		transformOrigin: `top ${charIndex % 2 ? "right" : "left"}`,
		// Scale to nothing
		scale: 0,
		// Translate characterIndex * 75% either left or right
		translateX: `${charIndex % 2 ? "+" : "-"}${charIndex * 75}%`,
		// Translate upwards 100% so off screen
		translateY: "-100%",
		// Rotate 90deg clock or anti-clock
		rotate: `${charIndex % 2 ? "+" : "-"}90deg`
	});
}

// ==================NAV SLIDER==================

// Find <nav>
const nav = document.querySelector("nav");

function buildNav() {
	// Make nav timelines
	buildNavTimelines();
	// Add click listener
	addNavListener();
}

// Add click listener to toggle min class, i.e show/hide
function addNavListener(){
	nav.addEventListener("click", () => {
		// Play appropriate timeline
		if(nav.classList.contains("max")){
			navTimelineMin.restart();
		} else {
			navTimelineMax.restart();
		}
	});
}

const navTimelineMax = gsap.timeline({
	// Set default speed for tweens
	defaults: {duration: "400ms"},
	// Toggle max class to trigger pseudo animations
	onStart: ()=> {nav.classList.toggle("max")},
	// Change focus
	onComplete: ()=>{nav.focus()}
});

const navTimelineMin = gsap.timeline({
	// Set default speed for tweens
	defaults: {duration: "100ms"},
	// Toggle max class to trigger pseudo animations
	onStart: ()=> {nav.classList.toggle("max")},
	// Change focus
	onComplete: ()=>{nav.blur()}
});

function buildNavTimelines() {
	// Add tweens to maximise nav timeline
	navTimelineMax.to("nav", { translateX: "0%" }, 0);
	navTimelineMax.to("nav button", { translateY: "32.5vh" }, 0);
	navTimelineMax.to("nav a", { translateX: 0, stagger: 0.1 }, 0.2);
	// Add tweens to minimise nav timeline
	navTimelineMin.to("nav a", { translateX: "100vw", stagger: 0.1 });
	navTimelineMin.to("nav", { translateX: "100%" }, 0);
	navTimelineMin.to("nav button", { translateY: "0vh" }, 0);	
}

// =================PORTFOLIO=================

// Get all portfolio buttons
const portfolioLinks = document.querySelectorAll(".button-grid a");
// Get all portfolio entry titles
const portfolioEntryHeaders = document.querySelectorAll(".portfolio-entry__title");

// Add random colors to matching buttons & entry headers
function addPortColors() {
	portfolioLinks.forEach((btn, ind) => {
		// Get random color
		let rColor = getRandomColor();
		// Add random color to button background
		btn.style.background = rColor;
		// Add random color to corresponding entry header
		portfolioEntryHeaders[ind].style.background = rColor;
	})
}

// ===================SECTION===================

// Get all <section> elements
const sections = document.querySelectorAll("section");

// Builds GSAP ScrollTrigger timeline for each section
function buildSectionScrolls(){
	sections.forEach((section, index) => {
		// Create new scroll timeline
		let sectionScrollTimeline = gsap.timeline({
			scrollTrigger: {
				// Scrub animation with scroll in real time
				scrub: 0.2,
				// Watch section element as trigger
				trigger: section,
				// Start timeline when scroller is 80% down element
				start: "top +=80%",
				// End timeline when element is 25% from top of screen
				end: "top 25%",
				// Trigger header animation on enter
				onEnter: () => {
					sectionTimeline.restart();
					// Play ghost timeline if contact section
					index === 2 && ghostTimeline.play();
					index === 2 && getEyeMove(section);
				},
				// Reverse header animation when element scrolled out of view
				onLeaveBack: () => {
					sectionTimeline.reverse();
					// Pause ghost timeline if contact section
					index === 2 && ghostTimeline.pause();
				}
			}
		});
		// Create section header timeline
		let sectionTimeline = gsap.timeline();
		// Get split characters from header
		let headerChars = section.querySelectorAll(".char");
		// Get content wrapper for section
		let headerText = section.querySelector(".section-container");

		// Random colour header characters
		headerChars.forEach(char => {
			char.classList.add(getRandomColor());
		});

		// Translate characters from +100% to 0%
		sectionTimeline.fromTo(headerChars, {
			y: "100%"
		}, {
			y: "0%",
			// Ease out & back
			ease: "back.out(1.7)",
			duration: 0.7,
			// Stagger letters
			stagger: 0.1
		}
		);

		// Translate content wrapper to visible on scroll
		sectionScrollTimeline.fromTo(headerText, {
			y: "-100%"
		}, {
			y: "0%"
		});
	});
}


// =================CONTACT GHOST=================

// Create GSAP timeline for SVG Ghost
const ghostTimeline = gsap.timeline({paused: true});

// Assemble all ghost tweens to timeline
function buildGhostTimeline() {
	ghostTimeline.add(getShadowTween(), 0);
	ghostTimeline.add(getBlinkTimeline(), 0);
	ghostTimeline.add(getFloatTween(), 0);
}

// Animates shadow
function getShadowTween() {
	return gsap.to('.ghost__shadow', {
		// Animate SVG Path attributes
		attr: { rx: '30px', ry: '5px' },
		repeat: -1,
		yoyo: true,
		ease: Power1.easeInOut,
		duration: 1
	});
}

// Independent blink timeline
function getBlinkTimeline() {
	// Independent timeline to animate eye blinking
	let tl = gsap.timeline({ repeat: -1, repeatDelay: 2, defaults: {duration: 0.18} });
	// Attribute not scale to avoid line distortion
	tl.to('.ghost__eye', { attr: { ry: '0px' } });
	tl.to('.ghost__eye', { attr: { ry: '12.5px' } });
	tl.to('.ghost__eye', { attr: { ry: '0px' } });
	tl.to('.ghost__eye', { attr: { ry: '12.5px' } });
	return tl;
}

// Float tween for whole ghost SVG group
function getFloatTween() {
	return gsap.fromTo('#ghost', { 
		y: '-10px'
	 },{
		y: '10px',
		yoyo: true,
		repeat: -1,
		ease: Power1.easeInOut,
		duration: 1
	});
}

// Adds mouse move listener to element for ghost eye movement
// Called by onEnter of #contact ScrollTrigger
function getEyeMove(element) {
	element.addEventListener('mousemove', eyeMove);
}

// Offsets eyes slightly based on cursor position in given element
function eyeMove(e) {
	gsap.to(".ghost__eye", {
		// Coordinates within element
		x: e.layerX / 100,
		y: e.layerY / 30,
		ease: "linear",
		duration: 0.2
	});
}

// ======================FOOTER======================

// Get all blocks and header elements from footer
const footerBlocks = [
	...document.querySelectorAll(".block"),
	...document.querySelectorAll("footer h3")
];

function colorFooterBlocks() {
	// Iterate over all footer blocks
	footerBlocks.forEach(node => {
		// Assign random background color
		node.style.background = getRandomBgColor();
		// Randomise background color on mouseover
		node.onmouseenter = () => node.style.background = getRandomBgColor();
	});
}