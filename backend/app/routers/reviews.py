from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Review, Swap, User
from app.schemas import ReviewCreate, ReviewResponse
from app.services.auth_service import get_current_user

router = APIRouter(tags=["Reviews"])

@router.post("/swaps/{swap_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(
    swap_id: str,
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    swap = db.query(Swap).filter(Swap.id == swap_id).first()
    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found")

    new_review = Review(
        swap_id=swap_id,
        reviewer_id=current_user.id,
        reviewer_name=current_user.full_name,
        reviewer_avatar=current_user.avatar_url,
        reviewee_id=review_in.reviewee_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(new_review)

    # Recalculate reviewee rating score
    reviewee = db.query(User).filter(User.id == review_in.reviewee_id).first()
    if reviewee:
        existing_reviews = db.query(Review).filter(Review.reviewee_id == review_in.reviewee_id).all()
        ratings = [r.rating for r in existing_reviews] + [review_in.rating]
        reviewee.reputation_score = round(sum(ratings) / len(ratings), 2)

    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/users/{user_id}/reviews", response_model=List[ReviewResponse])
def get_user_reviews(user_id: str, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.reviewee_id == user_id).order_by(Review.created_at.desc()).all()
