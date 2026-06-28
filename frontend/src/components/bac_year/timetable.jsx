// src/components/bac_year/timetable.jsx
import React, { useState, useEffect } from 'react';

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
// DAYS OF THE WEEK
// ============================================
const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// ============================================
// ALL TIME SLOTS (08:00 - 18:00)
// ============================================
const ALL_TIME_SLOTS = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00',  // Lunch
    '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
];

// ============================================
// DAILY HOUR TARGETS
// ============================================
const DAILY_TARGETS = {
    'الأحد': 6.5,
    'الإثنين': 6.5,
    'الثلاثاء': 6.5,
    'الأربعاء': 4.0,
    'الخميس': 6.5,
    'الجمعة': 3.5,
    'السبت': 3.5
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getAvailableSlotsForDay = (day, lunchHour) => {
    if (day === 'الأربعاء') {
        return ALL_TIME_SLOTS.filter(s => {
            const hour = parseInt(s.split(':')[0]);
            return hour < 13;
        });
    } else if (day === 'الجمعة' || day === 'السبت') {
        return ALL_TIME_SLOTS.filter(s => {
            const hour = parseInt(s.split(':')[0]);
            return hour < 12;
        });
    } else {
        return ALL_TIME_SLOTS.filter(s => {
            if (s === '12:00-13:00' && lunchHour === 12) return false;
            if (s === '13:00-14:00' && lunchHour === 13) return false;
            return true;
        });
    }
};

const isConsecutive = (time1, time2) => {
    if (!time1 || !time2) return false;
    const endHour = parseInt(time1.split('-')[1].split(':')[0]);
    const startHour = parseInt(time2.split('-')[0].split(':')[0]);
    return endHour === startHour;
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

// ============================================
// GREEDY SCHEDULER (Notebook Logic)
// ============================================
const greedyScheduler = (tasks, lunchHour) => {
    console.log('🔍 Greedy Scheduler called with tasks:', tasks?.length || 0);

    if (!tasks || tasks.length === 0) {
        console.warn('⚠️ No tasks to schedule!');
        return { timetable: {}, assignments: [], dailyHours: {}, dailyTasks: {}, dailySubjects: {} };
    }

    // Initialize
    const timetable = {};
    const assignments = [];
    const dailyHours = {};
    const dailyTasks = {};
    const dailySubjects = {};
    const usedSlots = {};

    DAYS.forEach(day => {
        dailyHours[day] = 0;
        dailyTasks[day] = 0;
        dailySubjects[day] = [];
    });

    // Sort tasks by priority (highest first), then by duration (largest first)
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        return b.duration - a.duration;
    });

    console.log('📊 Sorted tasks:', sortedTasks.map(t => `${t.subject_name} (${t.duration}h, priority ${t.priority})`));

    // Try to place each task
    let placedCount = 0;
    for (const task of sortedTasks) {
        const numSlots = Math.ceil(task.duration);
        let placed = false;

        // Try each day
        const shuffledDays = [...DAYS].sort(() => Math.random() - 0.5);
        for (const day of shuffledDays) {
            if (placed) break;

            const availableSlots = getAvailableSlotsForDay(day, lunchHour);
            if (availableSlots.length < numSlots) continue;

            // Try each starting slot
            for (let i = 0; i <= availableSlots.length - numSlots; i++) {
                const startSlot = availableSlots[i];
                let allFree = true;

                // Check if all slots are free
                for (let j = 0; j < numSlots; j++) {
                    const slot = availableSlots[i + j];
                    const key = `${day}-${slot}`;
                    if (usedSlots[key]) {
                        allFree = false;
                        break;
                    }
                }

                if (allFree) {
                    // Place the task
                    for (let j = 0; j < numSlots; j++) {
                        const slot = availableSlots[i + j];
                        const key = `${day}-${slot}`;
                        usedSlots[key] = true;
                        timetable[key] = {
                            ...task,
                            // Use the task's description directly
                        };
                        dailyHours[day] += 1;
                        dailyTasks[day] += 1;
                        if (!dailySubjects[day].includes(task.subject_name)) {
                            dailySubjects[day].push(task.subject_name);
                        }
                        assignments.push({
                            task: task,
                            day: day,
                            time: slot,
                            duration: 1.0,
                            slotIndex: i + j
                        });
                    }
                    placed = true;
                    placedCount++;
                    break;
                }
            }
        }

        if (!placed) {
            console.warn(`⚠️ Could not place task: ${task.subject_name} - ${task.description}`);
        }
    }

    console.log(`✅ Placed ${placedCount}/${tasks.length} tasks`);
    return { timetable, assignments, dailyHours, dailyTasks, dailySubjects };
};

// ============================================
// COMPONENT
// ============================================
export default function Timetable({ tasks: propTasks }) {
    const [user, setUser] = useState(null);
    const [lunchHour, setLunchHour] = useState(12);
    const [timetable, setTimetable] = useState({});
    const [dailySummary, setDailySummary] = useState({});
    const [taskAssignments, setTaskAssignments] = useState([]);
    const [isGenerated, setIsGenerated] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [hoveredCell, setHoveredCell] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    // ============================================
    // DEBUG: LOG TASKS RECEIVED
    // ============================================
    console.log('🔍 Timetable received tasks:', propTasks);
    console.log('📊 Number of tasks from props:', propTasks?.length || 0);

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
    // GET TASKS (from props or fallback)
    // ============================================
    const getTasks = () => {
        // ✅ Use tasks from props (from TodoList)
        if (propTasks && propTasks.length > 0) {
            console.log('✅ Using tasks from props:', propTasks.length);
            return propTasks;
        }

        // ⚠️ Fallback: sample tasks if no props
        console.warn('⚠️ No tasks from props, using fallback sample tasks');
        return [
            { id: 1, subject_name: '📖 اللغة العربية', description: 'مراجعة النصوص', duration: 1.5, priority: 4, task_type: 'review' },
            { id: 2, subject_name: '🧮 الرياضيات', description: 'تمارين الدوال', duration: 2.0, priority: 5, task_type: 'exercises' },
            { id: 3, subject_name: '⚡ الفيزياء', description: 'مراجعة الكهرباء', duration: 1.5, priority: 4, task_type: 'review' },
            { id: 4, subject_name: '📜 التاريخ والجغرافيا', description: 'تحليل الوثائق', duration: 1.0, priority: 3, task_type: 'review' },
            { id: 5, subject_name: '🇬🇧 اللغة الإنجليزية', description: 'تمارين القواعد', duration: 1.0, priority: 3, task_type: 'exercises' },
        ];
    };

    // ============================================
    // GENERATE TIMETABLE
    // ============================================
    const generateTimetable = () => {
        const tasks = getTasks();
        console.log('🔄 Generating timetable with tasks:', tasks.length);

        if (tasks.length === 0) {
            console.warn('⚠️ No tasks to schedule!');
            setDebugInfo('⚠️ لا توجد مهام لجدولتها. قم بإنشاء مهام في قائمة المهام أولاً.');
            setIsGenerated(true);
            return;
        }

        setDebugInfo(`📊 جاري جدولة ${tasks.length} مهمة...`);

        const { timetable: newTimetable, assignments, dailyHours, dailyTasks, dailySubjects } = greedyScheduler(tasks, lunchHour);

        setTimetable(newTimetable);
        setTaskAssignments(assignments);
        setDailySummary({ hours: dailyHours, tasks: dailyTasks, subjects: dailySubjects });
        setIsGenerated(true);
        setAnimate(true);

        const totalScheduled = assignments.length > 0 ? new Set(assignments.map(a => a.task.id)).size : 0;
        setDebugInfo(`✅ تم جدولة ${totalScheduled}/${tasks.length} مهام`);

        setTimeout(() => setAnimate(false), 100);
    };

    // ============================================
    // AUTO-GENERATE ON MOUNT AND WHEN TASKS CHANGE
    // ============================================
    useEffect(() => {
        generateTimetable();
    }, [propTasks]); // ← Re-generate when tasks change

    // ============================================
    // REGENERATE WHEN LUNCH HOUR CHANGES
    // ============================================
    useEffect(() => {
        if (isGenerated) {
            generateTimetable();
        }
    }, [lunchHour]);

    // ============================================
    // GET CELL STYLE
    // ============================================
    const getCellStyle = (day, slot) => {
        const key = `${day}-${slot}`;
        const task = timetable[key];
        const hour = parseInt(slot.split(':')[0]);
        const isHovered = hoveredCell === `${day}-${slot}`;

        // Lunch break
        if (slot === '12:00-13:00') {
            return {
                background: 'rgba(255,152,0,0.12)',
                borderColor: 'rgba(255,152,0,0.2)',
                textAlign: 'center',
                icon: '🍽️',
                label: 'غداء'
            };
        }

        // Wednesday afternoon off
        if (day === 'الأربعاء' && hour >= 13) {
            return {
                background: 'rgba(46,204,113,0.06)',
                borderColor: 'rgba(46,204,113,0.1)',
                textAlign: 'center',
                icon: '🌿',
                label: 'راحة'
            };
        }

        // Weekend morning only
        if ((day === 'الجمعة' || day === 'السبت') && hour >= 12) {
            return {
                background: 'rgba(46,204,113,0.06)',
                borderColor: 'rgba(46,204,113,0.1)',
                textAlign: 'center',
                icon: '🌿',
                label: 'راحة'
            };
        }

        // Task slot
        if (task) {
            const color = getPriorityColor(task.priority);
            return {
                background: isHovered ? `${color}44` : `${color}22`,
                borderColor: isHovered ? `${color}88` : `${color}44`,
                textAlign: 'center',
                icon: '📚',
                label: task.subject_name,
                isTask: true,
                task: task,
                boxShadow: isHovered ? `0 0 30px ${color}22` : 'none',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)'
            };
        }

        // Empty slot
        return {
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.03)',
            textAlign: 'center',
            icon: '○',
            label: ''
        };
    };

    // ============================================
    // GET CELL CONTENT
    // ============================================
    const getCellContent = (day, slot) => {
        const style = getCellStyle(day, slot);

        if (style.icon === '🍽️' || style.icon === '🌿') {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                }}>
                    <span style={{ fontSize: '20px' }}>{style.icon}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{style.label}</span>
                </div>
            );
        }

        if (style.isTask && style.task) {
            const task = style.task;
            const stars = '⭐'.repeat(task.priority);
            // Use the task's description directly from TodoList
            const displayText = task.description || task.subject_name;
            return (
                <div style={{ fontSize: '12px', lineHeight: '1.4', width: '100%' }}>
                    <div style={{ fontWeight: '600', color: 'white', fontSize: '13px' }}>
                        {task.subject_name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                        {displayText}
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px',
                        fontSize: '10px',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: getPriorityColor(task.priority)
                        }} />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>
                            {stars}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>
                            {task.duration}h
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <span style={{ color: 'rgba(255,255,255,0.08)', fontSize: '14px' }}>
                {style.icon}
            </span>
        );
    };

    // ============================================
    // GET DAY STATUS
    // ============================================
    const getDayStatus = (day) => {
        const hours = dailySummary.hours?.[day] || 0;
        if (day === 'الأربعاء') return { label: 'خفيف (بعد الظهر راحة)', color: '#f39c12' };
        if (day === 'الجمعة' || day === 'السبت') return { label: 'نهاية الأسبوع (صباحاً)', color: '#2ecc71' };
        if (hours >= 8) return { label: 'مكثف', color: '#e74c3c' };
        if (hours >= 5) return { label: 'متوسط', color: '#f39c12' };
        return { label: 'خفيف', color: '#2ecc71' };
    };

    // ============================================
    // RENDER
    // ============================================
    const tasks = getTasks();
    const totalTaskHours = tasks.reduce((sum, t) => sum + t.duration, 0);

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
                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes fadeSlideUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                ::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
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
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📅</div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '26px', fontWeight: '700' }}>
                        الجدول الدراسي الأسبوعي
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', margin: '6px 0 0 0', fontSize: '14px' }}>
                        {user ? `🎓 ${user.filiere || 'جميع الشعب'}` : '🎓 جميع الشعب'}
                        {' '}— {tasks.length} مهام | {totalTaskHours.toFixed(1)} ساعة
                    </p>
                    {user && (
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0', fontSize: '12px' }}>
                            👤 {user.username || 'مستخدم'}
                        </p>
                    )}
                    {/* Debug info */}
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0', fontSize: '11px' }}>
                        📊 {debugInfo || `المهام المستلمة: ${propTasks?.length || 0}`}
                    </p>
                </div>
                <style>{`
                    @keyframes headerGlow {
                        0%, 100% { transform: translateX(-30%) rotate(10deg); }
                        50% { transform: translateX(30%) rotate(-10deg); }
                    }
                `}</style>
            </div>

            {/* Controls */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '18px 24px',
                marginBottom: '22px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        🍽️ وقت الغداء:
                    </label>
                    <select
                        value={lunchHour}
                        onChange={(e) => setLunchHour(parseInt(e.target.value))}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '14px',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                        <option value={12} style={{ background: '#1a1a2e' }}>12:00-13:00</option>
                        <option value={13} style={{ background: '#1a1a2e' }}>13:00-14:00</option>
                    </select>
                </div>

                <button
                    onClick={generateTimetable}
                    style={{
                        padding: '12px 36px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)',
                        color: 'white',
                        fontSize: '15px',
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
                    🚀 إعادة إنشاء الجدول
                </button>
            </div>

            {/* Timetable */}
            {isGenerated && (
                <>
                    <div style={{
                        overflowX: 'auto',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        padding: '4px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        animation: animate ? 'fadeSlideUp 0.6s ease-out' : 'none'
                    }}>
                        {Object.keys(timetable).length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                                <p>⚠️ لا توجد مهام مجدولة</p>
                                <p style={{ fontSize: '12px', marginTop: '8px' }}>
                                    {debugInfo || 'تأكد من إنشاء مهام في قائمة المهام أولاً'}
                                </p>
                            </div>
                        ) : (
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '13px',
                                minWidth: '850px'
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            padding: '14px 12px',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: 'rgba(255,255,255,0.5)',
                                            borderBottom: '2px solid rgba(255,255,255,0.06)',
                                            textAlign: 'center',
                                            minWidth: '90px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            الوقت
                                        </th>
                                        {DAYS.map(day => (
                                            <th key={day} style={{
                                                padding: '14px 12px',
                                                background: 'rgba(255,255,255,0.03)',
                                                color: 'rgba(255,255,255,0.6)',
                                                borderBottom: '2px solid rgba(255,255,255,0.06)',
                                                textAlign: 'center',
                                                minWidth: '130px',
                                                fontSize: '14px',
                                                fontWeight: '600'
                                            }}>
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ALL_TIME_SLOTS.map((slot, rowIndex) => (
                                        <tr key={slot} style={{
                                            animation: animate ? `fadeSlideUp 0.4s ease-out ${rowIndex * 0.03}s both` : 'none'
                                        }}>
                                            <td style={{
                                                padding: '8px 12px',
                                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: '11px',
                                                textAlign: 'center',
                                                fontWeight: '500'
                                            }}>
                                                {slot}
                                            </td>
                                            {DAYS.map(day => {
                                                const style = getCellStyle(day, slot);
                                                const content = getCellContent(day, slot);

                                                return (
                                                    <td
                                                        key={`${day}-${slot}`}
                                                        onMouseEnter={() => setHoveredCell(`${day}-${slot}`)}
                                                        onMouseLeave={() => setHoveredCell(null)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                            minHeight: '60px',
                                                            background: style.background,
                                                            borderLeft: '1px solid rgba(255,255,255,0.02)',
                                                            borderRight: '1px solid rgba(255,255,255,0.02)',
                                                            textAlign: style.textAlign || 'right',
                                                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                                                            borderRadius: style.isTask ? '10px' : '0',
                                                            boxShadow: style.boxShadow || 'none',
                                                            transform: style.transform || 'scale(1)',
                                                            cursor: style.isTask ? 'pointer' : 'default'
                                                        }}
                                                    >
                                                        {content}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Daily Summary */}
                    <div style={{
                        marginTop: '22px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        padding: '22px 24px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        animation: animate ? 'fadeSlideUp 0.6s ease-out 0.2s both' : 'none'
                    }}>
                        <h3 style={{
                            color: 'white',
                            marginBottom: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            📊 الملخص اليومي
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                            gap: '12px'
                        }}>
                            {DAYS.map(day => {
                                const hours = dailySummary.hours?.[day] || 0;
                                const tasksCount = dailySummary.tasks?.[day] || 0;
                                const subjects = dailySummary.subjects?.[day] || [];
                                const barWidth = Math.min(100, (hours / 9) * 100);
                                const status = getDayStatus(day);

                                return (
                                    <div key={day} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        textAlign: 'center',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}>
                                        <div style={{
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '12px',
                                            fontWeight: '500'
                                        }}>
                                            {day}
                                        </div>
                                        <div style={{
                                            color: 'white',
                                            fontSize: '22px',
                                            fontWeight: '700',
                                            margin: '4px 0'
                                        }}>
                                            {hours.toFixed(1)}h
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '4px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '3px',
                                            marginTop: '6px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${barWidth}%`,
                                                height: '100%',
                                                background: `linear-gradient(90deg, ${status.color}, ${status.color}dd)`,
                                                borderRadius: '3px',
                                                transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                                            }} />
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: status.color,
                                            marginTop: '6px',
                                            fontWeight: '500'
                                        }}>
                                            {tasksCount} مهام • {status.label}
                                        </div>
                                        {subjects.length > 0 && (
                                            <div style={{
                                                fontSize: '9px',
                                                color: 'rgba(255,255,255,0.2)',
                                                marginTop: '4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {subjects.slice(0, 3).join(' • ')}
                                                {subjects.length > 3 && ` +${subjects.length - 3}`}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Study Tips */}
                    <div style={{
                        marginTop: '22px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        padding: '22px 24px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        animation: animate ? 'fadeSlideUp 0.6s ease-out 0.4s both' : 'none'
                    }}>
                        <h3 style={{
                            color: 'white',
                            marginBottom: '14px',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            💡 نصائح للدراسة
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '10px'
                        }}>
                            {[
                                '📌 الأربعاء: بعد الظهر راحة إجبارية',
                                '📌 الجمعة والسبت: دراسة فقط في الصباح',
                                '🎯 بومودورو: 25 دقيقة + 5 دقيقة راحة',
                                '⭐ المواد عالية الأولوية في الصباح',
                                '📝 بكالوريات سابقة في عطلة نهاية الأسبوع'
                            ].map((tip, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '10px 14px',
                                    borderRadius: '10px',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '13px',
                                    border: '1px solid rgba(255,255,255,0.03)',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                }}>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {!isGenerated && (
                <div style={{
                    textAlign: 'center',
                    padding: '70px 20px',
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: '16px',
                    border: '2px dashed rgba(255,255,255,0.05)',
                    borderRadius: '16px'
                }}>
                    <div style={{ fontSize: '56px', marginBottom: '16px' }}>📅</div>
                    <p style={{ fontSize: '18px', fontWeight: '500' }}>اضغط على "إنشاء الجدول" لبناء جدولك الدراسي الأسبوعي</p>
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'rgba(255,255,255,0.15)' }}>
                        سيتم توزيع المهام حسب الأولوية والأيام المتاحة
                    </p>
                </div>
            )}
        </div>
    );
}