import React from 'react';

export default function FinalReport({ formData, prediction, subjectData, onReset }) {
  if (!formData || !prediction) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        <p>⚠️ يرجى إدخال بياناتك أولاً</p>
      </div>
    );
  }

  const { score, prob, improvement } = prediction;

  // Calculate derived features
  const skillKeys = Object.keys(subjectData.skills || {});
  const skillValues = skillKeys.map(key => formData[key] || 0);
  const avgGrade = (formData.grade_t1 + formData.grade_t2 + formData.grade_t3) / 3;
  const avgSkill = skillValues.reduce((a, b) => a + b, 0) / skillValues.length;
  const languageCore = ((formData.grammar || 0) + (formData.comprehension || 0)) / 2;
  const analysisScore = ((formData.poetry || 0) + (formData.prose || 0)) / 2;
  const imbalanceScore = skillValues.reduce((sum, val) => sum + Math.pow(val - avgSkill, 2), 0) / skillValues.length;

  // Determine score color
  const scoreColor = score >= 16 ? '#2ecc71' : score >= 14 ? '#27ae60' : score >= 12 ? '#f39c12' : score >= 10 ? '#e67e22' : '#e74c3c';
  const scoreEmoji = score >= 16 ? '🏆' : score >= 14 ? '🎉' : score >= 12 ? '👍' : score >= 10 ? '📈' : '⚠️';
  const scoreText = score >= 16 ? 'ممتاز' : score >= 14 ? 'جيد جداً' : score >= 12 ? 'جيد' : score >= 10 ? 'مقبول' : 'يحتاج إلى تحسين';

  // Identify strongest and weakest skills
  const skillNames = Object.fromEntries(
    Object.entries(subjectData.skills || {}).map(([key, skill]) => [key, skill.name])
  );

  const sortedSkills = Object.entries(skillValues)
    .map(([key, value]) => ({ key, value, name: skillNames[key] || key }))
    .sort((a, b) => b.value - a.value);

  const topStrength = sortedSkills[0];
  const topWeakness = sortedSkills[sortedSkills.length - 1];

  // Stream name
  const streamNames = {
    0: "العلوم التجريبية / الرياضيات / التقني الرياضي / التسيير والاقتصاد",
    1: "اللغات الأجنبية",
    2: "الآداب والفلسفة"
  };

  // Generate recommendations
  const recommendations = [];
  const skillGaps = {};
  Object.entries(subjectData.skills || {}).forEach(([key, skill]) => {
    const value = formData[key] || 0;
    const target = skill.target || 7;
    const gap = target - value;
    if (gap > 0) skillGaps[key] = gap;
  });

  // Sort weaknesses
  const sortedWeaknesses = Object.entries(skillGaps).sort((a, b) => b[1] - a[1]);

  if (sortedWeaknesses.length > 0) {
    const weakest = sortedWeaknesses[0];
    recommendations.push(`📖 <strong>${skillNames[weakest[0]] || weakest[0]}:</strong> ركز على تحسين هذه المهارة (حالياً ${formData[weakest[0]]?.toFixed(1) || 0}/10)`);
  }

  if (sortedWeaknesses.length > 1) {
    const second = sortedWeaknesses[1];
    recommendations.push(`📚 <strong>${skillNames[second[0]] || second[0]}:</strong> ثاني مهارة تحتاج إلى تركيز (حالياً ${formData[second[0]]?.toFixed(1) || 0}/10)`);
  }

  // Habit recommendations
  if (formData.exams_practiced < 10) {
    recommendations.push(`📝 <strong>حل امتحانات سابقة:</strong> حل امتحان بكالوريا كل أسبوع (حالياً ${formData.exams_practiced || 0})`);
  }

  if (formData.consistency < 4) {
    recommendations.push(`📅 <strong>نظم وقتك:</strong> خصص وقتاً يومياً للدراسة (حالياً ${formData.consistency || 0}/5)`);
  }

  if (formData.confidence < 4) {
    recommendations.push(`💪 <strong>عزز ثقتك بنفسك:</strong> ابدأ بحل تمارين سهلة ثم انتقل إلى الصعبة (حالياً ${formData.confidence || 0}/5)`);
  }

  if (formData.stress >= 4) {
    recommendations.push(`😰 <strong>تحكم في التوتر:</strong> جرب تمارين التنفس العميق وتنظيم وقتك (حالياً ${formData.stress || 0}/5)`);
  }

  if (recommendations.length === 0) {
    recommendations.push('🎉 <strong>ممتاز!</strong> استمر على هذا المنوال وركز على الحفاظ على مستواك');
  }

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px' }}>📋 التقرير النهائي</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          {subjectData.icon} {subjectData.name}
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
          {new Date().toLocaleDateString('ar-DZ')}
        </p>
      </div>

      {/* Score Summary Card */}
      <div style={{
        background: `linear-gradient(135deg, ${scoreColor}20 0%, ${scoreColor}10 100%)`,
        padding: '25px',
        borderRadius: '20px',
        textAlign: 'center',
        border: `2px solid ${scoreColor}`,
        marginBottom: '25px'
      }}>
        <div style={{ fontSize: '18px', color: '#555' }}>نتيجتك المتوقعة في البكالوريا</div>
        <div style={{ fontSize: '72px', fontWeight: 'bold', color: scoreColor, margin: '15px 0' }}>
          {score.toFixed(1)}<span style={{ fontSize: '24px' }}>/20</span>
        </div>
        <div style={{ fontSize: '20px', color: scoreColor }}>
          {scoreEmoji} مستوى {scoreText} {scoreEmoji}
        </div>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>✅ فرصة النجاح</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              {prob.toFixed(0)}%
            </div>
          </div>
          <div style={{
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>📈 إمكانية التحسين</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
              +{improvement.toFixed(1)}
            </div>
          </div>
          <div style={{
            background: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '12px', color: '#666' }}>🎯 المستوى</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: scoreColor }}>
              {scoreText}
            </div>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>👤 معلومات الطالب</h3>
          <div style={{ margin: '15px 0' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              <span>🎓 الشعبة</span>
              <span style={{ fontWeight: 'bold' }}>{streamNames[formData.filiere] || 'غير محدد'}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              <span>📊 معدل الفصول الثلاثة</span>
              <span style={{ fontWeight: 'bold' }}>{avgGrade.toFixed(1)}/20</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>📚 متوسط المهارات</span>
              <span style={{ fontWeight: 'bold' }}>{avgSkill.toFixed(1)}/10</span>
            </div>
          </div>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px'
        }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📊 المؤشرات الرئيسية</h3>
          <div style={{ margin: '15px 0' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              <span>📖 المستوى اللغوي العام</span>
              <span style={{ fontWeight: 'bold' }}>{languageCore.toFixed(1)}/10</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              <span>📚 مهارة التحليل الأدبي</span>
              <span style={{ fontWeight: 'bold' }}>{analysisScore.toFixed(1)}/10</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>⚖️ توازن المهارات</span>
              <span style={{ fontWeight: 'bold' }}>{imbalanceScore.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: '#f0fff4',
          padding: '20px',
          borderRadius: '15px',
          borderRight: '4px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', marginTop: 0 }}>🟢 أقوى مهارة لديك</h3>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ fontSize: '48px' }}>📖</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {topStrength?.name || 'غير محدد'}
            </div>
            <div style={{ fontSize: '16px', color: '#27ae60' }}>
              {topStrength?.value?.toFixed(1) || 0}/10
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff5f5',
          padding: '20px',
          borderRadius: '15px',
          borderRight: '4px solid #e74c3c'
        }}>
          <h3 style={{ color: '#e74c3c', marginTop: 0 }}>🔴 أضعف مهارة لديك</h3>
          <div style={{ textAlign: 'center', padding: '15px' }}>
            <div style={{ fontSize: '48px' }}>⚠️</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {topWeakness?.name || 'غير محدد'}
            </div>
            <div style={{ fontSize: '16px', color: '#e74c3c' }}>
              {topWeakness?.value?.toFixed(1) || 0}/10
            </div>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📚 تفصيل المهارات</h3>
        {Object.entries(skillNames).map(([key, name]) => {
          const value = formData[key] || 0;
          const target = subjectData.skills?.[key]?.target || 7;
          const color = value >= target ? '#2ecc71' : value >= target - 1 ? '#f39c12' : '#e74c3c';
          return (
            <div key={key} style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span>{name}</span>
                <span style={{ fontWeight: 'bold', color: color }}>
                  {value.toFixed(1)}/10
                </span>
              </div>
              <div style={{
                height: '8px',
                background: '#ecf0f1',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(value / 10) * 100}%`,
                  height: '100%',
                  background: color,
                  borderRadius: '4px',
                  transition: 'width 1s ease'
                }} />
              </div>
              <div style={{
                fontSize: '11px',
                color: '#999',
                marginTop: '4px'
              }}>
                الهدف: {target}/10
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div style={{
        background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        color: 'white'
      }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>🎯 خطة التحسين المخصصة لك</h3>
        <ul style={{ lineHeight: '2.2', paddingRight: '20px' }}>
          {recommendations.slice(0, 6).map((rec, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: rec }} />
          ))}
        </ul>
      </div>

      {/* Summary */}
      <div style={{
        background: '#2c3e50',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h3 style={{ marginTop: 0 }}>💡 خلاصة</h3>
        <p style={{ lineHeight: '1.8' }}>
          {sortedWeaknesses.length > 0 ? (
            <>
              مهارة <strong>{skillNames[sortedWeaknesses[0][0]] || sortedWeaknesses[0][0]}</strong> هي الأكثر تأثيراً على نقطتك.<br />
              ركز على تحسين نقاط ضعفك أولاً، مع الاستمرار في تعزيز نقاط قوتك.<br />
              التطبيق المستمر للنصائح أعلاه يمكن أن يرفع نقطتك بمقدار {improvement.toFixed(1)} نقطة.
            </>
          ) : (
            <>
              🎉 أداؤك ممتاز في جميع المهارات!<br />
              استمر على هذا المنوال وركز على الحفاظ على مستواك.<br />
              يمكنك أيضاً استكشاف مواضيع متقدمة لتوسيع معرفتك.
            </>
          )}
        </p>
      </div>

      {/* Note */}
      <div style={{
        textAlign: 'center',
        padding: '15px',
        background: '#f0f0f0',
        borderRadius: '10px',
        marginBottom: '25px'
      }}>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          ✨ هذا التقرير مبني على تحليل بيانات حقيقية من امتحانات البكالوريا السابقة ✨
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onReset}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontFamily: 'inherit',
            boxShadow: '0 4px 15px rgba(46,204,113,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(46,204,113,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(46,204,113,0.3)';
          }}
        >
          ✏️ بدء تقييم جديد
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '25px',
        padding: '15px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        borderRadius: '10px',
        color: 'white'
      }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          🇩🇿 تم تطوير هذه المنصة لمساعدة طلاب البكالوريا الجزائريين 🇩🇿
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '11px', opacity: 0.7 }}>
          {subjectData.name} - جميع الحقوق محفوظة © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}