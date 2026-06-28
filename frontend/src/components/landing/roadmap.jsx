export default function Roadmap() {
  const steps = [
    {
      num: "01", tag: "المرحلة 01 · ابدأ", title: "التشخيص الأولي",
      desc: "تقييم مستواك الحالي في جميع المواد لتحديد نقاط قوتك وضعفك.",
      pills: [{ label: "اختبار المستوى", cls: "spu" }, { label: "تحليل النتائج", cls: "spu" }],
      nodeClass: "n1", side: "left", revealCls: "rd1",
    },
    {
      num: "02", tag: "المرحلة 02 · خطط", title: "خطة مراجعة مخصصة",
      desc: "بناء جدول زمني مصمم خصيصاً يتناسب مع إيقاعك وأولوياتك.",
      pills: [{ label: "جدول ذكي", cls: "srose" }, { label: "أهداف أسبوعية", cls: "srose" }],
      nodeClass: "n2", side: "right", revealCls: "rd2",
    },
    {
      num: "03", tag: "المرحلة 03 · راجع", title: "مراجعة نشطة",
      desc: "بطاقات تلخيصية، تمارين مركزة، مواضيع مصححة واختبارات تكيفية لكل مادة.",
      pills: [{ label: "+180 بطاقة", cls: "sgold" }, { label: "مواضيع سابقة", cls: "sgold" }, { label: "اختبارات", cls: "sgold" }],
      nodeClass: "n3", side: "left", revealCls: "rd3",
    },
    {
      num: "04", tag: "المرحلة 04 · استعد", title: "محاكاة الامتحانات",
      desc: "تدرب في ظروف واقعية للبكالوريا مع مواضيع نموذجية ومؤقتة.",
      pills: [{ label: "مواضيع نموذجية", cls: "steal" }, { label: "تصحيحات", cls: "steal" }],
      nodeClass: "n4", side: "right", revealCls: "rd4",
    },
    {
      num: "05", tag: "المرحلة 05 · نجح", title: "التوجيه بعد البكالوريا",
      desc: "استكشف الشعب والجامعات وابنِ مشروعك الأكاديمي بثقة.",
      pills: [{ label: "شعب 2027", cls: "ssky" }, { label: "جامعات", cls: "ssky" }, { label: "فرص", cls: "ssky" }],
      nodeClass: "n5", side: "left", revealCls: "rd5",
    },
  ];

  return (
    <section id="roadmap" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="reveal">
        <div className="slabel" style={{ justifyContent: 'flex-end' }}>
          <span className="slbar" />خريطة الطريق
        </div>
        <h2 className="sh2">
          رحلتك نحو<br />
          <span style={{ background: "linear-gradient(115deg,#f472b6,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>شهادة البكالوريا</span>
        </h2>
        <p className="ssub" style={{ marginRight: 0, marginLeft: 'auto' }}>
          خمس مراحل أساسية، تقدم واضح. كل محطة تقربك من النجاح.
        </p>
      </div>

      <div className="jline">
        {steps.map((step, i) => (
          <div className={`step reveal ${step.revealCls}`} key={i}>
            {step.side === "right" && <div className="stepe" />}
            {step.side === "left" && (
              <div className="stepcard" style={{ textAlign: 'right' }}>
                <span className="stag">{step.tag}</span>
                <div className="sh">{step.title}</div>
                <p className="sp">{step.desc}</p>
                <div className="spills" style={{ justifyContent: 'flex-start' }}>
                  {step.pills.map((p, j) => <span key={j} className={`spill ${p.cls}`}>{p.label}</span>)}
                </div>
              </div>
            )}
            <div className="stepnode"><div className={`node ${step.nodeClass}`}>{step.num}</div></div>
            {step.side === "right" && (
              <div className="stepcard" style={{ textAlign: 'right' }}>
                <span className="stag">{step.tag}</span>
                <div className="sh">{step.title}</div>
                <p className="sp">{step.desc}</p>
                <div className="spills" style={{ justifyContent: 'flex-start' }}>
                  {step.pills.map((p, j) => <span key={j} className={`spill ${p.cls}`}>{p.label}</span>)}
                </div>
              </div>
            )}
            {step.side === "left" && <div className="stepe" />}
          </div>
        ))}
      </div>
    </section>
  );
}