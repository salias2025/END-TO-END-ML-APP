import React, { useState } from 'react';

export default function Budget() {
  const categories = [
    { name: '🎓 الدروس الخصوصية', percentage: 40, color: '#e74c3c' },
    { name: '📚 الكتب والوثائق', percentage: 25, color: '#3498db' },
    { name: '💻 دورات Zoom/Teams', percentage: 15, color: '#e67e22' },
    { name: '📱 أجهزة إلكترونية', percentage: 8, color: '#9b59b6' },
    { name: '🚗 المواصلات', percentage: 5, color: '#2ecc71' },
    { name: '✏️ القرطاسية', percentage: 4, color: '#e91e63' },
    { name: '🖨️ الطباعة', percentage: 2, color: '#8d6e63' },
    { name: '🍎 وجبات ومشروبات', percentage: 1, color: '#f1c40f' }
  ];

  const [totalBudget, setTotalBudget] = useState(500000);
  const [percentages, setPercentages] = useState(categories.map(c => c.percentage));

  const handleBudgetChange = (value) => {
    const numValue = parseInt(value) || 0;
    setTotalBudget(numValue);
  };

  const handleSliderChange = (index, value) => {
    const newPercentages = [...percentages];
    newPercentages[index] = value;
    
    // Normalize to 100%
    const total = newPercentages.reduce((sum, p) => sum + p, 0);
    if (total !== 100) {
      const diff = 100 - total;
      newPercentages[newPercentages.length - 1] = Math.max(0, newPercentages[newPercentages.length - 1] + diff);
    }
    
    setPercentages(newPercentages);
  };

  const resetPercentages = () => {
    setPercentages(categories.map(c => c.percentage));
    setTotalBudget(500000);
  };

  const exportBudget = () => {
    const total = totalBudget;
    const amounts = percentages.map(p => Math.round((p / 100) * total));
    const totalAmount = amounts.reduce((sum, a) => sum + a, 0);
    const remaining = total - totalAmount;

    const report = `
📊 تقرير ميزانية البكالوريا
${'='.repeat(50)}
📅 التاريخ: ${new Date().toLocaleDateString('ar-DZ')}
💰 الميزانية الإجمالية: ${total.toLocaleString()} دج
${'='.repeat(50)}
📋 تفاصيل المصروفات:
${categories.map((cat, i) => `   • ${cat.name}: ${percentages[i].toFixed(0)}% (${amounts[i].toLocaleString()} دج)`).join('\n')}
${'='.repeat(50)}
💸 إجمالي المصروفات: ${totalAmount.toLocaleString()} دج
💵 المتبقي: ${remaining.toLocaleString()} دج
`;
    
    alert(report);
  };

  const amounts = percentages.map(p => Math.round((p / 100) * totalBudget));
  const totalAmount = amounts.reduce((sum, a) => sum + a, 0);
  const remaining = totalBudget - totalAmount;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      direction: 'rtl',
      background: 'linear-gradient(135deg, #0a0d1a 0%, #1a1a3e 100%)',
      borderRadius: '30px',
      padding: '30px',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '25px 30px',
        borderRadius: '20px',
        textAlign: 'center',
        marginBottom: '25px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '60%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '36px' }}>💰</div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>حاسبة ميزانية البكالوريا</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '5px 0 0 0', fontSize: '14px' }}>
            خطط لميزانيتك الذكية للعام الدراسي
          </p>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-10px, -10px) rotate(3deg); }
          }
        `}</style>
      </div>

      {/* Total Budget Input */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <label style={{
          display: 'block',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          marginBottom: '8px',
          textAlign: 'right'
        }}>
          💰 الميزانية الإجمالية (دج):
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <input
            type="text"
            inputMode="numeric"
            value={totalBudget}
            onChange={(e) => handleBudgetChange(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              outline: 'none',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(102,126,234,0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>دج</span>
        </div>
      </div>

      {/* Sliders */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: '10px'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            📊 توزيع النسب المئوية
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
            المجموع: {percentages.reduce((sum, p) => sum + p, 0).toFixed(0)}%
          </span>
        </div>

        {categories.map((cat, index) => (
          <div key={index} style={{
            marginBottom: index === categories.length - 1 ? 0 : '15px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{
                minWidth: '160px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px'
              }}>
                {cat.name}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={percentages[index]}
                onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(90deg, ${cat.color}44, ${cat.color})`,
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  WebkitAppearance: 'none'
                }}
              />
              <span style={{
                minWidth: '50px',
                textAlign: 'center',
                color: cat.color,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {percentages[index].toFixed(0)}%
              </span>
              <span style={{
                minWidth: '100px',
                textAlign: 'left',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                direction: 'ltr'
              }}>
                {amounts[index].toLocaleString()} دج
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '3px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '2px',
              marginTop: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(percentages[index] / 100) * 100}%`,
                height: '100%',
                background: cat.color,
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>💰 المجموع</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
            {totalAmount.toLocaleString()} دج
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>💵 المتبقي</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: remaining >= 0 ? '#2ecc71' : '#e74c3c'
          }}>
            {remaining.toLocaleString()} دج
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>📊 الحالة</div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: remaining >= 0 ? '#2ecc71' : '#e74c3c'
          }}>
            {remaining >= 0 ? '✅ متوازن' : '⚠️ تجاوز'}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={resetPercentages}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #e67e22, #d35400)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(230,126,34,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🔄 إعادة تعيين النسب
        </button>

        <button
          onClick={exportBudget}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(52,152,219,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📥 تصدير التقرير
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '15px',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '20px'
      }}>
        💡 يمكنك تعديل النسب المئوية لكل فئة باستخدام شريط التمرير
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 0 20px rgba(102,126,234,0.3);
          transition: all 0.3s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(102,126,234,0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}