const elements = {
    loader: document.querySelector(".loader"),
    logo: document.querySelector(".logo-container"),
    line: document.querySelector(".loader-line"),
    panelTop: document.querySelector(".panel-top"),
    panelBottom: document.querySelector(".panel-bottom"),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runLoader() {
  if (!elements.loader) return;

  elements.loader.style.display = "block";
  
  await sleep(400);
  elements.logo.style.opacity = "1";

  await sleep(1500);
  elements.logo.style.opacity = "0";

  await sleep(700);
  elements.line.style.transform = "scaleX(1)";

  await sleep(500);
  elements.line.style.opacity = "0";
  elements.panelTop.style.transform = "translateY(-100%)";
  elements.panelBottom.style.transform = "translateY(100%)";

  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("is-visible");

  await sleep(900);
  elements.loader.style.display = "none";
}

window.addEventListener("load", async () => {
  gsap.registerPlugin(ScrollTrigger);
  
  await runLoader();
  initScrollAnimations();
});

function initScrollAnimations() {
  // 1. テキストやロゴの順次浮き上がり
  gsap.utils.toArray('.reveal-item').forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: i * 0.1
    });
  });

  // 2. KV画像のパララックス（視差効果）
  // PC/SP両方でスクロールに合わせて画像がわずかに動く
  gsap.to("#kv-img", {
    scrollTrigger: {
      trigger: ".panel-kv",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    },
    scale: 1.1,
    y: "10%",
    ease: "none"
  });
}

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: target,
        ease: "power4.inOut"
      });
    }
  });
});