import React, { useState, useEffect, useRef } from 'react';

export default function AvgBacCalc() {
  const [selectedStream, setSelectedStream] = useState('تسيير واقتصاد');
  const [grades, setGrades] = useState({});
  const [average, setAverage] = useState(null);
  const [animatedAverage, setAnimatedAverage] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [particles, setParticles] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const resultRef = useRef(null);

  const streamsData = {
    'علوم تجريبية': [
        { subject: 'الرياضيات', coef: 5, emoji: '📐' },
        { subject: 'الفيزياء', coef: 5, emoji: '⚡' },
        { subject: 'العلوم الطبيعية', coef: 6, emoji: '🔬' },
        { subject: 'اللغة العربية', coef: 3, emoji: '📖' },
        { subject: 'اللغة الفرنسية', coef: 2, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 2, emoji: '🇬🇧' },
        { subject: 'الفلسفة', coef: 2, emoji: '💭' },
        { subject: 'التاريخ والجغرافيا', coef: 2, emoji: '🗺️' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ],
    'رياضيات': [
        { subject: 'الرياضيات', coef: 7, emoji: '📐' },
        { subject: 'الفيزياء', coef: 6, emoji: '⚡' },
        { subject: 'العلوم الطبيعية', coef: 2, emoji: '🔬' },
        { subject: 'اللغة العربية', coef: 3, emoji: '📖' },
        { subject: 'اللغة الفرنسية', coef: 2, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 2, emoji: '🇬🇧' },
        { subject: 'الفلسفة', coef: 2, emoji: '💭' },
        { subject: 'التاريخ والجغرافيا', coef: 2, emoji: '🗺️' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ],
    'تقني رياضي': [
        { subject: 'التكنولوجيا', coef: 7, emoji: '💻' },
        { subject: 'الرياضيات', coef: 6, emoji: '📐' },
        { subject: 'الفيزياء', coef: 6, emoji: '⚡' },
        { subject: 'اللغة العربية', coef: 3, emoji: '📖' },
        { subject: 'اللغة الفرنسية', coef: 2, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 2, emoji: '🇬🇧' },
        { subject: 'الفلسفة', coef: 2, emoji: '💭' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ],
    'تسيير واقتصاد': [
        { subject: 'التسيير المحاسبي والمالي', coef: 6, emoji: '📊' },
        { subject: 'الرياضيات', coef: 5, emoji: '📐' },
        { subject: 'الاقتصاد والمناجمنت', coef: 5, emoji: '💰' },
        { subject: 'اللغة العربية', coef: 3, emoji: '📖' },
        { subject: 'اللغة الفرنسية', coef: 2, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 2, emoji: '🇬🇧' },
        { subject: 'القانون', coef: 2, emoji: '⚖️' },
        { subject: 'الفلسفة', coef: 2, emoji: '💭' },
        { subject: 'التاريخ والجغرافيا', coef: 2, emoji: '🗺️' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ],
    'لغات أجنبية': [
        { subject: 'اللغة العربية', coef: 5, emoji: '📖' },
        { subject: 'اللغة الفرنسية', coef: 5, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 5, emoji: '🇬🇧' },
        { subject: 'اللغة الأجنبية', coef: 4, emoji: '🌍' },
        { subject: 'التاريخ والجغرافيا', coef: 3, emoji: '🗺️' },
        { subject: 'الرياضيات', coef: 2, emoji: '📐' },
        { subject: 'الفلسفة', coef: 2, emoji: '💭' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ],
    'آداب وفلسفة': [
        { subject: 'الفلسفة', coef: 6, emoji: '💭' },
        { subject: 'اللغة العربية', coef: 6, emoji: '📖' },
        { subject: 'التاريخ والجغرافيا', coef: 4, emoji: '🗺️' },
        { subject: 'اللغة الفرنسية', coef: 3, emoji: '🇫🇷' },
        { subject: 'اللغة الإنجليزية', coef: 3, emoji: '🇬🇧' },
        { subject: 'الرياضيات', coef: 2, emoji: '📐' },
        { subject: 'التربية الإسلامية', coef: 2, emoji: '🕌' },
        { subject: 'الأمازيغية', coef: 2, emoji: 'ⵣ' },
        { subject: 'التربية البدنية', coef: 1, emoji: '🏃' }
    ]
};
  const streamOptions = Object.keys(streamsData);
  const currentSubjects = streamsData[selectedStream] || [];

  // Generate celebration particles
  useEffect(() => {
    if (average !== null && average >= 10) {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          speed: Math.random() * 3 + 1,
          angle: Math.random() * 360,
          color: ['#f472b6', '#667eea', '#2dd4bf', '#fbbf24', '#a78bfa', '#34d399'][Math.floor(Math.random() * 6)],
          delay: Math.random() * 2
        });
      }
      setParticles(newParticles);
      
      // Animate average counting up
      const startValue = 0;
      const endValue = average;
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedAverage(startValue + (endValue - startValue) * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [average]);

  const handleGradeChange = (subjectIndex, value) => {
    // ✅ Allow empty, dot, and negative sign for typing
    if (value === '' || value === '-' || value === '.') {
      setGrades(prev => ({
        ...prev,
        [subjectIndex]: value
      }));
      setAverage(null);
      return;
    }
    
    // ✅ Allow numbers with one decimal point
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
      setGrades(prev => ({
        ...prev,
        [subjectIndex]: numValue
      }));
      setAverage(null);
    }
  };

  const calculateAverage = () => {
    let totalPoints = 0;
    let totalCoef = 0;
    let hasValidGrade = false;

    currentSubjects.forEach((subject, index) => {
      const grade = grades[index];
      // ✅ FIX: Check if grade is a valid number
      if (grade !== undefined && grade !== '' && !isNaN(grade) && typeof grade === 'number' && grade >= 0 && grade <= 20) {
        totalPoints += grade * subject.coef;
        totalCoef += subject.coef;
        hasValidGrade = true;
      }
    });

    if (hasValidGrade && totalCoef > 0) {
      const avg = totalPoints / totalCoef;
      setAverage(avg);
    } else {
      alert('⚠️ الرجاء إدخال نقاط صحيحة (من 0 إلى 20)');
    }
  };

  const resetGrades = () => {
    setGrades({});
    setAverage(null);
    setAnimatedAverage(0);
    setParticles([]);
  };

  const getAverageColor = (avg) => {
    if (avg >= 16) return '#2ecc71';
    if (avg >= 14) return '#27ae60';
    if (avg >= 12) return '#f39c12';
    if (avg >= 10) return '#e67e22';
    return '#e74c3c';
  };

  const getAverageStatus = (avg) => {
    if (avg >= 16) return { emoji: '🏆', text: 'ممتاز', desc: 'نتيجة استثنائية!' };
    if (avg >= 14) return { emoji: '🎉', text: 'جيد جداً', desc: 'أداء رائع!' };
    if (avg >= 12) return { emoji: '👍', text: 'جيد', desc: 'مستوى جيد، استمر!' };
    if (avg >= 10) return { emoji: '📈', text: 'مقبول', desc: 'يمكنك تحسين أكثر!' };
    return { emoji: '💪', text: 'يحتاج إلى تحسين', desc: 'لا تستسلم، واصل العمل!' };
  };

  const totalCoef = currentSubjects.reduce((sum, s) => sum + s.coef, 0);

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      direction: 'rtl',
      position: 'relative',
      background: 'linear-gradient(145deg, #0a0d1a, #1a1a2e)',
      borderRadius: '28px',
      padding: '4px',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '28px',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'floatOrb 20s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'floatOrb 25s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '28px 32px',
          borderRadius: '18px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '25px'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            animation: 'headerGlow 8s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '30px', fontWeight: '800' }}>📊 حاسبة معدل البكالوريا</h2>
            <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
              سجل نقاطك في الجدول أدناه لحساب معدلك
            </p>
          </div>
        </div>

        {/* Stream Selector */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '18px 24px',
          borderRadius: '14px',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          flexWrap: 'wrap',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <label style={{ 
            fontWeight: '600', 
            color: 'rgba(255,255,255,0.8)',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🇩🇿 اختر الشعبة:
          </label>
          <select
            value={selectedStream}
            onChange={(e) => {
              setSelectedStream(e.target.value);
              setGrades({});
              setAverage(null);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(102,126,234,0.3)',
              fontSize: '15px',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '220px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(102,126,234,0.3)'}
          >
            {streamOptions.map((stream) => (
              <option key={stream} value={stream} style={{ background: '#1a1a2e' }}>
                {stream}
              </option>
            ))}
          </select>
          <div style={{
            background: 'rgba(46,204,113,0.15)',
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#2dd4bf',
            border: '1px solid rgba(46,204,113,0.1)'
          }}>
            📚 إجمالي المعاملات: <strong style={{ fontSize: '18px' }}>{totalCoef}</strong>
          </div>
        </div>

        {/* Table */}
        <div style={{ 
          overflowX: 'auto',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '20px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'rgba(255,255,255,0.02)',
            minWidth: '500px'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))',
                borderBottom: '2px solid rgba(255,255,255,0.06)'
              }}>
                <th style={{
                  padding: '16px 16px',
                  textAlign: 'right',
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.8)',
                  minWidth: '180px'
                }}>
                  📖 المادة
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.8)',
                  minWidth: '80px'
                }}>
                  ⭐ المعامل
                </th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.8)',
                  minWidth: '160px'
                }}>
                  🎯 النقطة (0-20)
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSubjects.map((subject, index) => {
                const gradeValue = grades[index] !== undefined ? grades[index] : '';
                const isValid = gradeValue !== '' && !isNaN(gradeValue) && typeof gradeValue === 'number' && gradeValue >= 0 && gradeValue <= 20;
                const isError = gradeValue !== '' && !isNaN(gradeValue) && typeof gradeValue === 'number' && (gradeValue < 0 || gradeValue > 20);
                const isHovered = hoveredRow === index;
                
                return (
                  <tr 
                    key={index} 
                    style={{
                      background: isHovered 
                        ? 'rgba(102,126,234,0.08)' 
                        : index % 2 === 0 
                          ? 'rgba(255,255,255,0.02)' 
                          : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.3s',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: '500',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '18px' }}>{subject.emoji}</span>
                      {subject.subject}
                    </td>
                    <td style={{
                      padding: '12px 12px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#fbbf24',
                      fontSize: '18px'
                    }}>
                      {subject.coef}
                    </td>
                    <td style={{
                      padding: '10px 12px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={gradeValue}
                        onChange={(e) => handleGradeChange(index, e.target.value)}
                        placeholder="__"
                        style={{
                          width: '85px',
                          padding: '12px',
                          textAlign: 'center',
                          border: `2px solid ${isError ? '#e74c3c' : isValid ? '#2dd4bf' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '10px',
                          fontSize: '20px',
                          fontWeight: '700',
                          outline: 'none',
                          transition: 'all 0.3s',
                          background: isError 
                            ? 'rgba(231,76,60,0.1)' 
                            : isValid 
                              ? 'rgba(45,212,191,0.08)' 
                              : 'rgba(255,255,255,0.03)',
                          color: isError ? '#e74c3c' : isValid ? '#2dd4bf' : 'rgba(255,255,255,0.7)',
                          fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 30px rgba(102,126,234,0.15)';
                          e.target.style.background = 'rgba(102,126,234,0.08)';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                          e.target.style.background = isError 
                            ? 'rgba(231,76,60,0.1)' 
                            : isValid 
                              ? 'rgba(45,212,191,0.08)' 
                              : 'rgba(255,255,255,0.03)';
                          const val = parseFloat(e.target.value);
                          if (e.target.value !== '' && !isNaN(val) && (val < 0 || val > 20)) {
                            e.target.style.borderColor = '#e74c3c';
                          } else if (e.target.value !== '' && !isNaN(val)) {
                            e.target.style.borderColor = '#2dd4bf';
                          } else {
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{
                background: 'linear-gradient(135deg, rgba(45,212,191,0.08), rgba(102,126,234,0.08))',
                borderTop: '2px solid rgba(255,255,255,0.06)'
              }}>
                <td style={{
                  padding: '16px 18px',
                  textAlign: 'right',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  📅 المجموع
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: '#2dd4bf',
                  fontSize: '24px',
                  fontWeight: '800'
                }}>
                  {totalCoef}
                </td>
                <td style={{
                  padding: '14px 12px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={calculateAverage}
                      style={{
                        background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '700',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(45,212,191,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,212,191,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,212,191,0.3)';
                      }}
                    >
                      📊 احسب المعدل
                    </button>
                    <button
                      onClick={resetGrades}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(231,76,60,0.15)';
                        e.currentTarget.style.borderColor = '#e74c3c';
                        e.currentTarget.style.color = '#e74c3c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      }}
                    >
                      🔄 إعادة تعيين
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Result Card */}
        {average !== null && (
          <div style={{
            marginTop: '20px',
            padding: '32px',
            borderRadius: '18px',
            background: `linear-gradient(135deg, ${getAverageColor(average)}22, ${getAverageColor(average)}11)`,
            border: `2px solid ${getAverageColor(average)}44`,
            textAlign: 'center',
            animation: 'fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: `0 10px 40px ${getAverageColor(average)}22`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Celebration Particles */}
            {average >= 10 && particles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: '50%',
                  background: p.color,
                  opacity: 0.6,
                  animation: `celebration ${p.speed}s ease-out ${p.delay}s infinite`,
                  pointerEvents: 'none',
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}44`
                }}
              />
            ))}

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                fontSize: '18px', 
                opacity: 0.8,
                color: getAverageColor(average),
                fontWeight: '500'
              }}>
                🎯 معدلك في البكالوريا
              </div>
              <div style={{ 
                fontSize: '64px', 
                fontWeight: '800', 
                margin: '10px 0',
                color: getAverageColor(average),
                textShadow: `0 0 40px ${getAverageColor(average)}44`
              }}>
                {animatedAverage.toFixed(2)}
                <span style={{ fontSize: '22px', opacity: 0.6, fontWeight: '500' }}>/20</span>
              </div>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: '700',
                color: getAverageColor(average),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>{getAverageStatus(average).emoji}</span>
                {getAverageStatus(average).text}
                <span style={{ fontSize: '32px' }}>{getAverageStatus(average).emoji}</span>
              </div>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '6px'
              }}>
                {getAverageStatus(average).desc}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '18px',
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '3px 0' }}>
            ⏱️ أدخل نقاطك في الحقول (من 0 إلى 20) ثم اضغط على "احسب المعدل"
          </p>
          <p style={{ margin: '3px 0', color: 'rgba(251,191,36,0.4)' }}>
            ⭐ المعاملات تحدد حسب الشعبة التي اخترتها
          </p>
        </div>

        {/* Styles */}
        <style>{`
          @keyframes floatOrb {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }

          @keyframes headerGlow {
            0%, 100% { transform: translateX(-30%) rotate(10deg); }
            50% { transform: translateX(30%) rotate(-10deg); }
          }

          @keyframes fadeSlideUp {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          @keyframes celebration {
            0% { transform: translate(0, 0) scale(0); opacity: 0.8; }
            100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) scale(1); opacity: 0; }
          }

          input[type="text"]:focus {
            box-shadow: 0 0 30px rgba(102,126,234,0.15);
          }
          
          select:hover {
            border-color: rgba(102,126,234,0.5);
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.02);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(102,126,234,0.3);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(102,126,234,0.5);
          }
        `}</style>
      </div>
    </div>
  );
}