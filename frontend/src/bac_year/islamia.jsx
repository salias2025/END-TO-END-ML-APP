// src/bac_year/islamia.jsx
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

// Islamic Sciences (العلوم الإسلامية - Islamia) - All Streams
const subjectData = {
  id: 'islamia',
  name: '🕌 العلوم الإسلامية',
  nameEn: 'Islamic Sciences',
  icon: '🕌',
  examDuration: '2h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'All',
  
  // ============================================
  // ISLAMIA-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'analysis_composite',
      name: '📄 تحليل النصوص - الأهم!',
      nameEn: 'Text Analysis',
      description: 'أهم مؤشر! يقيس قدرتك على تحليل النصوص الشرعية: الآيات القرآنية، الأحاديث النبوية، والوثائق. هذا هو مفتاح النجاح في البكالوريا!',
      improvement: 'تدرب على تحليل الآيات والأحاديث بطريقة منهجية - هذا هو مفتاح النجاح في البكالوريا!',
      calculate: (data) => {
        return (data.ayah_analysis || 0 + 
                data.hadith_text_analysis || 0 + 
                data.document_analysis || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '📄',
      weight: '40-45%'
    },
    {
      id: 'methodology_composite',
      name: '✍️ منهجية الإجابة',
      nameEn: 'Answer Methodology',
      description: 'يقيس طريقة كتابة إجابتك: دقة التعريفات، وضوح الشرح، استخدام الأدلة، وتنظيم الإجابة. منهجية الإجابة هي أساس النجاح!',
      improvement: 'تعلم هيكلة الإجابة: تعريف → شرح → استدلال → خاتمة',
      calculate: (data) => {
        return (data.definition_accuracy || 0 + 
                data.explanation_clarity || 0 + 
                data.evidence_usage || 0 + 
                data.structured_answer || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '✍️',
      weight: '30-35%'
    },
    {
      id: 'quran_composite',
      name: '🕌 القرآن والتفسير',
      nameEn: 'Quran & Tafsir',
      description: 'يقيس مستواك في القرآن الكريم: تلاوته، فهم تفسيره، والاستدلال من آياته.',
      improvement: 'راجع تفسير القرآن الكريم وافهم أسباب النزول',
      calculate: (data) => {
        return (data.quran_recitation || 0 + 
                data.tafsir_understanding || 0 + 
                data.reasoning_from_verses || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🕌'
    },
    {
      id: 'hadith_composite',
      name: '📜 الحديث الشريف',
      nameEn: 'Hadith Studies',
      description: 'يقيس مستواك في الحديث النبوي: فهم الأحاديث، تحليلها، واستخراج العبر منها.',
      improvement: 'تدرب على تحليل الأحاديث: شرح المفردات → المعنى العام → الاستنباط',
      calculate: (data) => {
        return (data.hadith_comprehension || 0 + 
                data.hadith_analysis || 0 + 
                data.moral_extraction || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '📜'
    },
    {
      id: 'fiqh_composite',
      name: '⚖️ الفقه الإسلامي',
      nameEn: 'Islamic Fiqh',
      description: 'يقيس مستواك في الفقه الإسلامي: فقه العبادات، فقه المعاملات، وأحكام الربا.',
      improvement: 'راجع أحكام العبادات والمعاملات - خاصة أحكام البيع والربا',
      calculate: (data) => {
        return (data.fiqh_ibadah || 0 + 
                data.fiqh_muamalat || 0 + 
                data.riba_understanding || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '⚖️'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين (تأثير محدود)',
      nameEn: 'Practice Intensity',
      description: 'يقيس كمية التمارين التي تحلها. تأثيرها محدود في العلوم الإسلامية - الأهم هو فهم المنهجية.',
      improvement: 'حل 3-4 امتحانات سابقة للتعود على نمط الأسئلة',
      calculate: (data) => {
        return (data.quran_exercises || 3 + 
                data.hadith_exercises || 3 + 
                data.fiqh_cases || 3 + 
                data.past_exams || 3) / 40 * 10;
      },
      target: 6.0,
      max: 10,
      importance: 'low',
      icon: '⚡'
    },
    {
      id: 'overall_islamia',
      name: '🎯 المستوى العام',
      nameEn: 'Overall Islamic Level',
      description: 'متوسط مستواك في جميع فروع العلوم الإسلامية: التحليل، المنهجية، القرآن، الحديث، والفقه.',
      improvement: 'ركز على نقاط ضعفك لرفع مستواك العام',
      calculate: (data) => {
        const analysis = (data.ayah_analysis || 0 + data.hadith_text_analysis || 0 + data.document_analysis || 0) / 3;
        const methodology = (data.definition_accuracy || 0 + data.explanation_clarity || 0 + 
                           data.evidence_usage || 0 + data.structured_answer || 0) / 4;
        const quran = (data.quran_recitation || 0 + data.tafsir_understanding || 0 + data.reasoning_from_verses || 0) / 3;
        const hadith = (data.hadith_comprehension || 0 + data.hadith_analysis || 0 + data.moral_extraction || 0) / 3;
        const fiqh = (data.fiqh_ibadah || 0 + data.fiqh_muamalat || 0 + data.riba_understanding || 0) / 3;
        return (analysis + methodology + quran + hadith + fiqh) / 5;
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
    title: '🕌 امتحان البكالوريا - العلوم الإسلامية',
    titleEn: 'Islamic Sciences Baccalaureate Exam',
    streams: [
      {
        name: '🕌 العلوم الإسلامية - جميع الشعب',
        nameEn: 'Islamic Sciences - All Streams',
        color: '#27ae60',
        exercises: [
          {
            name: 'الجزء الأول: تحليل نصوص شرعية',
            nameEn: 'Part 1: Islamic Text Analysis',
            content: 'آيات قرآنية + أحاديث + أسئلة موضوعية',
            contentEn: 'Quranic verses + Hadiths + Objective questions',
            points: '12 points (60%)',
            subParts: [
              { name: 'تحليل الآيات القرآنية', points: '4-5 نقاط', skills: 'تفسير، استنباط، أسباب النزول' },
              { name: 'تحليل الأحاديث النبوية', points: '4-5 نقاط', skills: 'شرح المفردات، المعنى العام، الاستنباط' },
              { name: 'الأسئلة الموضوعية', points: '2-3 نقاط', skills: 'تعريفات، مفاهيم' }
            ]
          },
          {
            name: 'الجزء الثاني: مسائل فقهية',
            nameEn: 'Part 2: Fiqh Questions',
            content: 'مسائل فقهية + وراثة + تطبيقات',
            contentEn: 'Fiqh issues + Inheritance + Applications',
            points: '8 points (40%)',
            subParts: [
              { name: 'فقه العبادات', points: '2-3 نقاط', skills: 'الصلاة، الزكاة، الصوم، الحج' },
              { name: 'فقه المعاملات', points: '3-4 نقاط', skills: 'البيع، الربا، الشركة' },
              { name: 'الوراثة', points: '1-2 نقاط', skills: 'الفرائض' }
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
    // Quran & Tafsir
    quran_recitation: {
      name: '📖 تلاوة القرآن',
      nameEn: 'Quran Recitation',
      target: 7.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'quran'
    },
    tafsir_understanding: {
      name: '📚 فهم التفسير',
      nameEn: 'Tafsir Understanding',
      target: 7.0,
      importance: 'high',
      weight: '15-20%',
      category: 'quran',
      isCore: true
    },
    reasoning_from_verses: {
      name: '🧠 الاستدلال من الآيات',
      nameEn: 'Reasoning from Verses',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'quran'
    },
    // Hadith
    hadith_comprehension: {
      name: '📖 فهم الحديث',
      nameEn: 'Hadith Comprehension',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'hadith'
    },
    hadith_analysis: {
      name: '🔍 تحليل الحديث',
      nameEn: 'Hadith Analysis',
      target: 7.0,
      importance: 'high',
      weight: '15-20%',
      category: 'hadith',
      isCore: true
    },
    moral_extraction: {
      name: '💎 استخراج العبر',
      nameEn: 'Moral Extraction',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'hadith'
    },
    // Fiqh
    fiqh_ibadah: {
      name: '🕋 فقه العبادات',
      nameEn: 'Fiqh of Worship',
      target: 7.0,
      importance: 'high',
      weight: '15-20%',
      category: 'fiqh'
    },
    fiqh_muamalat: {
      name: '💰 فقه المعاملات',
      nameEn: 'Fiqh of Transactions',
      target: 7.0,
      importance: 'high',
      weight: '15-20%',
      category: 'fiqh',
      isCore: true
    },
    riba_understanding: {
      name: '⚠️ فهم الربا',
      nameEn: 'Understanding Riba (Interest)',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'fiqh'
    },
    // Aqida (Creed)
    aqida_understanding: {
      name: '🕋 فهم العقيدة',
      nameEn: 'Aqida Understanding',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'aqida'
    },
    proofs_awareness: {
      name: '📚 الأدلة الشرعية',
      nameEn: 'Islamic Proofs',
      target: 6.5,
      importance: 'medium',
      weight: '10-15%',
      category: 'aqida'
    },
    // Text Analysis (CRITICAL)
    ayah_analysis: {
      name: '🕌 تحليل الآيات القرآنية',
      nameEn: 'Quranic Verse Analysis',
      target: 7.0,
      importance: 'critical',
      weight: '25-30%',
      category: 'analysis',
      isCore: true
    },
    hadith_text_analysis: {
      name: '📜 تحليل النصوص الحديثية',
      nameEn: 'Hadith Text Analysis',
      target: 7.0,
      importance: 'critical',
      weight: '25-30%',
      category: 'analysis',
      isCore: true
    },
    document_analysis: {
      name: '📄 تحليل الوثائق',
      nameEn: 'Document Analysis',
      target: 7.5,
      importance: 'critical',
      weight: '25-30%',
      category: 'analysis',
      isCore: true
    },
    // Answer Methodology (CRITICAL)
    definition_accuracy: {
      name: '📖 دقة التعريفات',
      nameEn: 'Definition Accuracy',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'methodology'
    },
    explanation_clarity: {
      name: '🗣️ وضوح الشرح',
      nameEn: 'Explanation Clarity',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'methodology'
    },
    evidence_usage: {
      name: '📚 استخدام الأدلة',
      nameEn: 'Evidence Usage',
      target: 6.5,
      importance: 'high',
      weight: '15-20%',
      category: 'methodology'
    },
    structured_answer: {
      name: '📝 الإجابة المنظمة',
      nameEn: 'Structured Answer',
      target: 7.5,
      importance: 'critical',
      weight: '20-25%',
      category: 'methodology',
      isCore: true
    }
  },
  
  // ============================================
  // HABITS (LOW IMPACT)
  // ============================================
  habits: {
    quran_exercises: {
      name: '🕌 تمارين قرآنية',
      nameEn: 'Quran Exercises',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.01
    },
    hadith_exercises: {
      name: '📜 تمارين حديثية',
      nameEn: 'Hadith Exercises',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.01
    },
    fiqh_cases: {
      name: '⚖️ مسائل فقهية',
      nameEn: 'Fiqh Cases',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.01
    },
    past_exams: {
      name: '📝 امتحانات سابقة',
      nameEn: 'Past Exams',
      target: 5,
      max: 10,
      category: 'practice',
      impact: 0.02
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS (VERY LOW IMPACT)
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
    confidence: {
      name: '💪 الثقة في النفس',
      nameEn: 'Self-Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.01
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '📄 تحليل النصوص هو المهارة الأكثر أهمية - 40% من النقاط تعتمد عليه!',
    '✍️ منهجية الإجابة: تعريف → شرح → استدلال → خاتمة',
    '🕌 راجع تفسير القرآن الكريم وأسباب النزول',
    '📜 تدرب على تحليل الأحاديث: شرح المفردات → المعنى العام → الاستنباط',
    '⚖️ فقه المعاملات (البيع، الربا، الشركة) يأتي بكثرة في الجزء الثاني',
    '📖 استخدم الأدلة (آيات وأحاديث) في إجاباتك',
    '📝 حل 3-4 امتحانات سابقة للتعود على نمط الأسئلة',
    '😌 التوتر تأثيره ضعيف جداً - هذه المادة ليست مرهقة'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '📄 تحليل النصوص (الآيات + الأحاديث)', weight: '40-45%', color: '#e74c3c' },
    { skill: '✍️ منهجية الإجابة', weight: '30-35%', color: '#e67e22' },
    { skill: '⚖️ فقه المعاملات', weight: '15-20%', color: '#f1c40f' },
    { skill: '🕌 القرآن والتفسير', weight: '15-20%', color: '#2ecc71' },
    { skill: '📜 الحديث الشريف', weight: '15-20%', color: '#9b59b6' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '📄 تحليل النصوص (40% من النقاط)',
    examDuration: '2 ساعة و30 دقيقة',
    totalPoints: '20 نقطة',
    parts: 'جزآن (12 + 8 نقاط)',
    psychImpact: 'ضعيف جداً - المادة ليست مرهقة'
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
export default function Islamia() {
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
    console.log('🕌 ISLAMIA - Using fallback calculation');
    
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    // Analysis (MOST IMPORTANT)
    const analysis = (data.ayah_analysis || 5 + 
                      data.hadith_text_analysis || 5 + 
                      data.document_analysis || 5) / 3;
    
    // Methodology
    const methodology = (data.definition_accuracy || 5 + 
                         data.explanation_clarity || 5 + 
                         data.evidence_usage || 5 + 
                         data.structured_answer || 5) / 4;
    
    // Quran
    const quran = (data.quran_recitation || 5 + 
                   data.tafsir_understanding || 5 + 
                   data.reasoning_from_verses || 5) / 3;
    
    // Hadith
    const hadith = (data.hadith_comprehension || 5 + 
                    data.hadith_analysis || 5 + 
                    data.moral_extraction || 5) / 3;
    
    // Fiqh
    const fiqh = (data.fiqh_ibadah || 5 + 
                  data.fiqh_muamalat || 5 + 
                  data.riba_understanding || 5) / 3;
    
    // Practice (LOW impact)
    const practice = (data.quran_exercises || 3 + 
                      data.hadith_exercises || 3 + 
                      data.fiqh_cases || 3 + 
                      data.past_exams || 3) / 40 * 10;
    
    // Psychological (VERY LOW impact)
    const psych = (data.confidence || 7 + 
                   (10 - (data.stress_level || 5))) / 2;
    
    // Derived features for fallback
    const derivedFeatures = {
      analysis_composite: Math.round(analysis * 100) / 100,
      methodology_composite: Math.round(methodology * 100) / 100,
      quran_composite: Math.round(quran * 100) / 100,
      hadith_composite: Math.round(hadith * 100) / 100,
      fiqh_composite: Math.round(fiqh * 100) / 100,
      practice_intensity: Math.round(Math.min(10, Math.max(0, practice)) * 100) / 100,
      overall_islamia: Math.round(((analysis + methodology + quran + hadith + fiqh) / 5) * 100) / 100
    };
    
    // Weights
    const analysisWeight = 0.35;
    const methodWeight = 0.25;
    const contentWeight = 0.20;
    const practiceWeight = 0.08;
    const psychWeight = 0.04;
    const gradeWeight = 0.08;
    
    const totalWeight = analysisWeight + methodWeight + contentWeight + practiceWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      analysis * analysisWeight +
      methodology * methodWeight +
      (quran + hadith + fiqh) / 3 * contentWeight +
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
      quran_recitation: { name: 'تلاوة القرآن', target: 7.0 },
      tafsir_understanding: { name: 'فهم التفسير', target: 7.0 },
      reasoning_from_verses: { name: 'الاستدلال من الآيات', target: 6.5 },
      hadith_comprehension: { name: 'فهم الحديث', target: 6.5 },
      hadith_analysis: { name: 'تحليل الحديث', target: 7.0 },
      moral_extraction: { name: 'استخراج العبر', target: 6.5 },
      fiqh_ibadah: { name: 'فقه العبادات', target: 7.0 },
      fiqh_muamalat: { name: 'فقه المعاملات', target: 7.0 },
      riba_understanding: { name: 'فهم الربا', target: 6.5 },
      aqida_understanding: { name: 'فهم العقيدة', target: 6.5 },
      proofs_awareness: { name: 'الأدلة الشرعية', target: 6.5 },
      ayah_analysis: { name: 'تحليل الآيات القرآنية', target: 7.0 },
      hadith_text_analysis: { name: 'تحليل النصوص الحديثية', target: 7.0 },
      document_analysis: { name: 'تحليل الوثائق', target: 7.5 },
      definition_accuracy: { name: 'دقة التعريفات', target: 6.5 },
      explanation_clarity: { name: 'وضوح الشرح', target: 6.5 },
      evidence_usage: { name: 'استخدام الأدلة', target: 6.5 },
      structured_answer: { name: 'الإجابة المنظمة', target: 7.5 }
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

      console.log('🕌 Sending islamia prediction request:', data);

      const response = await fetch(`${API_URL}/api/bacyear/islamia/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('🕌 API Response:', result);

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
    console.log('🕌 ISLAMIA - Form Data Submitted:', data);
    console.log('🕌 ISLAMIA - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('🕌 ISLAMIA - Result:', result);
      console.log('🕌 ISLAMIA - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('🕌 ISLAMIA - featureData set to:', result.derived_features);
      
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
            🕌 جميع الشعب
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
        <span>🕌 العلوم الإسلامية - جميع الشعب</span>
        <span>⭐ المهارة الأكثر أهمية: تحليل النصوص</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}