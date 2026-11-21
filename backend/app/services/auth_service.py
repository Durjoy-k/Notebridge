import re
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserRegisterRequest, UserLoginRequest, NWU_EMAIL_REGEX, NWU_ERROR_MESSAGE
from app.core.security import hash_password, verify_password

def register_user(db: Session, request: UserRegisterRequest) -> User:
    email = request.email
    # Enforce strict NWU regex validation on service level
    if not email or not re.match(NWU_EMAIL_REGEX, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=NWU_ERROR_MESSAGE
        )

    # Check for existing user
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password securely with bcrypt
    hashed_pwd = hash_password(request.password)
    user = User(
        email=email,
        hashed_password=hashed_pwd,
        full_name=request.full_name or f"Student {email.split('@')[0]}",
        department=request.department or "Computer Science & Engineering (CSE)"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, request: UserLoginRequest) -> User:
    email = request.email
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if request.department and request.department.strip():
        user.department = request.department.strip()
        db.commit()
        db.refresh(user)
    return user
