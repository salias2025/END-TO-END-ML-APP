// src/bac_year/science.jsx
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

// Natural Sciences (SVT - Sciences de la Vie et de la Terre) subject data
const subjectData = {
  id: 'science',
  name: '🔬 علوم الطبيعة والحياة',
  nameEn: 'Natural Sciences (SVT)',
  icon: '🔬',
  examDuration: '4h 30min (Sciences) / 2h 30min (Maths)',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  
  // ============================================
  // SVT-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'scientific_skills_composite',
      name: '🔬 المستوى العلمي العام - الأهم!',
      nameEn: 'Scientific Skills Level',
      description: 'يجمع تحليل الوثائق، اقتراح الفرضيات، الكتابة العلمية، والتسلسل المنطقي. هذه هي أهم المهارات في امتحان SVT وتمثل 40-50% من النقاط!',
      improvement: 'ركز على تحليل الوثائق (منحنيات، جداول، تجارب) - هذه هي المفتاح للنجاح في SVT!',
      calculate: (data) => {
        return (data.document_analysis || 0 + 
                data.hypothesis_formulation || 0 + 
                data.scientific_writing || 0 + 
                data.reasoning_chain || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '🔬',
      weight: '40-50%'
    },
    {
      id: 'document_mastery',
      name: '📄 إتقان تحليل الوثائق',
      nameEn: 'Document Analysis Mastery',
      description: 'يجمع تحليل الوثائق والثقة في تحليلها. SVT يعتمد بشكل كبير على قراءة المنحنيات والجداول والتجارب.',
      improvement: 'تدرب يومياً على تحليل أنواع مختلفة من الوثائق (منحنيات، جداول، تجارب، صور)',
      calculate: (data) => {
        return (data.document_analysis || 0 + data.document_confidence || 0) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '📄'
    },
    {
      id: 'reasoning_quality',
      name: '🔗 جودة الاستدلال والتفكير المنطقي',
      nameEn: 'Reasoning & Logical Thinking',
      description: 'يجمع التسلسل المنطقي واقتراح الفرضيات. SVT يختبر التفكير المنطقي والاستدلال العلمي أكثر من الحفظ.',
      improvement: 'تدرب على بناء سلاسل سبب-نتيجة منطقية وحلل النتائج قبل اقتراح التفسيرات',
      calculate: (data) => {
        return (data.reasoning_chain || 0 + data.hypothesis_formulation || 0) / 2;
      },
      target: 6.5,
      max: 10,
      importance: 'high',
      icon: '🔗'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل امتحانات البكالوريا السابقة وتمارين تحليل الوثائق. في SVT، حل التمارين أهم من المذاكرة النظرية!',
      improvement: 'حل امتحان بكالوريا كل أسبوع وزد عدد تمارين تحليل الوثائق إلى 8-10 أسبوعياً',
      calculate: (data) => {
        return (data.bac_exams_practiced || 5) / 30 * 10 * 0.6 +
               (data.document_exercises || 5) / 15 * 10 * 0.4;
      },
      target: 6.0,
      max: 10,
      importance: 'high',
      icon: '⚡'
    },
    {
      id: 'psychological_health',
      name: '🧠 الصحة النفسية',
      nameEn: 'Psychological Health',
      description: 'يجمع الثقة في تحليل الوثائق، الثقة في الكتابة العلمية، وقلة القلق. الثقة في SVT تؤثر بشكل كبير على أدائك.',
      improvement: 'حاول تقليل قلق المادة بتمارين التنفس، ابدأ بتمارين سهلة لتعزيز ثقتك',
      calculate: (data) => {
        return (data.document_confidence || 5 + 
                data.scientific_writing_confidence || 5 + 
                (10 - (data.svt_anxiety || 5))) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '🧠'
    },
    {
      id: 'svt_overall_score',
      name: '🎯 المستوى العام في SVT',
      nameEn: 'Overall SVT Level',
      description: 'متوسط مهاراتك في فصول SVT. يعكس مستواك العام في المادة.',
      improvement: 'ركز على تحليل الوثائق والمهارات العلمية - هي مفتاح النجاح في SVT!',
      calculate: (data, stream) => {
        let blocks = [];
        if (stream === 'Sciences') {
          blocks = [
            data.molecular_biology || 0,
            data.protein_enzymes || 0,
            data.immunology || 0,
            data.energy_photosynthesis || 0,
            data.energy_respiration || 0,
            data.neuroscience || 0,
            data.geology || 0
          ];
        } else {
          blocks = [
            data.molecular_biology || 0,
            data.protein_enzymes || 0,
            data.immunology || 0
          ];
        }
        const validBlocks = blocks.filter(b => b > 0);
        return validBlocks.reduce((a, b) => a + b, 0) / (validBlocks.length || 1);
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🎯'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس مدى التوازن بين مهاراتك في فروع SVT المختلفة. القيمة المنخفضة تعني أن مهاراتك متوازنة.',
      improvement: 'حدد المهارات الضعيفة وركز عليها بشكل مكثف',
      calculate: (data, stream) => {
        let blocks = [];
        if (stream === 'Sciences') {
          blocks = [
            data.molecular_biology || 0,
            data.protein_enzymes || 0,
            data.immunology || 0,
            data.energy_photosynthesis || 0,
            data.energy_respiration || 0,
            data.neuroscience || 0,
            data.geology || 0
          ];
        } else {
          blocks = [
            data.molecular_biology || 0,
            data.protein_enzymes || 0,
            data.immunology || 0
          ];
        }
        const validBlocks = blocks.filter(b => b > 0);
        const avg = validBlocks.reduce((a, b) => a + b, 0) / (validBlocks.length || 1);
        return validBlocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (validBlocks.length || 1);
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
    title: '🔬 امتحان البكالوريا - علوم الطبيعة والحياة',
    titleEn: 'Natural Sciences Baccalaureate Exam',
    streams: [
      {
        name: '🔬 شعبة علوم تجريبية (4سا 30د)',
        nameEn: 'Sciences Stream (4h 30min)',
        color: '#3498db',
        exercises: [
          {
            name: 'التمرين الأول: البيولوجيا الجزيئية',
            nameEn: 'Exercise 1: Molecular Biology',
            content: 'DNA، ARN، تضاعف، نسخ، ترجمة + البروتينات والأنزيمات',
            contentEn: 'DNA, RNA, Replication, Transcription, Translation + Proteins & Enzymes',
            points: '5-6 points',
            subParts: [
              { name: 'DNA/ARN', points: '2-3 نقاط', skills: 'تضاعف DNA، النسخ، الترجمة' },
              { name: 'البروتينات', points: '2-3 نقاط', skills: 'بنية البروتين، الأنزيمات' }
            ]
          },
          {
            name: 'التمرين الثاني: المناعة',
            nameEn: 'Exercise 2: Immunology',
            content: 'HLA، TAP، الأجسام المضادة، LT4، LT8، HIV',
            contentEn: 'HLA, TAP, Antibodies, LT4, LT8, HIV',
            points: '7-8 points',
            subParts: [
              { name: 'المناعة الخلطية', points: '3-4 نقاط', skills: 'الأجسام المضادة، LT4' },
              { name: 'المناعة الخلوية', points: '3-4 نقاط', skills: 'LT8، HLA، TAP' }
            ]
          },
          {
            name: 'التمرين الثالث: تحويل الطاقة + العلوم العصبية',
            nameEn: 'Exercise 3: Energy Conversion + Neuroscience',
            content: 'التركيب الضوئي، التنفس الخلوي، النقل المشبكي',
            contentEn: 'Photosynthesis, Cellular Respiration, Synaptic Transmission',
            points: '7-8 points',
            subParts: [
              { name: 'التركيب الضوئي', points: '3-4 نقاط', skills: 'التفاعلات الضوئية، دورة كالفن' },
              { name: 'التنفس الخلوي', points: '2-3 نقاط', skills: 'هدم الغلوكوز، إنتاج ATP' },
              { name: 'العلوم العصبية', points: '1-2 نقاط', skills: 'النقل المشبكي، النواقل العصبية' }
            ]
          },
          {
            name: 'التمرين الرابع: الجيولوجيا',
            nameEn: 'Exercise 4: Geology',
            content: 'الصفائح التكتونية، الغوص، الزلازل، البراكين',
            contentEn: 'Tectonic Plates, Subduction, Earthquakes, Volcanoes',
            points: '8 points',
            subParts: [
              { name: 'الصفائح التكتونية', points: '3-4 نقاط', skills: 'حركات الصفائح، الحدود' },
              { name: 'الغوص والزلازل', points: '2-3 نقاط', skills: 'ظاهرة الغوص، الزلازل' },
              { name: 'البراكين', points: '1-2 نقاط', skills: 'أنواع البراكين' }
            ]
          }
        ]
      },
      {
        name: '📐 شعبة رياضيات (2سا 30د)',
        nameEn: 'Maths Stream (2h 30min)',
        color: '#2ecc71',
        exercises: [
          {
            name: 'التمرين الأول: البيولوجيا الجزيئية + البروتينات',
            nameEn: 'Exercise 1: Molecular Biology + Proteins',
            content: 'DNA، ARN، تضاعف، نسخ، ترجمة + البروتينات والأنزيمات',
            contentEn: 'DNA, RNA, Replication, Transcription, Translation + Proteins & Enzymes',
            points: '10-11 points',
            subParts: [
              { name: 'DNA/ARN', points: '5-6 نقاط', skills: 'تضاعف DNA، النسخ، الترجمة' },
              { name: 'البروتينات', points: '5-6 نقاط', skills: 'بنية البروتين، الأنزيمات' }
            ]
          },
          {
            name: 'التمرين الثاني: المناعة',
            nameEn: 'Exercise 2: Immunology',
            content: 'HLA، TAP، الأجسام المضادة، LT4، LT8',
            contentEn: 'HLA, TAP, Antibodies, LT4, LT8',
            points: '9-10 points',
            subParts: [
              { name: 'المناعة الخلطية', points: '4-5 نقاط', skills: 'الأجسام المضادة، LT4' },
              { name: 'المناعة الخلوية', points: '4-5 نقاط', skills: 'LT8، HLA، TAP' }
            ]
          }
        ],
        note: '⚠️ لا تشمل: تحويل الطاقة، العلوم العصبية، الجيولوجيا'
      }
    ]
  },
  
  // ============================================
  // SKILLS - Dynamic by Stream
  // ============================================
  skills: {
    // Common skills (all streams)
    molecular_biology: {
      name: '🧬 البيولوجيا الجزيئية (DNA، ARN، تضاعف، نسخ، ترجمة)',
      nameEn: 'Molecular Biology (DNA, RNA, Replication, Transcription, Translation)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'biology',
      isCore: true
    },
    protein_enzymes: {
      name: '🧫 البروتينات والأنزيمات (بنية، وظيفة، تحفيز)',
      nameEn: 'Proteins & Enzymes (Structure, Function, Catalysis)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'biology',
      isCore: true
    },
    immunology: {
      name: '🛡️ المناعة (HLA، TAP، الأجسام المضادة، LT4، LT8)',
      nameEn: 'Immunology (HLA, TAP, Antibodies, LT4, LT8)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'biology',
      isCore: true
    },
    // Sciences Exp. only skills
    energy_photosynthesis: {
      name: '🌿 التركيب الضوئي (التفاعلات الضوئية، دورة كالفن)',
      nameEn: 'Photosynthesis (Light Reactions, Calvin Cycle)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'energy',
      stream: 'Sciences'
    },
    energy_respiration: {
      name: '🔥 التنفس الخلوي (هدم الغلوكوز، إنتاج ATP)',
      nameEn: 'Cellular Respiration (Glucose Breakdown, ATP Production)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'energy',
      stream: 'Sciences'
    },
    neuroscience: {
      name: '🧠 العلوم العصبية (النقل المشبكي، النواقل العصبية)',
      nameEn: 'Neuroscience (Synaptic Transmission, Neurotransmitters)',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'neuro',
      stream: 'Sciences'
    },
    geology: {
      name: '🌍 الجيولوجيا (الصفائح التكتونية، الغوص، الزلازل)',
      nameEn: 'Geology (Tectonic Plates, Subduction, Earthquakes)',
      target: 5.5,
      importance: 'low',
      weight: '8-12%',
      category: 'geology',
      stream: 'Sciences'
    },
    // Scientific Skills (CRITICAL for all streams)
    document_analysis: {
      name: '📄 تحليل الوثائق (منحنيات، جداول، تجارب)',
      nameEn: 'Document Analysis (Graphs, Tables, Experiments)',
      target: 7.0,
      importance: 'critical',
      weight: '40-45%',
      category: 'scientific',
      isCross: true,
      isCore: true
    },
    hypothesis_formulation: {
      name: '🔬 اقتراح الفرضيات والتفسيرات',
      nameEn: 'Hypothesis Formulation & Explanations',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'scientific',
      isCross: true
    },
    scientific_writing: {
      name: '✍️ الكتابة العلمية المنظمة',
      nameEn: 'Scientific Writing',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'scientific',
      isCross: true
    },
    reasoning_chain: {
      name: '🔗 التسلسل المنطقي (السبب والنتيجة)',
      nameEn: 'Logical Reasoning (Cause and Effect)',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'scientific',
      isCross: true
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
      impact: 0.038
    },
    document_exercises: {
      name: '📊 عدد تمارين تحليل الوثائق المحلولة',
      nameEn: 'Document Analysis Exercises Solved',
      target: 8,
      max: 15,
      category: 'practice',
      impact: 0.045
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS (SVT-specific)
  // ============================================
  psychological: {
    svt_anxiety: {
      name: '😰 قلق مادة علوم الطبيعة والحياة',
      nameEn: 'SVT Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.045
    },
    document_confidence: {
      name: '💪 الثقة في تحليل الوثائق',
      nameEn: 'Document Analysis Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.04
    },
    scientific_writing_confidence: {
      name: '✍️ الثقة في الكتابة العلمية',
      nameEn: 'Scientific Writing Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.035
    }
  },
  
  // ============================================
  // TIPS (in Arabic)
  // ============================================
  tips: [
    '📄 تحليل الوثائق هو المهارة الأكثر أهمية - 40% من النقاط تعتمد عليه!',
    '🔬 SVT ليس مادة حفظ فقط - يختبر التفكير المنطقي والاستدلال العلمي',
    '🛡️ المناعة والبيولوجيا الجزيئية تمثلان الجزء الأكبر من الامتحان',
    '📚 حل امتحانات سابقة يرفع نقطتك بمقدار 0.38 نقطة لكل 10 امتحانات',
    '📊 تمارين تحليل الوثائق ترفع نقطتك بمقدار 0.225 نقطة لكل 5 تمارين',
    '📐 شعبة الرياضيات تدرس فقط: DNA/RNA + بروتينات + مناعة (بدون طاقة أو جيولوجيا)',
    '✍️ الكتابة العلمية المنظمة (مقدمة، عرض، خاتمة) ترفع نقطتك',
    '🔗 التسلسل المنطقي هو مفتاح الإجابة الصحيحة في SVT'
  ],
  
  // ============================================
  // STREAM SPECIFIC INFO
  // ============================================
  streamInfo: {
    Sciences: {
      name: '🔬 علوم تجريبية',
      duration: '4سا 30د',
      chapters: ['البيولوجيا الجزيئية', 'البروتينات', 'المناعة', 'التركيب الضوئي', 'التنفس الخلوي', 'العلوم العصبية', 'الجيولوجيا'],
      totalChapters: 7
    },
    Maths: {
      name: '📐 رياضيات',
      duration: '2سا 30د',
      chapters: ['البيولوجيا الجزيئية', 'البروتينات', 'المناعة'],
      totalChapters: 3,
      note: '⚠️ فقط DNA/RNA + بروتينات + مناعة'
    }
  },
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '📄 تحليل الوثائق', weight: '40-45%', color: '#e74c3c' },
    { skill: '🛡️ المناعة + 🧬 البيولوجيا الجزيئية + 🧫 البروتينات', weight: '30-35%', color: '#e67e22' },
    { skill: '🔗 التفكير المنطقي والاستدلال', weight: '30-35%', color: '#f1c40f' },
    { skill: '🌿 تحويل الطاقة (لشعبة العلوم فقط)', weight: '15-20%', color: '#2ecc71' },
    { skill: '🌍 الجيولوجيا (لشعبة العلوم فقط)', weight: '8-12%', color: '#9b59b6' }
  ],
  
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
export default function Science() {
  const [step, setStep] = useState('exam_structure');
  const [formData, setFormData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStream, setSelectedStream] = useState('Sciences');

  // ============================================
  // LOCAL FALLBACK PREDICTION
  // ============================================
  const calculatePrediction = (data) => {
    const avgGrade = (data.svt_grade_t1 + data.svt_grade_t2 + data.svt_grade_t3) / 3;
    const stream = data.stream || 'Sciences';
    
    const documentAnalysis = data.document_analysis || 5;
    const hypothesis = data.hypothesis_formulation || 5;
    const scientificWriting = data.scientific_writing || 5;
    const reasoning = data.reasoning_chain || 5;
    const scientificComposite = (documentAnalysis + hypothesis + scientificWriting + reasoning) / 4;
    
    const molecularBio = data.molecular_biology || 5;
    const proteins = data.protein_enzymes || 5;
    const immunology = data.immunology || 5;
    
    let contentScore = 0;
    let contentWeight = 0;
    
    if (stream === 'Sciences') {
      const photosynthesis = data.energy_photosynthesis || 5;
      const respiration = data.energy_respiration || 5;
      const neuro = data.neuroscience || 5;
      const geology = data.geology || 5;
      
      const blocks = [molecularBio, proteins, immunology, photosynthesis, respiration, neuro, geology];
      const weights = [0.16, 0.16, 0.16, 0.14, 0.14, 0.12, 0.12];
      contentScore = blocks.reduce((sum, b, i) => sum + b * weights[i], 0);
      contentWeight = weights.reduce((a, b) => a + b, 0);
    } else {
      const blocks = [molecularBio, proteins, immunology];
      const weights = [0.34, 0.33, 0.33];
      contentScore = blocks.reduce((sum, b, i) => sum + b * weights[i], 0);
      contentWeight = weights.reduce((a, b) => a + b, 0);
    }
    
    const contentFinal = contentScore / contentWeight;
    
    const practiceIntensity = (data.exams_practiced || 5) / 30 * 10 * 0.6 +
                              (data.document_exercises || 5) / 15 * 10 * 0.4;
    
    const psychHealth = (data.document_confidence || 5 + 
                         data.scientific_writing_confidence || 5 + 
                         (10 - (data.svt_anxiety || 5))) / 3;
    
    const scientificWeight = 0.40;
    const contentWeight2 = 0.30;
    const practiceWeight = 0.18;
    const psychWeight = 0.07;
    const gradeWeight = 0.05;
    
    const totalWeight = scientificWeight + contentWeight2 + practiceWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      scientificComposite * scientificWeight +
      contentFinal * contentWeight2 +
      practiceIntensity * practiceWeight +
      psychHealth * psychWeight +
      avgGrade / 2 * gradeWeight;
    
    const rawScore = (weightedScore / totalWeight) * 2;
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

      const response = await fetch(`${API_URL}/api/bacyear/science/predict`, {
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
            🔬 علوم تجريبية | 📐 رياضيات
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
        <span>🔬 علوم الطبيعة والحياة - جميع الشعب</span>
        <span>⭐ المهارة الأكثر أهمية: تحليل الوثائق</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}