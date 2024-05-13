import pandas as pd

# Path to your Excel file
excel_file = 'data.xlsx'

# Read Excel file into a pandas DataFrame
df = pd.read_excel(excel_file)

print(df.filter(items=['CIN', 'Assuré']
))

