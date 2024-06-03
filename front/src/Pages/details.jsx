import { For, createEffect, createSignal } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import Navbar from "./Components/Navbar";

function DetailsPage() {
    const params = useParams();
    const [details, setDetails] = createSignal(null);
    const [searchQuery, setSearchQuery] = createSignal('');
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
                    <div class="flex items-center justify-end pb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            class="py-2 px-3 border border-gray-300 rounded-lg w-full md:w-auto mr-0 md:mr-4"
                            value={searchQuery()}
                            onInput={(e) => setSearchQuery(e.target.value)}
                            onKeyUp={() => filteredAssures(searchQuery())}
                        />
                    </div>

                    <div class="table-content-assurer">
                        <div class="table-head grid grid-cols-1 md:grid-cols-6 place-content-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                            <span class="hidden md:block col-span-1">ID</span>
                            <span class="col-span-1">CIN</span>
                            <span class="col-span-1">Nom Assurer</span>
                            <span class="col-span-1">Prime Totale</span>
                            <span class="hidden md:block col-span-1">Matricule</span>
                            <span class="col-span-1">Reste</span>
                        </div>
                        <div class="table-body overflow-y-scroll max-h-[550px] styled-scrollbar">
                            <For each={details()}>
                                {(detail) => (
                                    <div class="grid grid-cols-1 md:grid-cols-6 place-content-center py-2 px-4 border-b border-gray-200">
                                        <div class="hidden md:block col-span-1">{detail.id}</div>
                                        <div class="col-span-1">{detail.cin}</div>
                                        <div class="col-span-1">{detail.nom_assure}</div>
                                        <div class="col-span-1">{detail.prime_totale}</div>
                                        <div class="hidden md:block col-span-1">{detail.matricule}</div>
                                        <div class="col-span-1" class:text-blue-600 ={detail.reste === 0}>
                                            {detail.reste}
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
