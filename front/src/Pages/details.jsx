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

    const [history, setHistory] = createSignal([]);
    const [showHistoryModal, setShowHistoryModal] = createSignal(false);

    createEffect(() => {
        if (params.cin) {
            fetcher(`/reglements/assure/${params.cin}`, true, 'GET', null, {}, navigate)
                .then((res) => {
                    setDetails(res);
                    setFilteredAssures(res); // Initialize filtered assures with the fetched details
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
            Product_id: reglementId(),
            Date_de_reglement: formData.get('date_reglement'),
            Type_de_reglement: formData.get('type_reglement'),
            numero: formData.get('numero'),
            Reste: 0,
            Reglement: parseFloat(formData.get('reglement')),
            Etat: formData.get('etat'),
            Garant: isGarant() ? formData.get('garant_input') : null
        };

        fetcher('/reglements', true, 'POST', JSON.stringify(reglementData), { 'Content-Type': 'application/json' }, navigate)
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
                    setReglement(res[res.length -1]);
                    setReglementId(id);
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

    const handleShowHistory = (cin) => {
        fetcher(`/history/${cin}`, true, 'GET', null, {}, navigate)
            .then((res) => {
                setHistory(res);
                setShowHistoryModal(true);
            })
            .catch((err) => Swal.fire('Error', err.message, 'error'));
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
                                        <div class="col-span-1 cursor-pointer text-blue-600" onClick={() => handleShowHistory(detail.cin)}>{detail.cin}</div>
                                        <div class="col-span-1">{detail.nom_assure}</div>
                                        <div class="col-span-1">{detail.prime_totale}</div>
                                        <div class="md:block col-span-1">{detail.matricule}</div>
                                        <div class="col-span-1">{detail.reste === 0 ? <span class="text-blue-600">{parseFloat(detail.reste).toFixed(2)}</span> : parseFloat(detail.reste).toFixed(2)}</div>
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
                    <div class="absolute top-0 left-0 w-full h-full bg-blue-900/50 flex justify-center items-start pt-12">
                        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl overflow-auto">
                            <h1 class="text-3xl font-bold text-blue-900 mb-8 text-center">Add Reglement</h1>
                            {reglement() && (
                                <form class="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={submitReglement}>
                                    <div>
                                        <label for="cin" class="block text-sm font-medium text-gray-700">CIN</label>
                                        <input type="text" name="cin" value={reglement().cin} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="nom_assure" class="block text-sm font-medium text-gray-700">Nom Assure</label>
                                        <input type="text" name="nom_assure" value={reglement().nom_assure} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="date_reglement" class="block text-sm font-medium text-gray-700">Date de reglement</label>
                                        <input type="date" name="date_reglement" value={currentDate()} class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="prime_totale" class="block text-sm font-medium text-gray-700">Prime Total</label>
                                        <input type="text" name="prime_totale" value={reglement().prime_totale} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="type_de_reglement" class="block text-sm font-medium text-gray-700">Type de reglement</label>
                                        <select name="type_reglement" onChange={readReglement} class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full">
                                            <option value="null">Veuillez selectionner</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="espece">Espece</option>
                                            <option value="lettre_de_change">Lettre De Change</option>
                                            <option value="virement">Virement</option>
                                            <option value="banque">Banque</option>
                                            <option value="credit">Credit</option>
                                            <option value="autres">Autres</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="matricule" class="block text-sm font-medium text-gray-700">Matricule</label>
                                        <input type="text" name="matricule" value={reglement().matricule} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    
                                    <Show when={doesRequireOperationID()}>
                                        <div>
                                            <label for="numero" class="block text-sm font-medium text-gray-700">N° d'operation</label>
                                            <input type="text" name="numero" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                        </div>
                                    </Show>
                                    <div>
                                        <label for="reglement" class="block text-sm font-medium text-gray-700">Reglement</label>
                                        <input type="text" name="reglement" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="reste" class="block text-sm font-medium text-gray-700">Reste</label>
                                        <input type="text" name="reste" value={reglement().reste} disabled class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                    </div>
                                    <div>
                                        <label for="etat" class="block text-sm font-medium text-gray-700">Etat</label>
                                        <select name="etat" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full">
                                            <option value="solder">Solder</option>
                                            <option value="encour">Encour</option>
                                        </select>
                                    </div>
                                    <div class="col-span-1 md:col-span-2">
                                        <label for="garant" class="block text-sm font-medium text-gray-700">Garant</label>
                                        <input type="checkbox" name="garant" class="mt-1" onChange={(e) => setIsGarant(e.target.checked)} />
                                    </div>
                                    <Show when={isGarant()}>
                                        <div class="col-span-1 md:col-span-2">
                                            <label for="garant_input" class="block text-sm font-medium text-gray-700">Nom du Garant</label>
                                            <input type="text" name="garant_input" class="mt-1 py-2 px-3 border border-gray-300 rounded-lg w-full" />
                                        </div>
                                    </Show>
                                    <div class="mt-2 flex justify-between col-span-2">
                                        <button type="submit" class="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg">Ajoute</button>
                                        <button type="button" class="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg" onClick={() => setReglement(false)}>Cancel</button>

                                    </div>
                                    
                                </form>
                            )}
                        </div>
                    </div>
                </Show>
                <Show when={showHistoryModal()}>
                    <div class="absolute top-0 left-0 w-full h-full bg-gray-900/50 flex justify-center items-start pt-12">
                        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl overflow-auto">
                            <h1 class="text-3xl font-bold text-blue-900 mb-8 text-center">History</h1>
                            <div class="grid grid-cols-8 gap-4 mb-4">
                                <span class="col-span-1">ID</span>
                                <span class="col-span-2">Action</span>
                                <span class="col-span-2">Date</span>
                                <span class="col-span-1">Reste Amount</span>
                                <span class="col-span-1">Reglement Amount</span>
                                <span class="col-span-1">Numero</span>
                            </div>
                            <For each={history()}>
                                {(item) => (
                                    <div class="grid grid-cols-8 gap-4 mb-2">
                                        <span class="col-span-1">{item.id}</span>
                                        <span class="col-span-2">{item.action}</span>
                                        <span class="col-span-2">{item.date_reglement}</span>
                                        <span class="col-span-1">{parseFloat(item.reste_amount).toFixed(2)}</span>
                                        <span class="col-span-1">{parseFloat(item.reglement_amount).toFixed(2)}</span>
                                        <span class="col-span-1">{item.numero}</span>
                                    </div>
                                )}
                            </For>
                            <button
                                class="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg"
                                onClick={() => setShowHistoryModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Show>
            </div>
        </div>
    );
}

export default DetailsPage; 
