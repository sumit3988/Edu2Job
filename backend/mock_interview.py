from flask import Blueprint, jsonify, request, g
from auth import token_required
import logging
import re

logger = logging.getLogger(__name__)

mock_interview_bp = Blueprint("mock_interview", __name__, url_prefix="/mock-interview")

# A simplistic predefined set of questions and expected keywords for interview subjects
MOCK_QUESTIONS = {
    "python": [
        {"id": 1, "q": "Can you explain what Python decorators are and how they work?", "keywords": ["function", "wrapper", "modify", "behavior", "@", "higher-order"]},
        {"id": 2, "q": "What is the difference between a list and a tuple in Python?", "keywords": ["mutable", "immutable", "parentheses", "brackets", "faster", "hashable"]},
        {"id": 3, "q": "How does memory management work in Python?", "keywords": ["garbage collection", "reference counting", "private heap", "memory manager"]}
    ],
    "java": [
        {"id": 1, "q": "What are the core concepts of Object-Oriented Programming in Java?", "keywords": ["encapsulation", "inheritance", "polymorphism", "abstraction", "class", "object"]},
        {"id": 2, "q": "Can you explain the difference between HashMap and ConcurrentHashMap?", "keywords": ["thread-safe", "synchronized", "concurrency", "performance", "locks", "segments"]},
        {"id": 3, "q": "What is the purpose of the virtual machine or JVM?", "keywords": ["bytecode", "platform-independent", "WORA", "execute", "memory management", "JIT"]}
    ],
    "datastructures": [
        {"id": 1, "q": "Explain the difference between a stack and a queue.", "keywords": ["lifo", "fifo", "push", "pop", "enqueue", "dequeue"]},
        {"id": 2, "q": "What is a binary search tree and what is its time complexity for searching?", "keywords": ["left", "right", "root", "O(log n)", "O(n)", "sorted", "balanced"]},
        {"id": 3, "q": "How does a hash table work to provide fast lookups?", "keywords": ["hash function", "index", "array", "bucket", "collision", "chaining", "O(1)"]}
    ],
    "computerscience": [
        {"id": 1, "q": "What are the core concepts of Object-Oriented Programming?", "keywords": ["encapsulation", "inheritance", "polymorphism", "abstraction", "class", "object"]},
        {"id": 2, "q": "Explain the differences between a process and a thread.", "keywords": ["memory", "execution", "lightweight", "context switch", "shared", "resource"]},
        {"id": 3, "q": "How does a hash table work to provide fast lookups?", "keywords": ["hash function", "index", "array", "bucket", "collision", "chaining", "O(1)"]}
    ],
    "it": [
        {"id": 1, "q": "Can you explain the difference between TCP and UDP?", "keywords": ["connection-oriented", "connectionless", "reliable", "fast", "acknowledgement", "packets"]},
        {"id": 2, "q": "What is REST and what are its key constraints?", "keywords": ["stateless", "client-server", "cacheable", "uniform interface", "http", "api"]},
        {"id": 3, "q": "Explain the concept of database normalization.", "keywords": ["redundancy", "anomaly", "tables", "relationships", "first normal form", "dependencies"]}
    ],
    "ece": [
        {"id": 1, "q": "What is the function of a microcontroller in an embedded system?", "keywords": ["cpu", "memory", "peripherals", "control", "input", "output"]},
        {"id": 2, "q": "Explain the difference between analog and digital signals.", "keywords": ["continuous", "discrete", "levels", "binary", "noise", "values"]},
        {"id": 3, "q": "What is the purpose of the Fourier Transform in signal processing?", "keywords": ["frequency", "time", "domain", "spectrum", "components", "analysis"]}
    ],
    "ee": [
        {"id": 1, "q": "State and explain Kirchhoff's circuit laws.", "keywords": ["current", "voltage", "node", "loop", "sum", "zero"]},
        {"id": 2, "q": "What is the difference between an AC generator and a DC generator?", "keywords": ["alternating", "direct", "slip rings", "commutator", "current", "direction"]},
        {"id": 3, "q": "Explain the concept of power factor in AC circuits.", "keywords": ["real", "apparent", "reactive", "efficiency", "cosine", "angle"]}
    ],
    "me": [
        {"id": 1, "q": "Explain the first and second laws of thermodynamics.", "keywords": ["conservation", "energy", "entropy", "heat", "work", "direction"]},
        {"id": 2, "q": "What is Bernoulli's principle in fluid mechanics?", "keywords": ["pressure", "velocity", "conservation", "energy", "flow", "fluid"]},
        {"id": 3, "q": "Describe the basic processes involved in casting.", "keywords": ["molten", "metal", "mold", "solidify", "pattern", "cavity"]}
    ],
    "civil": [
        {"id": 1, "q": "What are the common causes of failure in structural elements?", "keywords": ["buckling", "yielding", "shear", "fatigue", "overload", "material"]},
        {"id": 2, "q": "Explain the purpose of soil compaction in geotechnical engineering.", "keywords": ["density", "air", "voids", "strength", "settlement", "bearing"]},
        {"id": 3, "q": "What are the key principles of leveling in surveying?", "keywords": ["elevation", "benchmark", "instrument", "height", "staff", "reference"]}
    ],
    "ai/ml": [
        {"id": 1, "q": "What is the difference between supervised and unsupervised learning?", "keywords": ["labels", "data", "training", "clustering", "classification", "regression"]},
        {"id": 2, "q": "Explain what overfitting means and how to prevent it.", "keywords": ["training", "validation", "generalize", "regularization", "dropout", "noise"]},
        {"id": 3, "q": "What are neural networks and how do they work?", "keywords": ["layers", "neurons", "weights", "activation", "forward", "backpropagation"]}
    ],
    "datascience": [
        {"id": 1, "q": "How do you handle missing values in a dataset?", "keywords": ["imputation", "drop", "mean", "median", "mode", "interpolate"]},
        {"id": 2, "q": "Explain the difference between classification and regression.", "keywords": ["categorical", "continuous", "predict", "labels", "values", "output"]},
        {"id": 3, "q": "What is the purpose of cross-validation in machine learning?", "keywords": ["folds", "training", "testing", "generalization", "overfitting", "performance"]}
    ]
}

@mock_interview_bp.route("/questions/<subject>", methods=["GET"])
@token_required
def get_questions(subject):
    subject_key = subject.lower().replace(" ", "")
    # Default to data structures if subject is unknown
    if subject_key not in MOCK_QUESTIONS:
        subject_key = "datastructures"
    
    questions = [{"id": q["id"], "q": q["q"]} for q in MOCK_QUESTIONS[subject_key]]
    return jsonify({"subject": subject, "questions": questions}), 200


@mock_interview_bp.route("/evaluate", methods=["POST"])
@token_required
def evaluate_interview():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON body"}), 400

    subject = data.get("subject", "datastructures").lower().replace(" ", "")
    if subject not in MOCK_QUESTIONS:
        subject = "datastructures"

    answers = data.get("answers", {})  # expected dict: { question_id: "user answer text" }
    
    evaluation_results = []
    total_score = 0
    max_score = len(MOCK_QUESTIONS[subject])

    for q in MOCK_QUESTIONS[subject]:
        q_id = str(q["id"])
        ans_text = answers.get(q_id, "").lower()
        
        if not ans_text:
            evaluation_results.append({
                "id": q["id"],
                "q": q["q"],
                "passed": False,
                "feedback": f"You did not provide an answer. Key concepts to mention: {', '.join(q['keywords'][:3])}."
            })
            continue

        # Count how many keywords the user hit
        matched = [kw for kw in q["keywords"] if kw.lower() in ans_text]
        match_ratio = len(matched) / len(q["keywords"])
        
        passed = match_ratio >= 0.3  # If they hit 30% of keywords, consider it a decent answer
        
        if passed:
            total_score += 1
            feedback = f"Great response! You correctly touched on {', '.join(matched)}."
            missing = [kw for kw in q["keywords"] if kw not in matched]
            if missing:
                feedback += f" For a stronger answer, also mention: {', '.join(missing[:2])}."
        else:
            feedback = f"Your answer missed some key points. Try to discuss concepts like: {', '.join(q['keywords'][:3])}."

        evaluation_results.append({
            "id": q["id"],
            "q": q["q"],
            "user_answer": answers.get(q_id, ""),
            "passed": passed,
            "feedback": feedback
        })

    return jsonify({
        "score": total_score,
        "total": max_score,
        "results": evaluation_results,
        "message": "Evaluation complete"
    }), 200
