// src/bac_year/arabic.jsx
import React, { useState } from 'react';
import ExamStructure from '../components/bac_year/exam_structure';
import InputForm from '../components/bac_year/input_form';
import Prediction from '../components/bac_year/prediction';
import Weaknesses from '../components/bac_year/weaknesses';
import DerivedFeatures from '../components/bac_year/derived_features';
import Simulation from '../components/bac_year/simulation';
import FinalReport from '../components/bac_year/final_report';

// ============================================
// API BASE URL
// ============================================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ============================================
// GET AUTH TOKEN
// ============================================
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Arabic subject specific data
const subjectData = {
  id: 'arabic',
  name: '📖 اللغة العربية وآدابها',
  icon: '📖',
  examDuration: '2h30',
  totalPoints: 20,
  
  derivedFeatures: [
    {
      id: 'language_core',
      name: '📖 المستوى اللغوي العام',
      description: 'يقيس مهاراتك في القواعد النحوية والفهم والاستيعاب.',
      improvement: 'ركز على تحسين القواعد والفهم من خلال قراءة النصوص المتنوعة',
      calculate: (data) => (data.grammar || 0 + data.comprehension || 0) / 2,
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'analysis_score',
      name: '📚 مهارة التحليل الأدبي',
      description: 'يقيس مهاراتك في تحليل الشعر وتحليل النثر.',
      improvement: 'ركز على تحليل الشعر والنثر، اقرأ نصوصاً متنوعة',
      calculate: (data) => (data.poetry || 0 + data.prose || 0) / 2,
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      description: 'يقيس مدى اجتهادك في حل امتحانات البكالوريا السابقة.',
      improvement: 'حل امتحان بكالوريا كل أسبوع واكتب مقالاً واحداً أسبوعياً',
      calculate: (data) => {
        const essays = data.essays_per_week || 0;
        const exams = data.exams_practiced || 0;
        return (essays * 2 + exams / 3) / 2;
      },
      target: 6.0,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      description: 'يقيس مدى التوازن بين مهاراتك الست.',
      improvement: 'حدد المهارات الضعيفة وركز عليها بشكل مكثف',
      calculate: (data) => {
        const skills = [
          data.grammar || 0,
          data.essay || 0,
          data.poetry || 0,
          data.prose || 0,
          data.rhetoric || 0,
          data.comprehension || 0
        ];
        const avg = skills.reduce((a, b) => a + b, 0) / skills.length;
        const variance = skills.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / skills.length;
        return variance;
      },
      target: 0.5,
      max: 5,
      importance: 'medium',
      isSpecial: true
    }
  ],
  
  examStructure: {
    title: '📖 امتحان البكالوريا - اللغة العربية وآدابها',
    streams: [
      {
        name: '🧪 الشعب العلمية (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد)',
        color: '#3498db',
        exercises: [
          { name: 'البناء الفكري', content: 'تحليل النصوص، استخراج الأفكار، الفهم', points: '9 نقاط (45%)' },
          { name: 'البناء اللغوي', content: 'القواعد، الصرف، البلاغة', points: '8 نقاط (40%)' },
          { name: 'التعبير الكتابي', content: 'كتابة المقال، التنظيم، الحجاج', points: '3 نقاط (15%)' }
        ]
      },
      {
        name: '📖 الشعب الأدبية (آداب وفلسفة، لغات أجنبية)',
        color: '#9b59b6',
        exercises: [
          { name: 'البناء الفكري', content: 'تحليل النصوص، استخراج الأفكار، الفهم', points: '10 نقاط (50%)' },
          { name: 'البناء اللغوي', content: 'القواعد، الصرف، البلاغة', points: '6 نقاط (30%)' },
          { name: 'البناء النقدي', content: 'تحليل نقدي، كتابة مقال، الحجاج', points: '4 نقاط (20%)' }
        ]
      }
    ]
  },
  
  skills: {
    grammar: { name: '📖 القواعد النحوية', target: 7.0, importance: 'high', weight: '30-35%' },
    essay: { name: '✍️ التعبير الكتابي (المقال)', target: 6.5, importance: 'medium', weight: '20-25%' },
    poetry: { name: '📝 تحليل الشعر', target: 7.5, importance: 'high', weight: '35-40%' },
    prose: { name: '📚 تحليل النثر', target: 6.5, importance: 'medium', weight: '20-25%' },
    rhetoric: { name: '🎭 البلاغة (الصور البيانية)', target: 7.0, importance: 'high', weight: '25-30%' },
    comprehension: { name: '📖 الفهم والاستيعاب', target: 6.5, importance: 'medium', weight: '20-25%' }
  },
  
  habits: {
    exams_practiced: { name: '📚 امتحانات البكالوريا المحلولة', target: 10, max: 20 },
    essays_per_week: { name: '✍️ المقالات الأسبوعية', target: 3, max: 5 },
    study_hours: { name: '⏰ ساعات الدراسة الأسبوعية', target: 6, max: 12 },
    consistency: { name: '📅 الانتظام في الدراسة', target: 4, max: 5 },
    tutoring: { name: '🧑‍🏫 معلم خصوصي', target: 1, max: 1 },
    participation: { name: '🗣️ المشاركة في القسم', target: 4, max: 5 }
  },
  
  psychological: {
    confidence: { name: '💪 الثقة بالنفس', target: 4, max: 5, isNegative: false },
    stress: { name: '😰 مستوى التوتر', target: 3, max: 5, isNegative: true },
    interest: { name: '❤️ الاهتمام بالمادة', target: 4, max: 5, isNegative: false }
  },
  
  tips: [
    '📖 ركز على تحليل الشعر - يمثل 35-40% من نقاط البكالوريا!',
    '🎭 تدرب على البلاغة - الاستعارات والتشبيهات أساسية في الامتحان',
    '📚 راجع القواعد النحوية أسبوعياً - النحو أساس اللغة العربية',
    '✍️ اكتب مقالاً واحداً على الأقل أسبوعياً لتحسين أسلوبك',
    '📝 حل امتحانات بكالوريا سابقة للتعود على نمط الأسئلة',
    '📅 خصص ساعة يومياً للغة العربية بدلاً من المذاكرة المكثفة'
  ],
  
  importance: [
    { skill: 'تحليل الشعر', weight: '35-40%', color: '#e74c3c' },
    { skill: 'البلاغة', weight: '25-30%', color: '#e67e22' },
    { skill: 'القواعد النحوية', weight: '30-35%', color: '#f1c40f' },
    { skill: 'تحليل النثر', weight: '20-25%', color: '#2ecc71' },
    { skill: 'التعبير الكتابي', weight: '20-25%', color: '#3498db' },
    { skill: 'الفهم والاستيعاب', weight: '20-25%', color: '#9b59b6' }
  ],
  
  theme: {
    primary: '#2a5298',
    secondary: '#1e3c72',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  }
};

// ============================================
// COMPONENT
// ============================================
export default function Arabic() {
  const [step, setStep] = useState('exam_structure');
  const [formData, setFormData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // LOCAL FALLBACK PREDICTION
  // ============================================
  const localCalculate = (data) => {
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    const poetryWeight = 0.18;
    const rhetoricWeight = 0.15;
    const grammarWeight = 0.15;
    const proseWeight = 0.12;
    const comprehensionWeight = 0.10;
    const essayWeight = 0.10;
    
    const weightedSkills = 
      (data.poetry || 5) * poetryWeight +
      (data.rhetoric || 5) * rhetoricWeight +
      (data.grammar || 5) * grammarWeight +
      (data.prose || 5) * proseWeight +
      (data.comprehension || 5) * comprehensionWeight +
      (data.essay || 5) * essayWeight;
    
    const totalWeight = poetryWeight + rhetoricWeight + grammarWeight + proseWeight + comprehensionWeight + essayWeight;
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    const practiceScore = Math.min(10,
      (data.exams_practiced || 5) / 20 * 10 * 0.4 +
      (data.essays_per_week || 2) / 5 * 10 * 0.3 +
      (data.study_hours || 5) / 12 * 10 * 0.3
    );
    
    const psychScore = (
      (data.confidence || 3) / 5 * 10 * 0.4 +
      (10 - (data.stress || 3) / 5 * 10) * 0.3 +
      (data.interest || 3) / 5 * 10 * 0.3
    );
    
    const rawScore = (
      avgGrade * 0.15 +
      weightedSkillsScore * 0.55 +
      practiceScore * 0.20 +
      psychScore * 0.10
    ) * 2;
    
    const finalScore = Math.min(20, Math.max(0, rawScore));
    const prob = Math.min(100, Math.max(0, (finalScore - 5) / 15 * 100));
    const improvement = Math.min(6, (20 - finalScore) * 0.4);
    
    return {
      predicted_score: Math.round(finalScore * 10) / 10,
      success_probability: Math.round(prob),
      improvement_potential: Math.round(improvement * 10) / 10
    };
  };

  // ============================================
  // API CALL: PREDICT
  // ============================================
  const callPredict = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('الرجاء تسجيل الدخول أولاً');
      }

      const response = await fetch(`${API_URL}/api/bacyear/arabic/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        const apiData = result.data;
        
        const mappedPrediction = {
          score: apiData.prediction?.predicted_score ?? 0,
          prob: apiData.prediction?.success_probability ?? 0,
          improvement: apiData.prediction?.improvement_potential ?? 0
        };
        
        return {
          prediction: mappedPrediction,
          derived_features: apiData.derived_features,
          weaknesses: apiData.weaknesses
        };
      } else {
        throw new Error(result.message || 'حدث خطأ في التنبؤ');
      }
    } catch (error) {
      console.error('❌ Prediction API error:', error);
      const fallback = localCalculate(data);
      return {
        prediction: {
          score: fallback.predicted_score,
          prob: fallback.success_probability,
          improvement: fallback.improvement_potential
        },
        derived_features: null,
        weaknesses: null
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================
  const handleSubmit = async (data) => {
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      setStep('prediction');
    } catch (error) {
      setError(error.message);
      const fallback = localCalculate(data);
      setPrediction({
        score: fallback.predicted_score,
        prob: fallback.success_probability,
        improvement: fallback.improvement_potential
      });
      setStep('prediction');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER STEP
  // ============================================
  const renderStep = () => {
    switch(step) {
      case 'exam_structure':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <ExamStructure subjectData={subjectData} onNext={() => setStep('input_form')} />
          </div>
        );
      case 'input_form':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <InputForm 
              subjectData={subjectData} 
              onSubmit={handleSubmit}
              onBack={() => setStep('exam_structure')} 
              loading={loading}
            />
          </div>
        );
      case 'prediction':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <Prediction 
              prediction={prediction} 
              subjectData={subjectData}
              formData={formData}
              onNext={() => setStep('weaknesses')} 
              onBack={() => setStep('input_form')} 
            />
          </div>
        );
      case 'weaknesses':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <Weaknesses 
              formData={formData} 
              weaknessData={weaknessData}
              subjectData={subjectData} 
              onNext={() => setStep('derived')} 
              onBack={() => setStep('prediction')} 
            />
          </div>
        );
      case 'derived':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <DerivedFeatures 
              formData={formData}
              featureData={featureData}
              subjectData={subjectData} 
              onNext={() => setStep('simulation')} 
              onBack={() => setStep('weaknesses')} 
            />
          </div>
        );
      case 'simulation':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <Simulation 
              formData={formData} 
              prediction={prediction} 
              subjectData={subjectData} 
              onNext={() => setStep('final_report')} 
              onBack={() => setStep('derived')} 
            />
          </div>
        );
      case 'final_report':
        return (
          <div style={{ color: '#1a1a2e' }}>
            <FinalReport 
              formData={formData} 
              prediction={prediction} 
              weaknessData={weaknessData}
              featureData={featureData}
              subjectData={subjectData} 
              onReset={() => {
                setStep('exam_structure');
                setFormData(null);
                setPrediction(null);
                setWeaknessData(null);
                setFeatureData(null);
                setError(null);
              }} 
            />
          </div>
        );
      default:
        return (
          <div style={{ color: '#1a1a2e' }}>
            <ExamStructure subjectData={subjectData} onNext={() => setStep('input_form')} />
          </div>
        );
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      direction: 'rtl',
      fontFamily: "'Cairo', 'Tahoma', 'Segoe UI', sans-serif",
      background: '#f5f7fc',
      minHeight: '100vh',
      borderRadius: '16px',
      color: '#1a1a2e'
    }}>
      {/* Subject Header */}
      <div style={{
        background: subjectData.theme.gradient,
        color: 'white',
        padding: '24px 30px',
        borderRadius: '16px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '15px',
        boxShadow: '0 4px 20px rgba(30,60,114,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{subjectData.icon} {subjectData.name}</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            المدة: {subjectData.examDuration} | المجموع: {subjectData.totalPoints} نقطة
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '14px',
          color: 'white'
        }}>
          📊 {Object.keys(subjectData.skills).length} مهارة
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <div>جاري التحليل...</div>
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        background: '#ffffff',
        padding: '12px 16px',
        borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        border: '1px solid #e8ecf1'
      }}>
        {['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'].map((s, i) => {
          const labels = ['📋 هيكل الامتحان', '📝 بيانات', '🔮 التوقع', '📊 نقاط الضعف', '📖 المؤشرات', '⚡ المحاكاة', '📋 التقرير'];
          const isActive = step === s;
          const stepIndex = ['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'].indexOf(s);
          const currentIndex = ['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'].indexOf(step);
          const isCompleted = stepIndex < currentIndex;
          
          return (
            <div key={s} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: isActive ? subjectData.theme.gradient : isCompleted ? '#2ecc71' : '#f0f2f5',
                color: isActive || isCompleted ? 'white' : '#1a1a2e',
                fontSize: '13px',
                fontWeight: isActive ? 'bold' : '500',
                transition: 'all 0.3s',
                cursor: 'default',
                boxShadow: isActive ? '0 4px 15px rgba(30,60,114,0.3)' : 'none'
              }}>
                {labels[i]}
              </div>
              {i < 6 && (
                <span style={{
                  color: isCompleted ? '#2ecc71' : '#ccc',
                  fontSize: '14px',
                  fontWeight: '300'
                }}>
                  ←
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Banner */}
      {error && step !== 'input_form' && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Step Content */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
        border: '1px solid #e8ecf1',
        color: '#1a1a2e'
      }}>
        {renderStep()}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '16px 20px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e8ecf1',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        color: '#555'
      }}>
        <span>📚 {subjectData.name} - جميع الشعب</span>
        <span>⭐ المهارات الأكثر أهمية: تحليل الشعر والبلاغة</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}