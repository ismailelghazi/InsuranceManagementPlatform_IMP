import fastapi as _fastapi
import fastapi.security as _security
import jwt as _jwt  # Library for JSON Web Token encoding/decoding
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
from fastapi import UploadFile

import database as _database
import models as _models
import schemas as _schemas

# -----------------------------
# Authentication Configuration
# -----------------------------
# OAuth2PasswordBearer sets up the token URL for obtaining tokens.
oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")

# JWT secret key used for encoding and decoding tokens.
JWT_SECRET = "cairocodersednalan"

# -----------------------------
# Database Initialization
# -----------------------------
def create_database():
    """
    Create all database tables based on the ORM models.
    """
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    """
    Dependency that creates a new database session for a request.
    Yields a session and ensures it is closed after the request.
    """
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database (create tables) upon service startup.
create_database()

# -----------------------------
# User Management Services
# -----------------------------
async def get_user_by_email(email: str, db: _orm.Session):
    """
    Retrieve a user from the database by email.
    """
    return db.query(_models.User).filter(_models.User.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    """
    Create a new user with a hashed password.
    
    Steps:
    - Hash the provided password.
    - Create a new User model instance.
    - Add and commit the new user to the database.
    - Refresh the instance to retrieve generated fields (e.g., ID).
    """
    user_obj = _models.User(
        email=user.email, 
        hashed_password=_hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()  # Commit transaction to save the new user record.
    db.refresh(user_obj)  # Refresh to load new data (like auto-generated id).
    return user_obj

async def authenticate_user(email: str, password: str, db: _orm.Session):
    """
    Authenticate a user given an email and password.
    
    Returns:
      - The user object if authentication is successful.
      - False if the user is not found or the password is incorrect.
    """
    user = await get_user_by_email(email=email, db=db)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(user: _models.User):
    """
    Generate a JWT token for the authenticated user.
    
    Steps:
    - Convert the user ORM object to a Pydantic model.
    - Encode the user data into a JWT token.
    - Return the token along with its type.
    """
    user_obj = _schemas.User.from_orm(user)
    token = _jwt.encode(user_obj.dict(), JWT_SECRET)
    return dict(access_token=token, token_type="bearer")

async def get_current_user(
    db: _orm.Session = _fastapi.Depends(get_db),
    token: str = _fastapi.Depends(oauth2schema),
):
    """
    Retrieve the current user based on the provided JWT token.
    
    Steps:
    - Decode the JWT token using the secret key.
    - Retrieve the user from the database using the token payload.
    - If decoding fails or user is not found, raise an HTTP 401 error.
    """
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(_models.User).get(payload["id"])
    except Exception:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )
    return _schemas.User.from_orm(user)

# -----------------------------
# File Upload Service
# -----------------------------
async def create_upload_file(file: UploadFile):
    """
    Asynchronously read and return the content of an uploaded file.
    
    This function can be extended to process or store the file as needed.
    """
    contents = await file.read()
    # Additional file processing logic can be added here.
    return contents
