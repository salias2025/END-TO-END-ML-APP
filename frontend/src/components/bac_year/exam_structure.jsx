// src/components/bac_year/exam_structure.jsx
import React from 'react';

export default function ExamStructure({ subjectData, onNext }) {
  // Get structure from subjectData or use default
  const structure = subjectData?.examStructure || {
    title: `${subjectData?.icon || '📖'} ${subjectData?.name || 'المادة'}`,
    streams: [
      {
        name: 'جميع الشعب',
        color: '#3498db',
        exercises: [
          { name: 'الجزء الأول', content: 'المهارات الأساسية', points: '40%' },
          { name: 'الجزء الثاني', content: 'المهارات التطبيقية', points: '35%' },
          { name: 'الجزء الثالث', content: 'المهارات التحليلية', points: '25%' }
        ]
      }
    ]
  };

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
        <h1 style={{ margin: 0, fontSize: '28px' }}>{structure.title}</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
          امتحان البكالوريا - جميع الشعب
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: '#e8f4f8',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          borderRight: '4px solid #3498db'
        }}>
          <div style={{ fontSize: '35px' }}>⏱️</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>المدة</div>
          <div style={{ fontSize: '14px' }}>{subjectData?.examDuration || '2h30'}</div>
        </div>
        <div style={{
          background: '#e8f4f8',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          borderRight: '4px solid #2ecc71'
        }}>
          <div style={{ fontSize: '35px' }}>📊</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>مجموع النقاط</div>
          <div style={{ fontSize: '14px' }}>{subjectData?.totalPoints || 20} نقطة</div>
        </div>
        <div style={{
          background: '#e8f4f8',
          padding: '15px',
          borderRadius: '10px',
          textAlign: 'center',
          borderRight: '4px solid #e74c3c'
        }}>
          <div style={{ fontSize: '35px' }}>📝</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>المهارات</div>
          <div style={{ fontSize: '14px' }}>
            {subjectData?.skills ? Object.keys(subjectData.skills).length : 6} مهارة
          </div>
        </div>
      </div>

      {/* Stream Structures */}
      {structure.streams.map((stream, idx) => (
        <div key={idx} style={{
          background: '#f9f9f9',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          borderRight: `5px solid ${stream.color || '#3498db'}`
        }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>{stream.name}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
            <thead>
              <tr style={{ background: stream.color || '#3498db', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>التمرين</th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>المحتوى</th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>النقاط</th>
              </tr>
            </thead>
            <tbody>
              {stream.exercises.map((ex, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid #ddd',
                  background: i % 2 === 0 ? 'white' : '#f0f8ff'
                }}>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    <strong>{ex.name}</strong>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {ex.content}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {ex.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Importance Colors */}
      {subjectData?.importance && (
        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          borderRight: '5px solid #ffc107'
        }}>
          <h3 style={{ color: '#856404', marginTop: 0 }}>🎯 المهارات الأكثر أهمية</h3>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {subjectData.importance.map((item, index) => (
              <div key={index} style={{
                flex: 1,
                minWidth: '120px',
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                <div style={{ color: item.color, fontSize: '24px' }}>●</div>
                <div><strong>{item.skill}</strong></div>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.weight}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {subjectData?.tips && (
        <div style={{
          background: '#e8f8f5',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          borderRight: '5px solid #1abc9c'
        }}>
          <h3 style={{ color: '#0e6655', marginTop: 0 }}>💡 نصائح للنجاح</h3>
          <ul style={{ lineHeight: '2', paddingRight: '20px', margin: 0 }}>
            {subjectData.tips.slice(0, 4).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={onNext}
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '20px',
          background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s',
          fontFamily: 'inherit',
          boxShadow: '0 4px 15px rgba(46,204,113,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(46,204,113,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(46,204,113,0.3)';
        }}
      >
        🚀 ابدأ التقييم الآن
      </button>
    </div>
  );
}