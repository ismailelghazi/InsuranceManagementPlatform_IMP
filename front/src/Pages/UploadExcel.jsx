import { createSignal } from "solid-js";
import { fetcher, tokenChecker } from "../Helpers/FetchHelper";
import { Uploader } from "../Helpers/Uploader";
import { useNavigate } from "@solidjs/router";


function UploadExcel(){
    // if nothing is uploaded,(file is empty or evaluates to null) make the button of dashboard disabled
    tokenChecker();
    const[Uploaded,setUploaded]=createSignal(false);
    const navigate=useNavigate();
    const redirectorAssure=()=>{
        navigate('/assurer')
    }
    const xclUploader=(ev)=>{
        //  watch the file input if it's null or not
        if(ev.target.files[0]!==null){
            const file = ev.target.files.item(0);
            const filetype = file.type;
            const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
            if(!allowedTypes.includes(filetype)){
                alert( "please upload an excel file" )
                return;
            }
            ev.preventDefault()
            let formData=new FormData();
            // listen to the even 
            Uploader(file).then((response)=>{
                console.log(file.name,file)
                formData.append('file',new Blob([response]),file.name) // backend expects UploadFile
                fetcher('/upload',false,'POST',formData,{},navigate).then(()=>setUploaded(true))
                .finally(()=>navigate('/assurer'))
            })
        }
    }
    return(
        <div class="w-screen h-screen bg-cyan-50 flex justify-center items-center">
            <div class="upload-container w-2/5 h-1/5 bg-teal-300 flex flex-col">
                <div class="action-btns flex justify-around items-center w-full h-full">
                        <label for="participation-file" class="py-2 px-4 inline-block text-center my-2 rounded bg-emerald-600 text-white font-bold text-3xl">Choisir un Fichier
                            <input type="file" id="participation-file" name="file" class="hidden" on:change={xclUploader}/>
                        </label>
                        <span class={Uploaded()?"block":"hidden"}>it's uploaded </span>
                        <button class=" bg-white rounded-md text-3xl font-bold py-2 px-4" type="button" on:click={redirectorAssure}>Dashboard</button>
                </div>
            </div>
        </div>
    );
}

export default UploadExcel
