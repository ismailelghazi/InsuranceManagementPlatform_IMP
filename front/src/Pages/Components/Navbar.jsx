import { A, useNavigate } from "@solidjs/router";
import { store, setStore } from '../../Helpers/Stores';
import { Uploader } from "../../Helpers/Uploader";
import { createSignal } from "solid-js";
import { fetcher } from '../../Helpers/FetchHelper';

function Navbar() {
  const [uploaded, setUploaded] = createSignal(false);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const navigate = useNavigate();

  const excelUploader = (ev) => {
    if (ev.target.files[0] !== null) {
      const file = ev.target.files.item(0);
      const filetype = file.type;
      const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

      if (!allowedTypes.includes(filetype)) {
        alert("Please upload an Excel file");
        return;
      }

      ev.preventDefault();
      let formData = new FormData();

      Uploader(file).then((response) => {
        formData.append('file', new Blob([response]), file.name);
        fetcher('upload', false, 'POST', formData, {}, navigate)
          .then(() => setUploaded(true))
          .finally(() => navigate('/assurer'));
      });
    }
  };

  return (
    <div class="bg-blue-600 text-white h-screen w-64 flex flex-col items-center py-8">
      <div class="flex flex-col items-center justify-center w-full h-full gap-4">
        <A
          href="/assurer"
          class={`justify-center py-3 flex items-center gap-4 hover:bg-blue-800 w-full transition-colors duration-300 ${store.activeLink === 'Assure' ? 'bg-blue-700' : ''}`}
          onClick={() => setStore('activeLink', "Assure")}
        >
          <i class="fas fa-user-shield"></i>
          <span>Assure</span>
        </A>
        <A
          href="/product"
          class={`py-3 flex items-center gap-4 hover:bg-blue-800 w-full justify-center transition-colors duration-300 ${store.activeLink === 'Produit' ? 'bg-blue-700' : ''}`}
          onClick={() => setStore('activeLink', "Produit")}
        >
          <i class="fas fa-box"></i>
          <span>Produit</span>
        </A>
        <A
          href="/reglement"
          class={`justify-center py-3 flex items-center gap-4 hover:bg-blue-800 w-full transition-colors duration-300 ${store.activeLink === 'Reglement' ? 'bg-blue-700' : ''}`}
          onClick={() => setStore('activeLink', "Reglement")}
        >
          <i class="fas fa-file-invoice"></i>
          <span>Reglement</span>
        </A>
        <div class="relative w-full">
          <div
            class={`justify-center py-3 flex items-center gap-4 hover:bg-blue-800 w-full transition-colors duration-300 cursor-pointer ${store.activeLink === 'Etat' ? 'bg-blue-700' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen())}
          >
            <i class="fa-solid fa-bullseye"></i>
            <span>Etat</span>
            <i class={`fas fa-chevron-down transition-transform duration-300 ${dropdownOpen() ? 'transform rotate-180' : ''}`}></i>
          </div>
          {dropdownOpen() && (
            <div class="absolute left-0 w-full bg-blue-700">
              <A
                href="/etat/caisse"
                class="block py-3 pl-12 hover:bg-blue-800 transition-colors duration-300"
                onClick={() => {
                  setStore('activeLink', "Etat");
                  setDropdownOpen(false);
                }}
              >
                Etat caisse
              </A>
              <A
                href="/etat/credit"
                class="block py-3 pl-12 hover:bg-blue-800 transition-colors duration-300"
                onClick={() => {
                  setStore('activeLink', "Etat");
                  setDropdownOpen(false);
                }}
              >
                Etat credit
              </A>
            </div>
          )}
        </div>
        <div class="py-3 bg-blue-600 flex gap-4 text-white font-bold w-full items-center justify-center cursor-pointer hover:bg-blue-700 transition duration-300">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
          <label for="participation-file">
            Choose a File
            <input type="file" id="participation-file" name="file" class="hidden" onChange={excelUploader} />
          </label>
        </div>
      </div>
      <A
        href="/logout"
        class="mt-auto px-6 py-3 flex items-center gap-4 hover:bg-red-600 transition-colors duration-300 bg-red-500 w-full justify-center"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </A>
    </div>
  );
}

export default Navbar;
