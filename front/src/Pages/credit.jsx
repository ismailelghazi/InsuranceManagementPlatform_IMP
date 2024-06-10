import { For, createEffect, createSignal } from "solid-js";
import { fetcher } from '../Helpers/FetchHelper';
import Navbar from "./Components/Navbar";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function EtatCredit() {
    const [credits, setCredits] = createSignal(null);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [filteredCredits, setFilteredCredits] = createSignal([]);
    const [headersCount, setHeadersCount] = createSignal(0);
    const [currentPage, setCurrentPage] = createSignal(1);
    const [startDate, setStartDate] = createSignal('');
    const [endDate, setEndDate] = createSignal('');
    const itemsPerPage = 12;

    createEffect(() => {
        if (credits() === null) {
            fetcher('/reglements-credit', true, 'GET', null, {}, null)
                .then((res) => {
                    setCredits(res);
                    setFilteredCredits(res);
                    const count = Object.keys(res[0]).length;
                    setHeadersCount(count);
                });
        }
    });

    const filterCredits = (query, startDate, endDate) => {
        let filtered = credits().filter(
            (credit) =>
                credit.police.toLowerCase().includes(query.toLowerCase()) ||
                credit.nom_assure.toLowerCase().includes(query.toLowerCase())
        );

        if (startDate) {
            filtered = filtered.filter(credit => new Date(credit.date_emission) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(credit => new Date(credit.date_emission) <= new Date(endDate));
        }

        setFilteredCredits(filtered);
        setCurrentPage(1); // Reset to the first page on new filter
    };

    const paginatedCredits = () => {
        const startIndex = (currentPage() - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCredits().slice(startIndex, endIndex);
    };

    const totalPages = () => Math.ceil(filteredCredits().length / itemsPerPage);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        // Add logo
        const imgData = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='; // Placeholder base64 string
        doc.addImage(imgData, 'PNG', 10, 10, 30, 30); // Position and size of the logo

        // Add title
        doc.setFontSize(20);
        doc.text("Credits List", 50, 20);

        // Add subtitle
        doc.setFontSize(12);
        doc.text("Detailed credit report", 50, 28);

        // Add some space before the table
        doc.setFontSize(12);
        doc.text("Generated on: " + new Date().toLocaleString(), 50, 36);

        // Add table
        const headers = ["Etat Credit", "Date Emission", "Police", "Nom Assure", "Total Prime Totale", "Montant Reglement", "Reste"];
        const data = paginatedCredits().map(item => [
            item.etat_credit,
            item.date_emission,
            item.police,
            item.nom_assure,
            item.total_prime_totale.toFixed(2), // Format to 2 decimal places
            item.montant_reglement,
            item.reste
        ]);

        doc.autoTable({
            head: [headers],
            body: data,
            startY: 50, // Adjusted to account for logo and title
            theme: 'grid',
            styles: { textColor: [44, 62, 80], font: 'helvetica', fontStyle: 'bold' },
            columnStyles: { 0: { cellWidth: 'auto' } }
        });

        doc.save("credits_list.pdf");
    };

    return (
        <div class="flex w-screen h-screen bg-gray-100 overflow-x-hidden">
            <Navbar />
            <div class="dashboard-product-container w-full h-full pl-16 py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Reglement Credits</h1>
                <div class="bg-white shadow-md w-11/12 rounded-lg p-6 mr-12">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 class="text-xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Credits List</h2>
                        <div class="flex items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.target.value)}
                                onKeyUp={() => filterCredits(searchQuery(), startDate(), endDate())}
                            />
                            <label class="mr-2">Start Date</label>
                            <input
                                type="date"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={startDate()}
                                onInput={(e) => setStartDate(e.target.value)}
                                onChange={() => filterCredits(searchQuery(), startDate(), endDate())}
                            />
                            <label class="mr-2">End Date</label>
                            <input
                                type="date"
                                class="py-2 px-3 border border-gray-300 rounded-lg mr-4"
                                value={endDate()}
                                onInput={(e) => setEndDate(e.target.value)}
                                onChange={() => filterCredits(searchQuery(), startDate(), endDate())}
                            />
                            <button onClick={generatePDF}>Generate PDF</button>
                        </div>
                    </div>

                    <For each={paginatedCredits()}>
                        {(item) => (
                            <div class="grid py-2 px-4 border-b border-gray-200 gap-y-8 grid-cols-1 md:grid-cols-7">
                                <div class="md:hidden font-semibold">Etat Credit</div>
                                <div class="col-span-1 truncate">{item.etat_credit}</div>

                                <div class="md:hidden font-semibold">Date Emission</div>
                                <div class="col-span-1 truncate">{item.date_emission}</div>

                                <div class="md:hidden font-semibold">Police</div>
                                <div class="col-span-1 truncate">{item.police}</div>

                                <div class="md:hidden font-semibold">Nom Assure</div>
                                <div class="col-span-1 truncate">{item.nom_assure}</div>

                                <div class="md:hidden font-semibold">Total Prime Totale</div>
                                <div class="col-span-1 truncate">{item.total_prime_totale}</div>

                                <div class="md:hidden font-semibold">Montant Reglement</div>
                                <div class="col-span-1 truncate">{item.montant_reglement}</div>

                                <div class="md:hidden font-semibold">Reste</div>
                                <div class="col-span-1 truncate">{item.reste}</div>
                            </div>
                        )}
                    </For>

                    <Show when={filteredCredits().length > itemsPerPage}>
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

export default EtatCredit;
