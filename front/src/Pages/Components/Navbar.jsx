import { A } from "@solidjs/router";
import { createSignal } from "solid-js";

function Navbar() {
    const [activeLink, setActiveLink] = createSignal("Assure");

    return (
        <div class="bg-blue-600 text-white h-screen w-64 flex flex-col items-center py-8">
            <div class="flex flex-col items-center justify-center w-full h-full gap-4">
                <A 
                    href="/assure" 
                    class={`px-6 py-3 flex items-center gap-4 hover:bg-blue-700 transition-colors ${activeLink() === 'Assure' ? 'bg-blue-700' : ''}`}
                    onClick={() => setActiveLink("Assure")}
                >
                    <i class="fas fa-user-shield"></i>
                    <span>Assure</span>
                </A>
                <A 
                    href="/produit" 
                    class={`px-6 py-3 flex items-center gap-4 hover:bg-blue-700 transition-colors ${activeLink() === 'Produit' ? 'bg-blue-700' : ''}`}
                    onClick={() => setActiveLink("Produit")}
                >
                    <i class="fas fa-box"></i>
                    <span>Produit</span>
                </A>
                <A 
                    href="/reglement" 
                    class={`px-6 py-3 flex items-center gap-4 hover:bg-blue-700 transition-colors ${activeLink() === 'Reglement' ? 'bg-blue-700' : ''}`}
                    onClick={() => setActiveLink("Reglement")}
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
