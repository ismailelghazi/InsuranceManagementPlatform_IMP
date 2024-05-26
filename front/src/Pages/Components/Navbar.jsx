import { A } from "@solidjs/router";
import {store,setStore} from '../../Helpers/Stores'


function Navbar() {
    return (
        <div class="bg-blue-600 text-white h-screen w-64 flex flex-col items-center py-8">
            <div class="flex flex-col items-center justify-center w-full h-full gap-4">
                <A 
                    href="/assurer" 
                    class={`justify-center  py-3 flex items-center gap-4 hover:bg-blue-800  w-full transition-colors ${store.activeLink === 'Assure' ? 'bg-blue-700' : ''}`}
                    onClick={() => {
                        setStore('activeLink',"Assure")
                        console.log(store)
                    }}
                >
                    <i class="fas fa-user-shield"></i>
                    <span>Assure</span>
                </A>
                <A 
                    href="/product" 
                    class={` py-3 flex items-center gap-4 hover:bg-blue-700 w-full justify-center transition-colors ${store.activeLink === 'Produit' ? 'bg-blue-700' : ''}`}
                    onClick={() =>{
                        setStore('activeLink',"Produit")
                        console.log(store)
                    }}
                >
                    <i class="fas fa-box"></i>
                    <span>Produit</span>
                </A>
                <A 
                    href="/reglement" 
                    class={`justify-center  py-3 flex items-center gap-4 hover:bg-blue-700 w-full  transition-colors ${store.activeLink === 'Reglement' ? 'bg-blue-700' :'' }`}
                    onClick={() => {
                        setStore('activeLink',"Reglement")
                        console.log(store)
                    }}
                >
                    <i class="fas fa-file-invoice"></i>
                    <span>Reglement</span>
                </A>
            </div>
            <A 
                href="/logout" 
                class="mt-auto px-6 py-3 flex items-center gap-4 hover:bg-red-600 transition-colors bg-red-500 w-full justify-center"
            >
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </A>
        </div>
    );
}

export default Navbar;
