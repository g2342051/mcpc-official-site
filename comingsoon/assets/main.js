// GSAP関連プラグインの登録
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ローディング要素を取得
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
  if (hero) { hero.classList.add("is-visible");}

  // 5) ローダー自体を消す（クリック等を邪魔しないように）
  await sleep(900);
  elements.loader.style.display = "none";
}



// ここが無いとローダーは動きません
window.addEventListener("load", async () => {
  if (!assertElements()) return;

  try {
    await runLoader();
  } catch (e) {
    console.error("[loader] error:", e);
    // 失敗しても黒画面固定は回避
    if (elements.loader) elements.loader.style.display = "none";
  }

  setupHorizontalScroll();
});

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

// main.js の最後の方に追加
// main.js のハンバーガーメニュー処理部分

document.addEventListener('DOMContentLoaded', () => {
    const menuTrigger = document.getElementById('menu-trigger');
    const navMenu = document.getElementById('nav');
    const body = document.body; // body要素を取得

    if (menuTrigger && navMenu) {
        menuTrigger.addEventListener('click', () => {
            menuTrigger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // --- ここを追加 ---
            // メニューが開いている（activeクラスがある）ときだけクラスを付与
            body.classList.toggle('overflow-hidden');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuTrigger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // --- ここを追加 ---
                // リンクをクリックしてメニューが閉じたらスクロールを戻す
                body.classList.remove('overflow-hidden');
            });
        });
    }
});
// --- Initialization ---
window.addEventListener("load", async () => {
  await runLoader();
  setupAnimations(); // ← ここを実行することでアニメーションが始まります
  setupMenu();
});


// スムーズスクロール設定（GSAP ScrollToPlugin使用）
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
        ease: "power3.inOut"  // 加減速の具合（滑らかになります）
      });
    }
  });
});