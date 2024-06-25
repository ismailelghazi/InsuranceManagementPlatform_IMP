import { createEffect, createSignal } from "solid-js";
import Navbar from "./Components/Navbar";
import { fetcher } from "../Helpers/FetchHelper";
import { useNavigate } from "@solidjs/router";
import { AiOutlineDollarCircle, AiOutlineFileText, AiOutlineTeam } from 'react-icons/ai'; // Example icons from react-icons

function Dashboard() {
    const [total, setTotal] = createSignal(null);
    const navigate = useNavigate();

    createEffect(() => {
        fetcher('/total', true, 'GET', null, null, navigate)
            .then((result) => setTotal(result))
            .finally(() => console.log(total()));
    });

    return (
        <div class="flex w-screen h-screen bg-gray-100">
            <Navbar />
            <div class="w-full h-full pt-32 bg-red-100">
                <div class="w-9/12 mx-auto">
                    <div class="flex w-full gap-8">
                        {total() && (
                            <>
                                <div class="bg-gray-400 w-full rounded-lg p-4">
                                    <AiOutlineDollarCircle className="h-8 w-8 text-gray-600" />
                                    <span class="text-lg font-bold">Total d'Assure</span>
                                    <p class="text-xl">{total().total_assures}</p>
                                </div>
                                <div class="bg-gray-400 w-full rounded-lg p-4">
                                    <AiOutlineFileText className="h-8 w-8 text-gray-600" />
                                    <span class="text-lg font-bold">Total de Produit Issuée</span>
                                    <p class="text-xl">{total().total_products}</p>
                                </div>
                                <div class="bg-gray-400 w-full rounded-lg p-4">
                                    <AiOutlineTeam className="h-8 w-8 text-gray-600" />
                                    <span class="text-lg font-bold">Total Reglements (Crédit/Caisse)</span>
                                    <p class="text-xl">{total().total_montant}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
