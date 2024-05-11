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

# class AssureModel(db.Base):
#     __tablename__ = "Assure"
#     Cin = sqlalchemy.Column(String, unique=True,primary_key=True)
#     Assure_name = sqlalchemy.Column(String)
#     Products = orm.relationship("ProductModel", back_populates="assure")


# class ProductModel(db):
#     __tablename__ = "Product"
#     id = sqlalchemy.Column(Integer, primary_key=True)
#     Cin = sqlalchemy.Column(String, ForeignKey("Assure.Cin"))
#     Police = sqlalchemy.Column(String, unique=True)
#     Date_effet = sqlalchemy.Column(String)
#     Acte = sqlalchemy.Column(String)
#     Date_fin = sqlalchemy.Column(Date)
#     Fractionn = sqlalchemy.Column(String)
#     Contrat = sqlalchemy.Column(String)
#     Periode = sqlalchemy.Column(String)
#     Marque = sqlalchemy.Column(String)
#     Matricule = sqlalchemy.Column(String)
#     Attestation = sqlalchemy.Column(String)
#     Prime_Totale = sqlalchemy.Column(Float)
#     Products = orm.relationship("AssureModel", back_populates="Products")
