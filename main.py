# fastapi-jwt/main.py
from typing import List
import fastapi as _fastapi
import fastapi.security as _security
from fastapi import FastAPI, status, HTTPException, Depends

import sqlalchemy.orm as _orm

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
