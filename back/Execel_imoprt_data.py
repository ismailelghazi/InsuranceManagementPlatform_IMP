import pandas as pd

# Path to your Excel file
excel_file = 'data.xlsx'

# Read Excel file into a pandas DataFrame
df1 = pd.read_excel(excel_file)
df2 = pd.read_excel(excel_file)

print(df1.filter(items=['CIN', 'Assuré']
))

print(df1.filter(items=['Date Emission','Date effet','Date Fin','Prime Totale','CIN','Fractionn','Contrat','Période','Marque','Matricule','Attestation']
))