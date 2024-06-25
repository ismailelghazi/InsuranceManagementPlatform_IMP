import { createEffect, createSignal } from "solid-js";
import Navbar from "./Components/Navbar";
import { fetcher } from "../Helpers/FetchHelper";
import { useNavigate } from "@solidjs/router";


function Dashboard(){
    const [total,setTotal]=createSignal(null);
    const navigate=useNavigate();
    createEffect(()=>{
        fetcher('/total',true,'GET',null,null,navigate).then((result)=>setTotal(result)).finally(()=>console.log(total()))
    })

    return (
        
        <div class="flex w-screen h-screen bg-gray-100">
            <Navbar />
            <div class="w-full h-full pt-32 bg-red-100">
                <div class="w-9/12 mx-auto">
                    <div class="flex w-full gap-8 rounded">
                        {total() && (
                            <>
                                <div class="bg-gray-400 w-1/2 rounded">
                                    <span class="text-3xl bold">Total d'Assure</span>
                                    <p>{total().total_assures}</p>
                                </div>
                                <div class="bg-gray-400 w-1/2 rounded">
                                    <span class="text-3xl bold">Total de Produit Issuée</span>
                                    <p>{total().total_products}</p>
                                </div>

                                <div class="bg-gray-400 w-1/2 rounded">
                                    <span class="text-3xl bold">Total Reglements (Credit/Caisse)</span>
                                    <p>{total().total_montant}</p>
                                </div>
                            </>
                       )}
                   </div>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;
