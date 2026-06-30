// frontend/src/components/pre_bac/input_form.jsx

import React, { useState } from 'react';

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
    'sciences_experimentales': 'العلوم التجريبية',
    'maths': 'الرياضيات',
    'techniques_maths': 'تقني رياضي',
    'gestion_economie': 'تسيير واقتصاد',
    'langues_etrangeres': 'لغات أجنبية',
    'lettres_philosophie': 'آداب وفلسفة'
};

export default function InputForm({ onFormSubmit }) {
    const [step, setStep] = useState(1);
    const totalSteps = 6;

    // Get user from localStorage
    const user = getUser();
    const userFiliere = user?.filiere || 'sciences_experimentales';
    const filiereDisplay = FILIERE_DISPLAY[userFiliere] || userFiliere;

    // Form data state
    const [formData, setFormData] = useState({
        filiere: userFiliere,  // ← Set from localStorage, not dropdown!
        region: 'الجزائر',
        is_repeater: 0,
        reason_for_choice: 'اهتمام شخصي',
        
        // Brevet (BEM) - 6 subjects (including Hfada)
        brevet_math: 12,
        brevet_physics: 12,
        brevet_science: 12,
        brevet_arabic: 12,
        brevet_langues: 12,
        brevet_hfada: 12,
        
        // 1AS - 6 subjects (including Hfada)
        as1_math: 11,
        as1_physics: 11,
        as1_science: 11,
        as1_arabic: 11,
        as1_langues: 11,
        as1_hfada: 11,
        
        // 2AS - 6 subjects (including Hfada)
        as2_math: 11,
        as2_physics: 11,
        as2_science: 11,
        as2_arabic: 11,
        as2_langues: 11,
        as2_hfada: 11,
        
        weekly_study_hours: 15,
        time_essential_subjects: 10,     
        time_non_essential_subjects: 5,  
        study_consistency: 0.7,
        sleep_hours: 7,
        stress_level: 3,
        exam_anxiety: 3,
        family_support_score: 3,
        private_tutoring_hours: 0,
        learning_style: 'visual',
        comprehension_speed: 3,
        focus_level: 3,
        health_state: 4,
    });

    const regionOptions = ['الجزائر', 'وهران', 'قسنطينة', 'عنابة', 'سطيف', 'تيزي وزو', 'البليدة', 'بجاية', 'تلمسان', 'أخرى'];
    const reasonOptions = ['اهتمام شخصي', 'اختيار الوالدين', 'تأثير الأصدقاء', 'ضغط العلامات', 'توجيه مدرسي'];
    const tutoringOptions = ['لا', 'نعم (2-4 ساعة/أسبوع)', 'نعم (5-8 ساعة/أسبوع)', 'نعم (8+ ساعة/أسبوع)'];

    // Calculate averages
    const calculateAverages = (data) => {
        const brevetAvg = (data.brevet_math + data.brevet_physics + data.brevet_science +
            data.brevet_arabic + data.brevet_langues + data.brevet_hfada) / 6;
        
        const as1Avg = (data.as1_math + data.as1_physics + data.as1_science +
            data.as1_arabic + data.as1_langues + data.as1_hfada) / 6;
        
        const as2Avg = (data.as2_math + data.as2_physics + data.as2_science +
            data.as2_arabic + data.as2_langues + data.as2_hfada) / 6;
        
        return {
            brevet_avg: brevetAvg,
            as1_avg_global: as1Avg,
            as2_avg_global: as2Avg
        };
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            const averages = calculateAverages(newData);
            return { ...newData, ...averages };
        });
    };

    const handleNext = () => {
        if (step < totalSteps) {
            const averages = calculateAverages(formData);
            setFormData(prev => ({ ...prev, ...averages }));
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        const averages = calculateAverages(formData);
        const finalData = { ...formData, ...averages };
        if (onFormSubmit) {
            onFormSubmit(finalData);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            case 4: return renderStep4();
            case 5: return renderStep5();
            case 6: return renderStep6();
            default: return null;
        }
    };

    const renderStep1 = () => (
        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ color: '#333' }}>📋 المعلومات الأساسية</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* ✅ Filiere - DISPLAY ONLY (NO DROPDOWN) */}
                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>📚 الشعبة:</label>
                    <div style={{
                        background: 'rgba(102,126,234,0.1)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #667eea',
                        color: '#333',
                        fontWeight: '500',
                        fontSize: '16px',
                        marginTop: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>🎓</span>
                        <span>{filiereDisplay}</span>
                        <span style={{
                            fontSize: '12px',
                            color: '#667eea',
                            background: 'rgba(102,126,234,0.15)',
                            padding: '2px 10px',
                            borderRadius: '12px'
                        }}>
                            من ملفك الشخصي
                        </span>
                    </div>
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>📍 الولاية:</label>
                    <select
                        value={formData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', color: '#333', background: 'white' }}
                    >
                        {regionOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>🔄 هل أنت مكرر؟</label>
                    <select
                        value={formData.is_repeater}
                        onChange={(e) => handleInputChange('is_repeater', parseInt(e.target.value))}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', color: '#333', background: 'white' }}
                    >
                        <option value={0}>لا</option>
                        <option value={1}>نعم</option>
                    </select>
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>💭 لماذا اخترت هذه الشعبة؟</label>
                    <select
                        value={formData.reason_for_choice}
                        onChange={(e) => handleInputChange('reason_for_choice', e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', color: '#333', background: 'white' }}
                    >
                        {reasonOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ color: '#333' }}>📖 علامات البريفيه (شهادة التعليم المتوسط)</h3>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>⚠️ الحد الأدنى للنجاح هو 8/20</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['brevet_math', 'brevet_physics', 'brevet_science', 'brevet_arabic', 'brevet_langues', 'brevet_hfada'].map((field) => {
                    const labels = {
                        brevet_math: '🧮 رياضيات',
                        brevet_physics: '⚡ فيزياء',
                        brevet_science: '🔬 علوم',
                        brevet_arabic: '📖 لغة عربية',
                        brevet_langues: '🌍 لغات أجنبية',
                        brevet_hfada: '🕌 مواد الحفظ (إسلامية + تاريخ وجغرافيا)'
                    };
                    return (
                        <div key={field}>
                            <label style={{ color: '#333', fontWeight: '500' }}>{labels[field]}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="range"
                                    min="8"
                                    max="20"
                                    step="0.5"
                                    value={formData[field]}
                                    onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ fontWeight: 'bold', minWidth: '50px', color: '#333' }}>{formData[field]}/20</span>
                            </div>
                        </div>
                    );
                })}
                <div style={{ background: '#e8f4f8', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <strong style={{ color: '#333' }}>📊 متوسط البريفيه: {formData.brevet_avg.toFixed(1)}/20</strong>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ color: '#333' }}>📘 علامات السنة الأولى ثانوي (1AS)</h3>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>📊 المقياس: 8 (راسب) إلى 20 (ممتاز)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['as1_math', 'as1_physics', 'as1_science', 'as1_arabic', 'as1_langues', 'as1_hfada'].map((field) => {
                    const labels = {
                        as1_math: '🧮 رياضيات',
                        as1_physics: '⚡ فيزياء',
                        as1_science: '🔬 علوم',
                        as1_arabic: '📖 لغة عربية',
                        as1_langues: '🌍 لغات أجنبية',
                        as1_hfada: '🕌 مواد الحفظ (إسلامية + تاريخ وجغرافيا)'
                    };
                    return (
                        <div key={field}>
                            <label style={{ color: '#333', fontWeight: '500' }}>{labels[field]}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="range"
                                    min="8"
                                    max="20"
                                    step="0.5"
                                    value={formData[field]}
                                    onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ fontWeight: 'bold', minWidth: '50px', color: '#333' }}>{formData[field]}/20</span>
                            </div>
                        </div>
                    );
                })}
                <div style={{ background: '#e8f4f8', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <strong style={{ color: '#333' }}>📊 متوسط السنة الأولى: {formData.as1_avg_global.toFixed(1)}/20</strong>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ color: '#333' }}>⭐ علامات السنة الثانية ثانوي (2AS) - الأهم!</h3>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>⭐ هذه العلامات هي أفضل مؤشر لنتائج البكالوريا!</p>
            <p style={{ color: '#666', fontSize: '14px' }}>📊 المقياس: 8 (راسب) إلى 20 (ممتاز)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['as2_math', 'as2_physics', 'as2_science', 'as2_arabic', 'as2_langues', 'as2_hfada'].map((field) => {
                    const labels = {
                        as2_math: '🧮 رياضيات',
                        as2_physics: '⚡ فيزياء',
                        as2_science: '🔬 علوم',
                        as2_arabic: '📖 لغة عربية',
                        as2_langues: '🌍 لغات أجنبية',
                        as2_hfada: '🕌 مواد الحفظ (إسلامية + تاريخ وجغرافيا)'
                    };
                    return (
                        <div key={field}>
                            <label style={{ color: '#333', fontWeight: '500' }}>{labels[field]}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="range"
                                    min="8"
                                    max="20"
                                    step="0.5"
                                    value={formData[field]}
                                    onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ fontWeight: 'bold', minWidth: '50px', color: '#333' }}>{formData[field]}/20</span>
                            </div>
                        </div>
                    );
                })}
                <div style={{ background: '#e8f4f8', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                    <strong style={{ color: '#333' }}>📊 متوسط السنة الثانية: {formData.as2_avg_global.toFixed(1)}/20</strong>
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
            <h3 style={{ color: '#333' }}>💪 عادات الدراسة ونمط الحياة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>⏰ ساعات الدراسة أسبوعياً: <strong style={{ color: '#667eea' }}>{formData.weekly_study_hours} ساعة</strong></label>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={formData.weekly_study_hours}
                        onChange={(e) => handleInputChange('weekly_study_hours', parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* ✅ Time Allocation - مواد أساسية vs مواد ثانوية */}
                <div >
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>⏰ توزيع وقت الدراسة</h4>
                    
                    <div>
                        <label style={{ color: '#333', fontWeight: '500' }}>
                            📌 مواد أساسية (ساعات/أسبوع): 
                            <strong style={{ color: '#667eea' }}>{formData.time_essential_subjects} ساعة</strong>
                        </label>
                        <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 5px 0' }}>
                            المواد التي تجد صعوبة فيها (رياضيات، فيزياء، علوم، إلخ)
                        </p>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            value={formData.time_essential_subjects}
                            onChange={(e) => handleInputChange('time_essential_subjects', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label style={{ color: '#333', fontWeight: '500' }}>
                            📌 مواد ثانوية (ساعات/أسبوع): 
                            <strong style={{ color: '#667eea' }}>{formData.time_non_essential_subjects} ساعة</strong>
                        </label>
                        <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 5px 0' }}>
                            المواد التي تجد سهولة فيها (عربية، لغات، إسلامية، إلخ)
                        </p>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            value={formData.time_non_essential_subjects}
                            onChange={(e) => handleInputChange('time_non_essential_subjects', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>📅 انتظام الدراسة (0.1=غير منتظم، 1=منتظم جداً): <strong style={{ color: '#667eea' }}>{formData.study_consistency}</strong></label>
                    <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={formData.study_consistency}
                        onChange={(e) => handleInputChange('study_consistency', parseFloat(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>😴 ساعات النوم ليلاً: <strong style={{ color: '#667eea' }}>{formData.sleep_hours} ساعات</strong></label>
                    <input
                        type="range"
                        min="4"
                        max="9"
                        value={formData.sleep_hours}
                        onChange={(e) => handleInputChange('sleep_hours', parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>😰 مستوى التوتر (1=منخفض، 5=مرتفع): <strong style={{ color: '#667eea' }}>{formData.stress_level}/5</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.stress_level}
                        onChange={(e) => handleInputChange('stress_level', parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>😟 قلق الامتحان (1=هادئ، 5=قلق جداً): <strong style={{ color: '#667eea' }}>{formData.exam_anxiety}/5</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.exam_anxiety}
                        onChange={(e) => handleInputChange('exam_anxiety', parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>👨‍👩‍👧 دعم العائلة (1=ضعيف، 5=قوي): <strong style={{ color: '#667eea' }}>{formData.family_support_score}/5</strong></label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.family_support_score}
                        onChange={(e) => handleInputChange('family_support_score', parseInt(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ color: '#333', fontWeight: '500' }}>📚 دروس خصوصية:</label>
                    <select
                        value={formData.private_tutoring_hours === 0 ? 'لا' : 
                               formData.private_tutoring_hours <= 4 ? 'نعم (2-4 ساعة/أسبوع)' :
                               formData.private_tutoring_hours <= 8 ? 'نعم (5-8 ساعة/أسبوع)' : 'نعم (8+ ساعة/أسبوع)'}
                        onChange={(e) => {
                            const val = e.target.value;
                            const hours = val === 'لا' ? 0 : 
                                         val === 'نعم (2-4 ساعة/أسبوع)' ? 3 :
                                         val === 'نعم (5-8 ساعة/أسبوع)' ? 6 : 10;
                            handleInputChange('private_tutoring_hours', hours);
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px', color: '#333', background: 'white' }}
                    >
                        {tutoringOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep6 = () => {
        const averages = calculateAverages(formData);
        const displayData = { ...formData, ...averages };
        
        return (
            <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '20px', margin: '15px 0', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#333' }}>✅ مراجعة معلوماتك</h3>
                <div style={{ marginTop: '15px', color: '#333' }}>
                    <h4 style={{ color: '#333' }}>📋 المعلومات الأساسية:</h4>
                    <p>الشعبة: <strong style={{ color: '#667eea' }}>{filiereDisplay}</strong></p>
                    <p>الولاية: <strong style={{ color: '#667eea' }}>{displayData.region}</strong></p>
                    <p>مكرر: <strong style={{ color: '#667eea' }}>{displayData.is_repeater ? 'نعم' : 'لا'}</strong></p>
                    
                    <h4 style={{ color: '#333' }}>📊 متوسط البريفيه: <strong style={{ color: '#667eea' }}>{displayData.brevet_avg.toFixed(1)}/20</strong></h4>
                    <h4 style={{ color: '#333' }}>📊 متوسط السنة الأولى: <strong style={{ color: '#667eea' }}>{displayData.as1_avg_global.toFixed(1)}/20</strong></h4>
                    <h4 style={{ color: '#333' }}>📊 متوسط السنة الثانية: <strong style={{ color: '#667eea' }}>{displayData.as2_avg_global.toFixed(1)}/20</strong></h4>
                    
                    <h4 style={{ color: '#333' }}>💪 العادات:</h4>
                    <p>ساعات الدراسة/أسبوع: <strong style={{ color: '#667eea' }}>{displayData.weekly_study_hours} ساعة</strong></p>
                    <p>وقت المواد الأساسية: <strong style={{ color: '#667eea' }}>{displayData.time_essential_subjects} ساعة/أسبوع</strong></p>
                    <p>وقت المواد الثانوية: <strong style={{ color: '#667eea' }}>{displayData.time_non_essential_subjects} ساعة/أسبوع</strong></p>
                    <p>النوم: <strong style={{ color: '#667eea' }}>{displayData.sleep_hours} ساعة/ليلة</strong></p>
                    <p>مستوى التوتر: <strong style={{ color: '#667eea' }}>{displayData.stress_level}/5</strong></p>
                </div>
            </div>
        );
    };

    return (
        <div style={{ direction: 'rtl', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: '700px', margin: '0 auto' }}>
            {/* Progress Bar */}
            <div style={{ background: '#e0e0e0', borderRadius: '10px', margin: '20px 0' }}>
                <div style={{
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    borderRadius: '10px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    color: 'white',
                    fontWeight: 'bold',
                    width: `${(step / totalSteps) * 100}%`,
                    transition: 'width 0.5s'
                }}>
                    الخطوة {step}/{totalSteps}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea' }}>📋 القسم {step}/6: {['المعلومات الأساسية', 'علامات البريفيه', 'علامات 1AS', 'علامات 2AS', 'عادات الدراسة', 'مراجعة وإرسال'][step - 1]}</h3>
            </div>

            {renderStep()}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                <button
                    onClick={handlePrev}
                    disabled={step === 1}
                    style={{
                        background: step === 1 ? '#ccc' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '10px 30px',
                        borderRadius: '25px',
                        cursor: step === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    ← السابق
                </button>
                {step === totalSteps ? (
                    <button
                        onClick={handleSubmit}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '12px 40px',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        🔍 تحليل ملفي الشخصي
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        style={{
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            padding: '10px 30px',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        التالي →
                    </button>
                )}
            </div>

            <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '14px', marginTop: '15px' }}>
                💡 قم بتعبئة معلوماتك خطوة بخطوة. بياناتك خاصة ولن تستخدم إلا للتحليل.
            </p>
        </div>
    );
}