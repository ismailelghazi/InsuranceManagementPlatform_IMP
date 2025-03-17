import datetime as dt
from typing import Optional, List

import pydantic as _pydantic

# -----------------------------
# User Schemas
# -----------------------------
class _UserBase(_pydantic.BaseModel):
    """
    Base schema for a user.
    """
    email: str

    class Config:
        orm_mode = True
        from_attributes = True  # Allow loading data from ORM models


class UserCreate(_UserBase):
    """
    Schema used when creating a new user.
    """
    hashed_password: str

    class Config:
        orm_mode = True


class User(_UserBase):
    """
    Schema representing a user with an assigned ID.
    """
    id: int

    class Config:
        orm_mode = True


# -----------------------------
# Assure Schemas
# -----------------------------
class AssureCreat(_pydantic.BaseModel):
    """
    Schema for creating a new Assure record.
    """
    Cin: str
    Assure_name: str


class AssureBase(_pydantic.BaseModel):
    """
    Base schema representing an Assure record.
    """
    Cin: Optional[str] = None
    Assure_name: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class AssureList(_pydantic.BaseModel):
    """
    Schema for returning a list of Assure records with a total count.
    """
    total_count: int
    assures: List[AssureBase]


# -----------------------------
# Product Schemas
# -----------------------------
class ProductBase(_pydantic.BaseModel):
    """
    Base schema for a Product.
    """
    id: Optional[int] = None
    Police: Optional[str] = None
    Date_effet: Optional[dt.date] = None
    Fractionn: Optional[str] = None
    Assure_name: Optional[str]  # Extra field to include the Assure's name
    Date_Emission: Optional[dt.date] = None
    Matricule: Optional[str] = None
    Prime_Totale: Optional[float] = None
    assure_id: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ProductList(_pydantic.BaseModel):
    """
    Schema for returning a list of Products along with the total count.
    """
    total_count: int
    products: List[ProductBase]


class ProductCreate(_pydantic.BaseModel):
    """
    Schema for creating a new Product.
    """
    Police: Optional[str] = None
    Date_effet: Optional[dt.date] = None
    Fractionn: Optional[str] = None
    Date_Emission: Optional[dt.date] = None
    Matricule: Optional[str] = None
    Prime_Totale: Optional[float] = None
    assure_id: Optional[str] = None


class ProductWithAssureName(_pydantic.BaseModel):
    """
    Schema to represent a Product along with the associated Assure name.
    """
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


# -----------------------------
# Reglement Schemas
# -----------------------------
class ReglementBase(_pydantic.BaseModel):
    """
    Base schema for a Reglement (payment/settlement record).
    """
    id: Optional[int] = None
    Product_id: Optional[int] = None
    Reste: Optional[float] = None
    Reglement: Optional[float] = None
    Date_de_reglement: Optional[dt.date] = None
    Type_de_reglement: Optional[str] = None
    Garant: Optional[str] = None
    Etat: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class ReglementCreate(_pydantic.BaseModel):
    """
    Schema for creating a new Reglement.
    """
    Product_id: Optional[int] = None
    Reste: Optional[float] = None
    Reglement: Optional[float] = None
    Date_de_reglement: Optional[dt.date] = None
    numero: Optional[str] = None
    Type_de_reglement: Optional[str] = None
    Garant: Optional[str] = None
    Etat: Optional[str] = None


class ReglementDetail(_pydantic.BaseModel):
    """
    Detailed schema for a Reglement, including related Assure and Product data.
    """
    id: Optional[int] = None
    cin: Optional[str] = None
    nom_assure: Optional[str] = None
    prime_totale: Optional[float] = None
    reste: Optional[float] = None
    matricule: Optional[str] = None
    numero: Optional[str] = None
    reglement: Optional[float] = None
    type_de_reglement: Optional[str] = None
    Garant: Optional[str] = None
    Etat: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


# -----------------------------
# Total Counts Schema
# -----------------------------
class TotalCounts(_pydantic.BaseModel):
    """
    Schema for returning overall counts and totals.
    """
    total_products: int
    total_assures: int
    total_montant: float
    total_Prime_Totale: float


# -----------------------------
# History Schemas
# -----------------------------
class HistoryBase(_pydantic.BaseModel):
    """
    Base schema for a history record that logs changes on Assure, Product, or Reglement.
    """
    id: Optional[int] = None
    assure_id: Optional[str] = None  # The CIN of the associated Assure
    product_id: Optional[int] = None  # The ID of the associated Product
    reglement_id: Optional[int] = None  # The ID of the associated Reglement
    action: Optional[str] = None  # Action performed (create, update, delete)
    description: Optional[str] = None  # Detailed description of the change
    reste_amount: Optional[float] = None  # Remaining amount after the action
    numero: Optional[str] = None
    date_reglement: Optional[dt.date] = None  # Date of the reglement action
    reglement_amount: Optional[float] = None  # Amount of the reglement

    class Config:
        orm_mode = True
        from_attributes = True


class HistoryCreate(_pydantic.BaseModel):
    """
    Schema for creating a new history record.
    """
    assure_id: Optional[str] = None
    product_id: Optional[int] = None
    reglement_id: Optional[int] = None
    action: Optional[str] = None
    numero: Optional[str] = None


# -----------------------------
# Additional Reglement Schemas for Detailed Views and Credit Summaries
# -----------------------------
class ReglementDetails(_pydantic.BaseModel):
    """
    Detailed Reglement schema for displaying reglement details.
    """
    id: Optional[int]
    cin: str
    nom_assure: str
    prime_totale: float
    reste: float
    matricule: str
    reglement: float
    type_de_reglement: str
    numero: Optional[int] = None
    Garant: Optional[str] = None
    Etat: Optional[str] = None

    class Config:
        orm_mode = True


class ReglementDetailss(_pydantic.BaseModel):
    """
    Schema for detailed reglement view used for the caisse.
    """
    id: int
    cin: str
    nom_assure: str
    prime_totale: float
    reste: float
    matricule: str
    reglement: float
    type_de_reglement: str
    date_de_reglement: str  # Represented as string for formatted display
    police: str
    montant_reglement: float
    type_reglement: str

    class Config:
        orm_mode = True


class ReglementCreditDetails(_pydantic.BaseModel):
    """
    Schema for individual reglement credit details.
    """
    etat_credit: Optional[str] = None
    date_emission: Optional[dt.date] = None
    police: Optional[str] = None
    nom_assure: Optional[str] = None
    total_prime_totale: Optional[float] = None
    montant_reglement: Optional[float] = None
    reste: Optional[float] = None

    class Config:
        orm_mode = True


class ReglementCreditSummary(_pydantic.BaseModel):
    """
    Schema for summarizing reglement credit details, including totals.
    """
    reglements: List[ReglementCreditDetails]
    total_prime_totale: float
    total_reste: float

    class Config:
        orm_mode = True


class ReglementUpdate(_pydantic.BaseModel):
    """
    Schema used to update an existing reglement record.
    """
    Garant: Optional[str]
    numero: Optional[str]
    Reglement: Optional[float]
    Date_de_reglement: Optional[dt.date]
    Type_de_reglement: Optional[str]
    Etat: Optional[str]

    class Config:
        from_attributes = True  # Updated configuration for compatibility with newer Pydantic versions
