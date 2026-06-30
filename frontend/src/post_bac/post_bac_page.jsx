// src/post_bac/post_bac_phase.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputForm from '../components/post_bac/inputForm';
import Domains from '../components/post_bac/Domains';
import Top10 from '../components/post_bac/Top10';
import All from '../components/post_bac/All';
import IntroToPostBac from '../components/post_bac/intro_to_post_bac';

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

const PostBacPage = () => {
    // ============================================
    // STATE
    // ============================================
    
    const [currentStep, setCurrentStep] = useState('intro');
    const [studentData, setStudentData] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ============================================
    // HANDLERS
    // ============================================
    
    const handleIntroNext = () => {
        setCurrentStep('form');
    };

    const handleFormSubmit = async (data) => {
        setStudentData(data);
        setLoading(true);
        setError(null);
        setCurrentStep('domains');

        try {
            const token = getAuthToken();
            if (!token) {
                setError('❌ يرجى تسجيل الدخول أولاً');
                setLoading(false);
                return;
            }

            console.log('📤 Sending Post-BAC request:', data);

            const response = await fetch(`${API_URL}/api/postbac/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('📥 Post-BAC response:', result);

            if (result.success) {
                setApiResponse(result.data);
            } else {
                setError(result.message || '❌ حدث خطأ في تحليل الميول الدراسية');
            }
        } catch (err) {
            console.error('❌ Post-BAC API error:', err);
            setError('❌ حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    const handleDomainsNext = () => {
        setCurrentStep('top10');
    };

    const handleTop10Next = () => {
        setCurrentStep('all');
    };

    const handleTop10Back = () => {
        setCurrentStep('domains');
    };

    const handleAllBack = () => {
        setCurrentStep('top10');
    };

    const handleReset = () => {
        setStudentData(null);
        setApiResponse(null);
        setCurrentStep('intro');
        setError(null);
    };

    // ============================================
    // STEP PROGRESS INDICATOR
    // ============================================
    
    const steps = [
        { id: 'intro', label: '📖 التعريف', icon: '📖' },
        { id: 'form', label: '📝 الملف الشخصي', icon: '📝' },
        { id: 'domains', label: '📊 المجالات', icon: '📊' },
        { id: 'top10', label: '🏆 أفضل 10', icon: '🏆' },
        { id: 'all', label: '📋 الجميع', icon: '📋' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const renderProgressBar = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '30px',
            padding: '15px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            flexWrap: 'wrap',
            direction: 'ltr'
        }}>
            {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                    <React.Fragment key={step.id}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                                           isCompleted ? '#e8f5e9' : '#f5f5f5',
                                color: isActive ? 'white' : 
                                       isCompleted ? '#2e7d32' : '#999',
                                fontWeight: isActive ? 'bold' : 'normal',
                                transition: 'all 0.3s',
                                border: isActive ? '2px solid #667eea' : 'none',
                                boxShadow: isActive ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                            }}
                        >
                            <span>{step.icon}</span>
                            <span style={{ fontSize: '13px' }}>{step.label}</span>
                            {isCompleted && <span style={{ fontSize: '12px' }}>✅</span>}
                        </div>
                        
                        {index < steps.length - 1 && (
                            <div style={{
                                width: '30px',
                                height: '2px',
                                background: index < currentStepIndex ? '#2ecc71' : '#ddd',
                                borderRadius: '2px'
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    // ============================================
    // RENDER STEP CONTENT
    // ============================================
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 'intro':
                return <IntroToPostBac onNext={handleIntroNext} />;
            
            case 'form':
                return <InputForm onSubmit={handleFormSubmit} />;
            
            case 'domains':
                return (
                    <Domains 
                        studentData={studentData}
                        apiResponse={apiResponse}
                        loading={loading}
                        error={error}
                        onNext={handleDomainsNext}
                    />
                );
            
            case 'top10':
                return (
                    <Top10 
                        studentData={studentData}
                        apiResponse={apiResponse}
                        loading={loading}
                        error={error}
                        onNext={handleTop10Next}
                        onBack={handleTop10Back}
                    />
                );
            
            case 'all':
                return (
                    <All 
                        studentData={studentData}
                        apiResponse={apiResponse}
                        loading={loading}
                        error={error}
                        onBack={handleAllBack}
                    />
                );
            
            default:
                return <IntroToPostBac onNext={handleIntroNext} />;
        }
    };

    // ============================================
    // RENDER
    // ============================================
    
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: '#f8f9fa',
            minHeight: '100vh',
            direction: 'rtl'
        }}>
            {/* Header with Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <Link
                        to="/dashboard"
                        style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontSize: '16px',
                            padding: '10px 20px',
                            border: '2px solid #667eea',
                            borderRadius: '12px',
                            display: 'inline-block',
                            transition: 'all 0.3s',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#667eea';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#667eea';
                        }}
                    >
                        ← لوحة التحكم
                    </Link>
                    
                    <h1 style={{
                        margin: 0,
                        fontSize: '24px',
                        color: '#333',
                        fontWeight: '600'
                    }}>
                        🎓 التوجيه بعد البكالوريا
                    </h1>
                </div>

                {/* Reset button */}
                {currentStep !== 'intro' && (
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '10px 24px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#e74c3c',
                            background: 'white',
                            border: '2px solid #e74c3c',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e74c3c';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#e74c3c';
                        }}
                    >
                        🔄 بحث جديد
                    </button>
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    marginBottom: '20px',
                    color: '#dc2626',
                    textAlign: 'right',
                    fontSize: '14px'
                }}>
                    ❌ {error}
                </div>
            )}

            {/* Loading Banner */}
            {loading && (
                <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    marginBottom: '20px',
                    color: '#2563eb',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    ⏳ جاري تحليل ملفك الشخصي... قد يستغرق هذا بضع ثوانٍ
                </div>
            )}

            {/* Progress Bar - Hide on intro step */}
            {currentStep !== 'intro' && renderProgressBar()}

            {/* Step Content */}
            <div style={{
                background: 'transparent',
                borderRadius: '20px'
            }}>
                {renderStepContent()}
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '40px',
                padding: '20px',
                textAlign: 'center',
                borderTop: '1px solid #e0e0e0',
                color: '#888',
                fontSize: '13px'
            }}>
                <p style={{ margin: 0 }}>
                    🎓 منصة التوجيه بعد البكالوريا - بناءً على بيانات ملفك الشخصي
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                    يتم إنشاء التوصيات بناءً على شعبتك ومعدلك وتفضيلاتك
                </p>
            </div>
        </div>
    );
};

export default PostBacPage;