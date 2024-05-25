import { createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "./Components/Navbar";
import Swal from 'sweetalert2';

function IndexAssure() {
    const [assures, setAssures] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredAssures, setFilteredAssures] = createSignal([]);
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    createEffect(() => {
        fetcher('/Assure', true, 'GET', null, {}, navigate)
            .then((res) => {
                setAssures(res);
                setFilteredAssures(res);
            });
    });

    const deleteAssure = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you really want to delete assure with ID: ${id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetcher(`/api/Assure/${id}`, true, 'DELETE', null, null, navigate)
                    .then(() => {
                        setAssures(assures().filter((el) => el.id !== id));
                        setFilteredAssures(filteredAssures().filter((el) => el.id !== id));
                        Swal.fire(
                            'Deleted!',
                            'The assure has been deleted.',
                            'success'
                        );
                    });
            }
        });
    };

    const filterAssures = (query) => {
        const filtered = assures().filter(
            (assure) =>
                assure.CIN.toLowerCase().includes(query.toLowerCase()) ||
                assure.assure_name.toLowerCase().includes(query.toLowerCase())
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
        <div class="flex w-screen h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <div class="w-full h-full p-6">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Reglement Management</h1>
                <div class="bg-white shadow-md w-full rounded-lg p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl md:text-3xl font-semibold text-gray-800">Reglement List</h2>
                        <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterAssures(searchQuery())}
                            />
                            <button class="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={() => navigate('/add-assure')}>
                                Add Assure
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto styled-scrollbar">
                        <table class="min-w-full table-auto">
                            <thead>
                                <tr class="bg-gray-200 text-gray-700 font-semibold">
                                    <th class="py-2 px-4">CIN</th>
                                    <th class="py-2 px-4">Assure Name</th>
                                    <th class="py-2 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <For each={paginatedAssures()}>
                                    {(assure) => (
                                        <tr class="border-b border-gray-200">
                                            <td class="py-2 px-4">{assure.CIN}</td>
                                            <td class="py-2 px-4">{assure.assure_name}</td>
                                            <td class="py-2 px-4">
                                                <i class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700" onClick={() => deleteAssure(assure.id)}></i>
                                            </td>
                                        </tr>
                                    )}
                                </For>
                            </tbody>
                        </table>
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

export default IndexAssure;
