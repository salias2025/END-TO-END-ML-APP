// src/bac_year/his_geo.jsx
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

// History & Geography (التاريخ والجغرافيا) - Gestion & Economics Stream
const subjectData = {
  id: 'his_geo',
  name: '📜 التاريخ والجغرافيا',
  nameEn: 'History & Geography',
  icon: '📜',
  examDuration: '3h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'Gestion',
  
  // ============================================
  // HISTORY & GEOGRAPHY DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'methodology_composite',
      name: '📝 مستوى المنهجية - الأهم!',
      nameEn: 'Methodology Level',
      description: 'أهم مؤشر! يقيس قدرتك على تطبيق المنهجية الصحيحة: تحليل الوثائق، كتابة المقال، قراءة الخرائط، والحجاج المنطقي. هذه هي مفتاح النجاح في البكالوريا!',
      improvement: 'تدرب على تحليل الوثائق وكتابة المقال - هذه هي مفتاح النجاح في البكالوريا!',
      calculate: (data) => {
        return (data.document_analysis_method || 0 + 
                data.essay_method || 0 + 
                data.map_stats_method || 0 + 
                data.argumentation_skill || 0) / 4;
      },
      target: 7.5,
      max: 10,
      importance: 'critical',
      icon: '📝',
      weight: '40-45%'
    },
    {
      id: 'memory_composite',
      name: '🧠 مستوى الذاكرة',
      nameEn: 'Memory Level',
      description: 'يقدر متوسط قدرتك على حفظ وتذكر المعلومات التاريخية والجغرافية: الأحداث، التواريخ، الشخصيات، والمفاهيم.',
      improvement: 'راجع المعلومات بانتظام - الذاكرة تحتاج إلى تكرار. احفظ التواريخ الأساسية أولاً',
      calculate: (data) => {
        return (data.historical_memory || 0 + 
                data.dates_memory || 0 + 
                data.figures_memory || 0 + 
                data.geography_knowledge || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🧠'
    },
    {
      id: 'knowledge_composite',
      name: '📚 المعرفة الموضوعية',
      nameEn: 'Topic Knowledge',
      description: 'يقيس معرفتك بالموضوعات المقررة: الحرب الباردة، حركات التحرر، تاريخ الجزائر، القوى الاقتصادية، والتنمية.',
      improvement: 'ركز على الموضوعات التي تجدها صعبة - استخدم خرائط ذهنية لتجميع المعلومات',
      calculate: (data) => {
        return (data.cold_war_knowledge || 0 + 
                data.decolonization_knowledge || 0 + 
                data.algeria_history_knowledge || 0 + 
                data.economic_powers_knowledge || 0 + 
                data.development_knowledge || 0) / 5;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '📚'
    },
    {
      id: 'study_quality',
      name: '📖 جودة الدراسة',
      nameEn: 'Study Quality',
      description: 'يقيس مدى انتظامك في الدراسة وتكرار الحفظ. الانتظام أهم من المذاكرة المكثفة!',
      improvement: 'نظم وقتك وذاكر 20-30 دقيقة يومياً بدلاً من 5 ساعات قبل الامتحان',
      calculate: (data) => {
        return (data.memorization_frequency || 5) * 0.6 + 
               (data.consistency || 5) * 0.4;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '📖'
    },
    {
      id: 'memory_methodology_balance',
      name: '⚖️ التوازن بين الذاكرة والمنهجية',
      nameEn: 'Memory-Methodology Balance',
      description: 'يقيس الفرق بين مستوى ذاكرتك ومستوى منهجيتك. القيمة المنخفضة = مهارات متوازنة.',
      improvement: 'ركز على الجانب الأضعف لتحقيق توازن أفضل',
      calculate: (data) => {
        const memory = (data.historical_memory || 0 + data.dates_memory || 0 + 
                        data.figures_memory || 0 + data.geography_knowledge || 0) / 4;
        const methodology = (data.document_analysis_method || 0 + data.essay_method || 0 + 
                            data.map_stats_method || 0 + data.argumentation_skill || 0) / 4;
        return Math.abs(memory - methodology);
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
    title: '📜 امتحان البكالوريا - التاريخ والجغرافيا',
    titleEn: 'History & Geography Baccalaureate Exam',
    streams: [
      {
        name: '📜 التاريخ والجغرافيا - شعبة تسيير واقتصاد',
        nameEn: 'History & Geography - Gestion Stream',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: التاريخ - تحليل وثيقة',
            nameEn: 'Part 1: History - Document Analysis',
            content: 'تحليل وثيقة + تعريف شخصيات وأحداث',
            contentEn: 'Document analysis + Defining figures and events',
            points: '6 points (30%)',
            subParts: [
              { name: 'تحليل الوثيقة', points: '3-4 نقاط', skills: 'استخراج الأفكار، تحليل النص' },
              { name: 'التعريفات', points: '2-3 نقاط', skills: 'شخصيات، أحداث' }
            ]
          },
          {
            name: 'الجزء الثاني: التاريخ - مقال',
            nameEn: 'Part 2: History - Essay',
            content: 'مقال (الثورة الجزائرية أو العلاقات الدولية)',
            contentEn: 'Essay (Algerian Revolution or International Relations)',
            points: '4 points (20%)',
            subParts: [
              { name: 'المقدمة', points: '1 نقطة', skills: 'عرض الموضوع' },
              { name: 'العرض', points: '2-3 نقاط', skills: 'تطوير الأفكار' },
              { name: 'الخاتمة', points: '0.5-1 نقطة', skills: 'التركيب' }
            ]
          },
          {
            name: 'الجزء الثالث: الجغرافيا - تحليل إحصاءات/خريطة',
            nameEn: 'Part 3: Geography - Statistics/Map Analysis',
            content: 'تحليل إحصاءات/خريطة + تعليق',
            contentEn: 'Statistics/Map analysis + Commentary',
            points: '6 points (30%)',
            subParts: [
              { name: 'تحليل المعطيات', points: '3-4 نقاط', skills: 'خرائط، إحصاءات' },
              { name: 'التعليق', points: '2-3 نقاط', skills: 'استنتاجات' }
            ]
          },
          {
            name: 'الجزء الرابع: الجغرافيا - مقال',
            nameEn: 'Part 4: Geography - Essay',
            content: 'مقال (القوى الاقتصادية أو التنمية)',
            contentEn: 'Essay (Economic Powers or Development)',
            points: '4 points (20%)',
            subParts: [
              { name: 'المقدمة', points: '1 نقطة', skills: 'عرض الموضوع' },
              { name: 'العرض', points: '2-3 نقاط', skills: 'تطوير الأفكار' },
              { name: 'الخاتمة', points: '0.5-1 نقطة', skills: 'التركيب' }
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
    // Memory Skills
    historical_memory: {
      name: '📜 الأحداث التاريخية (أسباب، نتائج)',
      nameEn: 'Historical Events (Causes, Consequences)',
      target: 7.0,
      importance: 'high',
      weight: '20-25%',
      category: 'memory',
      isCore: true
    },
    dates_memory: {
      name: '📅 التواريخ المهمة',
      nameEn: 'Important Dates',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'memory'
    },
    figures_memory: {
      name: '👤 الشخصيات التاريخية',
      nameEn: 'Historical Figures',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'memory'
    },
    geography_knowledge: {
      name: '🌍 المفاهيم الجغرافية',
      nameEn: 'Geographical Concepts',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'memory'
    },
    // Methodology Skills (MOST IMPORTANT)
    document_analysis_method: {
      name: '📄 تحليل الوثائق (نصوص، خرائط، إحصاءات)',
      nameEn: 'Document Analysis (Texts, Maps, Statistics)',
      target: 7.5,
      importance: 'critical',
      weight: '30-35%',
      category: 'methodology',
      isCore: true
    },
    essay_method: {
      name: '✍️ كتابة المقال (مقدمة، عرض، خاتمة)',
      nameEn: 'Essay Writing (Introduction, Body, Conclusion)',
      target: 7.5,
      importance: 'critical',
      weight: '25-30%',
      category: 'methodology',
      isCore: true
    },
    map_stats_method: {
      name: '🗺️ قراءة الخرائط والإحصاءات',
      nameEn: 'Map and Statistics Reading',
      target: 7.0,
      importance: 'high',
      weight: '20-25%',
      category: 'methodology'
    },
    argumentation_skill: {
      name: '🎯 الحجاج والمنطق',
      nameEn: 'Argumentation and Logic',
      target: 7.0,
      importance: 'high',
      weight: '20-25%',
      category: 'methodology'
    },
    // Topic Knowledge
    cold_war_knowledge: {
      name: '🌍 الحرب الباردة',
      nameEn: 'Cold War',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'knowledge'
    },
    decolonization_knowledge: {
      name: '🕊️ حركات التحرر',
      nameEn: 'Decolonization Movements',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'knowledge'
    },
    algeria_history_knowledge: {
      name: '🇩🇿 تاريخ الجزائر (الثورة، الاستقلال)',
      nameEn: 'Algerian History (Revolution, Independence)',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'knowledge'
    },
    economic_powers_knowledge: {
      name: '💰 القوى الاقتصادية الكبرى',
      nameEn: 'Major Economic Powers',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'knowledge'
    },
    development_knowledge: {
      name: '📈 التنمية والعالم الثالث',
      nameEn: 'Development and the Third World',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'knowledge'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    memorization_frequency: {
      name: '📚 وتيرة الحفظ',
      nameEn: 'Memorization Frequency',
      target: 7,
      max: 10,
      category: 'study',
      impact: 0.05
    },
    consistency: {
      name: '📅 الانتظام في الدراسة',
      nameEn: 'Study Consistency',
      target: 7,
      max: 10,
      category: 'study',
      impact: 0.04
    },
    study_hours: {
      name: '⏰ ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 4,
      max: 10,
      category: 'study'
    },
    bac_exams_practiced: {
      name: '📝 عدد امتحانات البكالوريا المحلولة',
      nameEn: 'Past BAC Exams Solved',
      target: 5,
      max: 15,
      category: 'practice',
      impact: 0.02
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    stress_level: {
      name: '😰 مستوى التوتر',
      nameEn: 'Stress Level',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.01
    },
    confidence_level: {
      name: '💪 الثقة في النفس',
      nameEn: 'Self-Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.02
    },
    interest_in_subject: {
      name: '❤️ الاهتمام بالمادة',
      nameEn: 'Interest in Subject',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.02
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '📝 المنهجية هي المفتاح - تعلم كيف تحلل الوثائق وتكتب المقال!',
    '🧠 الذاكرة ضرورية - لا يمكنك تزييف معرفة التواريخ والأحداث',
    '📚 الممارسة ليست كالتسيير - حل التمارين المتكرر لا يفيد كثيراً',
    '😌 التوتر تأثيره ضعيف جداً - هذه المواد ليست مرهقة',
    '⚖️ النجاح = ذاكرة قوية + منهجية صحيحة',
    '🇩🇿 ركز على تاريخ الجزائر - يأتي بكثرة في البكالوريا',
    '📄 تدرب على تحليل الوثائق من مصادر مختلفة',
    '✍️ تعلم هيكلة المقال: مقدمة → عرض → خاتمة'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '📝 المنهجية (تحليل الوثائق + المقال)', weight: '40-45%', color: '#e74c3c' },
    { skill: '🧠 الذاكرة (تواريخ + أحداث + شخصيات)', weight: '25-30%', color: '#3498db' },
    { skill: '📚 المعرفة الموضوعية', weight: '20-25%', color: '#e67e22' },
    { skill: '📖 الممارسة (حل الامتحانات)', weight: '5-10%', color: '#f1c40f' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '📝 المنهجية (40% من النقاط)',
    examDuration: '3 ساعات و30 دقيقة',
    totalPoints: '20 نقطة',
    parts: '4 أجزاء (6 + 4 + 6 + 4 نقاط)',
    psychImpact: 'ضعيف جداً - المواد ليست مرهقة',
    keyDifference: 'الممارسة ليست كالتسيير - ركز على المنهجية!'
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
export default function HisGeo() {
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
    console.log('📜 HIS_GEO - Using fallback calculation');
    
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    // Methodology (MOST IMPORTANT)
    const methodology = (data.document_analysis_method || 5 + 
                         data.essay_method || 5 + 
                         data.map_stats_method || 5 + 
                         data.argumentation_skill || 5) / 4;
    
    // Memory
    const memory = (data.historical_memory || 5 + 
                    data.dates_memory || 5 + 
                    data.figures_memory || 5 + 
                    data.geography_knowledge || 5) / 4;
    
    // Topic Knowledge
    const knowledge = (data.cold_war_knowledge || 5 + 
                       data.decolonization_knowledge || 5 + 
                       data.algeria_history_knowledge || 5 + 
                       data.economic_powers_knowledge || 5 + 
                       data.development_knowledge || 5) / 5;
    
    // Study quality
    const studyQuality = (data.memorization_frequency || 5) * 0.6 + 
                         (data.consistency || 5) * 0.4;
    
    // Practice (LOW impact)
    const practice = (data.bac_exams_practiced || 5) / 15 * 10;
    
    // Psychological (VERY LOW impact)
    const psych = (data.confidence_level || 5 + 
                   data.interest_in_subject || 5 + 
                   (10 - (data.stress_level || 5))) / 3;
    
    // Derived features for fallback
    const derivedFeatures = {
      methodology_composite: Math.round(methodology * 100) / 100,
      memory_composite: Math.round(memory * 100) / 100,
      knowledge_composite: Math.round(knowledge * 100) / 100,
      study_quality: Math.round(Math.min(10, Math.max(0, studyQuality)) * 100) / 100,
      memory_methodology_balance: Math.round(Math.abs(memory - methodology) * 100) / 100
    };
    
    // Weights
    const methodWeight = 0.35;
    const memoryWeight = 0.20;
    const knowledgeWeight = 0.15;
    const studyWeight = 0.10;
    const practiceWeight = 0.05;
    const psychWeight = 0.05;
    const gradeWeight = 0.10;
    
    const totalWeight = methodWeight + memoryWeight + knowledgeWeight + studyWeight + practiceWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      methodology * methodWeight +
      memory * memoryWeight +
      knowledge * knowledgeWeight +
      studyQuality * studyWeight +
      practice * practiceWeight +
      psych * psychWeight +
      avgGrade / 2 * gradeWeight;
    
    const rawScore = (weightedScore / totalWeight) * 2;
    const finalScore = Math.min(20, Math.max(0, rawScore));
    const prob = Math.min(100, Math.max(0, (finalScore - 5) / 15 * 100));
    const improvement = Math.min(6, (20 - finalScore) * 0.4);
    
    // Calculate weaknesses
    const weaknesses = [];
    const skillMap = {
      historical_memory: { name: 'الأحداث التاريخية', target: 7.0 },
      dates_memory: { name: 'التواريخ المهمة', target: 6.5 },
      figures_memory: { name: 'الشخصيات التاريخية', target: 6.5 },
      geography_knowledge: { name: 'المفاهيم الجغرافية', target: 6.5 },
      document_analysis_method: { name: 'تحليل الوثائق', target: 7.5 },
      essay_method: { name: 'كتابة المقال', target: 7.5 },
      map_stats_method: { name: 'قراءة الخرائط والإحصاءات', target: 7.0 },
      argumentation_skill: { name: 'الحجاج والمنطق', target: 7.0 },
      cold_war_knowledge: { name: 'الحرب الباردة', target: 6.5 },
      decolonization_knowledge: { name: 'حركات التحرر', target: 6.5 },
      algeria_history_knowledge: { name: 'تاريخ الجزائر', target: 6.5 },
      economic_powers_knowledge: { name: 'القوى الاقتصادية', target: 6.0 },
      development_knowledge: { name: 'التنمية والعالم الثالث', target: 6.0 }
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

      console.log('📜 Sending his_geo prediction request:', data);

      const response = await fetch(`${API_URL}/api/bacyear/his_geo/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('📜 API Response:', result);

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
    console.log('📜 HIS_GEO - Form Data Submitted:', data);
    console.log('📜 HIS_GEO - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('📜 HIS_GEO - Result:', result);
      console.log('📜 HIS_GEO - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('📜 HIS_GEO - featureData set to:', result.derived_features);
      
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
            📜 شعبة تسيير واقتصاد
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
        <span>📜 التاريخ والجغرافيا - شعبة تسيير واقتصاد</span>
        <span>⭐ المهارة الأكثر أهمية: المنهجية</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}