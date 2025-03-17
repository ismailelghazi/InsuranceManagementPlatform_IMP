import sqlalchemy as _sql
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL.
# For SQLite (local file-based database), use the following URL.
DATABASE_URL = "sqlite:///./dbfile.db"
# For PostgreSQL (or other databases), you might use a URL like this:
# DATABASE_URL = "postgresql://user:password@postgresserver/db"

# Create the SQLAlchemy engine which serves as the core interface to the database.
# For SQLite, we set 'check_same_thread' to False to allow the connection to be shared across threads.
engine = _sql.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a configured "SessionLocal" class.
# This sessionmaker will be used to create new Session objects for interacting with the database.
# autocommit=False: Changes are not automatically committed; you must explicitly commit transactions.
# autoflush=False: Changes are not automatically flushed to the database; you have more control over when the flush occurs.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for our class definitions.
# All of our models will inherit from this Base class to gain SQLAlchemy's declarative functionality.
Base = declarative_base()
