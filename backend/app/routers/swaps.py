from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Swap, User, Message
from app.schemas import SwapCreate, SwapStatusUpdate, SwapResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/swaps", tags=["Swaps"])

@router.get("", response_model=List[SwapResponse])
def get_my_swaps(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Swap).filter(
        (Swap.requester_id == current_user.id) | (Swap.recipient_id == current_user.id)
    ).order_by(Swap.created_at.desc()).all()

@router.post("", response_model=SwapResponse, status_code=status.HTTP_201_CREATED)
def create_swap(
    swap_in: SwapCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recipient = db.query(User).filter(User.id == swap_in.recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    new_swap = Swap(
        requester_id=current_user.id,
        recipient_id=swap_in.recipient_id,
        offered_skill=swap_in.offered_skill,
        desired_skill=swap_in.desired_skill,
        status="PENDING",
        meeting_type=swap_in.meeting_type,
        meeting_location=swap_in.meeting_location,
        proposed_time=swap_in.proposed_time,
        match_score=92
    )
    db.add(new_swap)
    db.commit()
    db.refresh(new_swap)

    # Initial message
    if swap_in.note:
        init_msg = Message(
            swap_id=new_swap.id,
            sender_id=current_user.id,
            sender_name=current_user.full_name,
            content=swap_in.note
        )
        db.add(init_msg)
        db.commit()

    return new_swap

@router.patch("/{swap_id}/status", response_model=SwapResponse)
def update_swap_status(
    swap_id: str,
    status_update: SwapStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    swap = db.query(Swap).filter(
        Swap.id == swap_id,
        (Swap.requester_id == current_user.id) | (Swap.recipient_id == current_user.id)
    ).first()

    if not swap:
        raise HTTPException(status_code=404, detail="Swap request not found")

    swap.status = status_update.status

    # Reward Karma points upon completion
    if status_update.status == "COMPLETED":
        current_user.karma_points += 50
        current_user.swaps_completed += 1

    db.commit()
    db.refresh(swap)
    return swap
