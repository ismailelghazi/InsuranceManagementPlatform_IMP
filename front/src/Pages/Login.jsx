import { createSignal } from 'solid-js';
import { fetcher, store } from '../Helpers/FetchHelper.js'
import { useNavigate } from '@solidjs/router';

function Login() {
    const navigate=useNavigate();
    const [loginCred,setLoginCred]=createSignal();
    const [errorMsg,setErrorMsg]=createSignal('');
    const loggerInfo =(ev)=>{
        ev.preventDefault();
        setLoginCred(new FormData(ev.target));
        const data = new URLSearchParams();
        data.append('username', loginCred().get('username'));
        data.append('password', loginCred().get('password'));
        fetcher('/token',true,'POST',data,{
         "Content-Type": "application/x-www-form-urlencoded" 
        },navigate).then(
                resolved=>{
                    navigate('/uploadExcel')
                },
                rejected=>{
                    console.log(rejected,store.errorMessage)
                    setErrorMsg(store.errorMessage.message)
                })
    }
    return (
        <div class="w-screen h-screen bg-cyan-100 flex justify-center items-center">
            <div class="login-container w-1/3 bg-blue-300 flex flex-col items-center py-12">
                <h1 class="font-bold text-4xl">Login</h1>
                <form class="flex flex-col w-3/4 gap-4" on:submit={loggerInfo} >
                    <div class="input-group flex flex-col">
                        <label for="username">Email:</label>
                        <input type="text" name="username" />
                    </div>
                    <div class="input-group flex flex-col">
                        <label for="password">Password:</label>
                        <input type="password" name="password"/>
                    </div>
                    <span class={errorMsg==false?"none":"block text-red-700"}>
                        {errorMsg()}
                    </span>
                    <button type="submit" class="w-1/2 py-2 rounded bg-blue-950 text-white mx-auto">Submit</button>
                </form>
            </div>
          </div>
    );
}

export default Login;
