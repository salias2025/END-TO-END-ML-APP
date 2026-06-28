// src/components/post_bac/Top10.jsx
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

const Top10 = ({ studentData, apiResponse, loading: parentLoading, error: parentError, onNext, onBack }) => {
    // ============================================
    // STATE
    // ============================================
    
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============================================
    // USE API RESPONSE OR FALLBACK
    // ============================================
    
    useEffect(() => {
        setLoading(true);
        
        // If we have API response from parent, use it
        if (apiResponse && apiResponse.formations && apiResponse.formations.length > 0) {
            console.log('✅ Using API response for Top10:', apiResponse.formations.length);
            const top10 = apiResponse.formations.slice(0, 10);
            setFormations(top10);
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
        const fetchTop10 = async () => {
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
                
                if (result.success && result.data && result.data.formations) {
                    const top10 = result.data.formations.slice(0, 10);
                    setFormations(top10);
                } else {
                    console.warn('⚠️ No formations in API response');
                    setFormations([]);
                }
            } catch (err) {
                console.error('❌ Error fetching top 10:', err);
                setFormations([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have student data
        if (studentData) {
            fetchTop10();
        } else {
            setLoading(false);
        }
    }, [studentData, apiResponse, parentLoading, parentError]);

    // ============================================
    // HELPERS
    // ============================================
    
    const getTypeBadgeStyle = (type) => {
        const styles = {
            'ecoles_superieures': { bg: '#e3f2fd', color: '#1565c0', label: '🏛️ مدارس عليا' },
            'cycle_long': { bg: '#e8f5e9', color: '#2e7d32', label: '🩺 دورة طويلة' },
            'ens': { bg: '#fff3e0', color: '#e65100', label: '👨‍🏫 المدرسة العليا للأساتذة' },
            'ingeniorat': { bg: '#fce4ec', color: '#c2185b', label: '🔧 هندسة' },
            'lmd': { bg: '#f3e5f5', color: '#7b1fa2', label: '📖 ليسانس-ماستر-دكتوراه' },
            'paramedical': { bg: '#e0f7fa', color: '#00838f', label: '🏥 شبه طبي' }
        };
        return styles[type] || { bg: '#e0e0e0', color: '#616161', label: '📚 أخرى' };
    };

    const getPriorityLabel = (priorite) => {
        const labels = {
            1: '🔥 أولوية قصوى',
            2: '⚡ موصى به جداً',
            3: '📌 موصى به'
        };
        return labels[priorite] || '📌 موصى به';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#2ecc71';
        if (score >= 60) return '#f39c12';
        if (score >= 40) return '#3498db';
        return '#e74c3c';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return '🟢 توافق ممتاز';
        if (score >= 60) return '🟡 توافق جيد';
        if (score >= 40) return '🔵 توافق متوسط';
        return '🔴 توافق يحتاج إلى تحسين';
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
                <p style={{ color: '#666', fontSize: '18px' }}>جاري تحميل التكوينات الموصى بها...</p>
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
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 10px 40px rgba(56, 239, 125, 0.3)'
            }}>
                <h1 style={{ margin: 0, fontSize: '32px' }}>🏆 أهم 10 تكوينات</h1>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                    التكوينات الأكثر ملاءمة لملفك الشخصي
                </p>
                {formations.length > 0 && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', opacity: 0.7 }}>
                        تم العثور على {formations.length} تكوين موصى به
                    </p>
                )}
            </div>

            {/* Student Profile Summary */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px 25px',
                marginBottom: '25px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>👨‍🎓</span>
                    <div>
                        <div style={{ fontSize: '12px', color: '#888' }}>الشعبة</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                            {studentData?.bac_stream || 'غير محددة'}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>📈</span>
                    <div>
                        <div style={{ fontSize: '12px', color: '#888' }}>معدل البكالوريا</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {studentData?.bac_avg || '—'} <span style={{ fontSize: '14px', WebkitTextFillColor: '#888' }}>/20</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🎯</span>
                    <div>
                        <div style={{ fontSize: '12px', color: '#888' }}>التوجه</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                            {studentData?.career_orientation || 'غير محدد'}
                        </div>
                    </div>
                </div>
                <div style={{
                    background: '#f0f8ff',
                    padding: '8px 20px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '12px', color: '#888' }}>التكوينات الموصى بها</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                        {formations.length}
                    </div>
                </div>
            </div>

            {/* Formations List */}
            {formations.length === 0 ? (
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    border: '2px dashed #e0e0e0'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
                    <h3 style={{ color: '#333', marginBottom: '10px' }}>لا توجد تكوينات موصى بها</h3>
                    <p style={{ color: '#888' }}>
                        قد يكون ملفك الشخصي لا يتوافق مع أي تكوين حالياً
                    </p>
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '10px' }}>
                        حاول تعديل بياناتك أو استشر مستشار التوجيه
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {formations.map((formation, index) => {
                        const typeStyle = getTypeBadgeStyle(formation.type);
                        const compatibilityScore = Math.min(100, Math.round((formation.weighted_avg / formation.seuil) * 100));
                        const scoreColor = getScoreColor(compatibilityScore);
                        const scoreLabel = getScoreLabel(compatibilityScore);

                        return (
                            <div
                                key={formation.id || index}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '20px 24px',
                                    boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                                    border: index === 0 ? '2px solid #11998e' : '1px solid #f0f0f0',
                                    borderRight: `6px solid ${scoreColor}`,
                                    transition: 'all 0.3s',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(-8px)';
                                    e.currentTarget.style.boxShadow = '0 4px 25px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Rank Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '20px',
                                    background: index === 0 ? 'linear-gradient(135deg, #11998e, #38ef7d)' : '#667eea',
                                    color: 'white',
                                    padding: '4px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}>
                                    #{index + 1}
                                </div>

                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    marginBottom: '12px'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            marginBottom: '4px'
                                        }}>
                                            {formation.nom || 'تكوين غير مسمى'}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#666' }}>
                                                {formation.domaine || 'مجال غير محدد'}
                                            </span>
                                            <span style={{
                                                background: typeStyle.bg,
                                                color: typeStyle.color,
                                                padding: '2px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {typeStyle.label}
                                            </span>
                                            <span style={{
                                                background: formation.priorite === 1 ? '#ff6b6b20' : '#f0f0f0',
                                                color: formation.priorite === 1 ? '#c0392b' : '#666',
                                                padding: '2px 12px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {getPriorityLabel(formation.priorite)}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: scoreColor
                                        }}>
                                            {compatibilityScore}%
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#888' }}>
                                            التوافق
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    flexWrap: 'wrap',
                                    marginBottom: '12px',
                                    padding: '10px 0',
                                    borderTop: '1px solid #f0f0f0',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#888' }}>حدود القبول</span>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                                            {formation.seuil || '—'} <span style={{ fontSize: '12px', color: '#888' }}>/20</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#888' }}>معدلك</span>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                                            {formation.weighted_avg || '—'} <span style={{ fontSize: '12px', color: '#888' }}>/20</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '12px', color: '#888' }}>الحالة</span>
                                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: scoreColor }}>
                                            {scoreLabel}
                                        </div>
                                    </div>
                                </div>

                                {/* Explication */}
                                <div style={{
                                    background: '#f8f9fa',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    fontSize: '14px',
                                    color: '#555',
                                    lineHeight: '1.6'
                                }}>
                                    💡 {formation.explication || 'تكوين موصى به لملفك الشخصي'}
                                </div>

                                {/* Débouchés */}
                                {formation.debouches && formation.debouches.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        marginTop: '8px'
                                    }}>
                                        <span style={{
                                            fontSize: '13px',
                                            color: '#888',
                                            fontWeight: '500'
                                        }}>
                                            🎓 آفاق مهنية:
                                        </span>
                                        {formation.debouches.slice(0, 3).map((debouche, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    background: '#f0f0f0',
                                                    padding: '2px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    color: '#555'
                                                }}
                                            >
                                                {debouche}
                                            </span>
                                        ))}
                                        {formation.debouches.length > 3 && (
                                            <span style={{
                                                fontSize: '11px',
                                                color: '#888'
                                            }}>
                                                +{formation.debouches.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Buttons */}
            <div style={{
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '14px 30px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#667eea',
                        background: 'white',
                        border: '2px solid #667eea',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#667eea';
                    }}
                >
                    ← العودة إلى المجالات
                </button>
                
                <button
                    onClick={onNext}
                    disabled={formations.length === 0}
                    style={{
                        padding: '14px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: formations.length === 0 
                            ? '#ccc' 
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '14px',
                        cursor: formations.length === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: formations.length === 0 
                            ? 'none' 
                            : '0 4px 20px rgba(102, 126, 234, 0.4)',
                        opacity: formations.length === 0 ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (formations.length > 0) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.5)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (formations.length > 0) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
                        }
                    }}
                >
                    عرض جميع التكوينات →
                </button>
            </div>
        </div>
    );
};

export default Top10;