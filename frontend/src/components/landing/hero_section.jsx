import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const typedRef = useRef(null);

  useEffect(() => {
    const phrases = ["بذكاء", "بفعالية", "بمنهجية", "مع BacAidz", "وحقق النجاح!"];
    let pi = 0, ci = 0, del = false;
    let timeout;

    function tl() {
      const cur = phrases[pi];
      if (!del) {
        typedRef.current.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; timeout = setTimeout(tl, 2000); return; }
      } else {
        typedRef.current.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; timeout = setTimeout(tl, 400); return; }
      }
      timeout = setTimeout(tl, del ? 42 : 72);
    }
    tl();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll(".sbfill").forEach((b, i) => {
        const w = b.style.width;
        b.style.width = "0";
        setTimeout(() => {
          b.style.transition = "width 1.2s cubic-bezier(.4,0,.2,1)";
          b.style.width = w;
        }, 350 + i * 140);
      });
    }, 700);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
      alignItems: "center", padding: "8rem 3rem 5rem", gap: "4rem",
      position: "relative", overflow: "hidden"
    }}>
      <div className="hmesh" />
      <div className="hgrid" />

      {/* LEFT */}
      <div className="hl">
        <div className="lbadge">
          <span className="bping" />
          منصة رسمية · الجزائر 🇩🇿
        </div>
        <h1 className="hh1">
          كل نجاح كبير
          <span className="l2">يبدأ بخطوة واحدة</span>
          <span className="acc">واثقة.</span>
        </h1>
        <div className="htype">
          راجع <span className="typed" ref={typedRef} /><span className="blink" />
        </div>
        <p className="hsub">
          BacAidz ترافقك من التحضير حتى التوجيه — بموارد مركزة،
          خريطة طريق واضحة، ومجتمع يدفعك نحو القمة.
        </p>
        <div className="hbtns">
          <Link to="/signup" className="bprime">
  ابدأ الآن
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M3 7.5H12M12 7.5L8.5 4M12 7.5L8.5 11" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</Link>
        </div>
        {/* CENTRALIZED STATISTICS */}
        <div className="hmetrics" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div><span className="mnum">12<em>k+</em></span><span className="mlab">طالب مسجل</span></div>
          <div><span className="mnum">98<em>%</em></span><span className="mlab">نسبة الرضا</span></div>
          <div><span className="mnum">5<em>★</em></span><span className="mlab">متوسط التقييم</span></div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hr">
        <div className="owrap">
          <div className="scard sc1">
            <span className="schip">📚 مراجعات</span>
            <div className="sctitle">الرياضيات<br />&amp; العلوم</div>
            <div className="sbars">
              <div className="sbar"><div className="sbfill" style={{ width: "82%" }} /></div>
              <div className="sbar"><div className="sbfill" style={{ width: "65%" }} /></div>
              <div className="sbar"><div className="sbfill" style={{ width: "74%" }} /></div>
            </div>
          </div>
          <div className="scard sc2">
            <span className="schip">🎯 أهداف</span>
            <div className="sctitle">التوجيه<br />الجامعي</div>
            <div className="sbars">
              <div className="sbar"><div className="sbfill" style={{ width: "91%" }} /></div>
              <div className="sbar"><div className="sbfill" style={{ width: "58%" }} /></div>
            </div>
          </div>
          <div className="scard sc3">
            <span className="schip">⚡ بكالوريا 2027</span>
            <div className="sctitle">العد<br />التنازلي</div>
            <div className="sbars">
              <div className="sbar"><div className="sbfill" style={{ width: "96%" }} /></div>
            </div>
          </div>
          <div className="corb">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M10 8h22a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="rgba(167,139,250,0.85)" />
              <path d="M8 10v28" stroke="rgba(124,92,252,0.9)" strokeWidth="3" strokeLinecap="round" />
              <line x1="15" y1="18" x2="29" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="24" x2="29" y2="24" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="15" y1="30" x2="23" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="fbadge fb1"><span className="fbi">🏆</span><span className="fbt">أفضل تلميذ<span className="fbs">ولاية الجزائر</span></span></div>
          <div className="fbadge fb2"><span className="fbi">✅</span><span className="fbt">+180 بطاقة<span className="fbs">متوفرة</span></span></div>
          <div className="fbadge fb3"><span className="fbi">📈</span><span className="fbt">نقاط +23%<span className="fbs">في 30 يوماً</span></span></div>
          <div className="fbadge fb4"><span className="fbi">🇩🇿</span><span className="fbt">12 000 تلميذ<span className="fbs">يثقون بنا</span></span></div>
        </div>
      </div>
    </section>
  );
}