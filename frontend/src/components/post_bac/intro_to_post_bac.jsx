// frontend/src/components/post_bac/intro_to_post_bac.jsx

import React from 'react';

export default function IntroToPostBac({ onNext }) {
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
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '50px',
        borderRadius: '30px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: '700' }}>
          🎓 نظام التوجيه الجامعي الذكي
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.95 }}>
          اكتشف مسارك الجامعي المناسب بعد البكالوريا
        </p>
        <p style={{ fontSize: '16px', marginTop: '15px' }}>
          🇩🇿 مبني على النظام التعليمي الجزائري - بيانات حقيقية وتوصيات مخصصة
        </p>
      </div>

      {/* Why This System */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #e74c3c',
        color: '#333'
      }}>
        <h2 style={{ color: '#e74c3c', fontSize: '28px', marginBottom: '15px' }}>
          💡 لماذا هذا النظام؟
        </h2>
        <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
          بعد 13 سنة من الدراسة، كثير من الطلاب يجدون أنفسهم في حيرة عند اختيار التخصص الجامعي. 
          بعضهم قضى سنواته الدراسية <strong>يجري خلف العلامات</strong> لإثبات قيمته لعائلته، 
          ليكتشف أنه لا يعرف ماذا يريد أن يصبح. 
          والبعض الآخر يعاني لأنه <strong>لا يعرف ميوله</strong> أو ليس لديه اهتمام معين.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.8', marginTop: '10px' }}>
          هذا النظام جاء <strong>ليحل هذه المشكلة</strong>، من خلال:
        </p>
        <ul style={{ fontSize: '18px', lineHeight: '1.8' }}>
          <li>✅ تحليل ملفك الدراسي بالكامل</li>
          <li>✅ اقتراح التخصصات الجامعية المناسبة لك</li>
          <li>✅ شرح كل مسار دراسي بالتفصيل</li>
          <li>✅ مقارنة فرص قبولك حسب معدلك وشعبتك</li>
        </ul>
      </div>

      {/* Higher Education System Overview */}
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
          📚 نظام التعليم العالي في الجزائر
        </h2>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: '20px' }}>
          يشرف على نظام التعليم العالي الجزائري <strong>وزارة التعليم العالي والبحث العلمي (MESRS)</strong>. 
          ينقسم النظام إلى <strong>11 مجالاً أكاديمياً رئيسياً</strong>:
        </p>

        {/* 11 Domains Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
          margin: '20px 0'
        }}>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #3498db',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🔬</span>
            <span><strong>العلوم والتكنولوجيا (ST)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #9b59b6',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>💻</span>
            <span><strong>الرياضيات والإعلام الآلي (MI)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #e74c3c',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🏥</span>
            <span><strong>الطب والطب المساعد</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #2ecc71',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🧬</span>
            <span><strong>علوم الطبيعة والحياة (SNV)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #f39c12',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <span><strong>الاقتصاد والتسيير والتجارة (SEGC)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #8e44ad',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>⚖️</span>
            <span><strong>الحقوق والعلوم السياسية (DSP)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #1abc9c',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🧠</span>
            <span><strong>العلوم الإنسانية والاجتماعية (SHS)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #e67e22',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>📖</span>
            <span><strong>اللغة العربية وآدابها (LLA)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #3498db',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🌍</span>
            <span><strong>اللغات الأجنبية (LLE)</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #27ae60',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🕌</span>
            <span><strong>العلوم الإسلامية</strong></span>
          </div>
          <div style={{
            background: '#f0f4ff',
            padding: '15px',
            borderRadius: '12px',
            borderRight: '4px solid #e74c3c',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '28px' }}>🎨</span>
            <span><strong>الفنون والثقافة والرياضة (STAPS)</strong></span>
          </div>
        </div>

        <p style={{ fontSize: '16px', color: '#555', marginTop: '15px' }}>
          يمكن للطلاب الالتحاق بهذه المجالات عبر <strong>عدة مسارات تعليمية</strong>، كل منها مصمم لأهداف أكاديمية ومهنية مختلفة:
        </p>
      </div>

      {/* Educational Pathways */}
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
          🛤️ المسارات التعليمية في الجزائر
        </h2>

        {/* LMD System */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          borderRight: '4px solid #3498db'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: '36px' }}>📜</span>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>نظام LMD (ليسانس - ماستر - دكتوراه)</h3>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', margin: '10px 0', color: '#555' }}>
            <strong>المسار الأكثر شيوعاً</strong>، تعتمده غالبية الجامعات الجزائرية. 
            يتميز بهيكل <strong>موحد قائم على النقاط</strong> (السنة ب 60 نقطة، 3 سنوات ليسانس، 2 سنوات ماستر).
          </p>
          <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
            <li>✅ <strong>الليسانس:</strong> 3 سنوات (180 نقطة)</li>
            <li>✅ <strong>الماستر:</strong> 2 سنوات (120 نقطة إضافية)</li>
            <li>✅ <strong>الدكتوراه:</strong> 3 سنوات بعد الماستر</li>
          </ul>
          <div style={{
            background: '#d4edda',
            padding: '10px 15px',
            borderRadius: '8px',
            marginTop: '10px',
            borderRight: '4px solid #28a745'
          }}>
            <span style={{ fontSize: '14px' }}>🎯 <strong>مناسب لـ:</strong> أغلب التخصصات الجامعية (الآداب، العلوم الإنسانية، الاقتصاد، الحقوق، وغيرها)</span>
          </div>
        </div>

        {/* Engineering Schools */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #fef3e2 100%)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          borderRight: '4px solid #e67e22'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: '36px' }}>⚙️</span>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>المدارس الوطنية العليا (Écoles Supérieures)</h3>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', margin: '10px 0', color: '#555' }}>
            <strong>مسار النخبة في الهندسة</strong>. تتطلب هذه المدارس <strong>سنتين تحضيريتين</strong> تليها <strong>مسابقة وطنية صارمة</strong>، ثم 3 سنوات تكوين في الهندسة.
          </p>
          <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
            <li>✅ <strong>سنتان تحضيريتان:</strong> تكوين مكثف في المواد الأساسية</li>
            <li>✅ <strong>مسابقة وطنية:</strong> تنافس شديد للالتحاق بالمدارس</li>
            <li>✅ <strong>3 سنوات تكوين:</strong> تخصص متقدم في الهندسة</li>
            <li>✅ <strong>شهادة معترف بها:</strong> تعادل شهادة الماستر</li>
          </ul>
          <div style={{
            background: '#fff3cd',
            padding: '10px 15px',
            borderRadius: '8px',
            marginTop: '10px',
            borderRight: '4px solid #ffc107'
          }}>
            <span style={{ fontSize: '14px' }}>🎯 <strong>مناسب لـ:</strong> الطلاب المتميزين الذين يطمحون لمهن الهندسة (إعلام آلي، كهرباء، ميكانيك، مدني، وغيرها)</span>
          </div>
        </div>

        {/* ENS */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #f0e6ff 100%)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          borderRight: '4px solid #9b59b6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: '36px' }}>👨‍🏫</span>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>المدارس العليا للأساتذة (ENS)</h3>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', margin: '10px 0', color: '#555' }}>
            <strong>مسار تكوين أساتذة المستقبل</strong> للتعليم الوطني. تخرج هذه المدارس <strong>أساتذة مؤهلين</strong> للتدريس في مختلف المراحل التعليمية.
          </p>
          <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
            <li>✅ <strong>تكوين أكاديمي وبيداغوجي</strong> متكامل</li>
            <li>✅ <strong>مرتبة الشرف</strong> في الدراسة</li>
            <li>✅ <strong>توظيف مباشر</strong> بعد التخرج في وزارة التربية الوطنية</li>
          </ul>
          <div style={{
            background: '#d4edda',
            padding: '10px 15px',
            borderRadius: '8px',
            marginTop: '10px',
            borderRight: '4px solid #28a745'
          }}>
            <span style={{ fontSize: '14px' }}>🎯 <strong>مناسب لـ:</strong> الطلاب الذين يطمحون لمهنة التدريس (اللغة العربية، الرياضيات، الفيزياء، التاريخ، وغيرها)</span>
          </div>
        </div>

        {/* Medical/Long Cycle */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #fce4ec 100%)',
          borderRadius: '15px',
          padding: '20px',
          borderRight: '4px solid #e74c3c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ fontSize: '36px' }}>🏥</span>
            <h3 style={{ margin: 0, color: '#2c3e50' }}>القطاع شبه الطبي والطبي (Cycle Long)</h3>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.8', margin: '10px 0', color: '#555' }}>
            <strong>مسار التخصصات الصحية</strong> الذي يختلف عن نظام LMD. يتبع <strong>نظام التكوين الطويل (Cycle Long)</strong>.
          </p>
          <ul style={{ fontSize: '15px', lineHeight: '1.8', color: '#555' }}>
            <li>✅ <strong>الطب:</strong> 7 سنوات</li>
            <li>✅ <strong>الصيدلة:</strong> 6 سنوات</li>
            <li>✅ <strong>طب الأسنان:</strong> 6 سنوات</li>
            <li>✅ <strong>شبه طبي:</strong> 3 سنوات (تمريض، مخبر، إعادة تأهيل، تصوير طبي، تغذية، قبالة)</li>
          </ul>
          <div style={{
            background: '#fff3cd',
            padding: '10px 15px',
            borderRadius: '8px',
            marginTop: '10px',
            borderRight: '4px solid #ffc107'
          }}>
            <span style={{ fontSize: '14px' }}>🎯 <strong>مناسب لـ:</strong> الطلاب المهتمين بمهن الصحة والطب</span>
          </div>
        </div>
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
          🚀 كيف يعمل نظام التوجيه؟
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              1. تحليل بياناتك
            </div>
            <p>ندخل معدلك، شعبتك، وموادك المفضلة</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              2. الذكاء الاصطناعي
            </div>
            <p>نستخدم نموذج تعلم آلي لتوقع أفضل التخصصات لك</p>
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
              3. التوصيات
            </div>
            <p>نقدم لك قائمة بالتخصصات المناسبة مع شروط القبول</p>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '10px' }}>
              4. التفاصيل الكاملة
            </div>
            <p>شاهد المدة، نوع التوظيف، والمؤسسات المتاحة</p>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>
          🎯 لماذا هذا النظام مهم؟
        </h2>
        <p style={{ fontSize: '18px', lineHeight: '1.8', opacity: 0.95 }}>
          لأن اختيار التخصص الجامعي هو <strong>أحد أهم القرارات في حياتك</strong>.
          هذا النظام يساعدك على <strong>اتخاذ قرار مستنير</strong>، مبني على بياناتك الشخصية وتحليل علمي دقيق.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: '36px' }}>📊</span>
            <p>11 مجالاً أكاديمياً</p>
          </div>
          <div>
            <span style={{ fontSize: '36px' }}>🏛️</span>
            <p>4 مسارات تعليمية</p>
          </div>
          <div>
            <span style={{ fontSize: '36px' }}>🎯</span>
            <p>توصيات مخصصة</p>
          </div>
        </div>
      </div>

      {/* Stats */}
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
          📈 إحصائيات النظام
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>11</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>مجالاً أكاديمياً</div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>4</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>مسارات تعليمية</div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>150+</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>تخصصاً جامعياً</div>
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

      {/* Call to Action */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
        borderRight: '5px solid #28a745',
        color: '#333',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#28a745', fontSize: '28px', marginBottom: '15px' }}>
          🚀 جاهز لاكتشاف مستقبلك الجامعي؟
        </h2>
        <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
          أدخل بياناتك الآن واحصل على <strong>توصيات مخصصة</strong> لمسارك الجامعي المناسب.
        </p>
        <button
          onClick={onNext}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '15px 50px',
            borderRadius: '30px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(102,126,234,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
          }}
        >
          🚀 ابدأ التحليل الآن
        </button>
      </div>

      {/* Footer */}
      <hr style={{ margin: '30px 0', border: 'none', height: '2px', background: 'linear-gradient(90deg, #1e3c72, #2a5298, #1e3c72)' }} />
      <div style={{
        textAlign: 'center',
        padding: '30px',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>🇩🇿 تم تطويره خصيصاً للطلاب الجزائريين - التوجيه الجامعي</p>
        <p style={{ marginTop: '10px' }}>⭐ مستقبلك يبدأ من هنا - اختر بوعي ⭐</p>
      </div>
    </div>
  );
}