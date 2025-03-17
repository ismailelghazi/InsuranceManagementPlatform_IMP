import pandas as pd
import io
from fastapi import UploadFile
from services import create_upload_file  # Import the async function for file upload processing

async def process_file(file: UploadFile):
    """
    Process an uploaded Excel file and return a pandas DataFrame.
    
    Steps:
    1. Read the file contents asynchronously using the provided create_upload_file function.
    2. Create an in-memory bytes buffer from the file contents.
    3. Use pandas to read the Excel file from the buffer.
    
    Returns:
        A pandas DataFrame containing the data from the Excel file.
    """
    # Retrieve file contents asynchronously
    file_contents = await create_upload_file(file)

    # Create an in-memory bytes buffer from the file contents
    buffer = io.BytesIO(file_contents)

    # Read the Excel file from the in-memory buffer into a DataFrame
    df = pd.read_excel(buffer)

    return df

# Example usage (for testing purposes only; remove or comment out in production):
#
# async def test_process_file():
#     # Assuming 'file' is a valid UploadFile instance from a FastAPI request
#     df = await process_file(file)
#     # Filter and print specific columns from the DataFrame
#     print(df.filter(items=[
#         'Date Emission', 'Date effet', 'Date Fin', 'Prime Totale',
#         'CIN', 'Fractionn', 'Contrat', 'Période', 'Marque', 'Matricule', 'Attestation'
#     ]))
#
# async def test_assure_file():
#     # Read Excel file containing Assure data for demonstration
#     df_assure = pd.read_excel('data.xlsx')
#     print(df_assure.filter(items=['CIN', 'Assuré']))
