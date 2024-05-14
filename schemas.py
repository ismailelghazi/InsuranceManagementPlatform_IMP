# fastapi-jwt/schemas.py
import datetime
import datetime as _dt
from typing import Optional

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

class AssureCreat(_pydantic.BaseModel):
    Cin: str
    Assure_name: str


class AssureBase(_pydantic.BaseModel):
    Cin: str
    Assure_name: str
    class Config:
        orm_mode = True
        from_attributes = True

class ProductBase(_pydantic.BaseModel):
    id:int
    Police: str
    Date_effet: datetime.date
    Acte: str
    Date_fin: datetime.date
    Fractionn: Optional[str]
    Contrat: str
    Periode: str
    Marque: str
    Date_Emission: datetime.datetime
    Matricule: str
    Attestation: Optional[str]
    Prime_Totale: float
    assure_id: str
    class Config:
        orm_mode = True
        from_attributes = True

class ProductCreate(_pydantic.BaseModel):
    Police: str
    Date_effet: datetime.date
    Acte: str
    Date_fin: datetime.date
    Fractionn: Optional[str]
    Contrat: str
    Periode: str
    Marque: str
    Date_Emission: datetime.datetime
    Matricule: str
    Attestation: Optional[str]
    Prime_Totale: float
    assure_id: str


