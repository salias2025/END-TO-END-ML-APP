// src/components/post_bac/inputForm.jsx
import React, { useState, useEffect } from 'react';

// ============================================
// GET USER FROM LOCALSTORAGE
// ============================================
const getUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user;
    } catch {
        return null;
    }
};

// ============================================
// FILIERE DISPLAY NAMES
// ============================================
const FILIERE_DISPLAY = {
    'sciences_experimentales': 'Sciences',
    'maths': 'Maths',
    'techniques_maths': 'Technique Mathématique',
    'gestion_economie': 'Gestion',
    'langues_etrangeres': 'Langues',
    'lettres_philosophie': 'Lettres'
};

const InputForm = ({ onSubmit }) => {
    // ============================================
    // GET USER FILIERE FROM LOCALSTORAGE
    // ============================================
    const user = getUser();
    const userFiliere = user?.filiere || 'sciences_experimentales';
    const filiereDisplay = FILIERE_DISPLAY[userFiliere] || 'Sciences';

    // ============================================
    // DATA (Coefficients & Subjects)
    // ============================================
    
    const COEFFS_PAR_FILIERE = {
        'Sciences': {
            science_grade: 6, physique_grade: 5, maths_grade: 5,
            arabe_grade: 3, islamia_grade: 2, his_geo_grade: 2,
            francais_grade: 2, anglais_grade: 2, philo_grade: 2,
            tamazight_grade: 2
        },
        'Maths': {
            maths_grade: 7, physique_grade: 6, science_grade: 2,
            arabe_grade: 3, islamia_grade: 2, his_geo_grade: 2,
            francais_grade: 2, anglais_grade: 2, philo_grade: 2,
            tamazight_grade: 2
        },
        'Technique Mathématique': {
            techno_grade: 6, maths_grade: 6, physique_grade: 5,
            arabe_grade: 3, islamia_grade: 2, his_geo_grade: 2,
            francais_grade: 2, anglais_grade: 2, philo_grade: 2,
            tamazight_grade: 2
        },
        'Gestion': {
            gestion_grade: 6, economie_grade: 5, maths_grade: 5,
            arabe_grade: 3, his_geo_grade: 4, islamia_grade: 2,
            francais_grade: 2, anglais_grade: 2, philo_grade: 2,
            loi_grade: 2, tamazight_grade: 2
        },
        'Langues': {
            langue_etranger_grade: 5, arabe_grade: 5,
            anglais_grade: 4, francais_grade: 4,
            maths_grade: 2, his_geo_grade: 2, philo_grade: 2,
            islamia_grade: 2, tamazight_grade: 2
        },
        'Lettres': {
            philo_grade: 6, arabe_grade: 6, his_geo_grade: 4,
            francais_grade: 3, anglais_grade: 3,
            islamia_grade: 2, maths_grade: 2, tamazight_grade: 2
        }
    };

    const MATIERES_PAR_FILIERE = {
        'Maths': ['maths_grade', 'physique_grade', 'science_grade', 'arabe_grade', 'francais_grade', 'anglais_grade', 'tamazight_grade', 'his_geo_grade', 'islamia_grade', 'philo_grade'],
        'Sciences': ['maths_grade', 'physique_grade', 'science_grade', 'arabe_grade', 'francais_grade', 'anglais_grade', 'tamazight_grade', 'his_geo_grade', 'islamia_grade', 'philo_grade'],
        'Technique Mathématique': ['maths_grade', 'physique_grade', 'techno_grade', 'arabe_grade', 'francais_grade', 'anglais_grade', 'tamazight_grade', 'his_geo_grade', 'islamia_grade', 'philo_grade'],
        'Gestion': ['maths_grade', 'gestion_grade', 'economie_grade', 'loi_grade', 'arabe_grade', 'francais_grade', 'anglais_grade', 'tamazight_grade', 'his_geo_grade', 'islamia_grade', 'philo_grade'],
        'Langues': ['langue_etranger_grade', 'anglais_grade', 'francais_grade', 'maths_grade', 'arabe_grade', 'tamazight_grade', 'his_geo_grade', 'islamia_grade', 'philo_grade'],
        'Lettres': ['arabe_grade', 'philo_grade', 'his_geo_grade', 'maths_grade', 'francais_grade', 'anglais_grade', 'tamazight_grade', 'islamia_grade']
    };

    const NOMS_AFFICHES = {
        'maths_grade': '📐 رياضيات', 'physique_grade': '⚡ فيزياء', 'science_grade': '🔬 علوم طبيعية',
        'techno_grade': '⚙️ تكنولوجيا', 'gestion_grade': '📊 تسيير', 'economie_grade': '💰 اقتصاد',
        'loi_grade': '⚖️ قانون', 'arabe_grade': '📖 لغة عربية', 'francais_grade': '📖 لغة فرنسية',
        'anglais_grade': '📖 لغة إنجليزية', 'tamazight_grade': '📖 أمازيغية', 'langue_etranger_grade': '🌍 لغة أجنبية',
        'his_geo_grade': '🗺️ تاريخ وجغرافيا', 'islamia_grade': '🕌 تربية إسلامية', 'philo_grade': '💭 فلسفة'
    };

    const WILAYAS = [
        'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
        'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
        'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
        'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
        'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
        'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
        'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
        'إن صالح', 'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
    ];

    // ============================================
    // STATE
    // ============================================
    
    const [filiere] = useState(filiereDisplay); // ← NO DROPDOWN, read from localStorage
    const [notes, setNotes] = useState({});
    const [bacAvg, setBacAvg] = useState(0);
    const [softSkills, setSoftSkills] = useState({
        stress: 3,
        competitiveness: 3,
        consistency: 3
    });
    const [wilaya, setWilaya] = useState(15);
    const [orientation, setOrientation] = useState('Recherche');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // ============================================
    // CALCULATE BAC AVERAGE
    // ============================================
    
    const calculateBacAvg = (notesData, filiereValue) => {
        const coeffs = COEFFS_PAR_FILIERE[filiereValue];
        let totalPoints = 0;
        let totalCoeffs = 0;
        
        for (const [matiere, coeff] of Object.entries(coeffs)) {
            const note = notesData[matiere] || 0;
            if (note > 0) {
                totalPoints += note * coeff;
                totalCoeffs += coeff;
            }
        }
        
        return totalCoeffs > 0 ? parseFloat((totalPoints / totalCoeffs).toFixed(1)) : 10.0;
    };

    // ============================================
    // EFFECTS
    // ============================================
    
    useEffect(() => {
        const initialNotes = {};
        const matieres = MATIERES_PAR_FILIERE[filiere];
        matieres.forEach(m => {
            initialNotes[m] = 12.0;
        });
        setNotes(initialNotes);
    }, [filiere]);

    useEffect(() => {
        const avg = calculateBacAvg(notes, filiere);
        setBacAvg(avg);
    }, [notes, filiere]);

    // ============================================
    // HANDLERS
    // ============================================
    
    const handleNoteChange = (matiere, value) => {
        setNotes(prev => ({
            ...prev,
            [matiere]: parseFloat(value)
        }));
    };

    const handleSoftSkillChange = (skill, value) => {
        setSoftSkills(prev => ({
            ...prev,
            [skill]: parseInt(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        
        const studentData = {
            bac_stream: filiere,
            bac_avg: bacAvg,
            wilaya: wilaya,
            ...softSkills,
            career_orientation: orientation,
            ...notes
        };
        
        onSubmit(studentData);
    };

    // ============================================
    // RENDER
    // ============================================
    
    const currentMatieres = MATIERES_PAR_FILIERE[filiere] || [];

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: 'rtl'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
            }}>
                <h1 style={{ margin: 0, fontSize: '32px' }}>🎓 التوجيه بعد البكالوريا</h1>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                    أدخل معلوماتك للحصول على توصيات شخصية
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Filiere - DISPLAY ONLY (NO DROPDOWN!) */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                        🎓 1. شعبة البكالوريا
                    </h3>
                    
                    <div style={{
                        background: 'rgba(102,126,234,0.08)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        border: '2px solid #667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '28px' }}>🎓</span>
                            <div>
                                <div style={{ fontSize: '12px', color: '#888' }}>شعبتك (من ملفك الشخصي)</div>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                                    {filiere}
                                </div>
                            </div>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            color: '#667eea',
                            background: 'rgba(102,126,234,0.15)',
                            padding: '4px 14px',
                            borderRadius: '20px'
                        }}>
                            ✅ تم التحديد تلقائياً
                        </span>
                    </div>
                </div>

                {/* BAC Average Display */}
                <div style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '16px',
                    padding: '20px 25px',
                    marginBottom: '25px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    boxShadow: '0 4px 20px rgba(245, 87, 108, 0.3)'
                }}>
                    <div style={{ color: 'white' }}>
                        <span style={{ fontSize: '14px', opacity: 0.9 }}>📈 معدل البكالوريا المحسوب</span>
                        <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '2px' }}>
                            بناءً على المعاملات الرسمية
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '8px 30px',
                        borderRadius: '12px',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: 'white',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {bacAvg.toFixed(1)} <span style={{ fontSize: '18px' }}>/20</span>
                    </div>
                </div>

                {/* Subjects */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                        📚 2. علامات المواد
                    </h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        {currentMatieres.map((matiere) => (
                            <div key={matiere} style={{
                                background: '#f8f9fa',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                transition: 'all 0.3s',
                                border: '1px solid transparent'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <label style={{
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: '#444'
                                    }}>
                                        {NOMS_AFFICHES[matiere] || matiere}
                                    </label>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: '#667eea',
                                        fontSize: '16px',
                                        minWidth: '40px',
                                        textAlign: 'left'
                                    }}>
                                        {notes[matiere]?.toFixed(1) || '12.0'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="20"
                                    step="0.5"
                                    value={notes[matiere] || 12}
                                    onChange={(e) => handleNoteChange(matiere, e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        WebkitAppearance: 'none'
                                    }}
                                />
                                <style>{`
                                    input[type="range"]::-webkit-slider-thumb {
                                        -webkit-appearance: none;
                                        width: 18px;
                                        height: 18px;
                                        border-radius: 50%;
                                        background: white;
                                        border: 3px solid #667eea;
                                        cursor: pointer;
                                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                                    }
                                    input[type="range"]::-moz-range-thumb {
                                        width: 18px;
                                        height: 18px;
                                        border-radius: 50%;
                                        background: white;
                                        border: 3px solid #667eea;
                                        cursor: pointer;
                                    }
                                `}</style>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Soft Skills */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                        🧠 3. المهارات الشخصية
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { key: 'stress', label: '😰 التوتر', emoji: '😰' },
                            { key: 'competitiveness', label: '🏆 التنافسية', emoji: '🏆' },
                            { key: 'consistency', label: '📅 الاستمرارية', emoji: '📅' }
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ fontWeight: '500', color: '#444' }}>{label}</span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: '#667eea',
                                        fontSize: '18px',
                                        background: '#f0f0ff',
                                        padding: '2px 16px',
                                        borderRadius: '20px'
                                    }}>
                                        {softSkills[key]}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={softSkills[key]}
                                    onChange={(e) => handleSoftSkillChange(key, e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: 'linear-gradient(90deg, #f093fb, #f5576c)',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        WebkitAppearance: 'none'
                                    }}
                                />
                                <style>{`
                                    input[type="range"]::-webkit-slider-thumb {
                                        -webkit-appearance: none;
                                        width: 18px;
                                        height: 18px;
                                        border-radius: 50%;
                                        background: white;
                                        border: 3px solid #f5576c;
                                        cursor: pointer;
                                        box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
                                    }
                                    input[type="range"]::-moz-range-thumb {
                                        width: 18px;
                                        height: 18px;
                                        border-radius: 50%;
                                        background: white;
                                        border: 3px solid #f5576c;
                                        cursor: pointer;
                                    }
                                `}</style>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wilaya & Orientation */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                        📍 4. معلومات إضافية
                    </h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: '#444'
                            }}>
                                📍 الولاية
                            </label>
                            <select
                                value={wilaya}
                                onChange={(e) => setWilaya(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    fontSize: '14px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            >
                                {WILAYAS.map((name, index) => (
                                    <option key={index} value={index + 1}>
                                        {index + 1}. {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label style={{
                                display: 'block',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: '#444'
                            }}>
                                🎯 التوجه المهني
                            </label>
                            <select
                                value={orientation}
                                onChange={(e) => setOrientation(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e0e0e0',
                                    fontSize: '14px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                            >
                                <option value="Recherche">🔬 بحث علمي</option>
                                <option value="Industrie">🏭 صناعة</option>
                                <option value="Enseignement">👨‍🏫 تعليم</option>
                                <option value="Mixte">🔄 مختلط</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '18px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
                    }}
                >
                    🚀 إنشاء التوصيات
                </button>

                {isSubmitted && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: '#e8f5e9',
                        borderRadius: '12px',
                        textAlign: 'center',
                        color: '#2e7d32',
                        fontWeight: '500'
                    }}>
                        ✅ تم حفظ البيانات بنجاح!
                    </div>
                )}
            </form>
        </div>
    );
};

export default InputForm;