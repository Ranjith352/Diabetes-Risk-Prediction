# 🩺 Diabetes Risk Prediction System

A modern, full-stack predictive healthcare application built with a **React.js + Tailwind CSS** frontend and a **Python Flask REST API** backend powered by Machine Learning ensembles (**Random Forest**, **Naive Bayes**, **Decision Tree**, **AdaBoost**, **Bagging**).

---

## ✨ Features

- 🔑 **Authentication Console**: Modern glassmorphism Login page with demo credentials toggle.
- 🩺 **Interactive Risk Assessment**: Input patient health biomarkers (Glucose, BMI, BP, Insulin, Age, Pregnancies, DPF) with real-time range sliders, algorithm selection, and instant 0-100% risk probability score meter.
- 📜 **Prediction History**: Searchable and filterable history table stored in SQLite database with **CSV Export** and patient inspection modal.
- 📈 **Health Analytics & Trends**: Interactive **Recharts** dashboard featuring:
  - ML Model Accuracy, Precision & F1 Score benchmark comparisons.
  - Glucose vs BMI Scatter Plot showing cluster separation between diabetic risk and non-diabetic groups.
  - Age Group Risk Distribution.
  - Feature Impact Ranking relative to outcome.
- 📄 **Clinical Risk Reports**: Printable, standardized medical evaluation summary report generator for patients and endocrinologists.
- 👤 **Practitioner Profile**: Account management for medical practitioner details and preferences.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Glassmorphism, CSS Modules
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend & ML
- **Framework**: Python 3.x, Flask REST API with CORS
- **ML Engine**: Scikit-learn, Pandas, NumPy
- **Models**: Random Forest, Gaussian Naive Bayes, Decision Tree, AdaBoost, Bagging
- **Dataset**: Pima Indians Diabetes Dataset (`dataset CAT II.csv`)
- **Database**: SQLite (`backend/diabetes_records.db`)

---

## 📁 Project Structure

```
Diabetes-Risk-Prediction/
│
├── backend/
│   ├── app.py                # Flask REST API backend & ML model trainer
│   └── diabetes_records.db   # SQLite database for history & user profiles
│
├── frontend/
│   ├── src/
│   │   ├── api.js            # Axios REST API Client layer
│   │   ├── components/       # Navigation Sidebar & Navbar
│   │   ├── pages/            # Login, Dashboard, RiskAssessment, History, Trends, Reports, Profile
│   │   ├── App.jsx           # React Router v6 setup
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind CSS styling & glassmorphism utilities
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── dataset CAT II.csv         # Pima Indians Diabetes Dataset
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup & Run

Navigate to the project root directory and install Python dependencies:

```bash
pip install flask flask-cors pandas numpy scikit-learn
```

Start the Flask REST API server:

```bash
python backend/app.py
```

*The REST API will run at `http://localhost:5000`.*

---

### 2. Frontend Setup & Run

Open a second terminal, navigate to the `frontend` folder, and install Node dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

*The React web application will run at `http://localhost:3000`.*

---

## 📊 Dataset Features

| Feature | Description | Range / Unit |
|---|---|---|
| **Pregnancies** | Number of times pregnant | 0 - 20 |
| **Glucose** | Plasma glucose concentration after 2h tolerance test | 50 - 250 mg/dL |
| **BloodPressure** | Diastolic blood pressure | 40 - 140 mm Hg |
| **SkinThickness** | Triceps skin fold thickness | 0 - 99 mm |
| **Insulin** | 2-Hour serum insulin | 0 - 400 mu U/ml |
| **BMI** | Body Mass Index (weight in kg / (height in m)^2) | 15.0 - 55.0 |
| **DiabetesPedigreeFunction** | Diabetes hereditary pedigree function | 0.08 - 2.50 |
| **Age** | Age in years | 21 - 110 |
| **Outcome** | Target variable | 0 = Non-Diabetic, 1 = Diabetic |

---

## 🔌 API Endpoints Summary

- `POST /api/auth/login` - Authenticate user & return token.
- `POST /api/predict` - Perform live ML risk inference & store record.
- `GET /api/history` - Retrieve prediction history log.
- `DELETE /api/history/<id>` - Delete historical prediction entry.
- `GET /api/models/evaluate` - Return accuracy, precision, recall, and F1 metrics for 5 ML models.
- `GET /api/health-trends` - Return population biomarker scatter plot & correlation metrics.
- `GET /api/profile` / `PUT /api/profile` - Manage practitioner profile.
