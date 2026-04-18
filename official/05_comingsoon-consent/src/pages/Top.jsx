import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

// プラグインの登録
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

function Top() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = useRef(); // GSAPのスコープ用

  // --- 1. ローディング演出 & 初期化 ---
// --- アニメーションの一括管理 ---
  useGSAP(() => {
    // 1. ローディングタイムライン
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        document.body.classList.remove('overflow-hidden');
      }
    });

    document.body.classList.add('overflow-hidden');

    // 初期状態のセット（一瞬表示されるのを防ぐ）
    tl.set(".loader", { display: "block", opacity: 1 })
      .set(".logo-container", { opacity: 0 })
      .set(".loader-line", { scaleX: 0, opacity: 1, transformOrigin: "left center", display: "block" })
      .set([".panel-top", ".panel-bottom"], { y: "0%" });

    // 1) ロゴをフェードイン (await sleep(400) に相当)
    tl.to(".logo-container", { opacity: 1, duration: 0.6 }, "+=0.4")

    // 2) ロゴをフェードアウト (await sleep(1500) に相当)
      .to(".logo-container", { opacity: 0, duration: 0.6 }, "+=0.6")

    
    // 4) パネルを上下に割る (await sleep(500) に相当)
      .to(".loader-line", { opacity: 0, duration: 1.0 }, "+=0.9") // 線が伸びきって少し待ってから消え始める
      .to(".panel-top", { 
        y: "-100%", 
        duration: 1.2, // 0.9から少し伸ばして「重厚感」を出す
        ease: "power4.inOut" // より滑らかな加減速に変更
      }, "-=0.9") // 線が消え切る少し前から動かし始める
      .to(".panel-bottom", { 
        y: "100%", 
        duration: 1.2, 
        ease: "power4.inOut" 
      }, "<") // 上パネルと完全に同時に動かす

    // ★ 中のコンテンツにクラスを付与 (isLoadingをfalseにする直前)
    // Reactでは state を変えることで hero.is-visible が付与されるように App.jsx 内で組んでいます

    // 5) ローダー自体を消す (await sleep(900) に相当)
      .set(".loader", { display: "none" }, "+=0.5");

    // 2. スクロールで出現するアニメーション
    gsap.utils.toArray('.reveal-item').forEach((item, i) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 92%",
          toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: (i % 3) * 0.1
      });
    });

    // 3. 横スクロール (PC用)
    let mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const wrapper = document.querySelector(".inner-wrapper");
      if (!wrapper) return;
      
      gsap.to(wrapper, {
        x: "-50vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-section",
          start: "top top",
          end: () => `+=${wrapper.offsetWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });
    });
  }, { scope: container });

  // --- 4. スムーズスクロール関数 ---
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMenuOpen(false); // メニューを閉じる
    document.body.classList.remove('overflow-hidden');
    
    gsap.to(window, {
      duration: 1,
      scrollTo: id,
      ease: "power3.inOut"
    });
  };

  const starringMembers = [
    "mico", "Akira", "airi", "chiharu", "Daicho", "Gaffai", "Hachi", "KANA", 
    "kana", "kyai", "Lea", "MiTo", "ran", "Ryo-ji", "Rua", "shu", "SOMA", 
    "sora kumamoto", "Takuya", "Tsukasa", "Yuzuha Nakatomi"
  ];

  return (
    <div ref={container}>
      {/* Loader */}
      <div className="loader">
        <div className="panel-top loader-panel"></div>
        <div className="panel-bottom loader-panel"></div>
        <div className="loader-line"></div>
        <div className="logo-container">
          <img src="/assets/images/logo_white_2.svg" alt="logo" />
        </div>
      </div>

      {/* Hero Section */}
      <section className={`hero ${!isLoading ? 'is-visible' : ''}`}>
        <header className="header">
          <button 
            className={`menu-trigger reveal-item ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
          
          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-links reveal-item">
              <li><a href="#horizontal-section" onClick={(e) => handleNavClick(e, "#horizontal-section")}>ABOUT</a></li>
              <li><a href="#horizontal-section" onClick={(e) => handleNavClick(e, "#horizontal-section")}>ARTISTS</a></li>
              <li><a href="#event-info" onClick={(e) => handleNavClick(e, "#event-info")}>NEWS</a></li>
              <li><a href="#release-info" onClick={(e) => handleNavClick(e, "#release-info")}>VIDEO</a></li>
              <li><a href="#horizontal-section" onClick={(e) => handleNavClick(e, "#horizontal-section")}>WORKS</a></li>

              {/* 追加：EVENTリンク（別タブで開く） */}
              <li>
                <a href="/consent" target='_blank' rel='noopener noreferrer'>EVENT</a>
              </li>
            </ul>
          </nav>
          <ul className='social-links reveal-item' aria-label="Social links">
            <li><a href="https://www.instagram.com/mcpc__official/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram fa-2xl"></i></a></li>
            <li><a href="https://www.youtube.com/@mcpc__official" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube fa-2xl"></i></a></li>
            <li><a href="https://www.tiktok.com/@mcpcofficial?lang=en" target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok fa-2xl"></i></a></li>
            <li><a href="mailto:mcpc0927@gmail.com"><i className="fa-regular fa-envelope fa-2xl"></i></a></li>
          </ul>
        </header>

        <h1 className="hero-image">
          <img src="/assets/images/logo_red_2.svg" alt="mcpc" />
        </h1>
        <div className="whats-new-container">
          <a href="#release-info" className="whats-new-link" onClick={(e) => handleNavClick(e, "#release-info")}>
            <span className="whats-new-text">WHAT'S NEW</span>
            <i className="fa-solid fa-chevron-down whats-new-arrow"></i>
          </a>
        </div>
      </section>

      {/* NEW: Release Info Section */}
      <section className="release-info" id="release-info">
        <div className="release-main-content">
          <h2 className="reveal-item logo-group">
            <span className="mcpc-presents">mcpc PRESENTS</span>
            <img src="/assets/images/flamingo/Flamingo_logo_only_flamingo_main_orange.svg" alt="Flamingo" />
            <span className="logo-sub">DANCE VIDEO RELEASE</span>
          </h2>
          <div className="video-container reveal-item">
            <iframe 
              src="https://www.youtube.com/embed/jPeZO-IS12U?si=ncROWkwyL_VgnjIj" 
              title="Flamingo - mcpc 【Official Dance Video】" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen>
            </iframe>
          </div>

          <div className="starring-section reveal-item">
            <span className="starring-label">Starring</span>
            <div className="starring-list">
              {starringMembers.map((name, index) => (
                <span key={index} className="starring-name">{name}</span>
              ))}
            </div>
          </div>
          <div className="reveal-item">
            <a href="https://www.youtube.com/@mcpc__official" target="_blank" rel="noreferrer" className="btn-youtube">
              <i className="fa-brands fa-youtube"></i>Visit our Channel
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="horizontal-section" id="horizontal-section">
        <div className="inner-wrapper">
          <div className="panel">
            <div className="panel-intro">
              <h2 className="comingsoon-title reveal-item">
                <span>SPRING 2026</span>
                <span>COMING SOON</span>
              </h2>
              <div className="comingsoon-text">
                <p className="reveal-item">
                  マルチアーティスト mico がプロデュースする、<br />
                  東京発のクリエイティブコレクティブ、mcpc。<br />
                  ダンス・振付を起点に、<br />
                  映像、モデル、ファッション、空間演出、アートなど<br />
                  多様な表現領域を横断しながら活動している。<br />
                </p>
                <p className="reveal-item">
                  変化する時代の中で普遍的な価値を大切にし、<br />
                  モダンとレトロが共存する独自の世界観を構築。<br />
                  メンバーはダンスを軸としつつ、<br />
                  それぞれ異なるバックグラウンドや感性を持ち、<br />
                  既存の枠にとらわれない表現で若手カルチャーを更新していく。
                </p>
              </div>
              <div className="reveal-item">
                <img src="/assets/images/logo_black_1.svg" alt="mcpc オフィシャルロゴ" className="logo-horizontal" />
                <div className="intro-social-links">
                  <ul aria-label="Social links">
                    <li><a href="https://www.instagram.com/mcpc__official/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram fa-sm" style={{ color: 'black' }}></i></a></li>
                    <li><a href="https://www.youtube.com/@mcpc__official" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube fa-sm" style={{ color: 'black' }}></i></a></li>
                    <li><a href="https://www.tiktok.com/@mcpcofficial?lang=en" target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok fa-sm" style={{ color: 'black' }}></i></a></li>
                    <li><a href="mailto:mcpc0927@gmail.com"><i className="fa-regular fa-envelope fa-sm" style={{ color: 'black' }}></i></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="panel panel-kv">
            <img src="/assets/images/kv.jpg" alt="mcpc キービジュアル" loading="lazy" />
          </div>

          <div className="panel">
            <div className="panel-check" id="event-info">
              <div className="event-kv reveal-item">
                <img src="/assets/images/event-consent/flyer_consent_1.jpg" alt="EVENT" loading="lazy" />
              </div>
              <div className="check-overlay reveal-item">
                <h2>EVENT INFO!!</h2>
                <div className="check-overlay-text">
                  <p>
                    mcpc × Daily Sense. present <br />our first event, <br /><strong>"CONSENT"<br /></strong>
                    <span className="spacer">
                      2026.05.15 (Fri) midnight <br />
                      <a href="https://google.com/maps" target="_blank" rel="noreferrer">@solfa Nakameguro Tokyo</a><br />
                    </span>
                    Stay tuned for updates!
                  </p>
                  <div className="check-btn-wrapper">
                    <a href="/consent" target='_blank' className="check-btn">
                      <i className="fa-solid fa-plug fa-xl"></i>
                      <span className="check-btn-text">MORE INFO</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Top;