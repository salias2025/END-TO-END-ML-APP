// frontend/src/components/bac_year/prediction.jsx
import React from 'react';

export default function Prediction({ prediction, subjectData, onNext, onBack, formData }) {
  if (!prediction) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        <p>⚠️ لا توجد نتائج لعرضها</p>
      </div>
    );
  }

  const { score, prob, improvement } = prediction;

  let scoreColor, scoreEmoji, scoreText;
  if (score >= 16) {
    scoreColor = '#2ecc71';
    scoreEmoji = '🏆';
    scoreText = 'ممتاز';
  } else if (score >= 14) {
    scoreColor = '#27ae60';
    scoreEmoji = '🎉';
    scoreText = 'جيد جداً';
  } else if (score >= 12) {
    scoreColor = '#f39c12';
    scoreEmoji = '👍';
    scoreText = 'جيد';
  } else if (score >= 10) {
    scoreColor = '#e67e22';
    scoreEmoji = '📈';
    scoreText = 'مقبول';
  } else {
    scoreColor = '#e74c3c';
    scoreEmoji = '⚠️';
    scoreText = 'يحتاج إلى تحسين';
  }

  const probColor = prob >= 80 ? '#2ecc71' : prob >= 60 ? '#f39c12' : '#e74c3c';

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
        <h1 style={{ margin: 0, fontSize: '28px' }}>🔮 توقع نقطة البكالوريا</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          {subjectData.icon} {subjectData.name}
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '12px' }}>
          بناءً على بياناتك الشخصية
        </p>
      </div>

      {/* Main Score Card */}
      <div style={{
        background: `linear-gradient(135deg, ${scoreColor}20 0%, ${scoreColor}10 100%)`,
        padding: '30px',
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
          marginTop: '15px',
          height: '10px',
          background: '#ecf0f1',
          borderRadius: '5px',
          overflow: 'hidden',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div style={{
            width: `${(score / 20) * 100}%`,
            height: '100%',
            background: scoreColor,
            borderRadius: '5px',
            transition: 'width 1s ease'
          }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>✅ فرصة النجاح (≥10/20)</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: probColor }}>
            {prob.toFixed(0)}%
          </div>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>📈 إمكانية التحسين</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3498db' }}>
            +{improvement.toFixed(1)}
          </div>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666' }}>🎯 المستوى</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: scoreColor }}>
            {scoreText}
          </div>
        </div>
      </div>

      {/* Skills Breakdown - ✅ FIXED: Uses REAL formData */}
      {subjectData.skills && formData && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px'
        }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📊 تفصيل المهارات</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {Object.entries(subjectData.skills).map(([key, skill]) => {
              // ✅ FIXED: Use REAL formData value
              const value = formData?.[key] ?? 0;
              const color = value >= skill.target ? '#2ecc71' : value >= skill.target - 1 ? '#f39c12' : '#e74c3c';
              return (
                <div key={key} style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: '500' }}>{skill.name}</span>
                    <span style={{ fontWeight: 'bold', color: color }}>
                      {value.toFixed(1)}/10
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#ecf0f1',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(value / 10) * 100}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '3px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '4px'
                  }}>
                    الهدف: {skill.target}/10
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      {subjectData.tips && (
        <div style={{
          background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px',
          color: 'white'
        }}>
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>💡 نصائح لتحسين أدائك</h3>
          <ul style={{ lineHeight: '2', paddingRight: '20px' }}>
            {subjectData.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Note */}
      <div style={{
        textAlign: 'center',
        padding: '15px',
        background: '#f0f0f0',
        borderRadius: '10px',
        marginBottom: '25px'
      }}>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          ✨ هذه النتيجة هي تقدير بناءً على بياناتك الفعلية ✨
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
            background: 'linear-gradient(135deg, #e67e22, #d35400)',
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
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(230,126,34,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ✏️ تعديل البيانات
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
          📊 تحليل نقاط الضعف →
        </button>
      </div>
    </div>
  );
}