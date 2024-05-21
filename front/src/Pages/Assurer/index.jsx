import { createSignal, onMount } from "solid-js";
import { fetcher } from '../../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";

function indexAssure(){
    const [assures,setAssures] = createSignal();
    const navigate=useNavigate();
    onMount(async()=>{
       const res =await fetcher('/Assure',true,'GET',null,{},navigate).then((resp)=>setAssures(resp));
        console.log(assures())
    })

    return(
        <>
            <div>ana huna</div>
        </>
    );
}

export default indexAssure;
