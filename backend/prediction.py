"""
prediction.py – ML prediction blueprint.
Loads saved model artifacts and exposes POST /prediction/predict.
"""

import os
import logging

import joblib
import pandas as pd
import numpy as np
from flask import Blueprint, request, jsonify

from auth import token_required

logger = logging.getLogger(__name__)

prediction_bp = Blueprint("prediction", __name__, url_prefix="/prediction")

# ---------------------------------------------------------------------------
# Paths to saved model artifacts
# ---------------------------------------------------------------------------
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ml_model")

_artifacts = {}


def load_model():
    """Load model artifacts at startup. Safe if files are missing."""
    files = {
        "model": "model.pkl",
        "scaler": "scaler.pkl",
        "encoder_degree": "encoder_degree.pkl",
        "encoder_role": "encoder_role.pkl",
        "feature_columns": "feature_columns.pkl",
    }
    for key, fname in files.items():
        path = os.path.join(MODEL_DIR, fname)
        if os.path.exists(path):
            _artifacts[key] = joblib.load(path)
            logger.info(f"Loaded {fname}")
        else:
            logger.warning(f"Model artifact missing: {fname}")

    if "model" in _artifacts:
        logger.info("ML model ready for predictions.")
    else:
        logger.warning("ML model NOT available – predictions will return errors.")


# ---------------------------------------------------------------------------
# POST /prediction/predict
# ---------------------------------------------------------------------------

@prediction_bp.route("/predict", methods=["POST"])
@token_required
def predict():
    # Check model availability
    if "model" not in _artifacts:
        return jsonify({
            "error": "ML model is not available. Please run train_model.py first."
        }), 503

    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON body"}), 400

    required = ["degree", "skills", "gpa", "experience", "certifications"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        model = _artifacts["model"]
        scaler = _artifacts["scaler"]
        le_degree = _artifacts["encoder_degree"]
        le_role = _artifacts["encoder_role"]
        feature_columns = _artifacts["feature_columns"]

        # ------ build feature vector ------
        skills_input = data["skills"]
        if isinstance(skills_input, str):
            skills_list = [s.strip().lower().replace(" ", "_") for s in skills_input.split(",")]
        else:
            skills_list = [s.strip().lower().replace(" ", "_") for s in skills_input]

        degree_val = data["degree"]
        if degree_val in le_degree.classes_:
            degree_encoded = le_degree.transform([degree_val])[0]
        else:
            degree_encoded = 0

        row = {
            "degree_encoded": degree_encoded,
            "gpa": float(data["gpa"]),
            "num_certs": int(data.get("certifications_count",
                             len(data["certifications"].split(",")) if isinstance(data["certifications"], str) and data["certifications"] else 0)),
            "num_projects": int(data.get("projects", 2)),
            "num_internships": int(data.get("experience", 0)),
        }

        # Binary skill columns
        all_skill_cols = [c for c in feature_columns if c not in
                         ["degree_encoded", "gpa", "num_certs", "num_projects", "num_internships"]]
        for skill_col in all_skill_cols:
            row[skill_col] = 1 if skill_col in skills_list else 0

        df_input = pd.DataFrame([row])
        for col in feature_columns:
            if col not in df_input.columns:
                df_input[col] = 0
        df_input = df_input[feature_columns]

        X_scaled = scaler.transform(df_input)

        # ------ predict ------
        probs = model.predict_proba(X_scaled)[0]
        top_3_idx = probs.argsort()[-3:][::-1]
        top_3_roles = le_role.inverse_transform(top_3_idx)
        top_3_probs = probs[top_3_idx]

        predictions = []
        for role, prob in zip(top_3_roles, top_3_probs):
            predictions.append({
                "role": role,
                "confidence": round(float(prob) * 100, 2),
            })

        # ------ simple explanation ------
        explanation = _generate_explanation(df_input, feature_columns, X_scaled, top_3_roles[0])

        return jsonify({
            "predictions": predictions,
            "explanation": explanation,
        }), 200

    except Exception as e:
        logger.exception("Prediction failed")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


def _generate_explanation(df_input, feature_columns, X_scaled, top_role):
    """Generate a human-readable explanation of which features mattered."""
    try:
        model = _artifacts["model"]
        importances = None

        # Try feature importances (tree models) or coefficients (linear models)
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
        elif hasattr(model, "coef_"):
            importances = np.abs(model.coef_).mean(axis=0)

        if importances is None:
            return ["Prediction based on your overall profile."]

        paired = list(zip(feature_columns, importances))
        paired.sort(key=lambda x: x[1], reverse=True)

        explanations = []
        for feat, imp in paired[:3]:
            val = df_input[feat].iloc[0]
            if val > 0:
                nice = feat.replace("_", " ").title()
                explanations.append(
                    f"Your '{nice}' strongly contributed to predicting '{top_role}'."
                )
            else:
                nice = feat.replace("_", " ").title()
                explanations.append(
                    f"Improving '{nice}' could strengthen your profile."
                )
        return explanations

    except Exception:
        return ["Prediction based on your overall profile."]
