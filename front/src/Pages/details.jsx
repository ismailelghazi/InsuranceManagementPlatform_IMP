import { For, createEffect, createSignal } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import Navbar from "./Components/Navbar";

function DetailsPage() {
    const params = useParams();
    const [details, setDetails] = createSignal(null);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filter, setFilter] = createSignal('all'); // Initialize filter state with 'all'
    const [filteredAssures, setFilteredAssures] = createSignal([]);

    const navigate = useNavigate();

    createEffect(() => {
        if (params.cin) {
            fetcher(`/reglements/assure/${params.cin}`, true, 'GET', null, {}, navigate)
                .then((res) => {
                    setDetails(res);
                    console.log(res);
                });
        }
    });

    // Function to filter details based on the selected filter
    const filterDetails = (details) => {
        if (filter() === 'all') {
            return details;
        } else {
            return details.filter(detail => detail.etat === filter());
        }
    };

    return (
        <div class="flex flex-col md:flex-row w-full h-full bg-gray-100">
            <Navbar />
            <div class="dashboard-assurer-container flex-grow w-full h-full md:pl-16 py-8 md:py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-4 md:mb-8">
                    {details() ? details()[0]['nom_assure'] : 'Loading...'}
                </h1>
                <h1 class="text-xl md:text-3xl text-blue-900 font-bold mb-4 md:mb-8">
                    {details() ? details()[0]['cin'] : 'Loading...'}
                </h1>
                <div class="bg-white shadow-md rounded-lg p-4 md:p-6 w-full md:w-11/12 mx-2 md:mr-12">
                    <div class="flex items-center justify-between pb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            class="py-2 px-3 border border-gray-300 rounded-lg w-full md:w-auto mr-0 md:mr-4"
                            value={searchQuery()}
                            onInput={(e) => setSearchQuery(e.target.value)}
                            onKeyUp={() => filteredAssures(searchQuery())}
                        />
                        <select class="py-2 px-3 border border-gray-300 rounded-lg" value={filter()} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All</option>
                            <option value="solder">Solder</option>
                            <option value="encour">Encour</option>
                        </select>
                    </div>

                    <div class="table-content-assurer">
                        <div class="table-head grid grid-cols-8 md:grid-cols-8 place-content-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                            <span class="hidden md:block col-span-1">ID</span>
                            <span class="col-span-1">CIN</span>
                            <span class="col-span-1">Nom Assurer</span>
                            <span class="col-span-1">Prime Totale</span>
                            <span class="hidden md:block col-span-1">Matricule</span>
                            <span class="col-span-1">Reste</span>
                            <span class="col-span-1">Etat</span>
                            <span class="col-span-1">Action</span>
                        </div>
                        <div class="table-body overflow-y-scroll max-h-[550px] styled-scrollbar">
                            <For each={filterDetails(details())}>
                                {(detail) => (
                                    <div class="grid grid-cols-8 md:grid-cols-8 place-content-center py-2 px-4 border-b border-gray-200">
                                    <div class="md:block col-span-1">{detail.id}</div>
                                    <div class="col-span-1">{detail.cin}</div>
                                    <div class="col-span-1">{detail.nom_assure}</div>
                                    <div class="col-span-1">{detail.prime_totale}</div>
                                    <div class="md:block col-span-1">{detail.matricule}</div>
                                    <div class="col-span-1" class:text-blue-600  ={detail.reste === 0}>{detail.reste}</div>
                                    <div class="col-span-1">{detail.Etat?detail.Etat:`${null}`} </div>
                                    <div class="col-span-1 flex gap-3 text-xl">
                                        <i class="fa-solid fa-square-plus"></i>
                                        <i class="fa-solid fa-pen-to-square cursor-pointer"></i>
                                        <i class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700"></i>
                                    </div>
                                </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
