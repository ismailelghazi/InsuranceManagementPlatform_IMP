import { createSignal } from "solid-js";
import { fetcher, tokenChecker } from "../Helpers/FetchHelper";
import { Uploader } from "../Helpers/Uploader";
import { useNavigate } from "@solidjs/router";

function UploadExcel() {
    const [uploaded, setUploaded] = createSignal(false);
    const [optimisticUploaded, setOptimisticUploaded] = createSignal(false);
    const navigate = useNavigate();

    tokenChecker(navigate);
    const redirectorAssure = () => {
        navigate('/assurer');
    };

    const excelUploader = (ev) => {
        if (ev.target.files[0] !== null) {
            const file = ev.target.files.item(0);
            const filetype = file.type;
            const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

            if (!allowedTypes.includes(filetype)) {
                alert("Please upload an Excel file");
                return;
            }

            ev.preventDefault();
            let formData = new FormData();

            // Optimistically set uploaded to true
            setOptimisticUploaded(true);

            Uploader(file).then((response) => {
                formData.append('file', new Blob([response]), file.name);
                fetcher('upload', false, 'POST', formData, {}, navigate)
                    .then(() => setUploaded(true))
                    .catch(() => {
                        // Revert optimistic update on failure
                        setOptimisticUploaded(false);
                        alert("Upload failed, please try again.");
                    })
                    .finally(() => navigate('/assurer'));
            });
        }
    };

    return (
        <div class="min-h-screen bg-blue-900 flex items-center justify-center p-4">
            <div class="upload-container w-full max-w-lg bg-blue-100 rounded-lg shadow-lg p-8 transition-opacity duration-1000 opacity-0 animate-fade-in">
                <div class="flex flex-col items-center space-y-8 transform scale-50 animate-scale-up">
                    <label for="participation-file" class="py-3 px-6 rounded-lg bg-blue-600 text-white font-bold text-2xl cursor-pointer hover:bg-blue-700 transition duration-300 text-center">
                        Choose a File
                        <input type="file" id="participation-file" name="file" class="hidden" onChange={excelUploader} />
                    </label>
                    <span class={optimisticUploaded() ? "block text-green-600 text-lg" : "hidden"}>File uploaded successfully</span>
                    <button class="py-3 px-6 rounded-lg bg-white text-blue-600 font-bold text-2xl shadow-lg hover:bg-blue-200 transition duration-300" type="button" onClick={redirectorAssure}>
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadExcel;
