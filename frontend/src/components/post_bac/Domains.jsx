// src/components/post_bac/Domains.jsx
import React, { useState, useEffect } from 'react';

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

// ============================================
// DOMAIN ICONS
// ============================================
const DOMAIN_ICONS = {
    'maths_info': '💻',
    'st': '🔬',
    'snv': '🧬',
    'medecine': '🩺',
    'segc': '📊',
    'lettres_langues': '📚',
    'droit': '⚖️',
    'sciences_humaines': '🧠',
    'islamiques': '🕌',
    'arts': '🎨',
    'staps': '🏃'
};

// ============================================
// DOMAIN ARABIC NAMES
// ============================================
const DOMAIN_NAMES = {
    'maths_info': 'الرياضيات والإعلام الآلي',
    'st': 'العلوم والتكنولوجيا (ST)',
    'snv': 'علوم الطبيعة والحياة (SNV)',
    'medecine': 'الطب والطب المساعد (العلوم الطبية)',
    'segc': 'العلوم الاقتصادية، علوم التسيير والعلوم التجارية (SEGC)',
    'lettres_langues': 'الآداب واللغات',
    'droit': 'الحقوق والعلوم السياسية',
    'sciences_humaines': 'العلوم الإنسانية والاجتماعية',
    'islamiques': 'العلوم الإسلامية',
    'arts': 'الفنون والثقافة',
    'staps': 'STAPS (علوم وتقنيات النشاطات البدنية والرياضية)'
};

const Domains = ({ studentData, apiResponse, loading: parentLoading, error: parentError, onNext }) => {
    // ============================================
    // STATE
    // ============================================
    
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============================================
    // USE API RESPONSE OR FALLBACK
    // ============================================
    
    useEffect(() => {
        setLoading(true);
        
        // If we have API response from parent, use it
        if (apiResponse && apiResponse.top_domains && apiResponse.top_domains.length > 0) {
            console.log('✅ Using API response for Domains:', apiResponse.top_domains.length);
            const domainsWithIcons = apiResponse.top_domains.map((d, index) => ({
                id: d.id || d.domain_id || `domain_${index}`,
                name: DOMAIN_NAMES[d.id] || d.name || d.id || 'مجال غير محدد',
                icon: DOMAIN_ICONS[d.id] || '📚',
                probability: d.probability || 0.5,
                rank: index + 1
            }));
            setDomains(domainsWithIcons);
            setLoading(false);
            return;
        }

        // If parent is still loading, wait
        if (parentLoading) {
            setLoading(true);
            return;
        }

        // If parent has error, show error
        if (parentError) {
            setLoading(false);
            return;
        }

        // Fallback: fetch from API directly
        const fetchDomains = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/api/postbac/predict`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(studentData)
                });

                const result = await response.json();
                
                if (result.success && result.data && result.data.top_domains) {
                    const domainsWithIcons = result.data.top_domains.map((d, index) => ({
                        id: d.id || d.domain_id || `domain_${index}`,
                        name: DOMAIN_NAMES[d.id] || d.name || d.id || 'مجال غير محدد',
                        icon: DOMAIN_ICONS[d.id] || '📚',
                        probability: d.probability || 0.5,
                        rank: index + 1
                    }));
                    setDomains(domainsWithIcons);
                } else {
                    console.warn('⚠️ No domains in API response, using fallback');
                    setDomains([]);
                }
            } catch (err) {
                console.error('❌ Error fetching domains:', err);
                setDomains([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have student data
        if (studentData) {
            fetchDomains();
        } else {
            setLoading(false);
        }
    }, [studentData, apiResponse, parentLoading, parentError]);

    // ============================================
    // HELPERS
    // ============================================
    
    const getWilayaName = (wilayaId) => {
        const wilayas = [
            'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
            'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
            'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
            'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
            'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
            'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
            'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
            'إن صالح', 'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
        ];
        return wilayas[wilayaId - 1] || 'الجزائر';
    };

    // ============================================
    // LOADING STATE
    // ============================================
    
    if (loading || parentLoading) {
        return (
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '60px 20px',
                textAlign: 'center',
                direction: 'rtl'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid #f0f0f0',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <p style={{ color: '#666', fontSize: '18px' }}>تحليل الميول الدراسية...</p>
            </div>
        );
    }

    // ============================================
    // ERROR STATE
    // ============================================
    
    if (parentError) {
        return (
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '40px 20px',
                textAlign: 'center',
                direction: 'rtl'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
                <h3 style={{ color: '#dc2626' }}>حدث خطأ</h3>
                <p style={{ color: '#666' }}>{parentError}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '15px',
                        padding: '10px 30px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    🔄 إعادة المحاولة
                </button>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    
    const top5Domains = domains.slice(0, 5);

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
                <h1 style={{ margin: 0, fontSize: '28px' }}>📊 تصنيف المجالات</h1>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                    احتمالية القبول حسب مجال التخصص بناءً على ملفك الشخصي
                </p>
            </div>

            {/* Student Profile */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px 25px',
                marginBottom: '25px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
            }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px' }}>
                    👨‍🎓 الملف الشخصي للطالب
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ color: '#888' }}>🎓 الشعبة:</span>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>
                            {studentData?.bac_stream || 'غير محددة'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ color: '#888' }}>📈 معدل البكالوريا:</span>
                        <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                            {studentData?.bac_avg || '—'} / 20
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ color: '#888' }}>📍 الولاية:</span>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>
                            {getWilayaName(studentData?.wilaya || 16)}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span style={{ color: '#888' }}>🎯 التوجه:</span>
                        <span style={{ fontWeight: 'bold', color: '#333' }}>
                            {studentData?.career_orientation || 'غير محدد'}
                        </span>
                    </div>
                </div>
            </div>

            {/* TOP 5 DOMAINS */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: 0, color: '#333' }}>
                        🎯 أهم 5 مجالات موصى بها
                    </h3>
                    <span style={{
                        fontSize: '13px',
                        color: '#888',
                        background: '#f0f0f0',
                        padding: '4px 14px',
                        borderRadius: '20px'
                    }}>
                        نسبة الاحتمال
                    </span>
                </div>

                {top5Domains.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <p>⚠️ لا توجد مجالات متاحة لملفك الشخصي</p>
                        <p style={{ fontSize: '14px', marginTop: '10px' }}>
                            تأكد من إدخال جميع البيانات بشكل صحيح
                        </p>
                    </div>
                ) : (
                    top5Domains.map((domain, index) => {
                        const percentage = domain.probability * 100;
                        
                        let barColor = '#e74c3c';
                        if (percentage >= 80) barColor = '#2ecc71';
                        else if (percentage >= 60) barColor = '#f39c12';
                        else if (percentage >= 40) barColor = '#3498db';

                        const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                        const rank = rankEmojis[index] || `${index + 1}.`;

                        const blockCount = Math.round(percentage / 3.33);
                        const blocks = '█'.repeat(Math.min(blockCount, 30));
                        const emptyBlocks = '░'.repeat(Math.max(0, 30 - blockCount));

                        return (
                            <div
                                key={domain.id || index}
                                style={{
                                    marginBottom: index === top5Domains.length - 1 ? 0 : '20px',
                                    padding: '16px 18px',
                                    borderRadius: '12px',
                                    background: index === 0 ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : '#f8f9fa',
                                    border: index === 0 ? '2px solid #2ecc71' : '1px solid #e0e0e0',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(6px)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '20px',
                                        minWidth: '36px',
                                        fontWeight: index === 0 ? 'bold' : 'normal'
                                    }}>
                                        {rank}
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: index === 0 ? 'bold' : '600',
                                        color: index === 0 ? '#2e7d32' : '#333',
                                        flex: 1
                                    }}>
                                        {domain.icon} {domain.name}
                                    </span>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        color: barColor,
                                        background: `${barColor}15`,
                                        padding: '2px 14px',
                                        borderRadius: '10px',
                                        minWidth: '48px',
                                        textAlign: 'center'
                                    }}>
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        flex: 1,
                                        background: '#ecf0f1',
                                        borderRadius: '4px',
                                        padding: '2px 4px',
                                        fontFamily: 'monospace',
                                        fontSize: '16px',
                                        letterSpacing: '1px',
                                        color: barColor,
                                        minHeight: '28px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontWeight: 'bold' }}>{blocks}</span>
                                        <span style={{ color: '#d0d0d0' }}>{emptyBlocks}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        color: '#888',
                                        minWidth: '50px',
                                        textAlign: 'right'
                                    }}>
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Note: Results stored for next step */}
                <div style={{
                    marginTop: '20px',
                    padding: '12px 16px',
                    background: '#f0f8ff',
                    borderRadius: '10px',
                    border: '1px dashed #667eea',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#555'
                }}>
                    ✅ تم حفظ النتائج للخطوة التالية
                    <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        ← انتقل إلى الخطوة التالية لمشاهدة التكوينات الموصى بها
                    </span>
                </div>
            </div>

            {/* Next Button */}
            <div style={{
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <button
                    onClick={onNext}
                    disabled={top5Domains.length === 0}
                    style={{
                        padding: '14px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: top5Domains.length === 0 
                            ? '#ccc' 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '14px',
                        cursor: top5Domains.length === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: top5Domains.length === 0 
                            ? 'none' 
                            : '0 4px 20px rgba(102, 126, 234, 0.4)',
                        opacity: top5Domains.length === 0 ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (top5Domains.length > 0) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (top5Domains.length > 0) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
                        }
                    }}
                >
                    عرض التكوينات الموصى بها ←
                </button>
            </div>
        </div>
    );
};

export default Domains;