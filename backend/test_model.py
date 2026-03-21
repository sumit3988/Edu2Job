import joblib
import pandas as pd
import os

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ml_model")

model = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
le_degree = joblib.load(os.path.join(MODEL_DIR, "encoder_degree.pkl"))
le_branch = joblib.load(os.path.join(MODEL_DIR, "encoder_branch.pkl"))
le_role = joblib.load(os.path.join(MODEL_DIR, "encoder_role.pkl"))
feature_columns = joblib.load(os.path.join(MODEL_DIR, "feature_columns.pkl"))

# Creating a test profile for Chemical Engineer
degree_encoded = le_degree.transform(["B.Tech"])[0]
branch_encoded = le_branch.transform(["Chemical"])[0]

row = {
    "degree_encoded": degree_encoded,
    "branch_encoded": branch_encoded,
    "gpa": 8.0,
    "num_certs": 1,
    "num_projects": 3,
    "num_internships": 1,
}

skills = ["chemistry", "thermodynamics", "hysys"]

for col in feature_columns:
    if col not in row:
        row[col] = 1 if col in skills else 0

df_input = pd.DataFrame([row])
df_input = df_input[feature_columns]

X_scaled = scaler.transform(df_input)
probs = model.predict_proba(X_scaled)[0]
top_idx = probs.argsort()[-3:][::-1]
top_roles = le_role.inverse_transform(top_idx)

print("Top predictions for Chemical branch with chemistry & thermodynamics:")
for role in top_roles:
    print(f"- {role}")
