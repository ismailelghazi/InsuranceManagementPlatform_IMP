import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "./Components/Navbar";
import Swal from 'sweetalert2';

function IndexReglement() {
    const [assures, setAssures] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredAssures, setFilteredAssures] = createSignal([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    createEffect(() => {
            fetcher('/Assure', true, 'GET', null, {}, navigate)
                .then((res) => {
                    setAssures(res);
                    setFilteredAssures(res);
                });
    });

    const filterAssures = (query) => {
        const filtered = assures().filter(
            (assure) =>
                assure.Cin.toLowerCase().includes(query.toLowerCase()) ||
                assure.Assure_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAssures(filtered);
        setCurrentPage(1);
    };

    const paginatedAssures = () => {
        const startIndex = (currentPage() - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAssures().slice(startIndex, endIndex);
    };

    const totalPages = () => Math.ceil(filteredAssures().length / itemsPerPage);

    return (
        <div class="flex w-full min-h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <div class="dashboard-assurer-container w-full h-full  pl-16 py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Reglement Management</h1>
                <div class="bg-white shadow-md w-11/12 rounded-lg p-6 mb-8">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 class="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Reglement List</h2>
                        <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterAssures(searchQuery())}
                            />
                        </div>
                    </div>
                    <div class="overflow-auto max-h-[calc(100vh-300px)] styled-scrollbar">
                        <div class="min-w-full">
                            <div class="grid bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg hidden md:grid"
                                style="grid-template-columns: repeat(2, 1fr);">
                                <span class="col-span-1">CIN</span>
                                <span class="col-span-1">Nom Assurer</span>
                            </div>
                            <div class="table-body max-h-[600px]">
                                <For each={paginatedAssures()}>
                                    {(item) => (
                                        <div class="grid py-2 px-4 border-b border-gray-200 gap-y-4 grid-cols-1 md:grid-cols-2 cursor-pointer"
                                             onClick={() => navigate(`/details/${item.Cin}`)}>
                                            <div class="md:hidden font-semibold">CIN</div>
                                            <div class="col-span-1 truncate">{item.Cin}</div>

                                            <div class="md:hidden font-semibold">Nom Assurer</div>
                                            <div class="col-span-1 truncate">{item.Assure_name}</div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <Show when={filteredAssures().length > itemsPerPage}>
                        <div class="flex justify-between mt-4">
                            <button
                                class="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setCurrentPage(currentPage() - 1)}
                                disabled={currentPage() === 1}
                            >
                                Previous
                            </button>
                            <div class="flex items-center">
                                Page {currentPage()} of {totalPages()}
                            </div>
                            <button
                                class="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setCurrentPage(currentPage() + 1)}
                                disabled={currentPage() === totalPages()}
                            >
                                Next
                            </button>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default IndexReglement;
