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
    print(Assure)
    # check if id exists. If not, return 404 not found response
    if not Assure:
        raise HTTPException(status_code=404, detail=f"item with id {Cin} not found")

    return Assure
##########################################################Assure_insert_data_from_excel##########################################################
@app.post("/api/insert_data_from_excel", status_code=status.HTTP_201_CREATED)
def insert_data_from_excel(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    for index, row in data_ex.df1.iterrows():
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

@app.delete("/api/Product_delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Assure(id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    # Retrieve the Product object from the database
    Productdb = db.query(models.ProductModel).filter(models.ProductModel.id == id).first()

    # If Assure object does not exist, raise HTTPException with status code 404
    if not Productdb:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # Delete the Product object
    db.delete(Productdb)
    db.commit()
@app.get("/Assure/{Cin}/Product/")
def get_Assure_Product(Cin: str, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    Assure = db.query(models.AssureModel).filter(models.AssureModel.Cin == Cin).first()
    if Assure is None:
        raise HTTPException(status_code=404, detail="Assure not found")
    return Assure.products

######################################################################
@app.post("/api/Product/insert_data_from_excel", status_code=status.HTTP_201_CREATED)
def insert_data_from_excel(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    global Product_da
    for index, row in data_ex.df2.iterrows():
        Product_data = models.ProductModel(
            Date_Emission=row['Date Emission'],
            Acte=row['Acte'], Police=row['Police'],
            Date_effet=row['Date effet'], Date_fin=row['Date Fin'],Prime_Totale=row['Prime Totale']
            ,assure_id=row['CIN'], Fractionn=row['Fractionn'], Contrat=row['Contrat'],
            Matricule=row['Matricule'],Attestation=row['Attestation'],
            Periode=row['Période'], Marque=row['Marque'],
        )
        print(Product_data)
        Product_da = models.ProductModel(Date_Emission=Product_data.Date_Emission,
                                       Date_effet=Product_data.Date_effet,Date_fin=Product_data.Date_fin,Contrat=Product_data.Contrat,
                                         Periode=Product_data.Periode,Marque=Product_data.Marque,
                                         Fractionn=Product_data.Fractionn,Matricule=Product_data.Matricule,Attestation=Product_data.Attestation,
                                      Prime_Totale=Product_data.Prime_Totale,
                                       assure_id=Product_data.assure_id, Acte=Product_data.Acte,Police=Product_data.Police,)
        print(Product_da)
        db.add(Product_da)
        db.commit()
        db.refresh(Product_da)
    return {"message": "Data inserted successfully"}