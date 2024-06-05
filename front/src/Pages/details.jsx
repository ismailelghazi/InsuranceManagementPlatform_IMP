import { For, Show, createEffect, createSignal } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import Navbar from "./Components/Navbar";
import Swal from "sweetalert2";

function DetailsPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [details, setDetails] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filter, setFilter] = createSignal('all');
    const [filteredAssures, setFilteredAssures] = createSignal([]);
    const [reglementAction, setReglementAction] = createSignal(false);
    const [reglementId, setReglementId] = createSignal(null);
    const [reglement, setReglement] = createSignal(false);
    const [doesRequireOperationID, setDoesRequireOperationID] = createSignal(false);
    const [isGarant, setIsGarant] = createSignal(false);
    const [currentDate, setCurrentDate] = createSignal(new Date().toISOString().split('T')[0]);

    createEffect(() => {
        if (params.cin) {
            fetcher(`/reglements/assure/${params.cin}`, true, 'GET', null, {}, navigate)
                .then((res) => {
                    setDetails(res);
                    setFilteredAssures(res); // Initialize filtered assures with the fetched details
                    console.log(res);
                })
                .catch((err) => Swal.fire('Error', err.message, 'error'));
        }
    });

    const readReglement = (ev) => {
        const values = ['cheque', 'lettre_de_change', 'virement', 'banque', 'credit'];
        if (values.includes(ev.target.value)) {
            setDoesRequireOperationID(true);
        } else {
            setDoesRequireOperationID(false);
        }
    };

    const submitReglement = (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);

        const reglementData = {
            Product_id: parseInt(params.id),
            Date_de_reglement: formData.get('date_reglement'),
            Type_de_reglement: formData.get('type_reglement'),
            numero: formData.get('numero'),
            Reste: 0,
            Reglement: parseFloat(formData.get('reglement')),
            Etat: formData.get('etat'),
            Garant: isGarant() ? formData.get('garant_input') : null
        };

        fetcher('/reglements/', true, 'POST', JSON.stringify(reglementData), { 'Content-Type': 'application/json' }, navigate)
            .then(() => {
                Swal.fire('Success', 'Reglement added successfully', 'success');
                navigate(`/product`);
            })
            .catch((err) => {
                Swal.fire('Error', err.message, 'error');
            });
    };

    const filterDetails = () => {
        let filtered = details();
        if (filter() !== 'all') {
            filtered = filtered.filter(detail => detail.Etat === filter());
        }
        if (searchQuery()) {
            filtered = filtered.filter(detail =>
                detail.nom_assure.toLowerCase().includes(searchQuery().toLowerCase()) ||
                detail.cin.toLowerCase().includes(searchQuery().toLowerCase())
            );
        }
        setFilteredAssures(filtered);
    };

    createEffect(() => {
        filterDetails();
    });

    const handleDelete = (id) => {
        const confirmation = confirm("Are you sure you want to delete this item?");
        if (confirmation) {
            fetcher(`/Product_delete/${id}`, true, 'DELETE', null, {}, navigate)
                .then((res) => {
                    if (res.ok) {
                        setDetails(details().filter(detail => detail.id !== id));
                        alert('Item deleted successfully');
                        navigate('/reglements');
                    } else {
                        console.error('Failed to delete');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    const handleAdd = (id) => {
        fetcher(`/reglements/product/${id}`, true, 'GET', null, {}, navigate)
            .then((res) => {
                if (res.length > 0) {
                    setReglement(res[0]);
                    setReglementAction(true);
                } else {
                    Swal.fire('Error', 'No reglement found for the product', 'error');
                }
            })
            .catch((err) => Swal.fire('Error', err.message, 'error'));
    };

    const handleEdit = (id) => {
        console.log(id);
        // Implement your edit functionality here
    };

    return (
        <div class="flex w-full h-full bg-gray-100">
            <Navbar />
            <div class="dashboard-assurer-container flex-col flex-grow w-full h-full md:pl-16 py-8 md:py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-4 md:mb-8">
                    {details().length > 0 ? details()[0].nom_assure : 'Loading...'}
                </h1>
                <h1 class="text-xl md:text-3xl text-blue-900 font-bold mb-4 md:mb-8">
                    {details().length > 0 ? details()[0].cin : 'Loading...'}
                </h1>
                <div class="bg-white shadow-md rounded-lg p-4 md:p-6 w-full md:w-11/12 mx-2 md:mr-12">
                    <div class="flex items-center justify-between pb-4">
                        <input
                            type="text"
                            placeholder="Search"
                            class="py-2 px-3 border border-gray-300 rounded-lg w-full md:w-auto mr-0 md:mr-4"
                            value={searchQuery()}
                            onInput={(e) => setSearchQuery(e.target.value)}
                            onKeyUp={filterDetails}
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
                            <For each={filteredAssures()}>
                                {(detail) => (
                                    <div class="grid grid-cols-8 md:grid-cols-8 place-content-center py-2 px-4 border-b border-gray-200">
                                        <div class="md:block col-span-1">{detail.id}</div>
                                        <div class="col-span-1">{detail.cin}</div>
                                        <div class="col-span-1">{detail.nom_assure}</div>
                                        <div class="col-span-1">{detail.prime_totale}</div>
                                        <div class="md:block col-span-1">{detail.matricule}</div>
                                        <div class="col-span-1">{detail.reste === 0 ? <span class="text-blue-600">{detail.reste}</span> : detail.reste}</div>
                                        <div class="col-span-1">{detail.Etat || 'N/A'}</div>
                                        <div class="col-span-1 flex gap-3 text-xl">
                                            <i class="fa-solid fa-square-plus" onClick={() => { handleAdd(detail.id); setReglementAction(true); }}></i>
                                            <i class="fa-solid fa-pen-to-square cursor-pointer" onClick={() => { handleEdit(detail.id); setReglementAction(true) }}></i>
                                            <i
                                                class="fa-regular fa-trash-can cursor-pointer text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(detail.id)}
                                            ></i>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
                <Show when={reglement()}>
                    <div class="flex flex-grow justify-center items-center py-12">
                        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl h-full overflow-auto">
                            <h1 class="text-3xl font-bold text-blue-900 mb-8 text-center">Add Reglement</h1>
                            {reglement() ? (
                                <div>
                                    <div>{reglement().id}</div>
                                    <div>{reglement().cin}</div>
                                </div>
                            ) : <div>{null}</div>}
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}

export default DetailsPage;
