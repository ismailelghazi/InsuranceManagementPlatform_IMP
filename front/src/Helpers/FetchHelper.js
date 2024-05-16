import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";

const [store,setStore]=createStore({
    token:null    
})

async function fetcher(url,method='GET',body){
    // this will: 
    //      check the store if we already have the bearer token, if not redirect to login,
    //      if we do have the token in the store, we fetch the "/${url}" same as backend, with the method & body:data
    if(store.token==null && document.URL.toString().split('/').at(-1) !== 'login' ){
        const navigate=useNavigate();
        navigate('/login')
    }
    fetch(url,{
        method:method,
        body:body
    }).then((response)=>{
        if(response.status==401){
            const navigate=useNavigate();
            navigate('/login');
        }else{
            console.log(response.body)
        }
    });
}
