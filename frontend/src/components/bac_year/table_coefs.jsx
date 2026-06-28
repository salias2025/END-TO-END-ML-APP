import React, { useState } from 'react';

export default function Table_Coefs() {
  const [selectedFiliere, setSelectedFiliere] = useState('sciences_experimentales');

  // Subject data: [name, icon, hours per filière, coefficient per filière]
  const allSubjects = [
    { name: 'اللغة العربية', icon: '📖', 
      sciences: { hours: 3, coef: 3 }, maths: { hours: 3, coef: 3 }, 
      tech: { hours: 3, coef: 3 }, gestion: { hours: 3, coef: 3 }, 
      langues: { hours: 5, coef: 5 }, lettres: { hours: 6, coef: 6 } },
    { name: 'اللغة الإنجليزية', icon: '🇬🇧',
      sciences: { hours: 2, coef: 2 }, maths: { hours: 2, coef: 2 }, 
      tech: { hours: 2, coef: 2 }, gestion: { hours: 3, coef: 2 }, 
      langues: { hours: 4, coef: 5 }, lettres: { hours: 3, coef: 3 } },
    { name: 'اللغة الفرنسية', icon: '🇫🇷',
      sciences: { hours: 2, coef: 2 }, maths: { hours: 2, coef: 2 }, 
      tech: { hours: 2, coef: 2 }, gestion: { hours: 3, coef: 2 }, 
      langues: { hours: 4, coef: 5 }, lettres: { hours: 3, coef: 3 } },
    { name: 'الرياضيات', icon: '🧮',
      sciences: { hours: 5, coef: 5 }, maths: { hours: 6, coef: 7 }, 
      tech: { hours: 4, coef: 6 }, gestion: { hours: 2, coef: 5 }, 
      langues: { hours: 2, coef: 2 }, lettres: { hours: 2, coef: 2 } },
    { name: 'العلوم الطبيعية', icon: '🔬',
      sciences: { hours: 5, coef: 6 }, maths: null, 
      tech: null, gestion: null, langues: null, lettres: null },
    { name: 'العلوم الفيزيائية', icon: '⚡',
      sciences: { hours: 5, coef: 5 }, maths: { hours: 5, coef: 6 }, 
      tech: null, gestion: null, langues: null, lettres: null },
    { name: 'التاريخ والجغرافيا', icon: '📜',
      sciences: { hours: 2, coef: 2 }, maths: { hours: 2, coef: 2 }, 
      tech: { hours: 2, coef: 2 }, gestion: { hours: 4, coef: 4 }, 
      langues: { hours: 2, coef: 2 }, lettres: { hours: 4, coef: 4 } },
    { name: 'العلوم الإسلامية', icon: '🕌',
      sciences: { hours: 2, coef: 2 }, maths: { hours: 2, coef: 2 }, 
      tech: { hours: 2, coef: 2 }, gestion: { hours: 2, coef: 2 }, 
      langues: { hours: 2, coef: 2 }, lettres: { hours: 2, coef: 2 } },
    { name: 'الفلسفة', icon: '💭',
      sciences: { hours: 2, coef: 2 }, maths: { hours: 2, coef: 2 }, 
      tech: { hours: 2, coef: 2 }, gestion: { hours: 3, coef: 2 }, 
      langues: { hours: 3, coef: 2 }, lettres: { hours: 4, coef: 6 } },
    { name: 'التكنولوجيا', icon: '💻',
      sciences: null, maths: null, 
      tech: { hours: 6, coef: 7 }, gestion: null, langues: null, lettres: null },
    { name: 'الاقتصاد والمناجمنت', icon: '📈',
      sciences: null, maths: null, 
      tech: null, gestion: { hours: 4, coef: 5 }, langues: null, lettres: null },
    { name: 'القانون', icon: '⚖️',
      sciences: null, maths: null, 
      tech: null, gestion: { hours: 2, coef: 2 }, langues: null, lettres: null },
    { name: 'التسيير المحاسبي والمالي', icon: '📊',
      sciences: null, maths: null, 
      tech: null, gestion: { hours: 4, coef: 6 }, langues: null, lettres: null },
    { name: 'التربية البدنية', icon: '🏃',
      sciences: { hours: 2, coef: 1 }, maths: { hours: 2, coef: 1 }, 
      tech: { hours: 2, coef: 1 }, gestion: { hours: 2, coef: 1 }, 
      langues: { hours: 2, coef: 1 }, lettres: { hours: 2, coef: 1 } },
    { name: 'الأمازيغية', icon: 'ⵣ',
      sciences: { hours: 3, coef: 2 }, maths: { hours: 3, coef: 2 }, 
      tech: { hours: 3, coef: 2 }, gestion: { hours: 3, coef: 2 }, 
      langues: { hours: 3, coef: 2 }, lettres: { hours: 3, coef: 2 } },
  ];

  const filieres = {
    sciences_experimentales: { name: 'علوم تجريبية', key: 'sciences' },
    maths: { name: 'رياضيات', key: 'maths' },
    techniques_maths: { name: 'تقني رياضي', key: 'tech' },
    gestion_economie: { name: 'تسيير واقتصاد', key: 'gestion' },
    langues_etrangeres: { name: 'لغات أجنبية', key: 'langues' },
    lettres_philosophie: { name: 'آداب وفلسفة', key: 'lettres' },
  };

  const currentFiliere = filieres[selectedFiliere];
  const filiereKey = currentFiliere.key;

  // Filter subjects that exist in this filière
  const subjects = allSubjects.filter(subject => subject[filiereKey] !== null);

  // Calculate total hours and coefficients
  let totalHours = 0;
  let totalCoef = 0;
  subjects.forEach(subject => {
    const data = subject[filiereKey];
    if (data) {
      totalHours += data.hours;
      totalCoef += data.coef;
    }
  });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '25px 30px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '700' }}>📊 جدول أوقات ومعاملات المواد</h1>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>السنة الثالثة ثانوي - {currentFiliere.name}</p>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '5px 12px',
          fontSize: '12px',
          display: 'inline-block',
          marginTop: '10px'
        }}>
          🎓 التعليم الثانوي - الجزائر
        </div>
      </div>

      {/* Filière Selector */}
      <div style={{
        padding: '15px 20px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <label style={{ fontWeight: '600', color: '#333' }}>📚 اختر الشعبة:</label>
        <select
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '14px',
            background: 'white',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '180px'
          }}
        >
          {Object.entries(filieres).map(([key, value]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
        <div style={{ fontSize: '13px', color: '#666' }}>
          عرض: <strong style={{ color: '#2a5298' }}>{currentFiliere.name}</strong>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr>
              <th style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '14px 8px',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #3d5a73',
                fontSize: '14px',
                minWidth: '160px'
              }}>
                المواد
              </th>
              <th style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '14px 8px',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #3d5a73',
                fontSize: '14px'
              }}>
                {currentFiliere.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => {
              const data = subject[filiereKey];
              return (
                <tr key={index} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{
                    padding: '10px 15px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#2c3e50',
                    borderRight: '3px solid #3498db',
                    border: '1px solid #e0e0e0',
                    minWidth: '160px'
                  }}>
                    {subject.icon} {subject.name}
                  </td>
                  <td style={{
                    padding: '10px 6px',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ color: '#1e3c72', fontWeight: '600' }}>⏱️ {data.hours}h</div>
                    <div style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '14px' }}>⭐ {data.coef}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
        color: 'white',
        padding: '15px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '22px', margin: 0 }}>📊 ملخص المجموع والمعاملات</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr>
              <th style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '14px 8px',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #3d5a73'
              }}>
                الشعبة
              </th>
              <th style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '14px 8px',
                fontWeight: '600',
                textAlign: 'center',
                border: '1px solid #3d5a73'
              }}>
                {currentFiliere.name}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{
              background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              color: 'white',
              fontWeight: 'bold'
            }}>
              <td style={{
                padding: '12px 15px',
                textAlign: 'right',
                fontWeight: '600',
                border: '1px solid #3d8b40',
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                color: 'white'
              }}>
                📅 مجموع الساعات الأسبوعية
              </td>
              <td style={{
                padding: '12px 6px',
                textAlign: 'center',
                border: '1px solid #3d8b40',
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {totalHours} + (2) = <strong style={{ fontSize: '22px', color: '#fff' }}>{totalHours + 2}</strong>
              </td>
            </tr>
            <tr style={{
              background: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
              color: 'white',
              fontWeight: 'bold'
            }}>
              <td style={{
                padding: '12px 15px',
                textAlign: 'right',
                fontWeight: '600',
                border: '1px solid #3d8b40',
                background: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
                color: 'white'
              }}>
                ⭐ مجموع المعاملات
              </td>
              <td style={{
                padding: '12px 6px',
                textAlign: 'center',
                border: '1px solid #3d8b40',
                background: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {totalCoef} + (2) = <strong style={{ fontSize: '22px', color: '#fff' }}>{totalCoef + 2}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px 25px',
        borderTop: '1px solid #dee2e6',
        fontSize: '12px',
        color: '#6c757d',
        textAlign: 'center'
      }}>
        <p style={{ margin: '5px 0' }}>📌 <strong>ملاحظات:</strong></p>
        <p style={{ margin: '3px 0' }}>
          • القيم بين قوسين <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>(2)</span> تمثل حصة اللغة الأمازيغية (ساعتان إضافيتان + معامل 2)
        </p>
        <p style={{ margin: '3px 0' }}>
          • ⏱️ = التوقيت الأسبوعي (ساعات) | ⭐ = المعامل
        </p>
      </div>
    </div>
  );
}