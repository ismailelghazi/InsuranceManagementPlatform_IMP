import { createEffect, createSignal } from "solid-js";
import Navbar from "./Components/Navbar";
import { fetcher } from "../Helpers/FetchHelper";
import { useNavigate } from "@solidjs/router";
import { AiOutlineDollarCircle,AiOutlineFileText,AiOutlineTeam  } from 'solid-icons/ai'; // Example icons from react-icons

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
            <div class="w-full h-full pt-16 bg-gray-50">
                <div class="w-11/12 mx-auto">
                    <h1 class="text-3xl font-bold text-gray-700 mb-8">Dashboard</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {total() && (
                            <>
                                <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div class="flex items-center mb-4">
                                        <div class="ml-4">
                                            <AiOutlineTeam className="h-10 w-10 text-red-600" />
                                            <span class="text-lg font-semibold text-gray-600">Total d'Assure</span>
                                            <p class="text-2xl font-bold text-gray-800">{total().total_assures}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div class="flex items-center mb-4">
                                        <AiOutlineFileText className="h-10 w-10 text-green-600" />
                                        <div class="ml-4">
                                            <span class="text-lg font-semibold text-gray-600">Total de Produit Issuée</span>
                                            <p class="text-2xl font-bold text-gray-800">{total().total_products}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div class="flex items-center mb-4">
                                        <AiOutlineDollarCircle className="h-10 w-10 text-blue-600" />
                                        <div class="ml-4">
                                            <span class="text-lg font-semibold text-gray-600">Total Reglements (Crédit/Caisse)</span>
                                            <p class="text-2xl font-bold text-gray-800">{total().total_montant}</p>
                                        </div>
                                    </div>
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
