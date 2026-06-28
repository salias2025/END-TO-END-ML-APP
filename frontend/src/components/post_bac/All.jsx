// src/components/post_bac/All.jsx
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

const All = ({ studentData, apiResponse, loading: parentLoading, error: parentError, onBack }) => {
    // ============================================
    // STATE
    // ============================================
    
    const [allFormations, setAllFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');

    // ============================================
    // USE API RESPONSE OR FALLBACK
    // ============================================
    
    useEffect(() => {
        setLoading(true);
        
        // If we have API response from parent, use it
        if (apiResponse && apiResponse.formations && apiResponse.formations.length > 0) {
            console.log('✅ Using API response for All formations:', apiResponse.formations.length);
            const sorted = [...apiResponse.formations].sort((a, b) => (b.weighted_avg || 0) - (a.weighted_avg || 0));
            setAllFormations(sorted);
            setFilteredFormations(sorted);
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
        const fetchAllFormations = async () => {
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
                    body: JSON.stringify({ ...studentData, all: true })
                });

                const result = await response.json();
                
                if (result.success && result.data && result.data.formations) {
                    const sorted = [...result.data.formations].sort((a, b) => (b.weighted_avg || 0) - (a.weighted_avg || 0));
                    setAllFormations(sorted);
                    setFilteredFormations(sorted);
                } else {
                    console.warn('⚠️ No formations in API response, using fallback');
                    setAllFormations([]);
                    setFilteredFormations([]);
                }
            } catch (err) {
                console.error('❌ Error fetching all formations:', err);
                setAllFormations([]);
                setFilteredFormations([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have student data
        if (studentData) {
            fetchAllFormations();
        } else {
            setLoading(false);
        }
    }, [studentData, apiResponse, parentLoading, parentError]);

    // ============================================
    // FILTER FORMATIONS
    // ============================================
    
    useEffect(() => {
        let result = [...allFormations];
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(f => 
                (f.nom || '').toLowerCase().includes(term) ||
                (f.domaine || '').toLowerCase().includes(term) ||
                (f.type || '').toLowerCase().includes(term)
            );
        }
        
        if (selectedType !== 'all') {
            result = result.filter(f => f.type === selectedType);
        }
        
        if (selectedPriority !== 'all') {
            result = result.filter(f => f.priorite === parseInt(selectedPriority));
        }
        
        setFilteredFormations(result);
        setCurrentPage(1);
    }, [searchTerm, selectedType, selectedPriority, allFormations]);

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

    const getTypeOptions = () => {
        const types = new Set(allFormations.map(f => f.type));
        return Array.from(types);
    };

    const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredFormations.length);
    const currentFormations = filteredFormations.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
                <p style={{ color: '#666', fontSize: '18px' }}>جاري تحميل جميع التكوينات...</p>
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
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '20px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 10px 40px rgba(238, 90, 36, 0.3)'
            }}>
                <h1 style={{ margin: 0, fontSize: '32px' }}>📋 جميع التكوينات</h1>
                <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                    {filteredFormations.length} تكوين(ات) متاحة لملفك الشخصي
                </p>
            </div>

            {/* Filters */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '15px'
                }}>
                    {/* Search */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#555',
                            marginBottom: '6px'
                        }}>
                            🔍 بحث
                        </label>
                        <input
                            type="text"
                            placeholder="الاسم، المجال، النوع..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '2px solid #e0e0e0',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#555',
                            marginBottom: '6px'
                        }}>
                            📚 النوع
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
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
                            <option value="all">📋 جميع الأنواع</option>
                            {getTypeOptions().map(type => {
                                const style = getTypeBadgeStyle(type);
                                return (
                                    <option key={type} value={type}>
                                        {style.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#555',
                            marginBottom: '6px'
                        }}>
                            🎯 الأولوية
                        </label>
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
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
                            <option value="all">🎯 الكل</option>
                            <option value="1">🔥 أولوية قصوى (P1)</option>
                            <option value="2">⚡ موصى به جداً (P2)</option>
                            <option value="3">📌 موصى به (P3)</option>
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '14px', color: '#888' }}>
                        عرض من {startIndex + 1} إلى {endIndex} من أصل {filteredFormations.length} تكوين
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '13px', color: '#555' }}>عرض:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(parseInt(e.target.value));
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '2px solid #e0e0e0',
                                fontSize: '13px',
                                background: 'white',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Formations List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
            }}>
                {currentFormations.length === 0 ? (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '40px',
                        textAlign: 'center',
                        border: '2px dashed #e0e0e0'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔍</div>
                        <h3 style={{ color: '#333', marginBottom: '10px' }}>لم يتم العثور على تكوينات</h3>
                        <p style={{ color: '#888' }}>
                            حاول تعديل خيارات البحث والتصفية
                        </p>
                    </div>
                ) : (
                    currentFormations.map((formation, index) => {
                        const typeStyle = getTypeBadgeStyle(formation.type);
                        const compatibilityScore = Math.min(100, Math.round((formation.weighted_avg / formation.seuil) * 100));
                        const scoreColor = getScoreColor(compatibilityScore);

                        return (
                            <div
                                key={formation.id || index}
                                style={{
                                    background: 'white',
                                    borderRadius: '14px',
                                    padding: '18px 22px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                                    border: '1px solid #f0f0f0',
                                    borderRight: `4px solid ${scoreColor}`,
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateX(-6px)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            marginBottom: '4px'
                                        }}>
                                            {formation.nom || 'تكوين غير مسمى'}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '6px',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '13px', color: '#666' }}>
                                                {formation.domaine || 'مجال غير محدد'}
                                            </span>
                                            <span style={{
                                                background: typeStyle.bg,
                                                color: typeStyle.color,
                                                padding: '1px 10px',
                                                borderRadius: '10px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                {typeStyle.label}
                                            </span>
                                            <span style={{
                                                background: formation.priorite === 1 ? '#ff6b6b20' : '#f0f0f0',
                                                color: formation.priorite === 1 ? '#c0392b' : '#666',
                                                padding: '1px 10px',
                                                borderRadius: '10px',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                            }}>
                                                {getPriorityLabel(formation.priorite)}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: scoreColor
                                            }}>
                                                {compatibilityScore}%
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#888' }}>
                                                التوافق
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: '#333'
                                            }}>
                                                {formation.seuil || '—'}
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#888' }}>
                                                الحد الأدنى
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    marginTop: '10px',
                                    paddingTop: '10px',
                                    borderTop: '1px solid #f0f0f0',
                                    lineHeight: '1.5'
                                }}>
                                    💡 {formation.explication || 'تكوين موصى به لملفك الشخصي'}
                                </div>

                                {formation.debouches && formation.debouches.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '4px',
                                        marginTop: '8px'
                                    }}>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#888'
                                        }}>
                                            🎓 آفاق مهنية:
                                        </span>
                                        {formation.debouches.slice(0, 3).map((debouche, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    background: '#f8f9fa',
                                                    padding: '1px 10px',
                                                    borderRadius: '10px',
                                                    fontSize: '11px',
                                                    color: '#555'
                                                }}
                                            >
                                                {debouche}
                                            </span>
                                        ))}
                                        {formation.debouches.length > 3 && (
                                            <span style={{ fontSize: '11px', color: '#888' }}>
                                                +{formation.debouches.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {filteredFormations.length > 0 && (
                <div style={{
                    marginTop: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            background: currentPage === 1 ? '#f0f0f0' : 'white',
                            color: currentPage === 1 ? '#aaa' : '#333',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s',
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== 1) {
                                e.currentTarget.style.background = '#667eea';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#667eea';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== 1) {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#333';
                                e.currentTarget.style.borderColor = '#e0e0e0';
                            }
                        }}
                    >
                        ◀ السابق
                    </button>

                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '2px solid',
                                        borderColor: currentPage === pageNum ? '#667eea' : '#e0e0e0',
                                        background: currentPage === pageNum ? '#667eea' : 'white',
                                        color: currentPage === pageNum ? 'white' : '#333',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: currentPage === pageNum ? 'bold' : '500',
                                        transition: 'all 0.3s',
                                        minWidth: '40px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== pageNum) {
                                            e.currentTarget.style.borderColor = '#667eea';
                                            e.currentTarget.style.background = '#f0f0ff';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== pageNum) {
                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                            e.currentTarget.style.background = 'white';
                                        }
                                    }}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            border: '2px solid #e0e0e0',
                            background: currentPage === totalPages ? '#f0f0f0' : 'white',
                            color: currentPage === totalPages ? '#aaa' : '#333',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s',
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== totalPages) {
                                e.currentTarget.style.background = '#667eea';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = '#667eea';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== totalPages) {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#333';
                                e.currentTarget.style.borderColor = '#e0e0e0';
                            }
                        }}
                    >
                        التالي ▶
                    </button>
                </div>
            )}

            {/* Bottom Navigation */}
            <div style={{
                marginTop: '30px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        padding: '14px 40px',
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
                    ← العودة إلى أهم 10 تكوينات
                </button>
            </div>
        </div>
    );
};

export default All;