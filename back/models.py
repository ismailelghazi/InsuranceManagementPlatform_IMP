# fastapi-jwt/models.py
import datetime as _dt

import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash

import database as _database


class User(_database.Base):
    __tablename__ = "users"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    email = _sql.Column(_sql.String, unique=True, index=True)
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)
class AssureModel(_database.Base):
    __tablename__ = "Assure"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    Cin = _sql.Column(_sql.String, unique=True, primary_key=True)
    Assure_name = _sql.Column(_sql.String)
    products = _orm.relationship("ProductModel", back_populates="assure")

class ProductModel(_database.Base):
    __tablename__ = "Product"
    id = _sql.Column(_sql.Integer, primary_key=True)
    Police = _sql.Column(_sql.String, unique=True)
    Date_effet = _sql.Column(_sql.String)
    Acte = _sql.Column(_sql.String)
    Date_fin = _sql.Column(_sql.Date)
    Fractionn = _sql.Column(_sql.String)
    Contrat = _sql.Column(_sql.String)
    Periode = _sql.Column(_sql.String)
    Marque = _sql.Column(_sql.String)
    Matricule = _sql.Column(_sql.String)
    Attestation = _sql.Column(_sql.String)
    Prime_Totale = _sql.Column(_sql.Float)
    assure_id = _sql.Column(_sql.Integer, _sql.ForeignKey('Assure.id'))
    assure = _orm.relationship("AssureModel", back_populates="products")
