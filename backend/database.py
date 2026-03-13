"""
database.py – MongoDB connection and user collection helpers.
Falls back gracefully if MongoDB is unavailable (uses in-memory store).
"""

import os
import logging

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# MongoDB connection
# ---------------------------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "edu2job")

try:
    from pymongo import MongoClient
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    # Force a connection check
    client.server_info()
    db = client[DB_NAME]
    users_collection = db["users"]
    # Ensure unique email index
    users_collection.create_index("email", unique=True)
    USING_MONGO = True
    logger.info("Connected to MongoDB successfully.")
except Exception as e:
    logger.warning(f"MongoDB unavailable ({e}). Using in-memory fallback store.")
    USING_MONGO = False
    _memory_store: list[dict] = []


# ---------------------------------------------------------------------------
# CRUD helpers (abstract away Mongo vs in-memory)
# ---------------------------------------------------------------------------

def find_user_by_email(email: str) -> dict | None:
    if USING_MONGO:
        user = users_collection.find_one({"email": email})
        if user:
            user["id"] = str(user.pop("_id"))
        return user
    else:
        for u in _memory_store:
            if u["email"] == email:
                return u
        return None


def insert_user(user_data: dict) -> str:
    if USING_MONGO:
        result = users_collection.insert_one(user_data)
        return str(result.inserted_id)
    else:
        import uuid
        user_data["id"] = str(uuid.uuid4())
        _memory_store.append(user_data)
        return user_data["id"]


def update_user(email: str, update_fields: dict) -> bool:
    if USING_MONGO:
        result = users_collection.update_one(
            {"email": email}, {"$set": update_fields}
        )
        return result.matched_count > 0
    else:
        for u in _memory_store:
            if u["email"] == email:
                u.update(update_fields)
                return True
        return False
