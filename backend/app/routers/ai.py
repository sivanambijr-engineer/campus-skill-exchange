from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import AIMatchCandidate
from app.services.auth_service import get_current_user
from app.services.ai_matcher import SentenceTransformerMatcher

router = APIRouter(prefix="/ai", tags=["AI Recommendations"])

@router.get("/recommendations", response_model=List[AIMatchCandidate])
def get_ai_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes reciprocal skill match recommendations using Sentence Transformers & Cosine Similarity.
    Every recommendation is returned with a detailed human-readable explanation.
    """
    ranked_matches = SentenceTransformerMatcher.rank_matches(current_user, db)
    return ranked_matches
