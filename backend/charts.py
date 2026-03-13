"""
charts.py – Matplotlib visualization endpoints.
Returns chart images as PNG for the frontend.
"""

import io
import logging

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
from flask import Blueprint, request, jsonify, send_file

from auth import token_required

logger = logging.getLogger(__name__)

charts_bp = Blueprint("charts", __name__, url_prefix="/charts")


@charts_bp.route("/skill-distribution", methods=["POST"])
@token_required
def skill_distribution():
    """Generate a bar chart of the user's skill levels."""
    try:
        data = request.get_json(force=True)
        skills_raw = data.get("skills", "")
        if isinstance(skills_raw, str):
            skills_list = [s.strip() for s in skills_raw.split(",") if s.strip()]
        else:
            skills_list = skills_raw

        if not skills_list:
            return jsonify({"error": "No skills provided"}), 400

        # Assign estimated proficiency (random-ish based on name hash for demo)
        proficiencies = []
        for s in skills_list:
            np.random.seed(hash(s) % 2**31)
            proficiencies.append(np.random.randint(40, 100))

        fig, ax = plt.subplots(figsize=(8, 4))
        colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(skills_list)))
        bars = ax.barh(skills_list, proficiencies, color=colors, edgecolor="white", linewidth=0.5)
        ax.set_xlabel("Proficiency (%)", fontsize=11, color="#ccc")
        ax.set_title("Skill Distribution", fontsize=14, fontweight="bold", color="#fff")
        ax.set_xlim(0, 100)
        ax.set_facecolor("#1a1a2e")
        fig.set_facecolor("#16213e")
        ax.tick_params(colors="#ccc")
        for spine in ax.spines.values():
            spine.set_color("#333")
        plt.tight_layout()

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=150, bbox_inches="tight",
                    facecolor=fig.get_facecolor())
        plt.close(fig)
        buf.seek(0)
        return send_file(buf, mimetype="image/png")

    except Exception as e:
        logger.exception("Skill distribution chart failed")
        return jsonify({"error": str(e)}), 500


@charts_bp.route("/confidence", methods=["POST"])
@token_required
def confidence_chart():
    """Generate a horizontal bar chart for prediction confidence scores."""
    try:
        data = request.get_json(force=True)
        predictions = data.get("predictions", [])
        if not predictions:
            return jsonify({"error": "No predictions provided"}), 400

        roles = [p["role"] for p in predictions]
        confs = [p["confidence"] for p in predictions]

        fig, ax = plt.subplots(figsize=(7, 3.5))
        gradient_colors = ["#e94560", "#0f3460", "#533483"][:len(roles)]
        bars = ax.barh(roles, confs, color=gradient_colors, edgecolor="white", linewidth=0.5)

        for bar, conf in zip(bars, confs):
            ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height() / 2,
                    f"{conf}%", va="center", fontsize=10, color="#fff")

        ax.set_xlabel("Confidence (%)", fontsize=11, color="#ccc")
        ax.set_title("Prediction Confidence", fontsize=14, fontweight="bold", color="#fff")
        ax.set_xlim(0, max(confs) + 15)
        ax.set_facecolor("#1a1a2e")
        fig.set_facecolor("#16213e")
        ax.tick_params(colors="#ccc")
        for spine in ax.spines.values():
            spine.set_color("#333")
        plt.tight_layout()

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=150, bbox_inches="tight",
                    facecolor=fig.get_facecolor())
        plt.close(fig)
        buf.seek(0)
        return send_file(buf, mimetype="image/png")

    except Exception as e:
        logger.exception("Confidence chart failed")
        return jsonify({"error": str(e)}), 500


@charts_bp.route("/career-insights", methods=["POST"])
@token_required
def career_insights():
    """Pie chart showing career path distribution insights."""
    try:
        data = request.get_json(force=True)
        predictions = data.get("predictions", [])
        if not predictions:
            return jsonify({"error": "No predictions provided"}), 400

        roles = [p["role"] for p in predictions]
        confs = [p["confidence"] for p in predictions]
        # Add "Other" slice
        remaining = max(0, 100 - sum(confs))
        if remaining > 0:
            roles.append("Other Roles")
            confs.append(remaining)

        fig, ax = plt.subplots(figsize=(6, 6))
        colors = ["#e94560", "#0f3460", "#533483", "#1a1a2e"][:len(roles)]
        wedges, texts, autotexts = ax.pie(
            confs, labels=roles, autopct="%1.1f%%", startangle=140,
            colors=colors, textprops={"color": "#fff", "fontsize": 10}
        )
        for t in autotexts:
            t.set_color("#fff")
            t.set_fontsize(9)
        ax.set_title("Career Path Insights", fontsize=14, fontweight="bold", color="#fff")
        fig.set_facecolor("#16213e")
        plt.tight_layout()

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=150, bbox_inches="tight",
                    facecolor=fig.get_facecolor())
        plt.close(fig)
        buf.seek(0)
        return send_file(buf, mimetype="image/png")

    except Exception as e:
        logger.exception("Career insights chart failed")
        return jsonify({"error": str(e)}), 500
