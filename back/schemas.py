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


class ProductWithAssureName(_pydantic.BaseModel):
    id: int
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
    Date_effet: str
    # Add other fields from ProductModel as needed
    Assure_name: str
class ReglementBase(_pydantic.BaseModel):
    id: int
    Product_id: int
    Reste: float
    Reglement: float
    Date_de_reglement: datetime.date
    Type_de_reglement: str

    class Config:
        orm_mode = True
        from_attributes = True

class ReglementCreate(_pydantic.BaseModel):
    Product_id: int
    Reste: float
    Reglement: float
    Date_de_reglement: datetime.date
    Type_de_reglement: str

class ReglementDetail(_pydantic.BaseModel):
    cin: str
    nom_assure: str
    prime_totale: float
    reste: float
    matricule: str
    reglement: float
    type_de_reglement: str

    class Config:
        orm_mode = True
        from_attributes = True
class HistoryBase(_pydantic.BaseModel):
    id: int
    assure_id: str  # The CIN of the Assure associated with the change
    product_id: int  # The ID of the Product associated with the change
    reglement_id: int  # The ID of the Reglement associated with the change
    action: str  # The type of action performed (e.g., create, update, delete)
    description: str  # A detailed description of the change
    reste_amount: float  # The remaining amount after the change, renamed
    reglement_amount: float  # The amount of the current reglement, renamed

    class Config:
        orm_mode = True
        from_attributes = True

class HistoryCreate(_pydantic.BaseModel):
    assure_id: str
    product_id: int
    reglement_id: int
    action: str
