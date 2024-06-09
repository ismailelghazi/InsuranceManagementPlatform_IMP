import { useNavigate } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import { createEffect, createSignal } from "solid-js"
import Navbar from "./Components/Navbar";

function EtatCaisse() {
    // get /reglement/

    const [currentPage, setCurrentPage] = createSignal(1);
    const [etat,setEtat]=createSignal(null)
    const navigate = useNavigate();
    const itemsPerPage=10;

    createEffect(()=>{
        if(etat===null){
            fetcher('/reglements/',false,'GET',null,{},navigate)
                .then((res)=>{
                    setEtat(res);
                });
        }
    })
    
    const paginatedProducts = () => {
        const startIndex = (currentPage() - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts().slice(startIndex, endIndex);
    };
    const totalPages = () => Math.ceil(filteredProducts().length / itemsPerPage);


    // create effect to fetch the wanted data 
    // display it in a table 

  return (
      <div>
        <Navbar />
        <h1>Etat Caisse Page</h1>
      </div>
    
  );
}

export default EtatCaisse;
