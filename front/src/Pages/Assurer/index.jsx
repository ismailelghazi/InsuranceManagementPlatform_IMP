import { For, Show, createEffect, createSignal } from "solid-js";
import { fetcher } from '../../Helpers/FetchHelper';
import { useNavigate } from "@solidjs/router";
import Navbar from "../Components/Navbar";

function IndexAssure(){
    const [assures,setAssures] = createSignal(null);
    const [addAssure,setAddAssure] = createSignal(false);
    const navigate=useNavigate();
    createEffect(()=>{
        if(assures()===null){
            fetcher('/Assure',true,'GET',null,{},navigate).then((res)=>setAssures(res)).then(()=>console.log(assures()))
        }
    })
    const deleteAssure=(ev)=>{
        const CIN=ev.target.attributes['data-cin'].nodeValue
        fetcher(`/Assure_delete/${CIN}`,true,'DELETE',null,null,navigate).then(()=>{
            setAssures(assures().filter((el)=>el.Cin!==CIN))
            console.log(assures())
        })
    }
    const addAssureData=(ev)=>{
        ev.preventDefault()
        const formData=Object.fromEntries(new FormData(ev.target))
        const jsonformdata=JSON.stringify(formData)
        fetcher('/Assure_create',true,'POST',jsonformdata).then(()=>{
            console.log(assures())
            setAssures(()=>assures().push(formData))
            setAddAssure(!addAssure())
        })
    }
    return(
        <div>
            <div class="flex w-screen h-screen ">
                <Navbar />
                <div class="dashboard-assurer-container w-full pl-48 py-24">
                    <h1 class="text-5xl text-blue-900 font-bold mb-16">Assure</h1>
                    <div class="table-content-assurer bg-blue-100 h-5/6 w-1/2 border border-gray-400 flex flex-col">
                        <div class="table-head border flex justify-around text-2xl font-semibold">
                            <span class="border py-4 text-center border-b-gray-400 w-full h-full border-r-gray-400">CIN</span>
                            <span class="border py-4 text-center border-b-gray-400 w-full h-full border-r-gray-400">Nom Assurer</span>
                            <span class="border py-4 text-center border-b-gray-400 w-full h-full ">Actions</span>
                        </div>
                        <div class="overflow-y-scroll styled-scrollbar">
                             <For each={assures()} >
                            {(item)=>(
                                <div class="grid grid-cols-3 w-full"> 
                                    <div>{item.Cin}</div>
                                    <div class="pl-2">{item.Assure_name}</div>
                                    <div class="actions text-center">
                                        <i class="fa-regular fa-trash-can" data-cin={item.Cin} on:click={deleteAssure} ></i>
                                    </div>
                                </div>
                            )}
                            </For>
                        </div>
                        
                        <button class="my-2 w-1/2 mx-auto py-2 bg-indigo-500 text-white text-xl border-2 border-sky-100" on:click={()=>setAddAssure(!addAssure())}>Ajouter Assurer</button>
                    </div>
                    <Show when={addAssure()}>
                        <form class="grid my-5 p-2 grid-cols-3 w-1/2 bg-red-100 gap-2" on:submit={addAssureData}>
                            <div class="flex flex-col">
                                <label for="Cin">CIN</label>
                                <input type="text" name="Cin" />
                            </div>
                            <div>
                                <label for="Assure_name">Nom Assure</label>
                                <input type="text" name="Assure_name"/>
                            </div>
                            <button class="bg-blue-300 text-white">Ajouter</button>
                        </form>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default IndexAssure;
