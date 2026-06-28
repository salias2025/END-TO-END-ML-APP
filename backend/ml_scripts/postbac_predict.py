# backend/ml_scripts/postbac_predict.py
import sys
import io
import pickle
import json
import argparse
import numpy as np

# Force UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def load_model(model_path):
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def load_data(data_path):
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# ============================================
# MAPPINGS (EXACTLY FROM NOTEBOOK)
# ============================================

# Mapping des noms de domaines (arabe -> id) - From Cell 11
NOMS_DOMAINES = {
    'الرياضيات والإعلام الآلي': 'maths_info',
    'العلوم والتكنولوجيا (ST)': 'st',
    'علوم الطبيعة والحياة (SNV)': 'snv',
    'الطب والطب المساعد (العلوم الطبية)': 'medecine',
    'العلوم الاقتصادية، علوم التسيير والعلوم التجارية (SEGC)': 'segc',
    'الآداب واللغات': 'lettres_langues',
    'الحقوق والعلوم السياسية': 'droit',
    'العلوم الإنسانية والاجتماعية': 'sciences_humaines',
    'العلوم الإسلامية': 'islamiques',
    'الفنون والثقافة': 'arts',
    'STAPS (علوم وتقنيات النشاطات البدنية والرياضية)': 'staps'
}

# Mapping inverse (id -> nom arabe) - From Cell 11
ID_TO_NOM = {v: k for k, v in NOMS_DOMAINES.items()}

# Mapping des noms de filières (français -> arabe) - From Cell 11
FILIERE_TO_ARABE = {
    'Sciences': 'علوم تجريبية',
    'Maths': 'رياضيات',
    'Technique_Mathematique': 'تقني رياضي',
    'Gestion': 'تسيير واقتصاد',
    'Langues': 'لغات أجنبية',
    'Lettres': 'آداب وفلسفة'
}

# Wilayas mapping - From Cell 11
def get_wilaya_name(code):
    wilayas = {
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
    }
    return wilayas.get(code, f"ولاية {code}")

# ============================================
# CALCULATE WEIGHTED AVERAGE - From Cell 11
# ============================================

def calculer_moyenne_ponderee(etudiant, domaine_nom):
    """Calculate weighted average for a domain - EXACTLY from notebook Cell 11"""
    if domaine_nom == 'الرياضيات والإعلام الآلي':
        return (etudiant['bac_avg'] * 2 + etudiant.get('maths_grade', 0)) / 3
    elif domaine_nom == 'العلوم والتكنولوجيا (ST)':
        return (etudiant['bac_avg'] * 2 + etudiant.get('physique_grade', 0)) / 3
    elif domaine_nom == 'علوم الطبيعة والحياة (SNV)':
        return (etudiant['bac_avg'] * 2 + etudiant.get('science_grade', 0)) / 3
    elif domaine_nom == 'الطب والطب المساعد (العلوم الطبية)':
        return (etudiant['bac_avg'] * 2 + etudiant.get('science_grade', 0) * 1.2 + 
                etudiant.get('maths_grade', 0) * 0.4 + etudiant.get('physique_grade', 0) * 0.4) / 4
    elif domaine_nom == 'العلوم الاقتصادية، علوم التسيير والعلوم التجارية (SEGC)':
        return (etudiant['bac_avg'] * 2 + etudiant.get('gestion_grade', 0) + etudiant.get('economie_grade', 0)) / 4
    elif domaine_nom == 'الحقوق والعلوم السياسية':
        return (etudiant['bac_avg'] * 2 + etudiant.get('arabe_grade', 0) + etudiant.get('his_geo_grade', 0)) / 4
    elif domaine_nom == 'الآداب واللغات':
        return (etudiant['bac_avg'] * 2 + etudiant.get('langue_etranger_grade', 0) + 
                etudiant.get('anglais_grade', 0) + etudiant.get('francais_grade', 0)) / 5
    elif domaine_nom == 'العلوم الإنسانية والاجتماعية':
        return (etudiant['bac_avg'] * 2 + etudiant.get('philo_grade', 0) + etudiant.get('his_geo_grade', 0)) / 4
    elif domaine_nom == 'العلوم الإسلامية':
        return (etudiant['bac_avg'] * 2 + etudiant.get('islamia_grade', 0) + etudiant.get('arabe_grade', 0)) / 4
    else:
        return etudiant['bac_avg']

# ============================================
# CALCULATE FEATURES FOR ML - From Cell 11
# ============================================

def calculer_weighted_et_features(etudiant, modele):
    """Calculate features for ML prediction - EXACTLY from notebook Cell 11"""
    bac = etudiant['bac_avg']
    
    all_features = {
        'bac_avg': bac,
        'maths_grade': etudiant.get('maths_grade', 0),
        'physique_grade': etudiant.get('physique_grade', 0),
        'science_grade': etudiant.get('science_grade', 0),
        'arabe_grade': etudiant.get('arabe_grade', 0),
        'philo_grade': etudiant.get('philo_grade', 0),
        'his_geo_grade': etudiant.get('his_geo_grade', 0),
        'francais_grade': etudiant.get('francais_grade', 0),
        'anglais_grade': etudiant.get('anglais_grade', 0),
        'weighted_maths_info': (bac * 2 + etudiant.get('maths_grade', 0)) / 3,
        'weighted_st': (bac * 2 + etudiant.get('physique_grade', 0)) / 3,
        'weighted_st_technique': (bac * 2 + etudiant.get('physique_grade', 0) + etudiant.get('techno_grade', 0)) / 4,
        'weighted_snv': (bac * 2 + etudiant.get('science_grade', 0)) / 3,
        'weighted_medecine': (bac * 2 + etudiant.get('science_grade', 0) * 1.2 + 
                              etudiant.get('maths_grade', 0) * 0.4 + etudiant.get('physique_grade', 0) * 0.4) / 4,
        'weighted_segc': (bac * 2 + etudiant.get('gestion_grade', 0) + etudiant.get('economie_grade', 0)) / 4,
        'weighted_droit': (bac * 2 + etudiant.get('arabe_grade', 0) + etudiant.get('his_geo_grade', 0)) / 4,
        'weighted_lettres_langues': (bac * 2 + etudiant.get('langue_etranger_grade', 0) + 
                                      etudiant.get('anglais_grade', 0) + etudiant.get('francais_grade', 0)) / 5,
        'weighted_sciences_humaines': (bac * 2 + etudiant.get('philo_grade', 0) + etudiant.get('his_geo_grade', 0)) / 4,
        'weighted_islamiques': (bac * 2 + etudiant.get('islamia_grade', 0) + etudiant.get('arabe_grade', 0)) / 4,
        'ratio_maths_science': etudiant.get('maths_grade', 0) / (etudiant.get('science_grade', 0) + 0.01),
        'ratio_maths_physique': etudiant.get('maths_grade', 0) / (etudiant.get('physique_grade', 0) + 0.01),
        'scientific_score': (etudiant.get('maths_grade', 0) + etudiant.get('physique_grade', 0) + etudiant.get('science_grade', 0)) / 3,
        'literary_score': (etudiant.get('arabe_grade', 0) + etudiant.get('philo_grade', 0) + etudiant.get('his_geo_grade', 0)) / 3,
        'science_minus_literary': 0,
        'consistency_score_final': etudiant.get('consistency_score_final', 3),
        'avg_variability': etudiant.get('avg_variability', 1.0)
    }
    all_features['science_minus_literary'] = all_features['scientific_score'] - all_features['literary_score']
    
    # Get feature order from model
    feature_order = modele.feature_names_in_
    return np.array([[all_features.get(f, 0) for f in feature_order]])

# ============================================
# PREDICT DOMAINS - From Cell 11
# ============================================

def predire_domaines(etudiant, modeles_par_filiere):
    """Predict top domains - EXACTLY from notebook Cell 11"""
    filiere = etudiant['bac_stream']
    
    # For Langues, always return lettres_langues (from notebook logic)
    if filiere == 'Langues':
        return [('lettres_langues', 1.0)]
    
    modele = modeles_par_filiere[filiere]
    X_etudiant = calculer_weighted_et_features(etudiant, modele)
    probas = modele.predict_proba(X_etudiant)[0]
    classes = modele.classes_
    
    # Apply boosts for high BAC students (from notebook Cell 11)
    if etudiant.get('bac_avg', 0) > 14 and filiere in ['Sciences', 'Maths', 'Technique_Mathematique']:
        for i in range(len(classes)):
            if classes[i] == 'medecine':
                probas[i] *= 1.5
            elif classes[i] == 'maths_info':
                probas[i] *= 2.0
            elif classes[i] == 'st':
                probas[i] *= 1.3
        probas = probas / probas.sum()
    
    ranking = sorted(zip(classes, probas), key=lambda x: x[1], reverse=True)
    return ranking[:5]

# ============================================
# GET FORMATIONS - From Cell 11
# ============================================

def get_formations_par_domaine(etudiant, domaine_id, proba_domaine, domaines_data):
    """Get formations for a domain - EXACTLY from notebook Cell 11"""
    domaine_nom = ID_TO_NOM.get(domaine_id)
    if not domaine_nom:
        return []
    
    # Find domain in data
    domaine_json = None
    for d in domaines_data:
        if d.get('domaine') == domaine_nom:
            domaine_json = d
            break
    
    if not domaine_json:
        return []
    
    filiere_arabe = FILIERE_TO_ARABE.get(etudiant['bac_stream'], etudiant['bac_stream'])
    formations = []
    
    for type_form, formations_json in domaine_json.get('formations', {}).items():
        for formation in formations_json:
            # Check streams_acceptes
            streams_acceptes = formation.get('streams_acceptes', {})
            priorite_info = None
            for stream, info in streams_acceptes.items():
                if stream == filiere_arabe:
                    priorite_info = info
                    break
            
            if not priorite_info:
                continue
            
            # Check weighted average >= seuil
            weighted_avg = calculer_moyenne_ponderee(etudiant, domaine_nom)
            seuil_min = priorite_info.get('min_moyenne_ponderee_2025', 0)
            
            if weighted_avg < seuil_min:
                continue
            
            # For ENS: only if career_orientation == 'Enseignement'
            if type_form == 'ens' and etudiant.get('career_orientation') != 'Enseignement':
                continue
            
            # Check wilayas (localisation)
            if type_form == 'lmd':
                localisation = formation.get('localisation', {})
                wilayas_acceptees = localisation.get('wilayas', [])
                if wilayas_acceptees != "جميع الولايات":
                    if get_wilaya_name(etudiant['wilaya']) not in wilayas_acceptees:
                        continue
            
            # Determine key subject for explanation
            matiere_cle = 'maths_grade'
            if domaine_id in ['medecine', 'snv']:
                matiere_cle = 'science_grade'
            elif domaine_id == 'st':
                matiere_cle = 'physique_grade'
            elif domaine_id == 'lettres_langues':
                matiere_cle = 'langue_etranger_grade'
            
            formations.append({
                'domaine': domaine_nom,
                'domaine_id': domaine_id,
                'domaine_proba': proba_domaine,
                'nom': formation['nom'],
                'type': type_form,
                'duree': formation.get('duree', ''),
                'priorite': priorite_info['priorite'],
                'seuil': seuil_min,
                'weighted_avg': round(weighted_avg, 1),
                'matiere_cle': matiere_cle,
                'debouches': formation.get('debouches', [])[:3]
            })
    
    return formations

# ============================================
# GENERATE EXPLANATION - IN ARABIC ✅ FIXED
# ============================================

def generer_explication(etudiant, formation):
    """Generate explanation text - IN ARABIC"""
    explication = f"✅ لديك معدل {etudiant['bac_avg']} في البكالوريا، "
    
    if formation['type'] in ['ecoles_superieures', 'cycle_long', 'ingeniorat']:
        explication += f"ومستوى استمرارية جيد ({etudiant.get('consistency_score_final', 3)}/5). "
        note_cle = etudiant.get(formation['matiere_cle'], 0)
        nom_matiere = formation['matiere_cle'].replace('_grade', '')
        explication += f"علامتك في مادة {nom_matiere} ({note_cle}) ممتازة. "
        if etudiant.get('career_orientation') == 'Recherche':
            explication += "ملفك الشخصي موجه للبحث العلمي، مما يتناسب تماماً مع هذا النوع من التكوين. "
    elif formation['type'] == 'ens':
        explication += "وأنت موجه نحو التعليم، مما يجعلك مرشحاً مثالياً للمدرسة العليا للأساتذة. "
    else:
        explication += "وملفك الشخصي مناسب تماماً لتكوين LMD المتاح من ولايتك. "
    
    explication += f"أنت تتجاوز الحد الأدنى للقبول ({formation['seuil']}) بمعدل {formation['weighted_avg']}."
    
    return explication

# ============================================
# MAIN RECOMMENDATION FUNCTION - From Cell 11
# ============================================

def recommander_formations(etudiant, modeles_par_filiere, domaines_data, top_n_domaines=3, page=0, par_page=10):
    """Main recommendation function - EXACTLY from notebook Cell 11"""
    # Get top domains
    top_domaines = predire_domaines(etudiant, modeles_par_filiere)
    
    toutes_formations = []
    for domaine_id, proba in top_domaines[:top_n_domaines]:
        formations = get_formations_par_domaine(etudiant, domaine_id, proba, domaines_data)
        toutes_formations.extend(formations)
    
    # Add explanations
    for f in toutes_formations:
        f['explication'] = generer_explication(etudiant, f)
    
    # 🔥 TRI GLOBAL PAR SEUIL DÉCROISSANT (tous domaines confondus) - From Cell 11
    toutes_formations.sort(key=lambda x: x['seuil'], reverse=True)
    
    start = page * par_page
    end = start + par_page
    return toutes_formations[start:end], top_domaines, len(toutes_formations)

# ============================================
# PREDICT DOMAINS (for the API response) - From Cell 13.b
# ============================================

def predict_domains_only(etudiant, modeles_par_filiere):
    """Predict domains only - From Cell 13.b"""
    filiere = etudiant['bac_stream']
    modele = modeles_par_filiere[filiere]
    
    X_etudiant = calculer_weighted_et_features(etudiant, modele)
    probas = modele.predict_proba(X_etudiant)[0]
    classes = modele.classes_
    
    # Apply boosts for high BAC students
    if etudiant.get('bac_avg', 0) > 14 and filiere in ['Sciences', 'Maths', 'Technique_Mathematique']:
        for i in range(len(classes)):
            if classes[i] == 'medecine':
                probas[i] *= 1.5
            elif classes[i] == 'maths_info':
                probas[i] *= 2.0
            elif classes[i] == 'st':
                probas[i] *= 1.3
        probas = probas / probas.sum()
    
    ranking = sorted(zip(classes, probas), key=lambda x: x[1], reverse=True)
    return ranking[:5]

# ============================================
# MAIN
# ============================================

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True)
    parser.add_argument('--data', required=True)
    parser.add_argument('--input', required=True)
    parser.add_argument('--filiere', required=True)
    args = parser.parse_args()
    
    # Load model and data
    model = load_model(args.model)
    data = load_data(args.data)
    student_data = json.loads(args.input)
    
    # Create model dict (for compatibility with notebook functions)
    modeles = {args.filiere: model}
    
    # Get top domains
    top_domains = predict_domains_only(student_data, modeles)
    
    # Get formations
    formations, top_domaines, total = recommander_formations(
        student_data, modeles, data, top_n_domaines=3, page=0, par_page=100
    )
    
    # Prepare result (matching notebook output)
    result = {
        'top_domains': [
            {'id': d, 'name': ID_TO_NOM.get(d, d), 'probability': p}
            for d, p in top_domains
        ],
        'formations': formations,
        'total': total
    }
    
    # Write JSON with UTF-8 encoding
    sys.stdout.write(json.dumps(result, ensure_ascii=False))
    sys.stdout.flush()

if __name__ == '__main__':
    main()