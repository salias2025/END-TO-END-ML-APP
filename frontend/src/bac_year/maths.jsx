// src/bac_year/maths.jsx
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

// Mathematics subject specific data
const subjectData = {
  id: 'maths',
  name: '📐 الرياضيات',
  icon: '📐',
  examDuration: '2h30 - 4h30',
  totalPoints: 20,
  
  // ============================================
  // MATHEMATICS-SPECIFIC DERIVED FEATURES (6 features)
  // ============================================
  derivedFeatures: [
    {
      id: 'analysis_level',
      name: '📈 مستوى التحليل (الدوال) - الأهم!',
      description: 'يقيس قدرتك على تحليل الدوال، حساب النهايات والمشتقات. هذه أهم مهارة في بكالوريا الرياضيات وتمثل 35-40% من النقاط!',
      improvement: 'ركز على دراسة النهايات والمشتقات وطريقة دراسة الدوال - هذا هو مفتاح النجاح في الرياضيات!',
      calculate: (data) => (data.functions_analysis || 0 + data.graph_interpretation || 0) / 2,
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'algebra_level',
      name: '🔢 مستوى الجبر',
      description: 'يقيس مهاراتك في الجبر (المعادلات، المتراجحات، الأعداد المركبة). الجبر هو أساس كل فروع الرياضيات.',
      improvement: 'تدرب على حل المعادلات من الدرجة الثانية والثالثة والأعداد المركبة',
      calculate: (data) => data.algebra_skill || 0,
      target: 7.0,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'prob_seq_level',
      name: '📊 مستوى الاحتمالات والمتتاليات',
      description: 'يقيس مهاراتك في الاحتمالات (شجرة الاحتمالات، القوانين) والمتتاليات (الحسابية، الهندسية، بالتراجع). هذه المواضيع تأتي في تمارين منفصلة في البكالوريا.',
      improvement: 'حل تمارين على شجرة الاحتمالات والمتتاليات - هذه المواضيع سهلة النقاط!',
      calculate: (data) => (data.probability_skill || 0 + data.sequences_skill || 0) / 2,
      target: 6.5,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'integral_level',
      name: '∫ مستوى التكامل',
      description: 'يقيس قدرتك على حساب المساحات وإيجاد الدوال الأصلية. التكامل يأتي في التمارين الأخيرة من امتحان البكالوريا.',
      improvement: 'تدرب على حساب المساحات وإيجاد الدوال الأصلية - ركز على التكامل المحدد',
      calculate: (data) => data.integral_calculus || 0,
      target: 6.5,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      description: 'يقيس مدى اجتهادك في حل امتحانات البكالوريا السابقة والتمارين الأسبوعية والامتحانات بوقت محدد. في الرياضيات، الممارسة اليومية أهم من أي شيء آخر!',
      improvement: 'حل امتحان بكالوريا كل أسبوع وزد عدد التمارين إلى 10-15 أسبوعياً',
      calculate: (data) => {
        const examScore = (data.past_exams_solved || 0) / 30 * 10;
        const exerciseScore = (data.exercises_per_week || 0) / 20 * 10;
        const timedScore = (data.timed_exams_per_week || 0) / 5 * 10;
        return (examScore * 0.4 + exerciseScore * 0.3 + timedScore * 0.3);
      },
      target: 6.0,
      max: 10,
      importance: 'high'
    },
    {
      id: 'psychological_health',
      name: '🧠 الصحة النفسية (مهم جداً!)',
      description: 'يجمع الثقة بالنفس، التركيز، وقلة القلق والتوتر. الرياضيات هي أكثر مادة تتأثر بالعوامل النفسية - الفرق بين طالبين بنفس المستوى يمكن أن يكون 2-3 نقاط بسبب القلق!',
      improvement: 'حاول تقليل قلق الرياضيات بتمارين التنفس، ابدأ بتمارين سهلة لتعزيز ثقتك',
      calculate: (data) => {
        const confidence = data.confidence || 5;
        const focus = data.focus_concentration || 5;
        const noAnxiety = 10 - (data.math_anxiety || 5);
        const noStress = 10 - (data.exam_stress || 5);
        return (confidence + focus + noAnxiety + noStress) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'high'
    }
  ],
  
  // ============================================
  // EXAM STRUCTURE
  // ============================================
  examStructure: {
    title: '📐 امتحان البكالوريا - الرياضيات',
    streams: [
      {
        name: '📐 شعبة الرياضيات + تقني رياضي (4سا 30د)',
        color: '#e74c3c',
        exercises: [
          { name: 'التمرين الأول', content: 'الاحتمالات + المتتاليات', points: '4-5 نقاط' },
          { name: 'التمرين الثاني', content: 'المتتاليات + الأعداد المركبة', points: '4-5 نقاط' },
          { name: 'التمرين الثالث', content: 'الحساب + الجبر + الأعداد المركبة', points: '4-5 نقاط' },
          { name: 'التمرين الرابع', content: 'التحليل + الدوال + التكامل', points: '7-8 نقاط' }
        ]
      },
      {
        name: '🧪 شعبة علوم تجريبية (3سا 30د)',
        color: '#3498db',
        exercises: [
          { name: 'التمرين الأول', content: 'الاحتمالات + المتتاليات', points: '4 نقاط' },
          { name: 'التمرين الثاني', content: 'المتتاليات + الأعداد المركبة', points: '4 نقاط' },
          { name: 'التمرين الثالث', content: 'التحليل + الدوال', points: '8 نقاط' }
        ]
      },
      {
        name: '📊 شعبة تسيير واقتصاد (3سا 30د)',
        color: '#2ecc71',
        exercises: [
          { name: 'التمرين الأول', content: 'المتتاليات', points: '4 نقاط' },
          { name: 'التمرين الثاني', content: 'الاحتمالات', points: '4 نقاط' },
          { name: 'التمرين الثالث', content: 'التحليل + الدوال', points: '8 نقاط' }
        ]
      },
      {
        name: '📖 شعبة آداب وفلسفة + لغات أجنبية (2سا 30د)',
        color: '#9b59b6',
        exercises: [
          { name: 'التمرين الأول', content: 'المتتاليات العددية', points: '6 نقاط' },
          { name: 'التمرين الثاني', content: 'الاحتمالات والإحصاء', points: '6 نقاط' },
          { name: 'التمرين الثالث', content: 'التحليل والدوال (أساسيات)', points: '8 نقاط' }
        ]
      }
    ]
  },
  
  // ============================================
  // SKILLS
  // ============================================
  skills: {
    functions_analysis: { 
      name: '📈 التحليل (الدوال، النهايات، المشتقات)', 
      target: 7.5,
      importance: 'high',
      weight: '35-40%'
    },
    algebra_skill: { 
      name: '🔢 الجبر (المعادلات، المتراجحات)', 
      target: 7.0,
      importance: 'medium',
      weight: '15-20%'
    },
    probability_skill: { 
      name: '🎲 الاحتمالات (شجرة، قوانين)', 
      target: 6.5,
      importance: 'medium',
      weight: '10-15%'
    },
    sequences_skill: { 
      name: '📊 المتتاليات (حسابية، هندسية)', 
      target: 6.5,
      importance: 'medium',
      weight: '10-15%'
    },
    integral_calculus: { 
      name: '∫ التكامل (مساحات، دوال أصلية)', 
      target: 6.5,
      importance: 'medium',
      weight: '10-15%'
    },
    complex_numbers: { 
      name: '🔢 الأعداد المركبة (شكل جبري، مثلثي)', 
      target: 6.0,
      importance: 'low',
      weight: '5-10%'
    },
    geometry_skill: { 
      name: '📐 الهندسة (متجهات، جداء سلمي)', 
      target: 6.0,
      importance: 'low',
      weight: '5-10%'
    },
    proof_reasoning: { 
      name: '📝 البرهان (استدلال، برهان بالتراجع)', 
      target: 6.5,
      importance: 'medium',
      weight: '10-15%'
    },
    multi_step_solving: { 
      name: '🔗 حل مسائل متعددة الخطوات', 
      target: 7.0,
      importance: 'high',
      weight: '20-25%'
    },
    graph_interpretation: { 
      name: '📈 قراءة وتحليل المنحنيات', 
      target: 6.5,
      importance: 'medium',
      weight: '10-15%'
    },
    exam_time_management: { 
      name: '⏰ إدارة الوقت في الامتحان', 
      target: 6.0,
      importance: 'medium',
      weight: '5-10%'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    past_exams_solved: { name: '📚 الامتحانات المحلولة', target: 10, max: 30 },
    exercises_per_week: { name: '✍️ التمارين الأسبوعية', target: 10, max: 20 },
    timed_exams_per_week: { name: '⏱️ الامتحانات بوقت محدد', target: 2, max: 5 },
    study_hours: { name: '⏰ ساعات الدراسة الأسبوعية', target: 6, max: 15 }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    math_anxiety: { name: '😰 قلق الرياضيات', target: 4, max: 10, isNegative: true },
    confidence: { name: '💪 الثقة بالنفس', target: 7, max: 10, isNegative: false },
    exam_stress: { name: '😓 توتر الامتحان', target: 4, max: 10, isNegative: true },
    focus_concentration: { name: '🎯 التركيز', target: 7, max: 10, isNegative: false }
  },
  
  // ============================================
  // TIPS
  // ============================================
  tips: [
    '📈 ركز على التحليل (الدوال) - يمثل 35-40% من النقاط!',
    '📝 حل 10 امتحانات بكالوريا سابقة على الأقل',
    '⏱️ حل امتحان كامل بوقته الحقيقي كل أسبوع',
    '😌 مارس تمارين التنفس لتقليل قلق الرياضيات',
    '✍️ حل 10-15 تمريناً أسبوعياً مع تنويع المواضيع',
    '💪 ابدأ بتمارين سهلة لتعزيز ثقتك ثم انتقل للصعبة'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: 'التحليل (الدوال)', weight: '35-40%', color: '#e74c3c' },
    { skill: 'الجبر', weight: '15-20%', color: '#e67e22' },
    { skill: 'الاحتمالات والمتتاليات', weight: '15-20%', color: '#f1c40f' },
    { skill: 'الهندسة والتكامل', weight: '10-15%', color: '#2ecc71' }
  ],
  
  // ============================================
  // THEME
  // ============================================
  theme: {
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
};

// ============================================
// COMPONENT
// ============================================
export default function Maths() {
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
  const calculatePrediction = (data) => {
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    const analysisWeight = 0.30;
    const algebraWeight = 0.15;
    const probSeqWeight = 0.12;
    const integralWeight = 0.08;
    const complexWeight = 0.05;
    const geometryWeight = 0.03;
    const proofWeight = 0.08;
    const multiStepWeight = 0.10;
    const graphWeight = 0.05;
    const timeWeight = 0.04;
    
    const weightedSkills = 
      (data.functions_analysis || 5) * analysisWeight +
      (data.algebra_skill || 5) * algebraWeight +
      (data.probability_skill || 5) * probSeqWeight +
      (data.sequences_skill || 5) * probSeqWeight +
      (data.integral_calculus || 5) * integralWeight +
      (data.complex_numbers || 5) * complexWeight +
      (data.geometry_skill || 5) * geometryWeight +
      (data.proof_reasoning || 5) * proofWeight +
      (data.multi_step_solving || 5) * multiStepWeight +
      (data.graph_interpretation || 5) * graphWeight +
      (data.exam_time_management || 5) * timeWeight;
    
    const weightedSkillsScore = weightedSkills / (analysisWeight + algebraWeight + probSeqWeight*2 + integralWeight + complexWeight + geometryWeight + proofWeight + multiStepWeight + graphWeight + timeWeight);
    
    const practiceScore = Math.min(10, 
      (data.past_exams_solved || 5) / 30 * 10 * 0.3 +
      (data.exercises_per_week || 5) / 20 * 10 * 0.25 +
      (data.timed_exams_per_week || 1) / 5 * 10 * 0.25 +
      (data.study_hours || 5) / 15 * 10 * 0.2
    );
    
    const psychScore = (
      (data.confidence || 5) + 
      (data.focus_concentration || 5) + 
      (10 - (data.math_anxiety || 5)) + 
      (10 - (data.exam_stress || 5))
    ) / 4;
    
    const rawScore = (
      avgGrade * 0.15 +
      weightedSkillsScore * 0.55 +
      practiceScore * 0.15 +
      psychScore * 0.15
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

      const response = await fetch(`${API_URL}/api/bacyear/maths/predict`, {
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
      const fallback = calculatePrediction(data);
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
      const fallback = calculatePrediction(data);
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
          <ExamStructure subjectData={subjectData} onNext={() => setStep('input_form')} />
        );
      case 'input_form':
        return (
          <InputForm 
            subjectData={subjectData} 
            onSubmit={handleSubmit}
            onBack={() => setStep('exam_structure')} 
            loading={loading}
          />
        );
      case 'prediction':
        return (
          <Prediction 
            prediction={prediction} 
            subjectData={subjectData}
            formData={formData}
            onNext={() => setStep('weaknesses')} 
            onBack={() => setStep('input_form')} 
          />
        );
      case 'weaknesses':
        return (
          <Weaknesses 
            formData={formData} 
            weaknessData={weaknessData}
            subjectData={subjectData} 
            onNext={() => setStep('derived')} 
            onBack={() => setStep('prediction')} 
          />
        );
      case 'derived':
        return (
          <DerivedFeatures 
            formData={formData}
            featureData={featureData}
            subjectData={subjectData} 
            onNext={() => setStep('simulation')} 
            onBack={() => setStep('weaknesses')} 
          />
        );
      case 'simulation':
        return (
          <Simulation 
            formData={formData} 
            prediction={prediction} 
            subjectData={subjectData} 
            onNext={() => setStep('final_report')} 
            onBack={() => setStep('derived')} 
          />
        );
      case 'final_report':
        return (
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
        );
      default:
        return (
          <ExamStructure subjectData={subjectData} onNext={() => setStep('input_form')} />
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
        boxShadow: '0 4px 20px rgba(102,126,234,0.3)'
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
          const isCompleted = ['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'].indexOf(s) < 
                             ['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'].indexOf(step);
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
                boxShadow: isActive ? '0 4px 15px rgba(102,126,234,0.3)' : 'none'
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
        <span>⭐ المهارات الأكثر أهمية: التحليل (35-40%)</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}