import Navbar from "./Components/Navbar";

function Etat(){

    return(
        <div class="flex w-screen h-screen bg-gray-100 overflow-x-hidden">
            <Navbar/>
            <div class="dashboard-product-container w-full h-full pl-16 py-24">
                <h1 class="text-3xl md:text-5xl text-blue-900 font-bold mb-8">Etat {}</h1>
            </div>
        </div>
    );
}

export default Etat;
