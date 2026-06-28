# ============================================
# TEST SCRIPT - Load all saved models
# Run this to verify everything works
# ============================================

import joblib
import json
import os

print("=" * 60)
print("🧪 TESTING MODEL LOADING")
print("=" * 60)

base_path = "backend/ml_models/pre_bac"

# 1. Load model
try:
    model = joblib.load(f"{base_path}/prebac_model.pkl")
    print(f"✅ Model loaded: {type(model).__name__}")
except:
    print("⚠️ No main model found")

# 2. Load scaler
try:
    scaler = joblib.load(f"{base_path}/scaler.pkl")
    print("✅ Scaler loaded")
except:
    print("⚠️ No scaler found")

# 3. Load feature names
try:
    with open(f"{base_path}/feature_names.json", "r") as f:
        features = json.load(f)
    print(f"✅ Features loaded: {features['feature_count']} features")
except:
    print("⚠️ No feature names found")

# 4. Load cluster info
try:
    with open(f"{base_path}/cluster_info.json", "r") as f:
        clusters = json.load(f)
    print(f"✅ Cluster info loaded: {len(clusters)} filières")
except:
    print("⚠️ No cluster info found")

# 5. Load metrics
try:
    with open(f"{base_path}/model_metrics.json", "r") as f:
        metrics = json.load(f)
    print(f"✅ Metrics loaded: R²={metrics.get('r2_score', 'N/A')}")
except:
    print("⚠️ No metrics found")

print("=" * 60)
print("✅ Test complete!")