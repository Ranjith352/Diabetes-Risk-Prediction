import os
import json
import sqlite3
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier, BaggingClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "dataset CAT II.csv")
DB_PATH = os.path.join(BASE_DIR, "backend", "diabetes_records.db")

# Ensure database directory exists
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT,
            age INTEGER,
            gender TEXT,
            pregnancies INTEGER,
            glucose REAL,
            blood_pressure REAL,
            skin_thickness REAL,
            insulin REAL,
            bmi REAL,
            dpf REAL,
            model_used TEXT,
            prediction INTEGER,
            risk_level TEXT,
            risk_score REAL,
            created_at TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            age INTEGER,
            gender TEXT,
            mobile TEXT,
            location TEXT,
            blood_group TEXT,
            medical_history TEXT,
            created_at TEXT
        )
    ''')
    
    # Insert default user profile if empty
    cursor.execute("SELECT COUNT(*) FROM user_profiles")
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO user_profiles (name, email, age, gender, mobile, location, blood_group, medical_history, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ("Dr. Sarah Jenkins", "sarah.jenkins@health.org", 38, "Female", "+1 (555) 234-5678", "New York, USA", "O+", "Family history of Type-2 Diabetes", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    
    conn.commit()
    conn.close()

init_db()

def load_data():
    if os.path.exists(DATASET_PATH):
        return pd.read_csv(DATASET_PATH)
    else:
        # Fallback dataset generator if CSV missing
        np.random.seed(42)
        n = 500
        df = pd.DataFrame({
            'Pregnancies': np.random.randint(0, 10, n),
            'Glucose': np.random.randint(70, 200, n),
            'BloodPressure': np.random.randint(50, 110, n),
            'SkinThickness': np.random.randint(10, 50, n),
            'Insulin': np.random.randint(15, 300, n),
            'BMI': np.round(np.random.uniform(18.5, 45.0, n), 1),
            'DiabetesPedigreeFunction': np.round(np.random.uniform(0.08, 2.0, n), 3),
            'Age': np.random.randint(21, 75, n),
            'Outcome': np.random.choice([0, 1], n, p=[0.65, 0.35])
        })
        return df

def train_selected_model(model_name, df):
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Naive Bayes": GaussianNB(),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Bagging": BaggingClassifier(random_state=42),
        "Boosting": AdaBoostClassifier(random_state=42)
    }

    selected = models.get(model_name, GaussianNB())
    selected.fit(X_train, y_train)
    return selected

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', 'admin@diabetes.org')
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    return jsonify({
        "status": "success",
        "token": "fake-jwt-token-diabetes-app-2026",
        "user": {
            "name": "Dr. Sarah Jenkins",
            "email": email,
            "role": "Medical Specialist",
            "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"
        }
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
        patient_name = data.get('name', 'Anonymous Patient')
        age = int(data.get('age', 30))
        gender = data.get('gender', 'Other')
        pregnancies = int(data.get('pregnancies', 1))
        glucose = float(data.get('glucose', 120))
        bp = float(data.get('bloodPressure', 70))
        skin = float(data.get('skinThickness', 20))
        insulin = float(data.get('insulin', 80))
        bmi = float(data.get('bmi', 25.0))
        dpf = float(data.get('dpf', 0.5))
        model_name = data.get('model', 'Random Forest')

        df = load_data()
        model = train_selected_model(model_name, df)

        features = pd.DataFrame([{
            'Pregnancies': pregnancies,
            'Glucose': glucose,
            'BloodPressure': bp,
            'SkinThickness': skin,
            'Insulin': insulin,
            'BMI': bmi,
            'DiabetesPedigreeFunction': dpf,
            'Age': age
        }])

        pred = int(model.predict(features)[0])

        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(features)[0]
            risk_score = round(float(probs[1]) * 100, 1)
        else:
            risk_score = 85.0 if pred == 1 else 15.0

        if risk_score < 35.0:
            risk_level = "Low Risk"
        elif risk_score < 70.0:
            risk_level = "Moderate Risk"
        else:
            risk_level = "High Risk"

        # Generate clinical recommendations
        recommendations = []
        if glucose > 140:
            recommendations.append("High Glucose level detected (>140 mg/dL). Fasting blood sugar check recommended.")
        elif glucose < 70:
            recommendations.append("Hypoglycemia alert. Glucose is below normal range.")
        else:
            recommendations.append("Glucose levels within manageable limits.")

        if bmi >= 30.0:
            recommendations.append("BMI indicates Obesity (>=30). Dietary intervention and 150 mins weekly exercise advised.")
        elif bmi >= 25.0:
            recommendations.append("BMI indicates Overweight range. Regular physical activity recommended.")
        
        if bp > 90:
            recommendations.append("Elevated blood pressure observed. Monitor diastolic blood pressure weekly.")

        if dpf > 0.8:
            recommendations.append("High genetic/pedigree predisposition. Early annual glycemic screening strongly advised.")

        if pred == 1:
            recommendations.append("Consult an Endocrinologist for an HbA1c test and customized care plan.")

        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Save to SQLite
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions (
                patient_name, age, gender, pregnancies, glucose, blood_pressure,
                skin_thickness, insulin, bmi, dpf, model_used, prediction, risk_level, risk_score, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (patient_name, age, gender, pregnancies, glucose, bp, skin, insulin, bmi, dpf, model_name, pred, risk_level, risk_score, created_at))
        conn.commit()
        record_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "id": record_id,
            "patientName": patient_name,
            "prediction": pred,
            "resultText": "Diabetic Risk Detected" if pred == 1 else "Non-Diabetic / Low Risk",
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "modelUsed": model_name,
            "createdAt": created_at,
            "recommendations": recommendations,
            "inputParameters": {
                "Pregnancies": pregnancies,
                "Glucose": glucose,
                "BloodPressure": bp,
                "SkinThickness": skin,
                "Insulin": insulin,
                "BMI": bmi,
                "DiabetesPedigreeFunction": dpf,
                "Age": age
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "id": r["id"],
            "patientName": r["patient_name"],
            "age": r["age"],
            "gender": r["gender"],
            "pregnancies": r["pregnancies"],
            "glucose": r["glucose"],
            "bloodPressure": r["blood_pressure"],
            "skinThickness": r["skin_thickness"],
            "insulin": r["insulin"],
            "bmi": r["bmi"],
            "dpf": r["dpf"],
            "modelUsed": r["model_used"],
            "prediction": r["prediction"],
            "riskLevel": r["risk_level"],
            "riskScore": r["risk_score"],
            "createdAt": r["created_at"]
        })
    return jsonify(history)

@app.route('/api/history/<int:record_id>', methods=['DELETE'])
def delete_history_item(record_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Record deleted"})

@app.route('/api/models/evaluate', methods=['GET'])
def evaluate_models():
    df = load_data()
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Naive Bayes": GaussianNB(),
        "Bagging": BaggingClassifier(random_state=42),
        "Boosting": AdaBoostClassifier(random_state=42)
    }

    eval_results = []
    best_model_name = ""
    highest_acc = 0

    for name, m in models.items():
        m.fit(X_train, y_train)
        y_pred = m.predict(X_test)
        acc = round(accuracy_score(y_test, y_pred) * 100, 2)
        report = classification_report(y_test, y_pred, output_dict=True)
        cm = confusion_matrix(y_test, y_pred).tolist()

        if acc > highest_acc:
            highest_acc = acc
            best_model_name = name

        eval_results.append({
            "name": name,
            "accuracy": acc,
            "precision": round(report["weighted avg"]["precision"] * 100, 2),
            "recall": round(report["weighted avg"]["recall"] * 100, 2),
            "f1Score": round(report["weighted avg"]["f1-score"] * 100, 2),
            "confusionMatrix": cm
        })

    return jsonify({
        "models": eval_results,
        "bestModel": best_model_name,
        "bestAccuracy": highest_acc,
        "totalSamples": len(df),
        "trainSamples": len(X_train),
        "testSamples": len(X_test)
    })

@app.route('/api/health-trends', methods=['GET'])
def get_health_trends():
    df = load_data()
    
    # Scatter plot sample points for Glucose vs BMI
    sample = df.sample(n=min(120, len(df)), random_state=42)
    scatter_data = []
    for idx, row in sample.iterrows():
        scatter_data.append({
            "glucose": float(row["Glucose"]),
            "bmi": float(row["BMI"]),
            "age": int(row["Age"]),
            "outcome": int(row["Outcome"]),
            "label": "Diabetic" if row["Outcome"] == 1 else "Non-Diabetic"
        })

    # Age group risk distribution
    df["AgeGroup"] = pd.cut(df["Age"], bins=[20, 30, 40, 50, 60, 100], labels=["21-30", "31-40", "41-50", "51-60", "60+"])
    age_risk = df.groupby(["AgeGroup", "Outcome"], observed=False).size().unstack(fill_value=0)
    
    age_group_data = []
    for grp in age_risk.index:
        non_diabetic = int(age_risk.loc[grp, 0]) if 0 in age_risk.columns else 0
        diabetic = int(age_risk.loc[grp, 1]) if 1 in age_risk.columns else 0
        age_group_data.append({
            "ageGroup": str(grp),
            "NonDiabetic": non_diabetic,
            "Diabetic": diabetic
        })

    # Correlation Matrix
    corr = df.drop(columns=["AgeGroup"], errors="ignore").corr().round(2)
    corr_list = []
    for col in corr.columns:
        corr_list.append({
            "feature": col,
            "correlationWithOutcome": float(corr.loc[col, "Outcome"])
        })

    return jsonify({
        "scatterData": scatter_data,
        "ageGroupData": age_group_data,
        "featureCorrelations": sorted(corr_list, key=lambda x: x["correlationWithOutcome"], reverse=True)
    })

@app.route('/api/profile', methods=['GET', 'PUT'])
def user_profile():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    if request.method == 'PUT':
        data = request.json or {}
        cursor.execute('''
            UPDATE user_profiles SET
                name = ?, age = ?, gender = ?, mobile = ?, location = ?, blood_group = ?, medical_history = ?
            WHERE id = 1
        ''', (
            data.get('name', 'Dr. Sarah Jenkins'),
            data.get('age', 38),
            data.get('gender', 'Female'),
            data.get('mobile', '+1 (555) 234-5678'),
            data.get('location', 'New York, USA'),
            data.get('bloodGroup', 'O+'),
            data.get('medicalHistory', 'Family history of Type-2 Diabetes')
        ))
        conn.commit()

    cursor.execute("SELECT * FROM user_profiles LIMIT 1")
    r = cursor.fetchone()
    conn.close()

    if r:
        return jsonify({
            "name": r["name"],
            "email": r["email"],
            "age": r["age"],
            "gender": r["gender"],
            "mobile": r["mobile"],
            "location": r["location"],
            "bloodGroup": r["blood_group"],
            "medicalHistory": r["medical_history"]
        })
    else:
        return jsonify({"name": "Dr. Sarah Jenkins", "email": "sarah.jenkins@health.org"})

@app.route('/api/dashboard-summary', methods=['GET'])
def get_dashboard_summary():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM predictions")
    total_preds = cursor.fetchone()["total"]
    
    cursor.execute("SELECT COUNT(*) as high FROM predictions WHERE risk_level = 'High Risk' OR prediction = 1")
    high_risk_count = cursor.fetchone()["high"]
    
    cursor.execute("SELECT AVG(glucose) as avg_g, AVG(bmi) as avg_b FROM predictions")
    avg_row = cursor.fetchone()
    avg_glucose = round(avg_row["avg_g"] or 0, 1)
    avg_bmi = round(avg_row["avg_b"] or 0, 1)

    cursor.execute("SELECT * FROM predictions ORDER BY id DESC LIMIT 5")
    recent = []
    for r in cursor.fetchall():
        recent.append({
            "id": r["id"],
            "patientName": r["patient_name"],
            "glucose": r["glucose"],
            "bmi": r["bmi"],
            "modelUsed": r["model_used"],
            "riskLevel": r["risk_level"],
            "riskScore": r["risk_score"],
            "createdAt": r["created_at"]
        })
    conn.close()

    return jsonify({
        "totalAssessments": total_preds,
        "highRiskCases": high_risk_count,
        "avgGlucose": avg_glucose,
        "avgBmi": avg_bmi,
        "recentPredictions": recent
    })

if __name__ == '__main__':
    print("Starting Diabetes Risk Prediction REST API on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
