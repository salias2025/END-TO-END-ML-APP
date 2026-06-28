// src/bac_year/physics.jsx
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

// Physics (العلوم الفيزيائية) subject data
const subjectData = {
  id: 'physics',
  name: '🔬 العلوم الفيزيائية',
  nameEn: 'Physics',
  icon: '🔬',
  examDuration: '3h 30min - 4h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  
  // ============================================
  // PHYSICS-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'mechanics_block',
      name: '🔧 مستوى الميكانيك - الأهم!',
      nameEn: 'Mechanics Level',
      description: 'يقيس فهمك لقوانين نيوتن، الطاقة، الكمية للحركة، والمعادلات التفاضلية للحركة. الميكانيك هو جزء أساسي في بكالوريا الفيزياء!',
      improvement: 'ركز على تمثيل القوى وحل المعادلات التفاضلية للحركة - هذا هو مفتاح النجاح في الميكانيك!',
      calculate: (data) => data.mechanics || 0,
      target: 7.5,
      max: 10,
      importance: 'critical',
      icon: '🔧',
      weight: '40-45%'
    },
    {
      id: 'electricity_block',
      name: '⚡ مستوى الكهرباء - الأهم!',
      nameEn: 'Electricity Level',
      description: 'يقيس فهمك لدوائر RC و RL، شحن وتفريغ المكثفة، ثابت الزمن، والعلاقات الأسية. الكهرباء تأتي بكثرة في البكالوريا!',
      improvement: 'تدرب على دوائر RC و RL والعلاقات الأسية - هذا الجزء مهم جداً في الامتحان!',
      calculate: (data) => data.electricity || 0,
      target: 7.5,
      max: 10,
      importance: 'critical',
      icon: '⚡',
      weight: '35-40%'
    },
    {
      id: 'chemistry_block',
      name: '🧪 مستوى الكيمياء',
      nameEn: 'Chemistry Level',
      description: 'يجمع مهاراتك في المعايرة، الأسترة، والأحماض والأسس. يمثل 20-25% من نقاط البكالوريا.',
      improvement: 'ركز على المعايرة وحساب التركيزات - هذه المواضيع سهلة النقاط!',
      calculate: (data) => {
        const skills = [
          data.chemistry_general || 0,
          data.chemistry_esterification || 0,
          data.chemistry_acid_base || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 6.5,
      max: 10,
      importance: 'high',
      icon: '🧪',
      weight: '20-25%'
    },
    {
      id: 'nuclear_block',
      name: '☢️ مستوى الفيزياء النووية',
      nameEn: 'Nuclear Physics Level',
      description: 'يقيس فهمك للتفككات الإشعاعية (α, β⁻, β⁺, γ) وطاقة الربط. يأتي هذا الفصل بنسبة 5-10% في البكالوريا.',
      improvement: 'تدرب على كتابة معادلات التفكك وحساب طاقة الربط - هذا الفصل سهل النقاط!',
      calculate: (data) => data.nuclear || 0,
      target: 5.5,
      max: 10,
      importance: 'medium',
      icon: '☢️',
      weight: '5-10%'
    },
    {
      id: 'waves_block',
      name: '🌊 مستوى الموجات والتذبذبات',
      nameEn: 'Waves & Oscillations Level',
      description: 'يقيس فهمك للتذبذبات الحرة والقسرية، الرنين، وانتشار الموجات. هذا الفصل يأتي قليلاً في البكالوريا!',
      improvement: 'ركز على الأساسيات فقط - هذا الفصل ليس له وزن كبير في البكالوريا',
      calculate: (data) => data.waves_oscillations || 0,
      target: 5.0,
      max: 10,
      importance: 'low',
      icon: '🌊',
      weight: '3-5%'
    },
    {
      id: 'problem_solving_composite',
      name: '🔍 مستوى حل المسائل',
      nameEn: 'Problem Solving Level',
      description: 'يجمع حل المسائل الفيزيائية وقراءة المنحنيات. الفيزياء تعتمد على حل المسائل أكثر من أي مادة أخرى!',
      improvement: 'قسم المسألة إلى خطوات صغيرة وحلل المعطيات قبل البدء في الحل',
      calculate: (data) => {
        return (data.problem_solving || 0 + data.graph_interpretation || 0) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🔍'
    },
    {
      id: 'psychological_health',
      name: '🧠 الصحة النفسية',
      nameEn: 'Psychological Health',
      description: 'يجمع قلة قلق الفيزياء وإتقان القوانين. الفيزياء تحتاج إلى ثقة عالية!',
      improvement: 'حاول تقليل قلق الفيزياء بتمارين التنفس، ابدأ بتمارين سهلة لتعزيز ثقتك',
      calculate: (data) => {
        return ((10 - (data.physics_anxiety || 5)) + (data.formula_mastery || 5)) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '🧠'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس مدى التوازن بين مهاراتك في فروع الفيزياء المختلفة. القيمة المنخفضة تعني أن مهاراتك متوازنة (ممتاز).',
      improvement: 'حدد المهارات الضعيفة وركز عليها بشكل مكثف',
      calculate: (data) => {
        const skills = [
          data.mechanics || 0,
          data.electricity || 0,
          data.chemistry_general || 0,
          data.nuclear || 0,
          data.waves_oscillations || 0
        ];
        const avg = skills.reduce((a, b) => a + b, 0) / skills.length;
        return skills.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / skills.length;
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
    title: '🔬 امتحان البكالوريا - العلوم الفيزيائية',
    titleEn: 'Physics Baccalaureate Exam',
    streams: [
      {
        name: '🔬 شعبة علوم تجريبية (3سا 30د)',
        nameEn: 'Sciences Stream (3h 30min)',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: الفيزياء',
            nameEn: 'Part 1: Physics',
            content: 'ميكانيك + كهرباء + فيزياء نووية',
            contentEn: 'Mechanics + Electricity + Nuclear Physics',
            points: '13 points (65%)',
            subParts: [
              { name: 'الميكانيك', points: '5-6 نقاط', skills: 'قوانين نيوتن، الطاقة، الحركة' },
              { name: 'الكهرباء', points: '4-5 نقاط', skills: 'دوائر RC و RL، ثابت الزمن' },
              { name: 'الفيزياء النووية', points: '2-3 نقاط', skills: 'التفككات، طاقة الربط' }
            ]
          },
          {
            name: 'الجزء الثاني: الكيمياء',
            nameEn: 'Part 2: Chemistry',
            content: 'معايرة + أسترة + توازن كيميائي',
            contentEn: 'Titration + Esterification + Chemical Equilibrium',
            points: '7 points (35%)',
            subParts: [
              { name: 'المعايرة', points: '3 نقاط', skills: 'حساب التركيزات' },
              { name: 'الأسترة', points: '2-3 نقاط', skills: 'تفاعلات الأسترة والتصبن' },
              { name: 'التوازن الكيميائي', points: '1-2 نقاط', skills: 'ثابت التوازن' }
            ]
          }
        ]
      },
      {
        name: '📐 شعبة رياضيات + تقني رياضي (4سا 30د)',
        nameEn: 'Maths + Technical Stream (4h 30min)',
        color: '#2ecc71',
        exercises: [
          {
            name: 'الجزء الأول: الفيزياء',
            nameEn: 'Part 1: Physics',
            content: 'ميكانيك + كهرباء + فيزياء نووية + موجات',
            contentEn: 'Mechanics + Electricity + Nuclear Physics + Waves',
            points: '14 points (70%)',
            subParts: [
              { name: 'الميكانيك', points: '5-6 نقاط', skills: 'قوانين نيوتن، الطاقة، الحركة' },
              { name: 'الكهرباء', points: '4-5 نقاط', skills: 'دوائر RC و RL، ثابت الزمن' },
              { name: 'الفيزياء النووية', points: '2-3 نقاط', skills: 'التفككات، طاقة الربط' },
              { name: 'الموجات', points: '1-2 نقاط', skills: 'التذبذبات، الرنين' }
            ]
          },
          {
            name: 'الجزء الثاني: الكيمياء',
            nameEn: 'Part 2: Chemistry',
            content: 'معايرة + أسترة + توازن كيميائي',
            contentEn: 'Titration + Esterification + Chemical Equilibrium',
            points: '6 points (30%)',
            subParts: [
              { name: 'المعايرة', points: '2-3 نقاط', skills: 'حساب التركيزات' },
              { name: 'الأسترة', points: '2 نقاط', skills: 'تفاعلات الأسترة والتصبن' },
              { name: 'التوازن الكيميائي', points: '1-2 نقاط', skills: 'ثابت التوازن' }
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
    // Physics Core - Mechanics (CRITICAL)
    mechanics: {
      name: '🔧 الميكانيك (قوانين نيوتن، الطاقة، الحركة)',
      nameEn: 'Mechanics (Newton\'s Laws, Energy, Motion)',
      target: 7.5,
      importance: 'critical',
      weight: '40-45%',
      category: 'physics',
      isCore: true
    },
    // Physics Core - Electricity (CRITICAL)
    electricity: {
      name: '⚡ الكهرباء (دوائر RC و RL، ثابت الزمن)',
      nameEn: 'Electricity (RC/RL Circuits, Time Constant)',
      target: 7.5,
      importance: 'critical',
      weight: '35-40%',
      category: 'physics',
      isCore: true
    },
    // Chemistry - General
    chemistry_general: {
      name: '🧪 الكيمياء العامة (المعايرة، التوازن الكيميائي)',
      nameEn: 'General Chemistry (Titration, Equilibrium)',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'chemistry'
    },
    // Chemistry - Esterification
    chemistry_esterification: {
      name: '🧪 الأسترة (تفاعلات الأسترة والتصبن)',
      nameEn: 'Esterification (Esterification & Saponification)',
      target: 6.0,
      importance: 'high',
      weight: '15-20%',
      category: 'chemistry'
    },
    // Chemistry - Acid/Base
    chemistry_acid_base: {
      name: '🧪 الأحماض والأسس (pH، الكواشف الملونة)',
      nameEn: 'Acids & Bases (pH, Indicators)',
      target: 6.0,
      importance: 'high',
      weight: '15-20%',
      category: 'chemistry'
    },
    // Nuclear Physics
    nuclear: {
      name: '☢️ الفيزياء النووية (التفككات، طاقة الربط)',
      nameEn: 'Nuclear Physics (Decays, Binding Energy)',
      target: 5.5,
      importance: 'medium',
      weight: '5-10%',
      category: 'physics'
    },
    // Waves & Oscillations
    waves_oscillations: {
      name: '🌊 الموجات والتذبذبات (RLC، الرنين)',
      nameEn: 'Waves & Oscillations (RLC, Resonance)',
      target: 5.0,
      importance: 'low',
      weight: '3-5%',
      category: 'physics'
    },
    // Problem Solving Skills
    problem_solving: {
      name: '🔍 حل مسائل فيزيائية متعددة الخطوات',
      nameEn: 'Multi-step Physics Problem Solving',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'problem_solving'
    },
    graph_interpretation: {
      name: '📈 قراءة وتحليل المنحنيات (v-t, i-t, u-t)',
      nameEn: 'Graph Interpretation (v-t, i-t, u-t)',
      target: 6.0,
      importance: 'high',
      weight: '25-30%',
      category: 'problem_solving'
    },
    // Psychological Factors
    formula_mastery: {
      name: '📝 حفظ القوانين الفيزيائية',
      nameEn: 'Physics Formula Mastery',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'psychological',
      isPsych: true
    },
    physics_anxiety: {
      name: '😰 قلق الفيزياء',
      nameEn: 'Physics Anxiety',
      target: 4.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'psychological',
      isPsych: true,
      isNegative: true
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    bac_exams_practiced: {
      name: '📚 عدد امتحانات البكالوريا المحلولة',
      nameEn: 'Past BAC Exams Solved',
      target: 10,
      max: 30,
      category: 'practice',
      impact: 0.035
    },
    tp_practice: {
      name: '🔬 عدد جلسات الأعمال المخبرية (TP)',
      nameEn: 'Lab Work (TP) Sessions',
      target: 3,
      max: 5,
      category: 'practice',
      impact: 0.015
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS (Physics-specific)
  // ============================================
  psychological: {
    physics_anxiety: {
      name: '😰 قلق الفيزياء',
      nameEn: 'Physics Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.065
    },
    formula_mastery: {
      name: '📝 حفظ القوانين الفيزيائية',
      nameEn: 'Formula Mastery',
      target: 6,
      max: 10,
      isNegative: false,
      impact: 0.050
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '🔧 الميكانيك والكهرباء هما الأكثر أهمية - ركز عليهما بشدة!',
    '📚 حل امتحانات سابقة يرفع نقطتك 0.35 نقطة لكل 10 امتحانات',
    '🔬 الأعمال المخبرية (TP) ليس لها تأثير كبير - لا تقلق إذا تخطيتها!',
    '😌 قلق الفيزياء يخفض نقطتك - تقليله يرفع نقطتك 0.065 نقطة لكل درجة',
    '🌊 الموجات والتذبذبات تأتي قليلاً في البكالوريا - ركز على الأساسيات فقط',
    '🧪 الكيمياء تمثل 20-25% من النقاط - لا تهملها!',
    '📝 حفظ القوانين مهم جداً في الفيزياء',
    '🔍 حل المسائل هو مفتاح النجاح - تدرب على مسائل متنوعة'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '🔧 الميكانيك', weight: '40-45%', color: '#e74c3c' },
    { skill: '⚡ الكهرباء', weight: '35-40%', color: '#e67e22' },
    { skill: '🧪 الكيمياء', weight: '20-25%', color: '#f1c40f' },
    { skill: '🔍 حل المسائل', weight: '30-35%', color: '#2ecc71' },
    { skill: '☢️ الفيزياء النووية', weight: '5-10%', color: '#9b59b6' },
    { skill: '🌊 الموجات', weight: '3-5%', color: '#1abc9c' }
  ],
  
  // ============================================
  // STREAM SPECIFIC INFO
  // ============================================
  streamInfo: {
    Sciences: {
      name: 'علوم تجريبية',
      duration: '3سا 30د',
      physicsPoints: 13,
      chemistryPoints: 7
    },
    Maths: {
      name: 'رياضيات',
      duration: '4سا 30د',
      physicsPoints: 14,
      chemistryPoints: 6
    },
    Technique: {
      name: 'تقني رياضي',
      duration: '4سا 30د',
      physicsPoints: 14,
      chemistryPoints: 6
    },
    Gestion: {
      name: 'تسيير واقتصاد',
      duration: '3سا 30د',
      physicsPoints: 13,
      chemistryPoints: 7
    }
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
export default function Physics() {
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
    const avgGrade = (data.phys_grade_t1 + data.phys_grade_t2 + data.phys_grade_t3) / 3;
    
    const mechanicsWeight = 0.18;
    const electricityWeight = 0.16;
    const chemistryWeight = 0.12;
    const nuclearWeight = 0.06;
    const wavesWeight = 0.04;
    const problemWeight = 0.14;
    const graphWeight = 0.10;
    const formulaWeight = 0.08;
    const practiceWeight = 0.08;
    const psychWeight = 0.04;
    
    const totalWeight = mechanicsWeight + electricityWeight + chemistryWeight + 
                        nuclearWeight + wavesWeight + problemWeight + graphWeight +
                        formulaWeight + practiceWeight + psychWeight;
    
    const weightedSkills = 
      (data.mechanics || 5) * mechanicsWeight +
      (data.electricity || 5) * electricityWeight +
      (data.chemistry_general || 5) * chemistryWeight * 0.5 +
      (data.chemistry_esterification || 5) * chemistryWeight * 0.25 +
      (data.chemistry_acid_base || 5) * chemistryWeight * 0.25 +
      (data.nuclear || 5) * nuclearWeight +
      (data.waves_oscillations || 5) * wavesWeight +
      (data.problem_solving || 5) * problemWeight +
      (data.graph_interpretation || 5) * graphWeight +
      (data.formula_mastery || 5) * formulaWeight;
    
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    const practiceScore = Math.min(10,
      (data.exams_practiced || 5) / 30 * 10 * 0.8 +
      (data.tp_practice || 2) / 5 * 10 * 0.2
    );
    
    const psychScore = (
      (10 - (data.physics_anxiety || 5)) / 10 * 10 * 0.6 +
      (data.formula_mastery || 5) / 10 * 10 * 0.4
    );
    
    const rawScore = (
      avgGrade * 0.08 +
      weightedSkillsScore * 0.52 +
      practiceScore * 0.25 +
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

      const response = await fetch(`${API_URL}/api/bacyear/physics/predict`, {
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
        boxShadow: '0 4px 20px rgba(30,60,114,0.3)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{subjectData.icon} {subjectData.name}</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            المدة: {subjectData.examDuration} | المجموع: {subjectData.totalPoints} نقطة
          </p>
          <p style={{ margin: '2px 0 0 0', opacity: 0.8, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            🔧 الميكانيك والكهرباء هما مفتاح النجاح!
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
        <span>🔬 العلوم الفيزيائية - جميع الشعب</span>
        <span>⭐ المهارة الأكثر أهمية: الميكانيك والكهرباء</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}