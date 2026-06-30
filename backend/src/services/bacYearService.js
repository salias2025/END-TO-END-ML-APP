// backend/src/services/bacYearService.js

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class BacYearService {
    constructor() {
        this.models = {};
        this.featureNames = {};
        this.scalers = {};
        this.loaded = false;
        this.modelCache = {};
        
        this.subjectConfigs = {
            arabic: {
                displayName: 'اللغة العربية',
                skillColumns: ['grammar', 'essay', 'poetry', 'prose', 'rhetoric', 'comprehension'],
                skillTargets: {
                    poetry: 7.5,
                    rhetoric: 7.0,
                    grammar: 7.0,
                    prose: 6.5,
                    essay: 6.5,
                    comprehension: 6.5
                },
                skillNames: {
                    grammar: 'القواعد النحوية',
                    essay: 'التعبير الكتابي',
                    poetry: 'تحليل الشعر',
                    prose: 'تحليل النثر',
                    rhetoric: 'البلاغة',
                    comprehension: 'الفهم والاستيعاب'
                },
                examStructure: {
                    scientific: [
                        { name: 'البناء الفكري', points: '9 نقاط (45%)' },
                        { name: 'البناء اللغوي', points: '8 نقاط (40%)' },
                        { name: 'التعبير الكتابي', points: '3 نقاط (15%)' }
                    ],
                    literary: [
                        { name: 'البناء الفكري', points: '10 نقاط (50%)' },
                        { name: 'البناء اللغوي', points: '6 نقاط (30%)' },
                        { name: 'البناء النقدي', points: '4 نقاط (20%)' }
                    ]
                }
            },
            french: {
                displayName: 'اللغة الفرنسية',
                skillColumns: [
                    'comprehension_textuelle', 'inference', 'true_false_justification', 
                    'communicative_intent', 'thesis_identification', 'argument_identification',
                    'concession_opposition', 'essay_structure', 'language_accuracy',
                    'historical_text', 'argumentative_text'
                ],
                skillTargets: {
                    comprehension_textuelle: 7.5,
                    inference: 7.0,
                    true_false_justification: 7.0,
                    communicative_intent: 7.0,
                    thesis_identification: 7.0,
                    argument_identification: 7.0,
                    concession_opposition: 6.5,
                    essay_structure: 7.0,
                    language_accuracy: 7.0,
                    historical_text: 7.0,
                    argumentative_text: 7.0
                },
                skillNames: {
                    comprehension_textuelle: 'Compréhension du texte',
                    inference: 'Inférence',
                    true_false_justification: 'Vrai/Faux + justification',
                    communicative_intent: 'Intention de l\'auteur',
                    thesis_identification: 'Identification de la thèse',
                    argument_identification: 'Identification des arguments',
                    concession_opposition: 'Concession et opposition',
                    essay_structure: 'Structure de la dissertation',
                    language_accuracy: 'Précision de la langue',
                    historical_text: 'Texte historique',
                    argumentative_text: 'Texte argumentatif'
                },
                examStructure: {
                    scientific: [
                        { name: 'Compréhension de l\'écrit', points: '12-14 points (60-70%)' },
                        { name: 'Production écrite', points: '6-8 points (30-40%)' }
                    ],
                    literary: [
                        { name: 'Compréhension de l\'écrit', points: '12 points (60%)' },
                        { name: 'Production écrite', points: '8 points (40%)' }
                    ]
                }
            },
            english: {
                displayName: 'English',
                skillColumns: [
                    'main_idea_detection', 'inference_skill', 'text_structure', 
                    'ordering_information', 'skimming_scanning',
                    'synonym_accuracy', 'antonym_accuracy', 'transformation_skill',
                    'conditional_mastery', 'tense_control', 'vocabulary_richness',
                    'essay_structure', 'guided_writing', 'argumentation_skill',
                    'coherence_score', 'cohesion_score', 'writing_grammar'
                ],
                skillTargets: {
                    main_idea_detection: 7.5,
                    inference_skill: 7.0,
                    text_structure: 7.0,
                    ordering_information: 7.0,
                    skimming_scanning: 7.0,
                    synonym_accuracy: 7.0,
                    antonym_accuracy: 7.0,
                    transformation_skill: 7.0,
                    conditional_mastery: 7.0,
                    tense_control: 7.5,
                    vocabulary_richness: 7.5,
                    essay_structure: 7.5,
                    guided_writing: 7.0,
                    argumentation_skill: 7.0,
                    coherence_score: 7.0,
                    cohesion_score: 7.0,
                    writing_grammar: 7.0
                },
                skillNames: {
                    main_idea_detection: 'Main Idea Detection',
                    inference_skill: 'Inference Skill',
                    text_structure: 'Text Structure',
                    ordering_information: 'Ordering Information',
                    skimming_scanning: 'Skimming & Scanning',
                    synonym_accuracy: 'Synonyms',
                    antonym_accuracy: 'Antonyms',
                    transformation_skill: 'Sentence Transformation',
                    conditional_mastery: 'Conditionals',
                    tense_control: 'Tense Control',
                    vocabulary_richness: 'Vocabulary Richness',
                    essay_structure: 'Essay Structure',
                    guided_writing: 'Guided Writing',
                    argumentation_skill: 'Argumentation',
                    coherence_score: 'Coherence',
                    cohesion_score: 'Cohesion',
                    writing_grammar: 'Writing Grammar'
                },
                examStructure: {
                    scientific: [
                        { name: 'Reading Comprehension', points: '7-8 points (35-40%)' },
                        { name: 'Language (Text Exploration)', points: '7-8 points (35-40%)' },
                        { name: 'Written Expression', points: '5-6 points (25-30%)' }
                    ],
                    literary: [
                        { name: 'Reading Comprehension', points: '7-8 points (35-40%)' },
                        { name: 'Language (Text Exploration)', points: '7-8 points (35-40%)' },
                        { name: 'Written Expression', points: '5-6 points (25-30%)' }
                    ]
                }
            },
            tamazight: {
                displayName: 'اللغة الأمازيغية',
                skillColumns: [
                    'main_idea_detection', 'narrative_understanding', 'character_identification',
                    'event_ordering', 'implicit_meaning', 'verb_identification',
                    'subject_object_analysis', 'sentence_decomposition', 'shifter_identification',
                    'morphology_root_pattern', 'narrative_writing', 'descriptive_writing',
                    'coherence_score', 'paragraph_structure', 'vocabulary_accuracy',
                    'synonym_knowledge', 'antonym_knowledge', 'cultural_heritage',
                    'oral_tradition_awareness'
                ],
                skillTargets: {
                    verb_identification: 7.5,
                    subject_object_analysis: 7.0,
                    morphology_root_pattern: 7.0,
                    main_idea_detection: 7.0,
                    narrative_understanding: 7.0,
                    character_identification: 6.5,
                    event_ordering: 6.5,
                    implicit_meaning: 6.5,
                    sentence_decomposition: 6.5,
                    shifter_identification: 6.5,
                    narrative_writing: 6.5,
                    descriptive_writing: 6.5,
                    coherence_score: 6.5,
                    paragraph_structure: 6.5,
                    vocabulary_accuracy: 6.5,
                    synonym_knowledge: 6.5,
                    antonym_knowledge: 6.5,
                    cultural_heritage: 6.0,
                    oral_tradition_awareness: 6.0
                },
                skillNames: {
                    main_idea_detection: 'استخراج الأفكار الرئيسية',
                    narrative_understanding: 'فهم النصوص السردية',
                    character_identification: 'تحديد الشخصيات',
                    event_ordering: 'ترتيب الأحداث',
                    implicit_meaning: 'استنتاج المعاني الضمنية',
                    verb_identification: 'تحديد الأفعال (Amigaw)',
                    subject_object_analysis: 'تحليل الفاعل والمفعول (Asentel)',
                    sentence_decomposition: 'تحليل الجملة',
                    shifter_identification: 'تحديد أدوات الزمان والمكان',
                    morphology_root_pattern: 'الصرف (جذور الكلمات)',
                    narrative_writing: 'الكتابة السردية',
                    descriptive_writing: 'الكتابة الوصفية',
                    coherence_score: 'الترابط والتماسك',
                    paragraph_structure: 'تنظيم الفقرات',
                    vocabulary_accuracy: 'دقة المفردات',
                    synonym_knowledge: 'معرفة المترادفات',
                    antonym_knowledge: 'معرفة المتضادات',
                    cultural_heritage: 'التراث الثقافي الأمازيغي',
                    oral_tradition_awareness: 'الحكايات والتقاليد الشفوية'
                },
                examStructure: {
                    scientific: [
                        { name: 'دراسة النص', points: '12 نقطة (60%)' },
                        { name: 'التعبير الكتابي', points: '8 نقاط (40%)' }
                    ],
                    literary: [
                        { name: 'دراسة النص', points: '12 نقطة (60%)' },
                        { name: 'التعبير الكتابي', points: '8 نقاط (40%)' }
                    ]
                }
            },
            langue_etrangere: {
                displayName: 'Foreign Languages',
                skillColumns: [
                    'main_idea_detection', 'detail_extraction', 'true_false_accuracy',
                    'reference_resolution', 'inference_skill',
                    'synonym_antonym', 'word_formation', 'tense_mastery',
                    'grammar_transformation', 'sentence_rewriting', 'preposition_mastery',
                    'translation_skill',
                    'paragraph_structure', 'coherence_cohesion', 'idea_development', 'language_accuracy'
                ],
                skillTargets: {
                    main_idea_detection: 7.5,
                    detail_extraction: 7.0,
                    true_false_accuracy: 7.0,
                    reference_resolution: 7.0,
                    inference_skill: 7.0,
                    synonym_antonym: 7.0,
                    word_formation: 7.0,
                    tense_mastery: 7.5,
                    grammar_transformation: 7.0,
                    sentence_rewriting: 7.0,
                    preposition_mastery: 7.0,
                    translation_skill: 7.0,
                    paragraph_structure: 7.5,
                    coherence_cohesion: 7.0,
                    idea_development: 7.0,
                    language_accuracy: 7.0
                },
                skillNames: {
                    main_idea_detection: 'Main Idea Detection',
                    detail_extraction: 'Detail Extraction',
                    true_false_accuracy: 'True/False Accuracy',
                    reference_resolution: 'Reference Resolution',
                    inference_skill: 'Inference Skill',
                    synonym_antonym: 'Synonyms & Antonyms',
                    word_formation: 'Word Formation',
                    tense_mastery: 'Tense Mastery',
                    grammar_transformation: 'Grammar Transformation',
                    sentence_rewriting: 'Sentence Rewriting',
                    preposition_mastery: 'Preposition Mastery',
                    translation_skill: 'Translation Skill',
                    paragraph_structure: 'Paragraph Structure',
                    coherence_cohesion: 'Coherence & Cohesion',
                    idea_development: 'Idea Development',
                    language_accuracy: 'Language Accuracy'
                },
                examStructure: {
                    scientific: [
                        { name: 'Reading Comprehension', points: '7-8 points (35-40%)' },
                        { name: 'Linguistic Competence', points: '7-8 points (35-40%)' },
                        { name: 'Written Production', points: '5-6 points (25-30%)' }
                    ],
                    literary: [
                        { name: 'Reading Comprehension', points: '7-8 points (35-40%)' },
                        { name: 'Linguistic Competence', points: '7-8 points (35-40%)' },
                        { name: 'Written Production', points: '5-6 points (25-30%)' }
                    ]
                }
            },
            maths: {
    displayName: 'الرياضيات',
    skillColumns: [
        'functions_analysis', 'algebra_skill', 'probability_skill', 
        'sequences_skill', 'integral_calculus', 'complex_numbers',
        'geometry_skill', 'proof_reasoning', 'multi_step_solving',
        'graph_interpretation', 'exam_time_management'
    ],
    skillTargets: {
        functions_analysis: 7.5,
        algebra_skill: 7.0,
        probability_skill: 6.5,
        sequences_skill: 6.5,
        integral_calculus: 6.5,
        complex_numbers: 6.0,
        geometry_skill: 6.0,
        proof_reasoning: 6.5,
        multi_step_solving: 7.0,
        graph_interpretation: 6.5,
        exam_time_management: 6.0
    },
    skillNames: {
        functions_analysis: 'التحليل (الدوال، النهايات، المشتقات)',
        algebra_skill: 'الجبر (المعادلات، المتراجحات)',
        probability_skill: 'الاحتمالات',
        sequences_skill: 'المتتاليات',
        integral_calculus: 'التكامل',
        complex_numbers: 'الأعداد المركبة',
        geometry_skill: 'الهندسة',
        proof_reasoning: 'البرهان والاستدلال',
        multi_step_solving: 'حل مسائل متعددة الخطوات',
        graph_interpretation: 'قراءة وتحليل المنحنيات',
        exam_time_management: 'إدارة الوقت في الامتحان'
    },
    examStructure: {
        scientific: [
            { name: 'الاحتمالات + المتتاليات', points: '4-5 نقاط' },
            { name: 'المتتاليات + الأعداد المركبة', points: '4-5 نقاط' },
            { name: 'الحساب + الجبر + الأعداد المركبة', points: '4-5 نقاط' },
            { name: 'التحليل + الدوال + التكامل', points: '7-8 نقاط' }
        ],
        literary: [
            { name: 'المتتاليات العددية', points: '6 نقاط' },
            { name: 'الاحتمالات والإحصاء', points: '6 نقاط' },
            { name: 'التحليل والدوال (أساسيات)', points: '8 نقاط' }
        ]
    }
},
physics: {
    displayName: 'العلوم الفيزيائية',
    skillColumns: [
        'mechanics', 'electricity', 'chemistry_general', 'chemistry_esterification',
        'chemistry_acid_base', 'nuclear', 'waves_oscillations',
        'problem_solving', 'graph_interpretation', 'formula_mastery'
    ],
    skillTargets: {
        mechanics: 7.5,
        electricity: 7.5,
        chemistry_general: 6.5,
        chemistry_esterification: 6.0,
        chemistry_acid_base: 6.0,
        nuclear: 5.5,
        waves_oscillations: 5.0,
        problem_solving: 6.5,
        graph_interpretation: 6.0,
        formula_mastery: 6.0
    },
    skillNames: {
        mechanics: 'الميكانيك',
        electricity: 'الكهرباء',
        chemistry_general: 'الكيمياء العامة',
        chemistry_esterification: 'الأسترة',
        chemistry_acid_base: 'الأحماض والأسس',
        nuclear: 'الفيزياء النووية',
        waves_oscillations: 'الموجات والتذبذبات',
        problem_solving: 'حل المسائل',
        graph_interpretation: 'قراءة المنحنيات',
        formula_mastery: 'حفظ القوانين'
    },
    examStructure: {
        scientific: [
            { name: 'الميكانيك', points: '5-6 نقاط' },
            { name: 'الكهرباء', points: '4-5 نقاط' },
            { name: 'الفيزياء النووية', points: '2-3 نقاط' },
            { name: 'الكيمياء', points: '7 نقاط' }
        ],
        literary: [
            { name: 'الميكانيك', points: '5-6 نقاط' },
            { name: 'الكهرباء', points: '4-5 نقاط' },
            { name: 'الموجات', points: '1-2 نقاط' },
            { name: 'الكيمياء', points: '6 نقاط' }
        ]
    }
},science: {
    displayName: 'علوم الطبيعة والحياة',
    skillColumns: [
        'molecular_biology', 'protein_enzymes', 'immunology',
        'energy_photosynthesis', 'energy_respiration', 'neuroscience', 'geology',
        'document_analysis', 'hypothesis_formulation', 'scientific_writing', 'reasoning_chain'
    ],
    skillTargets: {
        molecular_biology: 7.0,
        protein_enzymes: 7.0,
        immunology: 7.0,
        energy_photosynthesis: 6.5,
        energy_respiration: 6.5,
        neuroscience: 6.0,
        geology: 5.5,
        document_analysis: 7.0,
        hypothesis_formulation: 6.5,
        scientific_writing: 6.5,
        reasoning_chain: 6.5
    },
    skillNames: {
        molecular_biology: 'البيولوجيا الجزيئية',
        protein_enzymes: 'البروتينات والأنزيمات',
        immunology: 'المناعة',
        energy_photosynthesis: 'التركيب الضوئي',
        energy_respiration: 'التنفس الخلوي',
        neuroscience: 'العلوم العصبية',
        geology: 'الجيولوجيا',
        document_analysis: 'تحليل الوثائق',
        hypothesis_formulation: 'اقتراح الفرضيات',
        scientific_writing: 'الكتابة العلمية',
        reasoning_chain: 'التسلسل المنطقي'
    },
    examStructure: {
        scientific: [
            { name: 'البيولوجيا الجزيئية', points: '5-6 نقاط' },
            { name: 'المناعة', points: '7-8 نقاط' },
            { name: 'تحويل الطاقة + العلوم العصبية', points: '7-8 نقاط' },
            { name: 'الجيولوجيا', points: '8 نقاط' }
        ],
        literary: [
            { name: 'البيولوجيا الجزيئية + البروتينات', points: '10-11 نقاط' },
            { name: 'المناعة', points: '9-10 نقاط' }
        ]
    }
},
techno: {
    displayName: 'التكنولوجيا (هندسة)',
    skillColumns: [
        'mechanics_rdm', 'material_resistance', 'gear_transmission',
        'automation_grafcet', 'logic_circuits', 'electrical_systems',
        'structural_analysis', 'reinforced_concrete', 'road_construction',
        'organic_chemistry', 'polymer_chemistry', 'thermodynamics',
        'problem_solving', 'diagram_interpretation', 'calculation_accuracy', 'technical_drawing'
    ],
    skillTargets: {
        mechanics_rdm: 7.0,
        material_resistance: 6.5,
        gear_transmission: 6.5,
        automation_grafcet: 7.0,
        logic_circuits: 6.5,
        electrical_systems: 6.5,
        structural_analysis: 7.0,
        reinforced_concrete: 6.5,
        road_construction: 6.0,
        organic_chemistry: 7.0,
        polymer_chemistry: 6.5,
        thermodynamics: 6.0,
        problem_solving: 7.0,
        diagram_interpretation: 6.5,
        calculation_accuracy: 6.5,
        technical_drawing: 6.0
    },
    skillNames: {
        mechanics_rdm: 'الميكانيك (RDM)',
        material_resistance: 'مقاومة المواد',
        gear_transmission: 'نقل الحركة',
        automation_grafcet: 'الأتمتة (GRAFCET)',
        logic_circuits: 'الدوائر المنطقية',
        electrical_systems: 'الأنظمة الكهربائية',
        structural_analysis: 'التحليل الإنشائي',
        reinforced_concrete: 'الخرسانة المسلحة',
        road_construction: 'الطرق',
        organic_chemistry: 'الكيمياء العضوية',
        polymer_chemistry: 'كيمياء البوليمرات',
        thermodynamics: 'الثيرموديناميك',
        problem_solving: 'حل المسائل',
        diagram_interpretation: 'قراءة المخططات',
        calculation_accuracy: 'دقة الحسابات',
        technical_drawing: 'الرسم التقني'
    },
    examStructure: {
        scientific: [
            { name: 'دراسة تصميمية', points: '13 نقاط (65%)' },
            { name: 'دراسة تحضيرية', points: '7 نقاط (35%)' }
        ],
        literary: [
            { name: 'دراسة تصميمية', points: '13 نقاط (65%)' },
            { name: 'دراسة تحضيرية', points: '7 نقاط (35%)' }
        ]
    }
},gestion: {
    displayName: 'التسيير المحاسبي والمالي',
    skillColumns: [
        'calculation_accuracy', 'financial_logic', 'table_handling',
        'cost_block', 'financial_block', 'loan_block', 'execution_speed'
    ],
    skillTargets: {
        calculation_accuracy: 7.5,
        financial_logic: 6.5,
        table_handling: 6.5,
        cost_block: 7.0,
        financial_block: 7.0,
        loan_block: 6.5,
        execution_speed: 6.0
    },
    skillNames: {
        calculation_accuracy: 'دقة الحسابات',
        financial_logic: 'المنطق المالي',
        table_handling: 'التعامل مع الجداول',
        cost_block: 'تسيير التكاليف',
        financial_block: 'المحاسبة المالية',
        loan_block: 'قروض الاستثمار',
        execution_speed: 'سرعة التنفيذ'
    },
    examStructure: {
        scientific: [
            { name: 'تسيير التكاليف', points: '6 نقاط (30%)' },
            { name: 'المحاسبة المالية', points: '8 نقاط (40%)' },
            { name: 'قروض الاستثمار', points: '6 نقاط (30%)' }
        ],
        literary: [
            { name: 'تسيير التكاليف', points: '6 نقاط (30%)' },
            { name: 'المحاسبة المالية', points: '8 نقاط (40%)' },
            { name: 'قروض الاستثمار', points: '6 نقاط (30%)' }
        ]
    }
},
economie: {
    displayName: 'الاقتصاد والمناجمنت',
    skillColumns: [
        'market_mechanisms', 'money_banking', 'unemployment', 'inflation',
        'international_trade', 'financing',
        'communication', 'control', 'leadership_motivation',
        'situation_analysis', 'graph_interpretation', 'calculation_accuracy', 'structured_answer'
    ],
    skillTargets: {
        market_mechanisms: 7.0,
        money_banking: 6.5,
        unemployment: 6.5,
        inflation: 6.5,
        international_trade: 6.0,
        financing: 6.5,
        communication: 6.0,
        control: 6.0,
        leadership_motivation: 5.5,
        situation_analysis: 7.5,
        graph_interpretation: 7.0,
        calculation_accuracy: 6.5,
        structured_answer: 6.0
    },
    skillNames: {
        market_mechanisms: 'آليات السوق',
        money_banking: 'النقود والبنوك',
        unemployment: 'البطالة',
        inflation: 'التضخم',
        international_trade: 'التجارة الدولية',
        financing: 'التمويل',
        communication: 'الاتصال',
        control: 'الرقابة',
        leadership_motivation: 'القيادة والتحفيز',
        situation_analysis: 'تحليل الوضعيات',
        graph_interpretation: 'قراءة المنحنيات',
        calculation_accuracy: 'دقة الحسابات',
        structured_answer: 'الإجابة المنظمة'
    },
    examStructure: {
        scientific: [
            { name: 'الأسئلة المباشرة', points: '6 نقاط (30%)' },
            { name: 'تمارين تطبيقية', points: '6 نقاط (30%)' },
            { name: 'وضعية إدماجية', points: '8 نقاط (40%)' }
        ],
        literary: [
            { name: 'الأسئلة المباشرة', points: '6 نقاط (30%)' },
            { name: 'تمارين تطبيقية', points: '6 نقاط (30%)' },
            { name: 'وضعية إدماجية', points: '8 نقاط (40%)' }
        ]
    }
},
droit: {
    displayName: 'القانون',
    skillColumns: [
        'company_law', 'labor_law_individual', 'labor_law_collective', 'public_finance',
        'legal_reasoning', 'qualification', 'justification', 'definition_recall'
    ],
    skillTargets: {
        company_law: 7.0,
        labor_law_individual: 7.0,
        labor_law_collective: 6.5,
        public_finance: 6.0,
        legal_reasoning: 7.5,
        qualification: 7.0,
        justification: 6.5,
        definition_recall: 6.0
    },
    skillNames: {
        company_law: 'قانون الشركات',
        labor_law_individual: 'قانون العمل الفردي',
        labor_law_collective: 'قانون العمل الجماعي',
        public_finance: 'المالية العامة',
        legal_reasoning: 'الاستدلال القانوني',
        qualification: 'التكييف القانوني',
        justification: 'التبرير القانوني',
        definition_recall: 'حفظ التعريفات'
    },
    examStructure: {
        scientific: [
            { name: 'الأسئلة المباشرة', points: '6 نقاط (30%)' },
            { name: 'وضعية عملية', points: '6 نقاط (30%)' },
            { name: 'وضعية مركبة', points: '8 نقاط (40%)' }
        ],
        literary: [
            { name: 'الأسئلة المباشرة', points: '6 نقاط (30%)' },
            { name: 'وضعية عملية', points: '6 نقاط (30%)' },
            { name: 'وضعية مركبة', points: '8 نقاط (40%)' }
        ]
    }
},
his_geo: {
    displayName: 'التاريخ والجغرافيا',
    skillColumns: [
        'historical_memory', 'dates_memory', 'figures_memory', 'geography_knowledge',
        'document_analysis_method', 'essay_method', 'map_stats_method', 'argumentation_skill',
        'cold_war_knowledge', 'decolonization_knowledge', 'algeria_history_knowledge',
        'economic_powers_knowledge', 'development_knowledge'
    ],
    skillTargets: {
        historical_memory: 7.0,
        dates_memory: 6.5,
        figures_memory: 6.5,
        geography_knowledge: 6.5,
        document_analysis_method: 7.5,
        essay_method: 7.5,
        map_stats_method: 7.0,
        argumentation_skill: 7.0,
        cold_war_knowledge: 6.5,
        decolonization_knowledge: 6.5,
        algeria_history_knowledge: 6.5,
        economic_powers_knowledge: 6.0,
        development_knowledge: 6.0
    },
    skillNames: {
        historical_memory: 'الأحداث التاريخية',
        dates_memory: 'التواريخ المهمة',
        figures_memory: 'الشخصيات التاريخية',
        geography_knowledge: 'المفاهيم الجغرافية',
        document_analysis_method: 'تحليل الوثائق',
        essay_method: 'كتابة المقال',
        map_stats_method: 'قراءة الخرائط والإحصاءات',
        argumentation_skill: 'الحجاج والمنطق',
        cold_war_knowledge: 'الحرب الباردة',
        decolonization_knowledge: 'حركات التحرر',
        algeria_history_knowledge: 'تاريخ الجزائر',
        economic_powers_knowledge: 'القوى الاقتصادية',
        development_knowledge: 'التنمية والعالم الثالث'
    },
    examStructure: {
        scientific: [
            { name: 'التاريخ - تحليل وثيقة', points: '6 نقاط (30%)' },
            { name: 'التاريخ - مقال', points: '4 نقاط (20%)' },
            { name: 'الجغرافيا - تحليل إحصاءات/خريطة', points: '6 نقاط (30%)' },
            { name: 'الجغرافيا - مقال', points: '4 نقاط (20%)' }
        ],
        literary: [
            { name: 'التاريخ - تحليل وثيقة', points: '6 نقاط (30%)' },
            { name: 'التاريخ - مقال', points: '4 نقاط (20%)' },
            { name: 'الجغرافيا - تحليل إحصاءات/خريطة', points: '6 نقاط (30%)' },
            { name: 'الجغرافيا - مقال', points: '4 نقاط (20%)' }
        ]
    }
},
islamia: {
    displayName: 'العلوم الإسلامية',
    skillColumns: [
        'quran_recitation', 'tafsir_understanding', 'reasoning_from_verses',
        'hadith_comprehension', 'hadith_analysis', 'moral_extraction',
        'fiqh_ibadah', 'fiqh_muamalat', 'riba_understanding',
        'aqida_understanding', 'proofs_awareness',
        'ayah_analysis', 'hadith_text_analysis', 'document_analysis',
        'definition_accuracy', 'explanation_clarity', 'evidence_usage', 'structured_answer'
    ],
    skillTargets: {
        quran_recitation: 7.0,
        tafsir_understanding: 7.0,
        reasoning_from_verses: 6.5,
        hadith_comprehension: 6.5,
        hadith_analysis: 7.0,
        moral_extraction: 6.5,
        fiqh_ibadah: 7.0,
        fiqh_muamalat: 7.0,
        riba_understanding: 6.5,
        aqida_understanding: 6.5,
        proofs_awareness: 6.5,
        ayah_analysis: 7.0,
        hadith_text_analysis: 7.0,
        document_analysis: 7.5,
        definition_accuracy: 6.5,
        explanation_clarity: 6.5,
        evidence_usage: 6.5,
        structured_answer: 7.5
    },
    skillNames: {
        quran_recitation: 'تلاوة القرآن',
        tafsir_understanding: 'فهم التفسير',
        reasoning_from_verses: 'الاستدلال من الآيات',
        hadith_comprehension: 'فهم الحديث',
        hadith_analysis: 'تحليل الحديث',
        moral_extraction: 'استخراج العبر',
        fiqh_ibadah: 'فقه العبادات',
        fiqh_muamalat: 'فقه المعاملات',
        riba_understanding: 'فهم الربا',
        aqida_understanding: 'فهم العقيدة',
        proofs_awareness: 'الأدلة الشرعية',
        ayah_analysis: 'تحليل الآيات',
        hadith_text_analysis: 'تحليل النصوص الحديثية',
        document_analysis: 'تحليل الوثائق',
        definition_accuracy: 'دقة التعريفات',
        explanation_clarity: 'وضوح الشرح',
        evidence_usage: 'استخدام الأدلة',
        structured_answer: 'الإجابة المنظمة'
    },
    examStructure: {
        scientific: [
            { name: 'تحليل نصوص شرعية', points: '12 نقاط (60%)' },
            { name: 'مسائل فقهية', points: '8 نقاط (40%)' }
        ],
        literary: [
            { name: 'تحليل نصوص شرعية', points: '12 نقاط (60%)' },
            { name: 'مسائل فقهية', points: '8 نقاط (40%)' }
        ]
    }
},
philo: {
    displayName: 'الفلسفة',
    skillColumns: [
        'text_analysis', 'argument_identification', 'concept_comprehension',
        'comparison_skill', 'synthesis_skill',
        'essay_structure', 'clarity_expression', 'critical_thinking',
        'philosophical_reasoning', 'problematization',
        'thesis_defense', 'example_usage', 'conceptual_analysis',
        'logic_consistency', 'nuance_handling', 'conclusion_skill'
    ],
    skillTargets: {
        text_analysis: 7.0,
        argument_identification: 6.5,
        concept_comprehension: 6.5,
        comparison_skill: 6.0,
        synthesis_skill: 6.5,
        essay_structure: 7.0,
        clarity_expression: 6.5,
        critical_thinking: 7.0,
        philosophical_reasoning: 6.5,
        problematization: 6.5,
        thesis_defense: 6.0,
        example_usage: 6.0,
        conceptual_analysis: 6.5,
        logic_consistency: 6.0,
        nuance_handling: 5.5,
        conclusion_skill: 6.0
    },
    skillNames: {
        text_analysis: 'تحليل النصوص',
        argument_identification: 'تحديد الحجج',
        concept_comprehension: 'فهم المفاهيم',
        comparison_skill: 'المقارنة',
        synthesis_skill: 'التركيب',
        essay_structure: 'هيكلة المقال',
        clarity_expression: 'وضوح التعبير',
        critical_thinking: 'التفكير النقدي',
        philosophical_reasoning: 'الاستدلال الفلسفي',
        problematization: 'الإشكالية',
        thesis_defense: 'الدفاع عن الأطروحة',
        example_usage: 'استخدام الأمثلة',
        conceptual_analysis: 'التحليل المفاهيمي',
        logic_consistency: 'المنطق والاتساق',
        nuance_handling: 'التعامل مع الفروق الدقيقة',
        conclusion_skill: 'الخاتمة'
    },
    examStructure: {
        scientific: [
            { name: 'تحليل نص فلسفي', points: '8 نقاط (40%)' },
            { name: 'مقال فلسفي', points: '12 نقاط (60%)' }
        ],
        literary: [
            { name: 'تحليل نص فلسفي', points: '8 نقاط (40%)' },
            { name: 'مقال فلسفي', points: '12 نقاط (60%)' }
        ]
    }
}

        };
    }

    async loadModel(subject) {
        if (this.models[subject] && this.loaded) {
            return this.models[subject];
        }

        console.log(`📂 Loading ${subject} model...`);
        
        const modelPath = path.join(__dirname, '../../ml_models/bac_year', `${subject}_model.pkl`);

        if (!fs.existsSync(modelPath)) {
            console.log(`⚠️ Model not found: ${modelPath}`);
            return null;
        }

        this.models[subject] = true;
        this.loaded = true;
        console.log(`✅ Model ready for ${subject}`);
        return true;
    }

    async predict(subject, userData) {
        console.log(`🔮 Predicting ${subject}...`);

        try {
            const result = await this.predictWithModel(subject, userData);
            if (result) {
                console.log(`✅ Used ML model for ${subject}`);
                return result;
            }
        } catch (error) {
            console.log(`⚠️ ML model failed: ${error.message}`);
        }

        console.log(`📊 Using fallback prediction for ${subject}`);
        return this.predictFallback(subject, userData);
    }

    async predictWithModel(subject, userData) {
        console.log(`🧠 Using ML model for ${subject}`);
        
        return new Promise((resolve, reject) => {
            const modelPath = path.join(__dirname, '../../ml_models/bac_year', `${subject}_model.pkl`);
            const scriptPath = path.join(__dirname, '../../ml_scripts/predict.py');
            
            if (!fs.existsSync(scriptPath)) {
                console.log(`⚠️ Script not found: ${scriptPath}`);
                resolve(null);
                return;
            }
            
            if (!fs.existsSync(modelPath)) {
                console.log(`⚠️ Model not found: ${modelPath}`);
                resolve(null);
                return;
            }

            console.log('⏳ Starting Python process...');
            
            const python = spawn('python', [
                scriptPath,
                '--subject', subject,
                '--model', modelPath,
                '--input', JSON.stringify(userData)
            ]);

            let stdout = '';
            let stderr = '';

            python.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            python.stderr.on('data', (data) => {
                stderr += data.toString();
                console.log('⚠️ Python stderr:', data.toString());
            });

            python.on('close', (code) => {
                console.log(`⏹️ Python process closed with code ${code}`);
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout.trim());
                        console.log('✅ Python result:', result);
                        resolve(result);
                    } catch (e) {
                        console.error('❌ Parse error:', e);
                        reject(e);
                    }
                } else {
                    console.error('❌ Python error:', stderr);
                    reject(new Error(stderr || 'Python process failed'));
                }
            });

            python.on('error', (err) => {
                console.error('❌ Spawn error:', err);
                reject(err);
            });
        });
    }

    predictFallback(subject, userData) {
        console.log(`📊 Using fallback prediction formula for ${subject}`);

        const config = this.subjectConfigs[subject] || this.subjectConfigs.arabic;
        const skillTargets = config.skillTargets;
        const skillColumns = config.skillColumns;

        const avgGrade = (userData.grade_t1 + userData.grade_t2 + userData.grade_t3) / 3;

        let weightedSkills = 0;
        let totalWeight = 0;
        
        let weights = {};
        if (subject === 'french') {
            weights = {
                comprehension_textuelle: 0.20,
                inference: 0.15,
                thesis_identification: 0.15,
                essay_structure: 0.13,
                true_false_justification: 0.10,
                communicative_intent: 0.10,
                argument_identification: 0.08,
                language_accuracy: 0.05,
                concession_opposition: 0.02,
                historical_text: 0.01,
                argumentative_text: 0.01
            };
        } else if (subject === 'english') {
            weights = {
                main_idea_detection: 0.12,
                inference_skill: 0.10,
                tense_control: 0.10,
                essay_structure: 0.09,
                transformation_skill: 0.08,
                conditional_mastery: 0.08,
                vocabulary_richness: 0.08,
                coherence_score: 0.07,
                cohesion_score: 0.06,
                writing_grammar: 0.06,
                synonym_accuracy: 0.05,
                antonym_accuracy: 0.03,
                text_structure: 0.02,
                ordering_information: 0.02,
                skimming_scanning: 0.02,
                guided_writing: 0.02
            };
        } else if (subject === 'tamazight') {
            weights = {
                verb_identification: 0.15,
                morphology_root_pattern: 0.14,
                main_idea_detection: 0.12,
                narrative_understanding: 0.10,
                subject_object_analysis: 0.10,
                narrative_writing: 0.08,
                descriptive_writing: 0.07,
                coherence_score: 0.06,
                character_identification: 0.05,
                event_ordering: 0.04,
                implicit_meaning: 0.04,
                sentence_decomposition: 0.03,
                shifter_identification: 0.02
            };
        } else {
            weights = {
                poetry: 0.24,
                rhetoric: 0.20,
                grammar: 0.18,
                prose: 0.14,
                essay: 0.12,
                comprehension: 0.08
            };
        }

        for (const skill of skillColumns) {
            const weight = weights[skill] || 0.1;
            const value = userData[skill] || 5;
            weightedSkills += value * weight;
            totalWeight += weight;
        }
        
        if (totalWeight > 0) {
            weightedSkills = weightedSkills / totalWeight * 10;
        } else {
            weightedSkills = 5;
        }

        const consistencyScaled = (userData.consistency || 3) / 5 * 10;
        const participationScaled = (userData.participation || 3) / 5 * 10;
        const studyHoursScaled = (userData.study_hours || 5) / 12 * 10;
        const examPracticeScaled = Math.min((userData.exams_practiced || 0) / 25 * 10, 10);

        let score = (
            0.50 * weightedSkills +
            0.15 * consistencyScaled +
            0.10 * participationScaled +
            0.10 * studyHoursScaled +
            0.15 * examPracticeScaled
        ) * 2.0;

        const filiere = userData.filiere || 0;
        if (subject === 'french') {
            if (filiere === 1) score += 0.5;
            else if (filiere === 2) score += 1.0;
            else if (filiere === 0) score -= 0.5;
        } else {
            if (filiere === 2) score += 1.0;
            else if (filiere === 0) score -= 0.5;
        }

        score += (Math.random() - 0.5) * 0.6;
        score = Math.max(8, Math.min(19.5, score));
        score = Math.round(score * 10) / 10;

        const prob = Math.min(95, Math.max(20, (score - 8) / 12 * 100));
        const improvement = Math.max(0, Math.min(3, (14 - score) / 2));

        return {
            predicted_score: score,
            success_probability: Math.round(prob),
            improvement_potential: Math.round(improvement * 10) / 10
        };
    }

    calculateDerivedFeatures(subject, userData) {
        const features = {};
        
        // For Arabic (default)
        if (subject === 'arabic' || !subject) {
            const grammar = userData?.grammar || 0;
            const comprehension = userData?.comprehension || 0;
            const essay = userData?.essay || 0;
            const poetry = userData?.poetry || 0;
            const prose = userData?.prose || 0;
            const rhetoric = userData?.rhetoric || 0;
            const essaysPerWeek = userData?.essays_per_week || 0;
            const examsPracticed = userData?.exams_practiced || 0;
            
            features.language_core = (grammar + comprehension) / 2;
            features.writing_score = essay;
            features.analysis_score = (poetry + prose) / 2;
            features.practice_intensity = (essaysPerWeek * 2 + examsPracticed / 3) / 2;

            const skills = [grammar, essay, poetry, prose, rhetoric, comprehension];
            const mean = skills.reduce((a, b) => a + b, 0) / skills.length;
            features.skill_balance = skills.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skills.length;
            
            for (const key of Object.keys(features)) {
                features[key] = Math.round(features[key] * 100) / 100;
            }
        }
        // For French
        else if (subject === 'french') {
            const compCols = ['comprehension_textuelle', 'inference', 'true_false_justification', 'communicative_intent'];
            const argCols = ['thesis_identification', 'argument_identification', 'concession_opposition'];
            const writingCols = ['essay_structure', 'language_accuracy'];
            const textCols = ['historical_text', 'argumentative_text'];

            features.comprehension_score = compCols.reduce((sum, col) => sum + (userData[col] || 0), 0) / compCols.length;
            features.argumentation_score = argCols.reduce((sum, col) => sum + (userData[col] || 0), 0) / argCols.length;
            features.writing_score = writingCols.reduce((sum, col) => sum + (userData[col] || 0), 0) / writingCols.length;
            features.text_type_score = textCols.reduce((sum, col) => sum + (userData[col] || 0), 0) / textCols.length;
            
            features.practice_score = Math.min((userData.exams_practiced || 0) / 25 * 10, 10);
            features.practice_intensity = (userData.essays_per_week * 2 + userData.texts_analyzed_per_week + userData.exams_practiced / 3) / 3;
            features.preparation_score = features.practice_score * 0.7 + (userData.confidence / 5 * 10) * 0.3;
            features.global_skills_score = (features.comprehension_score + features.argumentation_score + features.writing_score) / 3;
            
            const skillsValues = [features.comprehension_score, features.argumentation_score, features.writing_score];
            const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
            features.imbalance_score = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
            
            for (const key of Object.keys(features)) {
                features[key] = Math.round(features[key] * 100) / 100;
            }
        }
        // For English
        else if (subject === 'english') {
            const pastExams = userData.exams_practiced || 0;
            const writingFreq = userData.essays_per_week || 0;
            const readingFreq = userData.study_hours || 0;
            
            const readingSkills = ['main_idea_detection', 'inference_skill', 'text_structure', 
                                   'ordering_information', 'skimming_scanning'];
            features.reading_score_derived = readingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / readingSkills.length;
            
            const langSkills = ['synonym_accuracy', 'antonym_accuracy', 'transformation_skill',
                                'conditional_mastery', 'tense_control', 'vocabulary_richness'];
            features.language_score_derived = langSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / langSkills.length;
            
            const writingSkills = ['essay_structure', 'guided_writing', 'argumentation_skill',
                                   'coherence_score', 'cohesion_score', 'writing_grammar'];
            features.writing_score_derived = writingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / writingSkills.length;
            
            features.practice_intensity_derived = (writingFreq * 2 + readingFreq + pastExams / 3) / 3;
            
            const skillsValues = [features.reading_score_derived, features.language_score_derived, features.writing_score_derived];
            const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
            features.imbalance_score_derived = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
            
            const grammarSkills = ['conditional_mastery', 'tense_control', 'transformation_skill'];
            features.grammar_mastery = grammarSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / grammarSkills.length;
            
            const vocabSkills = ['synonym_accuracy', 'antonym_accuracy', 'vocabulary_richness'];
            features.vocabulary_score = vocabSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / vocabSkills.length;
            
            features.overall_proficiency = (features.reading_score_derived + features.language_score_derived + features.writing_score_derived) / 3;
            features.psycho_balance = (userData.confidence - userData.stress + 4) / 2;
            features.study_efficiency = userData.study_hours / 12;
            features.study_method = userData.study_method || 3;
            
            for (const key of Object.keys(features)) {
                features[key] = Math.round(features[key] * 100) / 100;
            }
        }
        // For Tamazight
        else if (subject === 'tamazight') {
            const grammarSkills = ['verb_identification', 'subject_object_analysis', 'sentence_decomposition', 'shifter_identification'];
            features.language_core_score = grammarSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / grammarSkills.length;
            
            features.morphology_score = userData.morphology_root_pattern || 0;
            
            const readingSkills = ['main_idea_detection', 'narrative_understanding', 'character_identification', 'event_ordering', 'implicit_meaning'];
            features.reading_comprehension = readingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / readingSkills.length;
            
            const writingSkills = ['narrative_writing', 'descriptive_writing', 'coherence_score', 'paragraph_structure', 'vocabulary_accuracy'];
            features.writing_score = writingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / writingSkills.length;
            
            const culturalSkills = ['cultural_heritage', 'oral_tradition_awareness'];
            features.cultural_heritage = culturalSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / culturalSkills.length;
            
            const writingFreq = userData.writing_frequency || 0;
            const readingFreq = userData.reading_frequency || 0;
            const textAnalysis = userData.text_analysis_practice || 0;
            const examPrep = userData.exam_preparation || 0;
            features.practice_intensity = (writingFreq * 2 + readingFreq + textAnalysis + examPrep / 3) / 3;
            
            const skillsValues = [features.language_core_score, features.reading_comprehension, features.writing_score];
            const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
            features.imbalance_score = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
            features.analysis_score = features.reading_comprehension;
            
            for (const key of Object.keys(features)) {
                features[key] = Math.round(features[key] * 100) / 100;
            }
        }
        // For Foreign Languages
        else if (subject === 'langue_etrangere') {
            const readingSkills = ['main_idea_detection', 'detail_extraction', 'true_false_accuracy', 'reference_resolution', 'inference_skill'];
            features.reading_score = readingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / readingSkills.length;
            
            const linguisticSkills = ['synonym_antonym', 'word_formation', 'tense_mastery', 'grammar_transformation', 'sentence_rewriting', 'preposition_mastery', 'translation_skill'];
            features.linguistic_score = linguisticSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / linguisticSkills.length;
            
            const writingSkills = ['paragraph_structure', 'coherence_cohesion', 'idea_development', 'language_accuracy'];
            features.writing_score = writingSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / writingSkills.length;
            
            features.practice_intensity = (userData.writing_tasks_per_week * 2 + userData.texts_read_per_week + userData.bac_subjects_practiced / 2 + userData.exercises_done_per_week / 2) / 4;
            
            const grammarSkills = ['tense_mastery', 'grammar_transformation', 'sentence_rewriting', 'preposition_mastery'];
            features.grammar_mastery = grammarSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / grammarSkills.length;
            
            const vocabSkills = ['synonym_antonym', 'word_formation'];
            features.vocabulary_score = vocabSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / vocabSkills.length;
            
            features.overall_proficiency = (features.reading_score + features.linguistic_score + features.writing_score) / 3;
            
            const skillsValues = [features.reading_score, features.linguistic_score, features.writing_score];
            const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
            features.imbalance_score = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
            
            features.psycho_balance = (userData.confidence - userData.stress + 4) / 2;
            features.study_efficiency = userData.texts_read_per_week / 10;
            
            for (const key of Object.keys(features)) {
                features[key] = Math.round(features[key] * 100) / 100;
            }
            
        }
        // For Mathematics
// For Mathematics
else if (subject === 'maths') {
    // Analysis Level
    features.analysis_level = (userData.functions_analysis || 0 + userData.graph_interpretation || 0) / 2;
    
    // Algebra Level
    features.algebra_level = userData.algebra_skill || 0;
    
    // Probability & Sequences Level
    features.prob_seq_level = (userData.probability_skill || 0 + userData.sequences_skill || 0) / 2;
    
    // Integral Level
    features.integral_level = userData.integral_calculus || 0;
    
    // ✅ FIXED: Use frontend field names
    const pastExams = userData.exams_practiced || 0;
    const exercisesPerWeek = userData.essays_per_week || 0;
    const timedExams = userData.timed_exams_per_week || 0;
    const studyHours = userData.study_hours || 0;
    
    features.practice_intensity = (pastExams / 30 * 10 * 0.4 + exercisesPerWeek / 20 * 10 * 0.3 + timedExams / 5 * 10 * 0.3);
    
    // Psychological Health
    const confidence = userData.confidence || 5;
    const focus = userData.focus_concentration || 5;
    const no_anxiety = 10 - (userData.math_anxiety || 5);
    const no_stress = 10 - (userData.exam_stress || 5);
    features.psychological_health = (confidence + focus + no_anxiety + no_stress) / 4;
    
    // Imbalance Score
    const skillsValues = [
        userData.functions_analysis || 0,
        userData.algebra_skill || 0,
        userData.probability_skill || 0,
        userData.sequences_skill || 0
    ];
    const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
    features.imbalance_score = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
    
    // Round all values
    for (const key of Object.keys(features)) {
        features[key] = Math.round(features[key] * 100) / 100;
    }
}
// For Physics
else if (subject === 'physics') {
    // Mechanics Block
    features.mechanics_block = userData.mechanics || 0;
    
    // Electricity Block
    features.electricity_block = userData.electricity || 0;
    
    // Chemistry Block
    const chemSkills = ['chemistry_general', 'chemistry_esterification', 'chemistry_acid_base'];
    features.chemistry_block = chemSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / chemSkills.length;
    
    // Nuclear Block
    features.nuclear_block = userData.nuclear || 0;
    
    // Waves Block
    features.waves_block = userData.waves_oscillations || 0;
    
    // Practice Intensity
    const pastExams = userData.exams_practiced || 0;
    const tp = userData.tp_practice || 0;
    features.practice_intensity = (pastExams / 30 * 10 * 0.8 + tp / 5 * 10 * 0.2);
    
    // Problem Solving Composite
    features.problem_solving_composite = (userData.problem_solving || 0 + userData.graph_interpretation || 0) / 2;
    
    // Psychological Health
    const no_anxiety = 10 - (userData.physics_anxiety || 5);
    const formula = userData.formula_mastery || 5;
    features.psychological_health = (no_anxiety * 0.6 + formula * 0.4);
    
    // Imbalance Score
    const skillsValues = [
        userData.mechanics || 0,
        userData.electricity || 0,
        userData.chemistry_general || 0,
        userData.nuclear || 0,
        userData.waves_oscillations || 0
    ];
    const mean = skillsValues.reduce((a, b) => a + b, 0) / skillsValues.length;
    features.skill_balance = skillsValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / skillsValues.length;
    
    // Round all values
    for (const key of Object.keys(features)) {
        features[key] = Math.round(features[key] * 100) / 100;
    }
}// For Science (SVT)
else if (subject === 'science') {
    // Scientific Skills Composite
    const sciSkills = ['document_analysis', 'hypothesis_formulation', 'scientific_writing', 'reasoning_chain'];
    features.scientific_skills_composite = sciSkills.reduce((sum, col) => sum + (userData[col] || 0), 0) / sciSkills.length;
    
    // Document Mastery
    features.document_mastery = (userData.document_analysis || 0 + userData.document_confidence || 0) / 2;
    
    // Reasoning Quality
    features.reasoning_quality = (userData.reasoning_chain || 0 + userData.hypothesis_formulation || 0) / 2;
    
    // Practice Intensity
    const pastExams = userData.exams_practiced || 0;
    const docExercises = userData.document_exercises || 0;
    features.practice_intensity = (pastExams / 30 * 10 * 0.6 + docExercises / 15 * 10 * 0.4);
    
    // Psychological Health
    const docConf = userData.document_confidence || 5;
    const writingConf = userData.scientific_writing_confidence || 5;
    const noAnxiety = 10 - (userData.svt_anxiety || 5);
    features.psychological_health = (docConf + writingConf + noAnxiety) / 3;
    
    // SVT Overall Score
    const blocks = [
        userData.molecular_biology || 0,
        userData.protein_enzymes || 0,
        userData.immunology || 0
    ];
    features.svt_overall_score = blocks.reduce((a, b) => a + b, 0) / blocks.length;
    
    // Imbalance Score
    const allBlocks = [
        userData.molecular_biology || 0,
        userData.protein_enzymes || 0,
        userData.immunology || 0,
        userData.document_analysis || 0,
        userData.reasoning_chain || 0
    ];
    const mean = allBlocks.reduce((a, b) => a + b, 0) / allBlocks.length;
    features.skill_balance = allBlocks.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / allBlocks.length;
    
    // Round all values
    for (const key of Object.keys(features)) {
        features[key] = Math.round(features[key] * 100) / 100;
    }
}
// For Technology (Techno)
else if (subject === 'techno') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    // Frontend sends: exams_practiced, essays_per_week
    // We need to use these correctly
    
    const exams = userData.exams_practiced || 0;
    const exercises = userData.essays_per_week || 0;
    const simulations = userData.full_simulations || 0;
    const correction = userData.correction_quality || 5;
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    const confidence = userData.confidence || 5;
    const focus = userData.focus_concentration || 5;
    const techAnxiety = userData.tech_anxiety || 5;
    const examStress = userData.exam_stress || 5;
    
    // ============================================
    // SPECIALTY BLOCK - This was MISSING!
    // ============================================
    const specialty = userData.specialty || 'GM';
    let specialtyBlock = 0;
    
    if (specialty === 'GM') {
        const mechanics = userData.mechanics_rdm || 5;
        const materials = userData.material_resistance || 5;
        const gears = userData.gear_transmission || 5;
        specialtyBlock = (mechanics + materials + gears) / 3;
    } else if (specialty === 'GE') {
        const automation = userData.automation_grafcet || 5;
        const logic = userData.logic_circuits || 5;
        const electrical = userData.electrical_systems || 5;
        specialtyBlock = (automation + logic + electrical) / 3;
    } else if (specialty === 'GC') {
        const structural = userData.structural_analysis || 5;
        const concrete = userData.reinforced_concrete || 5;
        const road = userData.road_construction || 5;
        specialtyBlock = (structural + concrete + road) / 3;
    } else if (specialty === 'GP') {
        const organic = userData.organic_chemistry || 5;
        const polymer = userData.polymer_chemistry || 5;
        const thermo = userData.thermodynamics || 5;
        specialtyBlock = (organic + polymer + thermo) / 3;
    }
    
    features.specialty_block = Math.round(specialtyBlock * 100) / 100;
    
    // ============================================
    // PRACTICE INTENSITY - Use correct field names
    // ============================================
    features.practice_intensity = Math.round(
        (exams / 30 * 10 * 0.4 + 
         exercises / 15 * 10 * 0.3 + 
         simulations / 5 * 10 * 0.3) * 100
    ) / 100;
    
    // ============================================
    // PROBLEM SOLVING COMPOSITE
    // ============================================
    const problemSolving = userData.problem_solving || 5;
    const diagramInterpretation = userData.diagram_interpretation || 5;
    features.problem_solving_composite = Math.round(
        ((problemSolving + diagramInterpretation) / 2) * 100
    ) / 100;
    
    // ============================================
    // PSYCHOLOGICAL HEALTH
    // ============================================
    features.psychological_health = Math.round(
        ((confidence + focus + (10 - techAnxiety) + (10 - examStress)) / 4) * 100
    ) / 100;
    
    // ============================================
    // STUDY QUALITY
    // ============================================
    features.study_quality = Math.round(
        (consistency * 0.5 + (studyHours / 12 * 10 * 0.3) + correction * 0.2) * 100
    ) / 100;
    
    // ============================================
    // EXAM PREP SCORE
    // ============================================
    features.exam_prep_score = Math.round(
        (exams / 30 * 10) * 100
    ) / 100;
    
    // ============================================
    // OVERALL SKILL SCORE
    // ============================================
    const skillValues = [
        userData.problem_solving || 5,
        userData.diagram_interpretation || 5,
        userData.calculation_accuracy || 5,
        userData.technical_drawing || 5
    ];
    features.overall_skill_score = Math.round(
        (skillValues.reduce((a, b) => a + b, 0) / skillValues.length) * 100
    ) / 100;
    
    // ============================================
    // SKILL BALANCE (Imbalance Score)
    // ============================================
    const allSkills = [
        userData.mechanics_rdm || 5,
        userData.automation_grafcet || 5,
        userData.structural_analysis || 5,
        userData.organic_chemistry || 5,
        userData.problem_solving || 5
    ];
    const mean = allSkills.reduce((a, b) => a + b, 0) / allSkills.length;
    features.skill_balance = Math.round(
        (allSkills.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allSkills.length) * 100
    ) / 100;
    
}
// For Gestion
else if (subject === 'gestion') {
    // ✅ Use the actual field names from the frontend
    const exercises = userData.essays_per_week || userData.weekly_exercises || 5;
    const bac = userData.exams_practiced || userData.bac_practiced || 5;
    const mock = userData.mock_exams || 2;
    
    features.practice_intensity = Math.round(
        (exercises / 20 * 10 * 0.5 + 
         bac / 30 * 10 * 0.3 + 
         mock / 15 * 10 * 0.2) * 100
    ) / 100;
    
    // Study Quality
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    features.study_quality = Math.round(
        (consistency * 0.6 + (studyHours / 12 * 10 * 0.4)) * 100
    ) / 100;
    
    // Overall Level
    const costBlock = userData.cost_block || 5;
    const financialBlock = userData.financial_block || 5;
    const loanBlock = userData.loan_block || 5;
    features.overall_level = Math.round(
        ((costBlock + financialBlock + loanBlock) / 3) * 100
    ) / 100;
    
    // Gestion Imbalance
    const blocks = [costBlock, financialBlock, loanBlock];
    const avg = blocks.reduce((a, b) => a + b, 0) / blocks.length;
    features.gestion_imbalance = Math.round(
        (blocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / blocks.length) * 100
    ) / 100;
    
    
}
// For Economics & Management (Economie)
else if (subject === 'economie') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    // Frontend sends: exams_practiced → Backend expects: bac_exams_practiced
    // Frontend sends: essays_per_week → Backend expects: situation_exercises
    
    const exams = userData.exams_practiced || 0;
    const exercises = userData.essays_per_week || 0;
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    const confidence = userData.analysis_confidence || 5;
    const anxiety = userData.eco_anxiety || 5;
    const stress = userData.exam_stress || 5;
    
    // ============================================
    // ECONOMICS COMPOSITE
    // ============================================
    const ecoSkills = [
        userData.market_mechanisms || 5,
        userData.money_banking || 5,
        userData.unemployment || 5,
        userData.inflation || 5,
        userData.international_trade || 5,
        userData.financing || 5
    ];
    features.economics_composite = Math.round(
        (ecoSkills.reduce((a, b) => a + b, 0) / ecoSkills.length) * 100
    ) / 100;
    
    // ============================================
    // MANAGEMENT COMPOSITE
    // ============================================
    const mgmtSkills = [
        userData.communication || 5,
        userData.control || 5,
        userData.leadership_motivation || 5
    ];
    features.management_composite = Math.round(
        (mgmtSkills.reduce((a, b) => a + b, 0) / mgmtSkills.length) * 100
    ) / 100;
    
    // ============================================
    // ECONOMIC SKILLS COMPOSITE (Applied Skills - MOST IMPORTANT!)
    // ============================================
    const appliedSkills = [
        userData.situation_analysis || 5,
        userData.graph_interpretation || 5,
        userData.calculation_accuracy || 5,
        userData.structured_answer || 5
    ];
    features.economic_skills_composite = Math.round(
        (appliedSkills.reduce((a, b) => a + b, 0) / appliedSkills.length) * 100
    ) / 100;
    
    // ============================================
    // PRACTICE INTENSITY
    // ============================================
    features.practice_intensity = Math.round(
        (exams / 30 * 10 * 0.5 + exercises / 15 * 10 * 0.5) * 100
    ) / 100;
    
    // ============================================
    // STUDY QUALITY
    // ============================================
    features.study_quality = Math.round(
        (consistency * 0.6 + (studyHours / 12 * 10 * 0.4)) * 100
    ) / 100;
    
    // ============================================
    // PSYCHOLOGICAL COMPOSITE
    // ============================================
    features.psychological_composite = Math.round(
        ((confidence + (10 - anxiety) + (10 - stress)) / 3) * 100
    ) / 100;
    
    // ============================================
    // IMBALANCE SCORE
    // ============================================
    const allSkillGroups = [
        features.economics_composite,
        features.management_composite,
        features.economic_skills_composite
    ];
    const mean = allSkillGroups.reduce((a, b) => a + b, 0) / allSkillGroups.length;
    features.imbalance_score = Math.round(
        (allSkillGroups.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allSkillGroups.length) * 100
    ) / 100;
    
    // ============================================
    // MARKET FOCUS
    // ============================================
    const market = userData.market_mechanisms || 5;
    features.market_focus = Math.round(
        (market / (features.economics_composite + 0.1)) * 100
    ) / 100;
    
    // ============================================
    // SITUATION STRENGTH
    // ============================================
    const situation = userData.situation_analysis || 5;
    features.situation_strength = Math.round(
        (situation / (features.economic_skills_composite + 0.1)) * 100
    ) / 100;
    
    
}
// For Law (Droit)
else if (subject === 'droit') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    // Frontend sends: exams_practiced → Backend expects: bac_exams_practiced
    // Frontend sends: essays_per_week → Backend expects: case_exercises
    
    const exams = userData.exams_practiced || 0;
    const cases = userData.essays_per_week || 0;
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    const confidence = userData.reasoning_confidence || 5;
    const anxiety = userData.law_anxiety || 5;
    const stress = userData.exam_stress || 5;
    
    // ============================================
    // LEGAL SKILLS COMPOSITE (MOST IMPORTANT!)
    // ============================================
    const legalSkills = [
        userData.legal_reasoning || 5,
        userData.qualification || 5,
        userData.justification || 5,
        userData.definition_recall || 5
    ];
    features.legal_skills_composite = Math.round(
        (legalSkills.reduce((a, b) => a + b, 0) / legalSkills.length) * 100
    ) / 100;
    
    // ============================================
    // LABOR LAW COMPOSITE
    // ============================================
    const laborSkills = [
        userData.labor_law_individual || 5,
        userData.labor_law_collective || 5
    ];
    features.labor_law_composite = Math.round(
        (laborSkills.reduce((a, b) => a + b, 0) / laborSkills.length) * 100
    ) / 100;
    
    // ============================================
    // PRACTICE INTENSITY
    // ============================================
    features.practice_intensity = Math.round(
        (cases / 15 * 10 * 0.6 + exams / 30 * 10 * 0.4) * 100
    ) / 100;
    
    // ============================================
    // STUDY QUALITY
    // ============================================
    features.study_quality = Math.round(
        (consistency * 0.6 + (studyHours / 12 * 10 * 0.4)) * 100
    ) / 100;
    
    // ============================================
    // PSYCHOLOGICAL COMPOSITE
    // ============================================
    features.psychological_composite = Math.round(
        ((confidence + (10 - anxiety) + (10 - stress)) / 3) * 100
    ) / 100;
    
    // ============================================
    // OVERALL LAW SCORE
    // ============================================
    const lawBlocks = [
        userData.company_law || 5,
        userData.labor_law_individual || 5,
        userData.labor_law_collective || 5,
        userData.public_finance || 5
    ];
    features.overall_law_score = Math.round(
        (lawBlocks.reduce((a, b) => a + b, 0) / lawBlocks.length) * 100
    ) / 100;
    
    // ============================================
    // IMBALANCE SCORE
    // ============================================
    const avg = lawBlocks.reduce((a, b) => a + b, 0) / lawBlocks.length;
    features.imbalance_score = Math.round(
        (lawBlocks.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / lawBlocks.length) * 100
    ) / 100;
    
    // ============================================
    // REASONING FOCUS
    // ============================================
    const reasoning = userData.legal_reasoning || 5;
    features.reasoning_focus = Math.round(
        (reasoning / (features.legal_skills_composite + 0.1)) * 100
    ) / 100;
    
   
}
// For History & Geography (His_Geo)
else if (subject === 'his_geo') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    const memorization = userData.memorization_frequency || 5;
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    const exams = userData.exams_practiced || 0;
    const stress = userData.stress_level || 5;
    const confidence = userData.confidence_level || 5;
    const interest = userData.interest_in_subject || 5;
    
    // ============================================
    // MEMORY COMPOSITE
    // ============================================
    const memorySkills = [
        userData.historical_memory || 5,
        userData.dates_memory || 5,
        userData.figures_memory || 5,
        userData.geography_knowledge || 5
    ];
    features.memory_composite = Math.round(
        (memorySkills.reduce((a, b) => a + b, 0) / memorySkills.length) * 100
    ) / 100;
    
    // ============================================
    // METHODOLOGY COMPOSITE (MOST IMPORTANT!)
    // ============================================
    const methodSkills = [
        userData.document_analysis_method || 5,
        userData.essay_method || 5,
        userData.map_stats_method || 5,
        userData.argumentation_skill || 5
    ];
    features.methodology_composite = Math.round(
        (methodSkills.reduce((a, b) => a + b, 0) / methodSkills.length) * 100
    ) / 100;
    
    // ============================================
    // KNOWLEDGE COMPOSITE
    // ============================================
    const knowledgeSkills = [
        userData.cold_war_knowledge || 5,
        userData.decolonization_knowledge || 5,
        userData.algeria_history_knowledge || 5,
        userData.economic_powers_knowledge || 5,
        userData.development_knowledge || 5
    ];
    features.knowledge_composite = Math.round(
        (knowledgeSkills.reduce((a, b) => a + b, 0) / knowledgeSkills.length) * 100
    ) / 100;
    
    // ============================================
    // STUDY QUALITY
    // ============================================
    features.study_quality = Math.round(
        (memorization * 0.6 + consistency * 0.4) * 100
    ) / 100;
    
    // ============================================
    // HG IMBALANCE (Memory vs Methodology)
    // ============================================
    features.hg_imbalance = Math.round(
        Math.abs(features.memory_composite - features.methodology_composite) * 100
    ) / 100;
    
   
}
// For Islamic Sciences (Islamia)
else if (subject === 'islamia') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    const quran_ex = userData.quran_exercises || 0;
    const hadith_ex = userData.hadith_exercises || 0;
    const fiqh_cases = userData.fiqh_cases || 0;
    const past_exams = userData.exams_practiced || 0;  // ← CHANGED: was past_exams, now exams_practiced
    const confidence = userData.confidence || 5;
    const stress = userData.stress_level || 5;
    
    // ============================================
    // QURAN COMPOSITE
    // ============================================
    const quranSkills = [
        userData.quran_recitation || 5,
        userData.tafsir_understanding || 5,
        userData.reasoning_from_verses || 5
    ];
    features.quran_composite = Math.round(
        (quranSkills.reduce((a, b) => a + b, 0) / quranSkills.length) * 100
    ) / 100;
    
    // ============================================
    // HADITH COMPOSITE
    // ============================================
    const hadithSkills = [
        userData.hadith_comprehension || 5,
        userData.hadith_analysis || 5,
        userData.moral_extraction || 5
    ];
    features.hadith_composite = Math.round(
        (hadithSkills.reduce((a, b) => a + b, 0) / hadithSkills.length) * 100
    ) / 100;
    
    // ============================================
    // FIQH COMPOSITE
    // ============================================
    const fiqhSkills = [
        userData.fiqh_ibadah || 5,
        userData.fiqh_muamalat || 5,
        userData.riba_understanding || 5
    ];
    features.fiqh_composite = Math.round(
        (fiqhSkills.reduce((a, b) => a + b, 0) / fiqhSkills.length) * 100
    ) / 100;
    
    // ============================================
    // ANALYSIS COMPOSITE (MOST IMPORTANT!)
    // ============================================
    const analysisSkills = [
        userData.ayah_analysis || 5,
        userData.hadith_text_analysis || 5,
        userData.document_analysis || 5
    ];
    features.analysis_composite = Math.round(
        (analysisSkills.reduce((a, b) => a + b, 0) / analysisSkills.length) * 100
    ) / 100;
    
    // ============================================
    // METHODOLOGY COMPOSITE
    // ============================================
    const methodSkills = [
        userData.definition_accuracy || 5,
        userData.explanation_clarity || 5,
        userData.evidence_usage || 5,
        userData.structured_answer || 5
    ];
    features.methodology_composite = Math.round(
        (methodSkills.reduce((a, b) => a + b, 0) / methodSkills.length) * 100
    ) / 100;
    
    // ============================================
    // PRACTICE INTENSITY (LOW IMPACT)
    // ============================================
    features.practice_intensity = Math.round(
        ((quran_ex + hadith_ex + fiqh_cases + past_exams) / 40 * 10) * 100
    ) / 100;
    
    // ============================================
    // OVERALL ISLAMIA SCORE
    // ============================================
    features.overall_islamia = Math.round(
        ((features.analysis_composite + features.methodology_composite + 
          features.quran_composite + features.hadith_composite + features.fiqh_composite) / 5) * 100
    ) / 100;
    
   
}
// For Philosophy
else if (subject === 'philo') {
    // ============================================
    // MAP FRONTEND FIELD NAMES
    // ============================================
    const essays = userData.essays_per_week || 0;
    const texts = userData.texts_analyzed || 0;
    const exams = userData.exams_practiced || 0;
    const consistency = userData.consistency || 5;
    const studyHours = userData.study_hours || 5;
    const confidence = userData.confidence || 5;
    const stress = userData.stress || 5;
    const interest = userData.interest || 5;
    const philoAnxiety = userData.philo_anxiety || 5;
    const writingConf = userData.writing_confidence || 5;
    
    // ============================================
    // ANALYSIS COMPOSITE
    // ============================================
    const analysisSkills = [
        userData.text_analysis || 5,
        userData.argument_identification || 5,
        userData.concept_comprehension || 5
    ];
    features.analysis_composite = Math.round(
        (analysisSkills.reduce((a, b) => a + b, 0) / analysisSkills.length) * 100
    ) / 100;
    
    // ============================================
    // ARGUMENTATION COMPOSITE
    // ============================================
    const argSkills = [
        userData.comparison_skill || 5,
        userData.synthesis_skill || 5,
        userData.critical_thinking || 5,
        userData.philosophical_reasoning || 5
    ];
    features.argumentation_composite = Math.round(
        (argSkills.reduce((a, b) => a + b, 0) / argSkills.length) * 100
    ) / 100;
    
    // ============================================
    // WRITING COMPOSITE
    // ============================================
    const writingSkills = [
        userData.essay_structure || 5,
        userData.clarity_expression || 5,
        userData.conclusion_skill || 5
    ];
    features.writing_composite = Math.round(
        (writingSkills.reduce((a, b) => a + b, 0) / writingSkills.length) * 100
    ) / 100;
    
    // ============================================
    // REASONING COMPOSITE
    // ============================================
    const reasoningSkills = [
        userData.problematization || 5,
        userData.thesis_defense || 5,
        userData.conceptual_analysis || 5,
        userData.logic_consistency || 5,
        userData.nuance_handling || 5
    ];
    features.reasoning_composite = Math.round(
        (reasoningSkills.reduce((a, b) => a + b, 0) / reasoningSkills.length) * 100
    ) / 100;
    
    // ============================================
    // PRACTICE INTENSITY
    // ============================================
    features.practice_intensity = Math.round(
        (essays / 10 * 10 * 0.4 + texts / 15 * 10 * 0.3 + exams / 10 * 10 * 0.3) * 100
    ) / 100;
    
    // ============================================
    // STUDY QUALITY
    // ============================================
    features.study_quality = Math.round(
        (consistency * 0.5 + (studyHours / 12 * 10 * 0.5)) * 100
    ) / 100;
    
    // ============================================
    // PSYCHOLOGICAL COMPOSITE
    // ============================================
    features.psychological_composite = Math.round(
        ((confidence + writingConf + (10 - philoAnxiety) + (10 - stress)) / 4) * 100
    ) / 100;
    
    // ============================================
    // OVERALL PHILOSOPHY SCORE
    // ============================================
    features.overall_philosophy_score = Math.round(
        ((features.analysis_composite + features.argumentation_composite + 
          features.writing_composite + features.reasoning_composite) / 4) * 100
    ) / 100;
    
    // ============================================
    // IMBALANCE SCORE
    // ============================================
    const allSkills = [
        features.analysis_composite,
        features.argumentation_composite,
        features.writing_composite,
        features.reasoning_composite
    ];
    const mean = allSkills.reduce((a, b) => a + b, 0) / allSkills.length;
    features.imbalance_score = Math.round(
        (allSkills.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allSkills.length) * 100
    ) / 100;
    
    console.log(`📊 Philosophy derived features:`, features);
}

        
        return features;
    }

    analyzeWeaknesses(userData, subject = 'arabic') {
        const config = this.subjectConfigs[subject] || this.subjectConfigs.arabic;
        const skillTargets = config.skillTargets;
        const skillNames = config.skillNames;

        const skillGaps = {};
        for (const [skill, target] of Object.entries(skillTargets)) {
            if (userData[skill] !== undefined) {
                const gap = target - userData[skill];
                if (gap > 0) {
                    skillGaps[skill] = Math.round(gap * 10) / 10;
                }
            }
        }

        const habitTargets = {
            exams_practiced: 10,
            consistency: 4,
            study_hours: 6,
            essays_per_week: 3,
            confidence: 4,
            participation: 4
        };

        const habitGaps = {};
        for (const [habit, target] of Object.entries(habitTargets)) {
            if (userData[habit] !== undefined) {
                const gap = target - userData[habit];
                if (gap > 0) {
                    habitGaps[habit] = Math.round(gap * 10) / 10;
                }
            }
        }

        const sortedSkills = Object.entries(skillGaps).sort((a, b) => b[1] - a[1]);
        const sortedHabits = Object.entries(habitGaps).sort((a, b) => b[1] - a[1]);

        const totalGap = Object.values(skillGaps).reduce((a, b) => a + b, 0) + 
                        Object.values(habitGaps).reduce((a, b) => a + b, 0);
        const maxPossibleGap = 30;
        const weaknessScore = Math.min(100, Math.round((totalGap / maxPossibleGap) * 100));

        const strengths = [];
        for (const [skill, target] of Object.entries(skillTargets)) {
            if (userData[skill] !== undefined && userData[skill] >= target) {
                strengths.push({
                    skill: skill,
                    value: Math.round(userData[skill] * 10) / 10,
                    excess: Math.round((userData[skill] - target) * 10) / 10
                });
            }
        }
        strengths.sort((a, b) => b.excess - a.excess);

        const recommendations = this.generateRecommendations(subject, sortedSkills, sortedHabits, userData.stress);

        return {
            weakness_score: weaknessScore,
            skill_weaknesses: sortedSkills.map(([skill, gap]) => ({
                skill: skill,
                current: userData[skill],
                target: skillTargets[skill],
                gap: gap,
                name: skillNames[skill] || skill
            })),
            habit_weaknesses: sortedHabits.map(([habit, gap]) => ({
                habit: habit,
                current: userData[habit],
                target: habitTargets[habit],
                gap: gap
            })),
            strengths: strengths.slice(0, 3),
            stress_high: (userData.stress || 3) >= 4,
            recommendations: recommendations
        };
    }

    generateRecommendations(subject, skillWeaknesses, habitWeaknesses, stress) {
        const recs = [];

        let skillAdvice = {};
        let habitAdvice = {};

        if (subject === 'french') {
            skillAdvice = {
                comprehension_textuelle: '📖 Lisez des articles variés et résumez l\'idée principale',
                inference: '🎯 Entraînez-vous à lire entre les lignes et à déduire des informations implicites',
                true_false_justification: '✓✗ Pratiquez les exercices Vrai/Faux en justifiant chaque réponse',
                communicative_intent: '💬 Identifiez pourquoi l\'auteur a écrit le texte (informer, dénoncer, alerter)',
                thesis_identification: '🎓 Repérez la position de l\'auteur dès la première lecture',
                argument_identification: '📝 Listez les arguments pour et contre dans les textes argumentatifs',
                concession_opposition: '🔄 Repérez les connecteurs comme "cependant", "néanmoins", "en revanche"',
                essay_structure: '📋 Structurez toujours votre dissertation: introduction, développement, conclusion',
                language_accuracy: '📖 Révisez les règles de grammaire et d\'orthographe de base',
                historical_text: '🏛️ Familiarisez-vous avec les dates et événements clés de l\'histoire',
                argumentative_text: '💪 Analysez des éditoriaux et des débats télévisés'
            };

            habitAdvice = {
                exams_practiced: '📚 Résolvez un examen BAC complet chaque semaine',
                consistency: '📅 Établissez un planning de révision régulier',
                study_hours: '⏰ Augmentez vos heures d\'étude à 2-3 heures par jour',
                essays_per_week: '✍️ Écrivez au moins une dissertation par semaine',
                confidence: '💪 Commencez par des exercices faciles pour gagner en confiance',
                participation: '🗣️ Participez activement en classe pour renforcer votre compréhension'
            };
        } else if (subject === 'english') {
            skillAdvice = {
                main_idea_detection: '📖 Read articles daily and practice identifying the main idea',
                inference_skill: '🎯 Practice reading between the lines and making logical deductions',
                transformation_skill: '✍️ Practice sentence transformations daily',
                conditional_mastery: '📚 Review conditionals (Type 0,1,2,3) and practice',
                tense_control: '⏰ Practice mixed tenses exercises regularly',
                vocabulary_richness: '📖 Learn 5-10 new words daily and review weekly',
                essay_structure: '📋 Always structure your essays: introduction, body, conclusion',
                coherence_score: '🔗 Use logical connectors and ensure smooth flow',
                cohesion_score: '🔗 Use linking words: however, therefore, moreover, etc.',
                writing_grammar: '📖 Review grammar rules before writing'
            };

            habitAdvice = {
                reading_frequency: '📖 Read English articles for 30 minutes daily',
                writing_frequency: '✍️ Write one essay per week',
                past_exam_practice: '📚 Solve one past BAC exam every week',
                study_hours: '⏰ Study English for at least 1 hour daily',
                consistency: '📅 Maintain a consistent study schedule',
                confidence: '💪 Start with easy exercises to build confidence',
                class_participation: '🗣️ Participate actively in class'
            };
        } else {
            skillAdvice = {
                poetry: '📖 تحليل الشعر: اقرأ قصيدة يومياً وحاول تحديد الصور البيانية والأفكار الرئيسية',
                rhetoric: '🎭 البلاغة: ركز على الاستعارات والتشبيهات والكنايات في النصوص',
                grammar: '📚 القواعد: خصص 30 دقيقة يومياً لمراجعة النحو والصرف',
                prose: '📖 تحليل النثر: اقرأ نصوصاً نثرية متنوعة وحلل تركيبها',
                essay: '✍️ التعبير الكتابي: اكتب مقالاً كل أسبوع واطلب تصحيحه',
                comprehension: '📖 الفهم والاستيعاب: اقرأ يومياً وحل أسئلة الفهم'
            };

            habitAdvice = {
                exams_practiced: '📝 حل امتحان بكالوريا كل أسبوع للتعود على نمط الأسئلة',
                consistency: '📅 نظم وقتك وذاكر ساعة يومياً بدلاً من المذاكرة المكثفة',
                study_hours: '⏰ زد ساعات دراستك الأسبوعية إلى 6-8 ساعات',
                essays_per_week: '✍️ اكتب مقالين على الأقل كل أسبوع',
                confidence: '💪 ابدأ بحل تمارين سهلة ثم انتقل إلى الصعبة',
                participation: '🗣️ شارك في القسم واطرح أسئلة لتعزيز فهمك'
            };
        }

        for (const [skill] of skillWeaknesses.slice(0, 3)) {
            if (skillAdvice[skill]) {
                recs.push(skillAdvice[skill]);
            }
        }

        for (const [habit] of habitWeaknesses.slice(0, 3)) {
            if (habitAdvice[habit]) {
                recs.push(habitAdvice[habit]);
            }
        }

        if (stress >= 4) {
            if (subject === 'french') {
                recs.push('🧘 Pratiquez des exercices de respiration profonde et organisez votre temps');
            } else if (subject === 'english') {
                recs.push('🧘 Practice deep breathing exercises and organize your study time');
            } else {
                recs.push('🧘 مارس تمارين التنفس العميق وأخذ فترات راحة منتظمة لتقليل التوتر');
            }
        }

        if (recs.length === 0) {
            if (subject === 'french') {
                recs.push('🎉 Excellent! Continuez sur cette lancée et maintenez votre niveau');
            } else if (subject === 'english') {
                recs.push('🎉 Excellent! Keep up the good work and maintain your level');
            } else {
                recs.push('🎉 ممتاز! استمر على هذا المنوال وركز على الحفاظ على مستواك');
            }
        }

        return recs;
    }
}

module.exports = new BacYearService();