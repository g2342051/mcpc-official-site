// ==========================================
// mcpc official site - Scroll Logic (Snap)
// ==========================================

const elements = {
  loader: document.querySelector(".loader"),
  logo: document.querySelector(".logo-container"),
  line: document.querySelector(".loader-line"),
  panelTop: document.querySelector(".panel-top"),
  panelBottom: document.querySelector(".panel-bottom"),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function assertElements() {
  const missing = Object.entries(elements).filter(([, el]) => !el);
  if (missing.length) {
    if (elements.loader) elements.loader.style.display = "none";
    return false;
  }
  return true;
}

// 1. Loader Animation
async function runLoader() {
  elements.loader.style.display = "block";
  elements.logo.style.opacity = "1";
  await sleep(1200);
  elements.logo.style.opacity = "0";
  await sleep(600);
  elements.line.style.transform = "scaleX(1)";
  await sleep(400);
  elements.line.style.opacity = "0";
  elements.panelTop.style.transform = "translateY(-100%)";
  elements.panelBottom.style.transform = "translateY(100%)";

  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("is-visible");

  await sleep(800);
  elements.loader.style.display = "none";
}

// 2. Main Animations
function setupAnimations() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

  const wrapper = document.querySelector(".inner-wrapper");
  const section = document.querySelector(".horizontal-section");

  // ==========================================
  // Responsive Setup (MatchMedia)
  // ==========================================
  ScrollTrigger.matchMedia({
    // --- Desktop (769px+) ---
    "(min-width: 769px)": function() {
      // 横移動の距離計算
      let scrollAmount = wrapper.offsetWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollAmount * 1.5}`, // 少し余裕を持たせる
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          // スナップ設定: セクションごとにピタッと止まる
          snap: {
            snapTo: [0, 0.5, 1], // [Hero終了, Intro+KV, Check+Footer]
            duration: { min: 0.5, max: 1.2 },
            delay: 0.1,
            ease: "power2.inOut"
          }
        }
      });

      tl.to(wrapper, { x: -scrollAmount, ease: "none" });
    },

    // --- Mobile (768px-) ---
    "(max-width: 768px)": function() {
      gsap.set(wrapper, { x: 0 });
      // モバイルは標準の縦スクロールにフェードインを足すのみ
    }
  });

  // ==========================================
  // Typewriter演出 (Intro)
  // ==========================================
  const typewriterPs = document.querySelectorAll(".typewriter-target p");
  typewriterPs.forEach((p) => {
    const originalText = p.innerHTML;
    p.innerHTML = ""; 

    gsap.to(p, {
      scrollTrigger: {
        trigger: p,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      text: {
        value: originalText,
        speed: 1
      },
      duration: 2,
      ease: "none"
    });
  });

  // ==========================================
  // CHECK IT!! 演出
  // ==========================================
  gsap.from(".check-content-inner", {
    scrollTrigger: {
      trigger: ".panel-check",
      start: "top 70%",
    },
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: "power3.out"
  });

  // ==========================================
  // Header Nav Smooth Scroll
  // ==========================================
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: target,
            ease: "power3.inOut"
          });
        }
      }
    });
  });
}

// Start
window.addEventListener("load", async () => {
  if (!assertElements()) return;
  await runLoader();
  setupAnimations();
});