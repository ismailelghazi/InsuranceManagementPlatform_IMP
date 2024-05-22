import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "../Components/Navbar";
import Swal from 'sweetalert2';

function IndexAssure() {
    const [assures, setAssures] = createSignal(null);
    const [addAssure, setAddAssure] = createSignal(false);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredAssures, setFilteredAssures] = createSignal(null);
    const navigate = useNavigate();

    // Fetch assures data on component mount
    createEffect(() => {
        if (assures() === null) {
            fetcher('/Assure', true, 'GET', null, {}, navigate)
                .then((res) => {
                    setAssures(res);
                    setFilteredAssures(res);
                })
                .then(() => console.log(assures()));
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
                console.log(assures());
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
    };

    return (
        <div class="flex w-screen h-screen bg-gray-100">
            <Navbar />
            <div class="dashboard-assurer-container w-full h-full pl-16 py-24">
                <h1 class="text-5xl text-blue-900 font-bold mb-8">Assure Management</h1>
                <div class="bg-white shadow-md rounded-lg p-6 w-6/6 mr-12">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-3xl font-semibold text-gray-800">Assures List</h2>
                        <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterAssures(searchQuery())}
                            />
                            <button class="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" onClick={() => setAddAssure(!addAssure())}>
                                {addAssure() ? 'Cancel' : 'Add Assure'}
                            </button>
                        </div>
                    </div>
                    <div class="table-content-assurer">
                        <div class="table-head grid grid-cols-3 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg">
                            <span class="col-span-1">CIN</span>
                            <span class="col-span-1">Nom Assurer</span>
                            <span class="col-span-1 text-center">Actions</span>
                        </div>
                        <div class="table-body overflow-y-scroll max-h-[550px] styled-scrollbar">
                            <For each={filteredAssures()}>
                                {(item) => (
                                    <div class="grid grid-cols-3 py-2 px-4 border-b border-gray-200">
                                        <div class="col-span-1">{item.Cin}</div>
                                        <div class="col-span-1">{item.Assure_name}</div>
                                        <div class="col-span-1 text-center">
                                            <i class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700" data-cin={item.Cin} onClick={deleteAssure}></i>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                    <Show when={addAssure()}>
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="p-4 bg-gray-50 rounded-lg shadow-inner">
            <form onSubmit={addAssureData}>
                <div class="grid grid-cols-2 gap-4">
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
