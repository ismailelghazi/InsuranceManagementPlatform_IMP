import { A } from "@solidjs/router";
import { fetcher } from '../Helpers/FetchHelper';
import { createSignal } from "solid-js"
import Navbar from "./Components/Navbar";
import Layout from "../Layout";

function EtatCaisse() {
  return (
   
      <div>
      <Navbar />
        {/* Your etat caisse page content */}
        <h1>Etat Caisse Page</h1>
      </div>
    
  );
}

export default EtatCaisse;