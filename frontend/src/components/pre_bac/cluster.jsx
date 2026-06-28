import React from 'react';
import RadarChart from './RadarChart';
import HabitsChart from './HabitsChart';

export default function Cluster({ studentData, results }) {
  // If no results, show a message
  if (!results) {
    return (
      <div style={{
        background: '#f8d7da',
        color: '#721c24',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h2>⏳ لم تقم بإدخال بياناتك بعد!</h2>
        <p>الرجاء إدخال بياناتك في النموذج أولاً.</p>
        <ol style={{ display: 'inline-block', textAlign: 'right', color: '#721c24' }}>
          <li>أدخل معلوماتك في النموذج</li>
          <li>اضغط على زر "تحليل ملفي الشخصي"</li>
          <li>ستظهر النتائج هنا</li>
        </ol>
      </div>
    );
  }

  const {
    predicted_bac,
    cluster_id,
    cluster_bac_mean,
    filiere_code,
    filiere_name,
    mention,
    emoji
  } = results;

  // Helper function to get cluster description
  const getClusterDescription = (filiere, clusterId, bacAvg) => {
    let greeting = '';
    if (bacAvg >= 16) {
      greeting = '🎉 ماشاء الله تبارك الرحمن! مستوىك ممتاز 👏';
    } else if (bacAvg >= 14) {
      greeting = '👍 مستوىك جيد جداً، مع شوية تركيز توصل للامتياز إن شاء الله';
    } else if (bacAvg >= 12) {
      greeting = '📚 مستوىك مقبول، ولكن لازم تزيد شوية في المجهود';
    } else if (bacAvg >= 10) {
      greeting = '⚠️ مستوىك على الحافة، تحتاج تراجع طريقة دراستك بسرعة';
    } else {
      greeting = '🚨 مستوىك أقل من المعدل المطلوب، لازم تدخل في برنامج تقوية عاجل';
    }

    // Cluster descriptions
    const descriptions = {
      'sciences_experimentales': {
        0: {
          title: '🟢 أنت في المجموعة الممتازة',
          details: 'أنت من الأوائل في شعبة العلوم التجريبية. مستواك فوق 17/20، متفوق في الرياضيات والفيزياء والعلوم.',
          strengths: 'فهم عميق للمفاهيم العلمية، قدرة عالية على حل التمارين المعقدة، عادات دراسة فعالة ومنظمة.',
          advice: 'حافظ على مستواك وركز شوية على المواد الأدبية عشان تجيب مجموع خرافي.'
        },
        1: {
          title: '🔵 أنت في المجموعة الجيد جداً',
          details: 'مستواك فوق المتوسط (بين 15.5 و 17). عندك قاعدة قوية في المواد العلمية، تقدر توصل للامتياز بشوية تركيز.',
          strengths: 'أساس متين في المواد الرئيسية، فهم جيد للمفاهيم.',
          advice: 'خصص 60% من وقت دراستك للمواد اللي تحس فيها ضعف. حل تمارين إضافية في الرياضيات والفيزياء.'
        },
        2: {
          title: '🟡 أنت في المجموعة الجيدة',
          details: 'مستواك جيد (بين 13.5 و 15.5). عندك قدرات لكن محتاج تنظيم أفضل.',
          strengths: 'فهم جيد للمواد، قدرة على التحليل.',
          advice: 'ركز على فهم المفاهيم قبل حفظها، حل تمارين متنوعة، نظم وقتك بين المواد.'
        },
        3: {
          title: '🟠 أنت في المجموعة المقبولة',
          details: 'مستواك على الحدود (بين 11.5 و 13.5). تحتاج تشتغل بجدية أكبر.',
          strengths: 'بعض الفهم للمواد الأساسية.',
          advice: 'ابدأ بالتركيز على المواد اللي تقد ترفع فيها معدل بسرعة. خصص وقت ثابت يومياً للمراجعة.'
        },
        4: {
          title: '🔴 أنت في مجموعة الخطر (تحتاج تدخل عاجل)',
          details: 'مستواك أقل من 11.5. معرض للرسوب في البكالوريا.',
          strengths: 'تحتاج دعم كبير.',
          advice: 'اطلب المساعدة من الأساتذة، خصص 3 ساعات يومياً للمراجعة المركزة، ابدأ من الأساسيات.'
        },
        5: {
          title: '⚫ وضع حرج - تغيير جذري مطلوب',
          details: 'مستواك ضعيف جداً (أقل من 9). خطر كبير على نجاحك في البكالوريا.',
          strengths: 'تحتاج تغيير كامل في طريقة الدراسة.',
          advice: 'دروس دعم خصوصية مكثفة، مراجعة يومية إلزامية (4 ساعات على الأقل)، متابعة مع أستاذ.'
        }
      },
      'maths': {
        0: {
          title: '🟢 أنت عبقري في الرياضيات! (المجموعة الممتازة)',
          details: 'مستواك فوق 17.5/20، قدرات استثنائية في حل المسائل.',
          strengths: 'تفكير منطقي عالي، قدرة على حل المسائل المعقدة.',
          advice: 'شارك في المسابقات، حل مسائل متقدمة خارج المنهج.'
        },
        1: {
          title: '🟡 أنت في المجموعة الجيدة',
          details: 'مستواك بين 14.5 و 17.5، أساس متين في الرياضيات.',
          strengths: 'فهم جيد للمفاهيم الأساسية.',
          advice: 'حل 10 مسائل إضافية أسبوعياً. التركيز على المسائل المعقدة.'
        },
        2: {
          title: '🔴 أنت في المجموعة الضعيفة - تحذير!',
          details: 'مستواك أقل من 14.5، صعوبات في فهم المفاهيم الأساسية.',
          strengths: 'تحتاج إعادة تأسيس.',
          advice: 'ابدأ من الأساسيات، اطلب دروس دعم خصوصية، حل تمارين سهلة ثم تدرج للصعب.'
        }
      }
    };

    // Default for other streams
    let clusterDesc = descriptions[filiere]?.[clusterId];
    if (!clusterDesc) {
      return {
        title: `🟡 المجموعة ${clusterId}`,
        details: `مستواك: ${bacAvg.toFixed(1)}/20`,
        strengths: 'راجع تفاصيل المواد لتعرف نقاط قوتك وضعفك.',
        advice: 'حسن كفاءة دراستك وركز على المواد الأضعف.',
        greeting
      };
    }

    return {
      ...clusterDesc,
      greeting
    };
  };

  const clusterInfo = getClusterDescription(filiere_code, cluster_id, predicted_bac);

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <h1 style={{ fontSize: '32px' }}>🎓 مرحلاً بك في نظام تحليل البكالوريا</h1>
        <p style={{ fontSize: '18px' }}>هذا النظام يساعدك تعرف:</p>
        <ul style={{ textAlign: 'right', display: 'inline-block', color: 'white' }}>
          <li>📊 معدلك المتوقع في البكالوريا</li>
          <li>🏷️ أي مجموعة تنتمي إليها بين الطلاب</li>
          <li>💪 نقاط قوتك وضعفك في المواد</li>
          <li>📚 كيف تحسن عادات دراستك</li>
        </ul>
        <p>👇 النتائج الخاصة بك 👇</p>
      </div>

      <div style={{ borderTop: '2px solid #667eea', margin: '20px 0' }} />

      {/* Predicted Grade Card */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <h2>{emoji || '🎯'} معدلك المتوقع في البكالوريا {emoji || '🎯'}</h2>
        <div style={{ fontSize: '72px', fontWeight: 'bold' }}>{predicted_bac.toFixed(1)}/20</div>
        <h3>{mention || 'جيد'}</h3>
        <p>🎯 هذا التنبؤ مبني على علاماتك وعادات دراستك اللي أدخلتها</p>
        <hr style={{ margin: '15px 0', border: '1px solid rgba(255,255,255,0.3)' }} />
        <p>📊 <strong>ملاحظة:</strong> هذا تقدير وليس وحي. اجتهادك هو اللي يحدد نتيجتك النهائية إن شاء الله</p>
      </div>

      {/* Cluster Info Card */}
      <div style={{
        background: '#e8f4f8',
        padding: '20px',
        borderRadius: '20px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#333' }}>🏷️ مجموعتك: {filiere_name || filiere_code} - المجموعة {cluster_id}</h2>
        <p style={{ color: '#333' }}>📊 متوسط معدل طلاب مجموعتك: <strong style={{ color: '#667eea' }}>{cluster_bac_mean.toFixed(1)}/20</strong></p>
        <p style={{ color: '#333' }}>👥 مجموعتك فيها طلاب عندهم نفس مستواك تقريباً</p>
      </div>

      {/* Cluster Description */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '25px',
        borderRadius: '20px',
        margin: '20px 0'
      }}>
        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '15px',
          marginBottom: '15px'
        }}>
          <h3 style={{ color: '#333' }}>📊 {clusterInfo.greeting}</h3>
          <p style={{ color: '#333' }}><strong>معدلك المتوقع:</strong> <span style={{ color: '#667eea' }}>{predicted_bac.toFixed(1)}/20</span></p>
          <p style={{ color: '#333' }}><strong>الشعبة:</strong> {filiere_name || filiere_code}</p>
        </div>

        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '15px'
        }}>
          <h3 style={{ color: '#333' }}>{clusterInfo.title}</h3>
          <p style={{ color: '#333' }}><strong>ماذا يعني هذا؟</strong></p>
          <p style={{ color: '#333' }}>{clusterInfo.details}</p>
          <p style={{ color: '#333' }}><strong>نقاط قوتك:</strong></p>
          <p style={{ color: '#333' }}>{clusterInfo.strengths}</p>
          <p style={{ color: '#333' }}><strong>نصيحتي لك:</strong></p>
          <p style={{ color: '#333' }}>{clusterInfo.advice}</p>
        </div>
      </div>

      {/* Graph Guide */}
      <div style={{
        background: '#e8f4f8',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0'
      }}>
        <h2 style={{ color: '#333' }}>📖 📊 كيف تقرأ الرسوم البيانية؟</h2>

        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '15px'
        }}>
          <h3 style={{ color: '#333' }}>🕸️ الرسم البياني الأول: شبكة العنكبوت (المقارنة في المواد)</h3>
          <ul style={{ color: '#333' }}>
            <li><span style={{ color: '#667eea', fontWeight: 'bold' }}>الخط الأزرق</span> = أداؤك أنت</li>
            <li><span style={{ color: '#f39c12', fontWeight: 'bold' }}>الخط البرتقالي</span> = متوسط أداء طلاب مجموعتك</li>
            <li><strong style={{ color: '#333' }}>قاعدة بسيطة:</strong> <span style={{ color: '#333' }}>كلما كان الخط الأزرق خارج الخط البرتقالي (أبعد من المركز)، هذا يعني أنك أفضل من مجموعتك في تلك المادة 👍</span></li>
          </ul>
        </div>

        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#333' }}>📊 الرسم البياني الثاني: مقارنة عادات الدراسة</h3>
          <ul style={{ color: '#333' }}>
            <li><span style={{ color: '#667eea', fontWeight: 'bold' }}>الأعمدة الزرقاء</span> = عاداتك الحالية</li>
            <li><span style={{ color: '#2ecc71', fontWeight: 'bold' }}>الأعمدة الخضراء</span> = الأهداف المثالية</li>
            <li><strong style={{ color: '#333' }}>كيف تقرأ:</strong> <span style={{ color: '#333' }}>كلما كان العمود الأزرق قريب من العمود الأخضر، هذا يعني أن عاداتك جيدة ✅</span></li>
          </ul>
        </div>

        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '15px'
        }}>
          <p style={{ color: '#333' }}>💡 <strong>خلاصة:</strong> إذا كان أداؤك أقل من مجموعتك في مادة معينة → ركز عليها أكثر. إذا كانت كفاءة دراستك منخفضة → قلل ساعات الدراسة وركز على جودة المذاكرة.</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        border: '1px solid #eee'
      }}>
        <RadarChart 
          studentData={studentData} 
          clusterData={{
            math: cluster_bac_mean * 0.95,
            physics: cluster_bac_mean * 0.95,
            science: cluster_bac_mean * 0.95,
            arabic: cluster_bac_mean * 0.85,
            langues: cluster_bac_mean * 0.85
          }}
        />
      </div>

      {/* Study Habits Chart */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        border: '1px solid #eee'
      }}>
        <HabitsChart studentData={studentData} />
      </div>

      {/* Encouragement */}
      <div style={{
        background: '#d4edda',
        padding: '20px',
        borderRadius: '15px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#333' }}>💪 تذكر دائماً 💪</h3>
        <p style={{ color: '#333' }}>التنبؤات مجرد تقديرات. النجاح الحقيقي يبدأ من:</p>
        <ul style={{ display: 'inline-block', textAlign: 'right', color: '#333' }}>
          <li>✅ الاجتهاد والمثابرة</li>
          <li>✅ تنظيم الوقت</li>
          <li>✅ الدعاء والتوكل على الله</li>
          <li>✅ عدم اليأس مهما كانت النتائج</li>
        </ul>
        <p style={{ marginTop: '15px', color: '#333' }}>🎯 <strong>أنت قادر على تحقيق الأفضل إن شاء الله!</strong> 🎯</p>
      </div>

      {/* Next Steps */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '15px',
        margin: '20px 0'
      }}>
        <p style={{ color: '#333' }}>📌 <strong>الخطوة التالية:</strong> ابحث عن أفضل طالب مطابق لك لتتعرف على تفاصيل أكثر.</p>
      </div>
    </div>
  );
}