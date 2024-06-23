import { store,setStore } from "./Stores";
import { BACKEND_URL,BACKEND_URL_API } from '../env.js';

export async function fetcher(url,is_api,method,body=null,headers=null,navigate){

    if(localStorage.getItem('token')===null && document.URL.toString().split('/').at(-1) !== 'login' ){
        navigate('/login')
    }
    const errStatuses=[401,419,422]
    let full_url=is_api?`${BACKEND_URL_API}${url}`:`${BACKEND_URL}${url}`
    return fetch(full_url,{
        method:method,
        body:body,
        headers: body instanceof FormData ? headers : headers ?? { "Content-Type": "application/json" },
        credentials:'include'
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
            if(method==="DELETE"){
                return Promise.resolve(response.text())
            }
            return Promise.resolve(response.json())
        }
    })
}

export async function tokenChecker(navigate){
    if (localStorage.getItem('token') !== null) {
        return;
    }else{
        return navigate('/login')
    }
}
