from pydantic import BaseModel, EmailStr, Field


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)


class SignupCredentials(Credentials):
    name: str = Field(min_length=1, max_length=80)


class UserView(BaseModel):
    id: str
    email: EmailStr
    name: str = ""


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserView
