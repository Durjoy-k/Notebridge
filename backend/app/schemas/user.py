import re
from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional

NWU_EMAIL_REGEX = r"^\d{11}@nwu\.ac\.bd$"
NWU_ERROR_MESSAGE = "Please enter a valid NWU student email (e.g., 20242087010@nwu.ac.bd)."

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    department: Optional[str] = "Computer Science & Engineering (CSE)"

    @field_validator("email")
    @classmethod
    def validate_nwu_email(cls, v: str) -> str:
        if not v or not isinstance(v, str) or not re.match(NWU_EMAIL_REGEX, v):
            raise ValueError(NWU_ERROR_MESSAGE)
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v or len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v

class UserLoginRequest(BaseModel):
    email: str
    password: str
    department: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: Optional[str] = None
    department: Optional[str] = "Computer Science & Engineering (CSE)"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
