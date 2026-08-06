from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Skill, User
from app.schemas import SkillCreate, SkillSchema
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillSchema])
def search_skills(
    q: Optional[str] = None,
    category: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill)

    if q:
        query = query.filter(Skill.name.ilike(f"%{q}%"))
    if category and category != "all":
        query = query.filter(Skill.category == category)
    if type:
        query = query.filter(Skill.type == type)

    return query.all()

@router.post("", response_model=SkillSchema, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_skill = Skill(
        user_id=current_user.id,
        name=skill_in.name,
        category=skill_in.category,
        type=skill_in.type,
        proficiency=skill_in.proficiency,
        description=skill_in.description
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == skill_id, Skill.user_id == current_user.id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill listing not found or unauthorized")

    db.delete(skill)
    db.commit()
    return None
