import { createStore } from "solid-js/store";
import { BACKEND_URL,BACKEND_URL_API } from "../env";

export const [store,setStore]=createStore({
    errorMessage:null
})


export async function fetcher(url,is_api,method='GET',body=null,headers=null,navigate){

    if(localStorage.getItem('token')===null && document.URL.toString().split('/').at(-1) !== 'login' ){
        navigate('/login')
    }
    const errStatuses=[401,419,422]
    let full_url=is_api?`${BACKEND_URL_API}${url}`:`${BACKEND_URL}${url}`
    // i should configure how to setup headers
    
    console.log(method,headers)
    return fetch(full_url,{
        method:method,
        body:body,
        headers: body instanceof FormData? headers : headers ?? { "Content-Type": "application/json" }
    }).then((response)=>{
        if(errStatuses.includes(response.status)){
            setStore('errorMessage',{status:response.status,message:response.statusText})
            return Promise.reject(store.errorMessage);
        }else if(document.URL.toString().split('/').at(-1)=== 'login'){
            response=response.json().then((response)=>{
                response.token_type=response.token_type.replace(response.token_type[0],response.token_type[0].toUpperCase())
                response=`${response['token_type']} ${response['access_token']}`
                localStorage.setItem('token',response)
                return Promise.resolve(store)
            })
        }else{
            return Promise.resolve(response.json())
        }
    })
}

export async function tokenChecker(){
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            if (localStorage.getItem('token') !== null) {
                clearInterval(intervalId);
                resolve(store.token);
            }
        }, 250);
    });
}
