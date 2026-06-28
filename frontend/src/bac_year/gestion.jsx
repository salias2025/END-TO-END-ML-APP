// src/bac_year/gestion.jsx
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

// Gestion (Accounting & Financial Management) - Gestion & Economics Stream
const subjectData = {
  id: 'gestion',
  name: '📊 التسيير المحاسبي والمالي',
  nameEn: 'Accounting & Financial Management',
  icon: '📊',
  examDuration: '4h',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'Gestion',
  
  // ============================================
  // GESTION-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل التمارين والامتحانات. الممارسة هي مفتاح النجاح في التسيير المحاسبي والمالي!',
      improvement: 'حل 10-12 تمرين أسبوعياً - هذا يرفع نقطتك 0.4 نقطة لكل 5 تمارين!',
      calculate: (data) => {
        const exercises = data.weekly_exercises || data.exercises_per_week || data.essays_per_week || 5;
        const bac = data.bac_practiced || data.exams_practiced || 5;
        const mock = data.mock_exams || 2;
        return (exercises / 20 * 10 * 0.5) + (bac / 30 * 10 * 0.3) + (mock / 15 * 10 * 0.2);
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '⚡'
    },
    {
      id: 'study_quality',
      name: '📚 جودة الدراسة',
      nameEn: 'Study Quality',
      description: 'يقيس مدى انتظامك في الدراسة وجودة مراجعتك. الانتظام أهم من المذاكرة المكثفة!',
      improvement: 'نظم وقتك وذاكر 30 دقيقة يومياً بدلاً من 5 ساعات قبل الامتحان',
      calculate: (data) => {
        const consistency = data.consistency || data.study_consistency || 5;
        const hours = data.study_hours || data.hours_per_week || 5;
        return (consistency * 0.6) + (hours / 12 * 10 * 0.4);
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '📚'
    },
    {
      id: 'overall_level',
      name: '🎯 المستوى العام',
      nameEn: 'Overall Level',
      description: 'متوسط مستواك في أجزاء البكالوريا الثلاثة: تسيير التكاليف، المحاسبة المالية، قروض الاستثمار.',
      improvement: 'ركز على الجزء الأضعف لديك لرفع مستواك العام',
      calculate: (data) => {
        const cost = data.cost_block || data.cost || 5;
        const financial = data.financial_block || data.financial || 5;
        const loan = data.loan_block || data.loan || 5;
        return (cost + financial + loan) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🎯'
    },
    {
      id: 'gestion_imbalance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس التوازن بين مهاراتك في الأجزاء الثلاثة. القيمة المنخفضة = مهارات متوازنة.',
      improvement: 'ركز قليلاً على الجزء الأضعف لتحقيق توازن أفضل',
      calculate: (data) => {
        const cost = data.cost_block || data.cost || 5;
        const financial = data.financial_block || data.financial || 5;
        const loan = data.loan_block || data.loan || 5;
        const blocks = [cost, financial, loan];
        const avg = blocks.reduce((a, b) => a + b, 0) / blocks.length;
        return blocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / blocks.length;
      },
      target: 0.5,
      max: 5,
      importance: 'medium',
      isSpecial: true,
      icon: '⚖️'
    }
  ],
  
  // ============================================
  // EXAM STRUCTURE
  // ============================================
  examStructure: {
    title: '📊 امتحان البكالوريا - التسيير المحاسبي والمالي',
    titleEn: 'Accounting & Financial Management Baccalaureate Exam',
    streams: [
      {
        name: '📊 التسيير المحاسبي والمالي - شعبة تسيير واقتصاد',
        nameEn: 'Accounting & Financial Management - Gestion Stream',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: تسيير التكاليف',
            nameEn: 'Part 1: Cost Management',
            content: 'جداول التوزيع، كلفة الشراء، كلفة الإنتاج',
            contentEn: 'Allocation tables, purchase cost, production cost',
            points: '6 points (30%)',
            subParts: [
              { name: 'جداول التوزيع', points: '2-3 نقاط', skills: 'توزيع الأعباء غير المباشرة' },
              { name: 'كلفة الشراء والإنتاج', points: '3-4 نقاط', skills: 'حساب الكلف' }
            ]
          },
          {
            name: 'الجزء الثاني: المحاسبة المالية',
            nameEn: 'Part 2: Financial Accounting',
            content: 'تسويات نهاية السنة، الاهتلاكات، الميزانية',
            contentEn: 'Year-end adjustments, depreciation, balance sheet',
            points: '8 points (40%)',
            subParts: [
              { name: 'تسويات نهاية السنة', points: '4-5 نقاط', skills: 'الاهتلاكات، المؤونات' },
              { name: 'الميزانية', points: '3-4 نقاط', skills: 'تحليل الميزانية' }
            ]
          },
          {
            name: 'الجزء الثالث: قروض الاستثمار',
            nameEn: 'Part 3: Investment Loans',
            content: 'الفائدة المركبة، جدول الاستهلاك، اختيار المشاريع',
            contentEn: 'Compound interest, amortization schedule, project selection',
            points: '6 points (30%)',
            subParts: [
              { name: 'الفائدة المركبة', points: '2-3 نقاط', skills: 'حسابات الفائدة' },
              { name: 'جدول الاستهلاك', points: '2-3 نقاط', skills: 'استهلاك القرض' }
            ]
          }
        ]
      }
    ]
  },
  
  // ============================================
  // SKILLS
  // ============================================
  skills: {
    // Core Skills
    calculation_accuracy: {
      name: '🧮 دقة الحسابات - الأهم!',
      nameEn: 'Calculation Accuracy',
      target: 7.5,
      importance: 'critical',
      weight: '45-50%',
      category: 'core',
      isCore: true
    },
    financial_logic: {
      name: '🧠 المنطق المالي',
      nameEn: 'Financial Logic',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'core'
    },
    table_handling: {
      name: '📋 التعامل مع الجداول',
      nameEn: 'Table Handling',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'core'
    },
    execution_speed: {
      name: '⚡ سرعة التنفيذ',
      nameEn: 'Execution Speed',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'core'
    },
    // BAC Blocks
    cost_block: {
      name: '📊 تسيير التكاليف (6 نقاط)',
      nameEn: 'Cost Management (6 points)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'block'
    },
    financial_block: {
      name: '💰 المحاسبة المالية (8 نقاط)',
      nameEn: 'Financial Accounting (8 points)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'block'
    },
    loan_block: {
      name: '🏦 قروض الاستثمار (6 نقاط)',
      nameEn: 'Investment Loans (6 points)',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'block'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    weekly_exercises: {
      name: '📋 التمارين الأسبوعية',
      nameEn: 'Weekly Exercises',
      target: 12,
      max: 20,
      category: 'practice',
      impact: 0.04
    },
    bac_practiced: {
      name: '📚 امتحانات البكالوريا المحلولة',
      nameEn: 'Past BAC Exams Solved',
      target: 10,
      max: 30,
      category: 'practice',
      impact: 0.035
    },
    mock_exams: {
      name: '📝 الامتحانات التجريبية',
      nameEn: 'Mock Exams',
      target: 5,
      max: 15,
      category: 'practice'
    },
    study_hours: {
      name: '⏰ ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 5,
      max: 12,
      category: 'study'
    },
    consistency: {
      name: '📅 الانتظام في الدراسة',
      nameEn: 'Study Consistency',
      target: 7,
      max: 10,
      category: 'study'
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS (LOW IMPACT)
  // ============================================
  psychological: {
    stress: {
      name: '😰 مستوى التوتر',
      nameEn: 'Stress Level',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.01
    },
    confidence: {
      name: '💪 الثقة في النفس',
      nameEn: 'Self-Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.012
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '🧮 دقة الحسابات هي المهارة الأكثر أهمية - خطأ بسيط يكلفك نقاطاً كثيرة!',
    '📋 حل التمارين أسبوعياً يرفع نقطتك 0.4 نقطة لكل 5 تمارين',
    '📊 تسيير التكاليف يعتمد على جداول التوزيع - تدرب على ملئها بسرعة',
    '💰 المحاسبة المالية تمثل 8 نقاط - ركز على تسويات نهاية السنة',
    '🏦 قروض الاستثمار - تدرب على الفائدة المركبة وجداول الاستهلاك',
    '⏰ الانتظام أهم من المذاكرة المكثفة - ادرس 30 دقيقة يومياً',
    '😌 طلاب التسيير هادئون - العوامل النفسية تأثيرها ضئيل',
    '📚 حل 10 امتحانات بكالوريا سابقة يرفع نقطتك 0.35 نقطة'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '🧮 دقة الحسابات', weight: '45-50%', color: '#e74c3c' },
    { skill: '💰 المحاسبة المالية', weight: '30-35%', color: '#e67e22' },
    { skill: '📊 تسيير التكاليف', weight: '25-30%', color: '#f1c40f' },
    { skill: '🏦 قروض الاستثمار', weight: '20-25%', color: '#2ecc71' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '🧮 دقة الحسابات (خطأ بسيط يكلفك نقاطاً كثيرة)',
    examDuration: '4 ساعات',
    totalPoints: '20 نقطة',
    parts: '3 أجزاء (6 + 8 + 6 نقاط)',
    psychImpact: 'ضئيل - طلاب التسيير هادئون!'
  },
  
  // ============================================
  // THEME
  // ============================================
  theme: {
    primary: '#1e3c72',
    secondary: '#2a5298',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  }
};

// ============================================
// COMPONENT
// ============================================
export default function Gestion() {
  const [step, setStep] = useState('exam_structure');
  const [formData, setFormData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // LOCAL FALLBACK PREDICTION (only used if API fails)
  // ============================================
  const calculatePrediction = (data) => {
    console.log('📊 GESTION - Using fallback calculation');
    
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    const calculationAccuracy = data.calculation_accuracy || 5;
    const financialLogic = data.financial_logic || 5;
    const tableHandling = data.table_handling || 5;
    const executionSpeed = data.execution_speed || 5;
    
    const costBlock = data.cost_block || 5;
    const financialBlock = data.financial_block || 5;
    const loanBlock = data.loan_block || 5;
    
    const exercises = data.essays_per_week || data.weekly_exercises || 5;
    const bac = data.exams_practiced || data.bac_practiced || 5;
    const mock = data.mock_exams || 2;
    
    const practiceIntensity = (exercises / 20 * 10 * 0.5) + (bac / 30 * 10 * 0.3) + (mock / 15 * 10 * 0.2);
    const studyQuality = (data.consistency || 5) * 0.6 + (data.study_hours || 5) / 12 * 10 * 0.4;
    const overallLevel = (costBlock + financialBlock + loanBlock) / 3;
    
    const derivedFeatures = {
      practice_intensity: Math.round(Math.min(10, Math.max(0, practiceIntensity)) * 10) / 10,
      study_quality: Math.round(Math.min(10, Math.max(0, studyQuality)) * 10) / 10,
      overall_level: Math.round(Math.min(10, Math.max(0, overallLevel)) * 10) / 10,
      gestion_imbalance: Math.round(Math.min(5, Math.max(0, (() => {
        const blocks = [costBlock, financialBlock, loanBlock];
        const avg = blocks.reduce((a, b) => a + b, 0) / blocks.length;
        return blocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / blocks.length;
      })())) * 100) / 100
    };
    
    // Calculate weaknesses
    const weaknesses = [];
    const skillMap = {
      cost_block: { name: 'تسيير التكاليف', max: 10 },
      financial_block: { name: 'المحاسبة المالية', max: 10 },
      loan_block: { name: 'قروض الاستثمار', max: 10 },
      calculation_accuracy: { name: 'دقة الحسابات', max: 10 },
      financial_logic: { name: 'المنطق المالي', max: 10 },
      table_handling: { name: 'التعامل مع الجداول', max: 10 },
      execution_speed: { name: 'سرعة التنفيذ', max: 10 }
    };
    
    Object.keys(skillMap).forEach(key => {
      const value = data[key] || 5;
      const target = key === 'calculation_accuracy' ? 7.5 : 7.0;
      if (value < target) {
        weaknesses.push({
          skill: key,
          name: skillMap[key].name,
          value: value,
          target: target,
          gap: Math.round((target - value) * 10) / 10,
          max: skillMap[key].max
        });
      }
    });
    
    weaknesses.sort((a, b) => b.gap - a.gap);
    
    return {
      predicted_score: Math.round(((calculationAccuracy * 0.25 + overallLevel * 0.20 + 
        (financialLogic + tableHandling + executionSpeed) / 3 * 0.15 + 
        practiceIntensity * 0.15 + studyQuality * 0.10 + avgGrade / 2 * 0.10 + 
        (data.confidence || 5) / 10 * 10 * 0.05) / 1.0) * 2 * 10) / 10,
      success_probability: 50,
      improvement_potential: 2,
      derived_features: derivedFeatures,
      weaknesses: weaknesses.slice(0, 5)
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

      console.log('📊 Sending gestion prediction request:', data);

      const response = await fetch(`${API_URL}/api/bacyear/gestion/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('📊 API Response:', result);

      if (result.success) {
        const apiData = result.data;
        
        // Log the derived features from API
        console.log('📊 API derived_features:', apiData.derived_features);
        
        const mappedPrediction = {
          score: apiData.prediction?.predicted_score ?? 0,
          prob: apiData.prediction?.success_probability ?? 0,
          improvement: apiData.prediction?.improvement_potential ?? 0
        };
        
        return {
          prediction: mappedPrediction,
          derived_features: apiData.derived_features || null,
          weaknesses: apiData.weaknesses || null
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
        derived_features: fallback.derived_features || null,
        weaknesses: fallback.weaknesses || null
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================
  const handleSubmit = async (data) => {
    console.log('📊 GESTION - Form Data Submitted:', data);
    console.log('📊 GESTION - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('📊 GESTION - Result:', result);
      console.log('📊 GESTION - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('📊 GESTION - featureData set to:', result.derived_features);
      
      setStep('prediction');
    } catch (error) {
      setError(error.message);
      const fallback = calculatePrediction(data);
      setPrediction({
        score: fallback.predicted_score,
        prob: fallback.success_probability,
        improvement: fallback.improvement_potential
      });
      setWeaknessData(fallback.weaknesses || null);
      setFeatureData(fallback.derived_features || null);
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
        boxShadow: '0 4px 20px rgba(30,60,114,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{subjectData.icon} {subjectData.name}</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            المدة: {subjectData.examDuration} | المجموع: {subjectData.totalPoints} نقطة
          </p>
          <p style={{ margin: '2px 0 0 0', opacity: 0.8, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            📊 شعبة تسيير واقتصاد
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
          const labels = ['📋 الهيكل', '📝 البيانات', '🔮 التوقع', '📊 الضعف', '📖 الميزات', '⚡ المحاكاة', '📋 التقرير'];
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
        <span>📊 التسيير المحاسبي والمالي - شعبة تسيير واقتصاد</span>
        <span>⭐ المهارة الأكثر أهمية: دقة الحسابات</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}