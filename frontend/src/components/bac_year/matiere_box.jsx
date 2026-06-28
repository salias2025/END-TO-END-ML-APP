import React, { useState, useEffect, useRef } from 'react';

export default function MatiereBox({ 
  name, 
  coefficient, 
  icon, 
  grade = null,
  onClick = null,
  isActive = false,
  color = '#667eea',
  emoji = '📚'
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);

  // Generate floating particles on hover
  useEffect(() => {
    if (isHovered) {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          speed: Math.random() * 2 + 1,
          angle: Math.random() * 360,
          opacity: Math.random() * 0.5 + 0.2,
          color: color
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered, color]);

  // Mouse tracking for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!boxRef.current) return;
      const rect = boxRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    const box = boxRef.current;
    if (box) {
      box.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (box) {
        box.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    if (onClick) onClick();
  };

  const subjectColors = {
    'maths': { 
      bg: 'linear-gradient(145deg, rgba(124,92,252,0.25), rgba(79,70,229,0.08))',
      border: '#7c5cfc',
      glow: 'rgba(124,92,252,0.4)',
      gradient: 'linear-gradient(135deg, #7c5cfc, #4f46e5)',
      iconBg: 'rgba(124,92,252,0.25)',
      darkGlow: 'rgba(124,92,252,0.6)'
    },
    'physics': { 
      bg: 'linear-gradient(145deg, rgba(56,189,248,0.25), rgba(14,165,233,0.08))',
      border: '#38bdf8',
      glow: 'rgba(56,189,248,0.4)',
      gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
      iconBg: 'rgba(56,189,248,0.25)',
      darkGlow: 'rgba(56,189,248,0.6)'
    },
    'science': { 
      bg: 'linear-gradient(145deg, rgba(45,212,191,0.25), rgba(20,184,166,0.08))',
      border: '#2dd4bf',
      glow: 'rgba(45,212,191,0.4)',
      gradient: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
      iconBg: 'rgba(45,212,191,0.25)',
      darkGlow: 'rgba(45,212,191,0.6)'
    },
    'arabic': { 
      bg: 'linear-gradient(145deg, rgba(251,191,36,0.25), rgba(245,158,11,0.08))',
      border: '#fbbf24',
      glow: 'rgba(251,191,36,0.4)',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      iconBg: 'rgba(251,191,36,0.25)',
      darkGlow: 'rgba(251,191,36,0.6)'
    },
    'french': { 
      bg: 'linear-gradient(145deg, rgba(244,114,182,0.25), rgba(236,72,153,0.08))',
      border: '#f472b6',
      glow: 'rgba(244,114,182,0.4)',
      gradient: 'linear-gradient(135deg, #f472b6, #ec4899)',
      iconBg: 'rgba(244,114,182,0.25)',
      darkGlow: 'rgba(244,114,182,0.6)'
    },
    'english': { 
      bg: 'linear-gradient(145deg, rgba(52,211,153,0.25), rgba(16,185,129,0.08))',
      border: '#34d399',
      glow: 'rgba(52,211,153,0.4)',
      gradient: 'linear-gradient(135deg, #34d399, #10b981)',
      iconBg: 'rgba(52,211,153,0.25)',
      darkGlow: 'rgba(52,211,153,0.6)'
    },
    'philo': { 
      bg: 'linear-gradient(145deg, rgba(167,139,250,0.25), rgba(124,92,252,0.08))',
      border: '#a78bfa',
      glow: 'rgba(167,139,250,0.4)',
      gradient: 'linear-gradient(135deg, #a78bfa, #7c5cfc)',
      iconBg: 'rgba(167,139,250,0.25)',
      darkGlow: 'rgba(167,139,250,0.6)'
    },
    'history': { 
      bg: 'linear-gradient(145deg, rgba(251,146,60,0.25), rgba(249,115,22,0.08))',
      border: '#fb923c',
      glow: 'rgba(251,146,60,0.4)',
      gradient: 'linear-gradient(135deg, #fb923c, #f97316)',
      iconBg: 'rgba(251,146,60,0.25)',
      darkGlow: 'rgba(251,146,60,0.6)'
    },
    'islamic': { 
      bg: 'linear-gradient(145deg, rgba(96,165,250,0.25), rgba(59,130,246,0.08))',
      border: '#60a5fa',
      glow: 'rgba(96,165,250,0.4)',
      gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      iconBg: 'rgba(96,165,250,0.25)',
      darkGlow: 'rgba(96,165,250,0.6)'
    },
    'tamazight': { 
      bg: 'linear-gradient(145deg, rgba(244,63,94,0.25), rgba(225,29,72,0.08))',
      border: '#f43f5e',
      glow: 'rgba(244,63,94,0.4)',
      gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      iconBg: 'rgba(244,63,94,0.25)',
      darkGlow: 'rgba(244,63,94,0.6)'
    },
    'economics': { 
      bg: 'linear-gradient(145deg, rgba(251,191,36,0.25), rgba(245,158,11,0.08))',
      border: '#fbbf24',
      glow: 'rgba(251,191,36,0.4)',
      gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      iconBg: 'rgba(251,191,36,0.25)',
      darkGlow: 'rgba(251,191,36,0.6)'
    },
    'management': { 
      bg: 'linear-gradient(145deg, rgba(79,70,229,0.25), rgba(67,56,202,0.08))',
      border: '#4f46e5',
      glow: 'rgba(79,70,229,0.4)',
      gradient: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      iconBg: 'rgba(79,70,229,0.25)',
      darkGlow: 'rgba(79,70,229,0.6)'
    },
    'law': { 
      bg: 'linear-gradient(145deg, rgba(139,92,246,0.25), rgba(124,58,237,0.08))',
      border: '#8b5cf6',
      glow: 'rgba(139,92,246,0.4)',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      iconBg: 'rgba(139,92,246,0.25)',
      darkGlow: 'rgba(139,92,246,0.6)'
    },
    'technology': { 
      bg: 'linear-gradient(145deg, rgba(6,182,212,0.25), rgba(8,145,178,0.08))',
      border: '#06b6d4',
      glow: 'rgba(6,182,212,0.4)',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      iconBg: 'rgba(6,182,212,0.25)',
      darkGlow: 'rgba(6,182,212,0.6)'
    },
    'default': { 
      bg: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
      border: '#666',
      glow: 'rgba(255,255,255,0.15)',
      gradient: 'linear-gradient(135deg, #666, #444)',
      iconBg: 'rgba(255,255,255,0.08)',
      darkGlow: 'rgba(255,255,255,0.2)'
    }
  };

  const colors = subjectColors[icon] || subjectColors['default'];

  const getGradeColor = (grade) => {
    if (grade === null || grade === undefined) return null;
    if (grade >= 16) return { color: '#28a745', label: 'ممتاز', emoji: '🌟', shadow: 'rgba(40,167,69,0.4)' };
    if (grade >= 14) return { color: '#667eea', label: 'جيد جداً', emoji: '✨', shadow: 'rgba(102,126,234,0.4)' };
    if (grade >= 12) return { color: '#fbbf24', label: 'جيد', emoji: '📚', shadow: 'rgba(251,191,36,0.4)' };
    if (grade >= 10) return { color: '#fb923c', label: 'مقبول', emoji: '⚠️', shadow: 'rgba(251,146,60,0.4)' };
    return { color: '#dc3545', label: 'ضعيف', emoji: '🔴', shadow: 'rgba(220,53,69,0.4)' };
  };

  const gradeInfo = getGradeColor(grade);

  const getSubjectIcon = (iconName) => {
    const icons = {
      'maths': '📐',
      'physics': '⚡',
      'science': '🔬',
      'arabic': '📖',
      'french': '🗣️',
      'english': '🌍',
      'philo': '💭',
      'history': '🏛️',
      'islamic': '🕌',
      'tamazight': 'ⵣ',
      'economics': '💰',
      'management': '📊',
      'law': '⚖️',
      'technology': '💻',
      'default': '📚'
    };
    return icons[iconName] || icons['default'];
  };

  // 3D tilt transform
  const tiltX = mousePosition.y * -15;
  const tiltY = mousePosition.x * 15;
  const tiltTransform = isHovered ? `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` : 'perspective(800px) rotateX(0) rotateY(0)';

  return (
    <div
      ref={boxRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        background: colors.bg,
        border: `2px solid ${isActive ? colors.border : isHovered ? colors.border + '99' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '24px',
        padding: '28px 22px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isActive 
          ? `0 0 60px ${colors.glow}, 0 0 120px ${colors.glow}22, inset 0 0 40px ${colors.glow}22` 
          : isHovered 
            ? `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${colors.glow}` 
            : '0 4px 25px rgba(0,0,0,0.2)',
        transform: isClicked 
          ? `${tiltTransform} scale(0.95)` 
          : isHovered 
            ? `${tiltTransform} translateY(-12px) scale(1.03)` 
            : tiltTransform,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '200px',
        width: '100%',
        userSelect: 'none',
        backdropFilter: 'blur(20px)',
        willChange: 'transform'
      }}
    >
      {/* ============================================
          ANIMATED BACKGROUND EFFECTS
          ============================================ */}
      
      {/* Pulsing Glow Ring */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120%',
        paddingBottom: '120%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.glow}22, transparent 70%)`,
        pointerEvents: 'none',
        animation: isActive ? 'ringPulse 2s ease-in-out infinite' : 'none',
        opacity: isHovered ? 0.8 : 0.2,
        transition: 'opacity 0.6s'
      }} />

      {/* Floating Particles on Hover */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            animation: `floatParticle ${p.speed}s ease-in-out infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}44`
          }}
        />
      ))}

      {/* Shimmer Overlay on Hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
      )}

      {/* ============================================
          SUBJECT ICON WITH RING
          ============================================ */}
      <div style={{
        position: 'relative',
        marginBottom: '14px',
        zIndex: 1
      }}>
        {/* Animated Ring */}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '50%',
          border: `2px solid ${colors.border}33`,
          animation: isHovered ? 'spinRing 4s linear infinite' : 'none',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: `2px dashed ${colors.border}22`,
          animation: isHovered ? 'spinRing 6s linear infinite reverse' : 'none',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: `linear-gradient(145deg, ${colors.iconBg}, ${colors.iconBg}44)`,
          border: `2px solid ${colors.border}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          position: 'relative',
          zIndex: 2,
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: isHovered ? 'scale(1.15) rotate(-8deg)' : 'scale(1) rotate(0)',
          boxShadow: isActive ? `0 0 40px ${colors.glow}` : isHovered ? `0 0 30px ${colors.glow}66` : 'none'
        }}>
          {getSubjectIcon(icon)}
          {/* Icon glow */}
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '22px',
            background: `linear-gradient(135deg, ${colors.border}44, transparent)`,
            opacity: isHovered ? 0.5 : 0,
            transition: 'opacity 0.5s',
            pointerEvents: 'none'
          }} />
        </div>
      </div>

      {/* ============================================
          SUBJECT NAME WITH EMOJI
          ============================================ */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '4px'
      }}>
        <span style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#fff',
          textShadow: isActive ? `0 0 30px ${colors.glow}` : 'none',
          background: isActive ? `linear-gradient(135deg, #fff, ${colors.border})` : 'none',
          WebkitBackgroundClip: isActive ? 'text' : 'unset',
          WebkitTextFillColor: isActive ? 'transparent' : 'white'
        }}>
          {name}
        </span>
        <span style={{
          fontSize: '18px',
          display: isHovered ? 'inline-block' : 'none',
          animation: isHovered ? 'wave 1.5s ease-in-out infinite' : 'none'
        }}>
          {emoji}
        </span>
      </div>

      {/* ============================================
          COEFFICIENT
          ============================================ */}
      <div style={{
        fontSize: '13px',
        color: 'rgba(255,255,255,0.4)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: grade !== null ? '10px' : '0'
      }}>
        <span>المعامل</span>
        <span style={{
          fontWeight: '700',
          color: colors.border,
          fontSize: '17px',
          background: `rgba(${colors.border.replace('#', '').match(/.{2}/g).join(',')}, 0.15)`,
          padding: '2px 14px',
          borderRadius: '10px',
          boxShadow: isHovered ? `0 0 20px ${colors.glow}44` : 'none',
          transition: 'all 0.3s'
        }}>
          {coefficient}
        </span>
      </div>

      {/* ============================================
          GRADE SECTION
          ============================================ */}
      {grade !== null && grade !== undefined ? (
        <div style={{
          marginTop: '10px',
          padding: '8px 16px',
          borderRadius: '14px',
          background: gradeInfo ? `rgba(${gradeInfo.color.replace('#', '').match(/.{2}/g).join(',')}, 0.12)` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${gradeInfo ? gradeInfo.color : 'transparent'}33`,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.4s',
          width: '100%',
          boxShadow: isHovered && gradeInfo ? `0 0 30px ${gradeInfo.shadow}` : 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: gradeInfo ? gradeInfo.color : '#fff',
              textShadow: isHovered && gradeInfo ? `0 0 20px ${gradeInfo.shadow}` : 'none'
            }}>
              {grade}/20
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: gradeInfo ? gradeInfo.color : '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '16px' }}>{gradeInfo ? gradeInfo.emoji : ''}</span>
              {gradeInfo ? gradeInfo.label : ''}
            </span>
          </div>
          
          {/* Animated Progress Bar */}
          <div style={{
            width: '100%',
            height: '5px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              width: `${(grade / 20) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${gradeInfo ? gradeInfo.color : '#667eea'}, ${gradeInfo ? gradeInfo.color : '#a78bfa'})`,
              borderRadius: '3px',
              transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: `0 0 20px ${gradeInfo ? gradeInfo.shadow : 'transparent'}`,
              position: 'relative'
            }}>
              {/* Progress bar shimmer */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shimmer 2s ease-in-out infinite'
              }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          marginTop: '10px',
          padding: '6px 14px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s'
        }}>
          <span style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ fontSize: '14px' }}>📝</span>
            لم يتم التسجيل بعد
          </span>
        </div>
      )}

      {/* ============================================
          ACTIVE INDICATOR
          ============================================ */}
      {isActive && (
        <>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: colors.gradient,
            borderRadius: '0 0 24px 24px',
            boxShadow: `0 0 30px ${colors.glow}`,
            animation: 'pulseGlow 2s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#2dd4bf',
            boxShadow: '0 0 20px rgba(45,212,191,0.6)',
            animation: 'pulseDot 1.5s ease-in-out infinite'
          }} />
        </>
      )}

      {/* ============================================
          STYLES
          ============================================ */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes ringPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(-20px, -30px) scale(1.5); opacity: 0.8; }
          50% { transform: translate(15px, -15px) scale(0.8); opacity: 0.5; }
          75% { transform: translate(-10px, 20px) scale(1.2); opacity: 0.7; }
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        /* Smooth hover transitions for all elements */
        * {
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
}