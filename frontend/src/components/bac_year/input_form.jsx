import React, { useState } from 'react';

export default function InputForm({ subjectData, onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    // Trimester grades
    grade_t1: 12,
    grade_t2: 12,
    grade_t3: 12,
    // Skills - dynamically initialized from subjectData
    ...Object.keys(subjectData.skills || {}).reduce((acc, key) => {
      acc[key] = 6;
      return acc;
    }, {}),
    // Study habits
    exams_practiced: 5,
    essays_per_week: 2,
    study_hours: 5,
    consistency: 3,
    tutoring: 0,
    participation: 3,
    // Psychological factors
    confidence: 3,
    stress: 3,
    interest: 3
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate grades
    if (formData.grade_t1 < 0 || formData.grade_t1 > 20 ||
        formData.grade_t2 < 0 || formData.grade_t2 > 20 ||
        formData.grade_t3 < 0 || formData.grade_t3 > 20) {
      alert('⚠️ الرجاء إدخال معدلات صحيحة (من 0 إلى 20)');
      return;
    }

    // Validate skills
    const skillKeys = Object.keys(subjectData.skills || {});
    for (const key of skillKeys) {
      if (formData[key] < 0 || formData[key] > 10) {
        alert(`⚠️ الرجاء إدخال مستوى صحيح لمهارة ${subjectData.skills[key].name} (من 0 إلى 10)`);
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h2 style={{ margin: 0 }}>📋 أدخل معلوماتك الدراسية</h2>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
          {subjectData.icon} {subjectData.name}
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '12px' }}>
          جميع المعلومات سرية وتستخدم فقط لحساب توقع نقطتك
        </p>
      </div>

      {/* Section 1: Trimester Grades */}
      <div style={{
        background: '#f0f8ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        borderRight: '4px solid #2ecc71'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📊 1. معدلات الفصول الثلاثة</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>أدخل معدلاتك في {subjectData.name} من 0 إلى 20</p>
        
        {['grade_t1', 'grade_t2', 'grade_t3'].map((field, i) => (
          <div key={field} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontWeight: '500', color: '#333' }}>
                الفصل {['الأول', 'الثاني', 'الثالث'][i]}:
              </label>
              <span style={{ fontWeight: 'bold', color: '#3498db' }}>
                {formData[field].toFixed(1)}/20
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={formData[field]}
              onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #3498db44, #3498db)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        ))}
      </div>

      {/* Section 2: Skills */}
      <div style={{
        background: '#f0f8ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        borderRight: '4px solid #e74c3c'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📚 2. مستوى مهاراتك</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          قيم نفسك من 0 إلى 10 (0 = ضعيف جداً، 10 = ممتاز)
        </p>
        
        {Object.entries(subjectData.skills || {}).map(([key, skill]) => (
          <div key={key} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontWeight: '500', color: '#333' }}>
                {skill.name}:
              </label>
              <span style={{ fontWeight: 'bold', color: '#9b59b6' }}>
                {formData[key].toFixed(1)}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={formData[key]}
              onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #9b59b644, #9b59b6)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
              الهدف: {skill.target}/10
            </div>
          </div>
        ))}
      </div>

      {/* Section 3: Study Habits */}
      <div style={{
        background: '#f0f8ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        borderRight: '4px solid #f39c12'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>⏰ 3. عادات الدراسة</h3>
        
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ fontWeight: '500', color: '#333' }}>📚 عدد امتحانات البكالوريا التي حللتها:</label>
            <span style={{ fontWeight: 'bold', color: '#e67e22' }}>{formData.exams_practiced}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={formData.exams_practiced}
            onChange={(e) => handleInputChange('exams_practiced', parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, #e67e2244, #e67e22)', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ fontWeight: '500', color: '#333' }}>✍️ عدد المقالات التي تكتبها أسبوعياً:</label>
            <span style={{ fontWeight: 'bold', color: '#e67e22' }}>{formData.essays_per_week}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={formData.essays_per_week}
            onChange={(e) => handleInputChange('essays_per_week', parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, #e67e2244, #e67e22)', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ fontWeight: '500', color: '#333' }}>⏰ عدد ساعات الدراسة الأسبوعية:</label>
            <span style={{ fontWeight: 'bold', color: '#e67e22' }}>{formData.study_hours} ساعات</span>
          </div>
          <input
            type="range"
            min="2"
            max="12"
            step="0.5"
            value={formData.study_hours}
            onChange={(e) => handleInputChange('study_hours', parseFloat(e.target.value))}
            style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, #e67e2244, #e67e22)', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <label style={{ fontWeight: '500', color: '#333' }}>📅 مدى انتظامك في الدراسة (1-5):</label>
            <span style={{ fontWeight: 'bold', color: '#e67e22' }}>{formData.consistency}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={formData.consistency}
            onChange={(e) => handleInputChange('consistency', parseInt(e.target.value))}
            style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'linear-gradient(90deg, #e67e2244, #e67e22)', outline: 'none', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Section 4: Psychological Factors */}
      <div style={{
        background: '#f0f8ff',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        borderRight: '4px solid #9b59b6'
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0 }}>🧠 4. العوامل النفسية</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>قيم نفسك من 1 إلى 5</p>
        
        {['confidence', 'stress', 'interest'].map((field) => {
          const labels = {
            confidence: { label: '💪 ثقتك بنفسك', emoji: '💪' },
            stress: { label: '😰 مستوى التوتر', emoji: '😰' },
            interest: { label: '❤️ مدى اهتمامك', emoji: '❤️' }
          };
          const levels = ['ضعيف جداً', 'ضعيف', 'متوسط', 'جيد', 'ممتاز'];
          const stressLevels = ['مرتفع جداً', 'مرتفع', 'متوسط', 'منخفض', 'منخفض جداً'];
          
          return (
            <div key={field} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontWeight: '500', color: '#333' }}>
                  {labels[field].label}:
                </label>
                <span style={{ fontWeight: 'bold', color: '#9b59b6' }}>
                  {field === 'stress' ? stressLevels[formData[field] - 1] : levels[formData[field] - 1]}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #9b59b644, #9b59b6)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #e67e22, #d35400)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
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
          ← السابق
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
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
          🔮 توقع نتيجتي
        </button>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '15px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
          💡 كن صادقاً في تقييم نفسك للحصول على توقع دقيق
        </p>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 0 10px rgba(102,126,234,0.3);
          transition: all 0.3s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}