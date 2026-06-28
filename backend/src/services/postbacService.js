// backend/src/services/postbacService.js
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class PostbacService {
    constructor() {
        this.models = {};
        this.data = null;
        this.loaded = false;
        this.modelPath = path.join(__dirname, '../../ml_models/post_bac');
        this.dataPath = path.join(this.modelPath, 'data.json');
    }

    // ============================================
    // LOAD MODELS AND DATA
    // ============================================
    
    loadModels() {
        if (this.loaded) return true;
        
        console.log('📂 Loading Post-BAC models...');
        
        const filieres = ['Sciences', 'Maths', 'Technique_Mathematique', 'Gestion', 'Langues', 'Lettres'];
        
        for (const filiere of filieres) {
            const filename = `model_${filiere}.pkl`.replace(' ', '_');
            const filepath = path.join(this.modelPath, filename);
            
            if (fs.existsSync(filepath)) {
                this.models[filiere] = filepath;
                console.log(`   ✅ ${filiere} model found`);
            } else {
                console.log(`   ⚠️ ${filiere} model not found: ${filepath}`);
            }
        }
        
        // Load data.json
        if (fs.existsSync(this.dataPath)) {
            this.data = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
            console.log(`   ✅ data.json loaded (${this.data.length} domains)`);
        } else {
            console.log(`   ⚠️ data.json not found: ${this.dataPath}`);
        }
        
        this.loaded = true;
        return true;
    }

    // ============================================
    // PREDICT DOMAINS
    // ============================================
    
    async predictDomains(studentData) {
        const filiere = studentData.bac_stream;
        
        if (!this.models[filiere]) {
            throw new Error(`No model found for filiere: ${filiere}`);
        }
        
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(__dirname, '../../ml_scripts/postbac_predict.py');
            const modelPath = this.models[filiere];
            const dataPath = this.dataPath;
            
            const python = spawn('python', [
                scriptPath,
                '--model', modelPath,
                '--data', dataPath,
                '--input', JSON.stringify(studentData),
                '--filiere', filiere
            ]);
            
            let stdout = '';
            let stderr = '';
            
            python.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            python.stderr.on('data', (data) => {
                stderr += data.toString();
                console.log('⚠️ Python stderr:', data.toString());
            });
            
            python.on('close', (code) => {
                if (code === 0) {
                    try {
                        const result = JSON.parse(stdout.trim());
                        resolve(result);
                    } catch (e) {
                        reject(new Error(`Failed to parse Python output: ${e.message}`));
                    }
                } else {
                    reject(new Error(stderr || 'Python process failed'));
                }
            });
            
            python.on('error', (err) => {
                reject(err);
            });
        });
    }

    // ============================================
    // GET DOMAIN MAPPING
    // ============================================
    
    getDomainMapping() {
        return {
            'maths_info': 'الرياضيات والإعلام الآلي',
            'st': 'العلوم والتكنولوجيا (ST)',
            'snv': 'علوم الطبيعة والحياة (SNV)',
            'medecine': 'الطب والطب المساعد (العلوم الطبية)',
            'segc': 'العلوم الاقتصادية، علوم التسيير والعلوم التجارية (SEGC)',
            'lettres_langues': 'الآداب واللغات',
            'droit': 'الحقوق والعلوم السياسية',
            'sciences_humaines': 'العلوم الإنسانية والاجتماعية',
            'islamiques': 'العلوم الإسلامية',
            'arts': 'الفنون والثقافة',
            'staps': 'STAPS (علوم وتقنيات النشاطات البدنية والرياضية)'
        };
    }

    getWilayaName(code) {
        const wilayas = {
            1: 'أدرار', 2: 'الشلف', 3: 'الأغواط', 4: 'أم البواقي', 5: 'باتنة',
            6: 'بجاية', 7: 'بسكرة', 8: 'بشار', 9: 'البليدة', 10: 'البويرة',
            11: 'تمنراست', 12: 'تبسة', 13: 'تلمسان', 14: 'تيارت', 15: 'تيزي وزو',
            16: 'الجزائر', 17: 'الجلفة', 18: 'جيجل', 19: 'سطيف', 20: 'سعيدة',
            21: 'سكيكدة', 22: 'سيدي بلعباس', 23: 'عنابة', 24: 'قالمة', 25: 'قسنطينة',
            26: 'المدية', 27: 'مستغانم', 28: 'المسيلة', 29: 'معسكر', 30: 'ورقلة',
            31: 'وهران', 32: 'البيض', 33: 'إليزي', 34: 'برج بوعريريج', 35: 'بومرداس',
            36: 'الطارف', 37: 'تندوف', 38: 'تيسمسيلت', 39: 'الوادي', 40: 'خنشلة',
            41: 'سوق أهراس', 42: 'تيبازة', 43: 'ميلة', 44: 'عين الدفلى', 45: 'النعامة',
            46: 'عين تيموشنت', 47: 'غرداية', 48: 'غليزان', 49: 'تيميمون', 50: 'برج باجي مختار',
            51: 'أولاد جلال', 52: 'بني عباس', 53: 'عين صالح', 54: 'عين قزام', 55: 'تقرت',
            56: 'جانت', 57: 'المغير', 58: 'المنيعة'
        };
        return wilayas[code] || `ولاية ${code}`;
    }
}

module.exports = new PostbacService();