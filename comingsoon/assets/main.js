gsap.registerPlugin(ScrollTrigger);

        const wrapper = document.querySelector(".inner-wrapper");
        
        // タイムライン設定
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".horizontal-section",
                start: "top top",
                end: "+=2000",   // スクロール量（重さの調節）
                pin: true,       // 画面固定
                scrub: 1,      // 操作への追従速度（0.5は比較的軽め）
                anticipatePin: 1
            }
        });

        // 1. 最初：少し「遊び」を入れて、すぐには動かないようにする
        tl.to({}, { duration: 2 });

        // 2. 移動：横に50vwスライド
        tl.to(wrapper, {
            x: "-50vw",
            ease: "none",      // 等速で動かして軽さを出す
            //duration: 8
        });

        // 3. 最後：少し「遊び」を入れて、急に縦スクロールに戻るのを防ぐ
        tl.to({}, { duration: 2 }); 
