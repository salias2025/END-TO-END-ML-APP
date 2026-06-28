// src/bac_year/economie.jsx
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

// Economics & Management (الاقتصاد والمناجمنت) - Gestion & Economics Stream
const subjectData = {
  id: 'economie',
  name: '📈 الاقتصاد والمناجمنت',
  nameEn: 'Economics & Management',
  icon: '📈',
  examDuration: '3h 30min',
  totalPoints: 20,
  direction: 'rtl',
  language: 'ar',
  stream: 'Gestion',
  
  // ============================================
  // ECONOMICS & MANAGEMENT DERIVED FEATURES
  // ============================================
  derivedFeatures: [
    {
      id: 'economics_composite',
      name: '📊 المستوى الاقتصادي العام',
      nameEn: 'Overall Economics Level',
      description: 'متوسط مهاراتك في جميع فصول الاقتصاد: آليات السوق، النقود والبنوك، البطالة، التضخم، التجارة الدولية، والتمويل.',
      improvement: 'ركز على فصولك الأضعف في الاقتصاد، خاصة آليات السوق',
      calculate: (data) => {
        return (data.market_mechanisms || 0 + 
                data.money_banking || 0 + 
                data.unemployment || 0 + 
                data.inflation || 0 + 
                data.international_trade || 0 + 
                data.financing || 0) / 6;
      },
      target: 7.0,
      max: 10,
      importance: 'high',
      icon: '📊'
    },
    {
      id: 'management_composite',
      name: '🏢 المستوى الإداري العام',
      nameEn: 'Overall Management Level',
      description: 'متوسط مهاراتك في فصول المناجمنت: الاتصال، الرقابة، والقيادة والتحفيز.',
      improvement: 'ركز على الاتصال والرقابة - هذه المفاهيم تأتي بكثرة في البكالوريا',
      calculate: (data) => {
        return (data.communication || 0 + 
                data.control || 0 + 
                data.leadership_motivation || 0) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '🏢'
    },
    {
      id: 'economic_skills_composite',
      name: '🔍 المهارات الاقتصادية التطبيقية - الأهم!',
      nameEn: 'Applied Economic Skills',
      description: 'أهم مؤشر! يجمع مهاراتك في: تحليل الوضعيات، قراءة المنحنيات، دقة الحسابات، والإجابة المنظمة. يمثل 40% من نقاط الامتحان.',
      improvement: 'ركز على تحليل الوضعيات وقراءة المنحنيات - تدرب على تطبيق المفاهيم على حالات واقعية!',
      calculate: (data) => {
        return (data.situation_analysis || 0 + 
                data.graph_interpretation || 0 + 
                data.calculation_accuracy || 0 + 
                data.structured_answer || 0) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'critical',
      icon: '🔍',
      weight: '40%'
    },
    {
      id: 'practice_intensity',
      name: '⚡ كثافة التمارين',
      nameEn: 'Practice Intensity',
      description: 'يقيس مدى اجتهادك في حل الامتحانات السابقة وتمارين تحليل الوضعيات. الممارسة هي مفتاح النجاح!',
      improvement: 'حل 8-10 تمارين وضعيات أسبوعياً - هذا يرفع نقطتك 0.4 نقطة لكل 5 تمارين!',
      calculate: (data) => {
        return (data.bac_exams_practiced || 5) / 30 * 10 * 0.5 +
               (data.situation_exercises || 5) / 15 * 10 * 0.5;
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
      id: 'market_focus',
      name: '🎯 التركيز على آليات السوق',
      nameEn: 'Market Focus',
      description: 'يقيس مدى تركيزك على آليات السوق (الطلب والعرض) - أساس الاقتصاد الذي يأتي بكثرة في البكالوريا.',
      improvement: 'راجع آليات السوق بانتظام - إنها الفصل الأكثر أهمية!',
      calculate: (data) => {
        const eco = (data.market_mechanisms || 0 + data.money_banking || 0 + 
                     data.unemployment || 0 + data.inflation || 0 + 
                     data.international_trade || 0 + data.financing || 0) / 6;
        return (data.market_mechanisms || 0) / (eco + 0.1);
      },
      target: 1.0,
      max: 2,
      importance: 'high',
      icon: '🎯'
    },
    {
      id: 'situation_strength',
      name: '💪 قوة تحليل الوضعيات - الأهم!',
      nameEn: 'Situation Analysis Strength',
      description: 'أهم مهارة في البكالوريا! تمثل 40% من نقاط الامتحان. يقيس قدرتك على تطبيق المفاهيم الاقتصادية على حالات واقعية.',
      improvement: 'تدرب على تحليل الوضعيات بانتظام - هذه هي المفتاح للنجاح!',
      calculate: (data) => {
        const skills = (data.situation_analysis || 0 + 
                        data.graph_interpretation || 0 + 
                        data.calculation_accuracy || 0 + 
                        data.structured_answer || 0) / 4;
        return (data.situation_analysis || 0) / (skills + 0.1);
      },
      target: 1.0,
      max: 2,
      importance: 'critical',
      icon: '💪'
    },
    {
      id: 'skill_balance',
      name: '⚖️ توازن المهارات',
      nameEn: 'Skill Balance',
      description: 'يقيس التوازن بين مهاراتك في الاقتصاد والإدارة. القيمة المنخفضة = مهارات متوازنة.',
      improvement: 'ركز قليلاً على الجانب الأضعف لتحقيق توازن أفضل',
      calculate: (data) => {
        const eco = (data.market_mechanisms || 0 + data.money_banking || 0 + 
                     data.unemployment || 0 + data.inflation || 0 + 
                     data.international_trade || 0 + data.financing || 0) / 6;
        const mgmt = (data.communication || 0 + data.control || 0 + 
                      data.leadership_motivation || 0) / 3;
        return Math.pow(eco - mgmt, 2);
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
    title: '📈 امتحان البكالوريا - الاقتصاد والمناجمنت',
    titleEn: 'Economics & Management Baccalaureate Exam',
    streams: [
      {
        name: '📈 الاقتصاد والمناجمنت - شعبة تسيير واقتصاد',
        nameEn: 'Economics & Management - Gestion Stream',
        color: '#3498db',
        exercises: [
          {
            name: 'الجزء الأول: الأسئلة المباشرة',
            nameEn: 'Part 1: Direct Questions',
            content: 'تعريفات، مفاهيم، شرح مصطلحات اقتصادية وإدارية',
            contentEn: 'Definitions, concepts, explanation of economic and management terms',
            points: '6 points (30%)',
            subParts: [
              { name: 'المفاهيم الاقتصادية', points: '2-3 نقاط', skills: 'تعريفات، شرح' },
              { name: 'المفاهيم الإدارية', points: '2-3 نقاط', skills: 'تعريفات، شرح' }
            ]
          },
          {
            name: 'الجزء الثاني: تمارين تطبيقية',
            nameEn: 'Part 2: Applied Exercises',
            content: 'جداول، منحنيات، حسابات اقتصادية',
            contentEn: 'Tables, graphs, economic calculations',
            points: '6 points (30%)',
            subParts: [
              { name: 'تحليل منحنيات', points: '3 نقاط', skills: 'الطلب، العرض، التوازن' },
              { name: 'حسابات اقتصادية', points: '3 نقاط', skills: 'الفائض، المرونة، الكميات' }
            ]
          },
          {
            name: 'الجزء الثالث: وضعية إدماجية',
            nameEn: 'Part 3: Integrative Situation',
            content: 'تحليل وضعية اقتصادية، تطبيق المفاهيم على حالات واقعية',
            contentEn: 'Economic situation analysis, applying concepts to real cases',
            points: '8 points (40%)',
            subParts: [
              { name: 'تحليل الوضعية', points: '4-5 نقاط', skills: 'تطبيق المفاهيم' },
              { name: 'الاستنتاج والتوصيات', points: '3-4 نقاط', skills: 'التحليل والتركيب' }
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
    // Economics Chapters
    market_mechanisms: {
      name: '📊 آليات السوق (الطلب، العرض، التوازن)',
      nameEn: 'Market Mechanisms (Demand, Supply, Equilibrium)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'economics',
      isCore: true
    },
    money_banking: {
      name: '💰 النقود والبنوك (وظائف النقود، النظام المصرفي)',
      nameEn: 'Money & Banking (Money Functions, Banking System)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'economics'
    },
    unemployment: {
      name: '📉 البطالة (أنواعها، أسبابها، آثارها)',
      nameEn: 'Unemployment (Types, Causes, Effects)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'economics'
    },
    inflation: {
      name: '📈 التضخم (أنواعه، أسبابه، آثاره)',
      nameEn: 'Inflation (Types, Causes, Effects)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'economics'
    },
    international_trade: {
      name: '🌍 التجارة الدولية (ميزان المدفوعات، سعر الصرف)',
      nameEn: 'International Trade (Balance of Payments, Exchange Rate)',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'economics'
    },
    financing: {
      name: '💰 التمويل (تمويل ذاتي، تمويل خارجي)',
      nameEn: 'Financing (Self-Financing, External Financing)',
      target: 6.5,
      importance: 'medium',
      weight: '15-20%',
      category: 'economics'
    },
    // Management Chapters
    communication: {
      name: '💬 الاتصال (أنواعه، اتجاهاته)',
      nameEn: 'Communication (Types, Directions)',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'management'
    },
    control: {
      name: '📋 الرقابة (مراحلها، أنواعها)',
      nameEn: 'Control (Stages, Types)',
      target: 6.0,
      importance: 'medium',
      weight: '10-15%',
      category: 'management'
    },
    leadership_motivation: {
      name: '👔 القيادة والتحفيز (أساليب القيادة، نظريات التحفيز)',
      nameEn: 'Leadership & Motivation (Leadership Styles, Motivation Theories)',
      target: 5.5,
      importance: 'low',
      weight: '8-12%',
      category: 'management'
    },
    // Applied Skills (MOST IMPORTANT)
    situation_analysis: {
      name: '🔍 تحليل الوضعيات (تطبيق المفاهيم على حالات واقعية)',
      nameEn: 'Situation Analysis (Applying concepts to real cases)',
      target: 7.5,
      importance: 'critical',
      weight: '40-45%',
      category: 'applied',
      isCore: true
    },
    graph_interpretation: {
      name: '📈 قراءة وتحليل المنحنيات (الطلب، العرض، التوازن)',
      nameEn: 'Graph Interpretation (Demand, Supply, Equilibrium)',
      target: 7.0,
      importance: 'high',
      weight: '25-30%',
      category: 'applied'
    },
    calculation_accuracy: {
      name: '🧮 دقة الحسابات (الفائض، المرونة، الكميات)',
      nameEn: 'Calculation Accuracy (Surplus, Elasticity, Quantities)',
      target: 6.5,
      importance: 'high',
      weight: '20-25%',
      category: 'applied'
    },
    structured_answer: {
      name: '✍️ الإجابة المنظمة (مقدمة، عرض، خاتمة)',
      nameEn: 'Structured Answer (Introduction, Body, Conclusion)',
      target: 6.0,
      importance: 'high',
      weight: '15-20%',
      category: 'applied'
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
    situation_exercises: {
      name: '📋 عدد تمارين تحليل الوضعيات المحلولة أسبوعياً',
      nameEn: 'Situation Analysis Exercises per Week',
      target: 10,
      max: 15,
      category: 'practice',
      impact: 0.04
    },
    study_hours: {
      name: '⏰ عدد ساعات الدراسة الأسبوعية',
      nameEn: 'Study Hours per Week',
      target: 4,
      max: 12,
      category: 'practice',
      impact: 0.012
    },
    consistency: {
      name: '📅 مدى انتظامك في الدراسة',
      nameEn: 'Study Consistency',
      target: 7,
      max: 10,
      category: 'practice',
      impact: 0.015
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS (LOW IMPACT)
  // ============================================
  psychological: {
    eco_anxiety: {
      name: '😰 قلق الاقتصاد والمناجمنت',
      nameEn: 'Economics & Management Anxiety',
      target: 4,
      max: 10,
      isNegative: true,
      impact: -0.01
    },
    analysis_confidence: {
      name: '💪 الثقة في تحليل الوضعيات',
      nameEn: 'Situation Analysis Confidence',
      target: 7,
      max: 10,
      isNegative: false,
      impact: 0.012
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
    '🔍 تحليل الوضعيات هو المهارة الأكثر أهمية - 40% من النقاط تعتمد عليه!',
    '📊 آليات السوق (الطلب والعرض) تأتي بكثرة في البكالوريا',
    '📋 حل تمارين الوضعيات يرفع نقطتك 0.4 نقطة لكل 5 تمارين',
    '📚 حل 10 امتحانات سابقة يرفع نقطتك 0.35 نقطة',
    '📈 تدرب على قراءة المنحنيات - مهم جداً في الجزء الثاني',
    '✍️ نظم إجاباتك (مقدمة، عرض، خاتمة) لتكسب نقاطاً إضافية',
    '🧮 دقة الحسابات مهمة - لا تهملها!',
    '😌 طلاب التسيير هادئون - العوامل النفسية لها تأثير ضئيل'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '🔍 تحليل الوضعيات', weight: '40-45%', color: '#e74c3c' },
    { skill: '📊 آليات السوق', weight: '25-30%', color: '#e67e22' },
    { skill: '📈 قراءة المنحنيات', weight: '25-30%', color: '#f1c40f' },
    { skill: '🏢 الإدارة (اتصال، رقابة)', weight: '20-25%', color: '#2ecc71' },
    { skill: '📉 البطالة + التضخم', weight: '15-20%', color: '#9b59b6' }
  ],
  
  // ============================================
  // KEY FACTS
  // ============================================
  keyFacts: {
    mostImportant: '🔍 تحليل الوضعيات (40% من النقاط)',
    examDuration: '3 ساعات و30 دقيقة',
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
export default function Economie() {
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
    console.log('📊 ECONOMIE - Using fallback calculation');
    
    const avgGrade = (data.eco_grade_t1 + data.eco_grade_t2 + data.eco_grade_t3) / 3;
    
    // Economics composite
    const economics = (data.market_mechanisms || 5 + data.money_banking || 5 + 
                       data.unemployment || 5 + data.inflation || 5 + 
                       data.international_trade || 5 + data.financing || 5) / 6;
    
    // Management composite
    const management = (data.communication || 5 + data.control || 5 + 
                        data.leadership_motivation || 5) / 3;
    
    // Applied skills (MOST IMPORTANT)
    const appliedSkills = (data.situation_analysis || 5 + 
                           data.graph_interpretation || 5 + 
                           data.calculation_accuracy || 5 + 
                           data.structured_answer || 5) / 4;
    
    // Practice intensity
    const practiceIntensity = (data.bac_exams_practiced || 5) / 30 * 10 * 0.5 +
                              (data.situation_exercises || 5) / 15 * 10 * 0.5;
    
    // Study quality
    const studyQuality = (data.consistency || 5) * 0.6 + 
                         (data.study_hours || 5) / 12 * 10 * 0.4;
    
    // Psychological (LOW impact)
    const psychHealth = (data.analysis_confidence || 5 + 
                         (10 - (data.eco_anxiety || 5)) + 
                         (10 - (data.exam_stress || 5))) / 3;
    
    // Weights
    const appliedWeight = 0.40;
    const ecoWeight = 0.20;
    const mgmtWeight = 0.10;
    const practiceWeight = 0.15;
    const studyWeight = 0.07;
    const psychWeight = 0.03;
    const gradeWeight = 0.05;
    
    const totalWeight = appliedWeight + ecoWeight + mgmtWeight + practiceWeight + studyWeight + psychWeight + gradeWeight;
    
    const weightedScore = 
      appliedSkills * appliedWeight +
      economics * ecoWeight +
      management * mgmtWeight +
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
      economics_composite: Math.round(economics * 100) / 100,
      management_composite: Math.round(management * 100) / 100,
      economic_skills_composite: Math.round(appliedSkills * 100) / 100,
      practice_intensity: Math.round(Math.min(10, Math.max(0, practiceIntensity)) * 100) / 100,
      study_quality: Math.round(Math.min(10, Math.max(0, studyQuality)) * 100) / 100,
      psychological_composite: Math.round(Math.min(10, Math.max(0, psychHealth)) * 100) / 100,
      market_focus: Math.round((data.market_mechanisms || 5) / (economics + 0.1) * 100) / 100,
      situation_strength: Math.round((data.situation_analysis || 5) / (appliedSkills + 0.1) * 100) / 100,
      imbalance_score: Math.round(Math.pow(economics - management, 2) * 100) / 100
    };
    
    // Calculate weaknesses
    const weaknesses = [];
    const skillMap = {
      market_mechanisms: { name: 'آليات السوق', target: 7.0 },
      money_banking: { name: 'النقود والبنوك', target: 6.5 },
      unemployment: { name: 'البطالة', target: 6.5 },
      inflation: { name: 'التضخم', target: 6.5 },
      international_trade: { name: 'التجارة الدولية', target: 6.0 },
      financing: { name: 'التمويل', target: 6.5 },
      communication: { name: 'الاتصال', target: 6.0 },
      control: { name: 'الرقابة', target: 6.0 },
      leadership_motivation: { name: 'القيادة والتحفيز', target: 5.5 },
      situation_analysis: { name: 'تحليل الوضعيات', target: 7.5 },
      graph_interpretation: { name: 'قراءة المنحنيات', target: 7.0 },
      calculation_accuracy: { name: 'دقة الحسابات', target: 6.5 },
      structured_answer: { name: 'الإجابة المنظمة', target: 6.0 }
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

      console.log('📊 Sending economie prediction request:', data);

      const response = await fetch(`${API_URL}/api/bacyear/economie/predict`, {
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
    console.log('📊 ECONOMIE - Form Data Submitted:', data);
    console.log('📊 ECONOMIE - Field names:', Object.keys(data));
    
    setFormData(data);
    setLoading(true);
    setError(null);

    try {
      const result = await callPredict(data);
      
      console.log('📊 ECONOMIE - Result:', result);
      console.log('📊 ECONOMIE - derived_features from result:', result.derived_features);
      
      setPrediction(result.prediction);
      setWeaknessData(result.weaknesses);
      setFeatureData(result.derived_features);
      
      console.log('📊 ECONOMIE - featureData set to:', result.derived_features);
      
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
            📈 شعبة تسيير واقتصاد
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
        <span>📈 الاقتصاد والمناجمنت - شعبة تسيير واقتصاد</span>
        <span>⭐ المهارة الأكثر أهمية: تحليل الوضعيات</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}