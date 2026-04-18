import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Calendar, Ticket, Music, Camera, Utensils, Disc, Sparkles } from 'lucide-react';

const Consent = () => {
  const [isPluggedIn, setIsPluggedIn] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [activeSection, setActiveSection] = useState('all');

  // 充電アニメーションのロジック - 「溜め」を演出するために非線形に
  useEffect(() => {
    let timer;
    if (isPluggedIn && chargeProgress < 100) {
      // 80%を超えたら「溜め」のために速度を落とす
      const delay = chargeProgress > 80 ? 60 : 35;
      const increment = chargeProgress > 90 ? 0.5 : 1.5;

      timer = setTimeout(() => {
        setChargeProgress(prev => Math.min(prev + increment, 100));
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isPluggedIn, chargeProgress]);

  // 100%になった時の遷移トリガー
  useEffect(() => {
    if (chargeProgress === 100) {
      const effectTimer = setTimeout(() => {
        setIsTransitioning(true); // ワイプアウト開始
      }, 800); // 溜めの余韻

      const mainTimer = setTimeout(() => {
        setShowMainContent(true);
      }, 1600); // ワイプが広がりきったタイミング

      return () => {
        clearTimeout(effectTimer);
        clearTimeout(mainTimer);
      };
    }
  }, [chargeProgress]);

  // ノイズフィルター
  const GrainyOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.05]" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
    </div>
  );

  // ローディング画面
  if (!showMainContent) {
    return (
      <div className={`fixed inset-0 bg-[#FBBF24] flex flex-col items-center justify-center p-6 overflow-hidden select-none`}>
        <GrainyOverlay />
        
        {/* ワイプアウト遷移レイヤー */}
        {isTransitioning && (
          <div className="fixed inset-0 z-[100] bg-black animate-wipe-out flex items-center justify-center">
            <Zap size={180} className="text-[#FBBF24] fill-[#FBBF24] animate-zap-expand" />
          </div>
        )}

        {/* ヘッダーテキスト */}
        <div className={`transition-all duration-1000 transform ${isPluggedIn ? '-translate-y-[250%] opacity-0 scale-75' : 'translate-y-0 opacity-100 scale-100'} mb-16 text-center absolute top-1/4`}>
          <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-black mb-2 leading-none uppercase">
            Are you ready to
          </h2>
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-black leading-none uppercase">
            Plug In?
          </h1>
        </div>

        {/* インタラクティブ・コンセント */}
        <div 
          className={`relative transition-all duration-700 ease-in-out ${isPluggedIn ? 'translate-y-4' : 'translate-y-20'}`}
          onClick={() => { if(!isPluggedIn) setIsPluggedIn(true); }}
        >
          {/* 充電リング */}
          {isPluggedIn && (
            <div className="absolute inset-[-60px] border-[12px] border-black/5 rounded-full overflow-hidden">
               <div 
                className="absolute inset-[-10px] border-[12px] border-black rounded-full transition-all duration-100 ease-out"
                style={{ clipPath: `inset(${100 - chargeProgress}% 0 0 0)` }}
              />
            </div>
          )}

          {/* コンセント本体 */}
          <div className={`bg-[#E5E7EB] p-10 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ${isPluggedIn ? 'scale-105 ring-8 ring-black/10' : 'hover:-translate-y-2 cursor-pointer active:scale-95'} ${isPluggedIn && chargeProgress < 100 ? 'animate-vibrate' : ''}`}>
            <div className="w-28 h-44 bg-[#D1D5DB] rounded-xl p-5 flex flex-col justify-between items-center shadow-inner border border-white/50 relative">
              {[1, 2].map((i) => (
                <div key={i} className="w-14 h-14 flex justify-center items-center space-x-4">
                  <div className={`w-2.5 h-8 rounded-sm transition-all duration-300 ${isPluggedIn ? 'bg-black shadow-[0_0_15px_rgba(0,0,0,0.8)]' : 'bg-[#4B5563]'}`}></div>
                  <div className={`w-2.5 h-8 rounded-sm transition-all duration-300 ${isPluggedIn ? 'bg-black shadow-[0_0_15px_rgba(0,0,0,0.8)]' : 'bg-[#4B5563]'}`}></div>
                </div>
              ))}
              
              {/* スパーク演出 */}
              {isPluggedIn && chargeProgress < 100 && (
                <>
                  <Sparkles className="absolute -top-4 -right-4 text-black animate-pulse" size={24} />
                  <Zap className="absolute inset-0 m-auto text-black animate-bounce opacity-20" size={60} />
                </>
              )}
            </div>
          </div>

          {!isPluggedIn && (
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce-slow flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-sm font-black italic shadow-2xl tracking-widest">
              <Zap size={20} fill="currentColor" /> CLICK TO CONNECT
            </div>
          )}
          
          {isPluggedIn && (
            <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 text-center w-80 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <span className={`text-6xl font-black italic text-black block mb-2 leading-none ${chargeProgress === 100 ? 'animate-pulse' : ''}`}>
                {chargeProgress === 100 ? "BOOTED" : `${Math.floor(chargeProgress)}%`}
              </span>
              <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-black h-full transition-all duration-100 ease-out" style={{ width: `${chargeProgress}%` }}></div>
              </div>
              <p className="text-xs font-black tracking-[0.3em] text-black/40 uppercase mt-4 animate-pulse leading-relaxed">
                {chargeProgress === 100 ? "ESTABLISHING CONNECTION..." : "Gathering Energy..."}
              </p>
            </div>
          )}
        </div>

        <div className="absolute bottom-12 flex items-center gap-12 opacity-30 grayscale">
           <span className="font-bold text-2xl italic tracking-tighter">mcps</span>
           <span className="font-serif italic text-2xl">Daily Sense.</span>
        </div>

        <style>{`
          @keyframes wipe-out {
            0% { clip-path: circle(0% at 50% 50%); }
            100% { clip-path: circle(150% at 50% 50%); }
          }
          .animate-wipe-out {
            animation: wipe-out 1s cubic-bezier(0.85, 0, 0.15, 1) forwards;
          }
          @keyframes zap-expand {
            0% { transform: scale(0.5); opacity: 0; }
            40% { transform: scale(1.2); opacity: 1; }
            80% { transform: scale(1.5); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          .animate-zap-expand {
            animation: zap-expand 0.9s ease-out forwards;
          }
          @keyframes vibrate {
            0% { transform: translate(0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(0); }
          }
          .animate-vibrate {
            animation: vibrate 0.1s linear infinite;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, 0); }
            50% { transform: translate(-50%, -10px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // メインコンテンツ
  return (
    <div className="min-h-screen bg-[#FBBF24] text-black font-sans selection:bg-black selection:text-white animate-fade-in">
      <GrainyOverlay />
      
      {/* 画面遷移用のアニメーションオーバーレイ */}
      <div className="fixed inset-0 z-[100] bg-black pointer-events-none animate-fade-out"></div>

      {/* ヘッダー情報バナー */}
      <div className="bg-black text-[#FBBF24] py-2 px-4 flex justify-between items-center text-[10px] md:text-xs font-black tracking-[0.2em] sticky top-0 z-40 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          CONSENT 2026.05.15(FRI) @ solfa MIDNIGHT /// mcps x Daily Sense. /// CONSENT 2026.05.15(FRI) @ solfa MIDNIGHT /// mcps x Daily Sense.
        </div>
      </div>

      <header className="px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-6 inline-block bg-black text-white px-4 py-1.5 text-xs font-black italic transform -skew-x-12 animate-pulse shadow-lg">
          ⚡️ SYSTEM ONLINE / FULLY CHARGED
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-2 bg-black/5 blur-xl rounded-full transition"></div>
          <h1 className="relative text-7xl md:text-[10rem] font-black italic tracking-tighter leading-none mb-6 flex items-center justify-center">
            <span className="relative">
              CONSENT
            </span>
          </h1>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 text-xl md:text-3xl font-black italic tracking-tight">
            <span className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-black/5">
              <Calendar size={28} /> 2026.05.15 (FRI)
            </span>
            <span className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-black/5">
              <MapPin size={28} /> solfa NAKAMEGURO
            </span>
          </div>
          <p className="text-[10px] font-black tracking-[0.5em] opacity-50 uppercase">
            24:00 - 05:00 / TOKYO MIDNIGHT SENSE
          </p>
        </div>
      </header>

      {/* ナビゲーション */}
      <div className="sticky top-10 z-30 flex justify-center py-5 bg-[#FBBF24]/95 backdrop-blur-lg border-y border-black/10 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-3">
          {['all', 'live', 'dance', 'dj', 'food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveSection(cat)}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeSection === cat ? 'bg-black text-white scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.15)]' : 'bg-white/40 hover:bg-white text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-32">
          
          {(activeSection === 'all' || activeSection === 'live') && (
            <section className="animate-in slide-in-from-bottom-8 duration-700">
              <SectionTitle icon={<Music />} title="LIVE" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <ArtistCard name="VivaOla" role="Artist" />
              </div>
            </section>
          )}

          {(activeSection === 'all' || activeSection === 'dance') && (
            <section className="animate-in slide-in-from-bottom-8 duration-700">
              <SectionTitle icon={<Camera />} title="DANCE SHOWCASE" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                <ArtistCard name="mico + Lea + Rua" role="mcps / OP" isOp />
                <ArtistCard name="SEIYA & JUMPEI" role="Dancer" />
                <ArtistCard name="Mitsuhiro x Serina Yoshida" role="Dancer" />
                <ArtistCard name="KENSEI x Jillie Jay" role="Dancer" />
                <ArtistCard name="SOMA + Mori Minami" role="Dancer" />
                <ArtistCard name="Hachi + RYUTATHEKID" role="Dancer" />
              </div>
            </section>
          )}

          {(activeSection === 'all' || activeSection === 'dj') && (
            <section className="animate-in slide-in-from-bottom-8 duration-700">
              <SectionTitle icon={<Disc />} title="DJ" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <ArtistCard name="KANGTA" role="DJ" />
                <ArtistCard name="$hun Luigi" role="DJ" />
                <ArtistCard name="yutyforce" role="DJ" />
                <ArtistCard name="LEAD-OFF MAN" role="DJ" />
                <ArtistCard name="airi" role="DJ" />
                <ArtistCard name="Moemu" role="DJ" />
              </div>
            </section>
          )}

          {(activeSection === 'all' || activeSection === 'food') && (
            <section className="animate-in slide-in-from-bottom-8 duration-700">
              <SectionTitle icon={<Utensils />} title="FOOD" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <ArtistCard name="纒纒浪漫" role="Food Vendor" />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* チケット情報 */}
      <section className="bg-black text-white py-32 px-6 mt-32 relative overflow-hidden">
        <Zap className="absolute -right-20 -top-20 text-white opacity-5 w-96 h-96" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-16">TICKETS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <div className="border-2 border-white/10 p-10 rounded-[2rem] group cursor-pointer bg-white/5 backdrop-blur-sm">
              <p className="text-[#FBBF24] font-black tracking-[0.3em] mb-3 uppercase text-xs">Advance</p>
              <p className="text-6xl font-black mb-6 tracking-tight">¥3,300</p>
              <p className="text-xs opacity-40 font-bold uppercase tracking-widest">+1 Drink Charge</p>
            </div>
            <div className="border-2 border-white/10 p-10 rounded-[2rem] group cursor-pointer bg-white/5 backdrop-blur-sm">
              <p className="text-[#FBBF24] font-black tracking-[0.3em] mb-3 uppercase text-xs">At Door</p>
              <p className="text-6xl font-black mb-6 tracking-tight">¥3,800</p>
              <p className="text-xs opacity-40 font-bold uppercase tracking-widest">+1 Drink Charge</p>
            </div>
          </div>
          <button className="bg-[#FBBF24] text-black w-full md:w-auto px-16 py-6 rounded-full font-black text-2xl italic hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 mx-auto shadow-[0_20px_60px_rgba(251,191,36,0.3)]">
            <Ticket size={32} strokeWidth={3} /> PURCHASE TICKET
          </button>
        </div>
      </section>

      <footer className="py-24 px-6 flex flex-col items-center justify-center bg-[#FBBF24]">
        <div className="flex gap-16 mb-12 items-center grayscale opacity-40">
           <img src="../public/assets/images/logo_black_2.svg" alt="mcpc logo black" className='w-32'/>
           <span className="font-serif italic text-3xl">Daily Sense.</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 25s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes fade-out {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-in-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-6 mb-16 border-b-[6px] border-black pb-6">
    <div className="bg-black text-white p-3 rounded-2xl shadow-lg">
      {React.cloneElement(icon, { size: 40, strokeWidth: 2.5 })}
    </div>
    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">{title}</h2>
  </div>
);

const ArtistCard = ({ name, role, isOp }) => (
  <div className="relative group perspective-1000">
    <div className="bg-white p-4 md:p-5 shadow-2xl transform transition-all  ring-1 ring-black/5">
      <div className="aspect-square bg-[#F3F4F6] relative overflow-hidden mb-5">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20"></div>
        <div className="w-full h-full flex items-center justify-center text-black/[0.03] font-black text-9xl italic select-none">
          {name.split(' ')[0][0]}
        </div>
        {isOp && (
          <div className="absolute top-3 left-3 bg-black text-[#FBBF24] text-[11px] font-black px-3 py-1.5 transform -rotate-12 shadow-xl z-10 tracking-tighter">
            OPENING SHOW
          </div>
        )}
        <div className="absolute bottom-3 left-3 w-8 h-8 bg-black flex items-center justify-center rounded-lg opacity-80 shadow-lg">
          <Zap size={16} fill="#FBBF24" className="text-[#FBBF24]" />
        </div>
      </div>
      
      <div className="text-center pb-2">
        <h3 className="text-lg md:text-xl font-black italic leading-tight mb-2 truncate px-2">{name}</h3>
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">{role}</p>
      </div>
    </div>
    <div className="absolute -inset-4 bg-black/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 rounded-full"></div>
  </div>
);

export default Consent;