// ================================
// Loader + Horizontal Scroll (GSAP)
// ================================

const elements = {
    loader: document.querySelector(".loader"),
    logo: document.querySelector(".logo-container"),
    line: document.querySelector(".loader-line"),
    panelTop: document.querySelector(".panel-top"),
    panelBottom: document.querySelector(".panel-bottom"),
};
// ちょっと待つ用（async/awaitで「演出の順番」を書くため）
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 要素が無いときに、そこで即死しないようにガード
function assertElements() {
  const missing = Object.entries(elements)
    .filter(([, el]) => !el)
    .map(([key]) => key);

  if (missing.length) {
    console.warn(
      "[loader] Missing elements:",
      missing,
      "→ index.htmlのIDと一致してるか確認してね"
    );
    // ローダーが壊れてるなら、最悪ページ本体だけ見せる
    if (elements.loader) elements.loader.style.display = "none";
    return false;
  }
  return true;
}

// ローディング演出本体
async function runLoader() {
  const body = document.body;

  body.classList.add('overflow-hidden'); // ローダー中はスクロールさせない
  
  // 念のため最初に表示状態を整える（CSSを触ったときに事故らない用）
  elements.loader.style.display = "block";
  elements.loader.style.opacity = "1";

  // 1) ロゴをフェードイン
  await sleep(400);
  elements.logo.style.opacity = "1";

  // 2) ロゴをフェードアウト
  await sleep(1500);
  elements.logo.style.opacity = "0";

  // 3) 線を左→右に伸ばす
  await sleep(700);
  elements.line.style.transform = "scaleX(1)";

  // 4) パネルを上下に割る
  await sleep(500);
  elements.line.style.opacity = "0";
  elements.panelTop.style.transform = "translateY(-100%)";
  elements.panelBottom.style.transform = "translateY(100%)";

  // ★ ここで中のコンテンツにクラスを付与！
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.add("is-visible");
  }

  // 5) ローダー自体を消す（クリック等を邪魔しないように）
  await sleep(900);
  elements.loader.style.display = "none";

  body.classList.remove('overflow-hidden'); // ローダーが終わったらスクロールを戻す
}

function setupAnimations() {
  // 1. テキストリビール (reveal-item)
  gsap.utils.toArray('.reveal-item').forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 92%", 
        toggleActions: "play none none reverse"
      },
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: (i % 3) * 0.1
    });
  });
}

// 横スクロールのセットアップ
function setupHorizontalScroll() {
  const wrapper = document.querySelector(".inner-wrapper");
    const section = document.querySelector(".horizontal-section");
    if (!wrapper || !section) return;

    // matchMedia (tが抜けていたのを修正)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
        // PC用の設定
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${wrapper.offsetWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            },
        });

        tl.to({}, { duration: 0.1 });
        tl.to(wrapper, { x: "-50vw", ease: "none" });
        tl.to({}, { duration: 0.1 });

        return () => {
            // リセット用
            gsap.set(wrapper, { x: 0 });
        };
    });
}

//ハンバーガーメニュー処理
//function setupMenu() {
//    const menuTrigger = document.getElementById('menu-trigger');
//    const navMenu = document.getElementById('nav');
//    const body = document.body; // body要素を取得

//    if (menuTrigger && navMenu) {
//        menuTrigger.addEventListener('click', () => {
//            menuTrigger.classList.toggle('active');
//            navMenu.classList.toggle('active');
            
//            // --- ここを追加 ---
//            // メニューが開いている（activeクラスがある）ときだけクラスを付与
//            body.classList.toggle('overflow-hidden');
//        });

//        navMenu.querySelectorAll('a').forEach(link => {
 //           link.addEventListener('click', () => {
//                menuTrigger.classList.remove('active');
//                navMenu.classList.remove('active');
                
                // --- ここを追加 ---
                // リンクをクリックしてメニューが閉じたらスクロールを戻す
//                body.classList.remove('overflow-hidden');
//            });
//        });
//      }
//}

// ハンバーガーメニューのセットアップ
function setupMenu() {
    const menuTrigger = document.getElementById('menu-trigger');
    const navMenu = document.getElementById('nav');
    const body = document.body;
    // 要素がないときは何もしない（安全策）
    if (!menuTrigger || !navMenu) return;

    menuTrigger.addEventListener('click', () => {
        menuTrigger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('overflow-hidden');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuTrigger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('overflow-hidden');
        });
    });
}


// ここが無いとローダーは動きません
//window.addEventListener("load", async () => {
//  if (!assertElements()) return;

//  try {
//    await runLoader();
//  } catch (e) {
//    console.error("[loader] error:", e);
    // 失敗しても黒画面固定は回避
//    if (elements.loader) elements.loader.style.display = "none";
//  }

//  setupHorizontalScroll();
//});





// スムーズスクロール設定（GSAP ScrollToPlugin使用）
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault(); // デフォルトのパッと切り替わる動きを止める

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // GSAPを使ってターゲットまでスクロール
        gsap.to(window, {
          duration: 1,        // スクロールにかかる秒数
          scrollTo: targetElement,
          ease: "power3.inOut"  // 加減速の具合
        });
      }
    });
  });
}

//追加 4/2
// --- Countdown Logic ---
function setupCountdown() { 
        const targetDate = new Date(2026, 3, 3, 20, 0, 0);

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            const timerArea = document.getElementById("timer_area");
            const finishedMsg = document.getElementById("finished_msg");

            if (diff <= 0) {
                if (timerArea) timerArea.style.display = 'none';
                if (finishedMsg) finishedMsg.style.display = 'block';
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = String(d).padStart(2, '0');
            document.getElementById("hours").textContent = String(h).padStart(2, '0');
            document.getElementById("minutes").textContent = String(m).padStart(2, '0');
            document.getElementById("seconds").textContent = String(s).padStart(2, '0');
        }

        setInterval(updateCountdown, 1000);
        updateCountdown();
}
function setupSlideshow() {
// --- Slideshow Logic ---
        const slides = document.querySelectorAll('.release-slide');
        let currentSlide = 0;

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // 4秒ごとに切り替え
        setInterval(nextSlide, 4000);
}

// ================================


// --- 初期化を一か所に集約 ---
window.addEventListener("load", async () => {
    if (!assertElements()) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    await runLoader();
    
    setupAnimations();
    setupHorizontalScroll();
    setupMenu();
    setupSmoothScroll();
    setupCountdown();
    setupSlideshow();
});

