// src/components/bac_year/simulation.jsx
import React, { useState, useEffect } from 'react';

// ============================================
// SUBJECT COEFFICIENTS DATA STRUCTURE
// ============================================
const subjectCoefficients = {
  arabic: {
    id: 'arabic',
    name: 'اللغة العربية',
    skillImpact: {
      poetry: 0.065,
      rhetoric: 0.060,
      grammar: 0.064,
      prose: 0.061,
      comprehension: 0.058,
      essay: 0.058
    },
    habitImpact: {
      exams_practiced: 0.0387,
      consistency: 0.067,
      confidence: 0.035,
      study_hours: 0.005,
      essays_per_week: 0.007
    },
    habitMax: {
      exams_practiced: 20,
      consistency: 5,
      confidence: 5,
      study_hours: 12,
      essays_per_week: 5
    }
  },
  french: {
    id: 'french',
    name: 'اللغة الفرنسية',
    skillImpact: {
      comprehension_textuelle: 0.065,
      inference: 0.060,
      true_false_justification: 0.055,
      communicative_intent: 0.058,
      thesis_identification: 0.062,
      argument_identification: 0.060,
      concession_opposition: 0.055,
      essay_structure: 0.058,
      language_accuracy: 0.060,
      historical_text: 0.050,
      argumentative_text: 0.052
    },
    habitImpact: {
      exams_practiced: 0.035,
      consistency: 0.060,
      confidence: 0.030,
      study_hours: 0.005,
      essays_per_week: 0.008,
      texts_analyzed_per_week: 0.025
    },
    habitMax: {
      exams_practiced: 25,
      consistency: 5,
      confidence: 5,
      study_hours: 12,
      essays_per_week: 5,
      texts_analyzed_per_week: 10
    }
  },
  english: {
    id: 'english',
    name: 'English',
    skillImpact: {
      main_idea_detection: 0.062,
      inference_skill: 0.058,
      text_structure: 0.055,
      ordering_information: 0.050,
      skimming_scanning: 0.048,
      synonym_accuracy: 0.055,
      antonym_accuracy: 0.052,
      transformation_skill: 0.060,
      conditional_mastery: 0.058,
      tense_control: 0.065,
      vocabulary_richness: 0.060,
      essay_structure: 0.062,
      guided_writing: 0.055,
      argumentation_skill: 0.058,
      coherence_score: 0.060,
      cohesion_score: 0.055,
      writing_grammar: 0.058
    },
    habitImpact: {
      reading_frequency: 0.035,
      writing_frequency: 0.040,
      past_exam_practice: 0.030,
      study_hours: 0.005,
      consistency: 0.060,
      confidence: 0.030
    },
    habitMax: {
      reading_frequency: 10,
      writing_frequency: 5,
      past_exam_practice: 20,
      study_hours: 12,
      consistency: 5,
      confidence: 5
    }
  },
  tamazight: {
    id: 'tamazight',
    name: 'اللغة الأمازيغية',
    skillImpact: {
      main_idea_detection: 0.058,
      narrative_understanding: 0.055,
      character_identification: 0.048,
      event_ordering: 0.045,
      implicit_meaning: 0.050,
      verb_identification: 0.065,
      subject_object_analysis: 0.060,
      sentence_decomposition: 0.055,
      shifter_identification: 0.050,
      morphology_root_pattern: 0.062,
      narrative_writing: 0.058,
      descriptive_writing: 0.055,
      coherence_score: 0.052,
      paragraph_structure: 0.050,
      vocabulary_accuracy: 0.055,
      synonym_knowledge: 0.048,
      antonym_knowledge: 0.045,
      cultural_heritage: 0.040,
      oral_tradition_awareness: 0.038
    },
    habitImpact: {
      writing_frequency: 0.035,
      reading_frequency: 0.030,
      text_analysis_practice: 0.025,
      exam_preparation: 0.028,
      study_hours: 0.005,
      consistency: 0.055,
      confidence: 0.028
    },
    habitMax: {
      writing_frequency: 5,
      reading_frequency: 5,
      text_analysis_practice: 5,
      exam_preparation: 20,
      study_hours: 12,
      consistency: 5,
      confidence: 5
    }
  },
  langue_etrangere: {
    id: 'langue_etrangere',
    name: 'Foreign Languages',
    skillImpact: {
      main_idea_detection: 0.060,
      detail_extraction: 0.055,
      true_false_accuracy: 0.050,
      reference_resolution: 0.052,
      inference_skill: 0.058,
      synonym_antonym: 0.055,
      word_formation: 0.050,
      tense_mastery: 0.062,
      grammar_transformation: 0.060,
      sentence_rewriting: 0.055,
      preposition_mastery: 0.048,
      translation_skill: 0.052,
      paragraph_structure: 0.058,
      coherence_cohesion: 0.055,
      idea_development: 0.052,
      language_accuracy: 0.055
    },
    habitImpact: {
      texts_read_per_week: 0.030,
      exercises_done_per_week: 0.025,
      bac_subjects_practiced: 0.032,
      writing_tasks_per_week: 0.035,
      confidence: 0.025,
      stress: 0.020
    },
    habitMax: {
      texts_read_per_week: 10,
      exercises_done_per_week: 20,
      bac_subjects_practiced: 20,
      writing_tasks_per_week: 5,
      confidence: 5,
      stress: 5
    }
  },
  maths: {
    id: 'maths',
    name: 'الرياضيات',
    skillImpact: {
        functions_analysis: 0.070,
        algebra_skill: 0.060,
        probability_skill: 0.055,
        sequences_skill: 0.055,
        integral_calculus: 0.050,
        complex_numbers: 0.045,
        geometry_skill: 0.040,
        proof_reasoning: 0.060,
        multi_step_solving: 0.065,
        graph_interpretation: 0.055,
        exam_time_management: 0.050
    },
    habitImpact: {
        past_exams_solved: 0.035,
        exercises_per_week: 0.030,
        timed_exams_per_week: 0.040,
        study_hours: 0.005,
        consistency: 0.060,
        confidence: 0.035
    },
    habitMax: {
        past_exams_solved: 30,
        exercises_per_week: 20,
        timed_exams_per_week: 5,
        study_hours: 15,
        consistency: 5,
        confidence: 5
    }
},
physics: {
    id: 'physics',
    name: 'العلوم الفيزيائية',
    skillImpact: {
        mechanics: 0.075,
        electricity: 0.070,
        chemistry_general: 0.055,
        chemistry_esterification: 0.050,
        chemistry_acid_base: 0.050,
        nuclear: 0.040,
        waves_oscillations: 0.030,
        problem_solving: 0.060,
        graph_interpretation: 0.055,
        formula_mastery: 0.050
    },
    habitImpact: {
        bac_exams_practiced: 0.035,
        tp_practice: 0.010,
        study_hours: 0.005,
        consistency: 0.055,
        confidence: 0.030
    },
    habitMax: {
        bac_exams_practiced: 30,
        tp_practice: 5,
        study_hours: 12,
        consistency: 5,
        confidence: 5
    }
},science: {
    id: 'science',
    name: 'علوم الطبيعة والحياة',
    skillImpact: {
        molecular_biology: 0.060,
        protein_enzymes: 0.058,
        immunology: 0.062,
        energy_photosynthesis: 0.050,
        energy_respiration: 0.050,
        neuroscience: 0.045,
        geology: 0.040,
        document_analysis: 0.070,
        hypothesis_formulation: 0.060,
        scientific_writing: 0.055,
        reasoning_chain: 0.065
    },
    habitImpact: {
        bac_exams_practiced: 0.038,
        document_exercises: 0.045,
        study_hours: 0.005,
        consistency: 0.055,
        confidence: 0.030
    },
    habitMax: {
        bac_exams_practiced: 30,
        document_exercises: 15,
        study_hours: 12,
        consistency: 5,
        confidence: 5
    }
},
techno: {
    id: 'techno',
    name: 'التكنولوجيا (هندسة)',
    skillImpact: {
        mechanics_rdm: 0.070,
        material_resistance: 0.060,
        gear_transmission: 0.055,
        automation_grafcet: 0.070,
        logic_circuits: 0.060,
        electrical_systems: 0.055,
        structural_analysis: 0.065,
        reinforced_concrete: 0.060,
        road_construction: 0.050,
        organic_chemistry: 0.065,
        polymer_chemistry: 0.060,
        thermodynamics: 0.050,
        problem_solving: 0.070,
        diagram_interpretation: 0.065,
        calculation_accuracy: 0.060,
        technical_drawing: 0.055
    },
    habitImpact: {
        bac_exams_practiced: 0.038,
        specialty_exercises_week: 0.025,
        full_simulations: 0.045,
        study_hours: 0.012,
        consistency: 0.035,
        confidence: 0.040,
        correction_quality: 0.030
    },
    habitMax: {
        bac_exams_practiced: 30,
        specialty_exercises_week: 15,
        full_simulations: 5,
        study_hours: 12,
        consistency: 5,
        confidence: 5,
        correction_quality: 10
    }
},gestion: {
    id: 'gestion',
    name: 'التسيير المحاسبي والمالي',
    skillImpact: {
        calculation_accuracy: 0.080,    // MOST IMPORTANT!
        financial_logic: 0.060,
        table_handling: 0.055,
        execution_speed: 0.050,
        cost_block: 0.065,
        financial_block: 0.070,
        loan_block: 0.060
    },
    habitImpact: {
        weekly_exercises: 0.040,        // +0.20 per 5 exercises
        bac_practiced: 0.035,           // +0.35 per 10 exams
        mock_exams: 0.030,
        study_hours: 0.015,
        consistency: 0.025
    },
    habitMax: {
        weekly_exercises: 20,
        bac_practiced: 30,
        mock_exams: 15,
        study_hours: 12,
        consistency: 10
    }
},economie: {
    id: 'economie',
    name: 'الاقتصاد والمناجمنت',
    skillImpact: {
        market_mechanisms: 0.060,
        money_banking: 0.050,
        unemployment: 0.050,
        inflation: 0.050,
        international_trade: 0.045,
        financing: 0.050,
        communication: 0.040,
        control: 0.040,
        leadership_motivation: 0.035,
        situation_analysis: 0.075,    // MOST IMPORTANT!
        graph_interpretation: 0.065,
        calculation_accuracy: 0.060,
        structured_answer: 0.055
    },
    habitImpact: {
        bac_exams_practiced: 0.035,
        situation_exercises: 0.040,
        study_hours: 0.012,
        consistency: 0.015
    },
    habitMax: {
        bac_exams_practiced: 30,
        situation_exercises: 15,
        study_hours: 12,
        consistency: 10
    }
},
droit: {
    id: 'droit',
    name: 'القانون',
    skillImpact: {
        company_law: 0.060,
        labor_law_individual: 0.060,
        labor_law_collective: 0.055,
        public_finance: 0.050,
        legal_reasoning: 0.075,    // MOST IMPORTANT!
        qualification: 0.065,
        justification: 0.060,
        definition_recall: 0.055
    },
    habitImpact: {
        case_exercises: 0.040,
        bac_exams_practiced: 0.035,
        study_hours: 0.012,
        consistency: 0.015
    },
    habitMax: {
        case_exercises: 15,
        bac_exams_practiced: 30,
        study_hours: 12,
        consistency: 10
    }
},
his_geo: {
    id: 'his_geo',
    name: 'التاريخ والجغرافيا',
    skillImpact: {
        historical_memory: 0.055,
        dates_memory: 0.050,
        figures_memory: 0.045,
        geography_knowledge: 0.050,
        document_analysis_method: 0.070,    // MOST IMPORTANT!
        essay_method: 0.070,                // MOST IMPORTANT!
        map_stats_method: 0.065,
        argumentation_skill: 0.065,
        cold_war_knowledge: 0.050,
        decolonization_knowledge: 0.050,
        algeria_history_knowledge: 0.055,
        economic_powers_knowledge: 0.045,
        development_knowledge: 0.045
    },
    habitImpact: {
        bac_exams_practiced: 0.020,         // LOW impact
        memorization_frequency: 0.050,      // HIGH impact
        study_hours: 0.030,
        consistency: 0.040
    },
    habitMax: {
        bac_exams_practiced: 15,
        memorization_frequency: 10,
        study_hours: 10,
        consistency: 10
    }
},
islamia: {
    id: 'islamia',
    name: 'العلوم الإسلامية',
    skillImpact: {
        quran_recitation: 0.045,
        tafsir_understanding: 0.050,
        reasoning_from_verses: 0.050,
        hadith_comprehension: 0.050,
        hadith_analysis: 0.055,
        moral_extraction: 0.045,
        fiqh_ibadah: 0.050,
        fiqh_muamalat: 0.055,
        riba_understanding: 0.045,
        aqida_understanding: 0.040,
        proofs_awareness: 0.040,
        ayah_analysis: 0.065,           // MOST IMPORTANT!
        hadith_text_analysis: 0.065,    // MOST IMPORTANT!
        document_analysis: 0.065,       // MOST IMPORTANT!
        definition_accuracy: 0.055,
        explanation_clarity: 0.055,
        evidence_usage: 0.055,
        structured_answer: 0.060
    },
    habitImpact: {
        quran_exercises: 0.010,
        hadith_exercises: 0.010,
        fiqh_cases: 0.010,
        past_exams: 0.020
    },
    habitMax: {
        quran_exercises: 10,
        hadith_exercises: 10,
        fiqh_cases: 10,
        past_exams: 10
    }
},

philo: {
    id: 'philo',
    name: 'الفلسفة',
    skillImpact: {
        text_analysis: 0.070,
        argument_identification: 0.065,
        concept_comprehension: 0.060,
        comparison_skill: 0.055,
        synthesis_skill: 0.060,
        essay_structure: 0.065,
        clarity_expression: 0.060,
        critical_thinking: 0.065,
        philosophical_reasoning: 0.065,
        problematization: 0.060,
        thesis_defense: 0.055,
        example_usage: 0.050,
        conceptual_analysis: 0.060,
        logic_consistency: 0.055,
        nuance_handling: 0.050,
        conclusion_skill: 0.055
    },
    habitImpact: {
        essays_written: 0.035,
        texts_analyzed: 0.030,
        past_exams: 0.025,
        study_hours: 0.020,
        consistency: 0.030
    },
    habitMax: {
        essays_written: 10,
        texts_analyzed: 15,
        past_exams: 10,
        study_hours: 12,
        consistency: 10
    }
}


};

// ============================================
// HELPER: Get coefficients for a subject
// ============================================
const getSubjectCoefficients = (subjectId) => {
  // Default fallback coefficients
  const defaultCoeffs = {
    skillImpact: {},
    habitImpact: {
      exams_practiced: 0.035,
      consistency: 0.050,
      confidence: 0.030,
      study_hours: 0.005,
      essays_per_week: 0.007
    },
    habitMax: {
      exams_practiced: 20,
      consistency: 5,
      confidence: 5,
      study_hours: 12,
      essays_per_week: 5
    }
  };

  if (subjectCoefficients[subjectId]) {
    return subjectCoefficients[subjectId];
  }

  // Build generic skill impact from subjectData.skills
  return defaultCoeffs;
};

// ============================================
// COMPONENT
// ============================================
export default function Simulation({ formData, prediction, subjectData, onNext, onBack }) {
  const [simSkills, setSimSkills] = useState({});
  const [simHabits, setSimHabits] = useState({});

  // ✅ Get coefficients for this subject
  const coeffs = getSubjectCoefficients(subjectData?.id);

  useEffect(() => {
    // Initialize skills
    const initialSkills = {};
    Object.keys(subjectData.skills || {}).forEach(key => {
      initialSkills[key] = formData?.[key] || 6;
    });
    setSimSkills(initialSkills);

    // Initialize habits
    const habitKeys = Object.keys(coeffs.habitMax || {});
    const initialHabits = {};
    habitKeys.forEach(key => {
      initialHabits[key] = formData?.[key] || 0;
    });
    setSimHabits(initialHabits);
  }, [formData, subjectData]);

  if (!formData || !prediction) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        <p>⚠️ يرجى إدخال بياناتك أولاً</p>
      </div>
    );
  }

  const currentScore = prediction?.score || 12;

  // ============================================
  // ✅ CALCULATE SIMULATION SCORE using coefficients
  // ============================================
  const calculateSimScore = () => {
    let skillGain = 0;
    
    // Calculate skill improvements using subject-specific impacts
    Object.keys(subjectData.skills || {}).forEach(skill => {
      if (simSkills[skill] !== undefined && formData[skill] !== undefined) {
        const diff = simSkills[skill] - formData[skill];
        const impact = coeffs.skillImpact?.[skill] || 0.05;
        skillGain += diff * impact * 10;
      }
    });

    let habitGain = 0;
    
    // Calculate habit improvements using subject-specific impacts
    Object.keys(coeffs.habitImpact || {}).forEach(habit => {
      if (simHabits[habit] !== undefined && formData[habit] !== undefined) {
        const diff = simHabits[habit] - formData[habit];
        const impact = coeffs.habitImpact?.[habit] || 0.02;
        const maxVal = coeffs.habitMax?.[habit] || 10;
        const normalizedDiff = diff / maxVal;
        habitGain += normalizedDiff * impact * 10;
      }
    });

    const totalGain = skillGain + habitGain;
    const newScore = Math.min(20, Math.max(0, currentScore + totalGain));
    
    return {
      score: newScore,
      gain: totalGain
    };
  };

  const result = calculateSimScore();
  const simScore = result.score;
  const simGain = result.gain;

  const simColor = simScore >= 16 ? '#2ecc71' : simScore >= 14 ? '#27ae60' : simScore >= 12 ? '#f39c12' : simScore >= 10 ? '#e67e22' : '#e74c3c';
  const simEmoji = simScore >= 16 ? '🏆' : simScore >= 14 ? '🎉' : simScore >= 12 ? '👍' : simScore >= 10 ? '📈' : '⚠️';

  const skillNames = Object.fromEntries(
    Object.entries(subjectData.skills || {}).map(([key, skill]) => [key, skill.name])
  );

  // ============================================
  // HABIT NAMES & MAX VALUES
  // ============================================
  const habitNames = {
    exams_practiced: '📚 امتحانات محلولة',
    consistency: '📅 الانتظام',
    confidence: '💪 الثقة',
    study_hours: '⏰ ساعات الدراسة',
    essays_per_week: '✍️ مقالات أسبوعياً',
    texts_analyzed_per_week: '📖 نصوص محللة أسبوعياً',
    reading_frequency: '📖 قراءة أسبوعياً',
    writing_frequency: '✍️ كتابة أسبوعياً',
    past_exam_practice: '📚 امتحانات سابقة',
    text_analysis_practice: '🔍 تحليل نصوص',
    exam_preparation: '📝 تحضير امتحانات',
    texts_read_per_week: '📖 نصوص مقروءة',
    exercises_done_per_week: '📝 تمارين محلولة',
    bac_subjects_practiced: '📚 امتحانات BAC محلولة',
    writing_tasks_per_week: '✍️ مهام كتابية',
    stress: '😰 التوتر'
  };

  const resetSimulation = () => {
    const resetSkills = {};
    Object.keys(subjectData.skills || {}).forEach(key => {
      resetSkills[key] = formData[key] || 6;
    });
    setSimSkills(resetSkills);
    
    const habitKeys = Object.keys(coeffs.habitMax || {});
    const resetHabits = {};
    habitKeys.forEach(key => {
      resetHabits[key] = formData?.[key] || 0;
    });
    setSimHabits(resetHabits);
  };

  const handleSkillChange = (skill, value) => {
    setSimSkills(prev => ({ ...prev, [skill]: parseFloat(value) }));
  };

  const handleHabitChange = (habit, value) => {
    setSimHabits(prev => ({ ...prev, [habit]: parseFloat(value) }));
  };

  const getMax = (field) => {
    return coeffs.habitMax?.[field] || 10;
  };

  // Get display habit keys (only those with names)
  const displayHabits = Object.keys(coeffs.habitImpact || {}).filter(h => habitNames[h]);

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '950px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>⚡ محاكاة تحسين الأداء</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          {subjectData.icon} {subjectData.name}
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '12px' }}>
          جرّب تحسين مهاراتك وعاداتك الدراسية وشاهد كيف تتغير نتيجتك
        </p>
      </div>

      {/* Important Note */}
      <div style={{
        background: '#f0f8ff',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        borderRight: '4px solid #3498db'
      }}>
        <p style={{ fontSize: '15px', lineHeight: '1.8', margin: 0 }}>
          <strong>📌 ملاحظة مهمة:</strong><br />
          • <strong>المهارات الأساسية</strong> لها التأثير الأكبر على نقطتك.<br />
          • <strong>العادات الدراسية</strong> لها تأثير أقل ولكنها مهمة.<br />
          • استخدم المؤشرات أدناه لترى كيف تتغير نقطتك.
        </p>
      </div>

      {/* Skills and Habits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <div>
          <div style={{
            background: '#2c3e50',
            color: 'white',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>📚 المهارات الأساسية</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>(تأثير كبير)</p>
          </div>

          {Object.keys(skillNames).slice(0, 7).map(skill => (
            <div key={skill} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <label style={{ fontSize: '13px', color: '#333' }}>{skillNames[skill]}:</label>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                  {simSkills[skill] !== undefined ? simSkills[skill].toFixed(1) : '6.0'}/10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={simSkills[skill] !== undefined ? simSkills[skill] : 6}
                onChange={(e) => handleSkillChange(skill, e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #9b59b644, #9b59b6)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#999',
                marginTop: '2px'
              }}>
                <span>حالياً: {formData[skill]?.toFixed(1) || '6.0'}</span>
                <span>الهدف: {subjectData.skills?.[skill]?.target || 7}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{
            background: '#e67e22',
            color: 'white',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>⏰ العادات الدراسية</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.7 }}>(تأثير متوسط)</p>
          </div>

          {displayHabits.map(habit => (
            <div key={habit} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <label style={{ fontSize: '13px', color: '#333' }}>{habitNames[habit] || habit}:</label>
                <span style={{ fontWeight: 'bold', color: '#e67e22' }}>
                  {simHabits[habit] !== undefined ? simHabits[habit] : 0}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={getMax(habit)}
                step="1"
                value={simHabits[habit] !== undefined ? simHabits[habit] : 0}
                onChange={(e) => handleHabitChange(habit, e.target.value)}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #e67e2244, #e67e22)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#999',
                marginTop: '2px'
              }}>
                <span>حالياً: {formData[habit] || 0}</span>
                <span>الهدف: {coeffs.habitMax?.[habit] || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Card */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px',
        borderRight: `4px solid ${simColor}`
      }}>
        <h3 style={{ color: '#2c3e50', marginTop: 0, textAlign: 'center' }}>📊 نتيجة المحاكاة</h3>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{ fontSize: '16px', color: '#666' }}>نقطتك المتوقعة بعد التحسين</div>
          <div style={{ fontSize: '64px', fontWeight: 'bold', color: simColor }}>
            {simScore.toFixed(1)}<span style={{ fontSize: '24px' }}>/20</span>
          </div>
          <div style={{ fontSize: '18px', marginTop: '10px' }}>
            {simEmoji} {simGain > 0.5 ? 'تحسن ملحوظ 📈' : simGain > 0.1 ? 'تحسن طفيف' : 'بدون تغيير'} {simEmoji}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            (من {currentScore.toFixed(1)} إلى {simScore.toFixed(1)}) {simGain > 0 ? `+${simGain.toFixed(2)}` : ''}
          </div>
          <div style={{
            marginTop: '15px',
            height: '8px',
            background: '#ecf0f1',
            borderRadius: '4px',
            overflow: 'hidden',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div style={{
              width: `${(simScore / 20) * 100}%`,
              height: '100%',
              background: simColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={resetSimulation}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #f39c12, #e67e22)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(243,156,18,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          🔄 إعادة تعيين
        </button>
        <button
          onClick={onBack}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #3498db, #2980b9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(52,152,219,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← العودة
        </button>
        <button
          onClick={onNext}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontFamily: 'inherit',
            boxShadow: '0 4px 15px rgba(46,204,113,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(46,204,113,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(46,204,113,0.3)';
          }}
        >
          📋 التقرير النهائي →
        </button>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 0 10px rgba(102,126,234,0.3);
          transition: all 0.3s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}