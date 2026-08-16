from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from google.oauth2 import id_token
from google.auth.transport import requests

from app.database import get_db
from app.models import User
from app.schemas import (
    UserResponse,
    GoogleAuthRequest,
)

from app.services.auth_service import (
    create_access_token,
    get_current_user,
    verify_csrf,
)

from app.config import settings


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =========================================================
# GOOGLE AUTHENTICATION
# =========================================================

@router.post(
    "/google",
    response_model=UserResponse,
)
def google_auth(
    request_data: GoogleAuthRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Authenticate a user using Google OAuth.

    Flow:

    React
        ↓
    GoogleLogin
        ↓
    Google credential
        ↓
    POST /api/auth/google
        ↓
    FastAPI verifies credential with Google
        ↓
    Find/create local User
        ↓
    Create application JWT
        ↓
    Store JWT in HTTP-only cookie
        ↓
    Return user profile
    """

    # =====================================================
    # VERIFY GOOGLE CREDENTIAL
    # =====================================================

    try:
        idinfo = id_token.verify_oauth2_token(
            request_data.credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credentials.",
        )

    # =====================================================
    # EXTRACT VERIFIED GOOGLE INFORMATION
    # =====================================================

    email = idinfo.get("email")
    google_id = idinfo.get("sub")
    name = idinfo.get("name")
    avatar = idinfo.get("picture")

    email_verified = idinfo.get(
        "email_verified",
        False,
    )

    # =====================================================
    # BASIC VALIDATION
    # =====================================================

    if not email or not google_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account information is incomplete.",
        )

    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email is not verified.",
        )

    # =====================================================
    # FIND EXISTING USER BY GOOGLE ID
    # =====================================================

    user = (
        db.query(User)
        .filter(
            User.google_id == google_id
        )
        .first()
    )

    # =====================================================
    # IF NOT FOUND, TRY EMAIL
    # =====================================================

    if not user:
        user = (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )

    # =====================================================
    # EXISTING USER
    # =====================================================

    if user:

        # Link Google identity
        user.google_id = google_id

        # Google becomes the source of identity information
        if name:
            user.full_name = name

        if avatar:
            user.avatar_url = avatar

        # Password authentication is not used
        user.password_hash = None

        db.commit()
        db.refresh(user)

    # =====================================================
    # NEW USER
    # =====================================================

    else:

        user = User(
            email=email,
            google_id=google_id,
            full_name=name or "Google User",
            avatar_url=avatar,
            campus_name="Velammal Institute of Technology",
            major=None,
            bio=None,
            profile_completed=False,
            password_hash=None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    # =====================================================
    # CREATE APPLICATION JWT
    # =====================================================

    access_token = create_access_token(
        data={
            "sub": str(user.id),
        }
    )

    # =====================================================
    # COOKIE CONFIGURATION
    # =====================================================

    secure_cookie = (
        settings.FRONTEND_URL.startswith("https")
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=secure_cookie,
        samesite=(
            "none"
            if secure_cookie
            else "lax"
        ),
        max_age=(
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
            * 60
        ),
        path="/",
    )

    # =====================================================
    # RETURN USER
    # =====================================================

    return user


# =========================================================
# CURRENT USER
# =========================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Return the currently authenticated user.

    Authentication is read from the HTTP-only
    access_token cookie.
    """

    return current_user


# =========================================================
# LOGOUT
# =========================================================

@router.post(
    "/logout",
)
def logout(
    response: Response,
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Remove the application authentication cookie.
    """

    secure_cookie = (
        settings.FRONTEND_URL.startswith("https")
    )

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=secure_cookie,
        samesite=(
            "none"
            if secure_cookie
            else "lax"
        ),
        path="/",
    )

    return {
        "message": "Logged out successfully"
    }