from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Swap, User, Message
from app.schemas import SwapCreate, SwapStatusUpdate, SwapResponse
from app.services.auth_service import get_current_user

router = APIRouter(
    prefix="/swaps",
    tags=["Swaps"]
)


# =========================================================
# RESPONSE BUILDER
# =========================================================

def build_swap_response(swap: Swap) -> SwapResponse:
    """
    Convert a database Swap into the complete API response.

    Both requester and recipient are included so the frontend
    can correctly determine the other participant in a chat.
    """

    return SwapResponse(
        id=swap.id,

        requester_id=swap.requester_id,
        requester_name=swap.requester.full_name,
        requester_avatar=swap.requester.avatar_url,

        recipient_id=swap.recipient_id,
        recipient_name=swap.recipient.full_name,
        recipient_avatar=swap.recipient.avatar_url,

        offered_skill=swap.offered_skill,
        desired_skill=swap.desired_skill,
        status=swap.status,

        meeting_type=swap.meeting_type,
        meeting_location=swap.meeting_location,
        proposed_time=swap.proposed_time,

        match_score=swap.match_score,
        created_at=swap.created_at,
    )


# =========================================================
# GET MY SWAPS
# =========================================================

@router.get(
    "",
    response_model=List[SwapResponse]
)
def get_my_swaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    swaps = (
        db.query(Swap)
        .filter(
            (Swap.requester_id == current_user.id)
            | (Swap.recipient_id == current_user.id)
        )
        .order_by(Swap.created_at.desc())
        .all()
    )

    return [
        build_swap_response(swap)
        for swap in swaps
    ]


# =========================================================
# CREATE SWAP REQUEST
# =========================================================

@router.post(
    "",
    response_model=SwapResponse,
    status_code=status.HTTP_201_CREATED
)
def create_swap(
    swap_in: SwapCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Prevent swapping with yourself
    # -----------------------------------------------------

    if str(swap_in.recipient_id) == str(current_user.id):
        raise HTTPException(
            status_code=400,
            detail="You cannot create a swap request with yourself."
        )

    # -----------------------------------------------------
    # Find recipient
    # -----------------------------------------------------

    recipient = (
        db.query(User)
        .filter(User.id == swap_in.recipient_id)
        .first()
    )

    if not recipient:
        raise HTTPException(
            status_code=404,
            detail="Recipient user not found."
        )

    # -----------------------------------------------------
    # Create swap
    # -----------------------------------------------------

    new_swap = Swap(
        requester_id=current_user.id,
        recipient_id=recipient.id,

        offered_skill=swap_in.offered_skill,
        desired_skill=swap_in.desired_skill,

        status="PENDING",

        meeting_type=swap_in.meeting_type,
        meeting_location=swap_in.meeting_location,
        proposed_time=swap_in.proposed_time,

        # Do NOT fake an AI score.
        # Leave the database default for now.
        match_score=None
    )

    db.add(new_swap)
    db.flush()

    # -----------------------------------------------------
    # Initial message
    # -----------------------------------------------------

    if swap_in.note and swap_in.note.strip():

        initial_message = Message(
            swap_id=new_swap.id,
            sender_id=current_user.id,
            sender_name=current_user.full_name,
            content=swap_in.note.strip()
        )

        db.add(initial_message)

    # -----------------------------------------------------
    # Commit everything together
    # -----------------------------------------------------

    try:
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to save the swap request."
        )

    db.refresh(new_swap)

    return build_swap_response(new_swap)


# =========================================================
# UPDATE SWAP STATUS
# =========================================================

@router.patch(
    "/{swap_id}/status",
    response_model=SwapResponse
)
def update_swap_status(
    swap_id: str,
    status_update: SwapStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Find swap belonging to current user
    # -----------------------------------------------------

    swap = (
        db.query(Swap)
        .filter(
            Swap.id == swap_id,
            (
                (Swap.requester_id == current_user.id)
                | (Swap.recipient_id == current_user.id)
            )
        )
        .first()
    )

    if not swap:
        raise HTTPException(
            status_code=404,
            detail="Swap request not found."
        )

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    allowed_statuses = {
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
        "CANCELLED"
    }

    new_status = status_update.status.upper()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid swap status: {new_status}"
        )

    old_status = swap.status

    # -----------------------------------------------------
    # Prevent duplicate completion rewards
    # -----------------------------------------------------

    if (
        new_status == "COMPLETED"
        and old_status != "COMPLETED"
    ):
        current_user.karma_points = (
            (current_user.karma_points or 0) + 50
        )

        current_user.swaps_completed = (
            (current_user.swaps_completed or 0) + 1
        )

    swap.status = new_status

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    try:
        db.commit()

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update swap status."
        )

    db.refresh(swap)

    return build_swap_response(swap)