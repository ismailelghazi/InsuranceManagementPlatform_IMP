import datetime
import io
import logging
from typing import List, Union, Optional

import fastapi
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, APIRouter
import fastapi.security as security
import numpy as np
import pandas as pd
import sqlalchemy.orm as orm
from sqlalchemy import func
import uvicorn

import models
import schemas
import services
import database as _database

# -----------------------------
# Application Setup and Middleware
# -----------------------------
app = FastAPI()

# Configure CORS (allow only the specified origin)
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["https://www.atlaassure.online/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging to output info messages
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# -----------------------------
# User Authentication Endpoints
# -----------------------------
user_router = APIRouter(prefix="/api", tags=["users"])

@user_router.post("/users", response_model=schemas.Token)
async def create_user(user: schemas.UserCreate, db: orm.Session = Depends(services.get_db)):
    """
    Create a new user and return a JWT token.
    - Check if email is already in use.
    - If not, create user and generate token.
    """
    db_user = await services.get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")
    new_user = await services.create_user(user, db)
    return await services.create_token(new_user)


@user_router.post("/token", response_model=schemas.Token)
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = Depends(),
    db: orm.Session = Depends(services.get_db),
):
    """
    Authenticate user credentials and generate a JWT token.
    """
    user = await services.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    return await services.create_token(user)


@user_router.get("/users/myprofile", response_model=schemas.User)
async def get_my_profile(user: schemas.User = Depends(services.get_current_user)):
    """
    Retrieve the profile of the current authenticated user.
    """
    return user

# -----------------------------
# Assure Endpoints
# -----------------------------
assure_router = APIRouter(prefix="/api", tags=["assure"])

@assure_router.get("/Assure", response_model=List[schemas.AssureBase])
async def list_assures(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve a list of all Assure records.
    """
    assures = db.query(models.AssureModel).all()
    return assures


@assure_router.post("/Assure_create", response_model=schemas.AssureBase, status_code=status.HTTP_201_CREATED)
def create_assure(assure: schemas.AssureCreat, db: orm.Session = Depends(services.get_db)):
    """
    Create a new Assure record.
    """
    # Create an Assure instance using the provided data
    assure_db = models.AssureModel(Cin=assure.Cin, Assure_name=assure.Assure_name)
    db.add(assure_db)
    db.commit()  # Commit the transaction to save the new record
    db.refresh(assure_db)  # Refresh to obtain any updated data from the DB
    return assure_db


@assure_router.delete("/Assure_delete/{cin}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assure(cin: str, db: orm.Session = Depends(services.get_db)):
    """
    Delete an Assure record by its CIN.
    """
    assure_db = db.query(models.AssureModel).filter(models.AssureModel.Cin == cin).first()
    if not assure_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assure not found")
    db.delete(assure_db)
    db.commit()  # Commit changes to remove the record permanently
    return None


@assure_router.get("/Assure/{cin}", response_model=schemas.AssureBase)
def get_assure(cin: str, db: orm.Session = Depends(services.get_db)):
    """
    Retrieve a specific Assure record using the CIN.
    """
    assure_item = db.query(models.AssureModel).get(cin)
    if not assure_item:
        raise HTTPException(status_code=404, detail=f"Item with CIN {cin} not found")
    return assure_item

# -----------------------------
# Product Endpoints
# -----------------------------
product_router = APIRouter(prefix="/api", tags=["product"])

@product_router.post("/product_create", response_model=schemas.ProductBase, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: orm.Session = Depends(services.get_db)):
    """
    Create a new product record.
    """
    product_db = models.ProductModel(
        Police=product.Police,
        Date_effet=product.Date_effet,
        Fractionn=product.Fractionn,
        Date_Emission=product.Date_Emission,
        Matricule=product.Matricule,
        Prime_Totale=product.Prime_Totale,
        assure_id=product.assure_id
    )
    db.add(product_db)
    db.commit()  # Commit transaction to save the new product
    db.refresh(product_db)
    return product_db


@product_router.get("/Product", response_model=List[schemas.ProductBase])
def list_products(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve a list of products along with their associated Assure name.
    """
    product_list = db.query(
        models.ProductModel,
        models.AssureModel.Assure_name
    ).join(
        models.AssureModel, models.ProductModel.assure_id == models.AssureModel.Cin
    ).all()

    return [
        {**product.__dict__, 'Assure_name': assure_name}
        for product, assure_name in product_list
    ]


@product_router.delete("/Product_delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: orm.Session = Depends(services.get_db)):
    """
    Delete a product record by its id.
    """
    product_db = db.query(models.ProductModel).filter(models.ProductModel.id == id).first()
    if not product_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product_db)
    db.commit()  # Commit deletion
    return None


@product_router.get("/Assure/{cin}/Product", response_model=List[schemas.ProductBase])
def get_products_by_assure(cin: str, db: orm.Session = Depends(services.get_db)):
    """
    Retrieve all product records associated with a specific Assure.
    """
    assure = db.query(models.AssureModel).filter(models.AssureModel.Cin == cin).first()
    if not assure:
        raise HTTPException(status_code=404, detail="Assure not found")
    return assure.products

# -----------------------------
# Reglement Endpoints
# -----------------------------
reglement_router = APIRouter(prefix="/api", tags=["reglement"])

@reglement_router.get("/Reglement/AssureNames_Product", response_model=List[schemas.ProductWithAssureName])
def get_products_with_assure_names(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve reglement details along with each product's associated Assure name.
    """
    products = db.query(models.ProductModel).all()
    result = []
    for product in products:
        assure = db.query(models.AssureModel).filter(models.AssureModel.Cin == product.assure_id).first()
        result.append(schemas.ProductWithAssureName(
            id=product.id,
            Police=product.Police,
            Date_effet=str(product.Date_effet),
            Assure_name=assure.Assure_name if assure else "",
            Fractionn=product.Fractionn,
            Date_Emission=product.Date_Emission,
            Matricule=product.Matricule,
            Attestation=product.Attestation,
            Prime_Totale=product.Prime_Totale,
            assure_id=product.assure_id
        ))
    return result


@reglement_router.post("", response_model=schemas.ReglementBase)
def create_reglement(reglement: schemas.ReglementCreate, db: orm.Session = Depends(services.get_db)):
    """
    Create a new reglement record for a given product and log this action in the history.
    """
    # Validate that the product exists
    product = db.query(models.ProductModel).filter(models.ProductModel.id == reglement.Product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Calculate new remaining amount (reste) based on the last reglement
    last_reglement = db.query(models.ReglementModel).filter(
        models.ReglementModel.Product_id == reglement.Product_id
    ).order_by(models.ReglementModel.id.desc()).first()
    last_reste = last_reglement.Reste if last_reglement else product.Prime_Totale
    new_reste = last_reste - reglement.Reglement

    # Create and commit new reglement
    db_reglement = models.ReglementModel(
        Product_id=reglement.Product_id,
        Reste=new_reste,
        Garant=reglement.Garant,
        numero=reglement.numero,
        Reglement=reglement.Reglement,
        Date_de_reglement=reglement.Date_de_reglement,
        Type_de_reglement=reglement.Type_de_reglement,
        Etat=reglement.Etat
    )
    db.add(db_reglement)
    db.commit()
    db.refresh(db_reglement)

    # Log this creation in history
    db_history = models.HistoryModel(
        assure_id=product.assure_id,
        product_id=product.id,
        reglement_id=db_reglement.id,
        action="create",
        description=f"Created reglement with Reglement: {reglement.Reglement} and Reste: {new_reste}",
        reste_amount=new_reste,
        numero=reglement.numero,
        date_reglement=reglement.Date_de_reglement,
        reglement_amount=reglement.Reglement
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)

    return db_reglement


@reglement_router.put("/product/{product_id}", response_model=schemas.ReglementBase)
def update_reglement_by_product_id(
    product_id: int,
    reglement_update: schemas.ReglementUpdate,
    db: orm.Session = Depends(services.get_db)
):
    """
    Update the latest reglement for a specific product and create a history record.
    """
    last_reglement = db.query(models.ReglementModel).filter(
        models.ReglementModel.Product_id == product_id
    ).order_by(models.ReglementModel.id.desc()).first()

    if not last_reglement:
        raise HTTPException(status_code=404, detail="Reglement not found")

    product = db.query(models.ProductModel).filter(models.ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_reste = reglement_update.Reglement
    # Update reglement values
    last_reglement.Reste = new_reste
    last_reglement.Garant = reglement_update.Garant
    last_reglement.numero = reglement_update.numero
    last_reglement.Reglement = reglement_update.Reglement
    last_reglement.Date_de_reglement = reglement_update.Date_de_reglement
    last_reglement.Type_de_reglement = reglement_update.Type_de_reglement
    last_reglement.Etat = reglement_update.Etat

    db.commit()
    db.refresh(last_reglement)

    # Create history record for the update
    db_history = models.HistoryModel(
        assure_id=product.assure_id,
        product_id=product.id,
        reglement_id=last_reglement.id,
        action="update",
        description=f"Updated reglement with Reglement: {reglement_update.Reglement} and Reste: {new_reste}",
        reste_amount=new_reste,
        numero=reglement_update.numero,
        date_reglement=reglement_update.Date_de_reglement,
        reglement_amount=reglement_update.Reglement
    )
    db.add(db_history)
    db.commit()
    db.refresh(db_history)

    return last_reglement


@reglement_router.get("/reglements/{id}", response_model=List[schemas.ReglementDetail])
def get_reglements_by_product_id(id: int, db: orm.Session = Depends(services.get_db)):
    """
    Retrieve all reglement records for a given product along with its Assure details.
    """
    reglements = db.query(models.ReglementModel).join(models.ProductModel).join(models.AssureModel)\
        .filter(models.ProductModel.id == id).all()
    if not reglements:
        raise HTTPException(status_code=404, detail="No reglements found for the given id")

    result = []
    for reglement in reglements:
        product = reglement.product
        assure = product.assure
        result.append(schemas.ReglementDetail(
            id=reglement.id,
            cin=assure.Cin,
            nom_assure=assure.Assure_name,
            prime_totale=product.Prime_Totale,
            reste=reglement.Reste,
            matricule=product.Matricule,
            reglement=reglement.Reglement,
            type_de_reglement=reglement.Type_de_reglement,
            Etat=reglement.Etat
        ))
    return result


@reglement_router.delete("/{reglement_id}", response_model=schemas.ReglementBase)
def delete_reglement(reglement_id: int, db: orm.Session = Depends(services.get_db)):
    """
    Delete a reglement record and log the deletion in the history.
    """
    reglement = db.query(models.ReglementModel).filter(models.ReglementModel.id == reglement_id).first()
    if not reglement:
        raise HTTPException(status_code=404, detail="Reglement not found")

    product = reglement.product
    # Create history entry before deletion
    db_history = models.HistoryModel(
        assure_id=product.assure_id,
        product_id=product.id,
        reglement_id=reglement.id,
        action="delete",
        description=f"Deleted reglement with Reglement: {reglement.Reglement} and Reste: {reglement.Reste}",
        reste_amount=reglement.Reste,
        numero=reglement.numero,
        date_reglement=reglement.Date_de_reglement,
        reglement_amount=reglement.Reglement
    )
    db.add(db_history)
    db.commit()

    db.delete(reglement)
    db.commit()
    return reglement


@reglement_router.get("/reglements-caisse", response_model=List[schemas.ReglementDetailss])
def list_reglements_caisse(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve detailed reglement records for the caisse view.
    """
    reglements = db.query(models.ReglementModel).all()
    details = []
    for reglement in reglements:
        product = db.query(models.ProductModel).filter(models.ProductModel.id == reglement.Product_id).first()
        if not product:
            continue
        assure = db.query(models.AssureModel).filter(models.AssureModel.Cin == product.assure_id).first()
        if not assure:
            continue
        details.append(schemas.ReglementDetailss(
            id=reglement.id,
            cin=assure.Cin,
            nom_assure=assure.Assure_name,
            prime_totale=product.Prime_Totale,
            reste=reglement.Reste,
            matricule=product.Matricule,
            reglement=reglement.Reglement,
            type_de_reglement=reglement.Type_de_reglement,
            date_de_reglement=reglement.Date_de_reglement.strftime('%Y-%m-%d'),
            police=product.Police,
            montant_reglement=reglement.Reglement,
            type_reglement=reglement.Type_de_reglement
        ))
    return details


@reglement_router.get("/reglements-credit", response_model=schemas.ReglementCreditSummary)
def get_reglements_credit(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve a summary of reglement credits along with total prime and remaining amounts.
    """
    reglements = db.query(models.ReglementModel).all()
    details = []
    total_prime_totale = 0.0
    total_reste = 0.0

    for reglement in reglements:
        product = db.query(models.ProductModel).filter(models.ProductModel.id == reglement.Product_id).first()
        if not product:
            continue
        assure = db.query(models.AssureModel).filter(models.AssureModel.Cin == product.assure_id).first()
        if not assure:
            continue
        total_prime_totale += product.Prime_Totale or 0.0
        total_reste += reglement.Reste or 0.0
        details.append(schemas.ReglementCreditDetails(
            date_emission=product.Date_Emission,
            police=product.Police,
            nom_assure=assure.Assure_name,
            total_prime_totale=product.Prime_Totale,
            montant_reglement=reglement.Reglement,
            reste=reglement.Reste,
            etat_credit=reglement.Etat
        ))
    return schemas.ReglementCreditSummary(
        reglements=details,
        total_prime_totale=total_prime_totale,
        total_reste=total_reste
    )

# -----------------------------
# History Endpoints
# -----------------------------
history_router = APIRouter(prefix="/api", tags=["history"])

@history_router.get("/{cin}", response_model=List[schemas.HistoryBase])
def get_history_by_cin(cin: str, db: orm.Session = Depends(services.get_db)):
    """
    Retrieve history records by Assure CIN.
    """
    history_entries = db.query(models.HistoryModel).join(models.AssureModel)\
        .filter(models.AssureModel.Cin == cin).all()
    if not history_entries:
        raise HTTPException(status_code=404, detail="No history found for the given CIN")
    return history_entries


@history_router.delete("/{history_id}", response_model=schemas.HistoryBase)
def delete_history(history_id: int, db: orm.Session = Depends(services.get_db)):
    """
    Delete a history record by its ID.
    """
    history_entry = db.query(models.HistoryModel).filter(models.HistoryModel.id == history_id).first()
    if not history_entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    db.delete(history_entry)
    db.commit()
    return history_entry

# -----------------------------
# File Upload and Data Insertion
# -----------------------------
@app.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...), db: orm.Session = Depends(services.get_db)):
    """
    Upload an Excel file containing two sheets:
    - Sheet 1: AssureModel data with columns {CIN, Assuré}
    - Sheet 2: ProductModel data with columns {Date Emission, Police, Date effet, Prime Totale, CIN, Fractionn, Matricule}
    Process the file and insert data into the respective tables.
    """
    df1, df2 = await process_excel_file(file)

    # Clean data: Replace infinite values with NaN and fill NaN with 0
    df1 = df1.replace([np.inf, -np.inf], np.nan).fillna(0)
    df2 = df2.replace([np.inf, -np.inf], np.nan).fillna(0)

    # Validate required columns for Assure data
    required_columns_df1 = {'CIN', 'Assuré'}
    if not required_columns_df1.issubset(df1.columns):
        raise HTTPException(status_code=400, detail=f"Sheet 1 must contain columns: {required_columns_df1}")

    # Validate required columns for Product data
    required_columns_df2 = {'Date Emission', 'Police', 'Date effet', 'Prime Totale', 'CIN', 'Fractionn', 'Matricule'}
    if not required_columns_df2.issubset(df2.columns):
        raise HTTPException(status_code=400, detail=f"Sheet 2 must contain columns: {required_columns_df2}")

    # Insert data into AssureModel table from df1
    for _, row in df1.iterrows():
        cin = row['CIN']
        if db.query(models.AssureModel).filter(models.AssureModel.Cin == cin).first():
            continue
        assure_data = models.AssureModel(Cin=cin, Assure_name=row['Assuré'])
        db.add(assure_data)
        db.commit()
        db.refresh(assure_data)

    # Insert data into ProductModel table from df2
    for _, row in df2.iterrows():
        existing_product = db.query(models.ProductModel).filter(
            models.ProductModel.Date_Emission == row['Date Emission'],
            models.ProductModel.Police == row['Police'],
            models.ProductModel.Date_effet == row['Date effet'],
            models.ProductModel.Prime_Totale == row['Prime Totale'],
            models.ProductModel.assure_id == row['CIN'],
            models.ProductModel.Fractionn == row['Fractionn'],
            models.ProductModel.Matricule == row['Matricule'],
        ).first()
        if existing_product:
            continue
        product_data = models.ProductModel(
            Date_Emission=row['Date Emission'],
            Police=row['Police'],
            Date_effet=row['Date effet'],
            Prime_Totale=row['Prime Totale'],
            assure_id=row['CIN'],
            Fractionn=row['Fractionn'],
            Matricule=row['Matricule'],
        )
        db.add(product_data)
        db.commit()
        db.refresh(product_data)

    return {"message": "Data inserted successfully"}


async def process_excel_file(file: UploadFile):
    """
    Process the uploaded Excel file and return two pandas DataFrames:
    - df1: for Assure data
    - df2: for Product data
    """
    contents = await file.read()
    buffer = io.BytesIO(contents)

    try:
        excel_file = pd.ExcelFile(buffer)
        logger.info(f"Excel file sheets: {excel_file.sheet_names}")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    if len(excel_file.sheet_names) < 1:
        raise HTTPException(status_code=400, detail="Excel file must contain at least one sheet")

    # Currently reading the first sheet for both data sets; adjust sheet indexes if needed
    df1 = pd.read_excel(excel_file, sheet_name=0)
    df2 = pd.read_excel(excel_file, sheet_name=0)

    # Standardize column names (strip whitespace)
    df1.columns = [col.strip() for col in df1.columns]
    df2.columns = [col.strip() for col in df2.columns]

    logger.info(f"Sheet 1 columns: {df1.columns}")
    logger.info(f"Sheet 2 columns: {df2.columns}")
    return df1, df2

# -----------------------------
# Total Counts Endpoint
# -----------------------------
@app.get("/api/total", response_model=schemas.TotalCounts)
async def get_total_counts(db: orm.Session = Depends(services.get_db)):
    """
    Retrieve overall totals including:
    - Total number of products
    - Total number of assures
    - Total reglement amount
    - Total Prime Totale from products
    """
    total_product_count = db.query(models.ProductModel).count()
    total_assure_count = db.query(models.AssureModel).count()
    total_montant_reglement = db.query(func.sum(models.ReglementModel.Reglement)).scalar() or 0
    total_Prime_Totale = db.query(func.sum(models.ProductModel.Prime_Totale)).scalar() or 0

    return schemas.TotalCounts(
        total_products=total_product_count,
        total_assures=total_assure_count,
        total_montant=round(float(total_montant_reglement), 2),
        total_Prime_Totale=round(float(total_Prime_Totale), 2)
    )

# -----------------------------
# Register Routers with the Main Application
# -----------------------------
app.include_router(user_router)
app.include_router(assure_router)
app.include_router(product_router)
app.include_router(reglement_router)
app.include_router(history_router)

# -----------------------------
# Run the Application with Uvicorn (with SSL)
# -----------------------------
if __name__ == '__main__':
    uvicorn.run(
        "main:app",
        reload=True,
        host="0.0.0.0",
        port=443,
        ssl_certfile="cert.crt",
        ssl_keyfile="key.key"
    )
