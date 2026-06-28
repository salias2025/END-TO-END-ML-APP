// frontend/src/pages/pre_bac/PreBacPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import all pre-bac components
import IntroductionToPreBac from '../components/pre_bac/introduction_to_pre_bac';
import InputForm from '../components/pre_bac/input_form';
import Cluster from '../components/pre_bac/cluster';
import Similarity from '../components/pre_bac/similarity';
import Derived from '../components/pre_bac/derived';

export default function PreBacPage() {
  const [activeTab, setActiveTab] = useState('introduction');
  const [studentData, setStudentData] = useState(null);
  const [results, setResults] = useState(null);
  const [matchResults, setMatchResults] = useState(null);
  const [featureValues, setFeatureValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
  // HANDLE FORM SUBMIT - Send to Backend + Save
  // ============================================
  const handleFormSubmit = async (data) => {
    setStudentData(data);
    setIsLoading(true);
    setError('');
    setActiveTab('cluster');

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('❌ يرجى تسجيل الدخول أولاً');
        setIsLoading(false);
        return;
      }

      // Step 1: Predict
      const response = await fetch(`${API_URL}/api/prebac/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      console.log('📦 Prediction response:', result);

      if (result.success) {
        setResults(result.data);
        setFeatureValues(result.derived_features);

        // ✅ Step 2: Save to database
        try {
          const saveData = {
            filiere: data.filiere,
            predicted_bac_avg: result.data.predicted_bac,
            cluster_id: result.data.cluster_id,
            cluster_name: result.data.cluster_name,
            archetype: result.data.archetype,
            derived_features: result.derived_features || {}
          };

          const saveResponse = await fetch(`${API_URL}/api/prebac/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saveData)
          });

          const saveResult = await saveResponse.json();

          if (saveResult.success) {
            console.log('✅ Pre-BAC results saved to database!');
          } else {
            console.warn('⚠️ Failed to save results:', saveResult.message);
          }
        } catch (saveError) {
          console.error('❌ Save error:', saveError);
          // Don't block the UI - prediction already succeeded
        }

      } else {
        setError(result.message || '❌ حدث خطأ في تحليل البيانات');
        setResults(null);
      }
    } catch (error) {
      console.error('❌ Prediction error:', error);
      setError('❌ حدث خطأ في الاتصال بالخادم');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE FIND MATCH - Send to Backend
  // ============================================
  const handleFindMatch = async () => {
    if (!studentData) {
      setError('❌ يرجى إدخال بياناتك أولاً');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('❌ يرجى تسجيل الدخول أولاً');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/prebac/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      console.log('📦 Match response:', result);

      if (result.success) {
        setMatchResults(result.data);
        setActiveTab('similarity');

        // ✅ Save match results to database
        try {
          const updateData = {
            matched_student_id: result.data.matched_student_id,
            match_similarity: result.data.match_similarity
          };

          await fetch(`${API_URL}/api/prebac/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });
        } catch (saveError) {
          console.error('❌ Save match error:', saveError);
        }

      } else {
        setError(result.message || '❌ حدث خطأ في البحث عن الطالب المطابق');
      }
    } catch (error) {
      console.error('❌ Match error:', error);
      setError('❌ حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // HANDLE DERIVED FEATURES - Get from Backend
  // ============================================
  const handleGetDerivedFeatures = async () => {
    if (!studentData) {
      setError('❌ يرجى إدخال بياناتك أولاً');
      return;
    }

    // If we already have features from prediction, use them
    if (featureValues) {
      setActiveTab('derived');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('❌ يرجى تسجيل الدخول أولاً');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/prebac/features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      console.log('📦 Features response:', result);

      if (result.success) {
        setFeatureValues(result.data);
        setActiveTab('derived');
      } else {
        setError(result.message || '❌ حدث خطأ في حساب المعالم المشتقة');
      }
    } catch (error) {
      console.error('❌ Features error:', error);
      setError('❌ حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // TABS CONFIGURATION
  // ============================================
  const tabs = [
    { id: 'introduction', label: '📖 التعريف', icon: '📖' },
    { id: 'input', label: '📝 إدخال البيانات', icon: '📝' },
    { id: 'cluster', label: '📊 مجموعتك', icon: '📊' },
    { id: 'similarity', label: '🔍 الطالب المطابق', icon: '🔍' },
    { id: 'derived', label: '🧠 المعالم المشتقة', icon: '🧠' }
  ];

  // ============================================
  // RENDER CONTENT
  // ============================================
  const renderContent = () => {
    switch (activeTab) {
      case 'introduction':
        return <IntroductionToPreBac />;
      
      case 'input':
        return <InputForm onFormSubmit={handleFormSubmit} />;
      
      case 'cluster':
        if (isLoading) {
          return <LoadingSpinner message="جاري تحليل ملفك الشخصي..." />;
        }
        if (error) {
          return <ErrorMessage message={error} onRetry={() => handleFormSubmit(studentData)} />;
        }
        if (!results) {
          return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                📝 يرجى إدخال بياناتك أولاً للبدء
              </p>
              <button
                onClick={() => setActiveTab('input')}
                style={{
                  marginTop: '15px',
                  padding: '12px 30px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                📝 اذهب إلى إدخال البيانات
              </button>
            </div>
          );
        }
        return <Cluster studentData={studentData} results={results} />;
      
      case 'similarity':
        if (isLoading) {
          return <LoadingSpinner message="جاري البحث عن أفضل طالب مطابق..." />;
        }
        if (error) {
          return <ErrorMessage message={error} onRetry={handleFindMatch} />;
        }
        if (!matchResults) {
          return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                🔍 قم بالبحث عن طالب مطابق لملفك الشخصي
              </p>
              <button
                onClick={handleFindMatch}
                style={{
                  marginTop: '15px',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔍 ابحث عن طالب مطابق
              </button>
            </div>
          );
        }
        return <Similarity studentData={studentData} matchResults={matchResults} />;
      
      case 'derived':
        if (isLoading) {
          return <LoadingSpinner message="جاري حساب المعالم المشتقة..." />;
        }
        if (error) {
          return <ErrorMessage message={error} onRetry={handleGetDerivedFeatures} />;
        }
        if (!featureValues) {
          return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>
                🧠 احسب المعالم المشتقة لتفهم ملفك الشخصي بشكل أعمق
              </p>
              <button
                onClick={handleGetDerivedFeatures}
                style={{
                  marginTop: '15px',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🧠 احسب المعالم المشتقة
              </button>
            </div>
          );
        }
        return <Derived studentData={studentData} featureValues={featureValues} />;
      
      default:
        return <IntroductionToPreBac />;
    }
  };

  // ============================================
  // LOADING SPINNER COMPONENT
  // ============================================
  const LoadingSpinner = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div style={{ fontSize: '48px' }}>⏳</div>
      <h2 style={{ color: '#333' }}>{message}</h2>
      <p style={{ color: '#666' }}>الرجاء الانتظار، هذا قد يستغرق بضع ثوانٍ</p>
      <div style={{
        width: '60px',
        height: '60px',
        margin: '20px auto',
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // ============================================
  // ERROR MESSAGE COMPONENT
  // ============================================
  const ErrorMessage = ({ message, onRetry }) => (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px',
      background: '#fff5f5',
      borderRadius: '15px',
      border: '1px solid #fcc'
    }}>
      <div style={{ fontSize: '48px' }}>❌</div>
      <h2 style={{ color: '#c0392b' }}>حدث خطأ</h2>
      <p style={{ color: '#666' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '15px',
            padding: '10px 30px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🔄 إعادة المحاولة
        </button>
      )}
    </div>
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      direction: 'rtl'
    }}>
      {/* Back to Dashboard Button */}
      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#667eea',
            textDecoration: 'none',
            fontSize: '16px',
            padding: '10px 20px',
            border: '1px solid #667eea',
            borderRadius: '12px',
            transition: 'all 0.3s'
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
          ← العودة إلى لوحة التحكم
        </Link>
      </div>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>📖 قبل البكالوريا</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          حلل مستواك من البريفيه إلى 2AS واكتشف نقاط قوتك وضعفك
        </p>
      </div>

      {/* Error Banner */}
      {error && activeTab !== 'cluster' && activeTab !== 'similarity' && activeTab !== 'derived' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#f87171',
          fontSize: '14px',
          textAlign: 'right'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '30px',
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '15px',
        border: '1px solid #eee'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setError('');
              setActiveTab(tab.id);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? '#667eea' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#555',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'all 0.3s',
              flex: '1',
              minWidth: '120px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = '#e8f4f8';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        minHeight: '400px'
      }}>
        {renderContent()}
      </div>

      {/* Quick Navigation for Results */}
      {results && activeTab === 'cluster' && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          padding: '15px',
          background: '#e8f4f8',
          borderRadius: '15px'
        }}>
          <p style={{ fontSize: '16px', color: '#333' }}>
            📌 <strong>الخطوة التالية:</strong> ابحث عن أفضل طالب مطابق لك
          </p>
          <button
            onClick={handleFindMatch}
            style={{
              marginTop: '10px',
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🔍 ابحث عن طالب مطابق
          </button>
        </div>
      )}

      {/* Next Steps after Matching */}
      {matchResults && activeTab === 'similarity' && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '15px'
        }}>
          <p style={{ fontSize: '16px', color: '#333' }}>
            📌 <strong>الخطوة التالية:</strong> افهم كيف حسبنا هذه المعالم وماذا تعني
          </p>
          <button
            onClick={handleGetDerivedFeatures}
            style={{
              marginTop: '10px',
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🧠 شرح المعالم المشتقة
          </button>
        </div>
      )}
    </div>
  );
}