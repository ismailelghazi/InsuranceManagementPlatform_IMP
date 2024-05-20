import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";

export const [store,setStore]=createStore({
    token:null,
    errorMessage:null
})

const errStatuses=[401,404,419]

export async function fetcher(url,method='GET',body=null,headers=null){

    if(store.token==null && document.URL.toString().split('/').at(-1) !== 'login' ){
        const navigate=useNavigate();
        navigate('/login')
    }
    return fetch(url,{
        method:method,
        body:body,
        headers: headers ?? { "Content-Type": "application/json" }
    }).then((response)=>{
        if(errStatuses.includes(response.status)){
            setStore('errorMessage',{status:response.status,message:response.statusText})
            return Promise.reject(store.errorMessage);
        }else if(document.URL.toString().split('/'.at(-1) === 'login')){
            response=response.json().then((response)=>{
                response.token_type=response.token_type.replace(response.token_type[0],response.token_type[0].toUpperCase())
                setStore('token',response)
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
            if (store.token !== null) {
            clearInterval(intervalId);
                resolve(store.token);
            }
        }, 100);
    });
}
