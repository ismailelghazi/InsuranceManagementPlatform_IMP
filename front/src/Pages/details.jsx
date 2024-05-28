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
                    console.log(res)
                });
        }
    });

    return (
        <div class="flex w-screen h-screen bg-gray-100">
            <Navbar />
            <div class="dashboard-assurer-container w-full h-full pl-16 py-24">
                <h1 class="text-5xl text-blue-900 font-bold mb-8">{details() ? details()[0]['nom_assure'] : 'Loading...'}</h1>
                <h1 class="text-3xl text-blue-900 font-bold mb-8">{details() ? details()[0]['cin'] : 'Loading...'}</h1>
                <div class="bg-white shadow-md rounded-lg p-6 w-11/12 mr-12">
                    <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filteredAssures(searchQuery())}
                            />
                        </div>
                    </div>
                    <div class="table-content-assurer">
                        <div class="table-head grid grid-cols-5 place-content-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                            <span class="col-span-1">ID</span>
                            <span class="col-span-1">CIN</span>
                            <span class="col-span-1">Nom Assurer</span>
                            <span class="col-span-1">Prime Totale</span>
                            <span class="col-span-1">Matricule</span>
                        </div>
                        <div class="table-body overflow-y-scroll max-h-[550px] styled-scrollbar">
                            <For each={details()}>
                                {(detail)=>( 
                                <div class="grid grid-cols-5 place-content-center py-2 px-4 border-b border-gray-200">
                                     <div class="col-span-1">{detail.id}</div>
                                     <div class="col-span-1">{detail.cin}</div>
                                     <div class="col-span-1">{detail.nom_assure}</div>
                                     <div class="col-span-1">{detail.prime_totale}</div>
                                     <div class="col-span-1">{detail.matricule}</div>
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

// {details() && details().details.map((detail) => (
//                                 <div class="grid grid-cols-5 place-content-center py-2 px-4 border-b border-gray-200">
//                                     <div class="col-span-1">{detail.id}</div>
//                                     <div class="col-span-1">{detail.cin}</div>
//                                     <div class="col-span-1">{details().Assure_name}</div>
//                                     <div class="col-span-1">{detail.primeTotale}</div>
//                                     <div class="col-span-1">{detail.matricule}</div>
//                                 </div>
//                             ))}
// 
