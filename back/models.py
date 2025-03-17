import datetime as _dt
import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database

# -----------------------------
# User Model: Represents application users for authentication
# -----------------------------
class User(_database.Base):
    __tablename__ = "users"
    # Unique identifier for the user (primary key)
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    # User email, which is unique and indexed
    email = _sql.Column(_sql.String, unique=True, index=True)
    # Stored hashed password for authentication
    hashed_password = _sql.Column(_sql.String)

    def verify_password(self, password: str):
        """
        Verify the provided plain text password against the stored hashed password.
        """
        return _hash.bcrypt.verify(password, self.hashed_password)


# -----------------------------
# AssureModel: Represents insured individuals
# -----------------------------
class AssureModel(_database.Base):
    __tablename__ = "Assure"
    # Unique identifier for an Assure record (CIN)
    Cin = _sql.Column(_sql.String, unique=True, primary_key=True)
    # Name of the insured individual
    Assure_name = _sql.Column(_sql.String)
    # Relationship: An Assure can have multiple products.
    products = _orm.relationship("ProductModel", back_populates="assure", cascade="all, delete")
    # Relationship: An Assure can have multiple history entries.
    history = _orm.relationship("HistoryModel", back_populates="assure")


# -----------------------------
# ProductModel: Represents insurance policies or products
# -----------------------------
class ProductModel(_database.Base):
    __tablename__ = "Product"
    # Unique product ID (primary key, auto-incremented)
    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    # Policy number or identifier
    Police = _sql.Column(_sql.String)
    # Effective date of the policy/product
    Date_effet = _sql.Column(_sql.Date)
    # Fraction value (could represent coverage fraction, premium fraction, etc.)
    Fractionn = _sql.Column(_sql.String)
    # Date of issuance (emission) of the policy
    Date_Emission = _sql.Column(_sql.Date)
    # Vehicle matricule or another identifier
    Matricule = _sql.Column(_sql.String)
    # Total premium amount
    Prime_Totale = _sql.Column(_sql.Float)
    # Foreign key linking the product to an Assure record using its CIN
    assure_id = _sql.Column(_sql.String, _sql.ForeignKey('Assure.Cin'))
    # Relationship: Connects back to the AssureModel
    assure = _orm.relationship("AssureModel", back_populates="products")
    # Relationship: A product can have multiple reglements (payments)
    reglements = _orm.relationship("ReglementModel", back_populates="product")
    # Relationship: A product can have multiple history entries
    history = _orm.relationship("HistoryModel", back_populates="product")


# -----------------------------
# ReglementModel: Represents payments or settlements related to products
# -----------------------------
class ReglementModel(_database.Base):
    __tablename__ = "Reglement"
    # Unique reglement ID (primary key, auto-incremented)
    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    # Foreign key linking to the associated product record
    Product_id = _sql.Column(_sql.String, _sql.ForeignKey('Product.id'))
    # Remaining amount after payment (reglement)
    Reste = _sql.Column(_sql.Float)
    # Amount of the payment
    Reglement = _sql.Column(_sql.Float)
    # Transaction or registration number
    numero = _sql.Column(_sql.String)
    # Guarantor information for the payment
    Garant = _sql.Column(_sql.String)
    # Date when the reglement occurred
    Date_de_reglement = _sql.Column(_sql.Date)
    # Type of reglement (could indicate full, partial, credit, etc.)
    Type_de_reglement = _sql.Column(_sql.String)
    # Status of the reglement (e.g., pending, completed)
    Etat = _sql.Column(_sql.String)
    # Relationship: Log of history entries associated with this reglement
    history = _orm.relationship("HistoryModel", back_populates="reglement")
    # Relationship: Connects back to the ProductModel
    product = _orm.relationship("ProductModel", back_populates="reglements")


# -----------------------------
# HistoryModel: Logs changes/actions related to Assure, Product, and Reglement
# -----------------------------
class HistoryModel(_database.Base):
    __tablename__ = "history"
    # Unique history record ID (primary key, auto-incremented)
    id = _sql.Column(_sql.Integer, primary_key=True, index=True, autoincrement=True)
    # Foreign key linking to the Assure record associated with this history entry
    assure_id = _sql.Column(_sql.String, _sql.ForeignKey('Assure.Cin'))
    # Foreign key linking to the Product record associated with this history entry
    product_id = _sql.Column(_sql.Integer, _sql.ForeignKey('Product.id'))
    # Foreign key linking to the Reglement record associated with this history entry
    reglement_id = _sql.Column(_sql.Integer, _sql.ForeignKey('Reglement.id'))
    # Describes the action taken (e.g., create, update, delete)
    action = _sql.Column(_sql.String)
    # Additional description or details of the action
    description = _sql.Column(_sql.String)
    # Transaction number or similar identifier
    numero = _sql.Column(_sql.String)
    # Amount remaining after the action (e.g., remaining premium)
    reste_amount = _sql.Column(_sql.Float)
    # Amount of the payment affected by the action
    reglement_amount = _sql.Column(_sql.Float)
    # Date when the reglement action took place
    date_reglement = _sql.Column(_sql.Date)

    # Relationship: Connects to the AssureModel
    assure = _orm.relationship("AssureModel", back_populates="history")
    # Relationship: Connects to the ProductModel
    product = _orm.relationship("ProductModel", back_populates="history")
    # Relationship: Connects to the ReglementModel
    reglement = _orm.relationship("ReglementModel", back_populates="history")
