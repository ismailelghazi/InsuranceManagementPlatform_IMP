import pandas as pd
import pandas as pd
from services import create_upload_file
from fastapi import UploadFile

# Path to your Excel file
# excel_file = 'data.xlsx'
# # Read Excel file into a pandas DataFrame
# df1 = pd.read_excel(excel_file)
# df2 = pd.read_excel(excel_file)
# df3= pd.read_excel(_services.create_upload_file(excel_file))
# # print(df1.filter(items=['CIN', 'Assuré']
# # ))
#
# print(df1.filter(items=['Date Emission','Date effet','Date Fin','Prime Totale','CIN','Fractionn','Contrat','Période','Marque','Matricule','Attestation']
# ))
# print(df3.filter(items=['CIN', 'Assuré']
# ))
async def process_file(file: UploadFile):
    # Await the async function
    file_contents = await create_upload_file(file)

    # If `file_contents` is the file path:
    df3 = pd.read_excel(file_contents)

    # Or, if `file_contents` is the content of the file, use an in-memory buffer:
    import io
    buffer = io.BytesIO(file_contents)
    df3 = pd.read_excel(buffer)

    return df3