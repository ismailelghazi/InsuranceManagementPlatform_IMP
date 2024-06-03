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
    Cin = _sql.Column(_sql.String, unique=True, primary_key=True)
    Assure_name = _sql.Column(_sql.String)
    products = _orm.relationship("ProductModel", back_populates="assure",cascade="all, delete")
    history = _orm.relationship("HistoryModel", back_populates="assure")


class ProductModel(_database.Base):
    __tablename__ = "Product"
    id = _sql.Column(_sql.Integer, primary_key=True,index=True, autoincrement=True)
    Police = _sql.Column(_sql.String)
    Date_effet = _sql.Column(_sql.Date)
    # Acte = _sql.Column(_sql.String)
    # Date_fin = _sql.Column(_sql.Date)
    Fractionn = _sql.Column(_sql.String)
    # Contrat = _sql.Column(_sql.String)
    Date_Emission= _sql.Column(_sql.Date)
    # Periode = _sql.Column(_sql.String)
    # Marque = _sql.Column(_sql.String)
    Matricule = _sql.Column(_sql.String)
    Attestation = _sql.Column(_sql.String)
    Prime_Totale = _sql.Column(_sql.Float)
    assure_id = _sql.Column(_sql.String, _sql.ForeignKey('Assure.Cin'))
    assure = _orm.relationship("AssureModel", back_populates="products")
    reglements = _orm.relationship("ReglementModel", back_populates="product")
    history = _orm.relationship("HistoryModel", back_populates="product")



class ReglementModel(_database.Base):
    __tablename__ = "Reglement"
    id = _sql.Column(_sql.Integer, primary_key=True,index=True, autoincrement=True)
    Product_id = _sql.Column(_sql.String, _sql.ForeignKey('Product.id'))
    Reste=_sql.Column(_sql.Float)
    Reglement=_sql.Column(_sql.Float)
    numero = _sql.Column(_sql.String)
    Garant = _sql.Column(_sql.String)
    Date_de_reglement = _sql.Column(_sql.Date)
    Type_de_reglement = _sql.Column(_sql.String)
    history = _orm.relationship("HistoryModel", back_populates="reglement")

    product = _orm.relationship("ProductModel", back_populates="reglements")

class HistoryModel(_database.Base):
    __tablename__ = "history"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    assure_id = _sql.Column(_sql.String, _sql.ForeignKey('Assure.Cin'))
    product_id = _sql.Column(_sql.Integer, _sql.ForeignKey('Product.id'))
    reglement_id = _sql.Column(_sql.Integer, _sql.ForeignKey('Reglement.id'))
    action = _sql.Column(_sql.String)
    description = _sql.Column(_sql.String)
    numero = _sql.Column(_sql.String)
    reste_amount = _sql.Column(_sql.Float)  # Renamed this column
    reglement_amount = _sql.Column(_sql.Float)  # Renamed this column

    assure = _orm.relationship("AssureModel", back_populates="history")
    product = _orm.relationship("ProductModel", back_populates="history")
    reglement = _orm.relationship("ReglementModel", back_populates="history")