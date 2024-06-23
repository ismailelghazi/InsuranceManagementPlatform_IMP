import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import Navbar from "./Components/Navbar";

function EtatCaisse() {
   const [reglements, setReglements] = createSignal(null);
   const [searchQuery, setSearchQuery] = createSignal('');
   const [filteredReglements, setFilteredReglements] = createSignal([]);
   const [headersCount, setHeadersCount] = createSignal(0);
   const [currentPage, setCurrentPage] = createSignal(1);
   const [startDate, setStartDate] = createSignal('');
   const [endDate, setEndDate] = createSignal('');
   const [filter, setFilter] = createSignal('all');
   const itemsPerPage = 12;

   createEffect(() => {
       if (reglements() === null) {
           fetcher('/reglements-caisse',true , 'GET', null, {}, null)
               .then((res) => {
                   setReglements(res);
                   setFilteredReglements(res);
                   const count = Object.keys(res[0]).length;
                   setHeadersCount(count);
               });
       }
   });

   const filterReglements = (query, startDate, endDate) => {
       let filtered = reglements().filter(
           (reglement) =>
               reglement.police.toLowerCase().includes(query.toLowerCase()) ||
               reglement.nom_assure.toLowerCase().includes(query.toLowerCase())
       );

       if (startDate) {
           filtered = filtered.filter(reglement => new Date(reglement.date_de_reglement) >= new Date(startDate));
       }

       if (endDate) {
           filtered = filtered.filter(reglement => new Date(reglement.date_de_reglement) <= new Date(endDate));
       }

       setFilteredReglements(filtered);
       setCurrentPage(1); // Reset to the first page on new filter
   };

   const paginatedReglements = () => {
       const startIndex = (currentPage() - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       return filteredReglements().slice(startIndex, endIndex);
   };

   const totalPages = () => Math.ceil(filteredReglements().length / itemsPerPage);

   return (
       <div class="flex w-screen h-screen bg-gray-100 overflow-hidden">
           <Navbar />
           <div class="dashboard-product-container w-full h-full pl-16 py-24">
               <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Reglement Caisse</h1>
               <div class="bg-white shadow-md w-11/12 rounded-lg p-6 mr-12">
                   <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                       <h2 class="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Reglements List</h2>
                       <div class="flex items-center">
                           <input
                               type="text"
                               placeholder="Search"
                               class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                               value={searchQuery()}
                               onInput={(e) => setSearchQuery(e.target.value)}
                               onKeyUp={() => filterReglements(searchQuery(), startDate(), endDate())}
                           />
                           <label>Start Date</label>
                           <input
                               type="date"
                               class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                               value={startDate()}
                               onInput={(e) => setStartDate(e.target.value)}
                               onChange={() => filterReglements(searchQuery(), startDate(), endDate())}
                           />
                           <input
                               type="date"
                               class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                               value={endDate()}
                               onInput={(e) => setEndDate(e.target.value)}
                               onChange={() => filterReglements(searchQuery(), startDate(), endDate())}
                           />
                       </div>
                   </div>
                   <div class="styled-scrollbar">
                       <div class="table-content-product min-w-full">
                           <div class="table-head grid bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-t-lg hidden md:grid"
                               style="grid-template-columns: repeat(5, 1fr);">
                               <span class="col-span-1">Date de Reglement</span>
                               <span class="col-span-1">Police</span>
                               <span class="col-span-1">Nom Assure</span>
                               <span class="col-span-1">Montant Reglement</span>
                               <span class="col-span-1">Type Reglement</span>
                           </div>
                           <div class="table-body overflow-y-scroll max-h-[600px] styled-scrollbar">
                               <For each={paginatedReglements()}>
                                   {(item) => (
                                       <div class="grid py-2 px-4 border-b border-gray-200 gap-y-8 grid-cols-1 md:grid-cols-5">
                                           <div class="md:hidden font-semibold">Date de Reglement</div>
                                           <div class="col-span-1 truncate">{item.date_de_reglement}</div>

                                           <div class="md:hidden font-semibold">Police</div>
                                           <div class="col-span-1 truncate">{item.police}</div>

                                           <div class="md:hidden font-semibold">Nom Assure</div>
                                           <div class="col-span-1 truncate">{item.nom_assure}</div>

                                           <div class="md:hidden font-semibold">Montant Reglement</div>
                                           <div class="col-span-1 truncate">{item.montant_reglement}</div>

                                           <div class="md:hidden font-semibold">Type Reglement</div>
                                           <div class="col-span-1 truncate">{item.type_reglement}</div>
                                       </div>
                                   )}
                               </For>
                           </div>
                       </div>
                   </div>

                   <Show when={filteredReglements().length > itemsPerPage}>
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

export default EtatCaisse;
