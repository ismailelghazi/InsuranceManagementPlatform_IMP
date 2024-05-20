
export function Uploader(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(ev) {
            resolve(ev.target.result);
        };
        reader.onerror = function(ev) {
            reject(ev);
        };
        reader.readAsArrayBuffer(file);
    });
}
