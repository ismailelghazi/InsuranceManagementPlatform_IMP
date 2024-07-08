import { createEffect, createSignal } from "solid-js";
import Navbar from "./Components/Navbar";
import { fetcher } from "../Helpers/FetchHelper";
import { useNavigate } from "@solidjs/router";
import { AiOutlineDollarCircle, AiOutlineFileText, AiOutlineTeam } from 'solid-icons/ai'; 
import { FaSolidHandHoldingDollar } from 'solid-icons/fa';

function Dashboard() {
    const [total, setTotal] = createSignal(null);
    const navigate = useNavigate();

    createEffect(() => {
        fetcher('/total', true, 'GET', null, null, navigate)
            .then((result) => setTotal(result))
            .catch((error) => console.error('Error fetching data:', error));
    });

    return (
        <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100">
            <Navbar />
            <main class="w-full h-full pt-16 md:pt-0 bg-gray-50 overflow-y-auto">
                <div class="flex justify-center items-center h-full p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
                        {total() && (
                            <>
                                <DashboardCard icon={<AiOutlineFileText class="h-10 w-10 text-green-600" />}

                                    title="Total de Produit Issuée"
                                    value={total().total_assures} />
                                <DashboardCard icon={<AiOutlineTeam class="h-10 w-10 text-red-600" />}
                                    title="Total d'Assure"
                                    value={total().total_products} />
                                <DashboardCard icon={<AiOutlineDollarCircle class="h-10 w-10 text-blue-600" />}
                                    title="Total Reglements"
                                    value={`${total().total_montant} DH`} />
                                <DashboardCard icon={<FaSolidHandHoldingDollar class="h-10 w-10 text-blue-600" />}
                                    title="Total Primes"
                                    value={`${total().total_Prime_Totale} DH`} />
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function DashboardCard({ icon, title, value }) {
    return (
        <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center mb-4">
                {icon}
                <div class="ml-4">
                    <span class="text-lg font-semibold text-gray-600">{title}</span>
                    <p class="text-2xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
