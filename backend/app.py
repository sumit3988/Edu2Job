"""
app.py – Flask application entry point.
Loads ML model on startup, registers all routes, enables CORS.
Serves frontend static files from ../frontend directory.
"""

import os
import sys
import logging

from flask import Flask, send_from_directory
from flask_cors import CORS

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# ---------------------------------------------------------------------------
# Create Flask app
# ---------------------------------------------------------------------------
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB upload limit

# ---------------------------------------------------------------------------
# Register API routes
# ---------------------------------------------------------------------------
from routes import register_routes
register_routes(app)

# ---------------------------------------------------------------------------
# Load ML model at startup
# ---------------------------------------------------------------------------
from prediction import load_model
load_model()

# ---------------------------------------------------------------------------
# Serve frontend pages
# ---------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")

@app.route("/<path:filename>", methods=["GET"])
def serve_frontend(filename):
    """Serve frontend files; fall back to API 404 if not found."""
    file_path = os.path.join(FRONTEND_DIR, filename)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIR, filename)
    return {"error": "Not found"}, 404

# ---------------------------------------------------------------------------
# Health check (API)
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok", "service": "Edu2Job API"}, 200

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting Edu2Job on port {port}")
    logger.info(f"Frontend: {FRONTEND_DIR}")
    logger.info(f"Open http://localhost:{port} in your browser")
    app.run(host="0.0.0.0", port=port, debug=True)
