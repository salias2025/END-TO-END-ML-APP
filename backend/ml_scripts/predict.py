# backend/ml_scripts/predict.py
import pickle
import json
import sys
import argparse
import numpy as np
import warnings
warnings.filterwarnings('ignore')

def predict(model_path, input_data, subject):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    # ============================================
    # FEATURE NAMES FOR DIFFERENT SUBJECTS
    # ============================================
    
    if subject == 'french':
        # French features (39 features from your notebook)
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade',
            'comprehension_textuelle', 'inference', 'true_false_justification', 'communicative_intent',
            'thesis_identification', 'argument_identification', 'concession_opposition',
            'essay_structure', 'language_accuracy',
            'historical_text', 'argumentative_text',
            'reference_tracking', 'lexical_analysis', 'critical_reasoning', 'coherence_cohesion',
            'bac_exams_practiced', 'confidence', 'essays_per_week', 'texts_analyzed_per_week', 'stress',
            'filiere',
            'comprehension_score', 'argumentation_score', 'writing_score', 'text_type_score', 'practice_intensity',
            'comprehension_score_derived', 'argumentation_score_derived', 'writing_score_derived',
            'text_type_score_derived', 'practice_score', 'psycho_score', 'preparation_score',
            'imbalance_score', 'global_skills_score'
        ]
        
        # Calculate French-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        # Comprehension score
        if 'comprehension_score' not in input_data:
            comp_cols = ['comprehension_textuelle', 'inference', 'true_false_justification', 'communicative_intent']
            input_data['comprehension_score'] = sum(input_data.get(c, 0) for c in comp_cols) / len(comp_cols)
        
        # Argumentation score
        if 'argumentation_score' not in input_data:
            arg_cols = ['thesis_identification', 'argument_identification', 'concession_opposition']
            input_data['argumentation_score'] = sum(input_data.get(c, 0) for c in arg_cols) / len(arg_cols)
        
        # Writing score
        if 'writing_score' not in input_data:
            writing_cols = ['essay_structure', 'language_accuracy']
            input_data['writing_score'] = sum(input_data.get(c, 0) for c in writing_cols) / len(writing_cols)
        
        # Text type score
        if 'text_type_score' not in input_data:
            text_cols = ['historical_text', 'argumentative_text']
            input_data['text_type_score'] = sum(input_data.get(c, 0) for c in text_cols) / len(text_cols)
        
        # Practice score
        if 'practice_score' not in input_data:
            input_data['practice_score'] = (input_data.get('exams_practiced', 0) / 25) * 10
        
        # Practice intensity
        if 'practice_intensity' not in input_data:
            input_data['practice_intensity'] = (
                input_data.get('essays_per_week', 0) * 2 + 
                input_data.get('texts_analyzed_per_week', 0) + 
                input_data.get('exams_practiced', 0) / 3
            ) / 3
        
        # Psycho score
        if 'psycho_score' not in input_data:
            input_data['psycho_score'] = input_data.get('confidence', 3) - input_data.get('stress', 3)
            input_data['psycho_score'] = max(-4, min(4, input_data['psycho_score']))
        
        # Preparation score
        if 'preparation_score' not in input_data:
            practice = input_data['practice_score']
            confidence = (input_data.get('confidence', 3) / 5) * 10
            input_data['preparation_score'] = practice * 0.7 + confidence * 0.3
        
        # Global skills score
        if 'global_skills_score' not in input_data:
            input_data['global_skills_score'] = (
                input_data['comprehension_score'] + 
                input_data['argumentation_score'] + 
                input_data['writing_score']
            ) / 3
        
        # Imbalance score
        if 'imbalance_score' not in input_data:
            skills = [input_data['comprehension_score'], input_data['argumentation_score'], input_data['writing_score']]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Derived features (from your notebook)
        if 'comprehension_score_derived' not in input_data:
            input_data['comprehension_score_derived'] = input_data['comprehension_score']
        if 'argumentation_score_derived' not in input_data:
            input_data['argumentation_score_derived'] = input_data['argumentation_score']
        if 'writing_score_derived' not in input_data:
            input_data['writing_score_derived'] = input_data['writing_score']
        if 'text_type_score_derived' not in input_data:
            input_data['text_type_score_derived'] = input_data['text_type_score']
        
        # Default values for missing features
        defaults = {
            'reference_tracking': 5.0,
            'lexical_analysis': 5.0,
            'critical_reasoning': 5.0,
            'coherence_cohesion': 5.0,
            'filiere': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val
        
        # Stress is already in input_data
        
    elif subject == 'langue_etrangere':
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade',
            'main_idea_detection', 'detail_extraction', 'true_false_accuracy',
            'reference_resolution', 'inference_skill',
            'synonym_antonym', 'word_formation', 'tense_mastery',
            'grammar_transformation', 'sentence_rewriting', 'preposition_mastery',
            'translation_skill',
            'paragraph_structure', 'coherence_cohesion', 'idea_development', 'language_accuracy',
            'texts_read_per_week', 'exercises_done_per_week', 'bac_subjects_practiced',
            'writing_tasks_per_week',
            'confidence', 'stress', 'language',
            'reading_score', 'linguistic_score', 'writing_score',
            'practice_intensity', 'imbalance_score',
            'grammar_mastery', 'vocabulary_score', 'overall_proficiency',
            'psycho_balance', 'study_efficiency'
        ]
        
        # Calculate derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        # Reading Score
        if 'reading_score' not in input_data:
            reading_skills = ['main_idea_detection', 'detail_extraction', 'true_false_accuracy', 'reference_resolution', 'inference_skill']
            input_data['reading_score'] = sum(input_data.get(s, 0) for s in reading_skills) / len(reading_skills)
        
        # Linguistic Score
        if 'linguistic_score' not in input_data:
            linguistic_skills = ['synonym_antonym', 'word_formation', 'tense_mastery', 'grammar_transformation', 'sentence_rewriting', 'preposition_mastery', 'translation_skill']
            input_data['linguistic_score'] = sum(input_data.get(s, 0) for s in linguistic_skills) / len(linguistic_skills)
        
        # Writing Score
        if 'writing_score' not in input_data:
            writing_skills = ['paragraph_structure', 'coherence_cohesion', 'idea_development', 'language_accuracy']
            input_data['writing_score'] = sum(input_data.get(s, 0) for s in writing_skills) / len(writing_skills)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            input_data['practice_intensity'] = (
                input_data.get('writing_tasks_per_week', 0) * 2 + 
                input_data.get('texts_read_per_week', 0) + 
                input_data.get('bac_subjects_practiced', 0) / 2 + 
                input_data.get('exercises_done_per_week', 0) / 2
            ) / 4
        
        # Grammar Mastery
        if 'grammar_mastery' not in input_data:
            grammar_skills = ['tense_mastery', 'grammar_transformation', 'sentence_rewriting', 'preposition_mastery']
            input_data['grammar_mastery'] = sum(input_data.get(s, 0) for s in grammar_skills) / len(grammar_skills)
        
        # Vocabulary Score
        if 'vocabulary_score' not in input_data:
            vocab_skills = ['synonym_antonym', 'word_formation']
            input_data['vocabulary_score'] = sum(input_data.get(s, 0) for s in vocab_skills) / len(vocab_skills)
        
        # Overall Proficiency
        if 'overall_proficiency' not in input_data:
            input_data['overall_proficiency'] = (input_data['reading_score'] + input_data['linguistic_score'] + input_data['writing_score']) / 3
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            skills = [input_data['reading_score'], input_data['linguistic_score'], input_data['writing_score']]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Psycho Balance
        if 'psycho_balance' not in input_data:
            input_data['psycho_balance'] = (input_data.get('confidence', 3) - input_data.get('stress', 3) + 4) / 2
        
        # Study Efficiency
        if 'study_efficiency' not in input_data:
            input_data['study_efficiency'] = input_data.get('texts_read_per_week', 0) / 10
        
        # Default values
        if 'language' not in input_data:
            input_data['language'] = 0
            
    elif subject == 'english':
        # EXACT 43 FEATURES from your notebook
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade',
            'main_idea_detection', 'inference_skill', 'text_structure', 
            'ordering_information', 'skimming_scanning',
            'synonym_accuracy', 'antonym_accuracy', 'transformation_skill',
            'conditional_mastery', 'tense_control', 'vocabulary_richness',
            'essay_structure', 'guided_writing', 'argumentation_skill',
            'coherence_score', 'cohesion_score', 'writing_grammar',
            'reading_frequency', 'writing_frequency', 'past_exam_practice',
            'study_hours', 'consistency', 'study_method', 'class_participation',
            'tutoring', 'confidence', 'stress', 'motivation', 'filiere',
            'reading_score_derived', 'language_score_derived', 'writing_score_derived',
            'imbalance_score_derived', 'practice_intensity_derived',
            'grammar_mastery', 'vocabulary_score', 'overall_proficiency',
            'psycho_balance', 'study_efficiency'
        ]
        
        # Calculate English-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        # Reading Score Derived
        if 'reading_score_derived' not in input_data:
            reading_skills = ['main_idea_detection', 'inference_skill', 'text_structure', 
                              'ordering_information', 'skimming_scanning']
            input_data['reading_score_derived'] = sum(input_data.get(s, 0) for s in reading_skills) / len(reading_skills)
        
        # Language Score Derived
        if 'language_score_derived' not in input_data:
            lang_skills = ['synonym_accuracy', 'antonym_accuracy', 'transformation_skill',
                           'conditional_mastery', 'tense_control', 'vocabulary_richness']
            input_data['language_score_derived'] = sum(input_data.get(s, 0) for s in lang_skills) / len(lang_skills)
        
        # Writing Score Derived
        if 'writing_score_derived' not in input_data:
            writing_skills = ['essay_structure', 'guided_writing', 'argumentation_skill',
                              'coherence_score', 'cohesion_score', 'writing_grammar']
            input_data['writing_score_derived'] = sum(input_data.get(s, 0) for s in writing_skills) / len(writing_skills)
        
        # Practice Intensity Derived
        if 'practice_intensity_derived' not in input_data:
            input_data['practice_intensity_derived'] = (
                input_data.get('writing_frequency', 0) * 2 + 
                input_data.get('reading_frequency', 0) + 
                input_data.get('past_exam_practice', 0) / 3
            ) / 3
        
        # Imbalance Score Derived
        if 'imbalance_score_derived' not in input_data:
            skills = [
                input_data['reading_score_derived'], 
                input_data['language_score_derived'], 
                input_data['writing_score_derived']
            ]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score_derived'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Grammar Mastery
        if 'grammar_mastery' not in input_data:
            grammar_skills = ['conditional_mastery', 'tense_control', 'transformation_skill']
            input_data['grammar_mastery'] = sum(input_data.get(s, 0) for s in grammar_skills) / len(grammar_skills)
        
        # Vocabulary Score
        if 'vocabulary_score' not in input_data:
            vocab_skills = ['synonym_accuracy', 'antonym_accuracy', 'vocabulary_richness']
            input_data['vocabulary_score'] = sum(input_data.get(s, 0) for s in vocab_skills) / len(vocab_skills)
        
        # Overall Proficiency
        if 'overall_proficiency' not in input_data:
            input_data['overall_proficiency'] = (
                input_data['reading_score_derived'] + 
                input_data['language_score_derived'] + 
                input_data['writing_score_derived']
            ) / 3
        
        # Psycho Balance
        if 'psycho_balance' not in input_data:
            input_data['psycho_balance'] = (input_data.get('confidence', 3) - input_data.get('stress', 3) + 4) / 2
        
        # Study Efficiency
        if 'study_efficiency' not in input_data:
            input_data['study_efficiency'] = input_data.get('study_hours', 0) / 12
        
        # Study Method
        if 'study_method' not in input_data:
            input_data['study_method'] = 3
        
        # Default values for missing features
        defaults = {
            'study_method': 3,
            'class_participation': 3,
            'tutoring': 0,
            'filiere': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'tamazight':
        # EXACT 42 FEATURES from your notebook
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
            'main_idea_detection', 'narrative_understanding', 'character_identification',
            'event_ordering', 'implicit_meaning', 'verb_identification',
            'subject_object_analysis', 'sentence_decomposition', 'shifter_identification',
            'morphology_root_pattern', 'narrative_writing', 'descriptive_writing',
            'coherence_score', 'paragraph_structure', 'vocabulary_accuracy',
            'synonym_knowledge', 'antonym_knowledge', 'cultural_heritage',
            'oral_tradition_awareness',
            'writing_frequency', 'reading_frequency', 'text_analysis_practice',
            'exam_preparation', 'study_hours', 'consistency',
            'confidence', 'motivation', 'stress', 'teacher_support',
            'class_participation', 'tutoring',
            'language_core_score', 'writing_score', 'analysis_score',
            'imbalance_score', 'practice_intensity', 'stream_encoded'
        ]
        
        # Calculate Tamazight-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        if 'grade_trend' not in input_data:
            input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
        
        # Language Core Score (grammar skills)
        if 'language_core_score' not in input_data:
            grammar_skills = ['verb_identification', 'subject_object_analysis', 'sentence_decomposition', 'shifter_identification']
            input_data['language_core_score'] = sum(input_data.get(s, 0) for s in grammar_skills) / len(grammar_skills)
        
        # Writing Score
        if 'writing_score' not in input_data:
            writing_skills = ['narrative_writing', 'descriptive_writing', 'coherence_score', 'paragraph_structure', 'vocabulary_accuracy']
            input_data['writing_score'] = sum(input_data.get(s, 0) for s in writing_skills) / len(writing_skills)
        
        # Analysis Score (reading comprehension)
        if 'analysis_score' not in input_data:
            reading_skills = ['main_idea_detection', 'narrative_understanding', 'character_identification', 'event_ordering', 'implicit_meaning']
            input_data['analysis_score'] = sum(input_data.get(s, 0) for s in reading_skills) / len(reading_skills)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            input_data['practice_intensity'] = (
                input_data.get('writing_frequency', 0) * 2 + 
                input_data.get('reading_frequency', 0) + 
                input_data.get('text_analysis_practice', 0) + 
                input_data.get('exam_preparation', 0) / 3
            ) / 3
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            skills = [
                input_data['language_core_score'], 
                input_data['analysis_score'], 
                input_data['writing_score']
            ]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Default values for missing features
        defaults = {
            'teacher_support': 3,
            'class_participation': 3,
            'tutoring': 0,
            'stream_encoded': 0,
            'motivation': 3,
            'reading_frequency': 0,
            'writing_frequency': 0,
            'text_analysis_practice': 0,
            'exam_preparation': 0,
            'shifter_identification': 5,
            'synonym_knowledge': 5,
            'antonym_knowledge': 5
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'maths':
        # ============================================
        # MAP FRONTEND FIELD NAMES TO BACKEND EXPECTATIONS
        # ============================================
        # Frontend sends: exams_practiced → Backend expects: past_exams_solved
        # Frontend sends: essays_per_week → Backend expects: exercises_per_week
        # Frontend sends: study_hours → Backend expects: study_hours (already matches)
        
        # ✅ Map the fields
        if 'past_exams_solved' not in input_data:
            input_data['past_exams_solved'] = input_data.get('exams_practiced', 0)
        if 'exercises_per_week' not in input_data:
            input_data['exercises_per_week'] = input_data.get('essays_per_week', 0) * 2
        if 'timed_exams_per_week' not in input_data:
            input_data['timed_exams_per_week'] = input_data.get('timed_exams_per_week', 1)
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
            'functions_analysis', 'algebra_skill', 'probability_skill', 
            'sequences_skill', 'complex_numbers', 'geometry_skill',
            'integral_calculus', 'proof_reasoning', 'multi_step_solving',
            'algebraic_manipulation', 'graph_interpretation',
            'exam_time_management', 'past_exams_solved', 'exercises_per_week',
            'timed_exams_per_week', 'correction_quality',
            'math_anxiety', 'confidence', 'exam_stress', 'focus_concentration',
            'motivation', 'resilience', 'study_hours', 'consistency',
            'revision_strategy', 'teacher_quality', 'tutoring', 'class_participation',
            'analysis_block', 'algebra_block', 'probability_block',
            'complex_block', 'geometry_block',
            'imbalance_score', 'practice_intensity', 'psychological_composite',
            'analysis_composite', 'algebra_composite', 'prob_seq_composite',
            'imbalance_score_v2', 'practice_intensity_v2', 'psychological_health',
            'study_quality', 'stream_encoded'
        ]
        
        # Calculate Maths-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        if 'grade_trend' not in input_data:
            input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
        
        # Analysis Block (functions + graph interpretation)
        if 'analysis_block' not in input_data:
            input_data['analysis_block'] = (input_data.get('functions_analysis', 0) + input_data.get('graph_interpretation', 0)) / 2
        
        # Algebra Block
        if 'algebra_block' not in input_data:
            input_data['algebra_block'] = (input_data.get('algebra_skill', 0) + input_data.get('complex_numbers', 0)) / 2
        
        # Probability & Sequences Block
        if 'prob_seq_composite' not in input_data:
            input_data['prob_seq_composite'] = (input_data.get('probability_skill', 0) + input_data.get('sequences_skill', 0)) / 2
        
        # Geometry Block
        if 'geometry_block' not in input_data:
            input_data['geometry_block'] = input_data.get('geometry_skill', 0)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            input_data['practice_intensity'] = (
                input_data.get('past_exams_solved', 0) / 30 * 10 * 0.4 +
                input_data.get('exercises_per_week', 0) / 20 * 10 * 0.3 +
                input_data.get('timed_exams_per_week', 0) / 5 * 10 * 0.3
            )
        
        # Psychological Health
        if 'psychological_health' not in input_data:
            confidence = input_data.get('confidence', 5)
            focus = input_data.get('focus_concentration', 5)
            no_anxiety = 10 - input_data.get('math_anxiety', 5)
            no_stress = 10 - input_data.get('exam_stress', 5)
            input_data['psychological_health'] = (confidence + focus + no_anxiety + no_stress) / 4
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            skills = [
                input_data.get('functions_analysis', 0),
                input_data.get('algebra_skill', 0),
                input_data.get('probability_skill', 0),
                input_data.get('sequences_skill', 0)
            ]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Default values for missing features
        defaults = {
            'algebraic_manipulation': 5,
            'correction_quality': 5,
            'motivation': 5,
            'resilience': 5,
            'revision_strategy': 5,
            'teacher_quality': 5,
            'tutoring': 0,
            'class_participation': 3,
            'analysis_composite': 5,
            'algebra_composite': 5,
            'complex_block': 5,
            'imbalance_score_v2': 0,
            'practice_intensity_v2': 0,
            'study_quality': 5,
            'stream_encoded': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val
    
    elif subject == 'physics':
        # ✅ Map frontend field names
        # Frontend sends: exams_practiced → Backend expects: bac_exams_practiced
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'tp_practice' not in input_data:
            input_data['tp_practice'] = input_data.get('tp_practice', 0)
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        
        feature_names = [
            'phys_grade_t1', 'phys_grade_t2', 'phys_grade_t3', 'phys_avg_grade', 'phys_trend',
            'mechanics', 'electricity', 'chemistry_general', 'chemistry_esterification',
            'chemistry_acid_base', 'nuclear', 'waves_oscillations',
            'problem_solving', 'graph_interpretation',
            'bac_exams_practiced', 'tp_practice',
            'physics_anxiety', 'formula_mastery',
            'mechanics_block', 'electricity_block', 'chemistry_block',
            'nuclear_block', 'waves_block',
            'imbalance_score', 'practice_intensity', 'psychological_composite',
            'problem_solving_composite', 'psychological_health',
            'study_quality', 'stream_encoded'
        ]
        
        # Calculate Physics-derived features
        if 'phys_avg_grade' not in input_data or input_data['phys_avg_grade'] == 0:
            input_data['phys_avg_grade'] = (input_data.get('phys_grade_t1', 0) + input_data.get('phys_grade_t2', 0) + input_data.get('phys_grade_t3', 0)) / 3
        
        if 'phys_trend' not in input_data:
            input_data['phys_trend'] = input_data.get('phys_grade_t3', 0) - input_data.get('phys_grade_t1', 0)
        
        # Mechanics Block
        if 'mechanics_block' not in input_data:
            input_data['mechanics_block'] = input_data.get('mechanics', 0)
        
        # Electricity Block
        if 'electricity_block' not in input_data:
            input_data['electricity_block'] = input_data.get('electricity', 0)
        
        # Chemistry Block
        if 'chemistry_block' not in input_data:
            chem_skills = ['chemistry_general', 'chemistry_esterification', 'chemistry_acid_base']
            input_data['chemistry_block'] = sum(input_data.get(s, 0) for s in chem_skills) / len(chem_skills)
        
        # Nuclear Block
        if 'nuclear_block' not in input_data:
            input_data['nuclear_block'] = input_data.get('nuclear', 0)
        
        # Waves Block
        if 'waves_block' not in input_data:
            input_data['waves_block'] = input_data.get('waves_oscillations', 0)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            exams = input_data.get('bac_exams_practiced', 0)
            tp = input_data.get('tp_practice', 0)
            input_data['practice_intensity'] = (exams / 30 * 10 * 0.8 + tp / 5 * 10 * 0.2)
        
        # Problem Solving Composite
        if 'problem_solving_composite' not in input_data:
            input_data['problem_solving_composite'] = (input_data.get('problem_solving', 0) + input_data.get('graph_interpretation', 0)) / 2
        
        # Psychological Health
        if 'psychological_health' not in input_data:
            no_anxiety = 10 - input_data.get('physics_anxiety', 5)
            formula = input_data.get('formula_mastery', 5)
            input_data['psychological_health'] = (no_anxiety * 0.6 + formula * 0.4)
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            skills = [
                input_data.get('mechanics', 0),
                input_data.get('electricity', 0),
                input_data.get('chemistry_general', 0),
                input_data.get('nuclear', 0),
                input_data.get('waves_oscillations', 0)
            ]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Default values
        defaults = {
            'psychological_composite': 5,
            'study_quality': 5,
            'stream_encoded': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val
     
    elif subject == 'science':
        # Map frontend field names
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'document_exercises' not in input_data:
            input_data['document_exercises'] = input_data.get('document_exercises', 0)
        
        feature_names = [
            'svt_grade_t1', 'svt_grade_t2', 'svt_grade_t3', 'svt_avg_grade', 'svt_trend',
            'molecular_biology', 'protein_enzymes', 'immunology',
            'energy_photosynthesis', 'energy_respiration', 'neuroscience', 'geology',
            'document_analysis', 'hypothesis_formulation', 'scientific_writing', 'reasoning_chain',
            'bac_exams_practiced', 'document_exercises',
            'svt_anxiety', 'document_confidence', 'scientific_writing_confidence',
            'scientific_skills_composite', 'practice_intensity', 'psychological_health',
            'imbalance_score', 'molecular_block', 'protein_block', 'immune_block',
            'energy_block', 'neuro_block', 'geology_block', 'study_quality',
            'bio_geo_balance', 'document_mastery', 'reasoning_quality',
            'svt_overall_score', 'stream_encoded'
        ]
        
        # Calculate SVT-derived features
        if 'svt_avg_grade' not in input_data or input_data['svt_avg_grade'] == 0:
            input_data['svt_avg_grade'] = (input_data.get('svt_grade_t1', 0) + input_data.get('svt_grade_t2', 0) + input_data.get('svt_grade_t3', 0)) / 3
        
        if 'svt_trend' not in input_data:
            input_data['svt_trend'] = input_data.get('svt_grade_t3', 0) - input_data.get('svt_grade_t1', 0)
        
        # Scientific Skills Composite
        if 'scientific_skills_composite' not in input_data:
            skills = ['document_analysis', 'hypothesis_formulation', 'scientific_writing', 'reasoning_chain']
            input_data['scientific_skills_composite'] = sum(input_data.get(s, 0) for s in skills) / len(skills)
        
        # Document Mastery
        if 'document_mastery' not in input_data:
            input_data['document_mastery'] = (input_data.get('document_analysis', 0) + input_data.get('document_confidence', 0)) / 2
        
        # Reasoning Quality
        if 'reasoning_quality' not in input_data:
            input_data['reasoning_quality'] = (input_data.get('reasoning_chain', 0) + input_data.get('hypothesis_formulation', 0)) / 2
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            exams = input_data.get('bac_exams_practiced', 0)
            docs = input_data.get('document_exercises', 0)
            input_data['practice_intensity'] = (exams / 30 * 10 * 0.6 + docs / 15 * 10 * 0.4)
        
        # Psychological Health
        if 'psychological_health' not in input_data:
            doc_conf = input_data.get('document_confidence', 5)
            writing_conf = input_data.get('scientific_writing_confidence', 5)
            no_anxiety = 10 - input_data.get('svt_anxiety', 5)
            input_data['psychological_health'] = (doc_conf + writing_conf + no_anxiety) / 3
        
        # SVT Overall Score
        if 'svt_overall_score' not in input_data:
            blocks = [
                input_data.get('molecular_biology', 0),
                input_data.get('protein_enzymes', 0),
                input_data.get('immunology', 0)
            ]
            input_data['svt_overall_score'] = sum(blocks) / len(blocks)
        
        # Molecular Block
        if 'molecular_block' not in input_data:
            input_data['molecular_block'] = input_data.get('molecular_biology', 0)
        
        # Protein Block
        if 'protein_block' not in input_data:
            input_data['protein_block'] = input_data.get('protein_enzymes', 0)
        
        # Immune Block
        if 'immune_block' not in input_data:
            input_data['immune_block'] = input_data.get('immunology', 0)
        
        # Default values
        defaults = {
            'energy_block': 5,
            'neuro_block': 5,
            'geology_block': 5,
            'bio_geo_balance': 0,
            'study_quality': 5,
            'stream_encoded': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'techno':
        # Map frontend field names
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'specialty_exercises_week' not in input_data:
            input_data['specialty_exercises_week'] = input_data.get('specialty_exercises_week', 0)
        if 'full_simulations' not in input_data:
            input_data['full_simulations'] = input_data.get('full_simulations', 0)
        
        feature_names = [
            'tech_grade_t1', 'tech_grade_t2', 'tech_grade_t3', 'tech_avg_grade', 'tech_trend',
            'mechanics_rdm', 'material_resistance', 'gear_transmission',
            'automation_grafcet', 'logic_circuits', 'electrical_systems',
            'structural_analysis', 'reinforced_concrete', 'road_construction',
            'organic_chemistry', 'polymer_chemistry', 'thermodynamics',
            'problem_solving', 'diagram_interpretation', 'calculation_accuracy', 'technical_drawing',
            'bac_exams_practiced', 'specialty_exercises_week', 'full_simulations', 'correction_quality',
            'tech_anxiety', 'confidence', 'exam_stress', 'focus_concentration',
            'study_hours', 'consistency', 'teacher_quality', 'lab_access', 'tutoring',
            'mechanics_block', 'automation_block', 'chemistry_block', 'civil_block',
            'imbalance_score', 'practice_intensity', 'psychological_composite',
            'problem_solving_composite', 'psychological_health',
            'study_quality', 'exam_prep_score', 'overall_skill_score', 'specialty_encoded'
        ]
        
        # Calculate Techno-derived features
        if 'tech_avg_grade' not in input_data or input_data['tech_avg_grade'] == 0:
            input_data['tech_avg_grade'] = (input_data.get('tech_grade_t1', 0) + input_data.get('tech_grade_t2', 0) + input_data.get('tech_grade_t3', 0)) / 3
        
        if 'tech_trend' not in input_data:
            input_data['tech_trend'] = input_data.get('tech_grade_t3', 0) - input_data.get('tech_grade_t1', 0)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            exams = input_data.get('bac_exams_practiced', 0)
            exercises = input_data.get('specialty_exercises_week', 0)
            simulations = input_data.get('full_simulations', 0)
            input_data['practice_intensity'] = (exams / 30 * 10 * 0.4 + exercises / 15 * 10 * 0.3 + simulations / 5 * 10 * 0.3)
        
        # Problem Solving Composite
        if 'problem_solving_composite' not in input_data:
            input_data['problem_solving_composite'] = (input_data.get('problem_solving', 0) + input_data.get('diagram_interpretation', 0)) / 2
        
        # Psychological Health
        if 'psychological_health' not in input_data:
            confidence = input_data.get('confidence', 5)
            focus = input_data.get('focus_concentration', 5)
            no_anxiety = 10 - input_data.get('tech_anxiety', 5)
            no_stress = 10 - input_data.get('exam_stress', 5)
            input_data['psychological_health'] = (confidence + focus + no_anxiety + no_stress) / 4
        
        # Study Quality
        if 'study_quality' not in input_data:
            consistency = input_data.get('consistency', 5)
            study_hours = input_data.get('study_hours', 5) / 12 * 10
            correction = input_data.get('correction_quality', 5)
            input_data['study_quality'] = consistency * 0.5 + study_hours * 0.3 + correction * 0.2
        
        # Exam Prep Score
        if 'exam_prep_score' not in input_data:
            input_data['exam_prep_score'] = input_data.get('bac_exams_practiced', 0) / 30 * 10
        
        # Default values
        defaults = {
            'mechanics_block': 5,
            'automation_block': 5,
            'chemistry_block': 5,
            'civil_block': 5,
            'imbalance_score': 0,
            'psychological_composite': 5,
            'overall_skill_score': 5,
            'specialty_encoded': 0,
            'teacher_quality': 5,
            'lab_access': 5,
            'tutoring': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'gestion':
        # ============================================
        # MAP FRONTEND FIELD NAMES TO BACKEND EXPECTATIONS
        # ============================================
        # Frontend sends: exams_practiced → Backend expects: bac_practiced
        # Frontend sends: essays_per_week → Backend expects: weekly_exercises
        
        # ✅ Print incoming data for debugging (will show in logs)
        import sys
        print(f"📊 GESTION - Incoming data: {input_data}", file=sys.stderr)
        
        # ✅ Map the fields
        if 'bac_practiced' not in input_data:
            input_data['bac_practiced'] = input_data.get('exams_practiced', 0)
            print(f"📊 Mapped exams_practiced={input_data['exams_practiced']} → bac_practiced={input_data['bac_practiced']}", file=sys.stderr)
        
        if 'weekly_exercises' not in input_data:
            input_data['weekly_exercises'] = input_data.get('essays_per_week', 0)
            print(f"📊 Mapped essays_per_week={input_data['essays_per_week']} → weekly_exercises={input_data['weekly_exercises']}", file=sys.stderr)
        
        if 'mock_exams' not in input_data:
            input_data['mock_exams'] = input_data.get('mock_exams', 0)
        
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        
        if 'consistency' not in input_data:
            input_data['consistency'] = input_data.get('consistency', 5)
        
        if 'stress' not in input_data:
            input_data['stress'] = input_data.get('stress', 5)
        
        if 'confidence' not in input_data:
            input_data['confidence'] = input_data.get('confidence', 5)
        
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
            'calculation_accuracy', 'financial_logic', 'table_handling',
            'cost_block', 'financial_block', 'loan_block', 'execution_speed',
            'bac_practiced', 'weekly_exercises', 'mock_exams',
            'study_hours', 'consistency', 'stress', 'confidence',
            'gestion_imbalance', 'practice_intensity', 'study_quality', 'overall_level'
        ]
        
        # Calculate Gestion-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        if 'grade_trend' not in input_data:
            input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
        
        # Overall Level
        if 'overall_level' not in input_data:
            input_data['overall_level'] = (input_data.get('cost_block', 5) + 
                                           input_data.get('financial_block', 5) + 
                                           input_data.get('loan_block', 5)) / 3
            print(f"📊 overall_level = {input_data['overall_level']}", file=sys.stderr)
        
        # Practice Intensity - using mapped field names
        if 'practice_intensity' not in input_data:
            exercises = input_data.get('weekly_exercises', 0)
            bac = input_data.get('bac_practiced', 0)
            mock = input_data.get('mock_exams', 0)
            
            print(f"📊 Practice Intensity inputs: exercises={exercises}, bac={bac}, mock={mock}", file=sys.stderr)
            
            input_data['practice_intensity'] = (exercises / 20 * 10 * 0.5 + 
                                                bac / 30 * 10 * 0.3 + 
                                                mock / 15 * 10 * 0.2)
            
            print(f"📊 practice_intensity = {input_data['practice_intensity']}", file=sys.stderr)
        
        # Study Quality
        if 'study_quality' not in input_data:
            consistency = input_data.get('consistency', 5)
            study_hours = input_data.get('study_hours', 5) / 12 * 10
            input_data['study_quality'] = consistency * 0.6 + study_hours * 0.4
            print(f"📊 study_quality = {input_data['study_quality']}", file=sys.stderr)
        
        # Gestion Imbalance
        if 'gestion_imbalance' not in input_data:
            blocks = [
                input_data.get('cost_block', 5),
                input_data.get('financial_block', 5),
                input_data.get('loan_block', 5)
            ]
            avg = sum(blocks) / len(blocks)
            input_data['gestion_imbalance'] = sum((b - avg) ** 2 for b in blocks) / len(blocks)
            print(f"📊 gestion_imbalance = {input_data['gestion_imbalance']}", file=sys.stderr)
        
        # Default values
        defaults = {
            'execution_speed': 5,
            'mock_exams': 0,
            'tutoring': 0
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'economie':
        # Map frontend field names
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'situation_exercises' not in input_data:
            input_data['situation_exercises'] = input_data.get('situation_exercises', 0)
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        if 'consistency' not in input_data:
            input_data['consistency'] = input_data.get('consistency', 5)
        
        feature_names = [
            'eco_grade_t1', 'eco_grade_t2', 'eco_grade_t3', 'eco_avg_grade', 'eco_trend',
            'market_mechanisms', 'money_banking', 'unemployment', 'inflation',
            'international_trade', 'financing',
            'communication', 'control', 'leadership_motivation',
            'situation_analysis', 'graph_interpretation', 'calculation_accuracy', 'structured_answer',
            'bac_exams_practiced', 'situation_exercises',
            'study_hours', 'consistency',
            'eco_anxiety', 'analysis_confidence', 'exam_stress',
            'economics_composite', 'management_composite', 'economic_skills_composite',
            'practice_intensity', 'psychological_composite',
            'study_quality', 'imbalance_score',
            'market_focus', 'situation_strength'
        ]
        
        # Calculate Economie-derived features
        if 'eco_avg_grade' not in input_data or input_data['eco_avg_grade'] == 0:
            input_data['eco_avg_grade'] = (input_data.get('eco_grade_t1', 0) + input_data.get('eco_grade_t2', 0) + input_data.get('eco_grade_t3', 0)) / 3
        
        if 'eco_trend' not in input_data:
            input_data['eco_trend'] = input_data.get('eco_grade_t3', 0) - input_data.get('eco_grade_t1', 0)
        
        # Economics Composite
        if 'economics_composite' not in input_data:
            eco_skills = ['market_mechanisms', 'money_banking', 'unemployment', 'inflation', 'international_trade', 'financing']
            input_data['economics_composite'] = sum(input_data.get(s, 0) for s in eco_skills) / len(eco_skills)
        
        # Management Composite
        if 'management_composite' not in input_data:
            mgmt_skills = ['communication', 'control', 'leadership_motivation']
            input_data['management_composite'] = sum(input_data.get(s, 0) for s in mgmt_skills) / len(mgmt_skills)
        
        # Economic Skills Composite (Applied Skills - MOST IMPORTANT)
        if 'economic_skills_composite' not in input_data:
            applied_skills = ['situation_analysis', 'graph_interpretation', 'calculation_accuracy', 'structured_answer']
            input_data['economic_skills_composite'] = sum(input_data.get(s, 0) for s in applied_skills) / len(applied_skills)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            exams = input_data.get('bac_exams_practiced', 0)
            exercises = input_data.get('situation_exercises', 0)
            input_data['practice_intensity'] = (exams / 30 * 10 * 0.5 + exercises / 15 * 10 * 0.5)
        
        # Study Quality
        if 'study_quality' not in input_data:
            consistency = input_data.get('consistency', 5)
            study_hours = input_data.get('study_hours', 5) / 12 * 10
            input_data['study_quality'] = consistency * 0.6 + study_hours * 0.4
        
        # Psychological Composite
        if 'psychological_composite' not in input_data:
            confidence = input_data.get('analysis_confidence', 5)
            no_anxiety = 10 - input_data.get('eco_anxiety', 5)
            no_stress = 10 - input_data.get('exam_stress', 5)
            input_data['psychological_composite'] = (confidence + no_anxiety + no_stress) / 3
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            eco = input_data['economics_composite']
            mgmt = input_data['management_composite']
            applied = input_data['economic_skills_composite']
            skills = [eco, mgmt, applied]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Market Focus
        if 'market_focus' not in input_data:
            market = input_data.get('market_mechanisms', 5)
            eco = input_data['economics_composite']
            input_data['market_focus'] = market / (eco + 0.1)
        
        # Situation Strength
        if 'situation_strength' not in input_data:
            situation = input_data.get('situation_analysis', 5)
            applied = input_data['economic_skills_composite']
            input_data['situation_strength'] = situation / (applied + 0.1)
        
        # Default values
        defaults = {
            'eco_anxiety': 5,
            'analysis_confidence': 5,
            'exam_stress': 5
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'droit':
        # Map frontend field names
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'case_exercises' not in input_data:
            input_data['case_exercises'] = input_data.get('case_exercises', 0)
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        if 'consistency' not in input_data:
            input_data['consistency'] = input_data.get('consistency', 5)
        
        feature_names = [
            'droit_grade_t1', 'droit_grade_t2', 'droit_grade_t3', 'droit_avg_grade', 'droit_trend',
            'company_law', 'labor_law_individual', 'labor_law_collective', 'public_finance',
            'legal_reasoning', 'qualification', 'justification', 'definition_recall',
            'case_exercises', 'bac_exams_practiced',
            'law_anxiety', 'reasoning_confidence', 'exam_stress',
            'study_hours', 'consistency',
            'legal_skills_composite', 'labor_law_composite', 'practice_intensity',
            'psychological_composite', 'study_quality', 'imbalance_score',
            'overall_law_score', 'reasoning_focus'
        ]
        
        # Calculate Droit-derived features
        if 'droit_avg_grade' not in input_data or input_data['droit_avg_grade'] == 0:
            input_data['droit_avg_grade'] = (input_data.get('droit_grade_t1', 0) + input_data.get('droit_grade_t2', 0) + input_data.get('droit_grade_t3', 0)) / 3
        
        if 'droit_trend' not in input_data:
            input_data['droit_trend'] = input_data.get('droit_grade_t3', 0) - input_data.get('droit_grade_t1', 0)
        
        # Legal Skills Composite (MOST IMPORTANT)
        if 'legal_skills_composite' not in input_data:
            legal_skills = ['legal_reasoning', 'qualification', 'justification', 'definition_recall']
            input_data['legal_skills_composite'] = sum(input_data.get(s, 0) for s in legal_skills) / len(legal_skills)
        
        # Labor Law Composite
        if 'labor_law_composite' not in input_data:
            labor_skills = ['labor_law_individual', 'labor_law_collective']
            input_data['labor_law_composite'] = sum(input_data.get(s, 0) for s in labor_skills) / len(labor_skills)
        
        # Practice Intensity
        if 'practice_intensity' not in input_data:
            cases = input_data.get('case_exercises', 0)
            exams = input_data.get('bac_exams_practiced', 0)
            input_data['practice_intensity'] = (cases / 15 * 10 * 0.6 + exams / 30 * 10 * 0.4)
        
        # Study Quality
        if 'study_quality' not in input_data:
            consistency = input_data.get('consistency', 5)
            study_hours = input_data.get('study_hours', 5) / 12 * 10
            input_data['study_quality'] = consistency * 0.6 + study_hours * 0.4
        
        # Psychological Composite
        if 'psychological_composite' not in input_data:
            confidence = input_data.get('reasoning_confidence', 5)
            no_anxiety = 10 - input_data.get('law_anxiety', 5)
            no_stress = 10 - input_data.get('exam_stress', 5)
            input_data['psychological_composite'] = (confidence + no_anxiety + no_stress) / 3
        
        # Overall Law Score
        if 'overall_law_score' not in input_data:
            law_blocks = ['company_law', 'labor_law_individual', 'labor_law_collective', 'public_finance']
            input_data['overall_law_score'] = sum(input_data.get(s, 0) for s in law_blocks) / len(law_blocks)
        
        # Imbalance Score
        if 'imbalance_score' not in input_data:
            skills = [
                input_data.get('company_law', 0),
                input_data.get('labor_law_individual', 0),
                input_data.get('labor_law_collective', 0),
                input_data.get('public_finance', 0)
            ]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        
        # Reasoning Focus
        if 'reasoning_focus' not in input_data:
            reasoning = input_data.get('legal_reasoning', 5)
            legal_skills = input_data['legal_skills_composite']
            input_data['reasoning_focus'] = reasoning / (legal_skills + 0.1)
        
        # Default values
        defaults = {
            'law_anxiety': 5,
            'reasoning_confidence': 5,
            'exam_stress': 5,
            'public_finance': 5
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val

    elif subject == 'his_geo':
        # Map frontend field names
        if 'bac_exams_practiced' not in input_data:
            input_data['bac_exams_practiced'] = input_data.get('exams_practiced', 0)
        if 'memorization_frequency' not in input_data:
            input_data['memorization_frequency'] = input_data.get('memorization_frequency', 5)
        if 'study_hours' not in input_data:
            input_data['study_hours'] = input_data.get('study_hours', 5)
        if 'consistency' not in input_data:
            input_data['consistency'] = input_data.get('consistency', 5)
        
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
            'historical_memory', 'dates_memory', 'figures_memory', 'geography_knowledge',
            'document_analysis_method', 'essay_method', 'map_stats_method', 'argumentation_skill',
            'cold_war_knowledge', 'decolonization_knowledge', 'algeria_history_knowledge',
            'economic_powers_knowledge', 'development_knowledge',
            'history_part_structure', 'geography_part_structure',
            'bac_exams_practiced', 'memorization_frequency',
            'study_hours', 'consistency',
            'stress_level', 'confidence_level', 'interest_in_subject',
            'memory_composite', 'methodology_composite', 'knowledge_composite',
            'study_quality', 'hg_imbalance'
        ]
        
        # Calculate His_Geo-derived features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        
        if 'grade_trend' not in input_data:
            input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
        
        # Memory Composite
        if 'memory_composite' not in input_data:
            memory_skills = ['historical_memory', 'dates_memory', 'figures_memory', 'geography_knowledge']
            input_data['memory_composite'] = sum(input_data.get(s, 0) for s in memory_skills) / len(memory_skills)
        
        # Methodology Composite (MOST IMPORTANT)
        if 'methodology_composite' not in input_data:
            method_skills = ['document_analysis_method', 'essay_method', 'map_stats_method', 'argumentation_skill']
            input_data['methodology_composite'] = sum(input_data.get(s, 0) for s in method_skills) / len(method_skills)
        
        # Knowledge Composite
        if 'knowledge_composite' not in input_data:
            knowledge_skills = ['cold_war_knowledge', 'decolonization_knowledge', 'algeria_history_knowledge',
                               'economic_powers_knowledge', 'development_knowledge']
            input_data['knowledge_composite'] = sum(input_data.get(s, 0) for s in knowledge_skills) / len(knowledge_skills)
        
        # Study Quality
        if 'study_quality' not in input_data:
            memorization = input_data.get('memorization_frequency', 5)
            consistency = input_data.get('consistency', 5)
            input_data['study_quality'] = memorization * 0.6 + consistency * 0.4
        
        # HG Imbalance (Memory vs Methodology balance)
        if 'hg_imbalance' not in input_data:
            memory = input_data['memory_composite']
            methodology = input_data['methodology_composite']
            input_data['hg_imbalance'] = abs(memory - methodology)
        
        # Default values
        defaults = {
            'history_part_structure': 5,
            'geography_part_structure': 5,
            'stress_level': 5,
            'confidence_level': 5,
            'interest_in_subject': 5
        }
        for key, val in defaults.items():
            if key not in input_data:
                input_data[key] = val
    
    elif subject == 'islamia':
    # Map frontend field names
     if 'past_exams' not in input_data:
        input_data['past_exams'] = input_data.get('exams_practiced', 0)
     if 'quran_exercises' not in input_data:
        input_data['quran_exercises'] = input_data.get('quran_exercises', 0)
     if 'hadith_exercises' not in input_data:
        input_data['hadith_exercises'] = input_data.get('hadith_exercises', 0)
     if 'fiqh_cases' not in input_data:
        input_data['fiqh_cases'] = input_data.get('fiqh_cases', 0)
     if 'study_hours' not in input_data:
        input_data['study_hours'] = input_data.get('study_hours', 5)
     if 'consistency' not in input_data:
        input_data['consistency'] = input_data.get('consistency', 5)
    
     feature_names = [
        'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
        'quran_recitation', 'tafsir_understanding', 'reasoning_from_verses',
        'hadith_comprehension', 'hadith_analysis', 'moral_extraction',
        'fiqh_ibadah', 'fiqh_muamalat', 'riba_understanding',
        'aqida_understanding', 'proofs_awareness',
        'ayah_analysis', 'hadith_text_analysis', 'document_analysis',
        'definition_accuracy', 'explanation_clarity', 'evidence_usage', 'structured_answer',
        'quran_exercises', 'hadith_exercises', 'fiqh_cases', 'past_exams',
        'stress_level', 'confidence',
        'quran_composite', 'hadith_composite', 'fiqh_composite',
        'analysis_composite', 'methodology_composite',
        'practice_intensity', 'overall_islamia'
    ]
    
    # Calculate Islamia-derived features
     if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
        input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
    
     if 'grade_trend' not in input_data:
        input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
    
    # Quran Composite
     if 'quran_composite' not in input_data:
        quran_skills = ['quran_recitation', 'tafsir_understanding', 'reasoning_from_verses']
        input_data['quran_composite'] = sum(input_data.get(s, 0) for s in quran_skills) / len(quran_skills)
    
    # Hadith Composite
     if 'hadith_composite' not in input_data:
        hadith_skills = ['hadith_comprehension', 'hadith_analysis', 'moral_extraction']
        input_data['hadith_composite'] = sum(input_data.get(s, 0) for s in hadith_skills) / len(hadith_skills)
    
    # Fiqh Composite
     if 'fiqh_composite' not in input_data:
        fiqh_skills = ['fiqh_ibadah', 'fiqh_muamalat', 'riba_understanding']
        input_data['fiqh_composite'] = sum(input_data.get(s, 0) for s in fiqh_skills) / len(fiqh_skills)
    
    # Analysis Composite (MOST IMPORTANT)
     if 'analysis_composite' not in input_data:
        analysis_skills = ['ayah_analysis', 'hadith_text_analysis', 'document_analysis']
        input_data['analysis_composite'] = sum(input_data.get(s, 0) for s in analysis_skills) / len(analysis_skills)
    
    # Methodology Composite
     if 'methodology_composite' not in input_data:
        method_skills = ['definition_accuracy', 'explanation_clarity', 'evidence_usage', 'structured_answer']
        input_data['methodology_composite'] = sum(input_data.get(s, 0) for s in method_skills) / len(method_skills)
    
    # Practice Intensity (LOW impact)
     if 'practice_intensity' not in input_data:
        quran_ex = input_data.get('quran_exercises', 0)
        hadith_ex = input_data.get('hadith_exercises', 0)
        fiqh_cases = input_data.get('fiqh_cases', 0)
        past_exams = input_data.get('past_exams', 0)
        input_data['practice_intensity'] = (quran_ex + hadith_ex + fiqh_cases + past_exams) / 40 * 10
    
    # Overall Islamia Score
     if 'overall_islamia' not in input_data:
        input_data['overall_islamia'] = (
            input_data['analysis_composite'] + 
            input_data['methodology_composite'] + 
            input_data['quran_composite'] + 
            input_data['hadith_composite'] + 
            input_data['fiqh_composite']
        ) / 5
    
    # Default values
     defaults = {
        'aqida_understanding': 5,
        'proofs_awareness': 5,
        'stress_level': 5,
        'confidence': 5
    }
     for key, val in defaults.items():
        if key not in input_data:
            input_data[key] = val
    
    elif subject == 'philo':
    # Map frontend field names
     if 'past_exams' not in input_data:
        input_data['past_exams'] = input_data.get('exams_practiced', 0)
     if 'essays_written_week' not in input_data:
        input_data['essays_written_week'] = input_data.get('essays_per_week', 0)
     if 'texts_analyzed_week' not in input_data:
        input_data['texts_analyzed_week'] = input_data.get('texts_analyzed', 0)
     if 'study_hours' not in input_data:
        input_data['study_hours'] = input_data.get('study_hours', 5)
     if 'consistency' not in input_data:
        input_data['consistency'] = input_data.get('consistency', 5)
     if 'study_method' not in input_data:
        input_data['study_method'] = input_data.get('study_method', 3)
    
    # ============================================
    # EXACT 38 FEATURES from the model
    # ============================================
     feature_names = [
        # Grade features (5)
        'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade', 'grade_trend',
        # Method skills (7)
        'dialectical_method', 'argumentative_method', 'comparative_method',
        'text_analysis_method', 'conceptual_understanding', 'logical_reasoning', 'critical_thinking',
        # Writing skills (4)
        'essay_structure', 'argument_strength', 'clarity_expression', 'use_of_examples',
        # Chapter knowledge (6)
        'problem_chapter', 'doctrines_chapter', 'science_philosophy_chapter',
        'logic_chapter', 'ethics_chapter', 'society_politics_chapter',
        # Habits (6)
        'essays_written_week', 'texts_analyzed_week', 'past_exams',
        'study_hours', 'consistency', 'study_method',
        # Psychological (3)
        'stress_level', 'confidence', 'interest',
        # Derived features (7)
        'methodology_composite', 'thinking_composite', 'writing_composite',
        'practice_intensity', 'study_quality', 'philo_imbalance', 'overall_philo'
     ]
    
    # ============================================
    # CALCULATE DERIVED FEATURES
    # ============================================
    
    # Average grade
     if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
        input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
    
    # Grade trend
     if 'grade_trend' not in input_data:
        input_data['grade_trend'] = input_data.get('grade_t3', 0) - input_data.get('grade_t1', 0)
    
    # Methodology Composite
     if 'methodology_composite' not in input_data:
        method_skills = ['dialectical_method', 'argumentative_method', 'comparative_method', 'text_analysis_method']
        input_data['methodology_composite'] = sum(input_data.get(s, 0) for s in method_skills) / len(method_skills)
    
    # Thinking Composite
     if 'thinking_composite' not in input_data:
        thinking_skills = ['conceptual_understanding', 'logical_reasoning', 'critical_thinking']
        input_data['thinking_composite'] = sum(input_data.get(s, 0) for s in thinking_skills) / len(thinking_skills)
    
    # Writing Composite
     if 'writing_composite' not in input_data:
        writing_skills = ['essay_structure', 'argument_strength', 'clarity_expression', 'use_of_examples']
        input_data['writing_composite'] = sum(input_data.get(s, 0) for s in writing_skills) / len(writing_skills)
    
    # Practice Intensity
     if 'practice_intensity' not in input_data:
        essays = input_data.get('essays_written_week', 0)
        texts = input_data.get('texts_analyzed_week', 0)
        exams = input_data.get('past_exams', 0)
        input_data['practice_intensity'] = (essays / 10 * 10 * 0.4 + texts / 15 * 10 * 0.3 + exams / 10 * 10 * 0.3)
    
    # Study Quality
     if 'study_quality' not in input_data:
        consistency = input_data.get('consistency', 5)
        study_hours = input_data.get('study_hours', 5) / 12 * 10
        study_method = input_data.get('study_method', 3) / 5 * 10
        input_data['study_quality'] = consistency * 0.4 + study_hours * 0.3 + study_method * 0.3
    
    # Philo Imbalance
     if 'philo_imbalance' not in input_data:
        skills = [
            input_data['methodology_composite'],
            input_data['thinking_composite'],
            input_data['writing_composite']
        ]
        avg = sum(skills) / len(skills)
        input_data['philo_imbalance'] = sum((s - avg) ** 2 for s in skills) / len(skills)
    
    # Overall Philo Score
     if 'overall_philo' not in input_data:
        input_data['overall_philo'] = (
            input_data['methodology_composite'] + 
            input_data['thinking_composite'] + 
            input_data['writing_composite']
        ) / 3
    
    # Default values for missing features
     defaults = {
        'dialectical_method': 5,
        'argumentative_method': 5,
        'comparative_method': 5,
        'text_analysis_method': 5,
        'conceptual_understanding': 5,
        'logical_reasoning': 5,
        'critical_thinking': 5,
        'essay_structure': 5,
        'argument_strength': 5,
        'clarity_expression': 5,
        'use_of_examples': 5,
        'problem_chapter': 5,
        'doctrines_chapter': 5,
        'science_philosophy_chapter': 5,
        'logic_chapter': 5,
        'ethics_chapter': 5,
        'society_politics_chapter': 5,
        'study_method': 3,
        'stress_level': 5,
        'confidence': 5,
        'interest': 5
    }
     for key, val in defaults.items():
        if key not in input_data:
            input_data[key] = val
   
    else:
        # Arabic features (original)
        feature_names = [
            'grade_t1', 'grade_t2', 'grade_t3', 'avg_grade',
            'grammar', 'essay', 'poetry', 'prose', 'rhetoric', 'comprehension',
            'essays_per_week', 'exams_practiced', 'study_hours',
            'consistency', 'tutoring', 'participation',
            'confidence', 'stress', 'interest', 'filiere',
            'language_core_score', 'writing_score', 'analysis_score',
            'imbalance_score', 'practice_intensity'
        ]
        
        # Calculate missing features
        if 'avg_grade' not in input_data or input_data['avg_grade'] == 0:
            input_data['avg_grade'] = (input_data.get('grade_t1', 0) + input_data.get('grade_t2', 0) + input_data.get('grade_t3', 0)) / 3
        if 'language_core_score' not in input_data or input_data['language_core_score'] == 0:
            input_data['language_core_score'] = (input_data.get('grammar', 0) + input_data.get('comprehension', 0)) / 2
        if 'writing_score' not in input_data or input_data['writing_score'] == 0:
            input_data['writing_score'] = input_data.get('essay', 0)
        if 'analysis_score' not in input_data or input_data['analysis_score'] == 0:
            input_data['analysis_score'] = (input_data.get('poetry', 0) + input_data.get('prose', 0)) / 2
        if 'practice_intensity' not in input_data or input_data['practice_intensity'] == 0:
            input_data['practice_intensity'] = (input_data.get('essays_per_week', 0) * 2 + input_data.get('exams_practiced', 0) / 3) / 2
        if 'imbalance_score' not in input_data or input_data['imbalance_score'] == 0:
            skills = [input_data.get('grammar', 0), input_data.get('essay', 0), input_data.get('poetry', 0), 
                      input_data.get('prose', 0), input_data.get('rhetoric', 0), input_data.get('comprehension', 0)]
            avg = sum(skills) / len(skills)
            input_data['imbalance_score'] = sum((s - avg) ** 2 for s in skills) / len(skills)
        if 'filiere' not in input_data:
            input_data['filiere'] = 0
    
    # Build feature vector
    features = [input_data.get(name, 0) for name in feature_names]
    
    # Make prediction
    prediction = model.predict([features])[0]
    
    # ✅ FIXED: Handle both single-output and multi-output models
    if isinstance(prediction, (int, float)):
        # Single-output regression model - calculate probability from score
        score = float(prediction)
        
        # Map score 0-20 → success probability 0-100%
        success_prob = min(100, max(0, (score / 20) * 100))
        
        # Calculate improvement potential (how much room to improve)
        improvement = min(6, max(0, (20 - score) * 0.4))
        
        return {
            'predicted_score': round(score, 2),
            'success_probability': round(success_prob, 1),
            'improvement_potential': round(improvement, 1)
        }
    else:
        # Multi-output model (Arabic style) - use model's outputs
        return {
            'predicted_score': float(prediction[0]),
            'success_probability': float(prediction[1] * 100) if prediction[1] <= 1 else float(prediction[1]),
            'improvement_potential': float(prediction[2]) if len(prediction) > 2 else 2.0
        }

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--subject', required=True)
    parser.add_argument('--model', required=True)
    parser.add_argument('--input', required=True)
    args = parser.parse_args()
    
    input_data = json.loads(args.input)
    result = predict(args.model, input_data, args.subject)
    
    # ONLY JSON output - nothing else
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()