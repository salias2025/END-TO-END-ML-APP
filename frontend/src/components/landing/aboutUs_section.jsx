import { useEffect, useRef } from "react";

export default function AboutUsSection() {
  const cubeRef = useRef(null);

  // 3D Cube Rotation
  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    let rotationX = 0;
    let rotationY = 0;
    let autoRotate = true;

    const animate = () => {
      if (autoRotate) {
        rotationY += 0.5;
        rotationX += 0.1;
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      }
      requestAnimationFrame(animate);
    };

    animate();

    cube.addEventListener('mouseenter', () => { autoRotate = false; });
    cube.addEventListener('mouseleave', () => { autoRotate = true; });

    return () => {
      cube.removeEventListener('mouseenter', () => { autoRotate = false; });
      cube.removeEventListener('mouseleave', () => { autoRotate = true; });
    };
  }, []);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('on');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 100);

    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* MARQUEE */}
      <div className="mstrip">
        <div className="mtrack">
          {["الرياضيات", "الفيزياء-الكيمياء", "العلوم الطبيعية", "اللغة العربية", "اللغة الفرنسية",
            "التاريخ-الجغرافيا", "الفلسفة", "الإعلام الآلي", "التوجيه", "بكالوريا 2027 🇩🇿"].concat(
            ["الرياضيات", "الفيزياء-الكيمياء", "العلوم الطبيعية", "اللغة العربية", "اللغة الفرنسية",
              "التاريخ-الجغرافيا", "الفلسفة", "الإعلام الآلي", "التوجيه", "بكالوريا 2027 🇩🇿"]
          ).map((item, i) => (
            <span className="mitem" key={i}><span>{item}</span> ·</span>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section id="about" style={{ padding: '6rem 3rem', background: 'var(--deep)', position: 'relative', overflow: 'hidden' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="slabel" style={{ justifyContent: 'center' }}>
            <span className="slbar" />🚀 الذكاء الاصطناعي في خدمة التعليم
          </div>
          <h2 className="sh2" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.8rem)' }}>
            ثورتك في عالم <span style={{ background: 'linear-gradient(115deg, #f472b6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>البكالوريا</span>
          </h2>
          <p className="ssub" style={{ margin: '0 auto', maxWidth: '600px' }}>
            منصة تعتمد على الذكاء الاصطناعي لفهم أسرار النجاح
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* LEFT - 3D Cube */}
          <div className="reveal rd1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              perspective: '1000px',
              width: '400px',
              height: '400px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div ref={cubeRef} style={{
                width: '280px',
                height: '280px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(0deg) rotateY(0deg)',
                transition: 'transform 0.1s ease'
              }}>
                {/* Face 1 - Data Collection */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(124,92,252,0.9), rgba(79,70,229,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(0deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(124,92,252,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>📊</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>جمع البيانات</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>بيانات حقيقية من تلاميذ جزائريين</p>
                </div>

                {/* Face 2 - Machine Learning */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(244,114,182,0.9), rgba(236,72,153,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(90deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(244,114,182,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>🤖</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>التعلم الآلي</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>خوارزميات لتوقع النتائج وتحليل العوامل</p>
                </div>

                {/* Face 3 - Feature Analysis */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(251,191,36,0.9), rgba(245,158,11,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(180deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(251,191,36,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>🔍</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>تحليل العوامل</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>اكتشاف العوامل المؤثرة في النجاح</p>
                </div>

                {/* Face 4 - Post-Bac Orientation */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(45,212,191,0.9), rgba(8,145,178,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(-90deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(45,212,191,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>🎯</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>التوجيه بعد البكالوريا</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>مسار دراسي ومهني يناسب قدراتك</p>
                </div>

                {/* Face 5 - Disclaimer */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(168,85,247,0.9), rgba(139,92,246,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateX(90deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(168,85,247,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>⚠️</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>تنبيه</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>تطوير شخصي · قد تحتوي على أخطاء</p>
                </div>

                {/* Face 6 - Mission */}
                <div style={{
                  position: 'absolute',
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(145deg, rgba(56,189,248,0.9), rgba(14,165,233,0.8))',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateX(-90deg) translateZ(140px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 60px rgba(56,189,248,0.3)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '50px' }}>🚀</span>
                  <h4 style={{ color: 'white', marginTop: '10px' }}>مهمتنا</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>تغيير طريقة تفكير التلاميذ تجاه البكالوريا</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - Text Content */}
          <div className="reveal rd2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--text)' }}>نحن نؤمن</strong> بأن كل تلميذ جزائري لديه القدرة على تحقيق التميز.
              لكن الطريق إلى النجاح ليس دائماً واضحاً.
              لهذا السبب، قمنا ببناء <strong style={{ color: '#a78bfa' }}>BacAidz</strong>.
              منصة ذكية تضع بين يديك قوة تحليل البيانات وتقنيات الذكاء الاصطناعي.
            </p>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--teal)', marginBottom: '0.8rem' }}>📊 قاعدة بيانات جزائرية</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: '1.7' }}>
                اعتمدنا في بناء هذا التطبيق على بيانات حقيقية تعكس الواقع الدراسي في الجزائر.
                قمنا بجمع وتحليل عينة من التلاميذ من مختلف الولايات،
                ودرسنا مسارهم من شهادة التعليم المتوسط حتى البكالوريا.
              </p>
            </div>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--rose)', marginBottom: '0.8rem' }}>🤖 تقنيات ذكاء اصطناعي متطورة</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'var(--text-2)', fontSize: '0.9rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧩</span> خوارزميات التجميع <em style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>(Clustering)</em>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'var(--text-2)', fontSize: '0.9rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📈</span> خوارزميات التنبؤ <em style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>(Regression)</em>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'var(--text-2)', fontSize: '0.9rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔍</span> تقنيات تحليل العوامل <em style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>(Feature Analysis)</em>
                </li>
              </ul>
            </div>

            <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--gold)', marginBottom: '0.8rem' }}>🎯 هدفنا</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: '1.7' }}>
                تغيير طريقة تفكير التلاميذ الجزائريين تجاه البكالوريا.
                نريد أن نضع بين أيديكم أداة ذكية تفهمكم أكثر مما تفهمون أنفسكم.
                نقدم لكم تحليلاً دقيقاً لنقاط قوتكم وضعفكم،
                ونوجهكم نحو أفضل مسار دراسي ومهني يناسب قدراتكم الحقيقية.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="reveal rd3" style={{
          maxWidth: '800px',
          margin: '4rem auto 0',
          padding: '2rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: 'var(--gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>⚠️ تنبيه</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: '1.8' }}>
            هذا المشروع هو نتاج جهد شخصي ومستقل.
            تم تطويره كمطورة جزائرية شغوفة بالعلم والتكنولوجيا والتعليم.
            هذا التطبيق ليس جهة رسمية، ولا يدعي الكمال.
            هو في طور التحسين المستمر، وأرحب بكل ملاحظاتكم ونصائحكم.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: '1.8', marginTop: '0.8rem' }}>
            أعتذر مقدماً عن أي أخطاء محتملة.
            كل ما تقدمه هذه المنصة هو مجرد رؤى تعتمد على تحليل البيانات،
            والقرار النهائي يعود لكم دائماً.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--pu2)', marginTop: '1rem', fontWeight: 'bold' }}>
            معاً نبني مستقبلاً أفضل للتعليم في الجزائر. 🇩🇿
          </p>
        </div>
      </section>
    </>
  );
}