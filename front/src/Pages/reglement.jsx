import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "./Components/Navbar";
import Swal from 'sweetalert2';

function IndexReglement() {
    const [assures, setAssures] = createSignal([]);
    const [addAssure, setAddAssure] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredAssures, setFilteredAssures] = createSignal([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // Fetch assures data on component mount
    createEffect(() => {
        if (assures().length === 0) {
            fetcher('/Assure', true, 'GET', null, {}, navigate)
                .then((res) => {
                    setAssures(res);
                    setFilteredAssures(res);
                });
        }
    });

    // Handle assure deletion with confirmation
    const deleteAssure = (ev) => {
        const CIN = ev.target.attributes['data-cin'].nodeValue;
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete assure with CIN: ${CIN}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetcher(`/Assure_delete/${CIN}`, true, 'DELETE', null, null, navigate)
                    .then(() => {
                        setAssures(assures().filter((el) => el.Cin !== CIN));
                        setFilteredAssures(filteredAssures().filter((el) => el.Cin !== CIN));
                        Swal.fire(
                            'Deleted!',
                            'The assure has been deleted.',
                            'success'
                        );
                    });
            }
        });
    };

    // Handle new assure addition with success notification
    const addAssureData = (ev) => {
        ev.preventDefault();
        const formData = Object.fromEntries(new FormData(ev.target));
        const jsonformdata = JSON.stringify(formData);
        fetcher('/Assure_create', true, 'POST', jsonformdata)
            .then(() => {
                setAssures([...assures(), formData]);
                setFilteredAssures([...filteredAssures(), formData]);
                setAddAssure(false);
                Swal.fire(
                    'Added!',
                    'New assure has been added.',
                    'success'
                );
            });
    };

    // Function to filter assures based on search query
    const filterAssures = (query) => {
        const filtered = assures().filter(
            (assure) =>
                assure.Cin.toLowerCase().includes(query.toLowerCase()) ||
                assure.Assure_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAssures(filtered);
        setCurrentPage(1);
    };

    // Function to paginate assures
    const paginatedAssures = () => {
        const startIndex = (currentPage() - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAssures().slice(startIndex, endIndex);
    };

    const totalPages = () => Math.ceil(filteredAssures().length / itemsPerPage);

    return (
        <div class="flex w-screen h-screen bg-gray-100">
            <Navbar />
            <div class="dashboard-assurer-container w-full h-full pl-16 py-24">
                <h1 class="text-5xl text-blue-900 font-bold mb-8">Reglement Management</h1>
                <div class="bg-white shadow-md rounded-lg p-6 w-11/12 mr-12">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-3xl font-semibold text-gray-800">Reglement List</h2>
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
                    <div class="table-content-assurer">
                        <div class="table-head grid grid-cols-2 place-content-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                            <span class="col-span-1">CIN</span>
                            <span class="col-span-1">Nom Assurer</span>
                          
                        </div>
                        <div class="table-body overflow-y-scroll max-h-[550px]  styled-scrollbar">
                            <For each={paginatedAssures()}>
                                {(item) => (
                                    <div class="grid grid-cols-2  place-content-center py-2 px-4 border-b  border-gray-200">
                                        <div class="col-span-1">{item.Cin}</div>
                                        <div class="col-span-1">{item.Assure_name}</div>
                                        
                                    </div>
                                )}
                            </For>
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
