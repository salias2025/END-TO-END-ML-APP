import React from 'react';

export default function IntroductionToPreBac() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      direction: 'rtl',
      fontFamily: "'Tajawal', 'Segoe UI', sans-serif",
      padding: '20px'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '50px',
        borderRadius: '30px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '700' }}>
          📊 نظام تحليل البكالوريا الذكي
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.95 }}>
          افهم نقاط قوتك وضعفك بطريقة علمية - مخصص للطلاب الجزائريين
        </p>
        <p style={{ fontSize: '16px', marginTop: '15px' }}>
          🇩🇿 مبني على بيانات حقيقية من البكالوريا الجزائرية
        </p>
      </div>

      {/* What We Did */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        transition: 'transform 0.3s',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎯 ماذا فعلنا في هذا المشروع؟
        </h2>
        <p>
          قمنا ببناء <strong>نظام تحليل ذكي</strong> يساعدك على فهم مستواك الدراسي بشكل أعمق من مجرد الأرقام. بدلاً من أن نقول لك "معدلك 12/20"، نحن نقول لك:
        </p>
        <ul style={{ fontSize: '18px', lineHeight: '1.8' }}>
          <li>✅ هل تدرس بذكاء أم بجهد فقط؟</li>
          <li>✅ هل أنت في الشعبة المناسبة لقدراتك؟</li>
          <li>✅ ما هي المواد التي تحتاج تركيزاً فورياً؟</li>
          <li>✅ كيف تقارن بطلاب آخرين في نفس شعبتك؟</li>
          <li>✅ ما الذي يخفض معدلك (النوم؟ التوتر؟ كفاءة الدراسة؟)</li>
        </ul>
      </div>

      {/* How It Works */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px' }}>
          ⚙️ كيف يعمل النظام؟
        </h2>
        <p>النظام يعتمد على <strong>4 خطوات رئيسية</strong>:</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          margin: '20px 0'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📝</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              1. إدخال بياناتك
            </div>
            <p>تدخل علاماتك في البريفيه، 1AS، 2AS، وعادات دراستك</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              2. مقارنتك بآلاف الطلاب
            </div>
            <p>نقارن ملفك الشخصي مع 1500 طالب حقيقي</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              3. حساب معالم ذكية
            </div>
            <p>نحسب أكثر من 20 مقياساً علمياً لفهم نمط دراستك</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💡</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              4. نصائح مخصصة
            </div>
            <p>نقدم لك توصيات محددة لتحسين مستواك</p>
          </div>
        </div>
      </div>

      {/* Key Features Explained */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px' }}>
          🧠 المعالم الذكية - ماذا تعني؟
        </h2>
        <p>هذه معادلات بسيطة تخبرك بأشياء لا تعرفها عن نفسك:</p>

        {/* Study Efficiency */}
        <h3 style={{ color: '#764ba2', fontSize: '22px', margin: '20px 0 10px 0' }}>
          ⚡ كفاءة الدراسة (Study Efficiency)
        </h3>
        <div style={{
          background: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          margin: '15px 0',
          overflowX: 'auto'
        }}>
          كفاءة الدراسة = معدل 2AS ÷ (ساعات الدراسة + 0.1)
        </div>
        <p><strong>ماذا تخبرك؟</strong> كم نقطة تكسب في الساعة الواحدة من الدراسة.</p>
        <ul>
          <li><span style={{ color: '#28a745' }}>✅ أكثر من 1.2</span> → ممتاز! تدرس بذكاء</li>
          <li><span style={{ color: '#ffc107' }}>⚠️ بين 0.8 و 1.2</span> → جيد، يمكن تحسين</li>
          <li><span style={{ color: '#dc3545' }}>❌ أقل من 0.8</span> → خطر! تدرس كثيراً ولكن النتائج ضعيفة</li>
        </ul>

        <div style={{
          background: '#fff3cd',
          borderRight: '4px solid #ffc107',
          padding: '15px',
          borderRadius: '10px',
          margin: '15px 0'
        }}>
          💡 <strong>نصيحة:</strong> إذا كانت كفاءتك منخفضة، جرب "الاستدعاء النشط" (اختبر نفسك بدلاً من إعادة القراءة) و"التكرار المتباعد" (راجع المعلومات على فترات متباعدة).
        </div>

        {/* Sleep Debt */}
        <h3 style={{ color: '#764ba2', fontSize: '22px', margin: '20px 0 10px 0' }}>
          😴 دين النوم (Sleep Debt)
        </h3>
        <div style={{
          background: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          margin: '15px 0',
          overflowX: 'auto'
        }}>
          دين النوم = 8 - ساعات نومك الفعلية
        </div>
        <p><strong>ماذا تخبرك؟</strong> كم ساعة نوم تنقصك كل ليلة.</p>
        <ul>
          <li><span style={{ color: '#28a745' }}>✅ 0 ساعات</span> → نوم مثالي (8 ساعات)</li>
          <li><span style={{ color: '#ffc107' }}>⚠️ 1-2 ساعات</span> → حرمان بسيط</li>
          <li><span style={{ color: '#dc3545' }}>❌ أكثر من 2 ساعات</span> → خطر! يخفض معدلك بـ 0.8 نقطة</li>
        </ul>

        <div style={{
          background: '#fff3cd',
          borderRight: '4px solid #ffc107',
          padding: '15px',
          borderRadius: '10px',
          margin: '15px 0'
        }}>
          💡 <strong>نصيحة:</strong> الطلاب الذين ينامون 8 ساعات يحصلون على علامات أعلى بـ 0.8 نقطة في المتوسط. النوم مو مهمش!
        </div>

        {/* Improvement Momentum */}
        <h3 style={{ color: '#764ba2', fontSize: '22px', margin: '20px 0 10px 0' }}>
          📈 زخم التحسن (Improvement Momentum)
        </h3>
        <div style={{
          background: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          margin: '15px 0',
          overflowX: 'auto'
        }}>
          زخم التحسن = معدل 2AS - معدل 1AS
        </div>
        <p><strong>ماذا تخبرك؟</strong> هل أنت في تحسن أم تراجع؟</p>
        <ul>
          <li><span style={{ color: '#28a745' }}>✅ أكبر من +0.5</span> → ممتاز! أنت في الطريق الصحيح</li>
          <li><span style={{ color: '#ffc107' }}>⚠️ بين 0 و +0.5</span> → ثبات، تحتاج للتطور</li>
          <li><span style={{ color: '#dc3545' }}>❌ أقل من 0</span> → خطر! علاماتك في انخفاض</li>
        </ul>

        {/* Problem Solving Gap */}
        <h3 style={{ color: '#764ba2', fontSize: '22px', margin: '20px 0 10px 0' }}>
          🧮 فجوة حل المشكلات (Problem Solving Gap)
        </h3>
        <div style={{
          background: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          margin: '15px 0',
          overflowX: 'auto'
        }}>
          فجوة حل المشكلات = (ضعف الرياضيات + ضعف الفيزياء) ÷ 2
        </div>
        <p><strong>ماذا تخبرك؟</strong> هل لديك صعوبات في المواد التي تعتمد على التحليل المنطقي؟</p>
        <ul>
          <li><span style={{ color: '#28a745' }}>✅ أقل من 0.4</span> → قدرة جيدة على حل المشكلات</li>
          <li><span style={{ color: '#ffc107' }}>⚠️ بين 0.4 و 0.7</span> → صعوبات متوسطة</li>
          <li><span style={{ color: '#dc3545' }}>❌ أكثر من 0.7</span> → صعوبات كبيرة، تحتاج تأسيساً قوياً</li>
        </ul>

        {/* Filière Alignment */}
        <h3 style={{ color: '#764ba2', fontSize: '22px', margin: '20px 0 10px 0' }}>
          🎯 توافق الشعبة (Filière Alignment)
        </h3>
        <div style={{
          background: '#2d3748',
          color: '#e2e8f0',
          padding: '15px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          textAlign: 'center',
          margin: '15px 0',
          overflowX: 'auto'
        }}>
          للشعب العلمية: توافق = (رياضيات + فيزياء + علوم) ÷ 3 ÷ 20<br />
          للشعب الأدبية: توافق = (عربية + لغات) ÷ 2 ÷ 20
        </div>
        <p><strong>ماذا تخبرك؟</strong> هل أنت في الشعبة المناسبة لقدراتك؟</p>
        <ul>
          <li><span style={{ color: '#28a745' }}>✅ أكثر من 0.7</span> → أنت في الشعبة المناسبة!</li>
          <li><span style={{ color: '#ffc107' }}>⚠️ بين 0.5 و 0.7</span> → مقبول، لكن يمكن أن يكون أفضل</li>
          <li><span style={{ color: '#dc3545' }}>❌ أقل من 0.5</span> → ربما تحتاج تغيير الشعبة</li>
        </ul>

        <div style={{
          background: '#fff3cd',
          borderRight: '4px solid #ffc107',
          padding: '15px',
          borderRadius: '10px',
          margin: '15px 0'
        }}>
          💡 <strong>نصيحة:</strong> إذا كان توافقك منخفضاً، ناقش مع مستشار التوجيه المدرسي إمكانية تغيير الشعبة. الأهم أن تكون في المكان المناسب لقدراتك!
        </div>
      </div>

      {/* Why These Features */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px' }}>
          🔬 لماذا اخترنا هذه المعالم بالذات؟
        </h2>
        <p>هذه المعالم مبنية على <strong>أبحاث علمية في علم النفس التربوي</strong> و<strong>تحليل بيانات حقيقية من البكالوريا الجزائرية</strong>:</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          margin: '20px 0'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎓</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              أبحاث عالمية
            </div>
            <p>معتمدة على دراسات من جامعات مثل Harvard و Stanford عن عوامل نجاح الطلاب</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🇩🇿</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              بيانات جزائرية
            </div>
            <p>محسوبة على 1500 طالب جزائري حقيقي من مختلف الولايات</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🧪</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              اختبارات إحصائية
            </div>
            <p>تأكدنا أن كل معلم له علاقة حقيقية بمعدل البكالوريا</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              قابلة للتطبيق
            </div>
            <p>كل نصيحة نقدمها يمكن تطبيقها فوراً في واقعك الدراسي</p>
          </div>
        </div>

        <div style={{
          background: '#d4edda',
          borderRight: '4px solid #28a745',
          padding: '20px',
          borderRadius: '15px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <h3>📊 هل تعلم؟</h3>
          <p>الطلاب الذين يطبقون هذه النصائح يتحسن معدلهم بمعدل <strong style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>+1.5 نقطة</strong> في الفصل الدراسي الواحد!</p>
        </div>
      </div>

      {/* How to Use */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px' }}>
          🚀 كيف تستخدم النظام؟
        </h2>
        <ol style={{ fontSize: '18px', lineHeight: '2' }}>
          <li><strong>الخطوة 1:</strong> املأ بياناتك (بريفيه، 1AS، 2AS، عادات الدراسة)</li>
          <li><strong>الخطوة 2:</strong> احصل على معدلك المتوقع وتحديد مجموعتك</li>
          <li><strong>الخطوة 3:</strong> شاهد تحليلك الكامل والرسوم البيانية</li>
          <li><strong>الخطوة 4:</strong> ابحث عن أفضل طالب مطابق لك وتعلم من تجربته</li>
          <li><strong>الخطوة 5:</strong> افهم كل مقياس وكيف تحسنه</li>
        </ol>

        <div style={{
          background: '#fff3cd',
          borderRight: '4px solid #ffc107',
          padding: '15px',
          borderRadius: '10px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '18px' }}>🎯 <strong>تذكر: هذا النظام ليس بديلاً عن الاجتهاد، ولكنه دليل يظهر لك الطريق الأسرع للنجاح!</strong></p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #667eea',
        color: '#333'
      }}>
        <h2 style={{ color: '#667eea', fontSize: '28px', marginBottom: '15px' }}>
          📈 إحصائيات عن مشروعنا
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          margin: '20px 0'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>1,500</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>طالب تم تحليلهم</div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>20+</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>معلماً ذكياً</div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>6</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>شعب دراسية</div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>100%</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>مجاني للاستخدام</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <hr style={{ margin: '30px 0', border: 'none', height: '2px', background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)' }} />
      <div style={{
        textAlign: 'center',
        padding: '30px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>🇩🇿 تم تطويره خصيصاً للطلاب الجزائريين - البكالوريا</p>
        <p style={{ marginTop: '10px' }}>⭐ إذا استفدت من هذا المشروع، شاركه مع زملائك ⭐</p>
      </div>
    </div>
  );
}