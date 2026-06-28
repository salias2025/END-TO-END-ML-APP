// src/bac_year/bac_year_page.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import MatiereBox from '../components/bac_year/matiere_box';
import Table_Coefs from '../components/bac_year/table_coefs';
import AvgBacCalc from '../components/bac_year/avg_bac_calc';
import Ressource from '../components/bac_year/ressource';
import Budget from '../components/bac_year/budget';
import TodoList from '../components/bac_year/to_do';
import Timetable from '../components/bac_year/timetable';
// Import all subject modules
import Arabic from './arabic';
import French from './french';
import English from './english';
import Tamazight from './tamazight';
import LangueEtrangere from './langue_etrangere';
import Maths from './maths';
import Physics from './physics';
import Science from './science';
import Techno from './techno';
import Gestion from './gestion';
import Economie from './economie';
import Loi from './loi';
import Philo from './philo';
import Islamia from './islamia';
import HisGeo from './his_geo';

// ============================================
// API BASE URL
// ============================================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
// GET AUTH TOKEN
// ============================================
const getAuthToken = () => {
    return localStorage.getItem('token');
};

export default function BacYearPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]); // ← ADDED: Share tasks between TodoList and Timetable
    const [activeNav, setActiveNav] = useState('subjects');
    const [particles, setParticles] = useState([]);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrolled, setScrolled] = useState(false);
    const containerRef = useRef(null);

    // Animated background particles
    useEffect(() => {
        const newParticles = [];
        for (let i = 0; i < 50; i++) {
            newParticles.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1,
                speed: Math.random() * 0.5 + 0.2,
                delay: Math.random() * 5,
                opacity: Math.random() * 0.4 + 0.05,
                pulseSpeed: Math.random() * 2 + 1,
                orbitRadius: Math.random() * 50 + 20,
                orbitSpeed: Math.random() * 0.5 + 0.1,
                orbitAngle: Math.random() * 360
            });
        }
        setParticles(newParticles);

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // ============================================
    // LOAD USER DATA AND SUBJECT SCORES FROM DB
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const currentUser = getUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            setUser(currentUser);

            const filiere = currentUser.filiere || 'sciences_experimentales';
            const filiereData = filiereSubjects[filiere];

            if (!filiereData) {
                setLoading(false);
                return;
            }

            const token = getAuthToken();
            let scoresData = {};

            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/bacyear/results`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success) {
                            scoresData = result.data || {};
                        }
                    }
                } catch (error) {
                    console.error('Error fetching results:', error);
                }
            }

            const subjectsWithScores = filiereData.subjects.map(subject => {
                const subjectResult = scoresData[subject.path] || null;
                return {
                    ...subject,
                    grade: subjectResult?.predicted_score || null,
                    predicted: !!subjectResult
                };
            });

            setSubjects(subjectsWithScores);
            setLoading(false);
        };

        loadData();
    }, [navigate]);

    // Subject data for each filière (NO HARDCODED GRADES!)
    const filiereSubjects = {
        'sciences_experimentales': {
            name: 'العلوم التجريبية',
            icon: '🔬',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            subjects: [
                { name: 'الرياضيات', coeff: 5, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'الفيزياء', coeff: 5, icon: 'physics', path: 'physics', color: '#f093fb', emoji: '⚡' },
                { name: 'العلوم', coeff: 6, icon: 'science', path: 'science', color: '#43e97b', emoji: '🔬' },
                { name: 'اللغة العربية', coeff: 3, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 2, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 2, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'الفلسفة', coeff: 2, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'التاريخ والجغرافيا', coeff: 2, icon: 'history', path: 'hisgeo', color: '#fbc2eb', emoji: '🗺️' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        },
        'maths': {
            name: 'الرياضيات',
            icon: '📐',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            subjects: [
                { name: 'الرياضيات', coeff: 7, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'الفيزياء', coeff: 6, icon: 'physics', path: 'physics', color: '#f093fb', emoji: '⚡' },
                { name: 'العلوم', coeff: 2, icon: 'science', path: 'science', color: '#43e97b', emoji: '🔬' },
                { name: 'اللغة العربية', coeff: 3, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 2, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 2, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'الفلسفة', coeff: 2, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'التاريخ والجغرافيا', coeff: 2, icon: 'history', path: 'hisgeo', color: '#fbc2eb', emoji: '🗺️' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        },
        'techniques_maths': {
            name: 'تقني رياضي',
            icon: '⚙️',
            gradient: 'linear-gradient(135deg, #f6d365, #fda085)',
            subjects: [
                { name: 'الرياضيات', coeff: 6, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'الفيزياء', coeff: 6, icon: 'physics', path: 'physics', color: '#f093fb', emoji: '⚡' },
                { name: 'التكنولوجيا', coeff: 7, icon: 'technology', path: 'techno', color: '#f6d365', emoji: '🔧' },
        
                { name: 'اللغة العربية', coeff: 3, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 2, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 2, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'الفلسفة', coeff: 2, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        },
        'gestion_economie': {
            name: 'تسيير واقتصاد',
            icon: '📊',
            gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
            subjects: [
                { name: 'الرياضيات', coeff: 5, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'الاقتصاد', coeff: 5, icon: 'economics', path: 'economie', color: '#43e97b', emoji: '💰' },
                { name: 'التسيير', coeff: 6, icon: 'management', path: 'gestion', color: '#f093fb', emoji: '📊' },
                { name: 'اللغة العربية', coeff: 3, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 2, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 2, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'القانون', coeff: 2, icon: 'law', path: 'loi', color: '#a18cd1', emoji: '⚖️' },
                { name: 'الفلسفة', coeff: 2, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'التاريخ والجغرافيا', coeff: 2, icon: 'history', path: 'hisgeo', color: '#fbc2eb', emoji: '🗺️' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        },
        'langues_etrangeres': {
            name: 'لغات أجنبية',
            icon: '🌍',
            gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
            subjects: [
                { name: 'اللغة العربية', coeff: 5, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 5, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 5, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'اللغة الأجنبية', coeff: 4, icon: 'langue_etrangere', path: 'langue_etrangere', color: '#f093fb', emoji: '🌍' },
                { name: 'الرياضيات', coeff: 2, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'الفلسفة', coeff: 2, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'التاريخ والجغرافيا', coeff: 3, icon: 'history', path: 'hisgeo', color: '#fbc2eb', emoji: '🗺️' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        },
        'lettres_philosophie': {
            name: 'آداب وفلسفة',
            icon: '📖',
            gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
            subjects: [
                { name: 'الفلسفة', coeff: 6, icon: 'philo', path: 'philo', color: '#a18cd1', emoji: '💭' },
                { name: 'اللغة العربية', coeff: 6, icon: 'arabic', path: 'arabic', color: '#fa709a', emoji: '📖' },
                { name: 'اللغة الفرنسية', coeff: 3, icon: 'french', path: 'french', color: '#4facfe', emoji: '🇫🇷' },
                { name: 'اللغة الإنجليزية', coeff: 3, icon: 'english', path: 'english', color: '#43e97b', emoji: '🇬🇧' },
                { name: 'التاريخ والجغرافيا', coeff: 4, icon: 'history', path: 'hisgeo', color: '#fbc2eb', emoji: '🗺️' },
                { name: 'الرياضيات', coeff: 2, icon: 'maths', path: 'maths', color: '#667eea', emoji: '📐' },
                { name: 'التربية الإسلامية', coeff: 2, icon: 'islamic', path: 'islamia', color: '#f6d365', emoji: '🕌' },
                { name: 'الأمازيغية', coeff: 2, icon: 'tamazight', path: 'tamazight', color: '#a8edea', emoji: 'ⵣ' },
            ]
        }
    };

    // Get current filiere from user (NO DROPDOWN!)
    const filiereKey = user?.filiere || 'sciences_experimentales';
    const currentFiliere = filiereSubjects[filiereKey] || filiereSubjects['sciences_experimentales'];

    // Use subjects from state (with grades from database)
    const displaySubjects = loading ? [] : subjects;

    const totalCoeff = displaySubjects.reduce((sum, s) => sum + s.coeff, 0);
    const gradedSubjects = displaySubjects.filter(s => s.grade !== null);
    const averageGrade = gradedSubjects.length > 0
        ? gradedSubjects.reduce((sum, s) => sum + s.grade, 0) / gradedSubjects.length
        : 0;

    // Navigation items
    const navItems = [
        { id: 'subjects', label: '📚 المواد', icon: '📚', color: '#667eea' },
        { id: 'calculator', label: '🧮 حاسبة المعدل', icon: '🧮', color: '#f093fb' },
        { id: 'coefs', label: '📊 جدول المعاملات', icon: '📊', color: '#4facfe' },
        { id: 'resources', label: '📖 الموارد', icon: '📖', color: '#43e97b' },
        { id: 'budget', label: '💰 الميزانية', icon: '💰', color: '#fa709a' },
        { id: 'todo', label: '✅ المهام', icon: '✅', color: '#f6d365' },
        { id: 'timetable', label: '📅 الجدول', icon: '📅', color: '#a18cd1' },
    ];

    const handleSubjectClick = (path) => {
        navigate(`/bac-year/subject/${path}`);
    };

    const renderContent = () => {
        switch (activeNav) {
            case 'subjects':
                return (
                    <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                                ⏳ جاري تحميل البيانات...
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                gap: '24px',
                                justifyContent: 'center',
                                alignItems: 'start'
                            }}>
                                {displaySubjects.map((subject, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            animation: `cardAppear 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.08}s both`,
                                            transformOrigin: 'center bottom'
                                        }}
                                    >
                                        <MatiereBox
                                            name={subject.name}
                                            coefficient={subject.coeff}
                                            icon={subject.icon}
                                            grade={subject.grade}
                                            isActive={index === 0}
                                            color={subject.color}
                                            emoji={subject.emoji}
                                            predicted={subject.predicted || false}
                                            onClick={() => handleSubjectClick(subject.path)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'calculator':
                return <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}><AvgBacCalc /></div>;
            case 'coefs':
                return <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}><Table_Coefs /></div>;
            case 'resources':
                return <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}><Ressource /></div>;
            case 'budget':
                return <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}><Budget /></div>;
            case 'todo':
                return (
                    <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
                        <TodoList onTasksChange={setTasks} />  // ← ADDED: Pass setTasks to TodoList
                    </div>
                );
            case 'timetable':
                return (
                    <div style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
                        <Timetable tasks={tasks} />  // ← ADDED: Pass tasks to Timetable
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSubjectPage = () => {
        return (
            <Routes>
                <Route path="subject/arabic" element={<Arabic />} />
                <Route path="subject/french" element={<French />} />
                <Route path="subject/english" element={<English />} />
                <Route path="subject/tamazight" element={<Tamazight />} />
                <Route path="subject/langue_etrangere" element={<LangueEtrangere />} />
                <Route path="subject/maths" element={<Maths />} />
                <Route path="subject/physics" element={<Physics />} />
                <Route path="subject/science" element={<Science />} />
                <Route path="subject/techno" element={<Techno />} />
                <Route path="subject/gestion" element={<Gestion />} />
                <Route path="subject/economie" element={<Economie />} />
                <Route path="subject/loi" element={<Loi />} />
                <Route path="subject/philo" element={<Philo />} />
                <Route path="subject/islamia" element={<Islamia />} />
                <Route path="subject/hisgeo" element={<HisGeo />} />
            </Routes>
        );
    };

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
                minHeight: '100vh',
                background: '#0a0d1a',
                color: 'white'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid #f472b6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '20px', color: '#9a95b8' }}>جاري تحميل بياناتك...</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                direction: 'rtl',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0d1a 0%, #1a1a2e 50%, #16213e 100%)',
                position: 'relative',
                overflowX: 'hidden'
            }}
        >
            <style>{`
                @keyframes floatParticle {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -30px) scale(1.2); }
                    50% { transform: translate(-10px, 20px) scale(0.8); }
                    75% { transform: translate(30px, 10px) scale(1.1); }
                }
                @keyframes pulseParticle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(60px, -50px) scale(1.15); }
                    66% { transform: translate(-40px, 40px) scale(0.85); }
                }
                @keyframes pulseOrb {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.6; }
                }
                @keyframes fadeSlideUp {
                    0% { opacity: 0; transform: translateY(40px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes cardAppear {
                    0% { opacity: 0; transform: scale(0.8) translateY(50px) rotate(-3deg); }
                    60% { transform: scale(1.05) translateY(-10px) rotate(1deg); }
                    100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
                }
                @keyframes headerGlow {
                    0%, 100% { transform: translateX(-30%) rotate(10deg); }
                    50% { transform: translateX(30%) rotate(-10deg); }
                }
                @keyframes bounceIcon {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.1); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 60px rgba(244,114,182,0.3); }
                    50% { box-shadow: 0 0 80px rgba(244,114,182,0.5), 0 0 120px rgba(244,114,182,0.15); }
                }
                @keyframes tabProgress {
                    0% { width: 0; left: 50%; right: 50%; }
                    100% { width: 60%; left: 20%; right: 20%; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes floatCard {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: 'fixed',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: `radial-gradient(circle, rgba(244,114,182,${p.opacity}), rgba(102,126,234,${p.opacity * 0.5}))`,
                        borderRadius: '50%',
                        opacity: p.opacity,
                        animation: `
                            floatParticle ${p.speed * 12}s ease-in-out ${p.delay}s infinite,
                            pulseParticle ${p.pulseSpeed}s ease-in-out ${p.delay}s infinite
                        `,
                        pointerEvents: 'none',
                        zIndex: 0,
                        boxShadow: `0 0 ${p.size * 2}px rgba(244,114,182,${p.opacity * 0.3})`,
                        transform: `translate(${mousePosition.x * p.orbitRadius / 100}px, ${mousePosition.y * p.orbitRadius / 100}px)`
                    }}
                />
            ))}

            {/* Gradient Orbs */}
            <div style={{
                position: 'fixed',
                top: '-30%',
                right: '-20%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 20s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0,
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }} />
            <div style={{
                position: 'fixed',
                bottom: '-30%',
                left: '-20%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(102,126,234,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 25s ease-in-out infinite reverse',
                pointerEvents: 'none',
                zIndex: 0,
                transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`
            }} />
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '900px',
                height: '900px',
                background: 'radial-gradient(circle, rgba(244,114,182,0.03) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulseOrb 8s ease-in-out infinite',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Back to Dashboard */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                marginBottom: '20px',
                transform: scrolled ? 'scale(0.95)' : 'scale(1)',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            }}>
                <Link
                    to="/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#f472b6',
                        textDecoration: 'none',
                        fontSize: '15px',
                        padding: '12px 24px',
                        border: '2px solid #f472b6',
                        borderRadius: '14px',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontWeight: '500',
                        background: 'rgba(244,114,182,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f472b6';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateX(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(244,114,182,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(244,114,182,0.05)';
                        e.currentTarget.style.color = '#f472b6';
                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite',
                        pointerEvents: 'none'
                    }} />
                    <span style={{ fontSize: '18px', transition: 'transform 0.3s' }}>←</span>
                    العودة إلى لوحة التحكم
                </Link>
            </div>

            {/* Page Header */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                background: currentFiliere.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '45px 40px',
                borderRadius: '28px',
                textAlign: 'center',
                marginBottom: '30px',
                boxShadow: '0 25px 80px rgba(236,72,153,0.25)',
                overflow: 'hidden',
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                transition: 'transform 0.3s ease-out'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '60%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                    animation: 'headerGlow 10s ease-in-out infinite',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-50%',
                    left: '-20%',
                    width: '60%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                    animation: 'headerGlow 10s ease-in-out infinite reverse',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    pointerEvents: 'none',
                    opacity: 0.3
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        fontSize: '56px',
                        display: 'inline-block',
                        animation: 'bounceIcon 3s ease-in-out infinite',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'
                    }}>
                        🎓
                    </div>
                    <h1 style={{
                        fontSize: '42px',
                        marginBottom: '12px',
                        fontWeight: '800',
                        letterSpacing: '-0.5px',
                        textShadow: '0 4px 30px rgba(0,0,0,0.15)',
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        سنة البكالوريا
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        opacity: 0.95,
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.8',
                        textShadow: '0 2px 20px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ display: 'inline-block', animation: 'floatCard 3s ease-in-out infinite' }}>
                            {currentFiliere.icon}
                        </span>
                        {' '}{currentFiliere.name} — تتبع وتحليل المواد والتنبؤ بالمعدل النهائي
                    </p>
                    <p style={{
                        fontSize: '14px',
                        opacity: 0.7,
                        marginTop: '8px',
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        👤 {user?.username || 'مستخدم'}
                    </p>
                </div>
            </div>

            {/* Stats Bar */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '18px',
                padding: '22px 28px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '35px',
                flexWrap: 'wrap',
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both',
                transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
                transition: 'transform 0.3s ease-out'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <span style={{ fontSize: '28px' }}>{currentFiliere.icon}</span>
                    <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                        {currentFiliere.name}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '35px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>إجمالي المعاملات</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#f472b6',
                            animation: 'pulseGlow 3s ease-in-out infinite'
                        }}>
                            {totalCoeff}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>المعدل الحالي</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: averageGrade >= 14 ? '#2dd4bf' : averageGrade >= 12 ? '#fbbf24' : '#f87171',
                            animation: 'pulseGlow 3s ease-in-out infinite 1s'
                        }}>
                            {averageGrade > 0 ? averageGrade.toFixed(1) : '—'}/20
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>المواد المسجلة</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#fbbf24',
                            animation: 'pulseGlow 3s ease-in-out infinite 2s'
                        }}>
                            {gradedSubjects.length}/{displaySubjects.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '30px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(30px)',
                borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.06)',
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both'
            }}>
                {navItems.map((item, index) => {
                    const isActive = activeNav === item.id;
                    const isHovered = hoveredNav === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            onMouseEnter={() => setHoveredNav(item.id)}
                            onMouseLeave={() => setHoveredNav(null)}
                            style={{
                                padding: '15px 30px',
                                borderRadius: '16px',
                                border: 'none',
                                background: isActive
                                    ? `linear-gradient(135deg, ${item.color}, ${item.color}dd)`
                                    : 'transparent',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: isActive ? '700' : '500',
                                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                                flex: '1',
                                minWidth: '110px',
                                textAlign: 'center',
                                position: 'relative',
                                boxShadow: isActive ? `0 10px 40px ${item.color}44` : 'none',
                                transform: isActive ? 'scale(1.03) translateY(-2px)' : isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)',
                                overflow: 'hidden'
                            }}
                        >
                            {!isActive && isHovered && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: `radial-gradient(circle at center, ${item.color}11, transparent 70%)`,
                                    animation: 'pulseOrb 1.5s ease-in-out infinite'
                                }} />
                            )}

                            {isActive && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    left: '30%',
                                    right: '30%',
                                    height: '3px',
                                    background: 'rgba(255,255,255,0.6)',
                                    borderRadius: '3px',
                                    animation: 'tabProgress 0.6s ease-out'
                                }} />
                            )}

                            <span style={{
                                fontSize: '20px',
                                marginLeft: '8px',
                                display: 'inline-block',
                                animation: isActive ? 'bounceIcon 2s ease-in-out infinite' : 'none'
                            }}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(30px)',
                borderRadius: '22px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.06)',
                minHeight: '450px',
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both',
                transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
            }}>
                {renderContent()}
            </div>

            {/* Subject Pages */}
            {renderSubjectPage()}

            {/* Footer */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                marginTop: '45px',
                padding: '25px',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.25)',
                fontSize: '13px',
                animation: 'fadeSlideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both'
            }}>
                <p style={{
                    fontSize: '15px',
                    background: 'linear-gradient(135deg, rgba(244,114,182,0.3), rgba(102,126,234,0.3))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '500'
                }}>
                    🎓 BacAidz — رحلتك نحو النجاح
                </p>
                <p style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.12)' }}>
                    © 2025 جميع الحقوق محفوظة
                </p>
            </div>
        </div>
    );
}