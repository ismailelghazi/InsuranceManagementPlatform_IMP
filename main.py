# fastapi-jwt/main.py
from typing import List
import fastapi as _fastapi
import fastapi.security as _security
from fastapi import FastAPI, status, HTTPException, Depends
import Execel_imoprt_data as data_ex
import sqlalchemy.orm as _orm
import datetime as dt

import models
import services as _services, schemas as _schemas

app = _fastapi.FastAPI()

##############################################################User###################################################################################
@app.post("/api/users")
async def create_user(
        user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_user = await _services.get_user_by_email(user.email, db)
    if db_user:
        raise _fastapi.HTTPException(status_code=400, detail="Email already in use")

    user = await _services.create_user(user, db)

    return await _services.create_token(user)


@app.post("/api/token")
async def generate_token(
        form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(),
        db: _orm.Session = _fastapi.Depends(_services.get_db),
):
    user = await _services.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Credentials")

    return await _services.create_token(user)


@app.get("/api/users/myprofile", response_model=_schemas.User)
async def get_user(user: _schemas.User = _fastapi.Depends(_services.get_current_user)):
    return user

##############################################################Assure###################################################################################
@app.get("/api/Assure", response_model=List[_schemas.AssureBase])
async def read_Assure_list(Assure : _schemas.AssureBase = _fastapi.Depends(_services.get_db)):
    Assure_list = Assure.query(models.AssureModel).all()  # get all Assure
    return Assure_list

@app.post("/api/Assure_create",response_model=_schemas.AssureBase,status_code=status.HTTP_201_CREATED)
def create_Assure(Assure:_schemas.AssureCreat,db: _orm.Session = _fastapi.Depends(_services.get_db)):
    Assuredb = models.AssureModel(Cin=Assure.Cin,Assure_name=Assure.Assure_name)
    db.add(Assuredb)
    db.commit()
    db.refresh(Assuredb)
    return Assuredb

@app.delete("/api/Assure_delete/{Cin}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Assure(Cin: str, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    # Retrieve the Assure object from the database
    Assuredb = db.query(models.AssureModel).filter(models.AssureModel.Cin == Cin).first()

    # If Assure object does not exist, raise HTTPException with status code 404
    if not Assuredb:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assure not found")

    # Delete the Assure object
    db.delete(Assuredb)
    db.commit()

    return None

@app.get("/Assure/{id}", response_model=_schemas.AssureBase)
def read_Assure(Cin: str, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    Assure = db.query(models.AssureModel).get(Cin)  # get item with the given id

    # check if id exists. If not, return 404 not found response
    if not Assure:
        raise HTTPException(status_code=404, detail=f"item with id {Cin} not found")

    return Assure
##########################################################Assure_insert_data_from_excel##########################################################
@app.post("/api/insert_data_from_excel", status_code=status.HTTP_201_CREATED)
def insert_data_from_excel(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    for index, row in data_ex.df.iterrows():
        cin = row['CIN']
        assure_db = db.query(models.AssureModel).filter(models.AssureModel.Cin == cin).first()
        if assure_db:
            continue
        assure_data = models.AssureModel(
            Cin=row['CIN'],
            Assure_name=row['Assuré']
        )
        Assuredb = models.AssureModel(Cin=assure_data.Cin, Assure_name=assure_data.Assure_name)
        db.add(Assuredb)
        db.commit()
    return {"message": "Data inserted successfully"}
##########################################################Product##########################################################



@app.post("/api/product_create",response_model=_schemas.ProductBase,status_code=status.HTTP_201_CREATED)
def create_Assure(product: _schemas.ProductCreate,db: _orm.Session = _fastapi.Depends(_services.get_db)):
    Productdb = models.ProductModel(  Police=product.Police,
    Date_effet=product.Date_effet,
    Acte=product.Acte,
    Date_fin=product.Date_fin,
    Fractionn=product.Fractionn,
    Contrat=product.Contrat,
    Periode=product.Periode,
    Marque=product.Marque,
    Date_Emission=product.Date_Emission,
    Matricule=product.Matricule,
    Attestation=product.Attestation,
    Prime_Totale=product.Prime_Totale,
    assure_id=product.assure_id)

    # db_product = models.ProductModel(Productdb)
    db.add(Productdb)
    db.commit()
    db.refresh(Productdb)
    return Productdb


@app.get("/api/Product", response_model=List[_schemas.ProductBase])
async def read_Product_list(Product : _schemas.ProductBase = _fastapi.Depends(_services.get_db)):
    Product_list = Product.query(models.ProductModel).all()  # get all
    return Product_list
@app.get("/api/Product/{assure_id}", response_model=_schemas.ProductBase)
async def Product_by_cin(assure_id: str,db: _orm.Session = _fastapi.Depends(_services.get_db)):

    Product_by_cin = db.query(models.ProductModel).get(assure_id)

    if not Product_by_cin:
        raise HTTPException(status_code=404, detail=f" item with id {assure_id} not found")
    return Product_by_cin

