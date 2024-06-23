import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "./Components/Navbar";
import Swal from 'sweetalert2';

function IndexAssure() {
    const [assures, setAssures] = createSignal(null);
    const [addAssure, setAddAssure] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredAssures, setFilteredAssures] = createSignal(null);
    const navigate = useNavigate();

    createEffect(() => {
        if (assures() === null) {
            fetcher('/Assure', true, 'GET', null, {}, navigate)
                .then((res) => {
                    setAssures(res);
                    setFilteredAssures(res);
                })
        }
    });

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

    const filterAssures = (query) => {
        const filtered = assures().filter(
            (assure) =>
                assure.Cin.toLowerCase().includes(query.toLowerCase()) ||
                assure.Assure_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAssures(filtered);
    };

    return (
        <div class="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <div class="dashboard-assurer-container w-full h-full px-4 py-8 md:py-24 md:pl-16">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Assure Management</h1>
                <div class="bg-white shadow-md w-full rounded-lg p-4 md:p-6 mb-8">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 class="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Assures List</h2>
                        <div class="flex items-center space-x-2 md:space-x-4">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg w-full md:w-auto"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterAssures(searchQuery())}
                            />
                            <button class="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={() => setAddAssure(!addAssure())}>
                                {addAssure() ? 'Cancel' : 'Add Assure'}
                            </button>
                        </div>
                    </div>
                    <div class="overflow-auto max-h-[calc(100vh-300px)] styled-scrollbar">
                        <div class="min-w-full">
                            <div class="hidden md:grid grid-cols-3 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                                <span>CIN</span>
                                <span>Nom Assurer</span>
                                <span class="text-center">Actions</span>
                            </div>
                            <div class="table-body max-h-[600px]">
                                <For each={filteredAssures()}>
                                    {(item) => (
                                        <div class="grid grid-cols-1 md:grid-cols-3 py-2 px-4 border-b border-gray-200 gap-y-4 md:gap-y-0 cursor-pointer">
                                            <div class="md:hidden font-semibold">CIN</div>
                                            <div class="truncate">{item.Cin}</div>

                                            <div class="md:hidden font-semibold">Nom Assurer</div>
                                            <div class="truncate">{item.Assure_name}</div>

                                            <div class="md:hidden font-semibold">Actions</div>
                                            <div class="text-center">
                                                <i class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700" data-cin={item.Cin} onClick={deleteAssure}></i>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <Show when={addAssure()}>
                        <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
                            <div class="p-4 bg-gray-50 rounded-lg shadow-inner w-full max-w-lg">
                                <form onSubmit={addAssureData}>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="flex flex-col">
                                            <label for="Cin" class="mb-1 font-medium text-gray-700">CIN</label>
                                            <input type="text" name="Cin" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div class="flex flex-col">
                                            <label for="Assure_name" class="mb-1 font-medium text-gray-700">Nom Assure</label>
                                            <input type="text" name="Assure_name" class="py-2 px-3 border border-gray-300 rounded-lg" required />
                                        </div>
                                    </div>
                                    <div class="mt-4 flex justify-between">
                                        <button type="button" class="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => setAddAssure(false)}>Cancel</button>
                                        <button type="submit" class="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Assure</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default IndexAssure;
