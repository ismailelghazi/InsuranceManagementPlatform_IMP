# fastapi-jwt/schemas.py
import datetime as _dt

import pydantic as _pydantic


class _UserBase(_pydantic.BaseModel):
    email: str

    class Config:
        orm_mode = True
        from_attributes = True

class UserCreate(_UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    id: int

    class Config:
        orm_mode = True

class AssureBase(_pydantic.BaseModel):
    Cin : str
    Assure_name : str
    class Config:
        orm_mode = True
        from_attributes = True

class