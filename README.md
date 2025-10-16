# 🦺 FastAPI + React Insurance Manager

A simple web platform to manage insurance clients, contracts, payments, and financial reports. Built with **Python FastAPI** (backend) and **React/SolidJS** (frontend).

---

## 🚀 What can you do with this app?

- 🔐 **Login securely** as an admin user
- 📥 **Upload Excel files** with lists of clients and insurance contracts
- 👥 **See all clients** (“Assurés”) and add new ones
- 📄 **View and manage contracts** and payment status
- 💵 **Track payments** (“Règlements”) and see payment history
- 📑 **Download PDF reports** for caisse (cash) and credit status
- 📊 **Get a dashboard** with total clients, contracts, and financial summaries

---

## 🛠️ How to run it

### 1. Backend (API server)

1. Go to the `back` folder:
    ```bash
    cd back
    ```
2. Install Python requirements:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the API server:
    ```bash
    uvicorn main:app --reload
    ```

### 2. Frontend (Web app)

1. Go to the `front` folder:
    ```bash
    cd front
    ```
2. Install JS dependencies:
    ```bash
    npm install
    ```
3. Start the frontend:
    ```bash
    npm run dev
    ```
4. Open 🌐 [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 How to use

1. 🔐 **Login:** Use your admin account.
2. 📥 **Upload Excel:** Go to “Upload Excel” and select your file (see below for format).
3. 👥 **Manage clients:** Go to “Assurés” to add, search, or delete clients.
4. 📄 **View contracts:** Go to “Products” for all contracts.
5. 💵 **Track payments:** See “Règlements,” make new payments, or check details.
6. 📑 **Reports:** Go to “Caisse” or “Credit” to filter and export PDF reports.

### 📊 Excel Upload Format

- **Sheet 1:** Clients, columns: `CIN`, `Assuré`
- **Sheet 2:** Contracts, columns: `Date Emission`, `Police`, `Date effet`, `Prime Totale`, `CIN`, `Fractionn`, `Matricule`

---

## ⚙️ Tech Stack

- 🐍 Python, 🚀 FastAPI, 🛢️ SQLAlchemy, 🐼 Pandas
- ⚛️ React (SolidJS), 🎨 Tailwind CSS
- 📝 jsPDF, 💬 SweetAlert2

---

## 👤 Author

[Ismail El Ghazi](https://github.com/ismailelghazi)
