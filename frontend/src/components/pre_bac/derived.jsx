import React, { useState } from 'react';

export default function Derived({ studentData, featureValues }) {
  const [expandedFeature, setExpandedFeature] = useState(null);

  // If no student data, show message
  if (!studentData || !featureValues) {
    return (
      <div style={{
        background: '#f8d7da',
        color: '#721c24',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h2>⏳ يرجى إدخال بياناتك أولاً!</h2>
        <p>قم بإدخال بياناتك في النموذج وتحليلها أولاً لتظهر معالمك الشخصية.</p>
      </div>
    );
  }

  const features = [
    {
      id: 'study_efficiency',
      title: '📈 كفاءة الدراسة (Study Efficiency)',
      formula: 'كفاءة الدراسة = معدل السنة الثانية ثانوي / (ساعات الدراسة الأسبوعية + 0.1)',
      example: 'مثال: إذا كان معدل 2AS = 12/20 وتدرس 15 ساعة/أسبوع → الكفاءة = 12 / 15.1 = 0.79',
      meaning: [
        '✅ ≥ 1.2: ممتاز - تكسب أكثر من 1.2 نقطة في كل ساعة دراسة',
        '⚠️ 0.8 - 1.2: جيد - كفاءة مقبولة',
        '❌ < 0.8: يحتاج تحسين - تدرس كثيراً ولكن النتائج ضعيفة'
      ],
      advice: 'الكفاءة المنخفضة تعني أن أسلوب دراستك غير فعال. جرب الاستدعاء النشط والتكرار المتباعد.',
      color: '#e8f4f8',
      getStatus: (val) => val >= 1.2 ? 'good' : (val >= 0.8 ? 'warning' : 'danger')
    },
    {
      id: 'grinder_index',
      title: '⚙️ مؤشر الجهد (Grinder Index)',
      formula: 'مؤشر الجهد = ساعات الدراسة الأسبوعية / كفاءة الدراسة',
      example: 'مثال: تدرس 25 ساعة/أسبوع بكفاءة 0.6 → المؤشر = 25 / 0.6 = 41.7',
      meaning: [
        '✅ < 15: متوازن - تدرس بكفاءة عالية',
        '⚠️ 15 - 30: معتدل - يمكن تحسين الكفاءة',
        '❌ > 30: إرهاق - تدرس كثيراً ولكن النتائج لا تعكس الجهد'
      ],
      advice: 'المؤشر المرتفع يعني أنك "تطحن" بمعنى تدرس بجهد كبير دون مردود. قلل الساعات وركز على الجودة.',
      color: '#fef3e2',
      getStatus: (val) => val < 15 ? 'good' : (val <= 30 ? 'warning' : 'danger')
    },
    {
      id: 'time_allocation_ratio',
      title: '⏰ توزيع الوقت (Time Allocation Ratio)',
      formula: 'توزيع الوقت = وقت المواد الأساسية / (وقت المواد غير الأساسية + 0.1)',
      example: 'المواد الأساسية = المواد التي تعتبر ضعيف فيها',
      meaning: [
        '✅ > 3: ممتاز - تركز على موادك الضعيفة',
        '⚠️ 1 - 3: جيد - توازن مقبول',
        '❌ < 1: خطر - تتجنب المواد الصعبة'
      ],
      advice: 'خصص 60% من وقت دراستك للمواد التي تجد صعوبة فيها. هذا هو مفتاح التحسن السريع!',
      color: '#e6f3ff',
      getStatus: (val) => val > 3 ? 'good' : (val >= 1 ? 'warning' : 'danger')
    },
    {
      id: 'resource_reliance',
      title: '📚 الاعتماد على الدروس الخصوصية (Resource Reliance)',
      formula: 'الاعتماد على الدروس = ساعات الدروس الخصوصية / (ساعات الدراسة الأسبوعية + 0.1)',
      example: 'مثال: تدرس 20 ساعة أسبوعياً، 6 ساعات منها دروس خصوصية → النسبة = 6 / 20 = 0.3',
      meaning: [
        '✅ < 0.2: مستقل - تعتمد على نفسك (ممتاز)',
        '⚠️ 0.2 - 0.4: اعتماد متوسط - مقبول',
        '❌ > 0.4: اعتماد كبير - تحتاج تطوير مهارات الدراسة المستقلة'
      ],
      advice: 'الدروس الخصوصية مفيدة لكن لا تعتمد عليها كلياً. حاول تعتمد على نفسك وتطور قدرتك على الفهم الذاتي.',
      color: '#f0e6ff',
      getStatus: (val) => val < 0.2 ? 'good' : (val <= 0.4 ? 'warning' : 'danger')
    },
    {
      id: 'improvement_momentum',
      title: '📈 زخم التحسن (Improvement Momentum)',
      formula: 'زخم التحسن = معدل 2AS - معدل 1AS',
      example: 'مثال: 2AS = 14.5، 1AS = 12.0 → الزخم = +2.5 نقطة',
      meaning: [
        '✅ > +0.5: تحسن ملحوظ - في الطريق الصحيح',
        '⚠️ 0 إلى +0.5: ثبات - تحتاج إلى تطوير',
        '❌ < 0: تراجع - خطر! راجع طرق دراستك'
      ],
      advice: 'الزخم الإيجابي يعني أنك تتحسن. حافظ على العادات الجيدة التي أدت إلى هذا التحسن.',
      color: '#e8ffe8',
      getStatus: (val) => val > 0.5 ? 'good' : (val >= 0 ? 'warning' : 'danger')
    },
    {
      id: 'grade_volatility',
      title: '📊 تقلب العلامات (Grade Volatility)',
      formula: 'تقلب العلامات = الانحراف المعياري لعلامات [البريفيه، 1AS، 2AS]',
      example: '',
      meaning: [
        '✅ < 1.5: ثبات ممتاز - أداء مستقر عبر السنوات',
        '⚠️ 1.5 - 2.5: تباين معتدل - بعض التغيرات',
        '❌ > 2.5: تباين كبير - أداء غير مستقر'
      ],
      advice: 'التقلب الكبير يعني أن أدائك يعتمد على عوامل خارجية (تعب، توتر، ظروف). حاول تثبيت عاداتك اليومية.',
      color: '#ffe8e8',
      getStatus: (val) => val < 1.5 ? 'good' : (val <= 2.5 ? 'warning' : 'danger')
    },
    {
      id: 'stress_performance_ratio',
      title: '😰 قلق الامتحان (Stress Performance Ratio)',
      formula: 'نسبة التوتر = مستوى القلق (1-5) / (معدل 2AS + 0.1)',
      example: '',
      meaning: [
        '✅ < 0.25: توتر منخفض - لا يؤثر على أدائك',
        '⚠️ 0.25 - 0.40: توتر متوسط - يؤثر قليلاً',
        '❌ > 0.40: توتر مرتفع - يخفض معدلك بشكل كبير'
      ],
      advice: 'القلق المرتفع يخفض المعدل بمقدار 0.5-1.5 نقطة. جرب تمارين التنفس والامتحانات التجريبية.',
      color: '#f0e6ff',
      getStatus: (val) => val < 0.25 ? 'good' : (val <= 0.4 ? 'warning' : 'danger')
    },
    {
      id: 'sleep_debt',
      title: '😴 دين النوم (Sleep Debt)',
      formula: 'دين النوم = max(0, 8 - ساعات النوم الفعلية)',
      example: 'مثال: تنام 6 ساعات → دين النوم = 2 ساعة',
      meaning: [
        '✅ 0 ساعة: نوم كافٍ (8 ساعات)',
        '⚠️ 1-2 ساعة: حرمان بسيط',
        '❌ > 2 ساعة: حرمان شديد - يخفض المعدل بمقدار 0.8 نقطة'
      ],
      advice: 'الطلاب الذين ينامون 8 ساعات يحصلون على علامات أفضل بـ 0.8 نقطة. النوم مهم مثل المذاكرة!',
      color: '#e6f3ff',
      getStatus: (val) => val === 0 ? 'good' : (val <= 2 ? 'warning' : 'danger')
    },
    {
      id: 'health_stress_index',
      title: '🏥 مؤشر التوتر الصحي (Health-Stress Index)',
      formula: 'المؤشر = (6 - الصحة) × مستوى التوتر',
      example: 'حيث: الصحة (1=سيئة، 5=ممتازة)، التوتر (1=منخفض، 5=مرتفع)',
      meaning: [
        '✅ 0-5: صحة جيدة وتوتر منخفض',
        '⚠️ 6-12: خطر متوسط - قد يؤثر على الأداء',
        '❌ 13-20: خطر مرتفع - تأثير سلبي كبير'
      ],
      advice: 'الاهتمام بالصحة البدنية يحسن الأداء الدراسي بنسبة تصل إلى 20%. لا تهمل الرياضة.',
      color: '#ffe6e6',
      getStatus: (val) => val <= 5 ? 'good' : (val <= 12 ? 'warning' : 'danger')
    },
    {
      id: 'weakness_count',
      title: '📉 عدد المواد الضعيفة (Weakness Count)',
      formula: 'عدد المواد الضعيفة = مجموع المواد التي علامتها < 11/20',
      example: '',
      meaning: [
        '✅ 0: ممتاز - لا يوجد مواد ضعيفة',
        '✅ 1-2: جيد - مواد قليلة تحتاج تحسين',
        '⚠️ 3-4: خطر متوسط - عدة مواد ضعيفة',
        '❌ 5-6: خطر كبير - أغلب المواد ضعيفة'
      ],
      advice: 'إذا كان عندك 3 مواد ضعيفة فأكثر، ركز على مادتين فقط أولاً. التحسين التدريجي أفضل.',
      color: '#fff3cd',
      getStatus: (val) => val <= 2 ? 'good' : (val <= 4 ? 'warning' : 'danger')
    },
    {
      id: 'problem_solving_gap',
      title: '🧮 فجوة حل المشكلات (Problem Solving Gap)',
      formula: 'فجوة حل المشكلات = متوسط (ضعف الرياضيات + ضعف الفيزياء)',
      example: 'حيث الضعف محسوب كـ: max(0, min(1, (15 - العلامة) / 15))',
      meaning: [
        '✅ < 0.4: قدرة جيدة على حل المشكلات',
        '⚠️ 0.4 - 0.7: صعوبات متوسطة',
        '❌ > 0.7: صعوبات كبيرة - بحاجة إلى تأسيس قوي'
      ],
      advice: 'حل المشكلات مهارة تتحسن بالممارسة. ابدأ بمسائل سهلة وتدرج في الصعوبة.',
      color: '#fff0e6',
      getStatus: (val) => val < 0.4 ? 'good' : (val <= 0.7 ? 'warning' : 'danger')
    },
    {
      id: 'weakness_concentration',
      title: '🎯 تركيز الضعف (Weakness Concentration)',
      formula: 'تركيز الضعف = (أعلى ضعف) - (أقل ضعف)',
      example: '',
      meaning: [
        '✅ < 0.3: ضعف منتشر - كل المواد ضعيفة بالتساوي',
        '⚠️ 0.3 - 0.6: ضعف متوسط التركيز',
        '❌ > 0.6: ضعف مركز - في مادة محددة فقط'
      ],
      advice: 'إذا كان الضعف مركزاً في مادة واحدة، ركز كل جهدك عليها لمدة أسبوعين.',
      color: '#d4edda',
      getStatus: (val) => val < 0.3 ? 'good' : (val <= 0.6 ? 'warning' : 'danger')
    },
    {
      id: 'science_lang_gap',
      title: '⚖️ الفجوة بين العلمي والأدبي (Science-Language Gap)',
      formula: 'الفجوة = (ضعف العلوم) - (ضعف اللغات)',
      example: '',
      meaning: [
        '📘 > +0.2: أضعف في المواد العلمية → الشعبة الأدبية أنسب لك',
        '📚 -0.2 إلى +0.2: متوازن → أي شعبة تناسبك',
        '🔬 < -0.2: أضعف في المواد الأدبية → الشعبة العلمية أنسب لك'
      ],
      advice: 'هذه الفجوة تساعدك تعرف إذا كنت في الشعبة المناسبة. لا تخف من تغيير الشعبة.',
      color: '#cfe2ff',
      getStatus: () => 'info'
    },
    {
      id: 'subject_balance',
      title: '📊 توازن المواد (Subject Balance)',
      formula: 'توازن المواد = الانحراف المعياري لعلامات المواد في 2AS',
      example: '',
      meaning: [
        '✅ < 1.5: متوازن - أداء متقارب في كل المواد',
        '⚠️ 1.5 - 2.5: تباين بسيط - بعض المواد أفضل من غيرها',
        '❌ > 2.5: غير متوازن - فروق كبيرة بين المواد'
      ],
      advice: 'عدم التوازن يعني أنك تهمل بعض المواد. رفع المعدل أسهل من خلال تحسين المواد الضعيفة.',
      color: '#e2f0e6',
      getStatus: (val) => val < 1.5 ? 'good' : (val <= 2.5 ? 'warning' : 'danger')
    },
    {
      id: 'filiere_alignment',
      title: '🎯 توافق الشعبة (Filière Alignment)',
      formula: 'لشعب العلمية: توافق = (رياضيات + فيزياء + علوم) / 3 / 20<br>للشعب الأدبية: توافق = (عربية + لغات) / 2 / 20',
      example: '',
      meaning: [
        '✅ > 0.7: توافق ممتاز - في الشعبة المناسبة',
        '⚠️ 0.5 - 0.7: توافق مقبول - يمكن التكيف',
        '❌ < 0.5: ضعف التوافق - ربما الشعبة غير مناسبة'
      ],
      advice: 'إذا كان التوافق منخفضاً، ناقش مع مستشار التوجيه المدرسي إمكانية تغيير الشعبة.',
      color: '#e6ffe6',
      getStatus: (val) => val > 0.7 ? 'good' : (val >= 0.5 ? 'warning' : 'danger')
    },
    {
      id: 'efficient_stressed',
      title: '⚠️ كفاءة مرهقة (Efficient Stressed)',
      formula: 'كفاءة مرهقة = كفاءة الدراسة × نسبة التوتر',
      example: '',
      meaning: [
        '✅ < 0.3: منخفض - لا خطر',
        '⚠️ 0.3 - 0.6: متوسط - راقب مستوى التوتر',
        '❌ > 0.6: مرتفع - خطر احتراق نفسي!'
      ],
      advice: 'هذا المؤشر يكتشف الطلاب الذين يبدون ناجحين ولكنهم تحت ضغط كبير. خذ استراحة، مارس هواية.',
      color: '#f8d7da',
      getStatus: (val) => val < 0.3 ? 'good' : (val <= 0.6 ? 'warning' : 'danger')
    },
    {
      id: 'consistent_weak',
      title: '🔄 ضعف مستمر (Consistent Weak)',
      formula: 'ضعف مستمر = انتظام الدراسة × عدد المواد الضعيفة',
      example: '',
      meaning: [
        '✅ < 1: تدرس بذكاء',
        '⚠️ 1 - 3: طرق دراسة غير فعالة',
        '❌ > 3: مشكلة كبيرة في طريقة الدراسة'
      ],
      advice: 'هذا المؤشر يعني أنك تدرس بانتظام ولكن النتائج ضعيفة. أنت بحاجة لتغيير طريقة الدراسة وليس زيادة الساعات.',
      color: '#fff3cd',
      getStatus: (val) => val < 1 ? 'good' : (val <= 3 ? 'warning' : 'danger')
    },
    {
      id: 'repeater_penalty',
      title: '🔄 عقوبة المكرر (Repeater Penalty)',
      formula: 'عقوبة المكرر = 1 إذا كنت مكرراً، 0 إذا لا',
      example: '',
      meaning: [
        '✅ 0: طالب عادي',
        '⚠️ 1: طالب مكرر - نخصم 0.8 نقطة من المعدل المتوقع'
      ],
      advice: 'التكرار ليس نهاية العالم. كثير من الطلاب الناجحين كانوا مكررين. ركز على فهم أخطائك السابقة وتجنبها.',
      color: '#e2e3e5',
      getStatus: (val) => val === 0 ? 'good' : 'warning'
    },
    {
      id: 'family_support_strength',
      title: '👨‍👩‍👧 دعم العائلة (Family Support Strength)',
      formula: 'دعم العائلة = درجة دعم العائلة / 5',
      example: '',
      meaning: [
        '✅ > 0.8: دعم قوي - يساعد على التحصيل الدراسي',
        '⚠️ 0.6 - 0.8: دعم متوسط',
        '❌ < 0.6: دعم ضعيف - قد يؤثر على المعنويات'
      ],
      advice: 'إذا كان دعم العائلة ضعيفاً، ابحث عن مجموعة دراسة أو أصدقاء يشجعونك. الدعم المعنوي مهم جداً للنجاح.',
      color: '#d1e7dd',
      getStatus: (val) => val > 0.8 ? 'good' : (val >= 0.6 ? 'warning' : 'danger')
    },
    {
      id: 'kabylie_boost',
      title: '🏔️ تأثير منطقة القبائل (Kabylie Boost)',
      formula: 'تأثير القبائل = 1 إذا كنت من تيزي وزو أو بجاية، 0 إذا لا',
      example: '',
      meaning: [
        '📍 0: من منطقة عادية',
        '⭐ 1: من منطقة القبائل - نضيف 0.5-0.8 نقطة للمعدل المتوقع'
      ],
      advice: 'هذا ليس تمييزاً، بل حقيقة إحصائية من البكالوريا الجزائرية. الطلاب من هذه المناطق يتحصلون على معدلات أعلى في المتوسط.',
      color: '#cfe2ff',
      getStatus: () => 'info'
    }
  ];

  const toggleFeature = (id) => {
    setExpandedFeature(expandedFeature === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return '#28a745';
      case 'warning': return '#f39c12';
      case 'danger': return '#dc3545';
      case 'info': return '#667eea';
      default: return '#666';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'good': return '✅ ممتاز';
      case 'warning': return '⚠️ يحتاج تحسين';
      case 'danger': return '❌ خطر';
      case 'info': return 'ℹ️ معلومات';
      default: return '';
    }
  };

  // Get the student's value for a feature
  const getStudentValue = (id) => {
    if (featureValues && featureValues[id] !== undefined) {
      const val = featureValues[id];
      return typeof val === 'number' ? val.toFixed(3) : val;
    }
    return 'غير متاح';
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '32px' }}>📊 شرح جميع المعالم المشتقة</h1>
        <p style={{ fontSize: '18px' }}>كيف حسبناها وماذا تعني - مع قيمك الشخصية</p>
        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
          لدينا <strong>20 مقياساً ذكياً</strong> يساعدونك على فهم نفسك كطالب
        </p>
      </div>

      {/* Student Values Summary */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px',
        border: '1px solid #eee'
      }}>
        <h3 style={{ color: '#333', textAlign: 'center' }}>📊 قيمك الشخصية للمعالم المشتقة</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          marginTop: '10px'
        }}>
          {features.map((feature) => {
            const val = featureValues[feature.id];
            const status = feature.getStatus(val);
            const statusColor = getStatusColor(status);
            return (
              <div key={feature.id} style={{
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${statusColor}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#666' }}>{feature.title.split(' ').slice(1).join(' ')}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: statusColor }}>
                  {typeof val === 'number' ? val.toFixed(3) : val}
                </div>
                <div style={{ fontSize: '11px', color: statusColor }}>{getStatusLabel(status)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features List */}
      {features.map((feature) => {
        const val = featureValues[feature.id];
        const status = feature.getStatus(val);
        const statusColor = getStatusColor(status);

        return (
          <div
            key={feature.id}
            style={{
              background: feature.color,
              padding: '20px',
              borderRadius: '15px',
              margin: '15px 0',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: expandedFeature === feature.id ? `2px solid ${statusColor}` : 'none',
              color: '#1a1a2e'
            }}
            onClick={() => toggleFeature(feature.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, color: '#1a1a2e' }}>{feature.title}</h2>
                <span style={{
                  background: statusColor,
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {getStatusLabel(status)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '16px', color: '#333' }}>
                  القيمة: <strong style={{ color: statusColor }}>{typeof val === 'number' ? val.toFixed(3) : val}</strong>
                </span>
                <span style={{ fontSize: '24px', color: '#1a1a2e' }}>{expandedFeature === feature.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedFeature === feature.id && (
              <div style={{ marginTop: '15px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '15px' }}>
                <div style={{
                  background: '#1a1a2e',
                  color: '#e2e8f0',
                  padding: '15px',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  textAlign: 'center',
                  margin: '10px 0',
                  overflowX: 'auto'
                }}>
                  {feature.formula}
                </div>

                {feature.example && (
                  <p style={{ margin: '10px 0', color: '#333' }}>{feature.example}</p>
                )}

                <h4 style={{ margin: '10px 0', color: '#1a1a2e' }}>📖 ماذا تعني؟</h4>
                <ul style={{ paddingRight: '20px', lineHeight: '1.8', color: '#1a1a2e' }}>
                  {feature.meaning.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>

                <div style={{
                  background: '#fff3cd',
                  padding: '15px',
                  borderRadius: '10px',
                  margin: '10px 0',
                  color: '#333'
                }}>
                  <p>💡 <strong>نصيحة:</strong> {feature.advice}</p>
                </div>

                <div style={{
                  background: statusColor,
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  margin: '10px 0',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0 }}>📊 قيمتك: <strong>{typeof val === 'number' ? val.toFixed(3) : val}</strong> → {getStatusLabel(status)}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h2>📊 خلاصة المعالم المشتقة</h2>
        <p style={{ fontSize: '18px' }}>لدينا الآن <strong>20 مقياساً ذكياً</strong> يساعدونك على فهم نفسك كطالب</p>
        <hr style={{ background: 'white', margin: '15px 0', border: '1px solid rgba(255,255,255,0.3)' }} />
        <p>هذه المعالم تغطي جميع جوانب حياتك الدراسية</p>
        <p style={{ marginTop: '20px' }}>💪 <strong>التغيير الصغير في عادة واحدة = تحسن كبير في المعدل!</strong></p>
      </div>
    </div>
  );
}