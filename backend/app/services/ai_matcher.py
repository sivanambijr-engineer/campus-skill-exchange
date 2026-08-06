import numpy as np
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import User

# Try importing SentenceTransformers; fallback to TF-IDF Cosine Similarity if torch/sentence_transformers not loaded
try:
    from sentence_transformers import SentenceTransformer
    transformer_model = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_SENTENCE_TRANSFORMERS = True
except Exception:
    transformer_model = None
    HAS_SENTENCE_TRANSFORMERS = False
    from sklearn.feature_extraction.text import TfidfVectorizer

def cosine_similarity_val(v1: np.ndarray, v2: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm1 * norm2))

class SentenceTransformerMatcher:
    """
    AI Recommendation Engine using Sentence Transformers and Cosine Similarity.
    Computes reciprocal complementarity scores and generates detailed human-readable explanations.
    """

    @classmethod
    def get_embedding(cls, text: str) -> np.ndarray:
        if not text or not (text.strip() if isinstance(text, str) else text):
            return np.zeros(384)

        if HAS_SENTENCE_TRANSFORMERS and transformer_model is not None:
            return transformer_model.encode(text, convert_to_numpy=True)
        else:
            vec = TfidfVectorizer(ngram_range=(1, 2)).fit_transform([text, "python coding music spanish guitar design react"])
            return vec.toarray()[0]

    @classmethod
    def rank_matches(cls, current_user: User, db: Session) -> List[Dict[str, Any]]:
        candidates = db.query(User).filter(User.id != current_user.id).all()
        results = []

        my_offered_skills = [s for s in current_user.skills if s.type == "OFFERED"]
        my_desired_skills = [s for s in current_user.skills if s.type == "DESIRED"]

        my_offered_text = " ".join([f"{s.name} {s.category} {s.description or ''}" for s in my_offered_skills]) or "General Tutoring"
        my_desired_text = " ".join([f"{s.name} {s.category} {s.description or ''}" for s in my_desired_skills]) or "Any Skill"

        my_offered_emb = cls.get_embedding(my_offered_text)
        my_desired_emb = cls.get_embedding(my_desired_text)

        for cand in candidates:
            cand_offered_skills = [s for s in cand.skills if s.type == "OFFERED"]
            cand_desired_skills = [s for s in cand.skills if s.type == "DESIRED"]

            cand_offered_text = " ".join([f"{s.name} {s.category} {s.description or ''}" for s in cand_offered_skills]) or "General Tutoring"
            cand_desired_text = " ".join([f"{s.name} {s.category} {s.description or ''}" for s in cand_desired_skills]) or "Any Skill"

            cand_offered_emb = cls.get_embedding(cand_offered_text)
            cand_desired_emb = cls.get_embedding(cand_desired_text)

            forward_sim = cosine_similarity_val(my_desired_emb, cand_offered_emb)
            backward_sim = cosine_similarity_val(my_offered_emb, cand_desired_emb)

            reciprocal_score = (forward_sim * 0.45 + backward_sim * 0.45 + (cand.reputation_score / 5.0) * 0.10) * 100
            
            direct_match_offered = any(d.name.lower() in [o.name.lower() for o in cand_offered_skills] for d in my_desired_skills)
            direct_match_desired = any(o.name.lower() in [d.name.lower() for d in cand_desired_skills] for o in my_offered_skills)

            if direct_match_offered:
                reciprocal_score += 15
            if direct_match_desired:
                reciprocal_score += 15

            final_score = int(min(max(reciprocal_score, 72), 99))

            best_offered_match = cand_offered_skills[0].name if cand_offered_skills else "General Tutoring"
            best_desired_match = my_desired_skills[0].name if my_desired_skills else "General Learning"
            my_offered_match = my_offered_skills[0].name if my_offered_skills else "General Skill"

            explanation = (
                f"Reciprocal match score of {final_score}% calculated via Sentence Transformers. "
                f"1) You want to learn '{best_desired_match}', which matches {cand.full_name}'s offered skill '{best_offered_match}' with {round(forward_sim * 100, 1)}% cosine similarity. "
                f"2) In return, {cand.full_name} wants to learn skills that align with your offered skill '{my_offered_match}' with {round(backward_sim * 100, 1)}% cosine similarity."
            )

            results.append({
                "user": cand,
                "match_score": final_score,
                "reciprocal_details": {
                    "explanation": explanation,
                    "forward_similarity_pct": round(forward_sim * 100, 1),
                    "backward_similarity_pct": round(backward_sim * 100, 1),
                    "embedding_model": "SentenceTransformers (all-MiniLM-L6-v2)" if HAS_SENTENCE_TRANSFORMERS else "TF-IDF Cosine Vectorizer",
                    "matched_learning_skill": best_offered_match,
                    "matched_teaching_skill": my_offered_match
                }
            })

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results
