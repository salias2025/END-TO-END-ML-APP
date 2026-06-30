// src/components/bac_year/ressource.jsx
import React, { useState, useEffect } from 'react';
import RESOURCE_DB from '../../data/resources.json';

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
// SUBJECTS BY STREAM (matches resources.json IDs)
// ============================================
const STREAM_SUBJECTS = {
    'sciences_experimentales': ['arabic', 'english', 'french', 'maths', 'science', 'physics', 'his_geo', 'islamia', 'philo', 'tamazight'],
    'maths': ['arabic', 'english', 'french', 'maths', 'physics', 'science', 'his_geo', 'islamia', 'philo', 'tamazight'],
    'techniques_maths': ['arabic', 'english', 'french', 'maths', 'physics', 'techno', 'his_geo', 'islamia', 'philo', 'tamazight'],
    'gestion_economie': ['arabic', 'english', 'french', 'maths', 'his_geo', 'islamia', 'philo', 'economie', 'droit', 'gestion', 'tamazight'],
    'langues_etrangeres': ['arabic', 'english', 'french', 'foreign_languages', 'maths', 'his_geo', 'islamia', 'philo', 'tamazight'],
    'lettres_philosophie': ['arabic', 'english', 'french', 'maths', 'his_geo', 'islamia', 'philo', 'tamazight']
};

// ============================================
// GENERAL RESOURCES (All Subjects)
// ============================================
const GENERAL_RESOURCES = {
    facebook: [
        { name: 'Prof Bouznaq Remdan' },
        { name: 'Prof Bouchnaq Youcef' },
        { name: 'Prof Khaled Bakhchcha' },
        { name: 'Groupes BAC 2025' },
        { name: 'PDF trouve sur facebook' }
    ],
    apps: [
        { name: 'تطبيق BAC sujets + solutions' },
        { name: 'تطبيق Quiz' },
        { name: 'Telegram' }
    ],
    courses: [
        { name: 'Cours particulier (presentiel)' },
        { name: 'Dawarat présentiel' },
        { name: 'Dawarat sur Zoom' }
    ]
};

// ============================================
// HELPERS
// ============================================
const getPriority = (predictedScore, weaknessCount) => {
    if (predictedScore < 10 || weaknessCount >= 2) {
        return { key: 'critical', color: 'linear-gradient(135deg, #e74c3c, #c0392b)', label: '🔴 حرجة', glow: 'rgba(231,76,60,0.4)' };
    } else if (predictedScore < 12 || weaknessCount >= 1) {
        return { key: 'high', color: 'linear-gradient(135deg, #e67e22, #d35400)', label: '🟠 عالية', glow: 'rgba(230,126,34,0.4)' };
    } else if (predictedScore < 14) {
        return { key: 'medium', color: 'linear-gradient(135deg, #f39c12, #e67e22)', label: '🟡 متوسطة', glow: 'rgba(243,156,18,0.4)' };
    } else {
        return { key: 'low', color: 'linear-gradient(135deg, #2ecc71, #27ae60)', label: '🟢 منخفضة', glow: 'rgba(46,204,113,0.4)' };
    }
};

// ============================================
// COMPONENT
// ============================================
export default function Ressource() {
    const [user, setUser] = useState(null);
    const [expandedResources, setExpandedResources] = useState({});
    const [userResults, setUserResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjectEntries, setSubjectEntries] = useState([]);

    // ============================================
    // LOAD USER DATA
    // ============================================
    useEffect(() => {
        const currentUser = getUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    // ============================================
    // FETCH USER RESULTS FROM DATABASE
    // ============================================
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = getAuthToken();
                if (!token) {
                    setError('الرجاء تسجيل الدخول أولاً');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_URL}/api/bacyear/results`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('فشل في جلب البيانات');
                }

                const result = await response.json();

                if (result.success) {
                    setUserResults(result.data || {});
                } else {
                    setError(result.message || 'حدث خطأ في جلب البيانات');
                }
            } catch (err) {
                console.error('❌ Error fetching results:', err);
                setError('حدث خطأ في تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    // ============================================
    // BUILD SUBJECT ENTRIES WITH DYNAMIC DATA
    // ✅ FILTERED BY FILIERE - NO MAPPING NEEDED
    // ============================================
    useEffect(() => {
        const entries = [];

        // Get user's filiere
        const userFiliere = user?.filiere || 'sciences_experimentales';
        
        // Get the list of subjects for this filiere
        const filiereSubjectIds = STREAM_SUBJECTS[userFiliere] || [];

        console.log('🔍 User filiere:', userFiliere);
        console.log('📚 Subjects for this filiere:', filiereSubjectIds);
        console.log('📦 Available resources:', Object.keys(RESOURCE_DB));

        filiereSubjectIds.forEach((subjectId) => {
            // Get resource data from DB directly (IDs already match)
            const data = RESOURCE_DB[subjectId];
            
            // Skip if resource not found
            if (!data) {
                console.warn(`⚠️ Resource not found for: ${subjectId}`);
                return;
            }

            // Get user data from API (or use defaults)
            const userData = userResults[subjectId] || {};
            const predictedScore = userData.predicted_score || 12;
            const weaknesses = userData.weaknesses || [];

            let weaknessList = weaknesses;
            if (weaknessList.length === 0 && userData.weakness_vector) {
                weaknessList = userData.weakness_vector?.skill_weaknesses?.map(w => w.name) || [];
            }

            const priority = getPriority(predictedScore, weaknessList.length);

            entries.push({
                id: subjectId,
                name_ar: data.name_ar,
                icon: data.icon || '📚',
                predicted_score: predictedScore,
                weakness_count: weaknessList.length,
                weaknesses: weaknessList,
                priority: priority,
                resources: {
                    youtube: data.youtube || [],
                    books: data.books || [],
                    facebook: data.facebook || [],
                    apps: data.apps || []
                }
            });
        });

        // Sort by priority (critical first)
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        entries.sort((a, b) => priorityOrder[a.priority.key] - priorityOrder[b.priority.key]);

        setSubjectEntries(entries);
    }, [userResults, user]);

    // ============================================
    // TOGGLE RESOURCES
    // ============================================
    const toggleResources = (subjectId) => {
        setExpandedResources(prev => ({
            ...prev,
            [subjectId]: !prev[subjectId]
        }));
    };

    // ============================================
    // HANDLE RESOURCE CLICK - Opens URL in new tab
    // ============================================
    const handleResourceClick = (url, name, type) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert(`🔗 ${type}: "${name}" - الرابط غير متوفر حالياً`);
        }
    };

    // ============================================
    // STATS
    // ============================================
    const totalSubjects = subjectEntries.length;
    const criticalCount = subjectEntries.filter(s => s.priority.key === 'critical').length;
    const totalResources = subjectEntries.reduce((sum, s) =>
        sum + s.resources.youtube.length + s.resources.books.length +
        s.resources.facebook.length + s.resources.apps.length, 0
    );

    // ============================================
    // LOADING STATE
    // ============================================
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                minHeight: '400px',
                color: 'rgba(255,255,255,0.6)'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '20px' }}>⏳ جاري تحميل الموارد الموصى بها...</p>
            </div>
        );
    }

    // ============================================
    // ERROR STATE
    // ============================================
    if (error) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#f87171'
            }}>
                <p>❌ {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '20px',
                        padding: '10px 24px',
                        background: '#667eea',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    // ============================================
    // RENDER
    // ============================================
    return (
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: 'rtl',
            padding: '20px',
            background: 'linear-gradient(135deg, #0a0d1a 0%, #1a1a3e 100%)',
            borderRadius: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-20px, -20px) rotate(5deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 30px rgba(102,126,234,0.2); }
                    50% { box-shadow: 0 0 60px rgba(102,126,234,0.4); }
                }
            `}</style>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                padding: '50px 30px',
                borderRadius: '25px',
                textAlign: 'center',
                marginBottom: '30px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(102,126,234,0.3)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-30%',
                    width: '70%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-50%',
                    left: '-30%',
                    width: '60%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite reverse'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                        منصة توصيات الموارد التعليمية
                    </h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
                        أفضل القنوات، الكتب، التطبيقات، والدورات لمساعدتك في البكالوريا
                    </p>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '30px',
                        padding: '8px 24px',
                        marginTop: '15px',
                        fontSize: '14px',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        🎯 توصيات مبنية على أدائك الفعلي في البكالوريا
                    </div>
                    {user && (
                        <p style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            marginTop: '10px'
                        }}>
                            👤 {user.username} • 🎓 {user.filiere || 'جميع الشعب'}
                        </p>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(102,126,234,0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}>
                    <div style={{ fontSize: '36px' }}>📚</div>
                    <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>عدد المواد</h3>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {totalSubjects}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(231,76,60,0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}>
                    <div style={{ fontSize: '36px' }}>🔴</div>
                    <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>مواد تحتاج تركيزاً عالياً</h3>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#e74c3c' }}>
                        {criticalCount}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '25px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(46,204,113,0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                }}>
                    <div style={{ fontSize: '36px' }}>📖</div>
                    <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>إجمالي الموارد الموصى بها</h3>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2ecc71' }}>
                        {totalResources}
                    </div>
                </div>
            </div>

            {/* Subject Cards - Only shows subjects from user's filiere */}
            {subjectEntries.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: 'rgba(255,255,255,0.4)'
                }}>
                    <p>⚠️ لا توجد مواد لعرضها في شعبتك</p>
                </div>
            ) : (
                subjectEntries.map((subject) => (
                    <div key={subject.id} style={{
                        marginBottom: '20px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                    }}>
                        {/* Subject Header */}
                        <div
                            style={{
                                padding: '20px 25px',
                                background: subject.priority.color,
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.3s',
                                boxShadow: `0 4px 20px ${subject.priority.glow}`
                            }}
                            onClick={() => toggleResources(subject.id)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.filter = 'brightness(1.1)';
                                e.currentTarget.style.transform = 'scale(1.01)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.filter = 'brightness(1)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '28px' }}>{subject.icon}</span>
                                <span style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>{subject.name_ar}</span>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    color: 'white'
                                }}>
                                    {subject.predicted_score}/20
                                </span>
                                {subject.weaknesses.map((w, i) => (
                                    <span key={i} style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        padding: '3px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        color: 'white'
                                    }}>
                                        ⚠️ {w}
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    color: 'white'
                                }}>
                                    {subject.priority.label}
                                </span>
                                <span style={{ fontSize: '24px', color: 'white' }}>
                                    {expandedResources[subject.id] ? '▲' : '▼'}
                                </span>
                            </div>
                        </div>

                        {/* Resources */}
                        {expandedResources[subject.id] && (
                            <div style={{ padding: '25px' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '20px'
                                }}>
                                    {/* YouTube */}
                                    {subject.resources.youtube.map((yt, i) => {
                                        const url = yt.url || null;
                                        return (
                                            <div key={i} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                                cursor: url ? 'pointer' : 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (url) {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                                                    e.currentTarget.style.borderColor = 'rgba(255,0,0,0.3)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                            }}
                                            onClick={() => handleResourceClick(url, yt.name, 'قناة يوتيوب')}
                                            >
                                                <div style={{
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, rgba(255,0,0,0.15), rgba(200,0,0,0.05))',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <div style={{ fontSize: '32px' }}>🎬</div>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{yt.name}</div>
                                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{yt.channel}</div>
                                                </div>
                                                <div style={{ padding: '20px' }}>
                                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '15px' }}>
                                                        قناة متخصصة في شرح {subject.name_ar} مع تمارين تطبيقية.
                                                    </div>
                                                    <button
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            background: url ? 'linear-gradient(135deg, #ff0000, #cc0000)' : 'linear-gradient(135deg, #666, #444)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            cursor: url ? 'pointer' : 'not-allowed',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s',
                                                            fontFamily: 'inherit',
                                                            opacity: url ? 1 : 0.6
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (url) {
                                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,0,0,0.4)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResourceClick(url, yt.name, 'قناة يوتيوب');
                                                        }}
                                                    >
                                                        {url ? '🔗 زيارة القناة' : '🔗 الرابط غير متوفر'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Books */}
                                    {subject.resources.books.map((book, i) => {
                                        const url = book.url || null;
                                        return (
                                            <div key={i} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                                cursor: url ? 'pointer' : 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (url) {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                                                    e.currentTarget.style.borderColor = 'rgba(46,204,113,0.3)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                            }}
                                            onClick={() => handleResourceClick(url, book.name, 'كتاب')}
                                            >
                                                <div style={{
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, rgba(46,204,113,0.15), rgba(26,188,156,0.05))',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <div style={{ fontSize: '32px' }}>📖</div>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{book.name}</div>
                                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{book.author || 'كتاب تعليمي'}</div>
                                                </div>
                                                <div style={{ padding: '20px' }}>
                                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '15px' }}>
                                                        كتاب ملخص وشامل لمادة {subject.name_ar} مع تمارين محلولة.
                                                    </div>
                                                    <button
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            background: url ? 'linear-gradient(135deg, #2ecc71, #1abc9c)' : 'linear-gradient(135deg, #666, #444)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            cursor: url ? 'pointer' : 'not-allowed',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s',
                                                            fontFamily: 'inherit',
                                                            opacity: url ? 1 : 0.6
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (url) {
                                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(46,204,113,0.4)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResourceClick(url, book.name, 'كتاب');
                                                        }}
                                                    >
                                                        {url ? '🔗 معلومات عن الكتاب' : '🔗 الرابط غير متوفر'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Facebook */}
                                    {subject.resources.facebook.map((fb, i) => {
                                        const url = fb.url || null;
                                        return (
                                            <div key={i} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                                cursor: url ? 'pointer' : 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (url) {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                                                    e.currentTarget.style.borderColor = 'rgba(59,89,152,0.3)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                            }}
                                            onClick={() => handleResourceClick(url, fb.name, 'صفحة فيسبوك')}
                                            >
                                                <div style={{
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, rgba(59,89,152,0.15), rgba(45,67,115,0.05))',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <div style={{ fontSize: '32px' }}>🌐</div>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{fb.name}</div>
                                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>صفحة فيسبوك</div>
                                                </div>
                                                <div style={{ padding: '20px' }}>
                                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '15px' }}>
                                                        صفحة متخصصة في تقديم ملخصات وتمارين وامتحانات لمادة {subject.name_ar}.
                                                    </div>
                                                    <button
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            background: url ? 'linear-gradient(135deg, #3b5998, #2d4373)' : 'linear-gradient(135deg, #666, #444)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            cursor: url ? 'pointer' : 'not-allowed',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s',
                                                            fontFamily: 'inherit',
                                                            opacity: url ? 1 : 0.6
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (url) {
                                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,89,152,0.4)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResourceClick(url, fb.name, 'صفحة فيسبوك');
                                                        }}
                                                    >
                                                        {url ? '🔗 زيارة الصفحة' : '🔗 الرابط غير متوفر'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Apps */}
                                    {subject.resources.apps.map((app, i) => {
                                        const url = app.url || null;
                                        return (
                                            <div key={i} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                overflow: 'hidden',
                                                transition: 'all 0.4s',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                                cursor: url ? 'pointer' : 'default'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (url) {
                                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                                                    e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                            }}
                                            onClick={() => handleResourceClick(url, app.name, 'تطبيق')}
                                            >
                                                <div style={{
                                                    padding: '20px',
                                                    background: 'linear-gradient(135deg, rgba(52,152,219,0.15), rgba(41,128,185,0.05))',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}>
                                                    <div style={{ fontSize: '32px' }}>📱</div>
                                                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{app.name}</div>
                                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{app.platform || 'تطبيق'}</div>
                                                </div>
                                                <div style={{ padding: '20px' }}>
                                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '15px' }}>
                                                        تطبيق مفيد لمراجعة مادة {subject.name_ar} واختبار مستواك.
                                                    </div>
                                                    <button
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px',
                                                            background: url ? 'linear-gradient(135deg, #3498db, #2980b9)' : 'linear-gradient(135deg, #666, #444)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            cursor: url ? 'pointer' : 'not-allowed',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            transition: 'all 0.3s',
                                                            fontFamily: 'inherit',
                                                            opacity: url ? 1 : 0.6
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (url) {
                                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(52,152,219,0.4)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResourceClick(url, app.name, 'تطبيق');
                                                        }}
                                                    >
                                                        {url ? '🔗 معلومات التطبيق' : '🔗 الرابط غير متوفر'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* General Resources */}
            <div style={{
                marginTop: '40px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '20px',
                padding: '25px',
                border: '1px solid rgba(255,255,255,0.06)'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '20px',
                    paddingRight: '15px',
                    borderRight: '4px solid #f093fb'
                }}>
                    📱 موارد عامة (لجميع المواد)
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '15px'
                }}>
                    {GENERAL_RESOURCES.facebook.map((fb, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59,89,152,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(59,89,152,0.3)';
                            e.currentTarget.style.transform = 'translateX(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{fb.name}</span>
                            <span style={{ fontSize: '20px' }}>🌐</span>
                        </div>
                    ))}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '15px',
                    marginTop: '15px'
                }}>
                    {GENERAL_RESOURCES.apps.map((app, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(52,152,219,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)';
                            e.currentTarget.style.transform = 'translateX(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{app.name}</span>
                            <span style={{ fontSize: '20px' }}>📱</span>
                        </div>
                    ))}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '15px',
                    marginTop: '15px'
                }}>
                    {GENERAL_RESOURCES.courses.map((course, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '15px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(155,89,182,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(155,89,182,0.3)';
                            e.currentTarget.style.transform = 'translateX(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{course.name}</span>
                            <span style={{ fontSize: '20px' }}>🎓</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: '30px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                marginTop: '30px'
            }}>
                <p>✨ هذه التوصيات مبنية على تحليل أدائك الفعلي في البكالوريا ✨</p>
                <p style={{ marginTop: '5px' }}>
                    📌 المواد ذات الأولوية "حرجة" تحتاج إلى تركيز يومي، المواد "عالية" تحتاج إلى متابعة أسبوعية
                </p>
            </div>
        </div>
    );
}