// src/bac_year/philosophy.jsx
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

// Philosophy (الفلسفة) - All Streams
const subjectData = {
  id: 'philo',
  name: '🧠 الفلسفة',
  nameEn: 'Philosophy',
  icon: '🧠',
  examDuration: '3h',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'All',
  
  // ============================================
  // PHILOSOPHY-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'analysis_composite',
      name: '📄 تحليل النصوص - الأهم!',
      nameEn: 'Text Analysis',
      description: 'يقيس قدرتك على تحليل النصوص الفلسفية: تحديد الحجج، فهم المفاهيم، واستخراج الأفكار الرئيسية. هذه هي المهارة الأساسية في الفلسفة!',
      improvement: 'تدرب على تحليل النصوص الفلسفية بانتظام - هذا هو مفتاح النجاح!',
      calculate: (data) => {
        return (data.text_analysis || 0 + 
                data.argument_identification || 0 + 
                data.concept_comprehension || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '📄',
      weight: '40-45%'
    },
    {
      id: 'argumentation_composite',
      name: '🎯 الحجاج والجدل',
      nameEn: 'Argumentation',
      description: 'يقيس قدرتك على المقارنة، التركيب، التفكير النقدي، والاستدلال الفلسفي. هذه هي مهارات الحجاج الأساسية.',
      improvement: 'تدرب على المقارنة بين المواقف الفلسفية وبناء حجج قوية',
      calculate: (data) => {
        return (data.comparison_skill || 0 + 
                data.synthesis_skill || 0 + 
                data.critical_thinking || 0 + 
                data.philosophical_reasoning || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '🎯',
      weight: '30-35%'
    },
    {
      id: 'writing_composite',
      name: '✍️ الكتابة الفلسفية',
      nameEn: 'Philosophical Writing',
      description: 'يقيس مهاراتك في كتابة المقال الفلسفي: الهيكلة، وضوح التعبير، وجودة الخاتمة.',
      improvement: 'تعلم هيكلة المقال: مقدمة → عرض → خاتمة، مع وضوح في التعبير',
      calculate: (data) => {
        return (data.essay_structure || 0 + 
                data.clarity_expression || 0 + 
                data.conclusion_skill || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '✍️'
    },
    {
      id: 'reasoning_composite',
      name: '🔍 الاستدلال الفلسفي',
      nameEn: 'Philosophical Reasoning',
      description: 'يقيس قدرتك على طرح الإشكالية، الدفاع عن الأطروحة، التحليل المفاهيمي، والاتساق المنطقي.',
      improvement: 'ركز على صياغة الإشكالية بوضوح وبناء دفاع منطقي عن أطروحتك',
      calculate: (data) => {
        return (data.problematization || 0 + 
                data.thesis_defense || 0 + 
                data.conceptual_analysis || 0 + 
                data.logic_consistency || 0 + 
                data.nuance_handling || 0) / 5;
      },
      target: 6.5,
      max: 10,
      importance: 'high',
      icon: '🔍'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين (تأثير متوسط)',
      nameEn: 'Practice Intensity',
      description: 'يقيس كمية التمارين التي تحلها: المقالات، النصوص المحللة، والامتحانات السابقة. الممارسة تفيد في الفلسفة!',
      improvement: 'حل مقال فلسفي كل أسبوع وحلل 2-3 نصوص أسبوعياً',
      calculate: (data) => {
        return (data.essays_written || 3) / 10 * 10 * 0.4 +
               (data.texts_analyzed || 3) / 15 * 10 * 0.3 +
               (data.past_exams || 2) / 10 * 10 * 0.3;
      },
      target: 6.0,
      max: 10,
      importance: 'medium',
      icon: '⚡'
    },
    {
      id: 'overall_philosophy_score',
      name: '🎯 المستوى العام',
      nameEn: 'Overall Philosophy Level',
      description: 'متوسط مستواك في جميع مهارات الفلسفة: التحليل، الحجاج، الكتابة، والاستدلال.',
      improvement: 'ركز على نقاط ضعفك لرفع مستواك العام',
      calculate: (data) => {
        const analysis = (data.text_analysis || 0 + data.argument_identification || 0 + data.concept_comprehension || 0) / 3;
        const arg = (data.comparison_skill || 0 + data.synthesis_skill || 0 + data.critical_thinking || 0 + data.philosophical_reasoning || 0) / 4;
        const writing = (data.essay_structure || 0 + data.clarity_expression || 0 + data.conclusion_skill || 0) / 3;
        const reasoning = (data.problematization || 0 + data.thesis_defense || 0 + data.conceptual_analysis || 0 + data.logic_consistency || 0 + data.nuance_handling || 0) / 5;
        return (analysis + arg + writing + reasoning) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🎯'
    }
  ],
  
  // ============================================
  // EXAM STRUCTURE
  // ============================================
  examStructure: {
    title: '🧠 امتحان البكالوريا - الفلسفة',
    titleEn: 'Philosophy Baccalaureate Exam',
    streams: [
      {
        name: '🧠 الفلسفة - جميع الشعب',
        nameEn: 'Philosophy - All Streams',
        color: '#9b59b6',
        exercises: [
          {
            name: 'الجزء الأول: تحليل نص فلسفي',
            nameEn: 'Part 1: Philosophical Text Analysis',
            content: 'نص فلسفي مع أسئلة',
            contentEn: 'Philosophical text with questions',
            points: '8 points (40%)',
            subParts: [
              { name: 'فهم النص', points: '2-3 نقاط', skills: 'استخراج الأفكار الرئيسية' },
              { name: 'تحليل الحجج', points: '3-4 نقاط', skills: 'تحديد الحجج والمواقف' },
              { name: 'التعليق', points: '2-3 نقاط', skills: 'نقد وتقييم' }
            ]
          },
          {
            name: 'الجزء الثاني: مقال فلسفي',
            nameEn: 'Part 2: Philosophical Essay',
            content: 'مقال فلسفي حول إشكالية معينة',
            contentEn: 'Philosophical essay on a given problem',
            points: '12 points (60%)',
            subParts: [
              { name: 'الإشكالية', points: '2-3 نقاط', skills: 'صياغة المشكلة' },
              { name: 'العرض', points: '6-7 نقاط', skills: 'تطوير الحجج والأفكار' },
              { name: 'الخاتمة', points: '2-3 نقاط', skills: 'التركيب والخلاصة' }
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
    // Text Analysis (CRITICAL)
    text_analysis: {
      name: '📄 تحليل النصوص الفلسفية',
      nameEn: 'Philosophical Text Analysis',
      target: 7.0,
      importance: 'critical',
      weight: '30-35%',
      category: 'analysis',
      isCore: true
    },
    argument_identification: {
      name: '🎯 تحديد الحجج',
      nameEn: 'Argument Identification',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'analysis'
    },
    concept_comprehension: {
      name: '🧠 فهم المفاهيم',
      nameEn: 'Concept Comprehension',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'analysis'
    },
    // Argumentation
    comparison_skill: {
      name: '⚖️ المقارنة بين المواقف',
      nameEn: 'Comparison of Positions',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'argumentation'
    },
    synthesis_skill: {
      name: '🔗 التركيب',
      nameEn: 'Synthesis',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'argumentation'
    },
    critical_thinking: {
      name: '🎯 التفكير النقدي',
      nameEn: 'Critical Thinking',
      target: 7.0,
      importance: 'critical',
      weight: '25-30%',
      category: 'argumentation',
      isCore: true
    },
    philosophical_reasoning: {
      name: '🧠 الاستدلال الفلسفي',
      nameEn: 'Philosophical Reasoning',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'argumentation'
    },
    // Writing
    essay_structure: {
      name: '📝 هيكلة المقال',
      nameEn: 'Essay Structure',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'writing'
    },
    clarity_expression: {
      name: '🗣️ وضوح التعبير',
      nameEn: 'Clarity of Expression',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'writing'
    },
    conclusion_skill: {
      name: '📌 الخاتمة',
      nameEn: 'Conclusion',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'writing'
    },
    // Reasoning
    problematization: {
      name: '❓ الإشكالية',
      nameEn: 'Problematization',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'reasoning'
    },
    thesis_defense: {
      name: '🛡️ الدفاع عن الأطروحة',
      nameEn: 'Thesis Defense',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'reasoning'
    },
    conceptual_analysis: {
      name: '🔍 التحليل المفاهيمي',
      nameEn: 'Conceptual Analysis',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'reasoning'
    },
    logic_consistency: {
      name: '🧩 المنطق والاتساق',
      nameEn: 'Logic and Consistency',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'reasoning'
    },
    nuance_handling: {
      name: '🎯 التعامل مع الفروق الدقيقة',
      nameEn: 'Handling Nuance',
      target: 5.5,
      importance: 'low',
      weight: '10-15%',
      category: 'reasoning'
    },
    example_usage: {
      name: '📚 استخدام الأمثلة',
      nameEn: 'Using Examples',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'reasoning'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    essays_written: {
      name: '📝 عدد المقالات المكتوبة أسبوعياً',
      nameEn: 'Essays Written per Week',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.035
    },
    texts_analyzed: {
      name: '📄 عدد النصوص المحللة أسبوعياً',
      nameEn: 'Texts Analyzed per Week',
      target: 8,
      max: 15,
      category: 'practice',
      impact: 0.030
    },
    past_exams: {
      name: '📚 عدد امتحانات البكالوريا المحلولة',
      nameEn: 'Past BAC Exams Solved',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.025
    },
    study_hours: {
      name: '⏰ ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 4,
      max: 12,
      category: 'study',
      impact: 0.020
    },
    consistency: {
      name: '📅 الانتظام في الدراسة',
      nameEn: 'Study Consistency',
      target: 7,
      max: 10,
      category: 'study',
      impact: 0.030
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    philo_anxiety: {
      name: '😰 قلق الفلسفة',
      nameEn: 'Philosophy Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.015
    },
    writing_confidence: {
      name: '✍️ الثقة في الكتابة الفلسفية',
      nameEn: 'Writing Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.025
    },
    confidence_level: {
      name: '💪 الثقة في النفس',
      nameEn: 'Self-Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.020
    },
    interest_in_subject: {
      name: '❤️ الاهتمام بالفلسفة',
      nameEn: 'Interest in Philosophy',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.025
    },
    stress_level: {
      name: '😓 مستوى التوتر',
      nameEn: 'Stress Level',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.010
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '📄 تحليل النصوص هو المهارة الأكثر أهمية - 40% من النقاط تعتمد عليه!',
    '🎯 الحجاج والجدل أساسيان في المقال الفلسفي - تدرب على المقارنة والتركيب',
    '✍️ هيكل المقال: مقدمة (إشكالية) → عرض (حجج) → خاتمة (تركيب)',
    '🔍 الاستدلال الفلسفي يحتاج إلى منطق واتساق - تأكد من ترابط أفكارك',
    '📚 استخدم الأمثلة لتوضيح أفكارك - هذا يرفع نقطتك',
    '📝 اكتب مقالاً فلسفياً كل أسبوع - الممارسة تطور مهاراتك',
    '📄 حلل 2-3 نصوص فلسفية أسبوعياً للتعود على نمط الأسئلة',
    '😌 الفلسفة تحتاج إلى هدوء - التوتر يقلل من قدرتك على التفكير العميق'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '📄 تحليل النصوص', weight: '40-45%', color: '#e74c3c' },
    { skill: '🎯 الحجاج والجدل', weight: '30-35%', color: '#e67e22' },
    { skill: '✍️ الكتابة الفلسفية', weight: '25-30%', color: '#f1c40f' },
    { skill: '🔍 الاستدلال الفلسفي', weight: '20-25%', color: '#2ecc71' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '📄 تحليل النصوص (40% من النقاط)',
    examDuration: '3 ساعات',
    totalPoints: '20 نقطة',
    parts: 'جزآن (8 + 12 نقاط)',
    psychImpact: 'متوسط - الثقة والقلق يؤثران على الأداء'
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
export default function Philosophy() {
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
    console.log('🧠 PHILOSOPHY - Using fallback calculation');
    
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    // Analysis
    const analysis = (data.text_analysis || 5 + 
                      data.argument_identification || 5 + 
                      data.concept_comprehension || 5) / 3;
    
    // Argumentation
    const arg = (data.comparison_skill || 5 + 
                 data.synthesis_skill || 5 + 
                 data.critical_thinking || 5 + 
                 data.philosophical_reasoning || 5) / 4;
    
    // Writing
    const writing = (data.essay_structure || 5 + 
                     data.clarity_expression || 5 + 
                     data.conclusion_skill || 5) / 3;
    
    // Reasoning
    const reasoning = (data.problematization || 5 + 
                       data.thesis_defense || 5 + 
                       data.conceptual_analysis || 5 + 
                       data.logic_consistency || 5 + 
                       data.nuance_handling || 5) / 5;
    
    // Practice
    const practice = (data.essays_written || 3) / 10 * 10 * 0.4 +
                     (data.texts_analyzed || 3) / 15 * 10 * 0.3 +
                     (data.past_exams || 2) / 10 * 10 * 0.3;
    
    // Psychological
    const psych = (data.confidence_level || 5 + 
                   data.writing_confidence || 5 + 
                   data.interest_in_subject || 5 + 
                   (10 - (data.philo_anxiety || 5)) + 
                   (10 - (data.stress_level || 5))) / 5;
    
    // Derived features
    const derivedFeatures = {
      analysis_composite: Math.round(analysis * 100) / 100,
      argumentation_composite: Math.round(arg * 100) / 100,
      writing_composite: Math.round(writing * 100) / 100,
      reasoning_composite: Math.round(reasoning * 100) / 100,
      practice_intensity: Math.round(Math.min(10, Math.max(0, practice)) * 100) / 100,
      overall_philosophy_score: Math.round(((analysis + arg + writing + reasoning) / 4) * 100) / 100,
      psychological_composite: Math.round(Math.min(10, Math.max(0, psych)) * 100) / 100,
      imbalance_score: Math.round((() => {
        const skills = [analysis, arg, writing, reasoning];
        const avg = skills.reduce((a, b) => a + b, 0) / skills.length;
        return skills.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / skills.length;
      })() * 100) / 100
    };
    
    // Weights
    const analysisWeight = 0.30;
    const argWeight = 0.25;
    const writingWeight = 0.15;
    const reasoningWeight = 0.15;
    const practiceWeight = 0.08;
    const psychWeight = 0.04;
    const gradeWeight = 0.03;
    
    const totalWeight = analysisWeight + argWeight + writingWeight + reasoningWeight + practiceWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      analysis * analysisWeight +
      arg * argWeight +
      writing * writingWeight +
      reasoning * reasoningWeight +
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
      text_analysis: { name: 'تحليل النصوص', target: 7.0 },
      argument_identification: { name: 'تحديد الحجج', target: 6.5 },
      concept_comprehension: { name: 'فهم المفاهيم', target: 6.5 },
      comparison_skill: { name: 'المقارنة', target: 6.0 },
      synthesis_skill: { name: 'التركيب', target: 6.5 },
      critical_thinking: { name: 'التفكير النقدي', target: 7.0 },
      philosophical_reasoning: { name: 'الاستدلال الفلسفي', target: 6.5 },
      essay_structure: { name: 'هيكلة المقال', target: 7.0 },
      clarity_expression: { name: 'وضوح التعبير', target: 6.5 },
      conclusion_skill: { name: 'الخاتمة', target: 6.0 },
      problematization: { name: 'الإشكالية', target: 6.5 },
      thesis_defense: { name: 'الدفاع عن الأطروحة', target: 6.0 },
      conceptual_analysis: { name: 'التحليل المفاهيمي', target: 6.5 },
      logic_consistency: { name: 'المنطق والاتساق', target: 6.0 },
      nuance_handling: { name: 'الفروق الدقيقة', target: 5.5 },
      example_usage: { name: 'استخدام الأمثلة', target: 6.0 }
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

      console.log('🧠 Sending philo prediction request:', data);

      // ✅ FIXED: Changed from 'philosophy' to 'philo'
      const response = await fetch(`${API_URL}/api/bacyear/philo/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('🧠 API Response:', result);

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
    console.log('🧠 PHILOSOPHY - Form Data Submitted:', data);
    console.log('🧠 PHILOSOPHY - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('🧠 PHILOSOPHY - Result:', result);
      console.log('🧠 PHILOSOPHY - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('🧠 PHILOSOPHY - featureData set to:', result.derived_features);
      
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
            🧠 جميع الشعب
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
        <span>🧠 الفلسفة - جميع الشعب</span>
        <span>⭐ المهارة الأكثر أهمية: تحليل النصوص</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}