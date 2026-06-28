// src/components/bac_year/derived_features.jsx
import React from 'react';

export default function DerivedFeatures({ formData, featureData, subjectData, onNext, onBack }) {
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
  // GET FEATURES - PRIORITIZE API DATA
  // ============================================
  
  const getFeatures = () => {
    // ✅ If we have data from the API, use it!
    if (featureData && Object.keys(featureData).length > 0) {
      // If subjectData has custom derivedFeatures, use them
      if (subjectData?.derivedFeatures && subjectData.derivedFeatures.length > 0) {
        return subjectData.derivedFeatures.map(feature => {
          let value = featureData[feature.id] ?? 0;
          
          // Clamp value between 0 and max
          if (feature.max) {
            value = Math.min(feature.max, Math.max(0, value));
          }
          
          return {
            ...feature,
            value: value,
            displayValue: feature.isSpecial ? value.toFixed(2) : value.toFixed(1)
          };
        });
      }
      
      // Fallback: build features from featureData keys
      return Object.keys(featureData).map(key => ({
        id: key,
        name: key.replace(/_/g, ' ').toUpperCase(),
        value: featureData[key],
        displayValue: featureData[key].toFixed(1),
        max: 10,
        description: `مؤشر ${key.replace(/_/g, ' ')}`,
        improvement: 'ركز على تحسين هذا المؤشر'
      }));
    }
    
    // ⚠️ FALLBACK - Calculate from formData (if no API data)
    if (subjectData?.derivedFeatures && subjectData.derivedFeatures.length > 0) {
      return subjectData.derivedFeatures.map(feature => {
        let value = 0;
        try {
          value = feature.calculate(formData) || 0;
        } catch (e) {
          value = 0;
        }
        
        // Clamp value between 0 and max
        if (feature.max) {
          value = Math.min(feature.max, Math.max(0, value));
        }
        
        return {
          ...feature,
          value: value,
          displayValue: feature.isSpecial ? value.toFixed(2) : value.toFixed(1)
        };
      });
    }
    
    // GENERIC FALLBACK - if no custom features defined
    const skills = subjectData?.skills || {};
    const skillKeys = Object.keys(skills);
    const skillValues = skillKeys.map(key => formData[key] || 0);
    
    const avgSkill = skillValues.reduce((a, b) => a + b, 0) / (skillValues.length || 1);
    const practiceIntensity = (formData.essays_per_week || 0) * 2 + (formData.exams_practiced || 0) / 3;
    const avg = skillValues.reduce((a, b) => a + b, 0) / (skillValues.length || 1);
    const imbalanceScore = skillValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (skillValues.length || 1);
    
    const genericFeatures = [
      {
        id: 'core_skill',
        name: `🎯 المستوى العام في ${subjectData?.name || 'المادة'}`,
        value: avgSkill,
        displayValue: avgSkill.toFixed(1),
        max: 10,
        description: `يقيس متوسط مستواك في جميع مهارات ${subjectData?.name || 'المادة'}`,
        improvement: 'ركز على المهارات الأضعف لرفع مستواك العام'
      },
      {
        id: 'practice_intensity',
        name: '⚡ كثافة التمارين',
        value: practiceIntensity,
        displayValue: practiceIntensity.toFixed(1),
        max: 10,
        description: 'يقيس مدى اجتهادك في حل التمارين والامتحانات السابقة',
        improvement: practiceIntensity < 5 
          ? 'حل امتحان بكالوريا كل أسبوع وزد عدد التمارين'
          : 'استمر في حل الامتحانات والتمارين، هذا المستوى ممتاز'
      },
      {
        id: 'skill_balance',
        name: '⚖️ توازن المهارات',
        value: imbalanceScore,
        displayValue: imbalanceScore.toFixed(2),
        max: 5,
        isSpecial: true,
        description: 'يقيس مدى التوازن بين مهاراتك المختلفة',
        improvement: imbalanceScore < 0.5 
          ? 'مهاراتك متوازنة - هذا رائع! استمر في تطوير جميع المهارات بنفس المستوى'
          : imbalanceScore < 1.0
            ? 'هناك تفاوت بسيط في مهاراتك. ركز قليلاً على المهارات الأضعف'
            : 'مهاراتك غير متوازنة. حدد المهارات الضعيفة وركز عليها بشكل مكثف'
      }
    ];
    
    return genericFeatures;
  };

  // ============================================
  // GET LEVEL
  // ============================================
  
  const getLevel = (value, target) => {
    if (value >= target) {
      return { text: 'ممتاز', color: '#2ecc71', icon: '✅' };
    } else if (value >= target * 0.7) {
      return { text: 'جيد', color: '#f39c12', icon: '📈' };
    } else if (value >= target * 0.4) {
      return { text: 'مقبول', color: '#3498db', icon: '📊' };
    } else {
      return { text: 'يحتاج إلى تحسين', color: '#e74c3c', icon: '⚠️' };
    }
  };

  const features = getFeatures();

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div style={{
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '950px',
      margin: '0 auto',
      padding: '10px',
      color: '#1a1a2e'
    }}>
      {/* Header */}
      <div style={{
        background: subjectData?.theme?.gradient || 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>📖 شرح المؤشرات المركبة</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          {subjectData?.icon || '📖'} {subjectData?.name || 'المادة'}
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '12px' }}>
          ماذا تعني هذه الأرقام؟ وكيف تؤثر على مستواك؟
        </p>
      </div>

      {/* Introduction */}
      <div style={{
        background: '#f0f8ff',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        borderRight: '4px solid #3498db'
      }}>
        <p style={{ fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
          <strong>📌 ما هي المؤشرات المركبة؟</strong><br />
          هي مقاييس ذكية تستخلص من مهاراتك الأساسية لتعطيك صورة أوضح عن مستواك العام في {subjectData?.name || 'المادة'}.
        </p>
      </div>

      {/* Feature Cards */}
      {features.length > 0 ? (
        features.map((feature, index) => {
          const level = feature.isSpecial 
            ? { text: feature.value < 0.5 ? 'ممتاز (مهارات متوازنة)' : feature.value < 1.0 ? 'جيد (تفاوت بسيط)' : 'يحتاج إلى تحسين (تفاوت كبير)', color: feature.value < 0.5 ? '#2ecc71' : feature.value < 1.0 ? '#f39c12' : '#e74c3c' }
            : getLevel(feature.value, feature.target || 7);
          
          const displayValue = feature.displayValue || feature.value.toFixed(1);
          const maxDisplay = feature.max ? `/10` : '';
          const isSpecial = feature.isSpecial || false;
          
          return (
            <div key={feature.id || index} style={{
              background: 'white',
              borderRadius: '15px',
              marginBottom: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${level.color}, ${level.color}dd)`,
                padding: '15px 20px',
                color: 'white'
              }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{feature.name}</h3>
                {feature.importance && (
                  <span style={{
                    fontSize: '12px',
                    opacity: 0.8,
                    marginRight: '10px'
                  }}>
                    {feature.importance === 'high' ? '🔴 أهمية عالية' : 
                     feature.importance === 'medium' ? '🟠 أهمية متوسطة' : 
                     '🟢 أهمية منخفضة'}
                  </span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#666' }}>قيمتك:</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: level.color }}>
                      {displayValue}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>{maxDisplay}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: '#666' }}>المستوى:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: level.color }}>
                      {!isSpecial ? `${level.icon} ${level.text}` : level.text}
                    </span>
                  </div>
                </div>
                
                {!isSpecial && (
                  <div style={{
                    height: '10px',
                    background: '#ecf0f1',
                    borderRadius: '5px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (feature.value / (feature.max || 10)) * 100)}%`,
                      height: '100%',
                      background: level.color,
                      borderRadius: '5px',
                      transition: 'width 1s ease'
                    }} />
                  </div>
                )}
                
                <div style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '10px'
                }}>
                  <p style={{ margin: '0 0 10px 0' }}>
                    <strong>🤔 ماذا يعني؟</strong>
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#555' }}>
                    {feature.description}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>💡 كيف تحسنه؟</strong><br />
                    {feature.improvement}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>⚠️ لا توجد مؤشرات لعرضها</p>
        </div>
      )}

      {/* Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        color: 'white'
      }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>📊 ملخص مؤشراتك</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '15px',
          justifyContent: 'center'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px' }}>{feature.name?.split(' ')[0] || '📊'}</div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>
                {feature.name?.replace(/^[^\s]+\s/, '').substring(0, 15) || 'مؤشر'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {feature.displayValue || feature.value?.toFixed(1) || '0.0'}
                {!feature.isSpecial && feature.max ? '/10' : ''}
              </div>
            </div>
          ))}
        </div>
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
          ← العودة لتحليل الضعف
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
          ⚡ محاكاة التحسين →
        </button>
      </div>
    </div>
  );
}