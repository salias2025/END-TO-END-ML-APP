// src/bac_year/techno.jsx
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

// Technology (التكنولوجيا) - Technical Stream (تقني رياضي)
// Specialties: GM (Génie Mécanique), GE (Génie Électrique), GC (Génie Civil), GP (Génie des Procédés)
const subjectData = {
  id: 'techno',
  name: '🔧 التكنولوجيا (هندسة)',
  nameEn: 'Technology (Engineering)',
  icon: '🔧',
  examDuration: '4h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'Technique',
  
  // ============================================
  // TECHNOLOGY-SPECIFIC DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'specialty_block',
      name: '📚 مستوى مهارات التخصص',
      nameEn: 'Specialty Skills Level',
      description: 'يقيس متوسط مهاراتك في تخصصك (GM/GE/GC/GP). هذه هي المهارات الأساسية التي تميز تخصصك وتأتي بكثرة في امتحان البكالوريا.',
      improvement: 'ركز على دراسة مواد تخصصك الأساسية وحل تمارين متنوعة',
      calculate: (data, specialty) => {
        if (specialty === 'GM') {
          return (data.mechanics_rdm || 0 + data.material_resistance || 0 + data.gear_transmission || 0) / 3;
        } else if (specialty === 'GE') {
          return (data.automation_grafcet || 0 + data.logic_circuits || 0 + data.electrical_systems || 0) / 3;
        } else if (specialty === 'GC') {
          return (data.structural_analysis || 0 + data.reinforced_concrete || 0 + data.road_construction || 0) / 3;
        } else { // GP
          return (data.organic_chemistry || 0 + data.polymer_chemistry || 0 + data.thermodynamics || 0) / 3;
        }
      },
      target: 7.5,
      max: 10,
      importance: 'critical',
      icon: '📚',
      weight: '40-45%'
    },
    {
      id: 'problem_solving_composite',
      name: '🔍 مستوى حل المسائل والتحليل',
      nameEn: 'Problem Solving & Analysis Level',
      description: 'يجمع حل المسائل الهندسية وقراءة المخططات التقنية. هذه المهارة مشتركة بين جميع التخصصات وهي الأكثر أهمية في امتحان التكنولوجيا!',
      improvement: 'قسم المسألة إلى خطوات صغيرة وحلل المعطيات قبل البدء في الحل - تدرب على قراءة GRAFCET والرسومات التقنية',
      calculate: (data) => {
        return (data.problem_solving || 0 + data.diagram_interpretation || 0) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '🔍',
      weight: '30-35%'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل امتحانات البكالوريا السابقة، تمارين التخصص، والمحاكاة الكاملة. في التكنولوجيا، حل التمارين هو الطريق الوحيد للنجاح!',
      improvement: 'حل امتحان بكالوريا كل أسبوع وزد عدد تمارين التخصص إلى 8-10 أسبوعياً',
      calculate: (data) => {
        return (data.bac_exams_practiced || 5) / 30 * 10 * 0.4 +
               (data.specialty_exercises_week || 5) / 15 * 10 * 0.3 +
               (data.full_simulations || 1) / 5 * 10 * 0.3;
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
      description: 'يجمع الثقة بالنفس، التركيز، وقلة القلق والتوتر. المواد التقنية تحتاج إلى تركيز عالٍ وثقة في النفس!',
      improvement: 'حاول تقليل قلق المادة بتمارين التنفس، ابدأ بتمارين سهلة لتعزيز ثقتك',
      calculate: (data) => {
        return (data.confidence || 5 + data.focus_concentration || 5 + 
                (10 - (data.tech_anxiety || 5)) + (10 - (data.exam_stress || 5))) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '🧠'
    },
    {
      id: 'study_quality',
      name: '📚 جودة الدراسة',
      nameEn: 'Study Quality',
      description: 'يقيس مدى انتظامك في الدراسة، جودة تصحيحك للأخطاء، وساعات الدراسة. الانتظام أهم من الكثافة!',
      improvement: 'نظم وقتك وذاكر يومياً بدلاً من المذاكرة المكثفة، وحلل أخطائك بدقة',
      calculate: (data) => {
        return (data.consistency || 5) * 0.5 + 
               (data.study_hours || 5) / 12 * 10 * 0.3 + 
               (data.correction_quality || 5) * 0.2;
      },
      target: 6.5,
      max: 10,
      importance: 'medium',
      icon: '📚'
    },
    {
      id: 'exam_prep_score',
      name: '📝 التحضير للامتحان',
      nameEn: 'Exam Preparation Score',
      description: 'يقيس عدد امتحانات البكالوريا السابقة التي حللتها. حل الامتحانات السابقة هو أفضل طريقة للتحضير!',
      improvement: 'حل 10 امتحانات بكالوريا سابقة على الأقل - كل 10 امتحانات ترفع نقطتك 0.38 نقطة',
      calculate: (data) => {
        return (data.bac_exams_practiced || 5) / 30 * 10;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '📝'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس مدى التوازن بين مهاراتك المختلفة (مهارات التخصص، حل المسائل، كثافة التمارين). القيمة المنخفضة تعني أن مهاراتك متوازنة.',
      improvement: 'حدد المهارات الضعيفة وركز عليها بشكل مكثف',
      calculate: (data, specialty) => {
        let specialtyBlock = 0;
        if (specialty === 'GM') {
          specialtyBlock = (data.mechanics_rdm || 0 + data.material_resistance || 0 + data.gear_transmission || 0) / 3;
        } else if (specialty === 'GE') {
          specialtyBlock = (data.automation_grafcet || 0 + data.logic_circuits || 0 + data.electrical_systems || 0) / 3;
        } else if (specialty === 'GC') {
          specialtyBlock = (data.structural_analysis || 0 + data.reinforced_concrete || 0 + data.road_construction || 0) / 3;
        } else {
          specialtyBlock = (data.organic_chemistry || 0 + data.polymer_chemistry || 0 + data.thermodynamics || 0) / 3;
        }
        const problemSolving = (data.problem_solving || 0 + data.diagram_interpretation || 0) / 2;
        const practiceIntensity = (data.bac_exams_practiced || 5) / 30 * 10 * 0.4 +
                                  (data.specialty_exercises_week || 5) / 15 * 10 * 0.3 +
                                  (data.full_simulations || 1) / 5 * 10 * 0.3;
        const skills = [specialtyBlock, problemSolving, practiceIntensity];
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
    title: '🔧 امتحان البكالوريا - التكنولوجيا (هندسة)',
    titleEn: 'Technology (Engineering) Baccalaureate Exam',
    streams: [
      {
        name: '🔧 شعبة تقني رياضي - جميع الفروع',
        nameEn: 'Technical Stream - All Branches',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: دراسة تصميمية',
            nameEn: 'Part 1: Design Study',
            content: 'تحليل وظيفي، دراسة بنيوية',
            contentEn: 'Functional analysis, structural study',
            points: '13 points (65%)',
            subParts: [
              { name: 'التحليل الوظيفي', points: '6-7 نقاط', skills: 'تحليل النظام، تحديد الوظائف' },
              { name: 'الدراسة البنيوية', points: '6-7 نقاط', skills: 'حساب الجهود، التصميم' }
            ]
          },
          {
            name: 'الجزء الثاني: دراسة تحضيرية',
            nameEn: 'Part 2: Preparatory Study',
            content: 'تكنولوجيا التصنيع، الأنظمة الآلية',
            contentEn: 'Manufacturing technology, automated systems',
            points: '7 points (35%)',
            subParts: [
              { name: 'تكنولوجيا التصنيع', points: '3-4 نقاط', skills: 'عمليات التصنيع، الإنتاج' },
              { name: 'الأنظمة الآلية', points: '3-4 نقاط', skills: 'GRAFCET، الأتمتة' }
            ]
          }
        ]
      }
    ]
  },
  
  // ============================================
  // SKILLS - Specialty Specific (Dynamic)
  // ============================================
  skills: {
    // GM Skills (Génie Mécanique)
    mechanics_rdm: {
      name: '🔧 الميكانيك (RDM - الجهد القاطع، عزم الانحناء)',
      nameEn: 'Mechanics (RDM - Shear force, Bending moment)',
      target: 7.0,
      importance: 'critical',
      weight: '40-45%',
      category: 'gm',
      specialty: 'GM'
    },
    material_resistance: {
      name: '🔩 مقاومة المواد (الإجهادات، التحريضات)',
      nameEn: 'Material Resistance (Stress, Strain)',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'gm',
      specialty: 'GM'
    },
    gear_transmission: {
      name: '⚙️ نقل الحركة (نسب النقل، التروس)',
      nameEn: 'Power Transmission (Gear ratios, Gears)',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'gm',
      specialty: 'GM'
    },
    // GE Skills (Génie Électrique)
    automation_grafcet: {
      name: '⚡ الأتمتة (GRAFCET - رسم وتفسير)',
      nameEn: 'Automation (GRAFCET - Drawing & Interpretation)',
      target: 7.0,
      importance: 'critical',
      weight: '40-45%',
      category: 'ge',
      specialty: 'GE'
    },
    logic_circuits: {
      name: '🔌 الدوائر المنطقية (بوابات، عدادات 7490)',
      nameEn: 'Logic Circuits (Gates, 7490 Counters)',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'ge',
      specialty: 'GE'
    },
    electrical_systems: {
      name: '💡 الأنظمة الكهربائية (محركات، مقومات)',
      nameEn: 'Electrical Systems (Motors, Rectifiers)',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'ge',
      specialty: 'GE'
    },
    // GC Skills (Génie Civil)
    structural_analysis: {
      name: '🏗️ التحليل الإنشائي (ردود الأفعال، الجهود الداخلية)',
      nameEn: 'Structural Analysis (Reactions, Internal Forces)',
      target: 7.0,
      importance: 'critical',
      weight: '40-45%',
      category: 'gc',
      specialty: 'GC'
    },
    reinforced_concrete: {
      name: '🏢 الخرسانة المسلحة (حسابات التسليح، BAEL)',
      nameEn: 'Reinforced Concrete (Reinforcement calculations, BAEL)',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'gc',
      specialty: 'GC'
    },
    road_construction: {
      name: '🛣️ الطرق (مكونات الطريق، المظهر الطولي)',
      nameEn: 'Road Construction (Road components, Longitudinal profile)',
      target: 6.0,
      importance: 'medium',
      weight: '20-25%',
      category: 'gc',
      specialty: 'GC'
    },
    // GP Skills (Génie des Procédés)
    organic_chemistry: {
      name: '🧪 الكيمياء العضوية (تفاعلات، مجموعات وظيفية)',
      nameEn: 'Organic Chemistry (Reactions, Functional groups)',
      target: 7.0,
      importance: 'critical',
      weight: '40-45%',
      category: 'gp',
      specialty: 'GP'
    },
    polymer_chemistry: {
      name: '🔬 كيمياء البوليمرات (بلمرة، تصبن، أسترة)',
      nameEn: 'Polymer Chemistry (Polymerization, Saponification, Esterification)',
      target: 6.5,
      importance: 'high',
      weight: '30-35%',
      category: 'gp',
      specialty: 'GP'
    },
    thermodynamics: {
      name: '🔥 الثيرموديناميك (حرارة، مسعر حراري)',
      nameEn: 'Thermodynamics (Heat, Calorimeter)',
      target: 6.0,
      importance: 'medium',
      weight: '20-25%',
      category: 'gp',
      specialty: 'GP'
    },
    // Cross-Specialty Skills (All specialties)
    problem_solving: {
      name: '🔍 حل مسائل هندسية متعددة الخطوات',
      nameEn: 'Multi-step Engineering Problem Solving',
      target: 7.0,
      importance: 'critical',
      weight: '30-35%',
      category: 'cross',
      isCross: true
    },
    diagram_interpretation: {
      name: '📐 قراءة وتحليل المخططات التقنية (GRAFCET، رسومات)',
      nameEn: 'Technical Diagram Interpretation (GRAFCET, Drawings)',
      target: 6.5,
      importance: 'high',
      weight: '25-30%',
      category: 'cross',
      isCross: true
    },
    calculation_accuracy: {
      name: '🧮 دقة الحسابات والوحدات',
      nameEn: 'Calculation Accuracy & Units',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'cross',
      isCross: true
    },
    technical_drawing: {
      name: '✏️ الرسم التقني وإكمال المخططات',
      nameEn: 'Technical Drawing & Diagram Completion',
      target: 6.0,
      importance: 'medium',
      weight: '15-20%',
      category: 'cross',
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
    specialty_exercises_week: {
      name: '✍️ تمارين التخصص الأسبوعية',
      nameEn: 'Specialty Exercises per Week',
      target: 8,
      max: 15,
      category: 'practice',
      impact: 0.025
    },
    full_simulations: {
      name: '⏱️ الامتحانات الكاملة بوقت محدد أسبوعياً',
      nameEn: 'Full Timed Simulations per Week',
      target: 2,
      max: 5,
      category: 'practice',
      impact: 0.045
    },
    study_hours: {
      name: '⏰ ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 6,
      max: 12,
      category: 'practice',
      impact: 0.012
    },
    correction_quality: {
      name: '🔍 جودة تصحيح الأخطاء وفهمها',
      nameEn: 'Error Correction Quality',
      target: 7,
      max: 10,
      category: 'practice'
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    tech_anxiety: {
      name: '😰 قلق مادة التكنولوجيا',
      nameEn: 'Technology Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.045
    },
    confidence: {
      name: '💪 الثقة بالنفس في المواد التقنية',
      nameEn: 'Confidence in Technical Subjects',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.04
    },
    exam_stress: {
      name: '😓 توتر الامتحان',
      nameEn: 'Exam Stress',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.035
    },
    focus_concentration: {
      name: '🎯 القدرة على التركيز أثناء حل المسائل',
      nameEn: 'Focus During Problem Solving',
      target: 7,
      max: 10,
      isNegative: false
    },
    consistency: {
      name: '📅 مدى انتظامك في الدراسة',
      nameEn: 'Study Consistency',
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
    '🔍 حل المسائل وقراءة المخططات هما المهارتان الأكثر أهمية لجميع التخصصات',
    '📚 حل امتحانات سابقة يرفع نقطتك بمقدار 0.38 نقطة لكل 10 امتحانات',
    '⏱️ الامتحانات الكاملة بوقت محدد تحسن سرعتك وإدارة الوقت (4 ساعات و30 دقيقة)',
    '😌 قلق المادة يؤثر سلباً على الأداء - حاول تقليله بتمارين التنفس',
    '📅 الانتظام أهم من الكثافة - ادرس 30-45 دقيقة يومياً بدلاً من المذاكرة المكثفة',
    '✍️ حل 8-10 تمارين في تخصصك أسبوعياً',
    '🔍 حلل أخطائك بدقة - هذا هو مفتاح التقدم',
    '🎯 ركز على تخصصك أولاً ثم المهارات المشتركة'
  ],
  
  // ============================================
  // SPECIALTY INFO
  // ============================================
  specialties: {
    GM: {
      name: '⚙️ Génie Mécanique',
      nameEn: 'Mechanical Engineering',
      color: '#e74c3c',
      skills: ['mechanics_rdm', 'material_resistance', 'gear_transmission'],
      skillNames: ['🔧 الميكانيك (RDM)', '🔩 مقاومة المواد', '⚙️ نقل الحركة'],
      icon: '⚙️',
      description: 'RDM, résistance des matériaux, transmissions'
    },
    GE: {
      name: '⚡ Génie Électrique',
      nameEn: 'Electrical Engineering',
      color: '#3498db',
      skills: ['automation_grafcet', 'logic_circuits', 'electrical_systems'],
      skillNames: ['⚡ الأتمتة (GRAFCET)', '🔌 الدوائر المنطقية', '💡 الأنظمة الكهربائية'],
      icon: '⚡',
      description: 'Automatisme, GRAFCET, circuits logiques'
    },
    GC: {
      name: '🏗️ Génie Civil',
      nameEn: 'Civil Engineering',
      color: '#2ecc71',
      skills: ['structural_analysis', 'reinforced_concrete', 'road_construction'],
      skillNames: ['🏗️ التحليل الإنشائي', '🏢 الخرسانة المسلحة', '🛣️ الطرق'],
      icon: '🏗️',
      description: 'RDM, structures, béton armé, routes'
    },
    GP: {
      name: '🧪 Génie des Procédés',
      nameEn: 'Process Engineering',
      color: '#9b59b6',
      skills: ['organic_chemistry', 'polymer_chemistry', 'thermodynamics'],
      skillNames: ['🧪 الكيمياء العضوية', '🔬 كيمياء البوليمرات', '🔥 الثيرموديناميك'],
      icon: '🧪',
      description: 'Chimie organique, polymères, thermodynamique'
    }
  },
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '🔍 حل المسائل وقراءة المخططات', weight: 'الأهم', color: '#e74c3c' },
    { skill: '📚 مهارات التخصص', weight: '40-45%', color: '#e67e22' },
    { skill: '⚡ كثافة التمارين', weight: '30-35%', color: '#f1c40f' },
    { skill: '🧠 الصحة النفسية', weight: '20-25%', color: '#2ecc71' }
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
export default function Techno() {
  const [step, setStep] = useState('exam_structure');
  const [formData, setFormData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('GM');

  // Get specialty display name
  const getSpecialtyName = (specialty) => {
    return subjectData.specialties[specialty]?.name || specialty;
  };

  // Get specialty icon
  const getSpecialtyIcon = (specialty) => {
    return subjectData.specialties[specialty]?.icon || '🔧';
  };

  // ============================================
  // LOCAL FALLBACK PREDICTION
  // ============================================
  const calculatePrediction = (data) => {
    const avgGrade = (data.tech_grade_t1 + data.tech_grade_t2 + data.tech_grade_t3) / 3;
    const specialty = data.specialty || 'GM';
    
    // Calculate specialty block
    let specialtyBlock = 0;
    if (specialty === 'GM') {
      specialtyBlock = (data.mechanics_rdm || 5 + data.material_resistance || 5 + data.gear_transmission || 5) / 3;
    } else if (specialty === 'GE') {
      specialtyBlock = (data.automation_grafcet || 5 + data.logic_circuits || 5 + data.electrical_systems || 5) / 3;
    } else if (specialty === 'GC') {
      specialtyBlock = (data.structural_analysis || 5 + data.reinforced_concrete || 5 + data.road_construction || 5) / 3;
    } else { // GP
      specialtyBlock = (data.organic_chemistry || 5 + data.polymer_chemistry || 5 + data.thermodynamics || 5) / 3;
    }
    
    // Cross-specialty skills
    const problemSolving = (data.problem_solving || 5 + data.diagram_interpretation || 5) / 2;
    const calculationAccuracy = data.calculation_accuracy || 5;
    const technicalDrawing = data.technical_drawing || 5;
    
    // Practice intensity
    const practiceIntensity = (data.bac_exams_practiced || 5) / 30 * 10 * 0.4 +
                              (data.specialty_exercises_week || 5) / 15 * 10 * 0.3 +
                              (data.full_simulations || 1) / 5 * 10 * 0.3;
    
    // Psychological health
    const psychologicalHealth = (data.confidence || 5 + data.focus_concentration || 5 + 
                                (10 - (data.tech_anxiety || 5)) + (10 - (data.exam_stress || 5))) / 4;
    
    // Study quality
    const studyQuality = (data.consistency || 5) * 0.5 + 
                         (data.study_hours || 5) / 12 * 10 * 0.3 + 
                         (data.correction_quality || 5) * 0.2;
    
    // Exam prep score
    const examPrepScore = (data.bac_exams_practiced || 5) / 30 * 10;
    
    // Weights
    const specialtyWeight = 0.25;
    const problemWeight = 0.20;
    const practiceWeight = 0.18;
    const psychWeight = 0.12;
    const studyWeight = 0.10;
    const examWeight = 0.10;
    const gradeWeight = 0.05;
    
    const totalWeight = specialtyWeight + problemWeight + practiceWeight + psychWeight + studyWeight + examWeight + gradeWeight;
    
    const weightedScore = 
      specialtyBlock * specialtyWeight +
      problemSolving * problemWeight +
      practiceIntensity * practiceWeight +
      psychologicalHealth * psychWeight +
      studyQuality * studyWeight +
      examPrepScore * examWeight +
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

      const response = await fetch(`${API_URL}/api/bacyear/techno/predict`, {
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
            ⚙️ GM | ⚡ GE | 🏗️ GC | 🧪 GP
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
        <span>🔧 التكنولوجيا - شعبة تقني رياضي</span>
        <span>⭐ المهارة الأكثر أهمية: حل المسائل وقراءة المخططات</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}