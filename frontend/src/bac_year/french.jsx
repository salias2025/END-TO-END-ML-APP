// src/bac_year/french.jsx
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

// French subject specific data
const subjectData = {
  id: 'french',
  name: 'اللغة الفرنسية',
  icon: '🇫🇷',
  examDuration: '3h',
  totalPoints: 20,
  
  // ============================================
  // FRENCH-SPECIFIC DERIVED FEATURES (5 features from notebook)
  // ============================================
  derivedFeatures: [
    {
      id: 'comprehension_score',
      name: '📖 Score de compréhension',
      description: 'Votre capacité à comprendre un texte, à faire des inférences, à justifier vos réponses et à identifier l\'intention de l\'auteur.',
      improvement: 'Lisez des articles de presse quotidiennement et résumez l\'idée principale.',
      calculate: (data) => {
        const comp = data.comprehension_textuelle || 0;
        const inf = data.inference || 0;
        const tf = data.true_false_justification || 0;
        const intent = data.communicative_intent || 0;
        return (comp + inf + tf + intent) / 4;
      },
      target: 7.5,
      max: 10,
      importance: 'high'
    },
    {
      id: 'argumentation_score',
      name: '🎓 Score d\'argumentation',
      description: 'Votre capacité à identifier la thèse de l\'auteur, à reconnaître les arguments et à comprendre les nuances (concession, opposition).',
      improvement: 'Analysez des débats télévisés ou des éditoriaux. Notez les arguments de chaque camp.',
      calculate: (data) => {
        const thesis = data.thesis_identification || 0;
        const args = data.argument_identification || 0;
        const conc = data.concession_opposition || 0;
        return (thesis + args + conc) / 3;
      },
      target: 7.0,
      max: 10,
      importance: 'high'
    },
    {
      id: 'writing_score',
      name: '✍️ Score d\'expression écrite',
      description: 'Votre capacité à structurer une dissertation et à utiliser un langage précis et correct.',
      improvement: 'Écrivez une dissertation par semaine et demandez à un professeur de la corriger.',
      calculate: (data) => {
        const structure = data.essay_structure || 0;
        const accuracy = data.language_accuracy || 0;
        return (structure + accuracy) / 2;
      },
      target: 7.0,
      max: 10,
      importance: 'high'
    },
    {
      id: 'practice_score',
      name: '⚡ Score de pratique',
      description: 'Mesure votre assiduité à résoudre des examens BAC. C\'est l\'un des facteurs les plus importants pour reconnaître les patterns de l\'examen.',
      improvement: 'Résolvez un examen BAC complet chaque semaine. Commencez par les sujets des années précédentes.',
      calculate: (data) => {
        // ✅ FIXED: Use 'exams_practiced' instead of 'bac_exams_practiced'
        const exams = data.exams_practiced || 0;
        return Math.min((exams / 25) * 10, 10);
      },
      target: 7.0,
      max: 10,
      importance: 'medium'
    },
    {
      id: 'skill_balance',
      name: '⚖️ Équilibre des compétences',
      description: 'Mesure l\'écart entre vos différentes compétences. Plus le score est bas, plus vos compétences sont équilibrées.',
      improvement: 'Vos compétences sont bien équilibrées. Continuez à travailler toutes les compétences.',
      calculate: (data) => {
        const comp = (data.comprehension_textuelle || 0 + data.inference || 0 + data.true_false_justification || 0 + data.communicative_intent || 0) / 4;
        const arg = (data.thesis_identification || 0 + data.argument_identification || 0 + data.concession_opposition || 0) / 3;
        const writing = (data.essay_structure || 0 + data.language_accuracy || 0) / 2;
        const skills = [comp, arg, writing];
        const avg = skills.reduce((a, b) => a + b, 0) / skills.length;
        const variance = skills.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / skills.length;
        return Math.sqrt(variance) / 10;
      },
      target: 0.5,
      max: 1,
      importance: 'medium',
      isSpecial: true
    }
  ],
  
  // ============================================
  // EXAM STRUCTURE
  // ============================================
  examStructure: {
    title: '📖 Examen du Baccalauréat - Français',
    streams: [
      {
        name: '🔬 Filières Scientifiques (Sciences, Maths, Techniques, Gestion)',
        color: '#3498db',
        exercises: [
          { name: 'Compréhension de l\'écrit', content: 'Comprendre le texte, inférences, Vrai/Faux, intention de l\'auteur', points: '12-14 points (60-70%)' },
          { name: 'Production écrite', content: 'Compte rendu critique, essai argumentatif, appel', points: '6-8 points (30-40%)' }
        ]
      },
      {
        name: '📖 Filières Littéraires (Lettres, Philosophie, Langues)',
        color: '#9b59b6',
        exercises: [
          { name: 'Compréhension de l\'écrit', content: 'Analyse approfondie, compte rendu critique', points: '12 points (60%)' },
          { name: 'Production écrite', content: 'Essai critique, synthèse, argumentation', points: '8 points (40%)' }
        ]
      }
    ]
  },
  
  // ============================================
  // SKILLS
  // ============================================
  skills: {
    comprehension_textuelle: {
      name: 'Compréhension du texte',
      target: 7.5,
      importance: 'high',
      weight: '60-70%'
    },
    inference: {
      name: 'Inférence (lire entre les lignes)',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    true_false_justification: {
      name: 'Vrai/Faux + justification',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    communicative_intent: {
      name: 'Intention de l\'auteur',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    thesis_identification: {
      name: 'Identification de la thèse',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    argument_identification: {
      name: 'Identification des arguments',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    concession_opposition: {
      name: 'Concession/opposition',
      target: 6.5,
      importance: 'medium',
      weight: '40-50%'
    },
    essay_structure: {
      name: 'Structure de dissertation',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    language_accuracy: {
      name: 'Précision de la langue',
      target: 7.0,
      importance: 'high',
      weight: '50-60%'
    },
    historical_text: {
      name: 'Texte historique',
      target: 7.0,
      importance: 'medium',
      weight: '40-50%'
    },
    argumentative_text: {
      name: 'Texte argumentatif',
      target: 7.0,
      importance: 'medium',
      weight: '40-50%'
    }
  },
  
  // ============================================
  // HABITS
  // ============================================
  habits: {
    exams_practiced: { name: 'Examens BAC résolus', target: 15, max: 25 },
    essays_per_week: { name: 'Dissertations par semaine', target: 3, max: 5 },
    texts_analyzed_per_week: { name: 'Textes analysés par semaine', target: 5, max: 10 },
    confidence: { name: 'Confiance en soi', target: 4, max: 5 }
  },
  
  // ============================================
  // PSYCHOLOGICAL FACTORS
  // ============================================
  psychological: {
    confidence: { name: 'Confiance en soi', target: 4, max: 5, isNegative: false },
    stress: { name: 'Niveau de stress', target: 3, max: 5, isNegative: true }
  },
  
  // ============================================
  // TIPS
  // ============================================
  tips: [
    '📖 فهم النص هو أهم مهارة - 60-70% من النقاط!',
    '🎯 حل امتحانات البكالوريا السابقة هو أفضل طريقة لتحسين مستواك',
    '✍️ هيكل مقالك دائماً: مقدمة، عرض، خاتمة',
    '📚 حلل المقالات والمناظرات لتحسين حجاجك',
    '💪 الانتظام في العمل أهم من الكثافة',
    '📝 اكتب مقالاً واحداً على الأقل أسبوعياً للتدرب'
  ],
  
  // ============================================
  // IMPORTANCE
  // ============================================
  importance: [
    { skill: 'فهم النص', weight: '60-70%', color: '#e74c3c' },
    { skill: 'الحجاج', weight: '50-60%', color: '#e67e22' },
    { skill: 'الإنتاج الكتابي', weight: '30-40%', color: '#f1c40f' },
    { skill: 'ممارسة الامتحانات', weight: 'تمييز الأنماط', color: '#2ecc71' }
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
export default function French() {
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
    
    // Weighted skills based on importance
    const compWeight = 0.15;
    const inferenceWeight = 0.12;
    const tfWeight = 0.10;
    const intentWeight = 0.10;
    const thesisWeight = 0.12;
    const argsWeight = 0.10;
    const essayWeight = 0.12;
    const langWeight = 0.10;
    const histWeight = 0.05;
    const argTextWeight = 0.04;
    
    const weightedSkills = 
      (data.comprehension_textuelle || 5) * compWeight +
      (data.inference || 5) * inferenceWeight +
      (data.true_false_justification || 5) * tfWeight +
      (data.communicative_intent || 5) * intentWeight +
      (data.thesis_identification || 5) * thesisWeight +
      (data.argument_identification || 5) * argsWeight +
      (data.essay_structure || 5) * essayWeight +
      (data.language_accuracy || 5) * langWeight +
      (data.historical_text || 5) * histWeight +
      (data.argumentative_text || 5) * argTextWeight;
    
    const totalWeight = compWeight + inferenceWeight + tfWeight + intentWeight + 
                        thesisWeight + argsWeight + essayWeight + langWeight + 
                        histWeight + argTextWeight;
    const weightedSkillsScore = weightedSkills / totalWeight;
    
    // Practice score (VERY IMPORTANT for French!)
    const practiceScore = Math.min(10,
      (data.exams_practiced || 5) / 25 * 10 * 0.5 +
      (data.essays_per_week || 2) / 5 * 10 * 0.25 +
      (data.texts_analyzed_per_week || 3) / 10 * 10 * 0.25
    );
    
    // Psychological score
    const psychScore = (
      (data.confidence || 3) / 5 * 10 * 0.6 +
      (10 - (data.stress || 3) / 5 * 10) * 0.4
    );
    
    const rawScore = (
      avgGrade * 0.12 +
      weightedSkillsScore * 0.50 +
      practiceScore * 0.28 +
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
        throw new Error('الرجاء تسجيل الدخول أولاً');
      }

      const response = await fetch(`${API_URL}/api/bacyear/french/predict`, {
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
          const labels = ['📋 الهيكل', '📝 البيانات', '🔮 التوقع', '📊 نقاط الضعف', '📖 المؤشرات', '⚡ المحاكاة', '📋 التقرير'];
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
        <span>⭐ أهم مهارة: فهم النص</span>
        <span style={{ color: '#999', fontSize: '13px' }}>🔄 {Object.keys(subjectData.skills).length} مهارة</span>
      </div>
    </div>
  );
}