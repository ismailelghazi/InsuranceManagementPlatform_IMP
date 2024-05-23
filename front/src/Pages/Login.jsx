import { createSignal } from 'solid-js';
import { fetcher } from '../Helpers/FetchHelper.js'
import { useNavigate } from '@solidjs/router';
import { store,setStore } from '../Helpers/Stores.js';
function Login() {
    const navigate = useNavigate();
    const [loginCred, setLoginCred] = createSignal();
    const [errorMsg, setErrorMsg] = createSignal('');

    const loggerInfo = (ev) => {
        ev.preventDefault();
        setLoginCred(new FormData(ev.target));

        const data = new URLSearchParams();
        data.append('username', loginCred().get('username'));
        data.append('password', loginCred().get('password'));

        fetcher('/token', true, 'POST', data, {
            "Content-Type": "application/x-www-form-urlencoded"
        }, navigate)
        .then(
            resolved => {
                navigate('/uploadExcel');
            },
            rejected => {
                console.log(rejected, store.errorMessage)
                setErrorMsg(store.errorMessage.message)
            }
        );
    }

    return (
        <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>

            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form class="space-y-6" on:submit={loggerInfo}>
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700">Email address</label>
                            <div class="mt-1">
                                <input id="username" name="username" type="text" autocomplete="username" required 
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <div class="mt-1">
                                <input id="password" name="password" type="password" autocomplete="current-password" required 
                                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
        
                        <div>
                            <span class={errorMsg() ? "text-red-600" : "hidden"}>{errorMsg()}</span>
                            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent 
                                                           rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                                                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                                           focus:ring-blue-500">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
