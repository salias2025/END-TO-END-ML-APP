// frontend/src/components/bac_year/weaknesses.jsx
import React from 'react';

export default function Weaknesses({ formData, weaknessData, subjectData, onNext, onBack }) {
  if (!formData) {
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

  // ============================================
  // ✅ SHOW ALL SKILLS (no limit)
  // ============================================

  // Calculate skill gaps
  const skillGaps = {};
  const skillValues = {};
  let totalGap = 0;
  let maxGap = 0;
  let weakestSkill = null;
  let strongestSkill = null;

  Object.entries(subjectData.skills || {}).forEach(([key, skill]) => {
    const value = formData[key] || 0;
    const target = skill.target || 7;
    const gap = Math.max(0, target - value);
    skillGaps[key] = gap;
    skillValues[key] = value;
    totalGap += gap;
    if (gap > maxGap) {
      maxGap = gap;
      weakestSkill = key;
    }
    if (!strongestSkill || value > skillValues[strongestSkill]) {
      strongestSkill = key;
    }
  });

  // Calculate weakness score
  const maxPossibleGap = Object.keys(subjectData.skills).length * 5;
  const weaknessScore = Math.min(100, Math.max(0, (totalGap / maxPossibleGap) * 100));

  // ✅ ALL WEAKNESSES (no limit)
  const sortedWeaknesses = Object.entries(skillGaps)
    .filter(([_, gap]) => gap > 0)
    .sort((a, b) => b[1] - a[1]);

  // ✅ ALL STRENGTHS (no limit)
  const sortedStrengths = Object.entries(skillValues)
    .filter(([key]) => {
      const target = subjectData.skills[key]?.target || 7;
      return skillValues[key] >= target;
    })
    .sort((a, b) => b[1] - a[1]);

  // Study habits gaps
  const habitTargets = {
    exams_practiced: 10,
    consistency: 4,
    confidence: 4,
    study_hours: 6,
    essays_per_week: 3
  };

  const habitGaps = {};
  const habitValues = {};
  let habitTotalGap = 0;

  Object.entries(habitTargets).forEach(([habit, target]) => {
    const value = formData[habit] || 0;
    const gap = Math.max(0, target - value);
    habitGaps[habit] = gap;
    habitValues[habit] = value;
    habitTotalGap += gap;
  });

  const sortedHabits = Object.entries(habitGaps)
    .filter(([_, gap]) => gap > 0)
    .sort((a, b) => b[1] - a[1]);

  const habitNames = {
    exams_practiced: '📚 حل امتحانات البكالوريا',
    consistency: '📅 الانتظام في الدراسة',
    study_hours: '⏰ ساعات الدراسة',
    essays_per_week: '✍️ كتابة المقالات',
    confidence: '💪 الثقة بالنفس'
  };

  const skillNames = Object.fromEntries(
    Object.entries(subjectData.skills || {}).map(([key, skill]) => [key, skill.name])
  );

  // Psychological factors
  const stressLevel = formData.stress || 3;
  const stressIssue = stressLevel >= 4;

  // Generate recommendations
  const recommendations = [];

  if (skillGaps[weakestSkill] > 0 && weakestSkill) {
    const skillName = skillNames[weakestSkill] || weakestSkill;
    recommendations.push(`📖 <strong>ركز على تحسين "${skillName}"</strong> - هذه المهارة تحتاج إلى تركيز فوري (حالياً ${skillValues[weakestSkill].toFixed(1)}/10، الهدف ${subjectData.skills[weakestSkill]?.target || 7}/10)`);
  }

  if (sortedWeaknesses.length >= 2) {
    const secondWeakest = sortedWeaknesses[1];
    if (secondWeakest) {
      const skillName = skillNames[secondWeakest[0]] || secondWeakest[0];
      recommendations.push(`📚 <strong>حسّن "${skillName}"</strong> - هذه المهارة الثانية في قائمة الأولويات`);
    }
  }

  if (habitGaps.exams_practiced > 0) {
    recommendations.push(`📝 <strong>حل امتحانات سابقة</strong> - حل امتحان بكالوريا كل أسبوع (حالياً ${formData.exams_practiced || 0}، الهدف 10)`);
  }

  if (habitGaps.consistency > 0) {
    recommendations.push(`📅 <strong>نظم وقتك</strong> - خصص وقتاً يومياً للدراسة (حالياً ${formData.consistency || 0}/5، الهدف 4/5)`);
  }

  if (habitGaps.confidence > 0) {
    recommendations.push(`💪 <strong>عزز ثقتك بنفسك</strong> - ابدأ بحل تمارين سهلة ثم انتقل إلى الصعبة (حالياً ${formData.confidence || 0}/5، الهدف 4/5)`);
  }

  if (habitGaps.essays_per_week > 0) {
    recommendations.push(`✍️ <strong>اكتب مقالات بانتظام</strong> - حاول كتابة مقال على الأقل أسبوعياً (حالياً ${formData.essays_per_week || 0}، الهدف 3)`);
  }

  if (stressIssue) {
    recommendations.push(`😰 <strong>تحكم في التوتر</strong> - التوتر يؤثر سلباً على أدائك. جرب تمارين التنفس العميق وتنظيم وقتك`);
  }

  if (recommendations.length === 0) {
    recommendations.push('🎉 <strong>ممتاز!</strong> أداؤك جيد جداً. استمر على هذا المنوال وركز على الحفاظ على مستواك');
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>📊 تحليل نقاط القوة والضعف</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          {subjectData.icon} {subjectData.name}
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '12px' }}>
          فهم مهاراتك لتحديد مجالات التحسين
        </p>
      </div>

      {/* Weakness Score Card */}
      <div style={{
        background: `linear-gradient(135deg, ${weaknessScore > 60 ? '#e74c3c' : weaknessScore > 30 ? '#f39c12' : '#2ecc71'} 0%, ${weaknessScore > 60 ? '#c0392b' : weaknessScore > 30 ? '#e67e22' : '#27ae60'} 100%)`,
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '25px',
        color: 'white'
      }}>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>نسبة المجال للتحسين</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>
          {weaknessScore.toFixed(0)}%
        </div>
        <div style={{
          height: '10px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '5px',
          overflow: 'hidden',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div style={{
            width: `${weaknessScore}%`,
            height: '100%',
            background: 'white',
            borderRadius: '5px',
            transition: 'width 1s ease'
          }} />
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          {weaknessScore > 60 ? '⚠️ هناك مجالات كثيرة تحتاج إلى تحسين' :
           weaknessScore > 30 ? '📈 لديك مجالات يمكن تطويرها' :
           '✅ أنت على الطريق الصحيح'}
        </p>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px'
      }}>
        {/* ✅ Weaknesses Column - ALL weaknesses */}
        <div style={{
          background: '#fff5f5',
          padding: '20px',
          borderRadius: '15px',
          borderRight: '4px solid #e74c3c'
        }}>
          <h3 style={{ color: '#c0392b', marginTop: 0 }}>🔴 نقاط الضعف</h3>
          {sortedWeaknesses.length > 0 ? (
            sortedWeaknesses.map(([skill, gap]) => {
              const value = skillValues[skill];
              const target = subjectData.skills[skill]?.target || 7;
              const progress = Math.min(100, (value / target) * 100);
              return (
                <div key={skill} style={{
                  marginBottom: '15px',
                  padding: '10px',
                  background: 'white',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>📖 {skillNames[skill] || skill}</span>
                    <span>{value.toFixed(1)}/10 → {target}/10</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#ecf0f1',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progress >= 80 ? '#2ecc71' : progress >= 60 ? '#f39c12' : '#e74c3c',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#27ae60', fontSize: '18px' }}>🎉 ممتاز! لا توجد نقاط ضعف واضحة</p>
            </div>
          )}
        </div>

        {/* ✅ Strengths Column - ALL strengths */}
        <div style={{
          background: '#f0fff4',
          padding: '20px',
          borderRadius: '15px',
          borderRight: '4px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', marginTop: 0 }}>🟢 نقاط القوة</h3>
          {sortedStrengths.length > 0 ? (
            sortedStrengths.map(([skill, value]) => {
              const target = subjectData.skills[skill]?.target || 7;
              return (
                <div key={skill} style={{
                  marginBottom: '15px',
                  padding: '10px',
                  background: 'white',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>📖 {skillNames[skill] || skill}</span>
                    <span style={{ color: '#27ae60' }}>{value.toFixed(1)}/10</span>
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
                      background: '#27ae60',
                      borderRadius: '4px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    ✅ مستوى جيد، استمر في التدريب
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: '#e74c3c' }}>📚 لا توجد نقاط قوة واضحة</p>
              <p style={{ color: '#666', fontSize: '14px' }}>ركز على تحسين المهارات الأساسية أولاً</p>
            </div>
          )}
        </div>
      </div>

      {/* Study Habits Weaknesses */}
      {sortedHabits.length > 0 && (
        <div style={{
          background: '#fff8e1',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px',
          borderRight: '4px solid #f39c12'
        }}>
          <h3 style={{ color: '#e67e22', marginTop: 0 }}>⏰ عادات الدراسة التي تحتاج تحسين</h3>
          {sortedHabits.map(([habit, gap]) => {
            const value = habitValues[habit];
            const target = habitTargets[habit];
            return (
              <div key={habit} style={{
                marginBottom: '12px',
                padding: '10px',
                background: 'white',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '5px'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{habitNames[habit] || habit}</span>
                  <span>{value} → يجب أن يكون {target}</span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#ecf0f1',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, (value / target) * 100)}%`,
                    height: '100%',
                    background: '#f39c12',
                    borderRadius: '4px',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stress Warning */}
      {stressIssue && (
        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '25px',
          borderRight: '4px solid #f39c12'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>😰</span>
            <div>
              <strong style={{ color: '#856404' }}>مستوى التوتر مرتفع</strong>
              <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 0 0' }}>
                التوتر يؤثر سلباً على أدائك. جرب تمارين التنفس العميق، وتنظيم وقتك، وأخذ فترات راحة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        color: 'white'
      }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>🎯 خطة التحسين المخصصة لك</h3>
        <ul style={{ lineHeight: '2', paddingRight: '20px' }}>
          {recommendations.map((rec, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: rec }} />
          ))}
        </ul>
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
          ✨ التركيز على نقاط الضعف هو المفتاح لتحسين نتائجك ✨
        </p>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(52,152,219,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← العودة للنتيجة
        </button>
        <button
          onClick={onNext}
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
          📖 شرح المؤشرات المركبة →
        </button>
      </div>
    </div>
  );
}