// src/bac_year/english.jsx
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

// English subject specific data
const subjectData = {
  id: 'english',
  name: '📖 English',
  icon: '📖',
  examDuration: '3h',
  totalPoints: 20,
  
  // ============================================
  // ENGLISH-SPECIFIC DERIVED FEATURES
  // ✅ MATCHING BACKEND RESPONSE
  // ============================================
  derivedFeatures: [
    {
      id: 'reading_score_derived',
      name: '📖 Reading Comprehension Score',
      description: 'This measures your ability to understand English texts, find main ideas, make inferences, and follow text structure.',
      improvement: 'Read English articles daily and practice identifying the main idea of each paragraph.',
      calculate: (data) => {
        const skills = [
          data.main_idea_detection || 0,
          data.inference_skill || 0,
          data.text_structure || 0,
          data.ordering_information || 0,
          data.skimming_scanning || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'language_score_derived',
      name: '📚 Language & Grammar Score',
      description: 'This measures your knowledge of English grammar, tenses, conditionals, passive voice, word formation, and vocabulary.',
      improvement: 'Review grammar rules, practice sentence transformations, and learn new words daily.',
      calculate: (data) => {
        const skills = [
          data.synonym_accuracy || 0,
          data.antonym_accuracy || 0,
          data.transformation_skill || 0,
          data.conditional_mastery || 0,
          data.tense_control || 0,
          data.vocabulary_richness || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'writing_score_derived',
      name: '✍️ Writing Production Score',
      description: 'This measures your ability to write well-structured essays with clear arguments, good coherence, and proper grammar.',
      improvement: 'Write one essay per week and ask someone to correct it. Focus on structure and linking words.',
      calculate: (data) => {
        const skills = [
          data.essay_structure || 0,
          data.guided_writing || 0,
          data.argumentation_skill || 0,
          data.coherence_score || 0,
          data.cohesion_score || 0,
          data.writing_grammar || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'grammar_mastery',
      name: '🔤 Grammar Mastery',
      description: 'This focuses specifically on your mastery of tenses, conditionals, passive voice, and sentence transformations.',
      improvement: 'Review grammar rules and do practice exercises regularly.',
      calculate: (data) => {
        const skills = [
          data.conditional_mastery || 0,
          data.tense_control || 0,
          data.transformation_skill || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.0,
      max: 10,
      importance: 'high'
    },
    {
      id: 'vocabulary_score',
      name: '📖 Vocabulary Score',
      description: 'This measures your knowledge of synonyms, antonyms, word families, and word formation.',
      improvement: 'Learn 5-10 new words daily and review them weekly.',
      calculate: (data) => {
        const skills = [
          data.synonym_accuracy || 0,
          data.antonym_accuracy || 0,
          data.vocabulary_richness || 0
        ];
        return skills.reduce((a, b) => a + b, 0) / skills.length;
      },
      target: 7.0,
      max: 10,
      importance: 'high'
    },
    {
      id: 'practice_intensity_derived',
      name: '⚡ Practice Intensity',
      description: 'This measures how much you practice English through reading, writing, and solving past exams.',
      improvement: 'Solve past BAC exams, read English daily, and write essays regularly.',
      calculate: (data) => {
        const writing = data.writing_frequency || 0;
        const reading = data.reading_frequency || 0;
        const exams = data.past_exam_practice || 0;
        return (writing * 2 + reading + exams / 3) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'overall_proficiency',
      name: '📊 Overall Proficiency',
      description: 'This is your overall English proficiency score, combining reading, language, and writing skills.',
      improvement: 'Keep working on all areas to improve your overall proficiency.',
      calculate: (data) => {
        const reading = (data.main_idea_detection || 0 + data.inference_skill || 0 + data.text_structure || 0 + data.ordering_information || 0 + data.skimming_scanning || 0) / 5;
        const language = (data.synonym_accuracy || 0 + data.antonym_accuracy || 0 + data.transformation_skill || 0 + data.conditional_mastery || 0 + data.tense_control || 0 + data.vocabulary_richness || 0) / 6;
        const writing = (data.essay_structure || 0 + data.guided_writing || 0 + data.argumentation_skill || 0 + data.coherence_score || 0 + data.cohesion_score || 0 + data.writing_grammar || 0) / 6;
        return (reading + language + writing) / 3;
      },
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'skill_balance',
      name: '⚖️ Skill Balance',
      description: 'This measures how balanced your reading, grammar, and writing skills are. A lower score means your skills are more balanced.',
      improvement: 'Your skills are well balanced! Keep working on all areas equally.',
      calculate: (data) => {
        const reading = (data.main_idea_detection || 0 + data.inference_skill || 0) / 2;
        const grammar = (data.transformation_skill || 0 + data.conditional_mastery || 0 + data.tense_control || 0) / 3;
        const writing = (data.essay_structure || 0 + data.coherence_score || 0 + data.cohesion_score || 0) / 3;
        const skills = [reading, grammar, writing];
        const avg = skills.reduce((a, b) => a + b, 0) / skills.length;
        return skills.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / skills.length;
      },
      target: 0.5,
      max: 5,
      importance: 'medium',
      isSpecial: true
    }
  ],
  
  // ============================================
  // EXAM STRUCTURE
  // ============================================
  examStructure: {
    title: '📖 English Baccalaureate Exam',
    streams: [
      {
        name: '📖 English BAC - All Streams',
        color: '#3498db',
        exercises: [
          { name: 'Reading Comprehension', content: 'Main idea, inference, reference words, text structure, ordering', points: '7-8 points (35-40%)' },
          { name: 'Language (Text Exploration)', content: 'Grammar, vocabulary, synonyms, antonyms, transformation, conditionals', points: '7-8 points (35-40%)' },
          { name: 'Written Expression', content: 'Essay writing, argumentation, coherence, cohesion, grammar', points: '5-6 points (25-30%)' }
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
      name: '📖 Main Idea Detection',
      target: 7.5,
      importance: 'high',
      weight: '35-40%'
    },
    inference_skill: {
      name: '🎯 Inference (Reading between lines)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    text_structure: {
      name: '📚 Text Structure Understanding',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%'
    },
    ordering_information: {
      name: '📝 Ordering Information',
      target: 7.0,
      importance: 'medium',
      weight: '20-25%'
    },
    skimming_scanning: {
      name: '⚡ Skimming & Scanning',
      target: 7.0,
      importance: 'medium',
      weight: '20-25%'
    },
    // Language Skills
    synonym_accuracy: {
      name: '📖 Synonyms',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    antonym_accuracy: {
      name: '📖 Antonyms',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    transformation_skill: {
      name: '✍️ Sentence Transformation',
      target: 7.0,
      importance: 'high',
      weight: '35-40%'
    },
    conditional_mastery: {
      name: '📚 Conditionals (Type 1,2,3)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    tense_control: {
      name: '⏰ Tense Control',
      target: 7.5,
      importance: 'high',
      weight: '35-40%'
    },
    vocabulary_richness: {
      name: '📚 Vocabulary Richness',
      target: 7.5,
      importance: 'high',
      weight: '30-35%'
    },
    // Writing Skills
    essay_structure: {
      name: '📋 Essay Structure',
      target: 7.5,
      importance: 'high',
      weight: '35-40%'
    },
    guided_writing: {
      name: '📝 Guided Writing',
      target: 7.0,
      importance: 'medium',
      weight: '25-30%'
    },
    argumentation_skill: {
      name: '🎓 Argumentation Skills',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    coherence_score: {
      name: '🔗 Coherence (Logical flow)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    cohesion_score: {
      name: '🔗 Cohesion (Linking words)',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    },
    writing_grammar: {
      name: '📖 Grammar in Writing',
      target: 7.0,
      importance: 'high',
      weight: '30-35%'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    reading_frequency: { name: '📖 Reading hours per week', target: 7, max: 10 },
    writing_frequency: { name: '✍️ Essays per week', target: 3, max: 5 },
    grammar_exercises: { name: '📝 Grammar exercises completed', target: 10, max: 20 },
    past_exam_practice: { name: '📚 Past BAC exams solved', target: 15, max: 20 },
    study_hours: { name: '⏰ Study hours per week', target: 6, max: 12 },
    consistency: { name: '📅 Study consistency (1-5)', target: 4, max: 5 }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    confidence: { name: '💪 Confidence', target: 4, max: 5, isNegative: false },
    stress: { name: '😰 Stress level', target: 3, max: 5, isNegative: true },
    motivation: { name: '❤️ Motivation', target: 4, max: 5, isNegative: false },
    tutoring: { name: '🧑‍🏫 Private tutoring', target: 1, max: 1, isNegative: false },
    teacher_support: { name: '👩‍🏫 Teacher support', target: 4, max: 5, isNegative: false },
    class_participation: { name: '🗣️ Class participation', target: 4, max: 5, isNegative: false }
  },
  
  // ============================================
  // TIPS
  // ============================================
  tips: [
    '📖 Reading Comprehension is the most important skill - 35-40% of the exam!',
    '📚 Solving past BAC exams is one of the best ways to improve your score',
    '✍️ Structure your essays: introduction, body paragraphs, conclusion',
    '🔤 Practice grammar transformations and conditionals regularly',
    '📖 Read one English article daily to build vocabulary and comprehension',
    '💪 Regular practice is more important than studying for hours before the exam'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: 'Reading Comprehension', weight: '35-40%', color: '#e74c3c' },
    { skill: 'Language & Grammar', weight: '35-40%', color: '#e67e22' },
    { skill: 'Writing Production', weight: '25-30%', color: '#f1c40f' },
    { skill: 'Past Exam Practice', weight: 'Pattern Recognition', color: '#2ecc71' }
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
export default function English() {
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
    
    // Reading skills (35-40%)
    const readingWeight = 0.18;
    const inferenceWeight = 0.12;
    const structureWeight = 0.08;
    
    // Language skills (35-40%)
    const grammarWeight = 0.10;
    const conditionalWeight = 0.08;
    const tenseWeight = 0.08;
    const vocabWeight = 0.08;
    const synonymWeight = 0.06;
    const antonymWeight = 0.04;
    
    // Writing skills (25-30%)
    const essayWeight = 0.10;
    const argumentWeight = 0.08;
    const coherenceWeight = 0.06;
    const cohesionWeight = 0.06;
    const writingGrammarWeight = 0.06;
    
    const totalWeight = readingWeight + inferenceWeight + structureWeight +
                        grammarWeight + conditionalWeight + tenseWeight + vocabWeight + synonymWeight + antonymWeight +
                        essayWeight + argumentWeight + coherenceWeight + cohesionWeight + writingGrammarWeight;
    
    const weightedSkills = 
      (data.main_idea_detection || 5) * readingWeight +
      (data.inference_skill || 5) * inferenceWeight +
      (data.text_structure || 5) * structureWeight +
      (data.tense_control || 5) * tenseWeight +
      (data.conditional_mastery || 5) * conditionalWeight +
      (data.transformation_skill || 5) * grammarWeight +
      (data.vocabulary_richness || 5) * vocabWeight +
      (data.synonym_accuracy || 5) * synonymWeight +
      (data.antonym_accuracy || 5) * antonymWeight +
      (data.essay_structure || 5) * essayWeight +
      (data.argumentation_skill || 5) * argumentWeight +
      (data.coherence_score || 5) * coherenceWeight +
      (data.cohesion_score || 5) * cohesionWeight +
      (data.writing_grammar || 5) * writingGrammarWeight;
    
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    // Practice score
    const practiceScore = Math.min(10,
      (data.past_exam_practice || 5) / 20 * 10 * 0.4 +
      (data.writing_frequency || 2) / 5 * 10 * 0.25 +
      (data.reading_frequency || 5) / 10 * 10 * 0.2 +
      (data.study_hours || 5) / 12 * 10 * 0.15
    );
    
    // Psychological score
    const psychScore = (
      (data.confidence || 3) / 5 * 10 * 0.4 +
      (10 - (data.stress || 3) / 5 * 10) * 0.3 +
      (data.motivation || 3) / 5 * 10 * 0.15 +
      (data.class_participation || 3) / 5 * 10 * 0.15
    );
    
    const rawScore = (
      avgGrade * 0.10 +
      weightedSkillsScore * 0.55 +
      practiceScore * 0.25 +
      psychScore * 0.10
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

      const response = await fetch(`${API_URL}/api/bacyear/english/predict`, {
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
          <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{subjectData.icon} {subjectData.name}</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            Duration: {subjectData.examDuration} | Total: {subjectData.totalPoints} points
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
          const steps = ['exam_structure', 'input_form', 'prediction', 'weaknesses', 'derived', 'simulation', 'final_report'];
          const isCompleted = steps.indexOf(s) < steps.indexOf(step);
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
        <span>📚 {subjectData.name} - All Streams</span>
        <span>⭐ Most important skill: Reading Comprehension</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} skills</span>
      </div>
    </div>
  );
}