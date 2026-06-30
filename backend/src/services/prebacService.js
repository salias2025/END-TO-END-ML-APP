// backend/src/services/prebacService.js

const fs = require('fs');
const path = require('path');

// ============================================
// FILIERE MAPPING
// ============================================
const FILIERE_MAP = {
  'علوم تجريبية': 'sciences_experimentales',
  'رياضيات': 'maths',
  'تقني رياضي': 'techniques_maths',
  'تسيير واقتصاد': 'gestion_economie',
  'لغات أجنبية': 'langues_etrangeres',
  'آداب وفلسفة': 'lettres_philosophie'
};

const FILIERE_NAMES = {
  'sciences_experimentales': 'علوم تجريبية',
  'maths': 'رياضيات',
  'techniques_maths': 'تقني رياضي',
  'gestion_economie': 'تسيير واقتصاد',
  'langues_etrangeres': 'لغات أجنبية',
  'lettres_philosophie': 'آداب وفلسفة'
};

// ============================================
// CLUSTER DEFINITIONS - FIXED for maths
// ============================================
const CLUSTER_NAMES = {
  'sciences_experimentales': {
    0: { name: '🟢 ممتاز', min: 17, max: 20 },
    1: { name: '🔵 جيد جداً', min: 15.5, max: 17 },
    2: { name: '🟡 جيد', min: 13.5, max: 15.5 },
    3: { name: '🟠 مقبول', min: 11.5, max: 13.5 },
    4: { name: '🔴 راسب', min: 9, max: 11.5 },
    5: { name: '⚫ ضعيف جداً', min: 0, max: 9 }
  },
  'maths': {
    0: { name: '🟢 ممتاز', min: 17.5, max: 20 },
    1: { name: '🟡 جيد', min: 14.5, max: 17.5 },
    2: { name: '🔴 راسب', min: 0, max: 14.5 }
  },
  'techniques_maths': {
    0: { name: '🟢 جيد', min: 14, max: 20 },
    1: { name: '🟡 متوسط', min: 11.5, max: 14 },
    2: { name: '🔴 راسب', min: 0, max: 11.5 }
  },
  'gestion_economie': {
    0: { name: '🟢 جيد', min: 14, max: 20 },
    1: { name: '🟡 متوسط', min: 11.5, max: 14 },
    2: { name: '🔴 راسب', min: 0, max: 11.5 }
  },
  'langues_etrangeres': {
    0: { name: '🟢 جيد', min: 14, max: 20 },
    1: { name: '🟡 متوسط', min: 11.5, max: 14 },
    2: { name: '🔴 راسب', min: 0, max: 11.5 }
  },
  'lettres_philosophie': {
    0: { name: '🟢 جيد', min: 14, max: 20 },
    1: { name: '🟡 متوسط', min: 11.5, max: 14 },
    2: { name: '🔴 راسب', min: 0, max: 11.5 }
  }
};

const DEFAULT_CLUSTERS = {
  0: { name: '🟢 جيد', min: 14, max: 20 },
  1: { name: '🟡 متوسط', min: 11.5, max: 14 },
  2: { name: '🔴 راسب', min: 0, max: 11.5 }
};

// ============================================
// GLOBAL STATE
// ============================================
let _dfMl = [];
let _dataLoaded = false;

// ============================================
// GETTER FUNCTIONS
// ============================================
const getDataLoaded = () => _dataLoaded;
const getDfMl = () => _dfMl;
const getTotalStudents = () => _dfMl.length;

// ============================================
// SETTER FUNCTIONS
// ============================================
const setDataLoaded = (value) => { _dataLoaded = value; };
const setDfMl = (data) => { _dfMl = data; };

// ============================================
// LOAD ALL DATA FILES
// ============================================
const loadAllData = () => {
    return new Promise((resolve) => {
        console.log('='.repeat(60));
        console.log('📂 LOADING PRE-BAC DATA');
        console.log('='.repeat(60));
        
        try {
            const dataDir = path.join(__dirname, '../../data/pre_bac');
            
            console.log(`📁 Data directory: ${dataDir}`);
            console.log(`📁 Directory exists: ${fs.existsSync(dataDir)}`);
            
            if (!fs.existsSync(dataDir)) {
                console.log(`❌ Data directory NOT FOUND: ${dataDir}`);
                setDataLoaded(false);
                setDfMl([]);
                resolve([]);
                return;
            }

            const allFiles = fs.readdirSync(dataDir);
            console.log(`📂 Files in directory (${allFiles.length} total):`);
            allFiles.forEach(f => console.log(`   - ${f}`));

            // Try JSON first
            const jsonPath = path.join(dataDir, 'students_combined.json');
            console.log(`\n📄 Checking for JSON: ${jsonPath}`);
            console.log(`   JSON exists: ${fs.existsSync(jsonPath)}`);
            
            if (fs.existsSync(jsonPath)) {
                try {
                    console.log('📖 Reading JSON file...');
                    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                    
                    setDfMl(data);
                    setDataLoaded(true);
                    
                    console.log(`✅ SUCCESS! Loaded ${_dfMl.length} students from JSON`);
                    
                    if (_dfMl.length > 0) {
                        const filiereCounts = {};
                        _dfMl.forEach(s => {
                            const f = s.filiere || 'unknown';
                            filiereCounts[f] = (filiereCounts[f] || 0) + 1;
                        });
                        console.log('\n📊 Students by filière:');
                        Object.keys(filiereCounts).forEach(f => {
                            console.log(`   ${f}: ${filiereCounts[f]}`);
                        });
                    }
                    
                    resolve(_dfMl);
                    return;
                    
                } catch (err) {
                    console.error(`❌ Error reading JSON: ${err.message}`);
                    console.log('   Falling back to CSV...');
                }
            }

            // Fallback: Load from CSV
            console.log('\n📄 Loading from CSV files...');
            
            const csvFiles = allFiles.filter(f => 
                f.endsWith('.csv') && f !== 'students_prebac_raw.csv'
            );
            
            if (csvFiles.length === 0) {
                console.log('⚠️ No CSV files found');
                setDataLoaded(false);
                setDfMl([]);
                resolve([]);
                return;
            }

            let allStudents = [];
            
            csvFiles.forEach(file => {
                const filePath = path.join(dataDir, file);
                console.log(`\n📖 Reading: ${file}`);
                
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const lines = content.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        console.log(`   ⚠️ File is empty`);
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim());
                    console.log(`   Headers: ${headers.length} columns`);

                    let rowCount = 0;
                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;
                        
                        const values = lines[i].split(',').map(v => v.trim());
                        const student = {};
                        
                        headers.forEach((h, idx) => {
                            const val = values[idx] || '';
                            const num = parseFloat(val);
                            student[h] = isNaN(num) ? val : num;
                        });
                        
                        if (!student.filiere) {
                            const filiereMap = {
                                'students_gestion_economie': 'تسيير واقتصاد',
                                'students_langues_etrangeres': 'لغات أجنبية',
                                'students_lettres_philosophie': 'آداب وفلسفة',
                                'students_maths': 'رياضيات',
                                'students_sciences_experimentales': 'علوم تجريبية',
                                'students_techniques_maths': 'تقني رياضي'
                            };
                            const key = file.replace('.csv', '');
                            student.filiere = filiereMap[key] || file;
                        }
                        
                        allStudents.push(student);
                        rowCount++;
                    }
                    
                    console.log(`   ✅ Loaded ${rowCount} students from ${file}`);
                    
                } catch (err) {
                    console.error(`   ❌ Error loading ${file}: ${err.message}`);
                }
            });

            setDfMl(allStudents);
            setDataLoaded(true);
            
            console.log('\n' + '='.repeat(60));
            console.log(`📊 TOTAL STUDENTS LOADED: ${_dfMl.length}`);
            console.log('='.repeat(60));
            
            if (_dfMl.length > 0) {
                const filiereCounts = {};
                _dfMl.forEach(s => {
                    const f = s.filiere || 'unknown';
                    filiereCounts[f] = (filiereCounts[f] || 0) + 1;
                });
                console.log('\n📊 Students by filière:');
                Object.keys(filiereCounts).forEach(f => {
                    console.log(`   ${f}: ${filiereCounts[f]}`);
                });
            }
            
            resolve(_dfMl);
            
        } catch (error) {
            console.error('❌ Fatal error loading data:', error);
            setDataLoaded(false);
            setDfMl([]);
            resolve([]);
        }
    });
};

// ============================================
// PREDICT BAC (Regression Formula)
// ============================================
const predictBacRegression = (userInputs) => {
  const gradePrediction = 
    (userInputs.as2_avg_global || 11) * 0.55 +
    (userInputs.as1_avg_global || 11) * 0.20 +
    (userInputs.brevet_avg || 12) * 0.10 +
    (userInputs.as2_math || 11) * 0.05 +
    (userInputs.as2_science || 11) * 0.05 +
    (userInputs.as2_langues || 11) * 0.05;

  let habitAdjustment = 0;

  const sleep = userInputs.sleep_hours || 7;
  if (sleep >= 8) habitAdjustment += 0.8;
  else if (sleep <= 5) habitAdjustment -= 0.6;

  const studyHours = userInputs.weekly_study_hours || 15;
  const as2Avg = userInputs.as2_avg_global || 11;
  const efficiency = as2Avg / (studyHours + 0.1);
  if (efficiency >= 1.0) habitAdjustment += 0.5;
  else if (efficiency <= 0.6) habitAdjustment -= 0.8;

  const consistency = userInputs.study_consistency || 0.7;
  if (consistency >= 0.8) habitAdjustment += 0.5;
  else if (consistency <= 0.4) habitAdjustment -= 0.5;

  const stress = userInputs.stress_level || 3;
  if (stress <= 2) habitAdjustment += 0.4;
  else if (stress >= 4) habitAdjustment -= 0.4;

  const family = userInputs.family_support_score || 3;
  if (family >= 4) habitAdjustment += 0.3;

  const tutoring = userInputs.private_tutoring_hours || 0;
  if (tutoring >= 2 && tutoring <= 6) habitAdjustment += 0.3;

  const region = userInputs.region || '';
  if (['تيزي وزو', 'بجاية'].includes(region)) habitAdjustment += 0.5;

  if (userInputs.is_repeater) habitAdjustment -= 0.8;

  let finalBac = gradePrediction + habitAdjustment;
  finalBac = Math.max(5, Math.min(19.5, finalBac));

  const filiere = userInputs.filiere || '';
  const filiereAdjustments = {
    'علوم تجريبية': 0.2,
    'رياضيات': 0.5,
    'تقني رياضي': 0.1,
    'تسيير واقتصاد': -0.2,
    'لغات أجنبية': -0.3,
    'آداب وفلسفة': -0.3
  };
  if (filiereAdjustments[filiere]) {
    finalBac += filiereAdjustments[filiere];
  }

  return Math.max(5, Math.min(19.5, finalBac));
};

// ============================================
// GET CLUSTER NAME - FIXED
// ============================================
const getClusterName = (filiereCode, clusterId) => {
    // Try to get from CLUSTER_NAMES first
    if (CLUSTER_NAMES[filiereCode] && CLUSTER_NAMES[filiereCode][clusterId]) {
        return CLUSTER_NAMES[filiereCode][clusterId].name;
    }
    
    // Try default clusters
    if (DEFAULT_CLUSTERS[clusterId]) {
        return DEFAULT_CLUSTERS[clusterId].name;
    }
    
    // Fallback
    return `مجموعة ${clusterId}`;
};

// ============================================
// FIND CLOSEST STUDENT - FIXED VERSION
// ============================================
const findClosestStudent = (userInputs) => {
    console.log('\n🔍 FIND CLOSEST STUDENT');
    console.log(`📊 _dataLoaded: ${_dataLoaded}`);
    console.log(`📊 _dfMl length: ${_dfMl?.length || 0}`);
    console.log(`📊 Is _dfMl an array: ${Array.isArray(_dfMl)}`);
    
    if (!_dataLoaded || _dfMl.length === 0) {
        console.log('⚠️ Data not loaded, using mock data');
        return getMockMatchData(userInputs);
    }

    console.log(`✅ Data is loaded! Searching among ${_dfMl.length} students...`);

    // ✅ FIX: Map frontend filiere to dataset filiere
    const filiereMap = {
        'sciences_experimentales': 'علوم تجريبية',
        'maths': 'رياضيات',
        'techniques_maths': 'تقني رياضي',
        'gestion_economie': 'تسيير واقتصاد',
        'langues_etrangeres': 'لغات أجنبية',
        'lettres_philosophie': 'آداب وفلسفة'
    };
    
    // ✅ Use the mapped Arabic name
    const filiere = filiereMap[userInputs.filiere] || userInputs.filiere;
    console.log(`📚 Searching for filière: "${filiere}" (mapped from "${userInputs.filiere}")`);
    
    // ✅ Now filter by the Arabic name
    const filtered = _dfMl.filter(s => s.filiere === filiere);
    
    console.log(`📊 Found ${filtered.length} students in filière: ${filiere}`);
    
    if (filtered.length === 0) {
        console.log(`⚠️ No students found for filière: "${filiere}"`);
        const availableFiliere = [...new Set(_dfMl.map(s => s.filiere))];
        console.log(`   Available filières in dataset:`, availableFiliere);
        return getMockMatchData(userInputs);
    }

    // Show first few students for debugging
    console.log('\n📊 Sample students in this filière:');
    filtered.slice(0, 3).forEach((s, i) => {
        console.log(`   ${i+1}. Student #${s.student_id}: BAC=${s.bac_avg}, Math=${s.as2_math}`);
    });

    // Calculate similarity scores
    let similarities = filtered.map(student => {
        const mathDiff = Math.abs(student.as2_math - (userInputs.as2_math || 11)) / 20;
        const physicsDiff = Math.abs(student.as2_physics - (userInputs.as2_physics || 11)) / 20;
        const scienceDiff = Math.abs(student.as2_science - (userInputs.as2_science || 11)) / 20;
        const arabicDiff = Math.abs(student.as2_arabic - (userInputs.as2_arabic || 11)) / 20;
        const languesDiff = Math.abs(student.as2_langues - (userInputs.as2_langues || 11)) / 20;

        const as1MathDiff = Math.abs(student.as1_math - (userInputs.as1_math || 11)) / 20;
        const as1PhysicsDiff = Math.abs(student.as1_physics - (userInputs.as1_physics || 11)) / 20;
        const as1ScienceDiff = Math.abs(student.as1_science - (userInputs.as1_science || 11)) / 20;

        const brevetMathDiff = Math.abs(student.brevet_math - (userInputs.brevet_math || 12)) / 20;
        const brevetPhysicsDiff = Math.abs(student.brevet_physics - (userInputs.brevet_physics || 12)) / 20;
        const brevetScienceDiff = Math.abs(student.brevet_science - (userInputs.brevet_science || 12)) / 20;

        const studyDiff = Math.abs(student.weekly_study_hours - (userInputs.weekly_study_hours || 15)) / 40;
        const consistencyDiff = Math.abs(student.study_consistency - (userInputs.study_consistency || 0.7)) / 1;
        const sleepDiff = Math.abs(student.sleep_hours - (userInputs.sleep_hours || 7)) / 8;

        const stressDiff = Math.abs(student.stress_level - (userInputs.stress_level || 3)) / 5;
        const anxietyDiff = Math.abs(student.exam_anxiety - (userInputs.exam_anxiety || 3)) / 5;
        const familyDiff = Math.abs(student.family_support_score - (userInputs.family_support_score || 3)) / 5;

        const similarity = 
            mathDiff * 0.08 +
            physicsDiff * 0.08 +
            scienceDiff * 0.08 +
            arabicDiff * 0.08 +
            languesDiff * 0.08 +
            as1MathDiff * 0.05 +
            as1PhysicsDiff * 0.05 +
            as1ScienceDiff * 0.05 +
            brevetMathDiff * 0.035 +
            brevetPhysicsDiff * 0.035 +
            brevetScienceDiff * 0.03 +
            studyDiff * 0.08 +
            consistencyDiff * 0.06 +
            sleepDiff * 0.06 +
            stressDiff * 0.05 +
            anxietyDiff * 0.05 +
            familyDiff * 0.05;

        return { ...student, similarity };
    });

    // Sort by similarity (lowest = best match)
    similarities.sort((a, b) => a.similarity - b.similarity);

    // Show top 5 matches
    console.log('\n📊 Top 5 matches:');
    similarities.slice(0, 5).forEach((s, i) => {
        console.log(`   ${i+1}. Student #${s.student_id}: similarity=${s.similarity.toFixed(4)}, BAC=${s.bac_avg}`);
    });

    // Get best match
    const bestMatch = similarities[0];
    
    if (!bestMatch) {
        console.log('⚠️ No match found');
        return getMockMatchData(userInputs);
    }

    console.log(`\n✅ BEST MATCH FOUND:`);
    console.log(`   Student ID: ${bestMatch.student_id}`);
    console.log(`   Similarity: ${bestMatch.similarity.toFixed(4)}`);
    console.log(`   BAC: ${bestMatch.bac_avg}`);
    console.log(`   Filière: ${bestMatch.filiere}`);
    console.log(`   Cluster: ${bestMatch.cluster_filiere}`);

    // Calculate regression BAC
    const regressionBac = predictBacRegression(userInputs);

    // Hybrid prediction
    let finalBac;
    if (bestMatch.similarity < 0.1) {
        finalBac = bestMatch.bac_avg * 0.7 + regressionBac * 0.3;
    } else if (bestMatch.similarity < 0.2) {
        finalBac = bestMatch.bac_avg * 0.5 + regressionBac * 0.5;
    } else {
        finalBac = bestMatch.bac_avg * 0.3 + regressionBac * 0.7;
    }
    finalBac = Math.round(Math.max(5, Math.min(19.5, finalBac)) * 10) / 10;

    // ✅ FIX: Get cluster name using the helper function
    const filiereCode = FILIERE_MAP[userInputs.filiere] || 'sciences_experimentales';
    const clusterId = bestMatch.cluster_filiere || 0;
    const clusterName = getClusterName(filiereCode, clusterId);

    console.log(`   Cluster Name: ${clusterName}`);
    console.log(`   🎯 Final predicted BAC: ${finalBac}`);
    console.log('='.repeat(60));

    return {
        student_id: bestMatch.student_id,
        similarity: bestMatch.similarity,
        match_bac: bestMatch.bac_avg,
        regression_bac: regressionBac,
        final_bac: finalBac,
        cluster: clusterId,
        cluster_name: clusterName,
        archetype: bestMatch.archetype || clusterName,
        mention: bestMatch.bac_mention || 'جيد',
        filiere_code: filiereCode,
        filiere_arabic: userInputs.filiere,
        subject_grades: {
            as2_math: bestMatch.as2_math || 0,
            as2_physics: bestMatch.as2_physics || 0,
            as2_science: bestMatch.as2_science || 0,
            as2_arabic: bestMatch.as2_arabic || 0,
            as2_langues: bestMatch.as2_langues || 0
        },
        match_study_hours: bestMatch.weekly_study_hours || 0,
        match_sleep_hours: bestMatch.sleep_hours || 0
    };
};

// ============================================
// FALLBACK MOCK DATA
// ============================================
const getMockMatchData = (userInputs) => {
    console.log('⚠️ Using fallback mock data');
    const regressionBac = predictBacRegression(userInputs);
    const filiereCode = FILIERE_MAP[userInputs.filiere] || 'sciences_experimentales';

    let clusterId = 0;
    if (filiereCode === 'sciences_experimentales') {
        if (regressionBac >= 17) clusterId = 0;
        else if (regressionBac >= 15.5) clusterId = 1;
        else if (regressionBac >= 13.5) clusterId = 2;
        else if (regressionBac >= 11.5) clusterId = 3;
        else if (regressionBac >= 9) clusterId = 4;
        else clusterId = 5;
    } else if (filiereCode === 'maths') {
        if (regressionBac >= 17.5) clusterId = 0;
        else if (regressionBac >= 14.5) clusterId = 1;
        else clusterId = 2;
    } else {
        if (regressionBac >= 14) clusterId = 0;
        else if (regressionBac >= 11.5) clusterId = 1;
        else clusterId = 2;
    }

    const clusterName = getClusterName(filiereCode, clusterId);

    return {
        student_id: 817,
        similarity: 0.046,
        match_bac: Math.min(regressionBac + 1.2, 19),
        regression_bac: regressionBac,
        final_bac: Math.min(regressionBac + 0.5, 19.5),
        cluster: clusterId,
        cluster_name: clusterName,
        archetype: clusterName,
        mention: regressionBac >= 16 ? 'جيد جداً' : 'جيد',
        filiere_code: filiereCode,
        filiere_arabic: userInputs.filiere,
        subject_grades: {
            as2_math: Math.min(userInputs.as2_math + 1, 19.5),
            as2_physics: Math.min(userInputs.as2_physics + 0.5, 19.5),
            as2_science: Math.min(userInputs.as2_science + 0.5, 19.5),
            as2_arabic: Math.min(userInputs.as2_arabic + 0.5, 19.5),
            as2_langues: Math.min(userInputs.as2_langues + 0.5, 19.5)
        },
        match_study_hours: Math.min(userInputs.weekly_study_hours + 2, 30),
        match_sleep_hours: Math.min(userInputs.sleep_hours + 0.5, 8)
    };
};

// ============================================
// CALCULATE DERIVED FEATURES
// ============================================
const calculateDerivedFeatures = (data) => {
    const features = {};

    const studyEfficiency = data.as2_avg_global / (data.weekly_study_hours + 0.1);
    features.study_efficiency = parseFloat(studyEfficiency.toFixed(3));
    features.grinder_index = parseFloat((data.weekly_study_hours / (studyEfficiency + 0.1)).toFixed(1));

    const timeEssential = data.time_essential_subjects || 10;
    const timeNonEssential = data.time_non_essential_subjects || 5;
    features.time_allocation_ratio = parseFloat((timeEssential / (timeNonEssential + 0.1)).toFixed(2));
    features.resource_reliance = parseFloat((data.private_tutoring_hours / (data.weekly_study_hours + 0.1)).toFixed(3));
    features.improvement_momentum = parseFloat((data.as2_avg_global - data.as1_avg_global).toFixed(1));

    const grades = [data.brevet_avg || 12, data.as1_avg_global || 11, data.as2_avg_global || 11];
    const mean = grades.reduce((a, b) => a + b, 0) / grades.length;
    const squaredDiffs = grades.map(g => Math.pow(g - mean, 2));
    features.grade_volatility = parseFloat(Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / grades.length).toFixed(2));

    features.stress_performance_ratio = parseFloat((data.exam_anxiety / (data.as2_avg_global + 0.1)).toFixed(3));
    features.sleep_debt = Math.max(0, 8 - data.sleep_hours);
    features.health_stress_index = (6 - (data.health_state || 4)) * data.stress_level;

    const weakCols = ['weak_math', 'weak_physics', 'weak_science', 'weak_arabic', 'weak_langues', 'weak_hfada'];
    features.weakness_count = weakCols.filter(w => (data[w] || 0) > 0.6).length;
    features.problem_solving_gap = parseFloat(((data.weak_math || 0) + (data.weak_physics || 0) / 2).toFixed(2));

    const weakValues = weakCols.map(w => data[w] || 0);
    features.weakness_concentration = parseFloat((Math.max(...weakValues) - Math.min(...weakValues)).toFixed(2));

    const scienceWeak = ((data.weak_math || 0) + (data.weak_physics || 0) + (data.weak_science || 0)) / 3;
    const languageWeak = ((data.weak_arabic || 0) + (data.weak_langues || 0)) / 2;
    features.science_lang_gap = parseFloat((scienceWeak - languageWeak).toFixed(2));

    const subjectScores = [data.as2_math || 11, data.as2_physics || 11, data.as2_science || 11, data.as2_arabic || 11, data.as2_langues || 11];
    const subMean = subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length;
    const subSquaredDiffs = subjectScores.map(g => Math.pow(g - subMean, 2));
    features.subject_balance = parseFloat(Math.sqrt(subSquaredDiffs.reduce((a, b) => a + b, 0) / subjectScores.length).toFixed(2));

    const scienceAvg = (data.as2_math + data.as2_physics + data.as2_science) / 3;
    const languageAvg = (data.as2_arabic + data.as2_langues) / 2;
    const filiere = data.filiere || '';
    if (['رياضيات', 'علوم تجريبية', 'تقني رياضي'].includes(filiere)) {
        features.filiere_alignment = parseFloat((scienceAvg / 20).toFixed(3));
    } else if (['لغات أجنبية', 'آداب وفلسفة'].includes(filiere)) {
        features.filiere_alignment = parseFloat((languageAvg / 20).toFixed(3));
    } else {
        features.filiere_alignment = parseFloat(((scienceAvg + languageAvg) / 40).toFixed(3));
    }

    features.efficient_stressed = parseFloat((studyEfficiency * features.stress_performance_ratio).toFixed(3));
    features.consistent_weak = parseFloat((data.study_consistency * features.weakness_count).toFixed(2));
    features.repeater_penalty = data.is_repeater || 0;
    features.family_support_strength = parseFloat((data.family_support_score / 5).toFixed(2));

    const kabylieRegions = ['تيزي وزو', 'بجاية'];
    features.kabylie_boost = kabylieRegions.includes(data.region) ? 1 : 0;

    return features;
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  loadAllData,
  FILIERE_MAP,
  FILIERE_NAMES,
  CLUSTER_NAMES,
  DEFAULT_CLUSTERS,
  predictBacRegression,
  findClosestStudent,
  calculateDerivedFeatures,
  getMockMatchData,
  getDataLoaded,
  getDfMl,
  getTotalStudents
};