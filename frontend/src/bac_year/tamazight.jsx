// src/bac_year/tamazight.jsx
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

// Tamazight (Amazigh) subject specific data
const subjectData = {
  id: 'tamazight',
  name: '📖 اللغة الأمازيغية',
  nameEn: 'Tamazight',
  icon: '📖',
  examDuration: '2h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  
  // ============================================
  // TAMAZIGHT-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'language_core_score',
      name: '🔤 مستوى القواعد النحوية (Amigaw/Asentel)',
      nameEn: 'Grammar Mastery',
      description: 'يقيس قدرتك على تحديد الأفعال، تحليل الفاعل والمفعول، وفهم بنية الجملة في اللغة الأمازيغية.',
      improvement: 'تدرب على تصريف الأفعال في الأزمنة المختلفة (الحاضر، الماضي، المستقبل) وركز على تحديد الفاعل والمفعول به.',
      calculate: (data) => {
        const skills = [
          data.verb_identification || 0,
          data.subject_object_analysis || 0,
          data.sentence_decomposition || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '🔤'
    },
    {
      id: 'morphology_score',
      name: '🌱 مستوى الصرف (جذور الكلمات)',
      nameEn: 'Morphology & Root Patterns',
      description: 'يقيس معرفتك بجذور الكلمات الأمازيغية وقدرتك على اشتقاق الكلمات من الأوزان الصرفية المختلفة.',
      improvement: 'احفظ الأوزان الصرفية الأساسية وتدرب على اشتقاق الكلمات من جذورها الثلاثية والرباعية.',
      calculate: (data) => {
        return data.morphology_root_pattern || 0;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🌱'
    },
    {
      id: 'reading_comprehension',
      name: '📖 مستوى الفهم والاستيعاب',
      nameEn: 'Reading Comprehension',
      description: 'يقيس قدرتك على فهم النصوص الأمازيغية، استخراج الأفكار الرئيسية، وتحديد الشخصيات وترتيب الأحداث.',
      improvement: 'اقرأ نصوصاً أمازيغية قصيرة يومياً وحاول تلخيصها واستخراج الأفكار الرئيسية منها.',
      calculate: (data) => {
        const skills = [
          data.main_idea_detection || 0,
          data.narrative_understanding || 0,
          data.character_identification || 0,
          data.event_ordering || 0,
          data.implicit_meaning || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '📖'
    },
    {
      id: 'writing_score',
      name: '✍️ مستوى التعبير الكتابي',
      nameEn: 'Writing Production',
      description: 'يقيس قدرتك على كتابة نصوص سردية ووصفية بشكل منظم ومتماسك مع استخدام دقيق للمفردات.',
      improvement: 'اكتب فقرة قصيرة كل أسبوع حول موضوع يهمك وركز على تنظيم الأفكار واستخدام أدوات الربط.',
      calculate: (data) => {
        const skills = [
          data.narrative_writing || 0,
          data.descriptive_writing || 0,
          data.coherence_score || 0,
          data.paragraph_structure || 0,
          data.vocabulary_accuracy || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '✍️'
    },
    {
      id: 'cultural_heritage',
      name: '🏛️ مستوى التراث الثقافي',
      nameEn: 'Cultural Heritage',
      description: 'يقيس معرفتك بالتراث الأمازيغي، الحكايات الشعبية، العادات والتقاليد (ينّاير، تاقروست).',
      improvement: 'اقرأ عن التراث الأمازيغي وتعلم الحكايات الشعبية والتعرف على المناسبات والأعياد الأمازيغية.',
      calculate: (data) => {
        const skills = [
          data.cultural_heritage || 0,
          data.oral_tradition_awareness || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 6.5,
      max: 10,
      importance: 'medium',
      icon: '🏛️'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل تمارين اللغة الأمازيغية وقراءة النصوص وتحليلها.',
      improvement: 'حل امتحانات بكالوريا سابقة، اقرأ نصوصاً أمازيغية يومياً، وحلل نصوصاً أسبوعياً.',
      calculate: (data) => {
        const writing = data.writing_frequency || 0;
        const reading = data.reading_frequency || 0;
        const textAnalysis = data.text_analysis_practice || 0;
        const examPrep = data.exam_preparation || 0;
        return (writing * 2 + reading + textAnalysis + examPrep / 3) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '⚡'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس مدى توازن مهاراتك في القواعد، الصرف، الفهم، والكتابة. كلما كان الرقم أقل كلما كانت مهاراتك أكثر توازناً.',
      improvement: 'حدد مهاراتك الأضعف وركز على تحسينها للحصول على توازن أفضل.',
      calculate: (data) => {
        const skills = [
          data.verb_identification || 0,
          data.morphology_root_pattern || 0,
          data.main_idea_detection || 0,
          data.narrative_writing || 0
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
    title: '📖 امتحان البكالوريا - اللغة الأمازيغية',
    titleEn: 'Tamazight Baccalaureate Exam',
    streams: [
      {
        name: '📖 اللغة الأمازيغية - جميع الشعب',
        nameEn: 'Tamazight - All Streams',
        color: '#3498db',
        exercises: [
          { 
            name: '📖 الجزء الأول: دراسة النص (12 نقطة)', 
            nameEn: 'Part 1: Text Study (12 points)',
            content: 'أسئلة الفهم، أسئلة اللغة، أسئلة البلاغة والأسلوب، أسئلة الثقافة والتراث', 
            contentEn: 'Comprehension, Language, Rhetoric & Style, Culture & Heritage',
            points: '12 points (60%)',
            subParts: [
              { name: 'أسئلة الفهم', points: '4-6 نقاط', skills: 'فهم النص، استخراج الأفكار، تحديد الشخصيات' },
              { name: 'أسئلة اللغة', points: '4-5 نقاط', skills: 'تحليل الجمل، تحديد الأفعال، الصرف' },
              { name: 'أسئلة البلاغة والأسلوب', points: '2-3 نقاط', skills: 'تحليل الأساليب والصور البيانية' },
              { name: 'أسئلة الثقافة والتراث', points: '1-2 نقطة', skills: 'المعرفة بالتراث والحكايات الشعبية الأمازيغية' }
            ]
          },
          { 
            name: '✍️ الجزء الثاني: التعبير الكتابي (8 نقاط)', 
            nameEn: 'Part 2: Written Expression (8 points)',
            content: 'الموضوع والتنظيم، اللغة والأسلوب، المحتوى والإبداع', 
            contentEn: 'Topic & Organization, Language & Style, Content & Creativity',
            points: '8 points (40%)',
            subParts: [
              { name: 'الموضوع والتنظيم', points: '2 نقطة', skills: 'ترتيب الأفكار، بناء الفقرات' },
              { name: 'اللغة والأسلوب', points: '3 نقاط', skills: 'سلامة اللغة، دقة المفردات، تنوع التراكيب' },
              { name: 'المحتوى والإبداع', points: '3 نقاط', skills: 'الإجابة عن المطلوب، الأفكار الإبداعية' }
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
    // Reading Skills
    main_idea_detection: {
      name: '📖 استخراج الأفكار الرئيسية',
      nameEn: 'Main Idea Detection',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'reading'
    },
    narrative_understanding: {
      name: '📖 فهم النصوص السردية',
      nameEn: 'Narrative Text Understanding',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'reading'
    },
    character_identification: {
      name: '👤 تحديد الشخصيات',
      nameEn: 'Character Identification',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'reading'
    },
    event_ordering: {
      name: '📅 ترتيب الأحداث',
      nameEn: 'Event Ordering',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'reading'
    },
    implicit_meaning: {
      name: '💭 استنتاج المعاني الضمنية',
      nameEn: 'Implicit Meaning Inference',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'reading'
    },
    // Grammar Skills
    verb_identification: {
      name: '🔤 تحديد الأفعال (Amigaw)',
      nameEn: 'Verb Identification',
      target: 7.5,
      importance: 'high',
      weight: '35-40%',
      category: 'grammar',
      isCore: true
    },
    subject_object_analysis: {
      name: '📖 تحليل الفاعل والمفعول (Asentel)',
      nameEn: 'Subject & Object Analysis',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'grammar',
      isCore: true
    },
    sentence_decomposition: {
      name: '✂️ تحليل الجملة',
      nameEn: 'Sentence Decomposition',
      target: 6.5,
      importance: 'medium',
      weight: '25-30%',
      category: 'grammar'
    },
    shifter_identification: {
      name: '⏰ تحديد أدوات الزمان والمكان',
      nameEn: 'Time & Space Markers',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'grammar'
    },
    morphology_root_pattern: {
      name: '🌱 الصرف (جذور الكلمات)',
      nameEn: 'Morphology & Root Patterns',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'grammar',
      isCore: true
    },
    // Writing Skills
    narrative_writing: {
      name: '✍️ الكتابة السردية',
      nameEn: 'Narrative Writing',
      target: 6.5,
      importance: 'medium',
      weight: '25-30%',
      category: 'writing'
    },
    descriptive_writing: {
      name: '✍️ الكتابة الوصفية',
      nameEn: 'Descriptive Writing',
      target: 6.5,
      importance: 'medium',
      weight: '25-30%',
      category: 'writing'
    },
    coherence_score: {
      name: '🔗 الترابط والتماسك',
      nameEn: 'Coherence & Cohesion',
      target: 6.5,
      importance: 'medium',
      weight: '25-30%',
      category: 'writing'
    },
    paragraph_structure: {
      name: '📝 تنظيم الفقرات',
      nameEn: 'Paragraph Structure',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'writing'
    },
    vocabulary_accuracy: {
      name: '📚 دقة المفردات',
      nameEn: 'Vocabulary Accuracy',
      target: 6.5,
      importance: 'medium',
      weight: '25-30%',
      category: 'writing'
    },
    // Cultural Skills
    synonym_knowledge: {
      name: '📖 معرفة المترادفات',
      nameEn: 'Synonym Knowledge',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'culture'
    },
    antonym_knowledge: {
      name: '📖 معرفة المتضادات',
      nameEn: 'Antonym Knowledge',
      target: 6.5,
      importance: 'medium',
      weight: '20-25%',
      category: 'culture'
    },
    cultural_heritage: {
      name: '🏛️ التراث الثقافي الأمازيغي',
      nameEn: 'Amazigh Cultural Heritage',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'culture'
    },
    oral_tradition_awareness: {
      name: '🎙️ الحكايات والتقاليد الشفوية',
      nameEn: 'Oral Traditions & Folk Tales',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'culture'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    exam_preparation: { 
      name: '📚 عدد امتحانات البكالوريا المحلولة', 
      nameEn: 'Past BAC exams solved',
      target: 10, 
      max: 20,
      category: 'practice'
    },
    reading_frequency: { 
      name: '📖 قراءة النصوص أسبوعياً', 
      nameEn: 'Reading texts per week',
      target: 4, 
      max: 5,
      category: 'practice'
    },
    writing_frequency: { 
      name: '✍️ كتابة النصوص أسبوعياً', 
      nameEn: 'Writing texts per week',
      target: 3, 
      max: 5,
      category: 'practice'
    },
    text_analysis_practice: { 
      name: '🔍 تحليل النصوص أسبوعياً', 
      nameEn: 'Text analysis per week',
      target: 4, 
      max: 5,
      category: 'practice'
    },
    study_hours: { 
      name: '⏰ ساعات الدراسة الأسبوعية', 
      nameEn: 'Study hours per week',
      target: 6, 
      max: 12,
      category: 'practice'
    },
    consistency: { 
      name: '📅 الانتظام في الدراسة (1-5)', 
      nameEn: 'Study consistency (1-5)',
      target: 4, 
      max: 5,
      category: 'practice'
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    confidence: { 
      name: '💪 الثقة بالنفس', 
      nameEn: 'Confidence',
      target: 4, 
      max: 5, 
      isNegative: false 
    },
    stress: { 
      name: '😰 مستوى التوتر', 
      nameEn: 'Stress level',
      target: 3, 
      max: 5, 
      isNegative: true 
    },
    motivation: { 
      name: '❤️ مدى الاهتمام بالمادة', 
      nameEn: 'Motivation',
      target: 4, 
      max: 5, 
      isNegative: false 
    },
    tutoring: { 
      name: '🧑‍🏫 معلم خصوصي', 
      nameEn: 'Private tutoring',
      target: 1, 
      max: 1, 
      isNegative: false 
    },
    class_participation: { 
      name: '🗣️ المشاركة في القسم (1-5)', 
      nameEn: 'Class participation (1-5)',
      target: 4, 
      max: 5, 
      isNegative: false 
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '🔤 القواعد النحوية (Amigaw/Asentel) تمثل 30-40% من النقاط - ركز عليها بشدة',
    '🌱 الصرف (جذور الكلمات) مهارة فريدة في الأمازيغية - احفظ الأوزان الأساسية',
    '🏛️ التراث الثقافي (ينّاير، تاقروست، الحكايات الشعبية) يأتي غالباً في الامتحان',
    '📚 حل امتحانات سابقة هو أفضل طريقة للتعود على نمط الأسئلة',
    '✍️ اكتب فقرة قصيرة كل أسبوع وركز على تنظيم الأفكار',
    '📖 اقرأ نصاً أمازيغياً قصيراً يومياً من الإنترنت أو الكتب المدرسية',
    '💪 الثقة بالنفس تؤثر إيجاباً على أدائك - ابدأ بحل تمارين سهلة أولاً',
    '⏰ الانتظام اليومي أفضل من المذاكرة المكثفة قبل الامتحان'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '🔤 القواعد النحوية (Amigaw/Asentel)', weight: '30-40%', color: '#e74c3c' },
    { skill: '🌱 الصرف (جذور الكلمات)', weight: '25-30%', color: '#e67e22' },
    { skill: '📖 الفهم والاستيعاب', weight: '20-25%', color: '#f39c12' },
    { skill: '✍️ التعبير الكتابي', weight: '15-20%', color: '#2ecc71' }
  ],
  
  // ============================================
  // THEME
  // ============================================
  theme: {
    primary: '#1e3c72',
    secondary: '#2a5298',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
  },
  
  // ============================================
  // TAMAZIGHT SPECIFIC INFO
  // ============================================
  tamazightSpecific: {
    scripts: ['الحرف اللاتيني', 'تيفيناغ'],
    dialects: ['القبائلية', 'الشاوية', 'المزابية', 'التارقية'],
    culturalEvents: ['ينّاير (رأس السنة الأمازيغية)', 'تاقروست', 'أضغال', 'ثيمسيلت'],
    keyGrammarTerms: ['Amigaw (الأفعال)', 'Asentel (تحليل الجملة)', 'Aseqsad (جذور الكلمات)']
  }
};

// ============================================
// COMPONENT
// ============================================
export default function Tamazight() {
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
    
    const grammarWeight = 0.20;
    const morphologyWeight = 0.15;
    const readingWeight = 0.15;
    const writingWeight = 0.12;
    const vocabularyWeight = 0.10;
    const cultureWeight = 0.08;
    const practiceWeight = 0.12;
    const psychWeight = 0.08;
    
    const totalWeight = grammarWeight + morphologyWeight + readingWeight + 
                        writingWeight + vocabularyWeight + cultureWeight + 
                        practiceWeight + psychWeight;
    
    const weightedSkills = 
      (data.verb_identification || 5) * grammarWeight +
      (data.subject_object_analysis || 5) * grammarWeight * 0.8 +
      (data.morphology_root_pattern || 5) * morphologyWeight +
      (data.main_idea_detection || 5) * readingWeight +
      (data.narrative_writing || 5) * writingWeight +
      (data.synonym_knowledge || 5) * vocabularyWeight * 0.6 +
      (data.antonym_knowledge || 5) * vocabularyWeight * 0.4 +
      (data.cultural_heritage || 5) * cultureWeight;
    
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    const practiceScore = Math.min(10,
      (data.exam_preparation || 5) / 20 * 10 * 0.35 +
      (data.writing_frequency || 2) / 5 * 10 * 0.25 +
      (data.reading_frequency || 3) / 5 * 10 * 0.20 +
      (data.text_analysis_practice || 2) / 5 * 10 * 0.20
    );
    
    const psychScore = (
      (data.confidence || 3) / 5 * 10 * 0.4 +
      (10 - (data.stress || 3) / 5 * 10) * 0.3 +
      (data.motivation || 3) / 5 * 10 * 0.15 +
      (data.class_participation || 3) / 5 * 10 * 0.15
    );
    
    const rawScore = (
      avgGrade * 0.08 +
      weightedSkillsScore * 0.55 +
      practiceScore * 0.25 +
      psychScore * 0.12
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
  // API CALL: PREDICT - WITH FIELD MAPPING
  // ============================================
  const callPredict = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('الرجاء تسجيل الدخول أولاً');
      }

      // ✅ Map generic fields to Tamazight-specific fields
      const mappedData = {
        ...data,
        exam_preparation: data.exams_practiced || 0,
        writing_frequency: data.essays_per_week || 0,
        reading_frequency: data.study_hours || 0,
        text_analysis_practice: data.exams_practiced || 0
      };

      const response = await fetch(`${API_URL}/api/bacyear/tamazight/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mappedData)
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
        <span>📚 {subjectData.name} - جميع الشعب</span>
        <span>⭐ المهارة الأكثر أهمية: القواعد النحوية (Amigaw/Asentel)</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}