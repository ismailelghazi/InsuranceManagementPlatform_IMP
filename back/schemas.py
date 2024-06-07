# fastapi-jwt/schemas.py
import datetime
import datetime as _dt
from typing import Optional
import datetime as dt

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
    Cin: Optional[str] = None
    Assure_name: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ProductBase(_pydantic.BaseModel):
    id: Optional[int] = None
    Police: Optional[str] = None
    Date_effet: Optional[dt.date] = None

    Fractionn: Optional[str] = None

    Date_Emission: Optional[dt.date] = None
    Matricule: Optional[str] = None
    Prime_Totale: Optional[float] = None
    assure_id: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ProductCreate(_pydantic.BaseModel):
    Police: Optional[str] = None
    Date_effet: Optional[dt.date] = None
    Fractionn: Optional[str] = None
    Date_Emission: Optional[dt.date] = None
    Matricule: Optional[str] = None
    Prime_Totale: Optional[float] = None
    assure_id: Optional[str] = None


class ProductWithAssureName(_pydantic.BaseModel):
    id: Optional[int] = None
    Police: Optional[str] = None
    Date_effet: Optional[dt.date] = None
    Fractionn: Optional[str] = None
    Date_Emission: Optional[dt.date] = None
    Matricule: Optional[str] = None
    Prime_Totale: Optional[float] = None
    assure_id: Optional[str] = None
    Assure_name: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ReglementBase(_pydantic.BaseModel):
    id: Optional[int] = None
    Product_id: Optional[int] = None
    Reste: Optional[float] = None
    Reglement: Optional[float] = None
    Date_de_reglement: Optional[dt.date] = None
    Type_de_reglement: Optional[str] = None
    Garant :Optional[str] = None
    Etat:Optional[str] = None
    class Config:
        orm_mode = True
        from_attributes = True


class ReglementCreate(_pydantic.BaseModel):
    Product_id: Optional[int] = None
    Reste: Optional[float] = None
    Reglement: Optional[float] = None
    Date_de_reglement: Optional[dt.date] = None
    numero :Optional[str] = None
    Type_de_reglement: Optional[str] = None
    Garant :Optional[str] = None
    Etat:Optional[str] = None


class ReglementDetail(_pydantic.BaseModel):
    id: Optional[int] = None
    cin: Optional[str] = None
    nom_assure: Optional[str] = None
    prime_totale: Optional[float] = None
    reste: Optional[float] = None
    matricule: Optional[str] = None
    numero : Optional[str] = None
    reglement: Optional[float] = None
    type_de_reglement: Optional[str] = None
    Garant :Optional[str] = None
    Etat:Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class HistoryBase(_pydantic.BaseModel):
    id: Optional[int] = None
    assure_id: Optional[str] = None  # The CIN of the Assure associated with the change
    product_id: Optional[int] = None  # The ID of the Product associated with the change
    reglement_id: Optional[int] = None  # The ID of the Reglement associated with the change
    action: Optional[str] = None  # The type of action performed (e.g., create, update, delete)
    description: Optional[str] = None  # A detailed description of the change
    reste_amount: Optional[float] = None
    numero : Optional[str] = None
    date_reglement: Optional[dt.date]=None
    # The remaining amount after the change, renamed
    reglement_amount: Optional[float] = None  # The amount of the current reglement, renamed

    class Config:
        orm_mode = True
        from_attributes = True


class HistoryCreate(_pydantic.BaseModel):
    assure_id: Optional[str] = None
    product_id: Optional[int] = None
    reglement_id: Optional[int] = None
    action: Optional[str] = None
    numero : Optional[str] = None
