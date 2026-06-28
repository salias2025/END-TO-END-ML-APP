import { useEffect, useRef } from "react";

export default function CompteARebours() {
  const daysRef = useRef(null);
  const hoursRef = useRef(null);
  const minsRef = useRef(null);
  const secsRef = useRef(null);

  useEffect(() => {
    // Target date: 7 June 2027 at 8:00 AM
    const target = new Date("2027-06-07T08:00:00").getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        [daysRef, hoursRef, minsRef, secsRef].forEach((r) => { if (r.current) r.current.textContent = "00"; });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (daysRef.current) daysRef.current.textContent = String(d).padStart(2, "0");
      if (hoursRef.current) hoursRef.current.textContent = String(h).padStart(2, "0");
      if (minsRef.current) minsRef.current.textContent = String(m).padStart(2, "0");
      if (secsRef.current) secsRef.current.textContent = String(s).padStart(2, "0");
    }

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="countdown" style={{ direction: 'rtl', textAlign: 'center' }}>
      <div className="reveal">
        <span className="cde">العد التنازلي الرسمي</span>
        <h2 className="cdt">
          لا يزال هناك وقت.<br />
          كل ثانية مهمة من أجل <span>مستقبلك.</span>
        </h2>
        <div className="cdrow">
          <div className="cdunit">
            <span className="cdnum" ref={daysRef}>00</span>
            <span className="cdlab">أيام</span>
          </div>
          <span className="cdsep">:</span>
          <div className="cdunit">
            <span className="cdnum" ref={hoursRef}>00</span>
            <span className="cdlab">ساعات</span>
          </div>
          <span className="cdsep">:</span>
          <div className="cdunit">
            <span className="cdnum" ref={minsRef}>00</span>
            <span className="cdlab">دقائق</span>
          </div>
          <span className="cdsep">:</span>
          <div className="cdunit">
            <span className="cdnum" ref={secsRef}>00</span>
            <span className="cdlab">ثواني</span>
          </div>
        </div>
        <p className="cdnote">بكالوريا 2027 الجزائر · دورة جوان — 7 جوان 2027</p>
      </div>
    </section>
  );
}