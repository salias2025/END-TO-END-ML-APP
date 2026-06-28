// src/bac_year/droit.jsx
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

// Law (القانون - Droit) - Gestion & Economics Stream
const subjectData = {
  id: 'droit',
  name: '⚖️ القانون',
  nameEn: 'Law',
  icon: '⚖️',
  examDuration: '2h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'Gestion',
  
  // ============================================
  // LAW-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'legal_skills_composite',
      name: '⚖️ المستوى القانوني العام - الأهم!',
      nameEn: 'Overall Legal Skills Level',
      description: 'يجمع مهاراتك في الاستدلال القانوني، التكييف، التبرير، وحفظ التعريفات. هذه هي المهارات الأساسية التي تحدد مستواك في القانون!',
      improvement: 'ركز على الاستدلال القانوني وتطبيق القواعد على الحالات العملية - هذه هي مفتاح النجاح!',
      calculate: (data) => {
        return (data.legal_reasoning || 0 + 
                data.qualification || 0 + 
                data.justification || 0 + 
                data.definition_recall || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '⚖️',
      weight: '40-45%'
    },
    {
      id: 'labor_law_composite',
      name: '👔 مستوى قانون العمل',
      nameEn: 'Labor Law Level',
      description: 'يجمع مهاراتك في قانون العمل الفردي (عقود العمل، الالتزامات) وقانون العمل الجماعي (الاتفاقيات، النقابات، الإضراب). هذا الفصل يأتي بكثرة في البكالوريا!',
      improvement: 'ركز على التمييز بين أنواع عقود العمل CDD/CDI وطرق تسوية النزاعات الجماعية',
      calculate: (data) => {
        return (data.labor_law_individual || 0 + 
                data.labor_law_collective || 0) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '👔'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل الحالات العملية وامتحانات البكالوريا السابقة. في القانون، حل الحالات العملية هو أفضل طريقة للتحضير!',
      improvement: 'حل 8-10 حالات عملية أسبوعياً - هذا يرفع نقطتك 0.4 نقطة لكل 10 حالات!',
      calculate: (data) => {
        return (data.case_exercises || 5) / 15 * 10 * 0.6 +
               (data.bac_exams_practiced || 5) / 30 * 10 * 0.4;
      },
      target: 6.0,
      max: 10,
      importance: 'high',
      icon: '⚡'
    },
    {
      id: 'study_quality',
      name: '📚 جودة الدراسة',
      nameEn: 'Study Quality',
      description: 'يقيس مدى انتظامك في الدراسة وجودة مراجعتك. الانتظام أهم من المذاكرة المكثفة!',
      improvement: 'نظم وقتك وذاكر يومياً بدلاً من المذاكرة المكثفة',
      calculate: (data) => {
        return (data.consistency || 5) * 0.6 + 
               (data.study_hours || 5) / 12 * 10 * 0.4;
      },
      target: 6.5,
      max: 10,
      importance: 'medium',
      icon: '📚'
    },
    {
      id: 'reasoning_focus',
      name: '🎯 التركيز على الاستدلال القانوني',
      nameEn: 'Legal Reasoning Focus',
      description: 'يقيس مدى تركيزك على الاستدلال القانوني مقارنة بالمهارات القانونية الأخرى. الاستدلال هو أهم مهارة في القانون ويمثل 40% من نقاط الامتحان!',
      improvement: 'تدرب على تطبيق القواعد القانونية على حالات عملية متنوعة',
      calculate: (data) => {
        const legalSkills = (data.legal_reasoning || 0 + 
                             data.qualification || 0 + 
                             data.justification || 0 + 
                             data.definition_recall || 0) / 4;
        return (data.legal_reasoning || 0) / (legalSkills + 0.1);
      },
      target: 1.0,
      max: 2,
      importance: 'critical',
      icon: '🎯'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس مدى التوازن بين مهاراتك في فصول القانون المختلفة. القيمة المنخفضة تعني أن مهاراتك متوازنة.',
      improvement: 'ركز قليلاً على الفصول الأضعف لتحقيق توازن أفضل',
      calculate: (data) => {
        const blocks = [
          data.company_law || 0,
          data.labor_law_individual || 0,
          data.labor_law_collective || 0,
          data.public_finance || 0
        ];
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
    title: '⚖️ امتحان البكالوريا - القانون',
    titleEn: 'Law Baccalaureate Exam',
    streams: [
      {
        name: '⚖️ القانون - شعبة تسيير واقتصاد',
        nameEn: 'Law - Gestion Stream',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: الأسئلة المباشرة',
            nameEn: 'Part 1: Direct Questions',
            content: 'تعريفات، التزامات، أنواع الضرائب',
            contentEn: 'Definitions, obligations, types of taxes',
            points: '6 points (30%)',
            subParts: [
              { name: 'تعريفات ومفاهيم', points: '2-3 نقاط', skills: 'حفظ التعريفات القانونية' },
              { name: 'الالتزامات والضرائب', points: '3-4 نقاط', skills: 'أنواع الالتزامات والضرائب' }
            ]
          },
          {
            name: 'الجزء الثاني: وضعية عملية',
            nameEn: 'Part 2: Practical Situation',
            content: 'تحديد نوع الشركة، الاتفاقيات الجماعية، إنهاء العمل',
            contentEn: 'Company type identification, collective agreements, termination of employment',
            points: '6 points (30%)',
            subParts: [
              { name: 'التكييف القانوني', points: '2-3 نقاط', skills: 'تحديد نوع الشركة والعقد' },
              { name: 'تطبيق القانون', points: '3-4 نقاط', skills: 'تطبيق القواعد القانونية' }
            ]
          },
          {
            name: 'الجزء الثالث: وضعية مركبة',
            nameEn: 'Part 3: Complex Situation',
            content: 'قانون الشركات، عقود العمل، النزاعات الجماعية',
            contentEn: 'Company law, employment contracts, collective disputes',
            points: '8 points (40%)',
            subParts: [
              { name: 'تحليل الوضعية', points: '4-5 نقاط', skills: 'الاستدلال القانوني' },
              { name: 'التبرير القانوني', points: '3-4 نقاط', skills: 'تبرير الإجابة بالنصوص القانونية' }
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
    // Law Chapters
    company_law: {
      name: '🏢 قانون الشركات (SARL، EURL، تأسيس، حل)',
      nameEn: 'Company Law (SARL, EURL, Formation, Dissolution)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'law',
      isCore: true
    },
    labor_law_individual: {
      name: '👷 قانون العمل الفردي (عقد العمل CDD/CDI، التزامات)',
      nameEn: 'Individual Labor Law (Employment Contract CDD/CDI, Obligations)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'law',
      isCore: true
    },
    labor_law_collective: {
      name: '🤝 قانون العمل الجماعي (اتفاقيات، نقابات، إضراب)',
      nameEn: 'Collective Labor Law (Agreements, Unions, Strikes)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'law'
    },
    public_finance: {
      name: '💰 المالية العامة (ضرائب، ميزانية، إيرادات)',
      nameEn: 'Public Finance (Taxes, Budget, Revenue)',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'law'
    },
    // Legal Skills (MOST IMPORTANT)
    legal_reasoning: {
      name: '⚖️ الاستدلال القانوني (تطبيق القانون على الحالات)',
      nameEn: 'Legal Reasoning (Applying law to cases)',
      target: 7.5,
      importance: 'critical',
      weight: '40-45%',
      category: 'legal_skills',
      isCore: true
    },
    qualification: {
      name: '🔍 التكييف القانوني (تحديد نوع الشركة، العقد، النزاع)',
      nameEn: 'Legal Qualification (Identifying company type, contract, dispute)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'legal_skills'
    },
    justification: {
      name: '📝 التبرير القانوني (تبرير الإجابة بالنصوص القانونية)',
      nameEn: 'Legal Justification (Justifying answers with legal texts)',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'legal_skills'
    },
    definition_recall: {
      name: '📖 حفظ التعريفات القانونية',
      nameEn: 'Legal Definitions Recall',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'legal_skills'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    case_exercises: {
      name: '📋 الحالات العملية المحلولة أسبوعياً',
      nameEn: 'Case Exercises Solved per Week',
      target: 10,
      max: 15,
      category: 'practice',
      impact: 0.04
    },
    bac_exams_practiced: {
      name: '📚 امتحانات البكالوريا المحلولة',
      nameEn: 'Past BAC Exams Solved',
      target: 10,
      max: 30,
      category: 'practice',
      impact: 0.035
    },
    study_hours: {
      name: '⏰ ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 4,
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
    law_anxiety: {
      name: '😰 قلق مادة القانون',
      nameEn: 'Law Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.01
    },
    reasoning_confidence: {
      name: '💪 الثقة في الاستدلال القانوني',
      nameEn: 'Legal Reasoning Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.015
    },
    exam_stress: {
      name: '😓 توتر الامتحان',
      nameEn: 'Exam Stress',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.01
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '⚖️ الاستدلال القانوني هو المهارة الأكثر أهمية - 40% من النقاط تعتمد عليه!',
    '📋 حل الحالات العملية يرفع نقطتك 0.4 نقطة لكل 10 حالات',
    '🏢 قانون الشركات وقانون العمل الفردي يمثلان الجزء الأكبر من الامتحان',
    '📝 التبرير القانوني مهم لتوضيح سبب تطبيق قاعدة معينة',
    '📖 القانون ليس حفظ فقط - يختبر قدرتك على تحليل الحالات وتطبيق القواعد',
    '📚 حل 10 امتحانات سابقة يرفع نقطتك 0.35 نقطة',
    '🔍 التكييف القانوني هو مهارة أساسية - تدرب على تحديد نوع الشركات والعقود',
    '😌 طلاب التسيير هادئون - العوامل النفسية لها تأثير ضئيل في القانون'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '⚖️ الاستدلال القانوني', weight: '40-45%', color: '#e74c3c' },
    { skill: '🏢 قانون الشركات', weight: '25-30%', color: '#e67e22' },
    { skill: '👷 قانون العمل الفردي', weight: '25-30%', color: '#f1c40f' },
    { skill: '🔍 التكييف القانوني', weight: '25-30%', color: '#2ecc71' },
    { skill: '🤝 قانون العمل الجماعي', weight: '15-20%', color: '#9b59b6' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '⚖️ الاستدلال القانوني (40% من النقاط)',
    examDuration: '2 ساعة و30 دقيقة',
    totalPoints: '20 نقطة',
    parts: '3 أجزاء (6 + 6 + 8 نقاط)',
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
export default function Droit() {
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
    console.log('⚖️ DROIT - Using fallback calculation');
    
    const avgGrade = (data.droit_grade_t1 + data.droit_grade_t2 + data.droit_grade_t3) / 3;
    
    // Legal skills (MOST IMPORTANT)
    const legalReasoning = data.legal_reasoning || 5;
    const qualification = data.qualification || 5;
    const justification = data.justification || 5;
    const definitions = data.definition_recall || 5;
    const legalSkills = (legalReasoning + qualification + justification + definitions) / 4;
    
    // Law chapters
    const companyLaw = data.company_law || 5;
    const laborIndividual = data.labor_law_individual || 5;
    const laborCollective = data.labor_law_collective || 5;
    const publicFinance = data.public_finance || 5;
    const overallLaw = (companyLaw + laborIndividual + laborCollective + publicFinance) / 4;
    
    // Practice intensity
    const practiceIntensity = (data.case_exercises || 5) / 15 * 10 * 0.6 +
                              (data.bac_exams_practiced || 5) / 30 * 10 * 0.4;
    
    // Study quality
    const studyQuality = (data.consistency || 5) * 0.6 + 
                         (data.study_hours || 5) / 12 * 10 * 0.4;
    
    // Psychological (LOW impact)
    const psychHealth = (data.reasoning_confidence || 5 + 
                         (10 - (data.law_anxiety || 5)) + 
                         (10 - (data.exam_stress || 5))) / 3;
    
    // Weights
    const legalWeight = 0.35;
    const chapterWeight = 0.20;
    const practiceWeight = 0.15;
    const studyWeight = 0.10;
    const psychWeight = 0.05;
    const gradeWeight = 0.10;
    
    const totalWeight = legalWeight + chapterWeight + practiceWeight + studyWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      legalSkills * legalWeight +
      overallLaw * chapterWeight +
      practiceIntensity * practiceWeight +
      studyQuality * studyWeight +
      psychHealth * psychWeight +
      avgGrade / 2 * gradeWeight;
    
    const rawScore = (weightedScore / totalWeight) * 2;
    const finalScore = Math.min(20, Math.max(0, rawScore));
    const prob = Math.min(100, Math.max(0, (finalScore - 5) / 15 * 100));
    const improvement = Math.min(6, (20 - finalScore) * 0.4);
    
    // Calculate derived features for fallback
    const derivedFeatures = {
      legal_skills_composite: Math.round(legalSkills * 100) / 100,
      labor_law_composite: Math.round(((laborIndividual + laborCollective) / 2) * 100) / 100,
      practice_intensity: Math.round(Math.min(10, Math.max(0, practiceIntensity)) * 100) / 100,
      study_quality: Math.round(Math.min(10, Math.max(0, studyQuality)) * 100) / 100,
      psychological_composite: Math.round(Math.min(10, Math.max(0, psychHealth)) * 100) / 100,
      overall_law_score: Math.round(overallLaw * 100) / 100,
      reasoning_focus: Math.round((legalReasoning / (legalSkills + 0.1)) * 100) / 100,
      imbalance_score: Math.round((() => {
        const blocks = [companyLaw, laborIndividual, laborCollective, publicFinance];
        const avg = blocks.reduce((a, b) => a + b, 0) / blocks.length;
        return blocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / blocks.length;
      })() * 100) / 100
    };
    
    // Calculate weaknesses
    const weaknesses = [];
    const skillMap = {
      company_law: { name: 'قانون الشركات', target: 7.0 },
      labor_law_individual: { name: 'قانون العمل الفردي', target: 7.0 },
      labor_law_collective: { name: 'قانون العمل الجماعي', target: 6.5 },
      public_finance: { name: 'المالية العامة', target: 6.0 },
      legal_reasoning: { name: 'الاستدلال القانوني', target: 7.5 },
      qualification: { name: 'التكييف القانوني', target: 7.0 },
      justification: { name: 'التبرير القانوني', target: 6.5 },
      definition_recall: { name: 'حفظ التعريفات', target: 6.0 }
    };
    
    Object.keys(skillMap).forEach(key => {
      const value = data[key] || 5;
      const target = skillMap[key].target;
      if (value < target) {
        weaknesses.push({
          skill: key,
          name: skillMap[key].name,
          value: value,
          target: target,
          gap: Math.round((target - value) * 10) / 10
        });
      }
    });
    
    weaknesses.sort((a, b) => b.gap - a.gap);
    
    return {
      predicted_score: Math.round(finalScore * 10) / 10,
      success_probability: Math.round(prob),
      improvement_potential: Math.round(improvement * 10) / 10,
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

      console.log('⚖️ Sending droit prediction request:', data);

      const response = await fetch(`${API_URL}/api/bacyear/droit/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('⚖️ API Response:', result);

      if (result.success) {
        const apiData = result.data;
        
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
    console.log('⚖️ DROIT - Form Data Submitted:', data);
    console.log('⚖️ DROIT - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('⚖️ DROIT - Result:', result);
      console.log('⚖️ DROIT - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('⚖️ DROIT - featureData set to:', result.derived_features);
      
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
            ⚖️ شعبة تسيير واقتصاد
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
        <span>⚖️ القانون - شعبة تسيير واقتصاد</span>
        <span>⭐ المهارة الأكثر أهمية: الاستدلال القانوني</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}