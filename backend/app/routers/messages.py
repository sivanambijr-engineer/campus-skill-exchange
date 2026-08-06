from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Swap, Message, User
from app.schemas import MessageCreate, MessageResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/swaps", tags=["Messages"])

@router.get("/{swap_id}/messages", response_model=List[MessageResponse])
def get_swap_messages(
    swap_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    swap = db.query(Swap).filter(
        Swap.id == swap_id,
        (Swap.requester_id == current_user.id) | (Swap.recipient_id == current_user.id)
    ).first()

    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found or unauthorized")

    return db.query(Message).filter(Message.swap_id == swap_id).order_by(Message.created_at.asc()).all()

@router.post("/{swap_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def post_message(
    swap_id: str,
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    swap = db.query(Swap).filter(
        Swap.id == swap_id,
        (Swap.requester_id == current_user.id) | (Swap.recipient_id == current_user.id)
    ).first()

    if not swap:
        raise HTTPException(status_code=404, detail="Swap not found or unauthorized")

    new_msg = Message(
        swap_id=swap_id,
        sender_id=current_user.id,
        sender_name=current_user.full_name,
        content=msg_in.content
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg
