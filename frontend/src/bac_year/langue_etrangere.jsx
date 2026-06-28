// src/bac_year/langue_etrangere.jsx
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

// Foreign Languages (Spanish | German | Italian) subject data
const subjectData = {
  id: 'langue_etrangere',
  name: '📖 Foreign Languages',
  icon: '📖',
  examDuration: '3h',
  totalPoints: 20,
  direction: 'ltr',
  language: 'en',
  
  // ============================================
  // 8 CORE DERIVED FEATURES - Matching Backend
  // ============================================
  derivedFeatures: [
    {
      id: 'reading_score',
      name: '📖 Reading Comprehension',
      description: 'Measures your ability to understand texts, find main ideas, extract details, and make inferences.',
      improvement: 'Read articles daily and practice answering comprehension questions.',
      calculate: (data) => {
        const skills = [
          data.main_idea_detection || 0,
          data.detail_extraction || 0,
          data.true_false_accuracy || 0,
          data.reference_resolution || 0,
          data.inference_skill || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '📖'
    },
    {
      id: 'linguistic_score',
      name: '📚 Linguistic Competence',
      description: 'Measures your knowledge of vocabulary, grammar, tenses, transformations, prepositions, and translation.',
      improvement: 'Practice vocabulary, grammar exercises, and translation daily.',
      calculate: (data) => {
        const skills = [
          data.synonym_antonym || 0,
          data.word_formation || 0,
          data.tense_mastery || 0,
          data.grammar_transformation || 0,
          data.sentence_rewriting || 0,
          data.preposition_mastery || 0,
          data.translation_skill || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '📚'
    },
    {
      id: 'writing_score',
      name: '✍️ Writing Production',
      description: 'Measures your ability to write well-structured paragraphs and essays with clear ideas.',
      improvement: 'Write one paragraph or essay per week with clear structure and linking words.',
      calculate: (data) => {
        const skills = [
          data.paragraph_structure || 0,
          data.coherence_cohesion || 0,
          data.idea_development || 0,
          data.language_accuracy || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '✍️'
    },
    {
      id: 'grammar_mastery',
      name: '🔤 Grammar Mastery',
      description: 'Measures your mastery of tenses, transformations, sentence rewriting, and prepositions.',
      improvement: 'Practice grammar exercises regularly and review rules.',
      calculate: (data) => {
        const skills = [
          data.tense_mastery || 0,
          data.grammar_transformation || 0,
          data.sentence_rewriting || 0,
          data.preposition_mastery || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '🔤'
    },
    {
      id: 'vocabulary_score',
      name: '📖 Vocabulary Score',
      description: 'Measures your knowledge of synonyms, antonyms, and word formation.',
      improvement: 'Learn 10 new words daily and review them weekly.',
      calculate: (data) => {
        const skills = [
          data.synonym_antonym || 0,
          data.word_formation || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '📖'
    },
    {
      id: 'overall_proficiency',
      name: '📊 Overall Proficiency',
      description: 'Your overall language proficiency score, combining reading, linguistic, and writing skills.',
      improvement: 'Keep working on all areas to improve your overall proficiency.',
      calculate: (data) => {
        const reading = (data.main_idea_detection || 0 + data.detail_extraction || 0 + data.true_false_accuracy || 0 + data.reference_resolution || 0 + data.inference_skill || 0) / 5;
        const linguistic = (data.synonym_antonym || 0 + data.word_formation || 0 + data.tense_mastery || 0 + data.grammar_transformation || 0 + data.sentence_rewriting || 0 + data.preposition_mastery || 0 + data.translation_skill || 0) / 7;
        const writing = (data.paragraph_structure || 0 + data.coherence_cohesion || 0 + data.idea_development || 0 + data.language_accuracy || 0) / 4;
        return (reading + linguistic + writing) / 3;
      },
      target: 7.5,
      max: 10,
      importance: 'high',
      icon: '📊'
    },
    {
      id: 'practice_intensity',
      name: '⚡ Practice Intensity',
      description: 'Measures how much you practice through reading, exercises, and solving past exams.',
      improvement: 'Solve past BAC exams, read daily, and do grammar exercises regularly.',
      calculate: (data) => {
        return (data.writing_tasks_per_week * 2 + 
                data.texts_read_per_week + 
                data.bac_subjects_practiced / 2 + 
                data.exercises_done_per_week / 2) / 4;
      },
      target: 7.0,
      max: 10,
      importance: 'medium',
      icon: '⚡'
    },
    {
      id: 'skill_balance',
      name: '⚖️ Skill Balance',
      description: 'Measures how balanced your reading, grammar, and writing skills are. A lower score means your skills are more balanced.',
      improvement: 'Identify your weakest skills and focus on improving them.',
      calculate: (data) => {
        const reading = data.main_idea_detection || 0;
        const grammar = data.grammar_transformation || 0;
        const writing = data.paragraph_structure || 0;
        const skills = [reading, grammar, writing];
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
  // EXAM STRUCTURE (All Languages)
  // ============================================
  examStructure: {
    title: '📖 Foreign Languages Baccalaureate Exam',
    titleEn: 'Foreign Languages Baccalaureate Exam',
    streams: [
      {
        name: '📖 Foreign Language BAC - All Languages',
        nameEn: 'Foreign Language BAC - All Languages',
        color: '#3498db',
        exercises: [
          {
            name: '📖 Reading Comprehension',
            nameEn: 'Reading Comprehension',
            content: 'Main idea, details, true/false, references, inference',
            contentEn: 'Main idea, details, true/false, references, inference',
            points: '7-8 points (35-40%)',
            subParts: [
              { name: 'Main Idea', points: '2-3 pts', skills: 'Finding the main idea of the text' },
              { name: 'Details & True/False', points: '2-3 pts', skills: 'Extracting details, true/false questions' },
              { name: 'References & Inference', points: '2-3 pts', skills: 'Pronoun references, reading between lines' }
            ]
          },
          {
            name: '📚 Linguistic Competence',
            nameEn: 'Linguistic Competence',
            content: 'Vocabulary, grammar, tenses, transformations, prepositions, translation',
            contentEn: 'Vocabulary, grammar, tenses, transformations, prepositions, translation',
            points: '7-8 points (35-40%)',
            subParts: [
              { name: 'Vocabulary', points: '2-3 pts', skills: 'Synonyms, antonyms, word formation' },
              { name: 'Grammar', points: '2-3 pts', skills: 'Tenses, transformations, sentence rewriting' },
              { name: 'Translation', points: '2-3 pts', skills: 'Translation from/to the target language' }
            ]
          },
          {
            name: '✍️ Written Production',
            nameEn: 'Written Production',
            content: 'Essay writing, paragraph structure, coherence, language accuracy',
            contentEn: 'Essay writing, paragraph structure, coherence, language accuracy',
            points: '5-6 points (25-30%)',
            subParts: [
              { name: 'Structure', points: '2 pts', skills: 'Paragraph structure, organization' },
              { name: 'Content & Coherence', points: '2 pts', skills: 'Idea development, logical flow' },
              { name: 'Language Accuracy', points: '1-2 pts', skills: 'Grammar, vocabulary, spelling' }
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
    // Reading Skills (Part I)
    main_idea_detection: {
      name: '📖 Main Idea Detection',
      nameEn: 'Main Idea Detection',
      target: 7.5,
      importance: 'high',
      weight: '35-40%',
      category: 'reading'
    },
    detail_extraction: {
      name: '🔍 Detail Extraction',
      nameEn: 'Detail Extraction',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'reading'
    },
    true_false_accuracy: {
      name: '✓✗ True/False Accuracy',
      nameEn: 'True/False Accuracy',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%',
      category: 'reading'
    },
    reference_resolution: {
      name: '🔗 Reference Resolution (pronouns)',
      nameEn: 'Reference Resolution',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%',
      category: 'reading'
    },
    inference_skill: {
      name: '🎯 Inference Skill',
      nameEn: 'Inference Skill',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'reading'
    },
    // Linguistic Skills (Part II)
    synonym_antonym: {
      name: '📖 Synonyms & Antonyms',
      nameEn: 'Synonyms & Antonyms',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'linguistic'
    },
    word_formation: {
      name: '🔤 Word Formation (prefix/suffix)',
      nameEn: 'Word Formation',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'linguistic'
    },
    tense_mastery: {
      name: '⏰ Tense Mastery',
      nameEn: 'Tense Mastery',
      target: 7.5,
      importance: 'high',
      weight: '35-40%',
      category: 'linguistic'
    },
    grammar_transformation: {
      name: '✍️ Grammar Transformation',
      nameEn: 'Grammar Transformation',
      target: 7.0,
      importance: 'high',
      weight: '35-40%',
      category: 'linguistic'
    },
    sentence_rewriting: {
      name: '📝 Sentence Rewriting',
      nameEn: 'Sentence Rewriting',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'linguistic'
    },
    preposition_mastery: {
      name: '📍 Preposition Mastery',
      nameEn: 'Preposition Mastery',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%',
      category: 'linguistic'
    },
    translation_skill: {
      name: '🌐 Translation Skill',
      nameEn: 'Translation Skill',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%',
      category: 'linguistic'
    },
    // Writing Skills (Part III)
    paragraph_structure: {
      name: '📋 Paragraph Structure',
      nameEn: 'Paragraph Structure',
      target: 7.5,
      importance: 'high',
      weight: '35-40%',
      category: 'writing'
    },
    coherence_cohesion: {
      name: '🔗 Coherence & Cohesion',
      nameEn: 'Coherence & Cohesion',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'writing'
    },
    idea_development: {
      name: '💡 Idea Development',
      nameEn: 'Idea Development',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'writing'
    },
    language_accuracy: {
      name: '📖 Language Accuracy',
      nameEn: 'Language Accuracy',
      target: 7.0,
      importance: 'high',
      weight: '30-35%',
      category: 'writing'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    texts_read_per_week: {
      name: '📖 Texts Read per Week',
      nameEn: 'Texts Read per Week',
      target: 7,
      max: 10,
      category: 'practice'
    },
    exercises_done_per_week: {
      name: '📝 Grammar Exercises per Week',
      nameEn: 'Grammar Exercises per Week',
      target: 10,
      max: 20,
      category: 'practice'
    },
    bac_subjects_practiced: {
      name: '📚 Past BAC Exams Solved',
      nameEn: 'Past BAC Exams Solved',
      target: 15,
      max: 20,
      category: 'practice'
    },
    writing_tasks_per_week: {
      name: '✍️ Writing Tasks per Week',
      nameEn: 'Writing Tasks per Week',
      target: 3,
      max: 5,
      category: 'practice'
    }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    confidence: {
      name: '💪 Confidence',
      nameEn: 'Confidence',
      target: 4,
      max: 5,
      isNegative: false
    },
    stress: {
      name: '😰 Stress Level',
      nameEn: 'Stress Level',
      target: 3,
      max: 5,
      isNegative: true
    }
  },
  
  // ============================================
  // TIPS
  // ============================================
  tips: [
    '📚 Grammar transformations and past exam practice have the biggest impact on your score!',
    '📖 Reading Comprehension is 35-40% of the exam - practice daily',
    '✍️ Structure your writing: introduction, body, conclusion',
    '🔤 Learn 10 new words daily and review them weekly',
    '📖 Read one article daily to build vocabulary and comprehension',
    '💪 Confidence affects your performance - start with easier exercises first'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: '✍️ Grammar & Transformations', weight: '40%', color: '#e74c3c' },
    { skill: '📖 Reading Comprehension', weight: '35%', color: '#e67e22' },
    { skill: '✍️ Writing Production', weight: '25%', color: '#f1c40f' },
    { skill: '📚 Past Exam Practice', weight: 'Boosts your score', color: '#2ecc71' }
  ],
  
  // ============================================
  // LANGUAGE SPECIFIC DATA
  // ============================================
  languages: [
    {
      id: 'spanish',
      name: '🇪🇸 Spanish (Español)',
      key: 0,
      grammarPoints: [
        'Verb conjugations (present, preterite, imperfect, future, subjunctive)',
        'Ser vs Estar',
        'Por vs Para',
        'Direct/indirect object pronouns'
      ]
    },
    {
      id: 'german',
      name: '🇩🇪 German (Deutsch)',
      key: 1,
      grammarPoints: [
        'Cases (Nominativ, Akkusativ, Dativ, Genitiv)',
        'Separable verbs',
        'Word order (verb second, verb last)',
        'Modal verbs (können, müssen, wollen, dürfen)'
      ]
    },
    {
      id: 'italian',
      name: '🇮🇹 Italian (Italiano)',
      key: 2,
      grammarPoints: [
        'Verb conjugations (are, ere, ire)',
        'Passato prossimo vs imperfetto',
        'Subjunctive (congiuntivo)',
        'Prepositions and articles'
      ]
    }
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
export default function LangueEtrangere() {
  const [step, setStep] = useState('exam_structure');
  const [formData, setFormData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  // Get language name
  const getLanguageName = (langKey) => {
    const langMap = { 0: 'Spanish', 1: 'German', 2: 'Italian' };
    return langMap[langKey] || 'Spanish';
  };

  // ============================================
  // LOCAL FALLBACK PREDICTION
  // ============================================
  const calculatePrediction = (data) => {
    const avgGrade = (data.grade_t1 + data.grade_t2 + data.grade_t3) / 3;
    
    const readingWeight = 0.18;
    const grammarWeight = 0.20;
    const vocabWeight = 0.12;
    const writingWeight = 0.15;
    const practiceWeight = 0.20;
    const psychWeight = 0.10;
    
    const totalWeight = readingWeight + grammarWeight + vocabWeight + writingWeight + practiceWeight + psychWeight;
    
    const weightedSkills = 
      (data.main_idea_detection || 5) * readingWeight +
      (data.grammar_transformation || 5) * grammarWeight +
      (data.synonym_antonym || 5) * vocabWeight +
      (data.paragraph_structure || 5) * writingWeight +
      (data.bac_subjects_practiced || 5) / 20 * 10 * practiceWeight +
      (data.confidence || 3) / 5 * 10 * psychWeight;
    
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    const practiceScore = Math.min(10,
      (data.bac_subjects_practiced || 5) / 20 * 10 * 0.35 +
      (data.writing_tasks_per_week || 2) / 5 * 10 * 0.25 +
      (data.texts_read_per_week || 5) / 10 * 10 * 0.20 +
      (data.exercises_done_per_week || 5) / 20 * 10 * 0.20
    );
    
    const psychScore = (
      (data.confidence || 3) / 5 * 10 * 0.5 +
      (10 - (data.stress || 3) / 5 * 10) * 0.5
    );
    
    const rawScore = (
      avgGrade * 0.10 +
      weightedSkillsScore * 0.50 +
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
        throw new Error('Please login first');
      }

      // Map generic fields to foreign language fields
      const mappedData = {
        ...data,
        texts_read_per_week: data.study_hours || 0,
        exercises_done_per_week: data.exams_practiced || 0,
        bac_subjects_practiced: data.exams_practiced || 0,
        writing_tasks_per_week: data.essays_per_week || 0,
        language: selectedLanguage
      };

      const response = await fetch(`${API_URL}/api/bacyear/langue_etrangere/predict`, {
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
        throw new Error(result.message || 'Prediction failed');
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
      direction: 'ltr',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
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
          <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>
            {subjectData.icon} {subjectData.name}
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            Duration: {subjectData.examDuration} | Total: {subjectData.totalPoints} points
          </p>
          <p style={{ margin: '2px 0 0 0', opacity: 0.8, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            🇪🇸 Spanish | 🇩🇪 German | 🇮🇹 Italian
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '14px',
          color: 'white'
        }}>
          📊 {Object.keys(subjectData.skills).length} skills
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
            <div>Analyzing...</div>
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
          const labels = ['📋 Structure', '📝 Data', '🔮 Prediction', '📊 Weaknesses', '📖 Scores', '⚡ Simulation', '📋 Report'];
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
                  →
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
        <span>📚 Foreign Languages (Spanish | German | Italian)</span>
        <span>⭐ Most important: Grammar & Transformations</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} skills</span>
      </div>
    </div>
  );
}