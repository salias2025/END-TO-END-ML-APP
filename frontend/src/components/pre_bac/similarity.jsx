import React from 'react';

export default function Similarity({ studentData, matchResults }) {
  // If no results, show a message
  if (!matchResults) {
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
        <p>لتتمكن من البحث عن طالب مطابق، يجب:</p>
        <ol style={{ display: 'inline-block', textAlign: 'right', color: '#721c24' }}>
          <li>إدخال بياناتك في النموذج</li>
          <li>تحليل ملفك الشخصي</li>
          <li>ثم العودة إلى هنا</li>
        </ol>
      </div>
    );
  }

  const {
    student_id,
    similarity,
    match_bac,
    regression_bac,
    final_bac,
    archetype,
    cluster,
    filiere_arabic,
    mention,
    cluster_name
  } = matchResults;

  // Subject comparison data
  const subjects = [
    { name: 'الرياضيات', key: 'as2_math' },
    { name: 'الفيزياء', key: 'as2_physics' },
    { name: 'العلوم', key: 'as2_science' },
    { name: 'اللغة العربية', key: 'as2_arabic' },
    { name: 'اللغات الأجنبية', key: 'as2_langues' }
  ];

  const getStudentGrade = (key) => studentData?.[key] || 11;
  const getMatchGrade = (key) => matchResults?.subject_grades?.[key] || 11;

  // Study habits comparison
  const studentStudyHours = studentData?.weekly_study_hours || 15;
  const studentSleepHours = studentData?.sleep_hours || 7;
  const matchStudyHours = matchResults?.match_study_hours || studentStudyHours;
  const matchSleepHours = matchResults?.match_sleep_hours || studentSleepHours;

  // Encouragement message
  const diffWithMatch = final_bac - regression_bac;
  let encouragement = '';
  if (diffWithMatch > 0.5) {
    encouragement = '🎉 أنت أفضل من المتوقع! هذا بسبب عادات دراستك الجيدة (النوم الكافي، الانتظام، قلة التوتر)';
  } else if (diffWithMatch < -0.5) {
    encouragement = '⚠️ معدلك أقل من المتوقع. حاول تحسين عاداتك: نم أكثر، نظم وقتك، قلل التوتر';
  } else {
    encouragement = '📊 أدائك متوافق مع التوقعات. واصل بنفس المستوى وحاول تحسين المواد الأضعف';
  }

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '20px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <h2>🔍 مرحباً بك في محرك البحث عن الطلاب المشابهين</h2>
        <p>هذا المحرك يبحث بين آلاف الطلاب الحقيقيين لإيجاد أقرب طالب لملفك الشخصي</p>
        <p>بناءً على: العلامات + عادات الدراسة + نمط الحياة</p>
      </div>

      <div style={{ borderTop: '2px solid #11998e', margin: '20px 0' }} />

      {/* Match Card */}
      <div style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '20px',
        margin: '20px 0'
      }}>
        <h2>✅ تم العثور على أفضل طالب مطابق لك!</h2>
        <h3>🆔 رقم الطالب المرجعي: {student_id}</h3>
        <div style={{
          background: '#667eea',
          color: 'white',
          padding: '5px 15px',
          borderRadius: '20px',
          display: 'inline-block'
        }}>
          📊 درجة التشابه: {similarity.toFixed(3)} (كلما كانت أقرب للصفر، كان أفضل)
        </div>
      </div>

      {/* Match Details */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        margin: '15px 0'
      }}>
        <h3 style={{ color: '#333' }}>📊 معلومات الطالب المطابق</h3>
        <table style={{ width: '100%', direction: 'rtl', fontSize: '16px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>📚 الشعبة:</th>
              <td style={{ padding: '12px', color: '#333' }}><strong>{filiere_arabic}</strong></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>🎯 المجموعة:</th>
              <td style={{ padding: '12px', color: '#333' }}><strong>{cluster}</strong> → {cluster_name}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>🏷️ نمط الطالب:</th>
              <td style={{ padding: '12px', color: '#333' }}><strong>{archetype}</strong></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>📈 معدل الطالب الحقيقي:</th>
              <td style={{ padding: '12px', color: '#333' }}><strong>{match_bac.toFixed(1)}/20</strong> ({mention})</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>📊 تقدير الانحدار (من علاماتك):</th>
              <td style={{ padding: '12px', color: '#333' }}><strong>{regression_bac.toFixed(1)}/20</strong></td>
            </tr>
            <tr style={{ background: '#e8f4f8' }}>
              <th style={{ textAlign: 'right', padding: '12px', color: '#333' }}>🎯 المعدل النهائي المتوقع:</th>
              <td style={{ padding: '12px', fontSize: '24px', fontWeight: 'bold', color: '#11998e' }}>
                {final_bac.toFixed(1)}/20
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* How it was calculated */}
      <div style={{
        background: '#fff3cd',
        padding: '15px',
        borderRadius: '10px',
        margin: '10px 0'
      }}>
        <h3 style={{ color: '#333' }}>💡 كيف تم حساب معدلك المتوقع؟</h3>
        <p style={{ color: '#333' }}>المعدل النهائي = (معدل الطالب المطابق × 0.5) + (تقدير الانحدار من علاماتك × 0.5)</p>
        <p style={{ color: '#333' }}>هذه الطريقة تجمع بين تشابهك مع طالب حقيقي وبين المعادلة العلمية المبنية على علاماتك وعاداتك</p>
      </div>

      {/* Subject Comparison Table */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        margin: '15px 0'
      }}>
        <h3 style={{ color: '#333' }}>📈 مقارنة علاماتك مع الطالب المطابق</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          🟢 اللون الأخضر = أنت أفضل &nbsp;&nbsp;|&nbsp;&nbsp; 🔴 اللون الأحمر = تحتاج للتحسين
        </p>
        <table style={{ width: '100%', direction: 'rtl', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'right', color: '#333' }}>المادة</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>علامتك</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>علامة الطالب</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>الفارق</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => {
              const studentGrade = getStudentGrade(subject.key);
              const matchGrade = getMatchGrade(subject.key);
              const diff = studentGrade - matchGrade;
              const color = diff > 0 ? 'green' : (diff < 0 ? 'red' : 'gray');
              const sign = diff > 0 ? '+' : '';
              const bgColor = i % 2 === 0 ? '#f8f9fa' : 'white';

              return (
                <tr key={i} style={{ background: bgColor }}>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#333' }}>{subject.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{studentGrade.toFixed(1)}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{matchGrade.toFixed(1)}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: color, fontWeight: 'bold' }}>
                    {sign}{diff.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Study Habits Comparison */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        margin: '15px 0'
      }}>
        <h3 style={{ color: '#333' }}>⏰ مقارنة عادات الدراسة</h3>
        <table style={{ width: '100%', direction: 'rtl', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'right', color: '#333' }}>العادة</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>أنت</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>الطالب المطابق</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>نصيحة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>ساعات الدراسة/أسبوع</td>
              <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{studentStudyHours} ساعة</td>
              <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{matchStudyHours.toFixed(0)} ساعة</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                {studentStudyHours <= 25 ? '✅ جدولك مناسب' : '⚠️ حاول تقليل الساعات والتركيز على الجودة'}
              </td>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>ساعات النوم/ليلة</td>
              <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{studentSleepHours} ساعات</td>
              <td style={{ padding: '10px', textAlign: 'center', color: '#333' }}>{matchSleepHours.toFixed(0)} ساعات</td>
              <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                {studentSleepHours >= 7 ? '😴 ممتاز، النوم كافٍ' : '🚨 النوم غير كافٍ، تأكد من النوم 7-8 ساعات'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Encouragement */}
      <div style={{
        background: '#d4edda',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#333' }}>💡 ماذا نستفيد من هذا الطالب المطابق؟</h3>
        <p style={{ color: '#333' }}>{encouragement}</p>
        <p style={{ color: '#333' }}>🎯 <strong>نصيحة مهمة:</strong> هذا الطالب حقق معدل {match_bac.toFixed(1)} بنفس مستواك تقريباً. حاول تقليد عادات دراسة الطلاب الناجحين!</p>
        <hr style={{ margin: '10px 0', border: '1px solid #c3e6cb' }} />
        <p style={{ color: '#333' }}>📌 <strong>الخطوة التالية:</strong> افهم كيف حسبنا هذه المعالم وماذا تعني كل واحدة منها.</p>
      </div>
    </div>
  );
}