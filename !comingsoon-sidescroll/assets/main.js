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
}


function setupHorizontalScroll() {
  // GSAP/ScrollTriggerが無いならここで終了（ローダーは消えてるので黒画面にはならない）
  if (typeof gsap === "undefined") {
    console.warn("[gsap] gsap が読み込まれてない");
    return;
  }
  if (typeof ScrollTrigger === "undefined") {
    console.warn("[gsap] ScrollTrigger が読み込まれてない");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.querySelector(".inner-wrapper");
  const section = document.querySelector(".horizontal-section");

  if (!wrapper || !section) {
    console.warn("[scroll] 必要な要素が見つかりません (.horizontal-section / .inner-wrapper)");
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  tl.to({}, { duration: 0.1 });
  tl.to(wrapper, { x: "-50vw", ease: "none" });
  tl.to({}, { duration: 0.1 });
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




// GSAP横スクロールをセットアップ
//gsap.registerPlugin(ScrollTrigger);
  //      const wrapper = document.querySelector(".inner-wrapper");
        
        // タイムライン設定
    //    const tl = gsap.timeline({
      //      scrollTrigger: {
        //        trigger: ".horizontal-section",
          //      start: "top top",
            //    end: "+=2000",   // スクロール量（重さの調節）
              //  pin: true,       // 画面固定
                //scrub: 1,      // 操作への追従速度（0.5は比較的軽め）
            //    anticipatePin: 1
            //}
        //});

        // 1. 最初：少し「遊び」を入れて、すぐには動かないようにする
        //tl.to({}, { duration: 2 });

        // 2. 移動：横に50vwスライド
        //tl.to(wrapper, {
            //x: "-50vw",
            //ease: "none",      // 等速で動かして軽さを出す
            //duration: 8
        //});

        // 3. 最後：少し「遊び」を入れて、急に縦スクロールに戻るのを防ぐ
        //tl.to({}, { duration: 2 });
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
