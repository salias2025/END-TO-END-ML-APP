// src/components/bac_year/to_do.jsx
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
// SUBJECT DATABASE WITH COEFFICIENTS BY STREAM
// ============================================
const SUBJECTS_DB = {
    'arabic': {
        name: '📖 اللغة العربية',
        coef: { default: 3, 'لغات أجنبية': 5, 'آداب وفلسفة': 7 },
        weak: false,
        weaknesses: ['تحليل النصوص', 'القواعد النحوية', 'البلاغة'],
        icon: '📖'
    },
    'english': {
        name: '🇬🇧 اللغة الإنجليزية',
        coef: { default: 2, 'لغات أجنبية': 5 },
        weak: false,
        weaknesses: ['القواعد', 'الترجمة', 'المفردات'],
        icon: '🇬🇧'
    },
    'french': {
        name: '🇫🇷 اللغة الفرنسية',
        coef: { default: 2, 'لغات أجنبية': 4 },
        weak: false,
        weaknesses: ['المقال', 'القواعد', 'الترجمة'],
        icon: '🇫🇷'
    },
    'mathematics': {
        name: '🧮 الرياضيات',
        coef: { default: 2, 'علوم تجريبية': 7, 'رياضيات': 6, 'تقني رياضي': 5 },
        weak: false,
        weaknesses: ['الدوال', 'الاحتمالات', 'المتتاليات'],
        icon: '🧮'
    },
    'sciences': {
        name: '🔬 العلوم الطبيعية',
        coef: { default: 0, 'علوم تجريبية': 6 },
        weak: false,
        weaknesses: ['الوراثة', 'التغذية', 'المناعة', 'الإيكولوجيا'],
        icon: '🔬'
    },
    'physics': {
        name: '⚡ العلوم الفيزيائية',
        coef: { default: 0, 'علوم تجريبية': 5, 'رياضيات': 6, 'تقني رياضي': 5 },
        weak: true,
        weaknesses: ['الكهرباء', 'الميكانيك', 'الموجات', 'النووية'],
        icon: '⚡'
    },
    'histoire_geo': {
        name: '📜 التاريخ والجغرافيا',
        coef: { default: 2, 'تسيير واقتصاد': 4, 'آداب وفلسفة': 4 },
        weak: false,
        weaknesses: ['تحليل الوثائق', 'الخرائط', 'المقال التاريخي'],
        icon: '📜'
    },
    'islamia': {
        name: '🕌 العلوم الإسلامية',
        coef: { default: 2 },
        weak: false,
        weaknesses: ['تفسير', 'حديث', 'فقه', 'عقيدة'],
        icon: '🕌'
    },
    'philosophy': {
        name: '💭 الفلسفة',
        coef: { default: 2, 'آداب وفلسفة': 6 },
        weak: false,
        weaknesses: ['المقال الجدلي', 'تحليل النص الفلسفي', 'المفاهيم'],
        icon: '💭'
    },
    'technology': {
        name: '💻 التكنولوجيا',
        coef: { default: 0, 'تقني رياضي': 7 },
        weak: true,
        weaknesses: ['الرسم التقني', 'الميكانيك', 'الإلكترونيك'],
        icon: '💻'
    },
    'economie': {
        name: '📈 الاقتصاد والمناجمنت',
        coef: { default: 0, 'تسيير واقتصاد': 5 },
        weak: false,
        weaknesses: ['آليات السوق', 'العرض والطلب', 'التحليل الاقتصادي'],
        icon: '📈'
    },
    'droit': {
        name: '⚖️ القانون',
        coef: { default: 0, 'تسيير واقتصاد': 2 },
        weak: true,
        weaknesses: ['قانون الشركات', 'الاستدلال القانوني', 'العقود'],
        icon: '⚖️'
    },
    'gestion': {
        name: '📊 التسيير المحاسبي والمالي',
        coef: { default: 0, 'تسيير واقتصاد': 6 },
        weak: true,
        weaknesses: ['التكاليف', 'جداول التوزيع', 'الاهتلاكات', 'الميزانية'],
        icon: '📊'
    },
    'german_spanish': {
        name: '🇩🇪 الألمانية/الإسبانية',
        coef: { default: 0, 'لغات أجنبية': 5 },
        weak: false,
        weaknesses: ['القواعد', 'المفردات', 'الترجمة'],
        icon: '🇩🇪'
    },
    'tamazight': {
        name: 'ⵜⴰⵎⴰⵣⵉⵖⵜ الأمازيغية',
        coef: { default: 2 },
        weak: false,
        weaknesses: ['قراءة', 'مفردات', 'كتابة', 'نصوص'],
        icon: 'ⵜⴰⵎⴰⵣⵉⵖⵜ'
    }
};

// ============================================
// SUBJECTS BY STREAM
// ============================================
const STREAM_SUBJECTS = {
    'sciences_experimentales': ['arabic', 'english', 'french', 'mathematics', 'sciences', 'physics', 'histoire_geo', 'islamia', 'philosophy', 'tamazight'],
    'maths': ['arabic', 'english', 'french', 'mathematics', 'physics', 'histoire_geo', 'islamia', 'philosophy', 'tamazight', 'sciences'],
    'techniques_maths': ['arabic', 'english', 'french', 'mathematics', 'physics', 'technology', 'histoire_geo', 'islamia', 'philosophy', 'tamazight'],
    'gestion_economie': ['arabic', 'english', 'french', 'mathematics', 'histoire_geo', 'islamia', 'philosophy', 'economie', 'droit', 'gestion', 'tamazight'],
    'langues_etrangeres': ['arabic', 'english', 'french', 'german_spanish', 'mathematics', 'histoire_geo', 'islamia', 'philosophy', 'tamazight'],
    'lettres_philosophie': ['arabic', 'english', 'french', 'mathematics', 'histoire_geo', 'islamia', 'philosophy', 'tamazight']
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

// ============================================
// TASK TYPES
// ============================================
const TASK_TYPES = {
    'review': { icon: '📖', label: 'مراجعة', defaultDuration: 1.0, priorityBoost: 1 },
    'exercises': { icon: '✍️', label: 'تمارين', defaultDuration: 1.5, priorityBoost: 2 },
    'past_bac': { icon: '📝', label: 'بكالوريا سابقة', defaultDuration: 3.0, priorityBoost: 3 },
    'weakness_focus': { icon: '🎯', label: 'تركيز على نقطة ضعف', defaultDuration: 1.5, priorityBoost: 4 }
};

// ============================================
// PAST BAC DURATION BY COEFFICIENT
// ============================================
const PAST_BAC_DURATION = {
    7: 4.5,
    6: 4.0,
    5: 3.5,
    4: 3.0,
    3: 2.5,
    2: 2.0,
    1: 1.5
};

// ============================================
// HELPER FUNCTIONS (Notebook Logic)
// ============================================

const calculatePriority = (coefficient, mlScore) => {
    let coefScore;
    if (coefficient >= 7) coefScore = 5;
    else if (coefficient >= 6) coefScore = 5;
    else if (coefficient >= 5) coefScore = 4;
    else if (coefficient >= 4) coefScore = 3;
    else if (coefficient >= 3) coefScore = 2;
    else if (coefficient >= 2) coefScore = 2;
    else coefScore = 1;

    let mlAdjust = 0;
    if (mlScore < 10) mlAdjust = 1.5;
    else if (mlScore < 11) mlAdjust = 1.0;
    else if (mlScore < 12) mlAdjust = 0.5;
    else if (mlScore < 13) mlAdjust = 0;
    else if (mlScore < 14) mlAdjust = -0.5;
    else if (mlScore < 15) mlAdjust = -1;
    else mlAdjust = -1.5;

    let priority = (coefScore * 0.9) + (mlAdjust * 0.1);
    priority = Math.round(Math.min(5, Math.max(1, priority)));
    return priority;
};

const getPastBacDuration = (coefficient) => {
    return PAST_BAC_DURATION[coefficient] || 3.0;
};

const calculateDuration = (coefficient, mlScore, taskType, isWeak = false) => {
    if (taskType === 'past_bac') {
        return getPastBacDuration(coefficient);
    }

    let base = TASK_TYPES[taskType]?.defaultDuration || 1.0;

    let coefMult = 1.0;
    if (coefficient >= 7) coefMult = 1.5;
    else if (coefficient >= 6) coefMult = 1.4;
    else if (coefficient >= 5) coefMult = 1.3;
    else if (coefficient >= 4) coefMult = 1.2;
    else if (coefficient >= 3) coefMult = 1.1;
    else if (coefficient >= 2) coefMult = 1.0;
    else coefMult = 0.9;

    let mlMult = 1.0;
    if (mlScore < 10) mlMult = 1.5;
    else if (mlScore < 11) mlMult = 1.4;
    else if (mlScore < 12) mlMult = 1.2;
    else if (mlScore < 13) mlMult = 1.0;
    else if (mlScore < 14) mlMult = 0.9;
    else if (mlScore < 15) mlMult = 0.8;
    else mlMult = 0.7;

    if (isWeak && taskType === 'weakness_focus') {
        mlMult = mlMult + 0.2;
    }

    let duration = base * coefMult * mlMult;
    duration = Math.round(duration * 2) / 2;
    if (duration < 0.5) duration = 0.5;
    if (duration > 4.5) duration = 4.5;
    return duration;
};

const getSubjectsForStream = (stream) => {
    const subjectIds = STREAM_SUBJECTS[stream] || [];
    const subjects = {};
    subjectIds.forEach(id => {
        if (SUBJECTS_DB[id]) {
            const subj = SUBJECTS_DB[id];
            const coef = subj.coef[stream] || subj.coef.default || 1;
            subjects[id] = { ...subj, coefficient: coef };
        }
    });
    return subjects;
};

const getTaskDescription = (subjectId, taskType, weakness = null, year = null) => {
    const subjectName = SUBJECTS_DB[subjectId]?.name || 'المادة';
    const icon = TASK_TYPES[taskType]?.icon || '📚';

    if (taskType === 'weakness_focus' && weakness) {
        return `${icon} ${weakness}`;
    } else if (taskType === 'past_bac' && year) {
        return `${icon} بكالوريا ${year}`;
    } else if (taskType === 'review') {
        return `${icon} مراجعة ${subjectName}`;
    } else if (taskType === 'exercises') {
        return `${icon} تمارين ${subjectName}`;
    } else {
        return `${icon} ${TASK_TYPES[taskType]?.label || 'مهمة'}`;
    }
};

// ============================================
// COMPONENT
// ============================================
export default function TodoList({ onTasksChange }) {
    const [user, setUser] = useState(null);
    const [selectedStream, setSelectedStream] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userResults, setUserResults] = useState({});
    const MAX_HOURS = 45;

    // ============================================
    // SYNC TASKS TO PARENT - ✅ FIXED
    // ============================================
    useEffect(() => {
        if (onTasksChange) {
            onTasksChange(tasks);
        }
    }, [tasks, onTasksChange]);

    // ============================================
    // LOAD USER DATA AND RESULTS
    // ============================================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const currentUser = getUser();
            if (!currentUser) {
                console.log('⚠️ No user found');
                setLoading(false);
                return;
            }

            setUser(currentUser);

            const filiere = currentUser.filiere || 'sciences_experimentales';
            setSelectedStream(filiere);

            const token = getAuthToken();
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
                            setUserResults(result.data || {});
                        }
                    }
                } catch (error) {
                    console.error('Error fetching results:', error);
                }
            }

            setLoading(false);
        };

        loadData();
    }, []);

    // ============================================
    // GENERATE TASKS (Notebook Logic)
    // ============================================
    const generateTasks = () => {
        if (!selectedStream) return [];

        const subjects = getSubjectsForStream(selectedStream);
        const newTasks = [];
        let id = 0;
        const pastBacYears = ['2024', '2023', '2022', '2021'];

        Object.entries(subjects).forEach(([subjectId, data]) => {
            const coefficient = data.coefficient;
            const mlScore = userResults[subjectId]?.predicted_score || 12;
            const isWeak = data.weak || false;
            const weaknesses = data.weaknesses || [];

            const priority = calculatePriority(coefficient, mlScore);

            let numTasks = Math.random() > 0.4 ? 2 : 1;
            if (priority >= 4) numTasks = 2;

            const taskTypes = ['review', 'exercises', 'past_bac', 'weakness_focus'];
            const selectedTypes = [];
            const shuffled = [...taskTypes].sort(() => Math.random() - 0.5);

            for (let i = 0; i < numTasks && i < shuffled.length; i++) {
                selectedTypes.push(shuffled[i]);
            }

            selectedTypes.forEach((taskType, index) => {
                let weakness = null;
                let year = null;

                if (taskType === 'weakness_focus' && weaknesses.length > 0) {
                    weakness = weaknesses[index % weaknesses.length];
                } else if (taskType === 'past_bac') {
                    year = pastBacYears[index % pastBacYears.length];
                }

                const description = getTaskDescription(subjectId, taskType, weakness, year);
                const duration = calculateDuration(coefficient, mlScore, taskType, isWeak);

                const variation = Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? 0.25 : -0.25);
                let finalDuration = Math.round((duration + variation) * 2) / 2;
                if (finalDuration < 0.5) finalDuration = 0.5;
                if (finalDuration > 4.5) finalDuration = 4.5;

                const bestTime = (taskType === 'past_bac' || taskType === 'weakness_focus') ? 'morning' : 'afternoon';

                newTasks.push({
                    id: id++,
                    subject_id: subjectId,
                    subject_name: data.name,
                    task_type: taskType,
                    icon: TASK_TYPES[taskType]?.icon || '📚',
                    description: description,
                    duration: finalDuration,
                    priority: priority,
                    best_time: bestTime,
                    is_weak: isWeak,
                    ml_score: mlScore,
                    coefficient: coefficient
                });
            });
        });

        newTasks.sort((a, b) => b.priority - a.priority);

        let total = newTasks.reduce((sum, t) => sum + t.duration, 0);
        if (total > MAX_HOURS) {
            let reductionNeeded = total - MAX_HOURS;
            const tasksToReduce = newTasks
                .filter(t => t.task_type !== 'past_bac')
                .sort((a, b) => a.priority - b.priority || b.duration - a.duration);

            for (const task of tasksToReduce) {
                if (reductionNeeded <= 0) break;
                const reduceBy = Math.min(0.5, reductionNeeded, task.duration - 0.5);
                if (reduceBy > 0) {
                    task.duration = Math.round((task.duration - reduceBy) * 2) / 2;
                    reductionNeeded -= reduceBy;
                }
            }

            if (reductionNeeded > 0) {
                const pastBacTasks = newTasks
                    .filter(t => t.task_type === 'past_bac')
                    .sort((a, b) => a.priority - b.priority);

                for (const task of pastBacTasks) {
                    if (reductionNeeded <= 0) break;
                    const minDuration = 1.5;
                    const reduceBy = Math.min(0.5, reductionNeeded, task.duration - minDuration);
                    if (reduceBy > 0) {
                        task.duration = Math.round((task.duration - reduceBy) * 2) / 2;
                        reductionNeeded -= reduceBy;
                    }
                }
            }
        }

        const newTotal = newTasks.reduce((sum, t) => sum + t.duration, 0);
        setTotalHours(newTotal);

        return newTasks;
    };

    // ============================================
    // REGENERATE TASKS
    // ============================================
    const regenerateTasks = () => {
        const newTasks = generateTasks();
        setTasks(newTasks);
        setSelectedTasks([]);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 100);
    };

    // ============================================
    // INITIAL TASK GENERATION
    // ============================================
    useEffect(() => {
        if (!loading && selectedStream) {
            const newTasks = generateTasks();
            setTasks(newTasks);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 100);
        }
    }, [loading, selectedStream, userResults]);

    // ============================================
    // UPDATE TOTAL HOURS
    // ============================================
    const updateTotalHours = (taskList) => {
        const total = taskList.reduce((sum, t) => sum + t.duration, 0);
        setTotalHours(total);
    };

    // ============================================
    // HANDLE TASK CHANGES
    // ============================================
    const handleTaskChange = (index, field, value) => {
        const newTasks = [...tasks];
        newTasks[index][field] = value;
        setTasks(newTasks);
        updateTotalHours(newTasks);
    };

    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        setSelectedTasks(selectedTasks.filter(i => i !== index));
        updateTotalHours(newTasks);
    };

    const deleteSelected = () => {
        const newTasks = tasks.filter((_, i) => !selectedTasks.includes(i));
        setTasks(newTasks);
        setSelectedTasks([]);
        updateTotalHours(newTasks);
    };

    const addTask = () => {
        if (!selectedStream) return;

        const subjects = getSubjectsForStream(selectedStream);
        const firstSubject = Object.keys(subjects)[0] || 'arabic';
        const data = subjects[firstSubject] || { name: '📖 اللغة العربية', coefficient: 3 };

        const newTask = {
            id: tasks.length + 1,
            subject_id: firstSubject,
            subject_name: data.name,
            task_type: 'review',
            icon: '📖',
            description: `📖 مراجعة ${data.name}`,
            duration: 1.0,
            priority: 3,
            best_time: 'morning',
            is_weak: false,
            ml_score: 12,
            coefficient: data.coefficient || 3
        };

        const newTasks = [...tasks, newTask];
        setTasks(newTasks);
        updateTotalHours(newTasks);
    };

    const resetTasks = () => {
        regenerateTasks();
    };

    const toggleSelect = (index) => {
        if (selectedTasks.includes(index)) {
            setSelectedTasks(selectedTasks.filter(i => i !== index));
        } else {
            setSelectedTasks([...selectedTasks, index]);
        }
    };

    // ============================================
    // GET PRIORITY STARS
    // ============================================
    const getPriorityStars = (priority) => {
        return '⭐'.repeat(priority) + '☆'.repeat(5 - priority);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            5: '#e74c3c',
            4: '#e67e22',
            3: '#f39c12',
            2: '#2ecc71',
            1: '#3498db'
        };
        return colors[priority] || '#667eea';
    };

    const getTimeLabel = (time) => {
        const labels = { morning: '🌅 صباح', afternoon: '☀️ بعد الظهر', evening: '🌙 مساء', any: '🕐 أي وقت' };
        return labels[time] || time;
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
                <p style={{ marginTop: '20px' }}>⏳ جاري تحميل بياناتك...</p>
            </div>
        );
    }

    if (!user || !selectedStream) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#f87171'
            }}>
                <p>⚠️ يرجى تسجيل الدخول أولاً</p>
            </div>
        );
    }

    const filiereDisplay = FILIERE_DISPLAY[selectedStream] || selectedStream;
    const subjectCount = Object.keys(getSubjectsForStream(selectedStream)).length;

    // ============================================
    // RENDER
    // ============================================
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: 'rtl',
            background: 'linear-gradient(145deg, #0a0d1a, #1a1a2e)',
            borderRadius: '28px',
            padding: '28px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes fadeSlideUp {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    cursor: pointer;
                    border: 2px solid rgba(255,255,255,0.2);
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(102,126,234,0.3);
                }
                input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 30px rgba(102,126,234,0.5);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    cursor: pointer;
                    border: 2px solid rgba(255,255,255,0.2);
                }
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.02);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(102,126,234,0.3);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(102,126,234,0.5);
                }
            `}</style>

            {/* Background Orbs */}
            <div style={{
                position: 'absolute',
                top: '-30%',
                right: '-20%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(102,126,234,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 20s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-20%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(46,204,113,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'floatOrb 25s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '28px 32px',
                borderRadius: '18px',
                textAlign: 'center',
                marginBottom: '25px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '60%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    animation: 'headerGlow 8s ease-in-out infinite',
                    pointerEvents: 'none'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📋</div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '26px', fontWeight: '700' }}>
                        مخطط المهام الأسبوعي
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: '6px 0 0 0', fontSize: '14px' }}>
                        🎓 {filiereDisplay} — {subjectCount} مادة | قائمة مهام ذكية مبنية على تحليل أدائك
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0', fontSize: '12px' }}>
                        👤 {user.username || 'مستخدم'}
                    </p>
                </div>
                <style>{`
                    @keyframes headerGlow {
                        0%, 100% { transform: translateX(-30%) rotate(10deg); }
                        50% { transform: translateX(30%) rotate(-10deg); }
                    }
                `}</style>
            </div>

            {/* Stats Bar */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '16px 24px',
                marginBottom: '22px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📚</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                        {filiereDisplay}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                        ({subjectCount} مواد)
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>المهام</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>
                            {tasks.length}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>الساعات</div>
                        <div style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: totalHours > MAX_HOURS ? '#e74c3c' : '#2dd4bf'
                        }}>
                            {totalHours.toFixed(1)}h
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>الحد الأقصى</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)' }}>
                            {MAX_HOURS}h
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                padding: '4px',
                border: '1px solid rgba(255,255,255,0.04)',
                maxHeight: '520px',
                overflowY: 'auto'
            }}>
                {/* Header Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1.2fr 1fr 1.5fr 0.9fr 0.9fr 0.9fr 50px',
                    gap: '8px',
                    padding: '14px 12px',
                    borderBottom: '2px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'right',
                    position: 'sticky',
                    top: 0,
                    background: 'rgba(10,13,26,0.95)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2,
                    borderRadius: '12px 12px 0 0'
                }}>
                    <span>✓</span>
                    <span>المادة</span>
                    <span>النوع</span>
                    <span>الوصف</span>
                    <span>المدة</span>
                    <span>الأولوية</span>
                    <span>الوقت</span>
                    <span></span>
                </div>

                {tasks.map((task, index) => {
                    const isHovered = hoveredRow === index;
                    const isSelected = selectedTasks.includes(index);
                    const priorityColor = getPriorityColor(task.priority);

                    return (
                        <div
                            key={task.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '32px 1.2fr 1fr 1.5fr 0.9fr 0.9fr 0.9fr 50px',
                                gap: '8px',
                                padding: '10px 12px',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                alignItems: 'center',
                                background: isHovered
                                    ? 'rgba(102,126,234,0.08)'
                                    : task.is_weak
                                        ? 'rgba(231,76,60,0.04)'
                                        : 'transparent',
                                borderRadius: '8px',
                                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                animation: animate ? `fadeSlideUp 0.4s ease-out ${index * 0.03}s both` : 'none'
                            }}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(index)}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    accentColor: '#667eea',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s'
                                }}
                            />
                            <select
                                value={task.subject_id}
                                onChange={(e) => handleTaskChange(index, 'subject_id', e.target.value)}
                                style={{
                                    background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    color: 'white',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                            >
                                {Object.entries(getSubjectsForStream(selectedStream)).map(([id, data]) => (
                                    <option key={id} value={id} style={{ background: '#1a1a2e' }}>{data.name}</option>
                                ))}
                            </select>
                            <select
                                value={task.task_type}
                                onChange={(e) => handleTaskChange(index, 'task_type', e.target.value)}
                                style={{
                                    background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    color: 'white',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                            >
                                {Object.entries(TASK_TYPES).map(([key, val]) => (
                                    <option key={key} value={key} style={{ background: '#1a1a2e' }}>{val.icon} {val.label}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={task.description}
                                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                style={{
                                    background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    color: 'white',
                                    fontSize: '13px',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                            />
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center'
                            }}>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="4.5"
                                    step="0.5"
                                    value={task.duration}
                                    onChange={(e) => handleTaskChange(index, 'duration', parseFloat(e.target.value))}
                                    style={{
                                        width: '65px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <span style={{
                                    color: isHovered ? '#fff' : 'rgba(255,255,255,0.5)',
                                    fontSize: '12px',
                                    minWidth: '30px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s'
                                }}>
                                    {task.duration}h
                                </span>
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ color: priorityColor }}>{'⭐'.repeat(task.priority)}</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>{'☆'.repeat(5 - task.priority)}</span>
                            </div>
                            <select
                                value={task.best_time}
                                onChange={(e) => handleTaskChange(index, 'best_time', e.target.value)}
                                style={{
                                    background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    color: 'white',
                                    fontSize: '12px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                            >
                                <option value="morning" style={{ background: '#1a1a2e' }}>🌅 صباح</option>
                                <option value="afternoon" style={{ background: '#1a1a2e' }}>☀️ بعد الظهر</option>
                                <option value="evening" style={{ background: '#1a1a2e' }}>🌙 مساء</option>
                                <option value="any" style={{ background: '#1a1a2e' }}>🕐 أي وقت</option>
                            </select>
                            <button
                                onClick={() => deleteTask(index)}
                                style={{
                                    background: 'rgba(231,76,60,0.1)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '6px 8px',
                                    color: '#e74c3c',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'all 0.3s',
                                    opacity: isHovered ? 1 : 0.3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(231,76,60,0.3)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(231,76,60,0.1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                🗑️
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Summary & Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
                padding: '18px 0',
                marginTop: '18px',
                borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '500' }}>
                        📊 إجمالي الساعات:
                    </span>
                    <span style={{
                        color: totalHours > MAX_HOURS ? '#e74c3c' : '#2dd4bf',
                        fontWeight: 'bold',
                        fontSize: '22px',
                        transition: 'all 0.3s'
                    }}>
                        {totalHours.toFixed(1)}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>/ {MAX_HOURS}</span>
                    {totalHours > MAX_HOURS && (
                        <span style={{
                            color: '#e74c3c',
                            fontSize: '13px',
                            background: 'rgba(231,76,60,0.15)',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(231,76,60,0.2)'
                        }}>
                            ⚠️ تجاوز { (totalHours - MAX_HOURS).toFixed(1) } ساعة
                        </span>
                    )}
                    {totalHours < MAX_HOURS * 0.5 && totalHours > 0 && (
                        <span style={{
                            color: '#fbbf24',
                            fontSize: '13px',
                            background: 'rgba(251,191,36,0.15)',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(251,191,36,0.2)'
                        }}>
                            💡 يمكنك إضافة المزيد من المهام
                        </span>
                    )}
                </div>
                <div style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'rgba(231,76,60,0.5)',
                        marginLeft: '4px'
                    }} />
                    {tasks.filter(t => t.is_weak).length} نقاط ضعف
                    <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.1)' }}>|</span>
                    📋 {tasks.length} مهمة
                    <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.1)' }}>|</span>
                    🎯 متوسط الأولوية: {(tasks.reduce((sum, t) => sum + t.priority, 0) / (tasks.length || 1)).toFixed(1)}
                </div>
            </div>

            {/* Buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: '6px'
            }}>
                <button
                    onClick={addTask}
                    style={{
                        padding: '12px 28px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontFamily: 'inherit',
                        boxShadow: '0 4px 20px rgba(45,212,191,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,212,191,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,212,191,0.3)';
                    }}
                >
                    ➕ إضافة مهمة
                </button>
                <button
                    onClick={deleteSelected}
                    disabled={selectedTasks.length === 0}
                    style={{
                        padding: '12px 28px',
                        borderRadius: '14px',
                        border: 'none',
                        background: selectedTasks.length === 0
                            ? 'rgba(255,255,255,0.05)'
                            : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                        color: selectedTasks.length === 0 ? 'rgba(255,255,255,0.3)' : 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: selectedTasks.length === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontFamily: 'inherit',
                        boxShadow: selectedTasks.length === 0 ? 'none' : '0 4px 20px rgba(231,76,60,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: selectedTasks.length === 0 ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (selectedTasks.length > 0) {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(231,76,60,0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = selectedTasks.length === 0 ? 'none' : '0 4px 20px rgba(231,76,60,0.3)';
                    }}
                >
                    🗑️ حذف المحددة ({selectedTasks.length})
                </button>
                <button
                    onClick={resetTasks}
                    style={{
                        padding: '12px 28px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        fontFamily: 'inherit',
                        boxShadow: '0 4px 20px rgba(251,191,36,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(251,191,36,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(251,191,36,0.3)';
                    }}
                >
                    🔄 إعادة توليد
                </button>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                padding: '16px',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '12px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                marginTop: '20px'
            }}>
                💡 الأولوية = 90% معامل + 10% نقطة متوقعة | المدة تعتمد على المعامل والنقطة المتوقعة
            </div>
        </div>
    );
}