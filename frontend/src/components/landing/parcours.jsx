export default function Parcours() {
  const phases = [
    {
      cls: "ph1", num: "المرحلة 01", icon: "📖", title: "قبل البكالوريا · التحليل والتأسيس",
      items: [
        "تحليل شامل للمستوى (بريفيه + 1AS + 2AS)",
        "تقييم نقاط القوة والضعف في كل مادة",
        "تتبع التقدم في الوقت الفعلي",
        "جلسات دعم مركزة للمواد الضعيفة",
        "خطة أسبوعية مخصصة للتحضير",
      ],
    },
    {
      cls: "ph2", num: "المرحلة 02", icon: "🎓", title: "سنة البكالوريا · التتبع والتحليل",
      items: [
        "تتبع المواد (عربية، رياضيات، لغات، فيزياء، علوم...)",
        "تحليل نقاط الضعف وتقديم توصيات",
        "اقتراح توزيع الوقت والميزانية الدراسية",
        "قوائم المهام وجداول زمنية منظمة",
        "توقع معدل البكالوريا بدقة",
      ],
    },
    {
      cls: "ph3", num: "المرحلة 03", icon: "🚀", title: "بعد البكالوريا · التوجيه والاختيار",
      items: [
        "دليل كامل لشعب ومناصب التعليم العالي",
        "محاكاة النقاط وشروط القبول",
        "شهادات حقيقية من طلاب جامعيين",
        "فرص مهنية حسب كل شعبة",
        "مرافقة في إجراءات التسجيل",
      ],
    },
  ];

  const revealCls = ["rd1", "rd2", "rd3"];

  return (
    <section id="phases" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="reveal">
        <div className="slabel" style={{ justifyContent: 'flex-end' }}>
          <span className="slbar" />المراحل الرئيسية
        </div>
        <h2 className="sh2">ثلاث مراحل كبرى<br />لنجاح شامل</h2>
        <p className="ssub" style={{ marginRight: 0, marginLeft: 'auto' }}>
          كل مرحلة من رحلتك مصممة لتعزيز إمكانياتك وثقتك بنفسك.
        </p>
      </div>
      <div className="pgrid">
        {phases.map((phase, i) => (
          <div key={i} className={`pcard ${phase.cls} reveal ${revealCls[i]}`} style={{ textAlign: 'right' }}>
            <div className="ptop"><div className="ptbar" /></div>
            <div className="pbody">
              <div className="pibox">{phase.icon}</div>
              <span className="pnum">{phase.num}</span>
              <div className="ptitle">{phase.title}</div>
              <ul className="pitems">
                {phase.items.map((item, j) => (
                  <li key={j}>
                    <div className="lbul"><div className="ldot" /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}