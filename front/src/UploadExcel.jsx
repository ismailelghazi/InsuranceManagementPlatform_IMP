import { createSignal } from "solid-js";
import { fetcher, tokenChecker } from "./Helpers/FetchHelper";
import { Uploader } from "./Helpers/Uploader";


function UploadExcel(){
    const [isUploaded,setIsUploaded]=createSignal(null);
    const [file,setFile]=createSignal();
    // if nothing is uploaded,(file is empty or evaluates to null) make the button of dashboard disabled
    tokenChecker();

    const xclUploader=(ev)=>{
        ev.preventDefault()
        // listen to the even 
        Uploader(file()).then((file)=>{
            fetcher('/upload','POST',file)
        })
    }
    const fileWatcher=(ev)=>{
        //  watch the file input if it's null or not
        if(isUploaded()===null && ev.target.files[0]!==null){
            const file = ev.target.files.item(0);
            const filetype = file.type;
            const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
            if(!allowedTypes.includes(filetype)){
                alert( "please upload an excel file" )
                return;
            }
            setIsUploaded(true);
            setFile(ev.target.files.item(0))
        }

    }
    return(
        <div class="w-screen h-screen bg-cyan-50 flex justify-center items-center">
            <div class="upload-container w-2/5 h-1/5 bg-teal-300 flex flex-col">
                <div class="action-btns flex justify-around items-center w-full h-full">
                    <form class="action-btns flex justify-around w-full" on:submit={xclUploader}>
                        <label for="participation-file" class="py-2 px-4 inline-block text-center my-2 rounded bg-emerald-600 text-white font-bold text-3xl">Choisir un Fichier
                            <input type="file" id="participation-file" name="file" class="hidden" on:change={fileWatcher}/>
                        </label>
                        <button class=" bg-white px-2 rounded-md text-3xl font-bold" style={`display:${isUploaded()?'block':'none'};`} type="submit">Dashboard</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadExcel
