import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [particles, setParticles] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Animated background particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.05
      });
    }
    setParticles(newParticles);
  }, []);

  const phases = [
    {
      id: 'pre_bac',
      title: 'قبل البكالوريا',
      icon: '📖',
      description: 'تحليل المستوى من البريفيه إلى 2AS',
      features: [
        'تحليل شامل للمستوى (بريفيه + 1AS + 2AS)',
        'تقييم نقاط القوة والضعف في كل مادة',
        'خطة أسبوعية مخصصة للتحضير'
      ],
      color: '#7c5cfc',
      gradient: 'linear-gradient(135deg, #7c5cfc, #4f46e5)',
      path: '/pre-bac',
      emoji: '🌟'
    },
    {
      id: 'bac_year',
      title: 'سنة البكالوريا',
      icon: '🎓',
      description: 'تتبع وتحليل المواد والتنبؤ بالمعدل',
      features: [
        'تتبع المواد وتقديم توصيات',
        'توزيع الوقت والميزانية الدراسية',
        'توقع معدل البكالوريا بدقة'
      ],
      color: '#f472b6',
      gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
      path: '/bac-year',
      emoji: '🔥'
    },
    {
      id: 'post_bac',
      title: 'بعد البكالوريا',
      icon: '🚀',
      description: 'التوجيه واختيار المسار المناسب',
      features: [
        'دليل كامل للشعب والجامعات',
        'محاكاة النقاط وشروط القبول',
        'فرص مهنية حسب كل شعبة'
      ],
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      path: '/post-bac',
      emoji: '💫'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0d1a',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ============================================
          ANIMATED BACKGROUND
          ============================================ */}
      
      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        right: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124,92,252,0.10) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 25s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-15%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 30s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulseOrb 8s ease-in-out infinite'
      }} />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'white',
            borderRadius: '50%',
            opacity: p.opacity,
            animation: `floatParticle ${p.speed * 10}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* ============================================
          HEADER
          ============================================ */}
      <div style={{
        textAlign: 'center',
        marginBottom: '52px',
        animation: 'fadeInDown 0.8s ease-out'
      }}>
        {/* Animated Logo */}
        <div style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(145deg, #a78bfa, #7c5cfc, #4f46e5)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 0 60px rgba(124,92,252,0.3), 0 0 120px rgba(124,92,252,0.1)',
          animation: 'pulseGlow 3s ease-in-out infinite',
          position: 'relative'
        }}>
          🎓
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(124,92,252,0.3), transparent)',
            animation: 'spinGlow 6s linear infinite',
            zIndex: -1
          }} />
        </div>
        
        <h1 style={{
          color: 'white',
          fontSize: '36px',
          marginBottom: '8px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          مرحباً بك في BacAidz
        </h1>
        <p style={{
          color: '#9a95b8',
          fontSize: '16px',
          fontWeight: '400',
          letterSpacing: '0.3px'
        }}>
          اختر المرحلة التي تريد استكشافها
        </p>
      </div>

      {/* ============================================
          CARDS GRID
          ============================================ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        maxWidth: '1100px',
        width: '100%',
        animation: 'fadeInUp 0.8s ease-out 0.2s both'
      }}>
        {phases.map((phase, index) => (
          <Link
            key={phase.id}
            to={phase.path}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${hoveredCard === phase.id ? phase.color : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '28px',
                padding: '34px 30px',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: hoveredCard === phase.id 
                  ? `0 30px 80px ${phase.color}33, 0 0 60px ${phase.color}11` 
                  : '0 10px 40px rgba(0,0,0,0.3)',
                transform: hoveredCard === phase.id ? 'translateY(-10px) scale(1.01)' : 'translateY(0) scale(1)',
                animation: `slideUpCard 0.6s ease-out ${0.3 + index * 0.15}s both`
              }}
              onMouseEnter={() => setHoveredCard(phase.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle at 70% 20%, ${phase.color}11, transparent 60%)`,
                pointerEvents: 'none',
                transition: 'all 0.5s ease',
                opacity: hoveredCard === phase.id ? 1 : 0.5
              }} />

              {/* Shine effect on hover */}
              {hoveredCard === phase.id && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${phase.color}08, transparent 50%)`,
                  pointerEvents: 'none',
                  animation: 'shine 2s ease-in-out infinite'
                }} />
              )}

              {/* Icon with animated ring */}
              <div style={{
                position: 'relative',
                marginBottom: '18px',
                width: 'fit-content'
              }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  background: phase.gradient,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                  boxShadow: `0 0 40px ${phase.color}44, 0 0 80px ${phase.color}11`,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.5s ease',
                  transform: hoveredCard === phase.id ? 'scale(1.05) rotate(-5deg)' : 'scale(1) rotate(0deg)'
                }}>
                  {phase.icon}
                </div>
                {/* Pulsing ring */}
                <div style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '22px',
                  border: `2px solid ${phase.color}33`,
                  animation: hoveredCard === phase.id ? 'pulseRing 1.5s ease-in-out infinite' : 'none',
                  pointerEvents: 'none'
                }} />
              </div>

              {/* Title with emoji */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '6px'
              }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700',
                  position: 'relative',
                  zIndex: 1,
                  margin: 0
                }}>
                  {phase.title}
                </h2>
                <span style={{
                  fontSize: '20px',
                  animation: hoveredCard === phase.id ? 'wave 1.5s ease-in-out infinite' : 'none'
                }}>
                  {phase.emoji}
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: '#9a95b8',
                fontSize: '14px',
                marginBottom: '18px',
                position: 'relative',
                zIndex: 1,
                lineHeight: '1.5'
              }}>
                {phase.description}
              </p>

              {/* Features List */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                position: 'relative',
                zIndex: 1,
                flex: 1
              }}>
                {phase.features.map((feature, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: hoveredCard === phase.id ? '#e8e0ff' : '#c4b5fd',
                    fontSize: '13px',
                    padding: '6px 0',
                    borderBottom: i < phase.features.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{
                      color: phase.color,
                      fontSize: '12px',
                      transition: 'all 0.3s ease',
                      transform: hoveredCard === phase.id ? 'scale(1.2)' : 'scale(1)'
                    }}>✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Arrow Button with animated underline */}
              <div style={{
                marginTop: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: hoveredCard === phase.id ? '14px' : '8px',
                color: phase.color,
                fontSize: '14px',
                fontWeight: '600',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                paddingBottom: '4px',
                width: 'fit-content'
              }}>
                <span>استكشف</span>
                <span style={{
                  fontSize: '20px',
                  transition: 'all 0.4s ease',
                  transform: hoveredCard === phase.id ? 'translateX(4px)' : 'translateX(0)'
                }}>→</span>
                {/* Underline animation */}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: hoveredCard === phase.id ? '100%' : '0%',
                  background: phase.gradient,
                  transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  borderRadius: '2px'
                }} />
              </div>

              {/* Bottom gradient bar */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${phase.color}, ${phase.color}44, transparent)`,
                opacity: hoveredCard === phase.id ? 0.8 : 0.3,
                transition: 'all 0.5s ease'
              }} />

              {/* Corner accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle at top right, ${phase.color}11, transparent 70%)`,
                borderRadius: '0 28px 0 0',
                pointerEvents: 'none'
              }} />
            </div>
          </Link>
        ))}
      </div>

      {/* ============================================
          FOOTER
          ============================================ */}
      <div style={{
        marginTop: '48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        animation: 'fadeInUp 0.8s ease-out 0.8s both'
      }}>
        <Link
          to="/"
          style={{
            color: '#9a95b8',
            fontSize: '14px',
            textDecoration: 'none',
            padding: '12px 28px',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(10px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#7c5cfc';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.background = 'rgba(124,92,252,0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(124,92,252,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = '#9a95b8';
            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          العودة إلى الصفحة الرئيسية
        </Link>
        
        <p style={{
          color: '#5a5578',
          fontSize: '12px',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
          © 2025 BacAidz — رحلتك نحو النجاح
        </p>
      </div>

      {/* ============================================
          STYLES
          ============================================ */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        @keyframes pulseOrb {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -40px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(124,92,252,0.3); }
          50% { box-shadow: 0 0 80px rgba(124,92,252,0.5), 0 0 120px rgba(124,92,252,0.15); }
        }

        @keyframes spinGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUpCard {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }

        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}